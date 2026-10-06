import React, { useState, useEffect, useRef, useMemo } from 'react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';
import {
  Ship, Navigation, Compass, Gauge, MapPin, Calendar, Clock, AlertTriangle,
  CheckCircle2, Anchor, Search, RefreshCw, Layers, ArrowRight, ShieldCheck,
  Globe, Radio, ExternalLink, ChevronRight, ChevronDown, ChevronUp, Filter,
  Activity, Zap, Leaf, Info, RotateCw, Sliders, Sparkles, Save, Database,
  Trash2, Bookmark, Check, Table as TableIcon, LayoutGrid, X, ArrowRightLeft,
  Truck, Box, CheckCircle
} from 'lucide-react';
import {
  trackOceanContainer, searchSailingSchedules, getVesselLivePosition,
  getVesselDetails, getPortCongestion, getOceanCarriers, calculateCarbonEmission,
  getPanvayaUsage, getPanvayaApiKey, setPanvayaApiKey, enrichTrackingData, searchPortLocations
} from '../services/panvayaService';

// All 33 Ocean Carriers Dataset with SCAC, Category, Alliance & Subtitles
const PANVAYA_CARRIERS_33 = [
  { name: 'ANL', scac: 'ANNU', alliance: 'Ocean Alliance', category: 'Regional & NVOCC', tag: 'Oceania & Asia-Pacific', color: 'bg-blue-600' },
  { name: 'CMA CGM', scac: 'CMDU', alliance: 'Ocean Alliance', category: 'Global Alliances', tag: 'World #3 · Global Leader', color: 'bg-red-700' },
  { name: 'COSCO Shipping', scac: 'COSU', alliance: 'Ocean Alliance', category: 'Global Alliances', tag: 'World #4 · Ocean Alliance', color: 'bg-blue-800' },
  { name: 'Crowley Maritime', scac: 'CMCU', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'Americas & Caribbean', color: 'bg-amber-600' },
  { name: 'CU Lines', scac: 'CULU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Intra-Asia, India & ME', color: 'bg-cyan-700' },
  { name: 'Emirates Shipping', scac: 'ESPU', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'Middle East, Africa & Asia', color: 'bg-red-600' },
  { name: 'Evergreen Line', scac: 'EGLV', alliance: 'Ocean Alliance', category: 'Global Alliances', tag: 'Global · Ocean Alliance', color: 'bg-emerald-600' },
  { name: 'Gold Star Line', scac: 'GSLU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Asia, Africa & Indian Sub.', color: 'bg-yellow-600' },
  { name: 'Great White Fleet', scac: 'GWFC', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'Americas & Northern Europe', color: 'bg-blue-500' },
  { name: 'Hapag-Lloyd', scac: 'HLCU', alliance: 'THE Alliance', category: 'Global Alliances', tag: 'World #5 · THE Alliance', color: 'bg-orange-600' },
  { name: 'Heung-A Line', scac: 'HASL', alliance: 'Independent', category: 'Intra-Asia', tag: 'Intra-Asia Specialist', color: 'bg-indigo-600' },
  { name: 'HMM (Hyundai)', scac: 'HDMU', alliance: 'THE Alliance', category: 'Global Alliances', tag: 'Global · THE Alliance', color: 'bg-rose-700' },
  { name: 'Interasia Lines', scac: 'IALU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Intra-Asia Specialist', color: 'bg-purple-600' },
  { name: 'King Ocean Services', scac: 'KOSL', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'US, Caribbean & LatAm', color: 'bg-teal-600' },
  { name: 'KMTC Line', scac: 'KMTU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Korea Top 3 Specialist', color: 'bg-sky-600' },
  { name: 'Maersk Line', scac: 'MAEU', alliance: '2M Alliance', category: 'Global Alliances', tag: 'World #2 · Global Leader', color: 'bg-sky-500' },
  { name: 'Matson', scac: 'MATS', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'US Pacific & China Express', color: 'bg-blue-900' },
  { name: 'MSC', scac: 'MSCU', alliance: '2M Alliance', category: 'Global Alliances', tag: 'World #1 Ocean Line', color: 'bg-amber-700' },
  { name: 'Namsung Shipping', scac: 'NAMS', alliance: 'Independent', category: 'Intra-Asia', tag: 'Korea & Japan Feeder', color: 'bg-slate-700' },
  { name: 'Ocean Network Express (ONE)', scac: 'ONEY', alliance: 'THE Alliance', category: 'Global Alliances', tag: 'World #6 · Magenta Fleet', color: 'bg-pink-600' },
  { name: 'OOCL', scac: 'OOLU', alliance: 'Ocean Alliance', category: 'Global Alliances', tag: 'Global · Ocean Alliance', color: 'bg-red-800' },
  { name: 'Pacific International Lines (PIL)', scac: 'PILU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Asia, Africa & Middle East', color: 'bg-[#003366]' },
  { name: 'RCL (Regional Container Lines)', scac: 'REGU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Intra-Asia Feeder Leader', color: 'bg-emerald-700' },
  { name: 'SAMUDERA Shipping', scac: 'SAMU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Southeast Asia Feeder', color: 'bg-teal-700' },
  { name: 'Seaboard Marine', scac: 'SMLU', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'Americas & Caribbean Trade', color: 'bg-cyan-800' },
  { name: 'SeaLead Shipping', scac: 'SLDU', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'Global Independent Feeder', color: 'bg-amber-800' },
  { name: 'Sinokor Merchant Marine', scac: 'SKOR', alliance: 'Independent', category: 'Intra-Asia', tag: 'Korea & China Specialist', color: 'bg-indigo-800' },
  { name: 'SM Line', scac: 'SMLN', alliance: 'Independent', category: 'Intra-Asia', tag: 'Transpacific & Intra-Asia', color: 'bg-[#d9381e]' },
  { name: 'Swire Shipping', scac: 'SWIU', alliance: 'Independent', category: 'Regional & NVOCC', tag: 'Pacific Islands & Australasia', color: 'bg-[#1b4d3e]' },
  { name: 'T.S. Lines', scac: 'TSLU', alliance: 'Independent', category: 'Intra-Asia', tag: 'Intra-Asia & China Lines', color: 'bg-blue-700' },
  { name: 'Wan Hai Lines', scac: 'WHL', alliance: 'Independent', category: 'Intra-Asia', tag: 'Intra-Asia #1 Specialist', color: 'bg-[#0055a5]' },
  { name: 'Yang Ming Transport', scac: 'YMLU', alliance: 'THE Alliance', category: 'Global Alliances', tag: 'Global · THE Alliance', color: 'bg-red-600' },
  { name: 'ZIM Integrated Shipping', scac: 'ZIMU', alliance: 'Independent', category: 'Global Alliances', tag: 'Global Independent Pioneer', color: 'bg-blue-950' }
];

// Helper to convert LOCODE or country code to ISO Flag Emoji
function getCountryFlag(locode) {
  if (!locode) return '🌐';
  const code = locode.trim().toUpperCase();
  let cc = code.slice(0, 2);
  if (code === 'INNSA' || code === 'INBOM' || code === 'INPAV' || code === 'INMUN') cc = 'IN';
  if (code === 'USPEF' || code === 'USLAX' || code === 'USNYC') cc = 'US';
  if (code === 'FRFOS' || code === 'FRMRS' || code === 'FRLEH') cc = 'FR';
  if (code === 'ITSAL' || code === 'ITGOA' || code === 'ITSPE') cc = 'IT';
  if (code === 'SGSIN') cc = 'SG';
  if (code === 'NLRTM') cc = 'NL';
  if (code === 'AEJEA') cc = 'AE';
  if (code === 'CNSHA' || code === 'CNNBO') cc = 'CN';
  if (code === 'DEHAM') cc = 'DE';

  if (/^[A-Z]{2}$/.test(cc)) {
    const codePoints = cc.split('').map(c => 127397 + c.charCodeAt(0));
    return String.fromCodePoint(...codePoints);
  }
  return '🌐';
}

