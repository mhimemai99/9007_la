import { list } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'GET') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const submissions = [];
    let cursor = undefined;
    let hasMore = true;

    while (hasMore) {
      const result = await list({
        prefix: 'submissions/',
        cursor,
        limit: 100
      });

      for (const blob of result.blobs) {
        try {
          const response = await fetch(blob.url);
          const data = await response.json();
          submissions.push(data);
        } catch (e) {
          console.error('Failed to read blob:', blob.pathname, e);
        }
      }

      cursor = result.cursor;
      hasMore = result.hasMore;
    }

    // Compute aggregates
    const n = submissions.length;
    
    if (n === 0) {
      return res.status(200).json({
        count: 0,
        averages: { physical: 0, psychological: 0, social: 0, spiritual: 0 },
        distributions: { physical: [], psychological: [], social: [], spiritual: [] },
        types: {},
        badges: {},
        submissions: []
      });
    }

    const sum = { physical: 0, psychological: 0, social: 0, spiritual: 0 };
    const distributions = { physical: Array(10).fill(0), psychological: Array(10).fill(0), social: Array(10).fill(0), spiritual: Array(10).fill(0) };
    const types = {};
    const badgeCounts = {};

    for (const s of submissions) {
      for (const dim of ['physical', 'psychological', 'social', 'spiritual']) {
        sum[dim] += s[dim];
        const bucket = Math.max(0, Math.min(9, Math.round(s[dim]) - 1));
        distributions[dim][bucket]++;
      }
      
      types[s.type] = (types[s.type] || 0) + 1;
      
      if (Array.isArray(s.badges)) {
        for (const badge of s.badges) {
          badgeCounts[badge] = (badgeCounts[badge] || 0) + 1;
        }
      }
    }

    const averages = {
      physical: +(sum.physical / n).toFixed(2),
      psychological: +(sum.psychological / n).toFixed(2),
      social: +(sum.social / n).toFixed(2),
      spiritual: +(sum.spiritual / n).toFixed(2)
    };

    return res.status(200).json({
      count: n,
      averages,
      distributions,
      types,
      badges: badgeCounts,
      submissions: submissions.map(s => ({
        physical: s.physical,
        psychological: s.psychological,
        social: s.social,
        spiritual: s.spiritual,
        type: s.type
      }))
    });
  } catch (error) {
    console.error('Data error:', error);
    return res.status(500).json({ error: 'Failed to retrieve data' });
  }
}
