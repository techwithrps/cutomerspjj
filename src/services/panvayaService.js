/**
 * Panvaya Logistics Ocean Tracking & Maritime Intelligence Service
 * Standardized DCSA Track & Trace, Vessel AIS, Schedules, and Port Congestion
 */

const DEFAULT_PANVAYA_KEY = 'pv_live_0AXCMLfCcPCHAsJMx4uPVmPZEPTH4oS4';
const PANVAYA_DIRECT_BASE = 'https://api.panvaya.com/api/v1';

export function getPanvayaApiKey() {
  try {
    return localStorage.getItem('spj_panvaya_key') || DEFAULT_PANVAYA_KEY;
  } catch (e) {
    return DEFAULT_PANVAYA_KEY;
  }
}

export function setPanvayaApiKey(key) {
  try {
    localStorage.setItem('spj_panvaya_key', key?.trim() || DEFAULT_PANVAYA_KEY);
  } catch (e) {}
}

async function requestPanvaya(endpoint, options = {}) {
  const apiKey = getPanvayaApiKey();

  // 1. Try Vercel / Express Backend Proxy FIRST
  try {
    const backendUrl = `/api/panvaya${endpoint}`;
    const res = await fetch(backendUrl, {
      ...options,
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey,
        ...(options.headers || {})
      }
    });

    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    // Fall through to direct API
  }

  // 2. Fallback to Direct Panvaya API
  const directUrl = `${PANVAYA_DIRECT_BASE}${endpoint}`;
  const response = await fetch(directUrl, {
    ...options,
    headers: {
      'Content-Type': 'application/json',
      'X-API-Key': apiKey,
      ...(options.headers || {})
    }
  });

  const data = await response.json();
  if (!response.ok) {
    const errorMsg = data?.errors?.[0]?.detail || data?.errors?.[0]?.title || `Request failed with HTTP ${response.status}`;
    const err = new Error(errorMsg);
    err.code = data?.errors?.[0]?.code || 'API_ERROR';
    err.details = data;
    throw err;
  }

  return data;
}

/**
 * 1. Sea Container & Document Tracking (POST /track/ocean)
 */
export async function trackOceanContainer({ container, bol, bk, scac, includeRoute = true }) {
  const payload = {};
  if (container) payload.container = container.trim().toUpperCase();
  if (bol) payload.bol = bol.trim().toUpperCase();
  if (bk) payload.bk = bk.trim().toUpperCase();
  if (scac) payload.shipping_line_scac = scac.trim().toUpperCase();
  if (includeRoute) payload.include_route_data = true;

  return await requestPanvaya('/track', {
    method: 'POST',
    body: JSON.stringify(payload)
  });
}

/**
 * 2. List Supported Ocean Carriers (GET /carriers)
 */
export async function getOceanCarriers() {
  return await requestPanvaya('/carriers', { method: 'GET' });
}

/**
 * 3. Point-to-Point Sailing Schedules (POST /schedules/search)
 * Directly queries Panvaya REST API for live ocean schedules
 */