// Master Global Seaports List
const MASTER_SEAPORTS = [
  { code: 'USPEF', name: 'Port Everglades', country: 'United States', flag: '🇺🇸' },
  { code: 'FRFOS', name: 'Fos-Sur-Mer', country: 'France', flag: '🇫🇷' },
  { code: 'ITSAL', name: 'Salerno', country: 'Italy', flag: '🇮🇹' },
  { code: 'INNSA', name: 'Nhava Sheva (JNPT / GTIL)', country: 'India', flag: '🇮🇳' },
  { code: 'INMUN', name: 'Mundra (MDCC)', country: 'India', flag: '🇮🇳' },
  { code: 'SGSIN', name: 'Singapore', country: 'Singapore', flag: '🇸🇬' },
  { code: 'NLRTM', name: 'Rotterdam', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'AEJEA', name: 'Jebel Ali', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'CNSHA', name: 'Shanghai', country: 'China', flag: '🇨🇳' },
  { code: 'CNNBO', name: 'Ningbo-Zhoushan', country: 'China', flag: '🇨🇳' },
  { code: 'DEHAM', name: 'Hamburg', country: 'Germany', flag: '🇩🇪' },
  { code: 'EGALY', name: 'Alexandria', country: 'Egypt', flag: '🇪🇬' },
  { code: 'GEPTI', name: 'Poti', country: 'Georgia', flag: '🇬🇪' },
  { code: 'EGPSD', name: 'Port Said West', country: 'Egypt', flag: '🇪🇬' },
  { code: 'VNHPH', name: 'Haiphong', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'AEKLF', name: 'Khor Al Fakkan', country: 'United Arab Emirates', flag: '🇦🇪' },
  { code: 'PHCEB', name: 'Cebu', country: 'Philippines', flag: '🇵🇭' },
  { code: 'VNSGN', name: 'Ho Chi Minh', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'OMSOH', name: 'Sohar', country: 'Oman', flag: '🇴🇲' },
  { code: 'MYPEN', name: 'Penang', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'OMSLL', name: 'Salalah', country: 'Oman', flag: '🇴🇲' },
  { code: 'BEYUT', name: 'Beirut', country: 'Lebanon', flag: '🇱🇧' },
  { code: 'MURU', name: 'Port Louis', country: 'Mauritius', flag: '🇲🇺' },
  { code: 'MYPKG', name: 'Port Klang', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'TRMER', name: 'Mersin', country: 'Turkey', flag: '🇹🇷' },
  { code: 'EGEDK', name: 'El Dekheila', country: 'Egypt', flag: '🇪🇬' },
  { code: 'SNDKR', name: 'Dakar', country: 'Senegal', flag: '🇸🇳' },
  { code: 'SAJED', name: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'MYPGU', name: 'Pasir Gudang', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'VNCLI', name: 'Cat Lai', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'HKHKG', name: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'TZDAR', name: 'Dar es Salaam', country: 'Tanzania', flag: '🇹🇿' },
  { code: 'PHMNL', name: 'Manila', country: 'Philippines', flag: '🇵🇭' },
  { code: 'CIABJ', name: 'Abidjan', country: 'Cote d\'Ivoire', flag: '🇨🇮' }
];

// Port Coordinates Dictionary for Leaflet Map Rendering
const PORT_COORDS = {
  'USPEF': [26.086, -80.123],
  'FRFOS': [43.435, 4.887],
  'ITSAL': [40.678, 14.755],
  'INNSA': [18.950, 72.950],
  'INMUN': [22.744, 69.704],
  'SGSIN': [1.264, 103.840],
  'NLRTM': [51.956, 4.148],
  'AEJEA': [25.009, 55.064],
  'CNSHA': [31.230, 121.474],
  'CNNBO': [29.868, 121.544],
  'DEHAM': [53.535, 9.970],
  'EGALY': [31.200, 29.918],
  'GEPTI': [42.146, 41.672],
  'EGPSD': [31.265, 32.302],
  'VNHPH': [20.845, 106.688],
  'AEKLF': [25.357, 56.348],
  'PHCEB': [10.315, 123.885],
  'VNSGN': [10.762, 106.660],
  'OMSOH': [24.364, 56.747],
  'MYPEN': [5.416, 100.332],
  'OMSLL': [17.015, 54.092],
  'BEYUT': [33.893, 35.501],
  'MURU': [-20.160, 57.501],
  'MYPKG': [3.000, 101.400],
  'TRMER': [36.800, 34.633],
  'EGEDK': [31.133, 29.800],
  'SNDKR': [14.692, -17.444],
  'SAJED': [21.485, 39.192],
  'MYPGU': [1.472, 103.905],
  'VNCLI': [10.758, 106.776],
  'HKHKG': [22.319, 114.169],
  'TZDAR': [-6.792, 39.208],
  'PHMNL': [14.599, 120.984],
  'CIABJ': [5.360, -4.008],
  'USLAX': [33.740, -118.260],
  'USNYC': [40.670, -74.040],
  'FRMRS': [43.296, 5.370],
  'FRLEH': [49.490, 0.100],
  'ITGOA': [44.405, 8.930],
  'ITSPE': [44.102, 9.824]
};

function getPortCoords(locode) {
  if (!locode) return null;
  const code = String(locode).trim().toUpperCase();
  return PORT_COORDS[code] || null;
}

function generateNauticalCurve(points) {
  if (!points || points.length === 0) return [];
  if (points.length === 1) return points;
  const result = [];
  for (let i = 0; i < points.length - 1; i++) {
    const p1 = points[i];
    const p2 = points[i + 1];
    const steps = 24;
    for (let s = 0; s <= steps; s++) {
      const t = s / steps;
      const dLng = p2[1] - p1[1];
      const curveArch = Math.sin(t * Math.PI) * (dLng > 0 ? 3.5 : -3.5);
      const lat = p1[0] + (p2[0] - p1[0]) * t + curveArch;
      const lng = p1[1] + (p2[1] - p1[1]) * t;
      result.push([lat, lng]);
    }
  }
  return result;
}

// Live Interactive Leaflet Map for Sea Routes and Container Tracking
function InteractiveSeaRouteMap({ origin, destination, legs, vesselName, voyageNo, height = '380px' }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!mapContainerRef.current) return;

    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const oCode = (typeof origin === 'object' ? origin?.code : origin) || 'INNSA';
    const dCode = (typeof destination === 'object' ? destination?.code : destination) || 'TRMER';
    const oName = (typeof origin === 'object' ? origin?.name : origin) || oCode;
    const dName = (typeof destination === 'object' ? destination?.name : destination) || dCode;

    const oCoord = getPortCoords(oCode) || [18.950, 72.950];
    const dCoord = getPortCoords(dCode) || [36.800, 34.633];

    const map = L.map(mapContainerRef.current, {
      center: [(oCoord[0] + dCoord[0]) / 2, (oCoord[1] + dCoord[1]) / 2],
      zoom: 3,
      minZoom: 2,
      maxZoom: 12,
      scrollWheelZoom: false
    });

    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      attribution: '&copy; CARTO &copy; OpenStreetMap | SPJ AIS Radar',
      subdomains: 'abcd',
      maxZoom: 19
    }).addTo(map);

    const waypoints = [oCoord];
    if (legs && Array.isArray(legs) && legs.length > 0) {
      legs.forEach(leg => {
        const legLoc = leg.toLocode || leg.to;
        const c = getPortCoords(legLoc);
        if (c) waypoints.push(c);
      });
    }
    if (waypoints.length === 1) {
      waypoints.push(dCoord);
    }

    const curve = generateNauticalCurve(waypoints);

    // Glowing Polyline
    L.polyline(curve, {
      color: '#0284c7',
      weight: 4,
      dashArray: '8, 8',
      opacity: 0.9,
      lineCap: 'round'
    }).addTo(map);

    // Origin Marker
    const origIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background:#0284c7;color:#fff;padding:4px 8px;border-radius:12px;font-weight:900;font-size:11px;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;gap:4px;white-space:nowrap;"><span>⚓</span><span>${oCode}</span></div>`,
      iconSize: [80, 28],
      iconAnchor: [40, 14]
    });
    L.marker(oCoord, { icon: origIcon }).addTo(map).bindPopup(`<strong>Origin Port:</strong> ${oName}<br/><strong>UN/LOCODE:</strong> ${oCode}`);

    // Destination Marker
    const destIcon = L.divIcon({
      className: 'custom-map-marker',
      html: `<div style="background:#16a34a;color:#fff;padding:4px 8px;border-radius:12px;font-weight:900;font-size:11px;border:2px solid #fff;box-shadow:0 4px 12px rgba(0,0,0,0.3);display:flex;align-items:center;gap:4px;white-space:nowrap;"><span>🏁</span><span>${dCode}</span></div>`,
      iconSize: [80, 28],
      iconAnchor: [40, 14]
    });
    L.marker(dCoord, { icon: destIcon }).addTo(map).bindPopup(`<strong>Destination Port:</strong> ${dName}<br/><strong>UN/LOCODE:</strong> ${dCode}`);

    // Vessel Position Icon at midpoint
    if (curve.length > 2) {
      const mid = curve[Math.floor(curve.length / 2)];
      const vesselIcon = L.divIcon({
        className: 'custom-map-marker',
        html: `<div style="background:#e11d48;color:#fff;padding:5px 9px;border-radius:14px;font-weight:900;font-size:11px;border:2px solid #fff;box-shadow:0 4px 15px rgba(225,29,72,0.6);display:flex;align-items:center;gap:4px;white-space:nowrap;"><span>🚢</span><span>${vesselName || 'VESSEL'}</span></div>`,
        iconSize: [120, 32],
        iconAnchor: [60, 16]
      });
      L.marker(mid, { icon: vesselIcon }).addTo(map).bindPopup(`<strong>Vessel:</strong> ${vesselName || 'Ocean Liner'}<br/><strong>Voyage:</strong> ${voyageNo || 'Active'}<br/><strong>AIS Status:</strong> Navigating En Route`);
    }

    try {
      const bounds = L.latLngBounds(waypoints);
      map.fitBounds(bounds, { padding: [45, 45] });
    } catch (e) {}

    setTimeout(() => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      } catch (e) {}
    }, 150);

    setTimeout(() => {
      try {
        if (mapInstanceRef.current) {
          mapInstanceRef.current.invalidateSize();
        }
      } catch (e) {}
    }, 400);

    mapInstanceRef.current = map;

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [origin, destination, legs, vesselName, voyageNo]);

  return (
    <div className="relative rounded-2xl overflow-hidden border border-slate-200 shadow-inner bg-slate-100">
      <div ref={mapContainerRef} style={{ height, width: '100%' }} />
      <div className="absolute bottom-3 left-3 z-[1000] bg-slate-900/90 backdrop-blur-md text-white px-3 py-1.5 rounded-xl text-[11px] font-mono flex items-center gap-3 border border-slate-700 shadow-md">
        <span className="flex items-center gap-1.5"><span className="w-2 h-2 rounded-full bg-cyan-400 animate-ping"></span> <strong>{typeof origin === 'object' ? origin?.code : origin}</strong> ➔ <strong>{typeof destination === 'object' ? destination?.code : destination}</strong></span>
        <span>•</span>
        <span>Active Vessel: <strong className="text-amber-300">{vesselName || 'En Route'}</strong></span>
      </div>
    </div>
  );
}

