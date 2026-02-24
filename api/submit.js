const { put } = require('@vercel/blob');
const { randomUUID } = require('crypto');

module.exports = async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

  if (req.method === 'OPTIONS') return res.status(200).end();
  if (req.method !== 'POST') return res.status(405).json({ error: 'Method not allowed' });

  try {
    const { physical, psychological, social, spiritual, type, badges } = req.body;

    if (!physical || !psychological || !social || !spiritual || !type) {
      return res.status(400).json({ error: 'Missing required fields' });
    }

    const id = randomUUID();
    const submission = {
      physical: Number(physical),
      psychological: Number(psychological),
      social: Number(social),
      spiritual: Number(spiritual),
      type: String(type),
      badges: Array.isArray(badges) ? badges : [],
      timestamp: new Date().toISOString()
    };

    await put('submissions/' + id + '.json', JSON.stringify(submission), {
      access: 'public',
      contentType: 'application/json',
      addRandomSuffix: false
    });

    return res.status(200).json({ success: true, id });
  } catch (error) {
    console.error('Submit error:', error);
    return res.status(500).json({ error: error.message });
  }
};
