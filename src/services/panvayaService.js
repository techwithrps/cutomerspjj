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
    localStorage.setItem('spj_panvaya_key', key.trim());
  } catch (e) {}
}

async function requestPanvaya(endpoint, options = {}) {
  const apiKey = getPanvayaApiKey();
  
  // 1. Try Backend Proxy first
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
      return await res.json();
    }
  } catch (err) {
    // Backend offline / not reachable, fallback to direct API
  }

  // 2. Direct Panvaya API fallback
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

// 1. Sea Tracking (POST /track/ocean)
export async function trackOceanContainer({ container, bol, bk, shippingLineScac, includeRouteData = true }) {
  const payload = {
    include_route_data: includeRouteData
  };
  if (container) payload.container = container.trim().toUpperCase();
  if (bol) payload.bol = bol.trim().toUpperCase();
  if (bk) payload.bk = bk.trim().toUpperCase();
  if (shippingLineScac) payload.shipping_line_scac = shippingLineScac.trim().toLowerCase();

  const res = await requestPanvaya('/track/ocean', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return res;
}

// 2. Sailing Schedules Search (POST /schedules/search)
export async function searchSailingSchedules({ origin, destination, date, weeks = 4, carriers }) {
  const payload = {
    origin: origin.trim().toUpperCase(),
    destination: destination.trim().toUpperCase(),
    weeks: Number(weeks) || 4
  };
  if (date) payload.date = date;
  if (carriers && carriers.length > 0) payload.carriers = carriers;

  const res = await requestPanvaya('/schedules/search', {
    method: 'POST',
    body: JSON.stringify(payload)
  });

  return res;
}

// 3. Vessel Live AIS Position (GET /vessels/position?imo=...)
export async function getVesselLivePosition({ imo, mmsi }) {
  const params = new URLSearchParams();
  if (imo) params.set('imo', imo);
  if (mmsi) params.set('mmsi', mmsi);

  return await requestPanvaya(`/vessels/position?${params.toString()}`, {
    method: 'GET'
  });
}

// 4. Vessel Master Details (GET /vessels?imo=...)
export async function getVesselDetails({ imo, mmsi }) {
  const params = new URLSearchParams();
  if (imo) params.set('imo', imo);
  if (mmsi) params.set('mmsi', mmsi);

  return await requestPanvaya(`/vessels?${params.toString()}`, {
    method: 'GET'
  });
}

// 5. Port Congestion Telemetry (GET /port-congestion?locode=...)
export async function getPortCongestion({ locode, country }) {
  const params = new URLSearchParams();
  if (locode) params.set('locode', locode.trim().toUpperCase());
  if (country) params.set('country', country.trim().toUpperCase());

  return await requestPanvaya(`/port-congestion?${params.toString()}`, {
    method: 'GET'
  });
}

// 6. Ocean Carriers List (GET /carriers)
export async function getOceanCarriers() {
  return await requestPanvaya('/carriers', {
    method: 'GET'
  });
}

// 7. Carbon Calculator (POST /carbon/calculate)
export async function calculateCarbonEmission({ origin, destination, weightKg, mode = 'ocean' }) {
  return await requestPanvaya('/carbon/calculate', {
    method: 'POST',
    body: JSON.stringify({ origin, destination, weightKg: Number(weightKg), mode })
  });
}

// 8. Distance & Time (POST /distance-time/calculate)
export async function calculateSeaDistanceTime({ origin, destination, avoidDangerZones = false }) {
  return await requestPanvaya('/distance-time/calculate', {
    method: 'POST',
    body: JSON.stringify({ origin, destination, avoidDangerZones })
  });
}

// 9. Credit Usage & Quota (GET /usage)
export async function getPanvayaUsage() {
  return await requestPanvaya('/usage', {
    method: 'GET'
  });
}

/**
 * Normalizes DCSA Relational Structure into a rich timeline and vessel entity
 */
export function enrichTrackingData(data) {
  if (!data) return null;
  const locationMap = new Map((data.locations || []).map(l => [l.id, l]));
  const transportMap = new Map((data.transports || []).map(t => [t.id, t]));

  const enrichedContainers = (data.containers || []).map(c => ({
    containerNumber: c.number,
    equipment: c.equipment || {},
    status: c.status,
    events: (c.events || []).map(e => ({
      id: e.id,
      code: e.event_code,
      name: e.event_name,
      type: e.event_type,
      description: e.description,
      time: e.event_time,
      isActual: Boolean(e.actual),
      location: locationMap.get(e.location_id),
      transport: transportMap.get(e.transport_id)
    }))
  }));

  const primaryTransport = (data.transports || [])[0] || {};
  const currentPos = data.route_data?.current_position || {};
  const ais = data.route_data?.ais || {};

  return {
    reference: data.reference,
    shippingLine: data.shipping_line,
    status: data.status,
    journey: {
      origin: data.journey?.origin,
      pol: {
        ...data.journey?.pol,
        location: locationMap.get(data.journey?.pol?.location_id)
      },
      pod: {
        ...data.journey?.pod,
        location: locationMap.get(data.journey?.pod?.location_id)
      },
      destination: data.journey?.destination
    },
    transport: primaryTransport,
    vessel: {
      name: primaryTransport.name,
      imo: primaryTransport.imo,
      callSign: primaryTransport.call_sign,
      mmsi: primaryTransport.mmsi,
      flag: primaryTransport.flag,
      voyage: primaryTransport.voyage
    },
    telemetry: {
      position: currentPos.latitude ? { lat: currentPos.latitude, lng: currentPos.longitude } : null,
      speedKnots: ais.speed_knots,
      course: ais.course,
      heading: ais.heading,
      distanceToGoNM: ais.distance_to_go,
      timestamp: currentPos.timestamp,
      calculatedEta: currentPos.calculatedEta
    },
    routeSegments: data.route_data?.segments || [],
    containers: enrichedContainers,
    raw: data
  };
}
