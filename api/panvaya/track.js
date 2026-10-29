export default async function handler(req, res) {
  // CORS Headers
  res.setHeader("Access-Control-Allow-Origin", "*");
  res.setHeader("Access-Control-Allow-Methods", "GET, POST, OPTIONS");
  res.setHeader("Access-Control-Allow-Headers", "Content-Type, X-API-Key");

  if (req.method === "OPTIONS") {
    return res.status(200).end();
  }

  const KEY_POOL = [
    req.headers["x-api-key"],
    process.env.PANVAYA_API_KEY,
    "pv_live_D916qZZfEaB0vHZIr4AhwuCi-mCW1CZz", // Fresh 100 credits
    "pv_live_-Pve3LVsqFSuwHgHjSjn9Yzncz_DlWse"   // Backup 58 credits
  ].filter(Boolean);

  try {
    const body = typeof req.body === "string" ? JSON.parse(req.body) : req.body;
    let lastData = null;
    let lastStatus = 500;

    for (const apiKey of KEY_POOL) {
      try {
        const response = await fetch("https://api.panvaya.com/api/v1/track/ocean", {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "X-API-Key": apiKey
          },
          body: JSON.stringify(body || {})
        });

        lastStatus = response.status;
        lastData = await response.json();

        if (response.ok || (response.status !== 401 && response.status !== 403 && response.status !== 429)) {
          return res.status(response.status).json(lastData);
        }
      } catch (err) {
        console.error("Panvaya track attempt failed:", err.message);
      }
    }

    return res.status(lastStatus).json(lastData || { error: "All Panvaya API keys failed" });
  } catch (err) {
    console.error("Panvaya tracking proxy error:", err);
    return res.status(500).json({ error: "Panvaya API connection error", detail: err.message });
  }
}