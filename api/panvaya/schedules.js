export default async function handler(req, res) {
  // CORS Headers
  res.setHeader('Access-Control-Allow-Origin', '*');
  res.setHeader('Access-Control-Allow-Methods', 'GET, POST, OPTIONS');
  res.setHeader('Access-Control-Allow-Headers', 'Content-Type, X-API-Key');

  if (req.method === 'OPTIONS') {
    return res.status(200).end();
  }

  const apiKey = req.headers['x-api-key'] || process.env.PANVAYA_API_KEY || 'pv_live_0AXCMLfCcPCHAsJMx4uPVmPZEPTH4oS4';

  try {
    const rawBody = typeof req.body === 'string' ? JSON.parse(req.body) : (req.body || {});
    const cleanPayload = {
      origin: String(rawBody.origin || '').trim().toUpperCase(),
      destination: String(rawBody.destination || '').trim().toUpperCase()
    };
    if (rawBody.date) {
      let d = String(rawBody.date).trim();
      if (/^\d{2}\/\d{2}\/\d{4}$/.test(d)) {
        const [m, day, y] = d.split('/');
        d = `${y}-${m}-${day}`;
      }
      cleanPayload.date = d;
    }
    if (rawBody.carriers && Array.isArray(rawBody.carriers) && rawBody.carriers.length > 0) {
      cleanPayload.carriers = rawBody.carriers;
    }

    const response = await fetch('https://api.panvaya.com/api/v1/schedules/search', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(cleanPayload)
    });

    const data = await response.json();
    return res.status(response.status).json(data);
  } catch (err) {
    console.error('Panvaya schedules proxy error:', err);
    return res.status(500).json({ error: 'Panvaya API connection error', detail: err.message });
  }
}
