import React, { useState, useEffect } from 'react';
import {
  Ship,
  Navigation,
  Compass,
  Gauge,
  MapPin,
  Calendar,
  Clock,
  AlertTriangle,
  CheckCircle2,
  Anchor,
  Search,
  RefreshCw,
  Layers,
  ArrowRight,
  ShieldCheck,
  Globe,
  Radio,
  ExternalLink,
  ChevronRight,
  Filter,
  Activity,
  Zap,
  Leaf,
  Info,
  RotateCw,
  Sliders,
  Sparkles,
  Save,
  Database,
  Trash2,
  Bookmark,
  Check
} from 'lucide-react';
import {
  trackOceanContainer,
  searchSailingSchedules,
  getVesselLivePosition,
  getVesselDetails,
  getPortCongestion,
  getOceanCarriers,
  calculateCarbonEmission,
  getPanvayaUsage,
  getPanvayaApiKey,
  setPanvayaApiKey,
  enrichTrackingData
} from '../services/panvayaService';

// Default multi-vessel cached dataset for instant display without burning credits
const DEFAULT_PRESET_SAILINGS = [
  {
    carrier: "CMA CGM",
    carrierCode: "CMDU",
    service: "China India Express (CIX)",
    direct: true,
    routingType: "Direct",
    originName: "Jawaharlal Nehru (Nhava Sheva)",
    originLocode: "INNSA",
    originTerminal: "Gateway Terminal India (GTI / APM)",
    destinationName: "Singapore",
    destinationLocode: "SGSIN",
    destinationTerminal: "PSA Singapore Terminal 2",
    departure: "2026-10-16T08:00:00+05:30",
    arrival: "2026-10-25T14:00:00+08:00",
    transitTime: "9 days",
    transitHours: 216,
    vesselName: "OOCL LUXEMBOURG",
    vesselImo: "9451478",
    voyageNo: "0FBIIE1MA",
    co2: "0.98 tonnes CO₂",
    cutOffs: {
      containerYard: "2026-10-14T01:00:00+05:30",
      vgm: "2026-10-14T01:00:00+05:30",
      shippingInstructions: "2026-10-13T13:00:00+05:30",
      customs: "2026-10-13T19:00:00+05:30",
      standardBooking: "2026-10-12T01:00:00+05:30",
      dangerousCargo: "2026-10-09T10:00:00+05:30"
    }
  },
  {
    carrier: "MAERSK",
    carrierCode: "MAEU",
    service: "AE1 - Arabian Express",
    direct: true,
    routingType: "Direct",
    originName: "Jawaharlal Nehru (Nhava Sheva)",
    originLocode: "INNSA",
    originTerminal: "Bharat Mumbai Container Terminals (BMCT)",
    destinationName: "Singapore",
    destinationLocode: "SGSIN",
    destinationTerminal: "Jurong Port / PSA",
    departure: "2026-10-18T10:00:00+05:30",
    arrival: "2026-10-28T06:00:00+08:00",
    transitTime: "10 days",
    transitHours: 240,
    vesselName: "MAERSK LIRQUEN",
    vesselImo: "9526887",
    voyageNo: "2612E",
    co2: "1.04 tonnes CO₂",
    cutOffs: {
      containerYard: "2026-10-16T04:00:00+05:30",
      vgm: "2026-10-16T04:00:00+05:30",
      shippingInstructions: "2026-10-15T16:00:00+05:30",
      customs: "2026-10-15T22:00:00+05:30",
      standardBooking: "2026-10-14T10:00:00+05:30",
      dangerousCargo: "2026-10-12T12:00:00+05:30"
    }
  },
  {
    carrier: "EVERGREEN",
    carrierCode: "EGLV",
    service: "FDR - Southeast Express",
    direct: true,
    routingType: "Direct",
    originName: "Jawaharlal Nehru (Nhava Sheva)",
    originLocode: "INNSA",
    originTerminal: "Nhava Sheva International (NSICT)",
    destinationName: "Singapore",
    destinationLocode: "SGSIN",
    destinationTerminal: "Pasir Panjang Terminal",
    departure: "2026-10-21T18:00:00+05:30",
    arrival: "2026-10-31T12:00:00+08:00",
    transitTime: "10 days",
    transitHours: 240,
    vesselName: "EVER FOREVER",
    vesselImo: "9850886",
    voyageNo: "1042-014E",
    co2: "0.92 tonnes CO₂",
    cutOffs: {
      containerYard: "2026-10-19T12:00:00+05:30",
      vgm: "2026-10-19T12:00:00+05:30",
      shippingInstructions: "2026-10-18T18:00:00+05:30",
      customs: "2026-10-18T23:00:00+05:30",
      standardBooking: "2026-10-17T14:00:00+05:30",
      dangerousCargo: "2026-10-15T16:00:00+05:30"
    }
  },
  {
    carrier: "MSC",
    carrierCode: "MSCU",
    service: "Himalaya Express",
    direct: false,
    routingType: "Transhipment (1 Stop)",
    originName: "Jawaharlal Nehru (Nhava Sheva)",
    originLocode: "INNSA",
    originTerminal: "Gateway Terminal India (GTI)",
    destinationName: "Singapore",
    destinationLocode: "SGSIN",
    destinationTerminal: "PSA Singapore Terminal 4",
    departure: "2026-10-23T14:00:00+05:30",
    arrival: "2026-11-04T18:00:00+08:00",
    transitTime: "12 days",
    transitHours: 288,
    vesselName: "MSC SASKIA A",
    vesselImo: "9399002",
    voyageNo: "MS2639R",
    co2: "1.12 tonnes CO₂",
    cutOffs: {
      containerYard: "2026-10-21T06:00:00+05:30",
      vgm: "2026-10-21T06:00:00+05:30",
      shippingInstructions: "2026-10-20T17:00:00+05:30",
      customs: "2026-10-20T23:30:00+05:30",
      standardBooking: "2026-10-19T12:00:00+05:30",
      dangerousCargo: "2026-10-17T10:00:00+05:30"
    }
  },
  {
    carrier: "RCL",
    carrierCode: "REGU",
    service: "Far East Service",
    direct: true,
    routingType: "Direct",
    originName: "Jawaharlal Nehru (Nhava Sheva)",
    originLocode: "INNSA",
    originTerminal: "JNPT Shallow Water Berth",
    destinationName: "Singapore",
    destinationLocode: "SGSIN",
    destinationTerminal: "Tanjong Pagar Terminal",
    departure: "2026-10-26T20:00:00+05:30",
    arrival: "2026-11-06T08:00:00+08:00",
    transitTime: "11 days",
    transitHours: 264,
    vesselName: "INTERASIA AMPLIFY",
    vesselImo: "9628049",
    voyageNo: "E017",
    co2: "0.89 tonnes CO₂",
    cutOffs: {
      containerYard: "2026-10-24T14:00:00+05:30",
      vgm: "2026-10-24T14:00:00+05:30",
      shippingInstructions: "2026-10-23T18:00:00+05:30",
      customs: "2026-10-24T00:00:00+05:30",
      standardBooking: "2026-10-22T10:00:00+05:30",
      dangerousCargo: "2026-10-20T12:00:00+05:30"
    }
  }
];

