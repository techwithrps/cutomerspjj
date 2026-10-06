export default async function handler(req, res) {
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = req.headers['x-api-key'] || process.env.PANVAYA_API_KEY || 'pv_live_vl0c1h6iAcCAx9895LIouCDNtmW3BjQJ';

  try {
    const body = typeof req.body === 'string' ? JSON.parse(req.body) : req.body;
    const response = await fetch('https://api.panvaya.com/api/v1/track/ocean', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(body || {})
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    return res.status(500).json({ error: 'Panvaya tracking proxy error', detail: err.message });
  }
}
