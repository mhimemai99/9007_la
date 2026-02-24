import { list, del } from '@vercel/blob';

export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');
  
  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    // Simple auth: require a reset key from query or body
    const key = req.body?.key || req.query?.key;
    const expectedKey = process.env.RESET_KEY || 'clc9007reset';
    
    if (key !== expectedKey) {
      return res.status(401).json({ error: 'Invalid reset key' });
    }

    let deleted = 0;
    let cursor = undefined;
    let hasMore = true;

    while (hasMore) {
      const result = await list({
        prefix: 'submissions/',
        cursor,
        limit: 100
      });

      if (result.blobs.length > 0) {
        await del(result.blobs.map(b => b.url));
        deleted += result.blobs.length;
      }

      cursor = result.cursor;
      hasMore = result.hasMore;
    }

    return res.status(200).json({ success: true, deleted });
  } catch (error) {
    console.error('Reset error:', error);
    return res.status(500).json({ error: 'Failed to reset data' });
  }
}