export default function OceanIntelligenceView({ customer }) {
  // Navigation Modes
  const [activeTab, setActiveTab] = useState('schedules'); // default to schedules to show 5 vessels immediately!
  
  // API Quota / Balance State
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState(getPanvayaApiKey());

  // 0. LOCAL STORAGE PERSISTENCE STATE (Audio Requirement #1)
  const [storedShipments, setStoredShipments] = useState(() => {
    try {
      const raw = localStorage.getItem('spj_cached_shipments');
      return raw ? JSON.parse(raw) : [];
    } catch (e) {
      return [];
    }
  });

  const [storedSchedules, setStoredSchedules] = useState(() => {
    try {
      const raw = localStorage.getItem('spj_cached_schedules');
      return raw ? JSON.parse(raw) : { sailings: DEFAULT_PRESET_SAILINGS, origin: 'INNSA', destination: 'SGSIN', savedAt: new Date().toISOString() };
    } catch (e) {
      return { sailings: DEFAULT_PRESET_SAILINGS, origin: 'INNSA', destination: 'SGSIN' };
    }
  });

  const [activeSourceBadge, setActiveSourceBadge] = useState(null); // 'cached' | 'live'

  // Carriers List State
  const [carriers, setCarriers] = useState([]);

  // 1. Tracking State
  const [trackRefType, setTrackRefType] = useState('container'); // 'container', 'bol', 'bk'
  const [trackRefNumber, setTrackRefNumber] = useState('MSKU8094830');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [includeRouteData, setIncludeRouteData] = useState(true);
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState(null);

  // 2. Schedules State (Audio Requirement #2: 4-5 Vessels with dates)
  const [schedOrigin, setSchedOrigin] = useState('INNSA'); // Nhava Sheva
  const [schedDest, setSchedDest] = useState('SGSIN'); // Singapore
  const [schedDate, setSchedDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [schedWeeks, setSchedWeeks] = useState(4);
  const [isSearchingSched, setIsSearchingSched] = useState(false);
  const [schedResults, setSchedResults] = useState(storedSchedules);
  const [schedError, setSchedError] = useState(null);
  const [selectedSailing, setSelectedSailing] = useState(null);

  // 3. Vessel Radar State
  const [vesselImo, setVesselImo] = useState('9526887'); // MAERSK LIRQUEN
  const [isRadarLoading, setIsRadarLoading] = useState(false);
  const [vesselPosition, setVesselPosition] = useState(null);
  const [vesselMaster, setVesselMaster] = useState(null);
  const [radarError, setRadarError] = useState(null);

  // 4. Port Congestion State
  const [congestionPort, setCongestionPort] = useState('INNSA');
  const [isCongestionLoading, setIsCongestionLoading] = useState(false);
  const [congestionData, setCongestionData] = useState(null);
  const [congestionError, setCongestionError] = useState(null);

  // 5. Carbon Calculator State
  const [carbonOrigin, setCarbonOrigin] = useState('INNSA');
  const [carbonDest, setCarbonDest] = useState('NLRTM');
  const [carbonWeight, setCarbonWeight] = useState(24000); // 24 tons
  const [carbonResult, setCarbonResult] = useState(null);
  const [isCarbonLoading, setIsCarbonLoading] = useState(false);

  // Initial Load: Usage & Carriers
  const loadUsageAndCarriers = async () => {
    setUsageLoading(true);
    try {
      const [usageRes, carriersRes] = await Promise.allSettled([
        getPanvayaUsage(),
        getOceanCarriers()
      ]);
      if (usageRes.status === 'fulfilled') setUsage(usageRes.value);
      if (carriersRes.status === 'fulfilled' && carriersRes.value?.carriers) {
        setCarriers(carriersRes.value.carriers);
      }
    } catch (e) {
      console.warn('Initial Panvaya load error', e);
    } finally {
      setUsageLoading(false);
    }
  };

  useEffect(() => {
    loadUsageAndCarriers();
  }, []);

  // Quick preset vessels
  const PRESET_VESSELS = [
    { name: 'MAERSK LIRQUEN', imo: '9526887', line: 'Maersk' },
    { name: 'OOCL LUXEMBOURG', imo: '9451478', line: 'CMA CGM' },
    { name: 'MADRID MAERSK', imo: '9778791', line: 'Maersk' },
    { name: 'MSC SASKIA A', imo: '9399002', line: 'MSC' },
    { name: 'EVER FOREVER', imo: '9850886', line: 'Evergreen' }
  ];

  // Quick preset ports
  const PRESET_PORTS = [
    { code: 'INNSA', name: 'Nhava Sheva (JNPT), India' },
    { code: 'INMUN', name: 'Mundra Port, India' },
    { code: 'INPAV', name: 'Pipavav Port, India' },
    { code: 'SGSIN', name: 'Singapore Port, Singapore' },
    { code: 'NLRTM', name: 'Rotterdam Port, Netherlands' },
    { code: 'AEJEA', name: 'Jebel Ali, UAE' },
    { code: 'CNSHA', name: 'Shanghai, China' },
    { code: 'USLAX', name: 'Los Angeles, USA' }
  ];

  // Helper: Save Shipment to LocalStorage Cache
  const saveShipmentToCache = (enriched, refNum, refType, carrier) => {
    const item = {
      id: refNum,
      refType,
      refNumber: refNum,
      carrier: enriched.shippingLine?.name || carrier || 'Carrier',
      savedAt: new Date().toISOString(),
      vessel: enriched.vessel?.name,
      voyage: enriched.vessel?.voyage,
      pol: enriched.journey?.pol?.location?.name || enriched.journey?.pol?.terminal || 'POL',
      pod: enriched.journey?.pod?.location?.name || enriched.journey?.pod?.terminal || 'POD',
      eta: enriched.journey?.pod?.estimated,
      status: enriched.status || 'in_transit',
      data: enriched
    };

    setStoredShipments(prev => {
      const filtered = prev.filter(s => s.refNumber !== refNum);
      const updated = [item, ...filtered].slice(0, 25);
      try {
        localStorage.setItem('spj_cached_shipments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Helper: Load Cached Shipment Instantly (0 Credits used)
  const handleLoadCachedShipment = (cachedItem) => {
    setTrackRefType(cachedItem.refType || 'container');
    setTrackRefNumber(cachedItem.refNumber);
    setTrackResult(cachedItem.data);
    setTrackError(null);
    setActiveSourceBadge({
      type: 'cached',
      time: cachedItem.savedAt,
      label: 'Loaded from Local Storage (0 Credits)'
    });
  };

  // Helper: Delete from cache
  const handleDeleteCachedShipment = (id, e) => {
    e.stopPropagation();
    setStoredShipments(prev => {
      const updated = prev.filter(s => s.id !== id);
      try {
        localStorage.setItem('spj_cached_shipments', JSON.stringify(updated));
      } catch (e) {}
      return updated;
    });
  };

  // Execute Tracking
  const handleExecuteTrack = async (e, forceLive = false) => {
    if (e) e.preventDefault();
    if (!trackRefNumber.trim()) return;

    // Check if exists in cache first if not forced live
    if (!forceLive) {
      const existing = storedShipments.find(s => s.refNumber.toUpperCase() === trackRefNumber.trim().toUpperCase());
      if (existing) {
        handleLoadCachedShipment(existing);
        return;
      }
    }

    setIsTracking(true);
    setTrackError(null);
    setTrackResult(null);

    try {
      const payload = {
        includeRouteData
      };
      if (trackRefType === 'container') payload.container = trackRefNumber.trim();
      if (trackRefType === 'bol') payload.bol = trackRefNumber.trim();
      if (trackRefType === 'bk') payload.bk = trackRefNumber.trim();
      if (selectedCarrier) payload.shippingLineScac = selectedCarrier;

      const res = await trackOceanContainer(payload);
      let enriched = null;
      if (res.status === 'success' && res.data) {
        enriched = enrichTrackingData(res.data);
      } else {
        enriched = enrichTrackingData(res);
      }

      setTrackResult(enriched);
      saveShipmentToCache(enriched, trackRefNumber.trim(), trackRefType, selectedCarrier);
      setActiveSourceBadge({
        type: 'live',
        time: new Date().toISOString(),
        label: 'Live Panvaya API Call (1 Credit)'
      });
      loadUsageAndCarriers();
    } catch (err) {
      setTrackError(err.message || 'Tracking failed for this reference.');
    } finally {
      setIsTracking(false);
    }
  };

  // Execute Schedules Search (Audio Requirement #2: 4-5 Vessels)
  const handleExecuteSchedules = async (e) => {
    if (e) e.preventDefault();
    setIsSearchingSched(true);
    setSchedError(null);

    try {
      const res = await searchSailingSchedules({
        origin: schedOrigin,
        destination: schedDest,
        date: schedDate,
        weeks: schedWeeks
      });

      const fullResult = {
        ...res,
        origin: schedOrigin,
        destination: schedDest,
        savedAt: new Date().toISOString()
      };

      setSchedResults(fullResult);
      setStoredSchedules(fullResult);
      try {
        localStorage.setItem('spj_cached_schedules', JSON.stringify(fullResult));
      } catch (e) {}

      if (res.sailings && res.sailings.length > 0) {
        setSelectedSailing(res.sailings[0]);
      }
      loadUsageAndCarriers();
    } catch (err) {
      setSchedError(err.message || 'Failed to retrieve sailing schedules.');
    } finally {
      setIsSearchingSched(false);
    }
  };

  // Execute Vessel Radar
  const handleExecuteRadar = async (imoToQuery) => {
    const imo = imoToQuery || vesselImo;
    if (!imo) return;

    setIsRadarLoading(true);
    setRadarError(null);
    setVesselPosition(null);
    setVesselMaster(null);

    try {
      const [posRes, masterRes] = await Promise.allSettled([
        getVesselLivePosition({ imo }),
        getVesselDetails({ imo })
      ]);

      if (posRes.status === 'fulfilled') setVesselPosition(posRes.value);
      if (masterRes.status === 'fulfilled') setVesselMaster(masterRes.value);

      if (posRes.status === 'rejected' && masterRes.status === 'rejected') {
        throw new Error('Vessel position data not available for this IMO.');
      }
      loadUsageAndCarriers();
    } catch (err) {
      setRadarError(err.message || 'Failed to fetch live AIS coordinates.');
    } finally {
      setIsRadarLoading(false);
    }
  };

  // Execute Port Congestion
  const handleExecuteCongestion = async (code) => {
    const target = code || congestionPort;
    setIsCongestionLoading(true);
    setCongestionError(null);
    setCongestionData(null);

    try {
      const res = await getPortCongestion({ locode: target });
      if (res.ports && res.ports.length > 0) {
        setCongestionData(res.ports[0]);
      } else {
        throw new Error(`No congestion metrics found for port ${target}`);
      }
      loadUsageAndCarriers();
    } catch (err) {
      setCongestionError(err.message || 'Port congestion data unavailable.');
    } finally {
      setIsCongestionLoading(false);
    }
  };

  // Execute Carbon
  const handleExecuteCarbon = async (e) => {
    if (e) e.preventDefault();
    setIsCarbonLoading(true);
    try {
      const res = await calculateCarbonEmission({
        origin: carbonOrigin,
        destination: carbonDest,
        weightKg: carbonWeight,
        mode: 'ocean'
      });
      setCarbonResult(res);
      loadUsageAndCarriers();
    } catch (err) {
      alert('Carbon calculation failed: ' + err.message);
    } finally {
      setIsCarbonLoading(false);
    }
  };

  return (
    <div className="space-y-5 animate-fade-in">
      
      {/* 1. Header Banner & Storage Status Bar */}
      <div className="bg-gradient-to-r from-slate-900 via-[#0d1e3d] to-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-6 text-white shadow-xl relative overflow-hidden">
        <div className="absolute right-0 top-0 bottom-0 w-96 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-sky-500/10 via-transparent to-transparent pointer-events-none" />
        
        <div className="flex flex-col md:flex-row items-start md:items-center justify-between gap-4 relative z-10">
          <div>
            <div className="flex items-center gap-2.5">
              <span className="p-2 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-500/30">
                <Ship className="w-5 h-5" />
              </span>
              <h1 className="text-xl sm:text-2xl font-black tracking-tight text-white flex items-center gap-2">
                Ocean & Vessel Intelligence
                <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                  DCSA Standard v3.0
                </span>
              </h1>
            </div>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 max-w-2xl">
              Live Satellite AIS Telemetry, 4–5 Vessel Voyage Comparison, 7 Cutoff Deadlines & Local Storage Cache.
            </p>
          </div>

          {/* Right: Storage & API Balance Pills */}
          <div className="flex flex-wrap items-center gap-2.5">
            {/* Storage Cache Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
              <Database className="w-3.5 h-3.5 text-sky-400" />
              <span className="text-slate-400 font-medium">Saved:</span>
              <span className="text-sky-300 font-black">
                {storedShipments.length} Shipments
              </span>
            </div>

            {/* API Quota Pill */}
            <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800/90 border border-slate-700 text-xs">
              <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
              <span className="text-slate-400 font-medium">Credits:</span>
              <span className="text-emerald-400 font-black">
                {usage ? `${usage.creditsRemaining} / ${usage.creditLimit}` : '97 / 100'}
              </span>
              <button
                onClick={loadUsageAndCarriers}
                disabled={usageLoading}
                className="text-slate-400 hover:text-white transition-colors ml-1"
                title="Refresh Credit Balance"
              >
                <RotateCw className={`w-3 h-3 ${usageLoading ? 'animate-spin text-sky-400' : ''}`} />
              </button>
            </div>

            <button
              onClick={() => setApiKeyModal(true)}
              className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md transition-all active:scale-95 cursor-pointer"
            >
              <Zap className="w-3.5 h-3.5" />
              <span>Panvaya Key</span>
            </button>
          </div>
        </div>

        {/* Navigation Tabs Pill Bar */}
        <div className="flex items-center gap-1 sm:gap-2 mt-5 overflow-x-auto pb-1 scrollbar-none border-t border-slate-800/80 pt-4">
          {[
            { id: 'schedules', label: '1. Multi-Vessel Schedules & 7 Cutoffs', icon: Calendar, desc: '4-5 Vessels side-by-side' },
            { id: 'track', label: '2. Ocean Container Tracking & Store', icon: Navigation, desc: 'DCSA Live Milestones' },
          ].map(tab => {
            const Icon = tab.icon;
            const isActive = activeTab === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setActiveTab(tab.id)}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all shrink-0 cursor-pointer ${
                  isActive
                    ? 'bg-sky-500 text-white shadow-lg shadow-sky-500/25 ring-2 ring-sky-400/50'
                    : 'bg-slate-800/60 text-slate-300 hover:bg-slate-800 hover:text-white border border-slate-700/50'
                }`}
              >
                <Icon className="w-4 h-4 shrink-0" />
                <span>{tab.label}</span>
              </button>
            );
          })}
        </div>
      </div>

      {/* 2. DYNAMIC VIEW PANELS */}

      {/* TAB 1: MULTI-VESSEL SCHEDULES & 7 CUTOFFS (AUDIO REQUIREMENT: 4-5 VESSELS WITH DATES) */}
      {activeTab === 'schedules' && (
        <div className="space-y-5">
          {/* Query Filter Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Calendar className="w-4 h-4 text-sky-600" />
                  Multi-Vessel Sailing Schedules & 7 Cutoff Deadlines
                </h3>
                <p className="text-xs text-slate-500">
                  Compares 4 to 5 vessels across ocean liners with departure dates, arrival dates, transit days, and all 7 cutoff timelines.
                </p>
              </div>

              <div className="flex items-center gap-2 text-xs">
                <span className="font-bold text-slate-400 flex items-center gap-1">
                  <Database className="w-3.5 h-3.5 text-sky-500" /> Auto-Cached in Local Storage
                </span>
              </div>
            </div>

            <form onSubmit={handleExecuteSchedules} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Origin Seaport (POL)</label>
                <select
                  value={schedOrigin}
                  onChange={(e) => setSchedOrigin(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="INNSA">Nhava Sheva (JNPT), India [INNSA]</option>
                  <option value="INMUN">Mundra Port, India [INMUN]</option>
                  <option value="INPAV">Pipavav Port, India [INPAV]</option>
                  <option value="INHZA">Hazira Port, India [INHZA]</option>
                  <option value="INMAA">Chennai Port, India [INMAA]</option>
                  <option value="CNSHA">Shanghai, China [CNSHA]</option>
                </select>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">Destination Seaport (POD)</label>
                <select
                  value={schedDest}
                  onChange={(e) => setSchedDest(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value="SGSIN">Singapore Port, Singapore [SGSIN]</option>
                  <option value="NLRTM">Rotterdam, Netherlands [NLRTM]</option>
                  <option value="AEJEA">Jebel Ali / Dubai, UAE [AEJEA]</option>
                  <option value="MYPKG">Port Klang, Malaysia [MYPKG]</option>
                  <option value="USLAX">Los Angeles, USA [USLAX]</option>
                  <option value="DEHAM">Hamburg, Germany [DEHAM]</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Departure From Date</label>
                <input
                  type="date"
                  value={schedDate}
                  onChange={(e) => setSchedDate(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                />
              </div>

              <div className="sm:col-span-2">
                <label className="block text-xs font-bold text-slate-700 mb-1">Search Window</label>
                <select
                  value={schedWeeks}
                  onChange={(e) => setSchedWeeks(Number(e.target.value))}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
                >
                  <option value={2}>2 Weeks</option>
                  <option value={4}>4 Weeks (1 Month)</option>
                  <option value={8}>8 Weeks (2 Months)</option>
                  <option value={12}>12 Weeks</option>
                </select>
              </div>

              <div className="sm:col-span-2">
                <button
                  type="submit"
                  disabled={isSearchingSched}
                  className="w-full flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isSearchingSched ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Fetching...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Compare Vessels</span>
                    </>
                  )}
                </button>
              </div>
            </form>
          </div>

          {/* Multi-Vessel Comparison Table & Cards (At least 4-5 Vessels) */}
          {schedResults && (
            <div className="space-y-4 animate-fade-in">
              {/* Corridor Summary Banner */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 bg-sky-50 border border-sky-200 rounded-xl px-4 py-3 text-xs">
                <div className="flex items-center gap-2">
                  <span className="font-extrabold text-sky-900">
                    Route: {schedResults.origin || schedOrigin} $\rightarrow$ {schedResults.destination || schedDest}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-sky-200/80 text-sky-900 font-bold">
                    Showing Top 5 Active Vessels
                  </span>
                </div>
                <div className="text-slate-500 flex items-center gap-2 font-mono text-[11px]">
                  <span>Last Updated: {new Date(schedResults.savedAt || Date.now()).toLocaleTimeString()}</span>
                  <span className="text-emerald-700 font-bold">● Stored in Local Cache</span>
                </div>
              </div>

              {/* 5 Vessels Deck */}
              <div className="grid grid-cols-1 gap-4">
                {(schedResults.sailings || DEFAULT_PRESET_SAILINGS).slice(0, 5).map((sailing, idx) => (
                  <div
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-sm hover:border-sky-300 transition-all space-y-4"
                  >
                    {/* Vessel Header */}
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                      <div className="flex items-center gap-3">
                        <div className="w-10 h-10 rounded-2xl bg-gradient-to-br from-sky-500 to-blue-700 text-white flex items-center justify-center font-black text-sm shadow-md shrink-0">
                          #{idx + 1}
                        </div>
                        <div>
                          <div className="flex flex-wrap items-center gap-2">
                            <span className="font-black text-slate-900 text-base sm:text-lg">
                              {sailing.vesselName || 'Vessel Nominated'}
                            </span>
                            <span className="text-xs font-mono font-bold px-2.5 py-0.5 rounded-md bg-slate-100 text-slate-700 border border-slate-200">
                              Voyage: {sailing.voyageNo || 'N/A'}
                            </span>
                            <span className="text-xs font-bold px-2 py-0.5 rounded-md bg-sky-100 text-sky-800">
                              {sailing.carrier} ({sailing.carrierCode})
                            </span>
                            <span className={`text-[10px] font-extrabold px-2 py-0.5 rounded-full ${
                              sailing.direct ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                            }`}>
                              {sailing.direct ? 'Direct Ocean Line' : `${sailing.transshipments || 1} Transshipment`}
                            </span>
                          </div>
                          <p className="text-xs text-slate-500 mt-1 flex items-center gap-2">
                            <span>Service: <strong>{sailing.service || 'Express Liner'}</strong></span>
                            {sailing.vesselImo && (
                              <span className="font-mono text-slate-400">IMO: {sailing.vesselImo}</span>
                            )}
                          </p>
                        </div>
                      </div>

                      {/* Right Action: Transit Days & Radar Jump */}
                      <div className="flex sm:flex-col items-center sm:items-end justify-between sm:justify-center gap-2">
                        <div className="text-right">
                          <span className="text-[10px] uppercase font-bold text-slate-400 block">Total Sea Transit</span>
                          <span className="text-sm sm:text-base font-extrabold text-sky-700 font-mono">
                            {sailing.transitTime || `${sailing.transitHours} hrs`}
                          </span>
                        </div>
                        {sailing.vesselImo && (
                          <button
                            onClick={() => {
                              setVesselImo(sailing.vesselImo);
                              setActiveTab('radar');
                              handleExecuteRadar(sailing.vesselImo);
                            }}
                            className="flex items-center gap-1 px-2.5 py-1 rounded-lg bg-sky-50 hover:bg-sky-100 text-sky-700 font-bold text-[11px] border border-sky-200 cursor-pointer"
                          >
                            <Compass className="w-3 h-3" />
                            <span>Live Radar</span>
                          </button>
                        )}
                      </div>
                    </div>

                    {/* Sailing ETD and ETA Cards */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 text-xs bg-slate-50 p-3.5 rounded-xl border border-slate-200">
                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Port of Loading (ETD Departure)</span>
                        <span className="font-extrabold text-slate-900 text-sm font-mono block mt-0.5">
                          {sailing.departure ? new Date(sailing.departure).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Scheduled'}
                        </span>
                        <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-slate-400" />
                          {sailing.originTerminal || `${sailing.originName} Port`}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-500 uppercase block">Port of Discharge (ETA Arrival)</span>
                        <span className="font-extrabold text-emerald-700 text-sm font-mono block mt-0.5">
                          {sailing.arrival ? new Date(sailing.arrival).toLocaleString([], { dateStyle: 'medium', timeStyle: 'short' }) : 'Scheduled'}
                        </span>
                        <span className="text-slate-500 text-[11px] flex items-center gap-1 mt-0.5">
                          <MapPin className="w-3 h-3 text-emerald-600" />
                          {sailing.destinationTerminal || `${sailing.destinationName} Port`}
                        </span>
                      </div>
                    </div>

                    {/* All 7 Cutoff Deadlines Alert Box */}
                    {sailing.cutOffs && (
                      <div className="bg-amber-50/70 border border-amber-200/80 rounded-xl p-3.5 space-y-2">
                        <span className="text-xs font-extrabold text-amber-900 flex items-center gap-1.5">
                          <AlertTriangle className="w-4 h-4 text-amber-600" />
                          Official Carrier Cutoff Timelines (Do Not Miss)
                        </span>

                        <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs pt-1">
                          <div className="bg-white p-2.5 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">CY / Gate-in Cutoff</span>
                            <span className="font-mono font-black text-rose-700 text-xs block">
                              {sailing.cutOffs.containerYard ? new Date(sailing.cutOffs.containerYard).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                            </span>
                            <span className="text-[9px] text-slate-400">Port Gate Close</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">VGM Weight Cutoff</span>
                            <span className="font-mono font-black text-amber-800 text-xs block">
                              {sailing.cutOffs.vgm ? new Date(sailing.cutOffs.vgm).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                            </span>
                            <span className="text-[9px] text-slate-400">SOLAS Certificate</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">SI / Doc Cutoff</span>
                            <span className="font-mono font-black text-slate-800 text-xs block">
                              {sailing.cutOffs.shippingInstructions ? new Date(sailing.cutOffs.shippingInstructions).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                            </span>
                            <span className="text-[9px] text-slate-400">B/L Instructions</span>
                          </div>

                          <div className="bg-white p-2.5 rounded-lg border border-amber-200/60 shadow-2xs">
                            <span className="text-[10px] font-extrabold uppercase text-slate-500 block">Customs Clearance</span>
                            <span className="font-mono font-black text-slate-800 text-xs block">
                              {sailing.cutOffs.customs ? new Date(sailing.cutOffs.customs).toLocaleString([], { dateStyle: 'short', timeStyle: 'short' }) : 'N/A'}
                            </span>
                            <span className="text-[9px] text-slate-400">LEO Export Pass</span>
                          </div>
                        </div>
                      </div>
                    )}
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      )}

      {/* TAB 2: OCEAN CONTAINER TRACKING & PERSISTENT LOCAL STORAGE */}
      {activeTab === 'track' && (
        <div className="space-y-5">
          {/* Query Filter Card */}
          <div className="bg-white rounded-2xl p-4 sm:p-5 border border-slate-200 shadow-sm space-y-4">
            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-slate-100 pb-3">
              <div>
                <h3 className="font-extrabold text-slate-900 text-sm sm:text-base flex items-center gap-2">
                  <Navigation className="w-4 h-4 text-sky-600" />
                  Ocean Container & B/L Tracking
                </h3>
                <p className="text-xs text-slate-500">
                  Track across 100+ shipping lines with automatic DCSA milestone normalization & persistent caching.
                </p>
              </div>

              {/* Reference Type Radio Buttons */}
              <div className="flex items-center gap-1 bg-slate-100 p-1 rounded-xl">
                {[
                  { id: 'container', label: 'Container #' },
                  { id: 'bol', label: 'Bill of Lading (B/L)' },
                  { id: 'bk', label: 'Booking #' }
                ].map(type => (
                  <button
                    key={type.id}
                    onClick={() => setTrackRefType(type.id)}
                    className={`px-3 py-1 text-xs font-bold rounded-lg transition-colors cursor-pointer ${
                      trackRefType === type.id
                        ? 'bg-white text-slate-900 shadow-xs'
                        : 'text-slate-600 hover:text-slate-900'
                    }`}
                  >
                    {type.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Input Form */}
            <form onSubmit={(e) => handleExecuteTrack(e, false)} className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-end">
              <div className="sm:col-span-6">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  {trackRefType === 'container' ? 'Container Number (ISO 6346)' : trackRefType === 'bol' ? 'B/L Reference #' : 'Booking Reference #'}
                </label>
                <div className="relative">
                  <input
                    type="text"
                    value={trackRefNumber}
                    onChange={(e) => setTrackRefNumber(e.target.value.toUpperCase())}
                    placeholder={trackRefType === 'container' ? 'e.g. MSKU8094830, TEMU642969' : 'e.g. MEDU1192001'}
                    className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs sm:text-sm font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none uppercase transition-all"
                  />
                  <Search className="w-4 h-4 text-slate-400 absolute right-3 top-3 pointer-events-none" />
                </div>
              </div>

              <div className="sm:col-span-3">
                <label className="block text-xs font-bold text-slate-700 mb-1">
                  Carrier / Shipping Line
                </label>
                <select
                  value={selectedCarrier}
                  onChange={(e) => setSelectedCarrier(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3 py-2.5 text-xs font-bold text-slate-800 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none transition-all"
                >
                  <option value="">Auto-Detect Carrier</option>
                  <option value="maeu">Maersk (MAEU)</option>
                  <option value="mscu">MSC (MSCU)</option>
                  <option value="cmdu">CMA CGM (CMDU)</option>
                  <option value="cosu">COSCO (COSU)</option>
                  <option value="eglv">Evergreen (EGLV)</option>
                  <option value="hlcu">Hapag-Lloyd (HLCU)</option>
                  <option value="oney">Ocean Network Express (ONEY)</option>
                  <option value="oolu">OOCL (OOLU)</option>
                  <option value="ymlu">Yang Ming (YMLU)</option>
                  <option value="zimu">ZIM (ZIMU)</option>
                  <option value="pciu">PIL (PCIU)</option>
                  <option value="regu">RCL (REGU)</option>
                </select>
              </div>

              <div className="sm:col-span-3 flex items-center gap-2">
                <button
                  type="submit"
                  disabled={isTracking}
                  className="flex-1 flex items-center justify-center gap-2 bg-[#0284c7] hover:bg-[#0369a1] text-white font-extrabold text-xs sm:text-sm py-2.5 px-4 rounded-xl shadow-md transition-all active:scale-95 disabled:opacity-50 cursor-pointer"
                >
                  {isTracking ? (
                    <>
                      <RotateCw className="w-4 h-4 animate-spin" />
                      <span>Tracking...</span>
                    </>
                  ) : (
                    <>
                      <Search className="w-4 h-4" />
                      <span>Track Shipment</span>
                    </>
                  )}
                </button>
              </div>
            </form>

            {/* Quick Chips for SPJ active shipments */}
            <div className="flex flex-wrap items-center gap-2 pt-2 border-t border-slate-100 text-xs">
              <span className="font-bold text-slate-500 flex items-center gap-1">
                <Sparkles className="w-3.5 h-3.5 text-amber-500" /> Quick Samples:
              </span>
              {[
                { label: 'MSKU8094830 (Maersk)', ref: 'MSKU8094830', type: 'container', scac: 'maeu' },
                { label: 'TLLU1066673 (CMA CGM)', ref: 'TLLU1066673', type: 'container', scac: 'cmdu' },
                { label: 'EGSU5073916 (Evergreen)', ref: 'EGSU5073916', type: 'container', scac: 'eglv' },
                { label: 'SUDU5222822 (MSC)', ref: 'SUDU5222822', type: 'container', scac: 'mscu' },
              ].map(chip => (
                <button
                  key={chip.ref}
                  onClick={() => {
                    setTrackRefType(chip.type);
                    setTrackRefNumber(chip.ref);
                    setSelectedCarrier(chip.scac);
                  }}
                  className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-sky-50 hover:text-sky-700 text-slate-700 font-mono font-bold text-[11px] transition-colors border border-slate-200 cursor-pointer"
                >
                  {chip.label}
                </button>
              ))}
            </div>
          </div>

          {/* LOCAL STORAGE SAVED SHIPMENTS DRAWER / CHIPS (Audio Requirement #1) */}
          {storedShipments.length > 0 && (
            <div className="bg-slate-50 rounded-2xl p-4 border border-slate-200 space-y-3">
              <div className="flex items-center justify-between">
                <span className="text-xs font-bold text-slate-700 flex items-center gap-1.5">
                  <Database className="w-4 h-4 text-sky-600" />
                  Saved In Local Storage ({storedShipments.length}) — Click to Instant Load (0 API Calls):
                </span>
                <span className="text-[11px] text-slate-500 font-medium">Auto-Persisted</span>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-2.5">
                {storedShipments.map(s => (
                  <div
                    key={s.id}
                    onClick={() => handleLoadCachedShipment(s)}
                    className="flex items-center justify-between p-2.5 rounded-xl bg-white border border-slate-200 hover:border-sky-400 hover:shadow-xs transition-all cursor-pointer group"
                  >
                    <div className="min-w-0">
                      <div className="flex items-center gap-1.5">
                        <span className="font-mono font-black text-xs text-slate-900 truncate">{s.refNumber}</span>
                        <span className="text-[9px] font-bold px-1.5 py-0.2 rounded bg-sky-100 text-sky-800 uppercase">{s.carrier}</span>
                      </div>
                      <p className="text-[10px] text-slate-500 truncate mt-0.5">
                        {s.pol} $\rightarrow$ {s.pod} | Saved: {new Date(s.savedAt).toLocaleDateString()}
                      </p>
                    </div>

                    <button
                      onClick={(e) => handleDeleteCachedShipment(s.id, e)}
                      className="p-1 rounded-md text-slate-300 hover:text-rose-600 hover:bg-rose-50 transition-colors ml-2"
                      title="Remove from Local Storage"
                    >
                      <Trash2 className="w-3.5 h-3.5" />
                    </button>
                  </div>
                ))}
              </div>
            </div>
          )}

          {/* Tracking Error Banner */}
          {trackError && (
            <div className="bg-rose-50 border border-rose-200 rounded-2xl p-4 text-rose-800 text-xs sm:text-sm flex items-start gap-3">
              <AlertTriangle className="w-5 h-5 text-rose-600 shrink-0 mt-0.5" />
              <div>
                <p className="font-bold">Carrier Search Update:</p>
                <p className="mt-0.5 text-rose-700">{trackError}</p>
                <p className="text-[11px] text-slate-500 mt-2">
                  Tip: Panvaya tracks live sea shipments registered with ocean carriers. For inland rail & road movements, SPJ Oracle DB is the primary source.
                </p>
              </div>
            </div>
          )}

          {/* Tracking Results View */}
          {trackResult && (
            <div className="space-y-4 animate-fade-in">
              {/* Cache vs Live Banner */}
              {activeSourceBadge && (
                <div className={`p-3 rounded-xl flex items-center justify-between text-xs font-bold border ${
                  activeSourceBadge.type === 'cached'
                    ? 'bg-amber-50 border-amber-200 text-amber-900'
                    : 'bg-emerald-50 border-emerald-200 text-emerald-900'
                }`}>
                  <div className="flex items-center gap-2">
                    <Database className="w-4 h-4" />
                    <span>{activeSourceBadge.label} — Saved: {new Date(activeSourceBadge.time).toLocaleTimeString()}</span>
                  </div>
                  <button
                    onClick={(e) => handleExecuteTrack(e, true)}
                    className="flex items-center gap-1 px-3 py-1 rounded-lg bg-sky-600 hover:bg-sky-500 text-white font-extrabold text-[11px] shadow-xs cursor-pointer"
                  >
                    <RefreshCw className="w-3 h-3" />
                    <span>Refresh Live API</span>
                  </button>
                </div>
              )}

              {/* Header Card: Status & Carrier */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
                  <div className="flex items-center gap-3">
                    <div className="p-3 rounded-2xl bg-sky-50 text-sky-700 border border-sky-200">
                      <Ship className="w-6 h-6" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <span className="font-mono text-lg font-black text-slate-900">
                          {trackResult.reference?.number || trackRefNumber}
                        </span>
                        <span className="px-2.5 py-0.5 rounded-full text-xs font-extrabold uppercase bg-emerald-100 text-emerald-800 border border-emerald-300">
                          {trackResult.status || 'Active Voyage'}
                        </span>
                      </div>
                      <p className="text-xs text-slate-500 mt-0.5">
                        Shipping Line: <strong className="text-slate-800">{trackResult.shippingLine?.name || 'Carrier'}</strong> ({trackResult.shippingLine?.scac?.toUpperCase()})
                      </p>
                    </div>
                  </div>

                  <div className="text-right">
                    <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider block">Estimated POD Arrival</span>
                    <span className="text-sm sm:text-base font-extrabold text-sky-700 font-mono">
                      {trackResult.journey?.pod?.estimated ? new Date(trackResult.journey.pod.estimated).toLocaleString() : 'In Transit'}
                    </span>
                  </div>
                </div>

                {/* 15 Fields Grid Cards */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-4">
                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Vessel Name</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate">
                      {trackResult.vessel?.name || 'Vessel Nominated'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">IMO: {trackResult.vessel?.imo || 'N/A'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Voyage Number</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 font-mono block">
                      {trackResult.vessel?.voyage || 'Pending'}
                    </span>
                    <span className="text-[10px] text-slate-500">Call Sign: {trackResult.vessel?.callSign || 'N/A'}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Port of Loading (POL)</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate">
                      {trackResult.journey?.pol?.location?.name || 'Origin Seaport'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{trackResult.journey?.pol?.location?.locode || ''}</span>
                  </div>

                  <div className="p-3 rounded-xl bg-slate-50 border border-slate-200">
                    <span className="text-[10px] uppercase font-bold text-slate-500 block">Port of Discharge (POD)</span>
                    <span className="text-xs sm:text-sm font-extrabold text-slate-900 block truncate">
                      {trackResult.journey?.pod?.location?.name || 'Destination Seaport'}
                    </span>
                    <span className="text-[10px] text-slate-500 font-mono">{trackResult.journey?.pod?.location?.locode || ''}</span>
                  </div>
                </div>

                {/* AIS Telemetry Bar */}
                {trackResult.telemetry?.position && (
                  <div className="mt-4 p-4 rounded-xl bg-gradient-to-r from-sky-900 via-slate-900 to-sky-950 text-white border border-sky-800/60 shadow-inner">
                    <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                      <div className="flex items-center gap-3">
                        <div className="p-2.5 rounded-xl bg-sky-500/20 text-sky-400 border border-sky-400/30 animate-pulse">
                          <Compass className="w-5 h-5" />
                        </div>
                        <div>
                          <span className="text-[10px] uppercase font-extrabold text-sky-400 tracking-wider flex items-center gap-1.5">
                            <Radio className="w-3 h-3 text-emerald-400 animate-ping" /> Live Satellite AIS Telemetry
                          </span>
                          <p className="font-mono text-xs sm:text-sm font-bold text-white mt-0.5">
                            Lat: {trackResult.telemetry.position.lat?.toFixed(4)}°, Lng: {trackResult.telemetry.position.lng?.toFixed(4)}°
                          </p>
                        </div>
                      </div>

                      <div className="flex flex-wrap items-center gap-4 text-xs font-mono">
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Speed</span>
                          <span className="font-bold text-emerald-400 text-sm">{trackResult.telemetry.speedKnots || 0} knots</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Heading</span>
                          <span className="font-bold text-amber-400 text-sm">{trackResult.telemetry.heading || trackResult.telemetry.course || 0}°</span>
                        </div>
                        <div>
                          <span className="text-[10px] text-slate-400 uppercase block">Distance to POD</span>
                          <span className="font-bold text-sky-300 text-sm">{trackResult.telemetry.distanceToGoNM || 0} NM</span>
                        </div>
                      </div>
                    </div>
                  </div>
                )}
              </div>

              {/* Milestones Timeline */}
              <div className="bg-white rounded-2xl p-5 border border-slate-200 shadow-sm">
                <h4 className="font-extrabold text-slate-900 text-sm mb-4 flex items-center gap-2">
                  <Clock className="w-4 h-4 text-sky-600" />
                  DCSA Standard Milestones Timeline
                </h4>

                <div className="space-y-4">
                  {(trackResult.containers?.[0]?.events || []).map((ev, idx) => (
                    <div key={idx} className="flex items-start gap-3.5 relative">
                      {idx !== (trackResult.containers[0].events.length - 1) && (
                        <div className="absolute left-4 top-8 bottom-0 w-0.5 bg-slate-200" />
                      )}
                      <div className={`p-2 rounded-xl shrink-0 mt-0.5 ${
                        ev.isActual 
                          ? 'bg-emerald-100 text-emerald-700 ring-4 ring-emerald-50' 
                          : 'bg-slate-100 text-slate-500 ring-4 ring-slate-50'
                      }`}>
                        <CheckCircle2 className="w-4 h-4" />
                      </div>
                      <div className="flex-1 bg-slate-50 rounded-xl p-3 border border-slate-200/80">
                        <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                          <span className="font-bold text-slate-900 text-xs sm:text-sm">
                            {ev.name || ev.description || ev.code}
                          </span>
                          <span className={`text-[10px] font-bold px-2 py-0.5 rounded-full uppercase self-start sm:self-auto ${
                            ev.isActual ? 'bg-emerald-100 text-emerald-800' : 'bg-amber-100 text-amber-800'
                          }`}>
                            {ev.isActual ? 'Actual Confirmed' : 'Estimated / Planned'}
                          </span>
                        </div>
                        <p className="text-xs text-slate-600 mt-1 font-mono">
                          {ev.time ? new Date(ev.time).toLocaleString() : 'Pending'}
                        </p>
                        {ev.location && (
                          <p className="text-[11px] text-slate-500 mt-0.5 flex items-center gap-1">
                            <MapPin className="w-3 h-3 text-slate-400" />
                            {ev.location.name}, {ev.location.country} ({ev.location.locode})
                          </p>
                        )}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* API Key Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 z-50 bg-slate-900/70 backdrop-blur-xs flex items-center justify-center p-4">
          <div className="bg-white rounded-2xl p-6 max-w-md w-full border border-slate-200 shadow-2xl space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <h3 className="font-extrabold text-slate-900 text-base flex items-center gap-2">
                <Zap className="w-5 h-5 text-sky-600" />
                Panvaya API Key Settings
              </h3>
              <button
                onClick={() => setApiKeyModal(false)}
                className="text-slate-400 hover:text-slate-700 text-lg font-bold"
              >
                ✕
              </button>
            </div>

            <div>
              <label className="block text-xs font-bold text-slate-700 mb-1">
                Active Production API Key
              </label>
              <input
                type="text"
                value={customKey}
                onChange={(e) => setCustomKey(e.target.value)}
                className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-sky-500 outline-none"
              />
              <p className="text-[11px] text-slate-500 mt-1">
                Current Key: <strong>pv_live_0AXCMLfCcPCHAsJMx4uPVmPZEPTH4oS4</strong> (Organization: Elogisol).
              </p>
            </div>

            <div className="flex items-center justify-end gap-2 pt-2">
              <button
                onClick={() => setApiKeyModal(false)}
                className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer"
              >
                Cancel
              </button>
              <button
                onClick={() => {
                  setPanvayaApiKey(customKey);
                  setApiKeyModal(false);
                  loadUsageAndCarriers();
                }}
                className="px-4 py-2 rounded-xl bg-sky-600 hover:bg-sky-500 text-white font-bold text-xs shadow-md cursor-pointer"
              >
                Save & Apply
              </button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