export async function searchSailingSchedules({ origin, destination, date, carriers }) {
  const payload = {
    origin: origin.trim().toUpperCase(),
    destination: destination.trim().toUpperCase()
  };
  if (date) {
    let cleanDate = String(date).trim();
    if (/^\d{2}\/\d{2}\/\d{4}$/.test(cleanDate)) {
      const [m, day, y] = cleanDate.split('/');
      cleanDate = `${y}-${m}-${day}`;
    }
    payload.date = cleanDate;
  }
  if (carriers && Array.isArray(carriers) && carriers.length > 0) {
    payload.carriers = carriers;
  }

  // 1. Query Vercel Serverless Function Proxy (/api/panvaya/schedules)
  try {
    const res = await requestPanvaya('/schedules', {
      method: 'POST',
      body: JSON.stringify(payload)
    });

    if (res && res.sailings && Array.isArray(res.sailings)) {
      return {
        sailings: res.sailings,
        origin: res.origin,
        destination: res.destination,
        successfulCarriers: res.successfulCarriers || [],
        savedAt: new Date().toISOString()
      };
    }
  } catch (err) {
    console.error('[Panvaya Proxy Error]:', err.message);
  }

  // 2. Direct Panvaya REST API fallback
  try {
    const apiKey = getPanvayaApiKey();
    const directRes = await fetch(`${PANVAYA_DIRECT_BASE}/schedules/search`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'X-API-Key': apiKey
      },
      body: JSON.stringify(payload)
    });

    if (directRes.ok) {
      const data = await directRes.json();
      if (data && data.sailings && Array.isArray(data.sailings)) {
        return {
          sailings: data.sailings,
          origin: data.origin,
          destination: data.destination,
          successfulCarriers: data.successfulCarriers || [],
          savedAt: new Date().toISOString()
        };
      }
    }
  } catch (directErr) {
    console.error('[Panvaya Direct Error]:', directErr.message);
  }

  // Return empty list if no active sailings found (NO FAKE GENERATOR)
  return {
    sailings: [],
    origin,
    destination,
    error: 'No active sailings found for this route on Panvaya network.'
  };
}

/**
 * 4. Stored Vessel Details (GET /vessels)
 */
export async function getVesselDetails({ imo, mmsi }) {
  const query = new URLSearchParams();
  if (imo) query.append('imo', imo);
  if (mmsi) query.append('mmsi', mmsi);

  return await requestPanvaya(`/vessels?${query.toString()}`, { method: 'GET' });
}

/**
 * 5. Latest Vessel Position (GET /vessels/position)
 */
export async function getVesselLivePosition({ imo, mmsi }) {
  const query = new URLSearchParams();
  if (imo) query.append('imo', imo);
  if (mmsi) query.append('mmsi', mmsi);

  return await requestPanvaya(`/vessels/position?${query.toString()}`, { method: 'GET' });
}

/**
 * 6. Real-time Port Congestion Telemetry (GET /port-congestion)
 */
export async function getPortCongestion({ locode, country }) {
  const query = new URLSearchParams();
  if (locode) query.append('locode', locode);
  if (country) query.append('country', country);

  return await requestPanvaya(`/port-congestion?${query.toString()}`, { method: 'GET' });
}

/**
 * 7. Freight Carbon Calculator (POST /carbon/calculate)
 */
export async function calculateCarbonEmission({ origin, destination, weightKg, mode = 'ocean' }) {
  return await requestPanvaya('/carbon', {
    method: 'POST',
    body: JSON.stringify({ origin, destination, weightKg: Number(weightKg), mode })
  });
}

/**
 * 8. API Credit Usage & Balance (GET /usage)
 */
export async function getPanvayaUsage() {
  return await requestPanvaya('/usage', { method: 'GET' });
}

/**
 * 9. Live Public Location Autocomplete (GET https://api.panvaya.com/api/public/locations/search)
 */
export async function searchPortLocations(query, type = 'port', limit = 30) {
  if (!query || !query.trim()) return [];
  try {
    const url = `https://api.panvaya.com/api/public/locations/search?q=${encodeURIComponent(query.trim())}&type=${type}&limit=${limit}`;
    const res = await fetch(url);
    if (res.ok) {
      const data = await res.json();
      return data;
    }
  } catch (err) {
    console.warn('Live Panvaya Location Search error:', err);
  }
  return [];
}

/**
 * Helper to normalize and enrich relational ocean tracking payload
 */
export function enrichTrackingData(data) {
  if (!data || !data.containers) return [];

  const locationMap = new Map((data.locations || []).map(l => [l.id, l]));
  const transportMap = new Map((data.transports || []).map(t => [t.id, t]));

  return data.containers.map(c => ({
    containerNumber: c.number,
    equipment: c.equipment,
    status: c.status,
    events: (c.events || []).map(e => ({
      id: e.id,
      code: e.event_code,
      name: e.event_name,
      time: e.event_time,
      isActual: e.actual,
      description: e.description,
      location: locationMap.get(e.location_id) || null,
      transport: transportMap.get(e.transport_id) || null
    }))
  }));
}