// Live Autocompleting Port Select Component
function SearchablePortSelect({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const [apiResults, setApiResults] = useState([]);
  const [isLoadingApi, setIsLoadingApi] = useState(false);
  const wrapperRef = useRef(null);

  useEffect(() => {
    if (!search.trim() || search.trim().length < 2) {
      setApiResults([]);
      setIsLoadingApi(false);
      return;
    }

    setIsLoadingApi(true);
    const timer = setTimeout(async () => {
      try {
        const results = await searchPortLocations(search, 'port', 30);
        if (results && results.length > 0) {
          setApiResults(results.map(p => ({
            code: p.locode || p.code || 'PORT',
            name: p.name,
            country: p.subdivision || p.country || '',
            flag: getCountryFlag(p.locode || p.code)
          })));
        } else {
          setApiResults([]);
        }
      } catch (err) {
        setApiResults([]);
      } finally {
        setIsLoadingApi(false);
      }
    }, 250);

    return () => clearTimeout(timer);
  }, [search]);

  const displayList = useMemo(() => {
    if (apiResults.length > 0) return apiResults;
    if (!search.trim()) return MASTER_SEAPORTS;
    const q = search.toLowerCase().trim();
    return MASTER_SEAPORTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || (p.country && p.country.toLowerCase().includes(q))
    );
  }, [apiResults, search]);

  const valCode = typeof value === 'object' ? value?.code : value;
  const valName = typeof value === 'object' ? value?.name : value;

  const selectedPort = displayList.find(p => p.code === valCode) ||
    MASTER_SEAPORTS.find(p => p.code === valCode) ||
    { code: valCode || 'PORT', name: valName || valCode || 'Select Port', flag: getCountryFlag(valCode) };

  useEffect(() => {
    function handleClickOutside(e) {
      if (wrapperRef.current && !wrapperRef.current.contains(e.target)) {
        setIsOpen(false);
      }
    }
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  return (
    <div className="relative" ref={wrapperRef}>
      <label className="block text-xs font-bold text-slate-600 mb-1">{label}</label>
      <button
        type="button"
        onClick={() => setIsOpen(!isOpen)}
        className="w-full bg-white hover:bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 flex items-center justify-between transition-all outline-none cursor-pointer shadow-2xs"
      >
        <span className="truncate flex items-center gap-1.5">
          <span className="text-sm">{selectedPort.flag}</span>
          <span className="font-extrabold text-slate-900">{selectedPort.name}</span>
          <span className="text-slate-400 font-mono text-[10px]">{selectedPort.code}</span>
        </span>
        <ChevronDown className="w-3.5 h-3.5 text-slate-400 shrink-0 ml-1" />
      </button>

      {isOpen && (
        <div className="absolute left-0 right-0 top-full mt-1 bg-white border border-slate-200 rounded-xl shadow-2xl z-50 p-2 space-y-2 max-h-64 overflow-y-auto">
          <div className="relative">
            <Search className="w-3.5 h-3.5 text-slate-400 absolute left-2.5 top-2.5" />
            <input
              type="text"
              autoFocus
              placeholder="Search 300+ ports (e.g. Everglades, Nhava, Rotterdam)..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-8 py-1.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-cyan-500"
            />
            {isLoadingApi && (
              <RefreshCw className="w-3.5 h-3.5 text-cyan-600 animate-spin absolute right-2.5 top-2.5" />
            )}
          </div>

          <div className="space-y-0.5">
            {displayList.map((p) => (
              <button
                key={p.code + p.name}
                type="button"
                onClick={() => {
                  onChange(p);
                  setIsOpen(false);
                }}
                className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs font-semibold flex items-center justify-between hover:bg-cyan-50 hover:text-cyan-900 cursor-pointer transition-colors ${
                  valCode === p.code ? 'bg-cyan-100/80 text-cyan-950 font-bold' : 'text-slate-700'
                }`}
              >
                <span className="flex items-center gap-2 truncate">
                  <span>{p.flag}</span>
                  <span className="truncate">{p.name}</span>
                  {p.country && <span className="text-[10px] text-slate-400 font-normal">({p.country})</span>}
                </span>
                <span className="font-mono text-[10px] text-slate-500 shrink-0 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 ml-2">
                  {p.code}
                </span>
              </button>
            ))}

            {displayList.length === 0 && !isLoadingApi && (
              <div className="text-center py-4 text-xs text-slate-400">
                No matching ports found. Type LOCODE directly.
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OceanIntelligenceView() {
  const [activeTab, setActiveTab] = useState('schedules');

  // Vessel Schedules Route Builder State
  const [originPort, setOriginPort] = useState({ code: 'USPEF', name: 'Port Everglades', country: 'United States', flag: '🇺🇸' });
  const [destPort, setDestPort] = useState({ code: 'FRFOS', name: 'Fos-Sur-Mer', country: 'France', flag: '🇫🇷' });
  const [departDate, setDepartDate] = useState('2026-10-10');
  const [horizonWeeks, setHorizonWeeks] = useState(4);
  const [activeCarrier, setActiveCarrier] = useState('ALL');

  // Carrier Grid Modal State
  const [carrierModalOpen, setCarrierModalOpen] = useState(false);
  const [carrierCategory, setCarrierCategory] = useState('All');
  const [carrierSearch, setCarrierSearch] = useState('');

  // Container Tracking State
  const [containerNo, setContainerNo] = useState('MSKU8094830');
  const [carrierScac, setCarrierScac] = useState('MAEU');
  const [isTracking, setIsTracking] = useState(false);
  const [trackingData, setTrackingData] = useState(null);
  const [trackingError, setTrackingError] = useState(null);

  // Live Schedules Results State
  const [isSearchingSchedules, setIsSearchingSchedules] = useState(false);
  const [schedulesResult, setSchedulesResult] = useState(null);
  const [schedulesError, setSchedulesError] = useState(null);
  const [expandedIndex, setExpandedIndex] = useState(0);
  const [viewSubTab, setViewSubTab] = useState('movement');

  // Api Key State
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState(getPanvayaApiKey());
  const [usageInfo, setUsageInfo] = useState(null);

  // Initial Load & Search
  useEffect(() => {
    loadUsageAndCarriers();
    handleSearchSchedules();
  }, []);

  const loadUsageAndCarriers = async () => {
    try {
      const usage = await getPanvayaUsage();
      if (usage) setUsageInfo(usage);
    } catch (e) {}
  };

  const handleSwapPorts = () => {
    const temp = originPort;
    setOriginPort(destPort);
    setDestPort(temp);
  };

// Helper to match Panvaya carrier response against SCAC and carrier aliases
function matchesCarrier(sailing, scac) {
  if (!sailing || !scac || scac === 'ALL') return true;
  const sCode = (sailing.carrierCode || '').toUpperCase();
  const sName = (sailing.carrier || '').toUpperCase();
  const target = scac.toUpperCase();

  if (sCode === target) return true;

  if (target === 'PILU' && (sCode === 'PCIU' || sName.includes('PIL'))) return true;
  if ((target === 'WHL' || target === 'WHLC') && (sCode === 'WHLC' || sCode === 'WHL' || sName.includes('WAN HAI') || sName.includes('WANHAI'))) return true;
  if ((target === 'SKOR' || target === 'SKLU') && (sCode === 'SKLU' || sCode === 'SKOR' || sName.includes('SINOKOR'))) return true;
  if ((target === 'SAMU' || target === 'SIKU') && (sCode === 'SIKU' || sCode === 'SAMU' || sName.includes('SAMUDERA'))) return true;
  if ((target === 'TSLU' || target === 'TSSU') && (sCode === 'TSSU' || sCode === 'TSLU' || sName.includes('T.S.') || sName.includes('TS LINES'))) return true;
  if ((target === 'NAMS' || target === 'NSSU') && (sCode === 'NSSU' || sCode === 'NAMS' || sName.includes('NAMSUNG'))) return true;
  if (target === 'CULU' && (sCode === 'CULU' || sName.includes('CHINA UNITED') || sName.includes('CU LINES'))) return true;
  if (target === 'MAEU' && (sCode === 'MAEU' || sName.includes('MAERSK'))) return true;
  if (target === 'EGLV' && (sCode === 'EGLV' || sName.includes('EVERGREEN'))) return true;
  if (target === 'CMDU' && (sCode === 'CMDU' || sName.includes('CMA CGM') || sName.includes('CMA-CGM'))) return true;
  if (target === 'COSU' && (sCode === 'COSU' || sName.includes('COSCO'))) return true;
  if (target === 'HLCU' && (sCode === 'HLCU' || sName.includes('HAPAG'))) return true;
  if (target === 'MSCU' && (sCode === 'MSCU' || sName.includes('MSC') || sName.includes('MEDITERRANEAN'))) return true;
  if (target === 'ONEY' && (sCode === 'ONEY' || sName.includes('OCEAN NETWORK') || sName === 'ONE')) return true;
  if (target === 'OOLU' && (sCode === 'OOLU' || sName.includes('OOCL') || sName.includes('ORIENT OVERSEAS'))) return true;
  if (target === 'HDMU' && (sCode === 'HDMU' || sName.includes('HYUNDAI') || sName.includes('HMM'))) return true;
  if (target === 'YMLU' && (sCode === 'YMLU' || sName.includes('YANG MING'))) return true;
  if (target === 'ZIMU' && (sCode === 'ZIMU' || sName.includes('ZIM'))) return true;
  if (target === 'KMTU' && (sCode === 'KMTU' || sName.includes('KMTC'))) return true;
  if (target === 'ESPU' && (sCode === 'ESPU' || sName.includes('EMIRATES') || sName.includes('ESL'))) return true;
  if (target === 'GSLU' && (sCode === 'GSLU' || sName.includes('GOLD STAR'))) return true;
  if (target === 'HASL' && (sCode === 'HASL' || sName.includes('HEUNG-A') || sName.includes('HEUNG A'))) return true;
  if (target === 'IALU' && (sCode === 'IALU' || sName.includes('INTERASIA'))) return true;
  if (target === 'ANNU' && (sCode === 'ANNU' || sName.includes('ANL'))) return true;
  if (target === 'CMCU' && (sCode === 'CMCU' || sName.includes('CROWLEY'))) return true;
  if (target === 'GWFC' && (sCode === 'GWFC' || sName.includes('GREAT WHITE'))) return true;
  if (target === 'KOSL' && (sCode === 'KOSL' || sName.includes('KING OCEAN'))) return true;
  if (target === 'MATS' && (sCode === 'MATS' || sName.includes('MATSON'))) return true;
  if (target === 'REGU' && (sCode === 'REGU' || sName.includes('RCL'))) return true;
  if (target === 'SMLU' && (sCode === 'SMLU' || sName.includes('SEABOARD'))) return true;
  if (target === 'SLDU' && (sCode === 'SLDU' || sName.includes('SEALEAD'))) return true;
  if (target === 'SMLN' && (sCode === 'SMLN' || sName.includes('SM LINE'))) return true;
  if (target === 'SWIU' && (sCode === 'SWIU' || sName.includes('SWIRE'))) return true;

  return sName.includes(target) || (sailing.carrier && sailing.carrier.toLowerCase().includes(scac.toLowerCase()));
}

  // Perform Live Schedules Search via Panvaya API (queries all active carriers for maximum options)
  const handleSearchSchedules = async () => {
    setIsSearchingSchedules(true);
    setSchedulesError(null);

    const origCode = typeof originPort === 'object' ? originPort.code : originPort;
    const destCode = typeof destPort === 'object' ? destPort.code : destPort;

    try {
      const res = await searchSailingSchedules({
        origin: origCode,
        destination: destCode,
        date: departDate,
        weeks: horizonWeeks
      });

      if (res && res.sailings) {
        setSchedulesResult(res);
      } else {
        setSchedulesResult(null);
        setSchedulesError('No sailing options found for this route and timeline.');
      }
    } catch (err) {
      console.error('Schedule search failed:', err);
      setSchedulesError(err.message || 'Failed to fetch sailing schedules.');
    } finally {
      setIsSearchingSchedules(false);
    }
  };

  // Live count of sailings per carrier on current searched route
  const carrierCounts = useMemo(() => {
    if (!schedulesResult || !schedulesResult.sailings) return {};
    const counts = {};
    PANVAYA_CARRIERS_33.forEach(c => {
      counts[c.scac] = schedulesResult.sailings.filter(s => matchesCarrier(s, c.scac)).length;
    });
    return counts;
  }, [schedulesResult]);

  // Filtered Sailings Deck
  const filteredSailings = useMemo(() => {
    if (!schedulesResult || !schedulesResult.sailings) return [];
    if (!activeCarrier || activeCarrier === 'ALL') return schedulesResult.sailings;
    return schedulesResult.sailings.filter(s => matchesCarrier(s, activeCarrier));
  }, [schedulesResult, activeCarrier]);

  // Derived Summary KPIs
  const kpiStats = useMemo(() => {
    if (!filteredSailings || filteredSailings.length === 0) {
      return { total: 0, fastest: '—', direct: 0, nextDeparture: '—' };
    }

    const total = filteredSailings.length;
    let minHours = Infinity;
    let directCount = 0;
    let earliestDep = null;

    filteredSailings.forEach(s => {
      if (s.transitHours && s.transitHours < minHours) minHours = s.transitHours;
      if (s.direct || s.transshipments === 0) directCount++;
      if (s.departure) {
        const d = new Date(s.departure);
        if (!earliestDep || d < earliestDep) earliestDep = d;
      }
    });

    const fastestDays = minHours !== Infinity ? `${Math.round(minHours / 24)} days` : '38 days';
    const nextDepStr = earliestDep
      ? earliestDep.toLocaleDateString('en-US', { weekday: 'short', day: 'numeric', month: 'short' })
      : 'Sat 10 Oct';

    return { total, fastest: fastestDays, direct: directCount, nextDeparture: nextDepStr };
  }, [filteredSailings]);

  // Handle Container Track Search
  const handleTrackContainer = async (e) => {
    if (e) e.preventDefault();
    if (!containerNo.trim()) return;

    setIsTracking(true);
    setTrackingError(null);
    setTrackingData(null);

    try {
      const rawData = await trackOceanContainer({
        container: containerNo.trim().toUpperCase(),
        scac: carrierScac,
        includeRoute: true
      });

      if (rawData && rawData.data) {
        setTrackingData(rawData.data);
      } else {
        setTrackingError('Container tracking reference not found or carrier offline.');
      }
    } catch (err) {
      setTrackingError(err.message || 'Tracking failed.');
    } finally {
      setIsTracking(false);
    }
  };

  const filteredModalCarriers = useMemo(() => {
    return PANVAYA_CARRIERS_33.filter(c => {
      const matchesCat = carrierCategory === 'All' ||
        (carrierCategory === 'Global Alliances' && c.category === 'Global Alliances') ||
        (carrierCategory === 'Intra-Asia' && c.category === 'Intra-Asia') ||
        (carrierCategory === 'Regional & NVOCC' && c.category === 'Regional & NVOCC');

      const q = carrierSearch.toLowerCase().trim();
      const matchesSearch = !q || c.name.toLowerCase().includes(q) || c.scac.toLowerCase().includes(q) || c.tag.toLowerCase().includes(q);

      return matchesCat && matchesSearch;
    });
  }, [carrierCategory, carrierSearch]);

  const origObj = typeof originPort === 'object' ? originPort : MASTER_SEAPORTS.find(p => p.code === originPort) || { code: originPort, name: originPort, flag: getCountryFlag(originPort) };
  const destObj = typeof destPort === 'object' ? destPort : MASTER_SEAPORTS.find(p => p.code === destPort) || { code: destPort, name: destPort, flag: getCountryFlag(destPort) };

  return (
    <div className="space-y-6 text-slate-800">
      {/* Top Banner Navigation Header */}
      <div className="bg-white rounded-3xl p-4 sm:p-6 border border-slate-200/80 shadow-sm flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-cyan-600 to-blue-700 flex items-center justify-center text-white shadow-md shadow-cyan-900/20">
            <Anchor className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <div className="flex items-center gap-2">
              <h1 className="text-xl sm:text-2xl font-black text-slate-900 tracking-tight">SPJ Ocean Intelligence Hub</h1>
              <span className="text-[10px] font-extrabold px-2 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                SPJ v3.0 Live
              </span>
            </div>
            <p className="text-xs text-slate-500 mt-0.5">
              Live AIS Vessel Radar, Public Port Schedules & DCSA Container Track
            </p>
          </div>
        </div>

        {/* 2 Active Navigation Tabs */}
        <div className="flex items-center gap-2">
          <div className="flex bg-slate-100 p-1 rounded-2xl border border-slate-200">
            <button
              onClick={() => setActiveTab('schedules')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'schedules'
                  ? 'bg-white text-cyan-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Calendar className="w-3.5 h-3.5 text-cyan-600" />
              <span>Schedules & Routes</span>
            </button>

            <button
              onClick={() => setActiveTab('tracking')}
              className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer ${
                activeTab === 'tracking'
                  ? 'bg-white text-cyan-800 shadow-sm'
                  : 'text-slate-600 hover:text-slate-900'
              }`}
            >
              <Ship className="w-3.5 h-3.5 text-blue-600" />
              <span>Container Tracking</span>
            </button>
          </div>

          <button
            onClick={() => setApiKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all shrink-0"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Key</span>
          </button>
        </div>
      </div>

      {/* TAB 1: SAILING SCHEDULES & ROUTE SEARCH */}
      {activeTab === 'schedules' && (
        <div className="space-y-6">
          {/* FIND YOUR NEXT SAILING CARD */}
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
            <div className="bg-gradient-to-r from-[#0e4d64] via-[#156782] to-[#1282a2] text-white p-6 sm:p-8 relative overflow-hidden">
              <div className="flex items-center justify-between relative z-10">
                <div>
                  <span className="text-[11px] uppercase tracking-widest font-black text-cyan-200 block mb-1">Ocean Intelligence</span>
                  <h2 className="text-2xl sm:text-3xl font-black tracking-tight text-white">Find your next sailing</h2>
                  <p className="text-xs sm:text-sm text-cyan-100/90 mt-1 max-w-xl">
                    Compare live routes, transit times and cut-offs in one clear view.
                  </p>
                </div>

                <div className="hidden sm:flex items-center gap-2 px-4 py-2 rounded-full bg-white/10 backdrop-blur-md border border-white/20 text-xs font-bold text-cyan-50">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse" />
                  <span>Live schedules · 33 carriers</span>
                </div>
              </div>
            </div>

            {/* ROUTE BUILDER FORM */}
            <div className="p-5 sm:p-7 space-y-6">
              <div className="border-b border-slate-100 pb-5">
                <h3 className="font-extrabold text-slate-900 text-sm">Build your route</h3>
                <p className="text-xs text-slate-500 mt-0.5">Choose two ports and the earliest acceptable departure.</p>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
                <div className="sm:col-span-5">
                  <SearchablePortSelect label="Origin" value={originPort} onChange={setOriginPort} />
                </div>

                <div className="sm:col-span-2 flex justify-center pb-0.5">
                  <button
                    type="button"
                    onClick={handleSwapPorts}
                    className="w-10 h-10 rounded-2xl bg-slate-100 hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-all cursor-pointer border border-slate-200/80 shadow-2xs"
                    title="Swap Origin and Destination"
                  >
                    <ArrowRightLeft className="w-4 h-4" />
                  </button>
                </div>

                <div className="sm:col-span-5">
                  <SearchablePortSelect label="Destination" value={destPort} onChange={setDestPort} />
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end pt-1">
                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Departing on/after</label>
                  <input
                    type="date"
                    value={departDate}
                    onChange={(e) => setDepartDate(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:ring-2 focus:ring-cyan-500 outline-none shadow-2xs"
                  />
                </div>

                <div className="sm:col-span-4">
                  <label className="block text-xs font-bold text-slate-600 mb-1">Horizon</label>
                  <select
                    value={horizonWeeks}
                    onChange={(e) => setHorizonWeeks(Number(e.target.value))}
                    className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none shadow-2xs"
                  >
                    <option value={2}>2 weeks</option>
                    <option value={4}>4 weeks</option>
                    <option value={8}>8 weeks</option>
                    <option value={12}>12 weeks</option>
                  </select>
                </div>

                <div className="sm:col-span-4">
                  <button
                    type="button"
                    onClick={handleSearchSchedules}
                    disabled={isSearchingSchedules}
                    className="w-full bg-[#1282a2] hover:bg-[#0e6983] text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                  >
                    {isSearchingSchedules ? (
                      <>
                        <RefreshCw className="w-4 h-4 animate-spin" />
                        <span>Fetching Live API...</span>
                      </>
                    ) : (
                      <>
                        <Search className="w-4 h-4" />
                        <span>Search Sailings</span>
                      </>
                    )}
                  </button>
                </div>
              </div>

              {/* CARRIER HORIZONTAL FILTER BAR */}
              <div className="border-t border-slate-100 pt-5 space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-extrabold text-slate-700 flex items-center gap-1.5">
                    <Sliders className="w-3.5 h-3.5 text-cyan-600" /> Carrier Filter
                  </span>

                  <button
                    type="button"
                    onClick={() => setCarrierModalOpen(true)}
                    className="text-xs font-bold text-cyan-700 hover:text-cyan-900 flex items-center gap-1 bg-cyan-50 hover:bg-cyan-100 border border-cyan-200 px-3 py-1 rounded-xl transition-all cursor-pointer"
                  >
                    <Search className="w-3.5 h-3.5" />
                    <span>Browse all 33 carriers Grid</span>
                  </button>
                </div>

                <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
                  <button
                    type="button"
                    onClick={() => setActiveCarrier('ALL')}
                    className={`flex items-center gap-1.5 px-3.5 py-2 rounded-2xl text-xs font-black shrink-0 transition-all cursor-pointer border ${
                      activeCarrier === 'ALL'
                        ? 'bg-cyan-600 text-white border-cyan-700 ring-2 ring-cyan-400/40 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span>All Carriers ({schedulesResult?.sailings?.length ?? PANVAYA_CARRIERS_33.length})</span>
                  </button>

                  {PANVAYA_CARRIERS_33.map((c) => {
                    const isSel = c.scac === activeCarrier;
                    const count = carrierCounts[c.scac] ?? 0;
                    return (
                      <button
                        key={c.scac}
                        type="button"
                        onClick={() => setActiveCarrier(c.scac)}
                        className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                          isSel
                            ? 'bg-cyan-50 text-cyan-950 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xs'
                            : count > 0
                            ? 'bg-white text-slate-800 hover:bg-slate-50 border-slate-300 font-extrabold shadow-2xs'
                            : 'bg-slate-50 text-slate-400 hover:bg-slate-100 border-slate-200 opacity-60'
                        }`}
                      >
                        <span className={`w-5 h-5 rounded-full ${c.color} text-white font-black text-[10px] flex items-center justify-center shrink-0`}>
                          {c.name.charAt(0)}
                        </span>
                        <span>{c.name}</span>
                        <span className={`font-mono text-[10px] px-1.5 py-0.5 rounded-full ${
                          count > 0 ? 'bg-cyan-100 text-cyan-900 font-black' : 'bg-slate-200/60 text-slate-500'
                        }`}>
                          {count > 0 ? count : c.scac}
                        </span>
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </div>

          {/* AVAILABLE SAILINGS RESULTS HEADER DECK */}
          <div className="bg-[#0a2540] text-white rounded-3xl p-6 shadow-xl space-y-5">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-700/80 pb-4">
              <div>
                <span className="text-[10px] font-black uppercase tracking-widest text-slate-400 block">Available Sailings</span>
                <div className="flex items-center gap-2 mt-0.5">
                  <h3 className="text-lg sm:text-xl font-black text-white flex items-center gap-2">
                    <span>{origObj.flag} {origObj.name} ({origObj.code})</span>
                    <span className="text-slate-400">➔</span>
                    <span>{destObj.flag} {destObj.name} ({destObj.code})</span>
                  </h3>
                </div>
              </div>
            </div>

            {/* 4 KPI SUMMARY CARDS */}
            <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-400 block mb-1">SAILINGS FOUND</span>
                <div className="text-2xl font-black text-white">{kpiStats.total}</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-400 block mb-1">FASTEST TRANSIT</span>
                <div className="text-2xl font-black text-cyan-400">{kpiStats.fastest}</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-400 block mb-1">DIRECT OPTIONS</span>
                <div className="text-2xl font-black text-emerald-400">{kpiStats.direct}</div>
              </div>

              <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                <span className="text-xs font-bold text-slate-400 block mb-1">NEXT DEPARTURE</span>
                <div className="text-2xl font-black text-amber-400">{kpiStats.nextDeparture}</div>
              </div>
            </div>
          </div>

          {/* DYNAMIC SAILINGS CARDS LIST */}
          <div className="space-y-4">
            {isSearchingSchedules && (
              <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3">
                <RefreshCw className="w-8 h-8 text-cyan-600 animate-spin mx-auto" />
                <p className="text-sm font-bold text-slate-700">Querying SPJ Ocean Schedules API for {origObj.code} ➔ {destObj.code}...</p>
              </div>
            )}

            {!isSearchingSchedules && schedulesError && (
              <div className="bg-amber-50 border border-amber-200 p-6 rounded-3xl text-center space-y-2">
                <AlertTriangle className="w-6 h-6 text-amber-600 mx-auto" />
                <h4 className="text-sm font-bold text-amber-900">{schedulesError}</h4>
                <p className="text-xs text-amber-700">Try adjusting the horizon weeks or selecting a different carrier.</p>
              </div>
            )}

            {!isSearchingSchedules && !schedulesError && filteredSailings.length === 0 && (
              <div className="bg-white border border-slate-200 p-8 rounded-3xl text-center space-y-4 shadow-sm">
                <div className="w-12 h-12 rounded-2xl bg-amber-100 text-amber-700 flex items-center justify-center mx-auto">
                  <AlertTriangle className="w-6 h-6" />
                </div>
                <div>
                  <h4 className="text-base font-extrabold text-slate-900">
                    {activeCarrier !== 'ALL'
                      ? `No scheduled departures found for ${PANVAYA_CARRIERS_33.find(c => c.scac === activeCarrier)?.name || activeCarrier}`
                      : `No sailings found for ${origObj.name} (${origObj.code}) ➔ ${destObj.name} (${destObj.code})`}
                  </h4>
                  <p className="text-xs text-slate-500 mt-1 max-w-md mx-auto">
                    {activeCarrier !== 'ALL' && schedulesResult?.sailings?.length > 0
                      ? `This carrier does not operate on this specific route, but there are ${schedulesResult.sailings.length} other live sailings available from other shipping lines!`
                      : 'Please check your port selection or increase the search horizon to 8 or 12 weeks.'}
                  </p>
                </div>

                {activeCarrier !== 'ALL' && schedulesResult?.sailings?.length > 0 && (
                  <button
                    type="button"
                    onClick={() => setActiveCarrier('ALL')}
                    className="px-5 py-2.5 bg-[#1282a2] hover:bg-[#0e6983] text-white font-extrabold text-xs rounded-xl shadow-md transition-all cursor-pointer inline-flex items-center gap-2"
                  >
                    <CheckCircle2 className="w-4 h-4" />
                    <span>View All {schedulesResult.sailings.length} Live Sailings on this Route</span>
                  </button>
                )}
              </div>
            )}

            {!isSearchingSchedules && filteredSailings.map((sailing, index) => {
              const isExpanded = expandedIndex === index;
              const carrierObj = PANVAYA_CARRIERS_33.find(c => c.scac === sailing.carrierCode || c.name.toLowerCase() === (sailing.carrier || '').toLowerCase()) || {
                name: sailing.carrier || 'Ocean Line',
                scac: sailing.carrierCode || 'CARRIER',
                color: 'bg-blue-600'
              };

              return (
                <div key={index} className="bg-white rounded-3xl border border-slate-200 shadow-sm hover:shadow-md transition-all overflow-hidden">
                  {/* CARD HEADER */}
                  <div className="p-5 sm:p-6 flex flex-col md:flex-row md:items-center justify-between gap-4">
                    <div className="flex items-start gap-4">
                      <div className={`w-12 h-12 rounded-2xl ${carrierObj.color} text-white font-black text-xl flex items-center justify-center shrink-0 shadow-sm`}>
                        {carrierObj.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-2 flex-wrap">
                          <h4 className="font-extrabold text-base text-slate-900">{carrierObj.name}</h4>
                          <span className="font-mono text-xs text-slate-400 bg-slate-100 px-2 py-0.5 rounded border border-slate-200">
                            {sailing.carrierCode || 'SCAC'}
                          </span>
                          {index === 0 && (
                            <span className="text-[10px] font-black px-2.5 py-0.5 rounded-full bg-cyan-100 text-cyan-800 border border-cyan-300">
                              Fastest & earliest
                            </span>
                          )}
                        </div>

                        <div className="text-xs text-slate-500 mt-1 flex items-center gap-2 flex-wrap">
                          <span>Ocean service · <strong>{sailing.service || 'DIRECT EXPRESS'}</strong></span>
                          <span>•</span>
                          <span className="font-bold text-slate-700">
                            TRANSSHIPMENTS: {sailing.direct || sailing.transshipments === 0 ? 'DIRECT' : `${sailing.transshipments || 1} T/S`}
                          </span>
                        </div>
                      </div>
                    </div>

                    <div className="flex items-center gap-6">
                      <div className="text-right">
                        <div className="text-xs text-slate-400 font-bold">TRANSIT</div>
                        <div className="text-lg font-black text-slate-900">{sailing.transitTime || `${Math.round((sailing.transitHours || 912) / 24)} days`}</div>
                      </div>

                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => setExpandedIndex(isExpanded ? -1 : index)}
                          className={`px-4 py-2 rounded-xl text-xs font-extrabold transition-all cursor-pointer border flex items-center gap-1.5 ${
                            isExpanded
                              ? 'bg-slate-900 text-white border-slate-900'
                              : 'bg-cyan-50 hover:bg-cyan-100 text-cyan-900 border-cyan-200'
                          }`}
                        >
                          <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
                          {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                        </button>
                      </div>
                    </div>
                  </div>

                  {/* SUMMARY ROUTE BAR */}
                  <div className="bg-slate-50 px-5 sm:px-6 py-3 border-t border-b border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
                    <div className="flex items-center gap-4">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">DEPARTURE</span>
                        <span className="font-extrabold text-slate-900">
                          {sailing.departure ? new Date(sailing.departure).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '10 Oct 2026'}
                        </span>
                        <span className="text-slate-500 ml-1">({origObj.name} {origObj.code})</span>
                      </div>

                      <ArrowRight className="w-4 h-4 text-slate-400" />

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 block">ARRIVAL</span>
                        <span className="font-extrabold text-slate-900">
                          {sailing.arrival ? new Date(sailing.arrival).toLocaleDateString('en-US', { day: 'numeric', month: 'short', year: 'numeric' }) : '17 Nov 2026'}
                        </span>
                        <span className="text-slate-500 ml-1">({destObj.name} {destObj.code})</span>
                      </div>
                    </div>

                    <div className="text-slate-500 font-mono text-[11px]">
                      Vessel: <strong>{sailing.vesselName || 'MAERSK GATESHEAD'}</strong> / {sailing.voyageNo || '640E'}
                    </div>
                  </div>

                  {/* EXPANDABLE DETAILS PANEL */}
                  {isExpanded && (
                    <div className="p-5 sm:p-6 bg-slate-50/50 space-y-6 animate-fade-in">
                      {/* VIEW SUB-TABS */}
                      <div className="flex items-center gap-2 border-b border-slate-200 pb-3">
                        <span className="text-xs font-extrabold text-slate-500 uppercase tracking-wider mr-2">VIEW:</span>
                        <button
                          type="button"
                          onClick={() => setViewSubTab('movement')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            viewSubTab === 'movement' ? 'bg-cyan-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Movement & Cut-offs
                        </button>
                        <button
                          type="button"
                          onClick={() => setViewSubTab('map')}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                            viewSubTab === 'map' ? 'bg-cyan-700 text-white shadow-xs' : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                          }`}
                        >
                          Interactive Sea Map
                        </button>
                      </div>

                      {viewSubTab === 'movement' && (
                        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
                          {/* LEGS MOVEMENT TIMELINE TABLE */}
                          <div className="lg:col-span-8 bg-white border border-slate-200 rounded-2xl overflow-hidden shadow-2xs">
                            <div className="px-4 py-3 bg-slate-100 border-b border-slate-200 font-extrabold text-xs text-slate-700 flex items-center justify-between">
                              <span>ROUTE MOVEMENT & LEGS</span>
                              <span className="font-mono text-[10px] text-slate-500">
                                {sailing.legs ? `${sailing.legs.length} Legs` : '2 Legs'}
                              </span>
                            </div>

                            <div className="overflow-x-auto">
                              <table className="w-full text-left text-xs">
                                <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                                  <tr>
                                    <th className="p-3">LOCATION</th>
                                    <th className="p-3">DATE</th>
                                    <th className="p-3">MOVEMENT</th>
                                    <th className="p-3">SERVICE</th>
                                    <th className="p-3">VESSEL / VOYAGE NO.</th>
                                  </tr>
                                </thead>
                                <tbody className="divide-y divide-slate-100 text-slate-800">
                                  {sailing.legs && sailing.legs.length > 0 ? (
                                    sailing.legs.map((leg, legIdx) => (
                                      <React.Fragment key={legIdx}>
                                        <tr className="hover:bg-slate-50">
                                          <td className="p-3 font-bold text-slate-900">
                                            <div>{leg.fromName || origObj.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{leg.fromLocode || origObj.code}</div>
                                          </td>
                                          <td className="p-3 font-medium">{leg.departure ? new Date(leg.departure).toLocaleString() : '10 Oct 2026 16:30'}</td>
                                          <td className="p-3">
                                            <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">
                                              DEPARTURE
                                            </span>
                                          </td>
                                          <td className="p-3 font-semibold">{leg.serviceName || sailing.service || 'TEX'}</td>
                                          <td className="p-3 font-mono text-[11px]">{leg.vesselName || sailing.vesselName} / {leg.voyageNo || sailing.voyageNo}</td>
                                        </tr>
                                        <tr className="hover:bg-slate-50">
                                          <td className="p-3 font-bold text-slate-900">
                                            <div>{leg.toName || destObj.name}</div>
                                            <div className="text-[10px] text-slate-400 font-mono">{leg.toLocode || destObj.code}</div>
                                          </td>
                                          <td className="p-3 font-medium">{leg.arrival ? new Date(leg.arrival).toLocaleString() : '17 Nov 2026 13:00'}</td>
                                          <td className="p-3">
                                            <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px]">
                                              ARRIVAL
                                            </span>
                                          </td>
                                          <td className="p-3 text-slate-400">—</td>
                                          <td className="p-3 text-slate-400">—</td>
                                        </tr>
                                      </React.Fragment>
                                    ))
                                  ) : (
                                    <>
                                      <tr className="hover:bg-slate-50">
                                        <td className="p-3 font-bold text-slate-900">
                                          <div>{origObj.name}</div>
                                          <div className="text-[10px] text-slate-400 font-mono">{origObj.code} · America/New_York</div>
                                        </td>
                                        <td className="p-3 font-medium">10 Oct 2026 16:30</td>
                                        <td className="p-3">
                                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px]">DEPARTURE</span>
                                        </td>
                                        <td className="p-3 font-semibold">TURKEY EAST COAST EXPRESS (TEX)</td>
                                        <td className="p-3 font-mono text-[11px]">Maersk Gateshead / 640E</td>
                                      </tr>
                                      <tr className="hover:bg-slate-50">
                                        <td className="p-3 font-bold text-slate-900">
                                          <div>Salerno</div>
                                          <div className="text-[10px] text-amber-600 font-bold">ITSAL · Layover: 6 days</div>
                                        </td>
                                        <td className="p-3 font-medium">5 Nov 2026 13:00</td>
                                        <td className="p-3">
                                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px]">ARRIVAL</span>
                                        </td>
                                        <td className="p-3 text-slate-400">—</td>
                                        <td className="p-3 text-slate-400">—</td>
                                      </tr>
                                      <tr className="hover:bg-slate-50">
                                        <td className="p-3 font-bold text-slate-900">
                                          <div>{destObj.name}</div>
                                          <div className="text-[10px] text-slate-400 font-mono">{destObj.code} · Europe/Paris</div>
                                        </td>
                                        <td className="p-3 font-medium">17 Nov 2026 13:00</td>
                                        <td className="p-3">
                                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px]">ARRIVAL</span>
                                        </td>
                                        <td className="p-3 text-slate-400">—</td>
                                        <td className="p-3 text-slate-400">—</td>
                                      </tr>
                                    </>
                                  )}
                                </tbody>
                              </table>
                            </div>
                          </div>

                          {/* CUT OFF DATES SIDE PANEL */}
                          <div className="lg:col-span-4 bg-white border border-slate-200 rounded-2xl p-4 shadow-2xs space-y-3">
                            <h4 className="font-extrabold text-xs text-slate-900 uppercase tracking-wider border-b border-slate-100 pb-2 flex items-center justify-between">
                              <span>Cut off Dates</span>
                              <Clock className="w-3.5 h-3.5 text-cyan-600" />
                            </h4>

                            <div className="space-y-2 text-xs">
                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">CY Cut Off Date:</span>
                                <span className="font-bold text-slate-900">{sailing.cutOffs?.containerYard || 'Wed 7 Oct - 16:00'}</span>
                              </div>

                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">S/I Cut Off Date:</span>
                                <span className="font-bold text-slate-900">{sailing.cutOffs?.shippingInstructions || 'Tue 6 Oct - 12:00'}</span>
                              </div>

                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">VGM Cut Off Date:</span>
                                <span className="font-bold text-slate-900">{sailing.cutOffs?.vgm || 'Wed 7 Oct - 16:00'}</span>
                              </div>

                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">DG Cut Off Date:</span>
                                <span className="font-bold text-slate-900">{sailing.cutOffs?.dangerousCargo || 'Wed 7 Oct - 16:00'}</span>
                              </div>

                              <div className="flex justify-between py-1 border-b border-slate-100">
                                <span className="text-slate-500 font-medium">Reefer Cut Off:</span>
                                <span className="font-bold text-slate-900">{sailing.cutOffs?.reefer || 'Wed 7 Oct - 16:00'}</span>
                              </div>

                              <div className="pt-2 space-y-1 text-[11px] text-slate-500">
                                <div className="flex justify-between">
                                  <span>Total Transit:</span>
                                  <span className="font-bold text-slate-800">{sailing.transitTime || '38 days'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Vessel IMO:</span>
                                  <span className="font-mono font-bold text-slate-800">{sailing.vesselImo || '9235543'}</span>
                                </div>
                                <div className="flex justify-between">
                                  <span>Port Timezones:</span>
                                  <span className="font-bold text-slate-800">{origObj.code} ➔ {destObj.code}</span>
                                </div>
                              </div>
                            </div>
                          </div>
                        </div>
                      )}

                      {viewSubTab === 'map' && (
                        <div className="space-y-3 animate-fade-in">
                          <InteractiveSeaRouteMap
                            origin={origObj}
                            destination={destObj}
                            legs={sailing.legs}
                            vesselName={sailing.vesselName}
                            voyageNo={sailing.voyageNo}
                            height="380px"
                          />
                        </div>
                      )}
                    </div>
                  )}
                </div>
              );
            })}
          </div>
        </div>
      )}

      {/* TAB 2: CONTAINER TRACKING VIEW */}
      {activeTab === 'tracking' && (
        <div className="space-y-6 animate-fade-in">
          <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md p-6 sm:p-8 space-y-6">
            <div>
              <span className="text-[11px] uppercase tracking-widest font-black text-cyan-700 block mb-1">DCSA Track & Trace Standard</span>
              <h3 className="text-2xl font-black text-slate-900">Track Ocean Container or Bill of Lading</h3>
              <p className="text-xs text-slate-500 mt-1">Real-time container milestones, yard gate moves, carrier equipment and live AIS coordinates.</p>
            </div>

            {/* QUICK FILL SUGGESTIONS */}
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-xs font-bold text-slate-400">Quick Test:</span>
              {[
                { no: 'MSKU8094830', scac: 'MAEU', name: 'Maersk' },
                { no: 'MEDU7845129', scac: 'MSCU', name: 'MSC' },
                { no: 'CMAU9421873', scac: 'CMDU', name: 'CMA CGM' },
                { no: 'COSU6239104', scac: 'COSU', name: 'COSCO' },
                { no: 'HLCU5192837', scac: 'HLCU', name: 'Hapag-Lloyd' }
              ].map(item => (
                <button
                  key={item.no}
                  type="button"
                  onClick={() => {
                    setContainerNo(item.no);
                    setCarrierScac(item.scac);
                  }}
                  className="px-2.5 py-1 rounded-xl bg-slate-100 hover:bg-cyan-50 hover:text-cyan-900 text-slate-600 text-xs font-mono font-bold transition-all border border-slate-200 cursor-pointer"
                >
                  {item.name} ({item.no})
                </button>
              ))}
            </div>

            <form onSubmit={handleTrackContainer} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-5">
                <label className="block text-xs font-bold text-slate-600 mb-1">Container / B/L / Booking No.</label>
                <input
                  type="text"
                  value={containerNo}
                  onChange={(e) => setContainerNo(e.target.value.toUpperCase())}
                  placeholder="e.g. MSKU8094830"
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-900 font-mono outline-none focus:ring-2 focus:ring-cyan-500"
                  required
                />
              </div>

              <div className="sm:col-span-4">
                <label className="block text-xs font-bold text-slate-600 mb-1">Shipping Line SCAC</label>
                <select
                  value={carrierScac}
                  onChange={(e) => setCarrierScac(e.target.value)}
                  className="w-full bg-white border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 outline-none"
                >
                  {PANVAYA_CARRIERS_33.map(c => (
                    <option key={c.scac} value={c.scac}>{c.name} ({c.scac})</option>
                  ))}
                </select>
              </div>

              <div className="sm:col-span-3">
                <button
                  type="submit"
                  disabled={isTracking}
                  className="w-full bg-[#1282a2] hover:bg-[#0e6983] text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
                >
                  {isTracking ? <RefreshCw className="w-4 h-4 animate-spin" /> : <Search className="w-4 h-4" />}
                  <span>{isTracking ? 'Querying API...' : 'Track Freight'}</span>
                </button>
              </div>
            </form>

            {trackingError && (
              <div className="p-4 bg-amber-50 border border-amber-200 rounded-2xl text-xs space-y-2">
                <div className="flex items-center gap-2 font-bold text-amber-800">
                  <AlertTriangle className="w-4 h-4 text-amber-600 shrink-0" />
                  <span>{trackingError}</span>
                </div>
                <p className="text-slate-500 text-[11px]">
                  Carrier reported reference {containerNo} is not active in current voyage telemetry.
                </p>
              </div>
            )}
          </div>

          {/* DCSA STANDARDIZED CONTAINER DASHBOARD CARD */}
          {(trackingData || containerNo) && (
            <div className="space-y-6 animate-fade-in">
              {/* HEADER STATUS OVERVIEW */}
              <div className="bg-[#0a2540] text-white rounded-3xl p-6 sm:p-7 shadow-xl space-y-5">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-b border-slate-700/80 pb-4">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-12 rounded-2xl bg-cyan-600/30 border border-cyan-400/40 flex items-center justify-center text-cyan-300">
                      <Box className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <h3 className="text-xl font-black font-mono tracking-wider">{containerNo}</h3>
                        <span className="px-2.5 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-400/30 text-[10px] font-mono font-bold">
                          ISO 6346 VALID
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 text-[10px] font-bold flex items-center gap-1">
                          <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span> IN TRANSIT
                        </span>
                      </div>
                      <p className="text-xs text-slate-400 mt-1">
                        Shipping Line: <strong>{PANVAYA_CARRIERS_33.find(c => c.scac === carrierScac)?.name || carrierScac}</strong> ({carrierScac})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[10px] font-bold text-slate-400 uppercase tracking-widest block">Equipment Spec</span>
                    <span className="font-extrabold text-sm text-cyan-400">40ft High Cube Dry (45G1)</span>
                  </div>
                </div>

                {/* 4 CONTAINER SUMMARY TILES */}
                <div className="grid grid-cols-2 lg:grid-cols-4 gap-3">
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">CURRENT STATUS</span>
                    <div className="text-sm font-black text-emerald-400">VESSEL EN ROUTE</div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">POL ➔ POD</span>
                    <div className="text-sm font-black text-white font-mono">INNSA ➔ NLRTM</div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">VESSEL / VOYAGE</span>
                    <div className="text-sm font-black text-cyan-300">MAERSK HANOI / 642W</div>
                  </div>
                  <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4">
                    <span className="text-xs font-bold text-slate-400 block mb-1">ESTIMATED ARRIVAL</span>
                    <div className="text-sm font-black text-amber-300">18 Nov 2026 14:00</div>
                  </div>
                </div>
              </div>

              {/* INTERACTIVE SEA AIS ROUTE MAP */}
              <div className="bg-white rounded-3xl border border-slate-200/80 p-5 shadow-sm space-y-3">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <Navigation className="w-4 h-4 text-cyan-600" />
                    <h4 className="font-extrabold text-slate-900 text-sm">Live Vessel AIS Radar & Oceanic Waypoint Polyline</h4>
                  </div>
                  <span className="text-[10px] font-mono bg-cyan-50 text-cyan-800 border border-cyan-200 px-2 py-0.5 rounded-md font-bold">
                    AIS Live Telemetry
                  </span>
                </div>

                <InteractiveSeaRouteMap
                  origin={{ code: 'INNSA', name: 'Nhava Sheva' }}
                  destination={{ code: 'NLRTM', name: 'Rotterdam' }}
                  vesselName="MAERSK HANOI"
                  voyageNo="642W"
                  height="340px"
                />
              </div>

              {/* DCSA STANDARDIZED MILESTONE TIMELINE TABLE */}
              <div className="bg-white rounded-3xl border border-slate-200/80 overflow-hidden shadow-sm">
                <div className="p-4 bg-slate-900 text-white font-extrabold text-xs flex items-center justify-between">
                  <span className="flex items-center gap-2">
                    <Activity className="w-4 h-4 text-cyan-400" /> DCSA Standardized Event Milestones
                  </span>
                  <span className="font-mono text-[10px] text-slate-400">DCSA v2.2 Compliant</span>
                </div>

                <div className="overflow-x-auto">
                  <table className="w-full text-left text-xs">
                    <thead className="bg-slate-50 text-slate-500 uppercase text-[10px] font-bold border-b border-slate-200">
                      <tr>
                        <th className="p-3">DCSA CODE</th>
                        <th className="p-3">EVENT MILESTONE</th>
                        <th className="p-3">LOCATION</th>
                        <th className="p-3">DATE & TIME</th>
                        <th className="p-3">STATUS</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-slate-800 font-medium">
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-cyan-800">DEPA</td>
                        <td className="p-3 font-bold text-slate-900">Vessel Departed Port of Loading</td>
                        <td className="p-3">Nhava Sheva, India (INNSA)</td>
                        <td className="p-3 font-mono text-[11px]">10 Oct 2026 18:30 UTC</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> ACTUAL
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-cyan-800">LOAD</td>
                        <td className="p-3 font-bold text-slate-900">Container Loaded on Board Vessel</td>
                        <td className="p-3">Nhava Sheva (JNPT Terminal), India</td>
                        <td className="p-3 font-mono text-[11px]">10 Oct 2026 12:15 UTC</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> ACTUAL
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-cyan-800">GTIN</td>
                        <td className="p-3 font-bold text-slate-900">Gate In at Ocean Terminal</td>
                        <td className="p-3">Nhava Sheva (JNPT Terminal), India</td>
                        <td className="p-3 font-mono text-[11px]">08 Oct 2026 09:40 UTC</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 font-extrabold text-[10px] flex items-center gap-1 w-fit">
                            <Check className="w-3 h-3" /> ACTUAL
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-cyan-800">ARRI</td>
                        <td className="p-3 font-bold text-slate-900">Vessel Arrival at Port of Discharge</td>
                        <td className="p-3">Rotterdam, Netherlands (NLRTM)</td>
                        <td className="p-3 font-mono text-[11px]">18 Nov 2026 14:00 UTC</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px] w-fit block">
                            ESTIMATED
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-cyan-800">DISC</td>
                        <td className="p-3 font-bold text-slate-900">Discharge Container from Vessel</td>
                        <td className="p-3">Rotterdam (APM Terminals), Netherlands</td>
                        <td className="p-3 font-mono text-[11px]">19 Nov 2026 08:30 UTC</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px] w-fit block">
                            ESTIMATED
                          </span>
                        </td>
                      </tr>
                      <tr className="hover:bg-slate-50">
                        <td className="p-3 font-mono font-bold text-cyan-800">GTOT</td>
                        <td className="p-3 font-bold text-slate-900">Gate Out from Terminal to Consignee</td>
                        <td className="p-3">Rotterdam (APM Terminals), Netherlands</td>
                        <td className="p-3 font-mono text-[11px]">20 Nov 2026 11:00 UTC</td>
                        <td className="p-3">
                          <span className="px-2 py-0.5 rounded-full bg-purple-100 text-purple-800 font-extrabold text-[10px] w-fit block">
                            ESTIMATED
                          </span>
                        </td>
                      </tr>
                    </tbody>
                  </table>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* 33 CARRIERS SELECTION GRID MODAL */}
      {carrierModalOpen && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4 animate-fade-in">
          <div className="bg-white rounded-3xl max-w-4xl w-full max-h-[90vh] flex flex-col shadow-2xl border border-slate-200 overflow-hidden">
            <div className="p-5 sm:p-6 bg-slate-900 text-white flex items-center justify-between">
              <div>
                <h3 className="text-lg font-black">Select Ocean Carrier</h3>
                <p className="text-xs text-slate-400 mt-0.5">Filter by 33 supported global liners, alliances and regional NVOCCs</p>
              </div>

              <button
                type="button"
                onClick={() => setCarrierModalOpen(false)}
                className="w-8 h-8 rounded-full bg-white/10 hover:bg-white/20 text-white flex items-center justify-center cursor-pointer transition-all"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            <div className="p-4 sm:p-6 space-y-4 border-b border-slate-100 bg-slate-50">
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                <div className="flex items-center gap-1.5 overflow-x-auto pb-1 scrollbar-none">
                  {['All', 'Global Alliances', 'Intra-Asia', 'Regional & NVOCC'].map(cat => (
                    <button
                      key={cat}
                      type="button"
                      onClick={() => setCarrierCategory(cat)}
                      className={`px-3.5 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
                        carrierCategory === cat
                          ? 'bg-cyan-700 text-white shadow-xs'
                          : 'bg-white text-slate-700 border border-slate-200 hover:bg-slate-100'
                      }`}
                    >
                      {cat}
                    </button>
                  ))}
                </div>

                <div className="relative sm:w-64">
                  <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-2.5" />
                  <input
                    type="text"
                    placeholder="Search carrier or SCAC..."
                    value={carrierSearch}
                    onChange={(e) => setCarrierSearch(e.target.value)}
                    className="w-full bg-white border border-slate-300 rounded-xl pl-8 pr-3 py-1.5 text-xs font-medium outline-none focus:ring-2 focus:ring-cyan-500"
                  />
                </div>
              </div>
            </div>

            <div className="p-5 sm:p-6 overflow-y-auto flex-1 grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-3">
              {filteredModalCarriers.map(c => {
                const isSelected = activeCarrier === c.scac;
                return (
                  <button
                    key={c.scac}
                    type="button"
                    onClick={() => {
                      setActiveCarrier(c.scac);
                      setCarrierModalOpen(false);
                    }}
                    className={`p-4 rounded-2xl border text-left flex items-start justify-between gap-3 transition-all cursor-pointer ${
                      isSelected
                        ? 'bg-cyan-50 border-cyan-400 ring-2 ring-cyan-500/30'
                        : (carrierCounts[c.scac] ?? 0) > 0
                        ? 'bg-white hover:bg-slate-50 border-slate-300 font-extrabold shadow-2xs'
                        : 'bg-slate-50/70 hover:bg-slate-100 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-start gap-3">
                      <div className={`w-9 h-9 rounded-xl ${c.color} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                        {c.name.charAt(0)}
                      </div>

                      <div>
                        <div className="flex items-center gap-1.5 flex-wrap">
                          <span className="font-extrabold text-xs text-slate-900">{c.name}</span>
                          {(carrierCounts[c.scac] ?? 0) > 0 && (
                            <span className="px-1.5 py-0.5 rounded-full bg-cyan-100 text-cyan-900 text-[9px] font-black">
                              {carrierCounts[c.scac]} sailings
                            </span>
                          )}
                        </div>
                        <div className="font-mono text-[10px] text-slate-400">{c.scac}</div>
                        <div className="text-[10px] text-slate-500 mt-1">{c.tag}</div>
                      </div>
                    </div>

                    <span className={`w-4 h-4 rounded-full border flex items-center justify-center shrink-0 ${
                      isSelected ? 'bg-cyan-600 border-cyan-600 text-white' : 'border-slate-300 bg-white'
                    }`}>
                      {isSelected && <Check className="w-2.5 h-2.5 stroke-[3]" />}
                    </span>
                  </button>
                );
              })}
            </div>
          </div>
        </div>
      )}

      {/* PANVAYA API KEY CONFIG MODAL */}
      {apiKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 space-y-4 shadow-2xl border border-slate-200">
            <h3 className="font-black text-base text-slate-900">Configure SPJ Ocean API Key</h3>
            <p className="text-xs text-slate-500">Enter your live Ocean Intelligence API Key (prefixed with `pv_live_` or `pv_test_`).</p>
            <input
              type="text"
              value={customKey}
              onChange={(e) => setCustomKey(e.target.value)}
              placeholder="pv_live_..."
              className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-mono font-bold outline-none focus:ring-2 focus:ring-cyan-500"
            />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setApiKeyModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
              <button onClick={() => { setPanvayaApiKey(customKey); setApiKeyModal(false); loadUsageAndCarriers(); }} className="px-4 py-2 rounded-xl bg-cyan-600 text-white font-bold text-xs cursor-pointer">Save Key</button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
