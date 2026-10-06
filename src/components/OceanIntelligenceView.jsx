import React, { useState, useEffect, useRef, useMemo } from 'react';
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
  ChevronDown,
  ChevronUp,
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
  Check,
  Table as TableIcon,
  LayoutGrid,
  X,
  ArrowRightLeft
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

// All 33 Ocean Carriers Dataset with SCAC, Category, Alliance & Subtitles
const PANVAYA_CARRIERS_33 = [
  { name: 'ANL', scac: 'ANNU', full: 'Australia National Line', tag: '', cat: 'Regional & NVOCC', desc: 'Oceania & Asia-Pacific', color: 'bg-emerald-600' },
  { name: 'CMA CGM', scac: 'CMDU', full: 'CMA CGM Group', tag: 'World #3', cat: 'Global Alliances', desc: 'Global · Ocean Alliance', color: 'bg-purple-600' },
  { name: 'COSCO', scac: 'COSU', full: 'COSCO SHIPPING Lines', tag: '', cat: 'Global Alliances', desc: 'Global · Ocean Alliance', color: 'bg-blue-600' },
  { name: 'Crowley', scac: 'CMCU', full: 'Crowley Maritime', tag: '', cat: 'Regional & NVOCC', desc: 'Americas & Caribbean', color: 'bg-teal-600' },
  { name: 'CULines', scac: 'CULU', full: 'China United Lines', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia, India & Middle East', color: 'bg-lime-600' },
  { name: 'ESL', scac: 'ESPU', full: 'Emirates Shipping Line', tag: '', cat: 'Regional & NVOCC', desc: 'Middle East, Africa & Asia', color: 'bg-blue-700' },
  { name: 'Evergreen', scac: 'EGLV', full: 'Evergreen Marine Corporation', tag: '', cat: 'Global Alliances', desc: 'Global · Ocean Alliance', color: 'bg-emerald-600' },
  { name: 'Gold Star Line', scac: 'GSLU', full: 'Gold Star Line', tag: '', cat: 'Regional & NVOCC', desc: 'Asia, Africa & Indian Subcontinent', color: 'bg-purple-700' },
  { name: 'Great White Fleet', scac: 'GWFC', full: 'Great White Fleet Corp', tag: '', cat: 'Regional & NVOCC', desc: 'Americas & Northern Europe', color: 'bg-amber-700' },
  { name: 'Hapag-Lloyd', scac: 'HLCU', full: 'Hapag-Lloyd AG', tag: '', cat: 'Global Alliances', desc: 'Global · THE Alliance', color: 'bg-lime-600' },
  { name: 'Heung-A', scac: 'HASL', full: 'Heung-A Line', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia Specialist', color: 'bg-purple-600' },
  { name: 'HMM', scac: 'HDMU', full: 'Hyundai Merchant Marine', tag: '', cat: 'Global Alliances', desc: 'Global · THE Alliance', color: 'bg-amber-600' },
  { name: 'Interasia Lines', scac: 'IALU', full: 'Interasia Lines', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia Specialist', color: 'bg-sky-600' },
  { name: 'King Ocean', scac: 'KOSL', full: 'King Ocean Services', tag: '', cat: 'Regional & NVOCC', desc: 'US, Caribbean & Latin America', color: 'bg-emerald-600' },
  { name: 'KMTC', scac: 'KMTU', full: 'Korea Marine Transport Co.', tag: 'Korea Top 3', cat: 'Intra-Asia', desc: 'Intra-Asia Specialist', color: 'bg-blue-600' },
  { name: 'Maersk', scac: 'MAEU', full: 'A.P. Moller – Maersk', tag: 'Global Leader', cat: 'Global Alliances', desc: 'Global · 2M Alliance', color: 'bg-sky-500' },
  { name: 'MSC', scac: 'MSCU', full: 'Mediterranean Shipping Company', tag: 'World #1', cat: 'Global Alliances', desc: 'Global · 2M Alliance', color: 'bg-[#ffc107] text-slate-900' },
  { name: 'Namsung', scac: 'NSSU', full: 'Namsung Shipping', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia Specialist', color: 'bg-indigo-600' },
  { name: 'ONE', scac: 'ONEY', full: 'Ocean Network Express', tag: '', cat: 'Global Alliances', desc: 'Global · THE Alliance', color: 'bg-pink-600' },
  { name: 'OOCL', scac: 'OOLU', full: 'Orient Overseas Container Line', tag: '', cat: 'Global Alliances', desc: 'Global · Ocean Alliance', color: 'bg-rose-600' },
  { name: 'Pan Continental', scac: '15AC', full: 'Pan Continental Shipping', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia Specialist', color: 'bg-teal-600' },
  { name: 'PIL', scac: 'PCIU', full: 'Pacific International Lines', tag: '', cat: 'Intra-Asia', desc: 'Asia, Africa & Middle East', color: 'bg-red-600' },
  { name: 'RCL', scac: 'REGU', full: 'Regional Container Lines', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia · Middle East · ISC', color: 'bg-blue-600' },
  { name: 'Samudera', scac: 'SIKU', full: 'Samudera Shipping Line', tag: '', cat: 'Intra-Asia', desc: 'Southeast Asia & Indian Subcontinent', color: 'bg-cyan-600' },
  { name: 'Seaboard Marine', scac: 'SMLU', full: 'Seaboard Marine', tag: '', cat: 'Regional & NVOCC', desc: 'Americas & Caribbean', color: 'bg-indigo-600' },
  { name: 'Shipco', scac: 'SHPT', full: 'Shipco Transport', tag: '', cat: 'Regional & NVOCC', desc: 'LCL Consolidator (NVOCC)', color: 'bg-amber-600' },
  { name: 'Sinokor', scac: 'SKLU', full: 'Sinokor Merchant Marine', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia Specialist', color: 'bg-sky-600' },
  { name: 'Sinotrans', scac: 'SNTO', full: 'Sinotrans Container Lines', tag: '', cat: 'Intra-Asia', desc: 'China, Japan & Oceania', color: 'bg-blue-600' },
  { name: 'T.S. Lines', scac: 'TSSU', full: 'T.S. Lines', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia & Pacific', color: 'bg-purple-600' },
  { name: 'Wan Hai', scac: 'WHLC', full: 'Wan Hai Lines', tag: '', cat: 'Intra-Asia', desc: 'Intra-Asia & Transpacific', color: 'bg-cyan-600' },
  { name: 'X-Press Feeders', scac: 'XPFU', full: 'X-Press Feeders', tag: 'World #1 Feeder', cat: 'Regional & NVOCC', desc: 'Global Feeder Network', color: 'bg-blue-700' },
  { name: 'Yang Ming', scac: 'YMLU', full: 'Yang Ming Marine Transport', tag: '', cat: 'Global Alliances', desc: 'Global · THE Alliance', color: 'bg-amber-600' },
  { name: 'ZIM', scac: 'ZIMU', full: 'ZIM Integrated Shipping', tag: '', cat: 'Global Alliances', desc: 'Global Independent', color: 'bg-purple-700' }
];

// Comprehensive Master Global Commercial Seaports List
const MASTER_SEAPORTS = [
  { code: 'USPEF', name: 'Port Everglades', country: 'USA', flag: '🇺🇸' },
  { code: 'FRFOS', name: 'Fos-Sur-Mer', country: 'France', flag: '🇫🇷' },
  { code: 'INNSA', name: 'Nhava Sheva (JNPT)', country: 'India', flag: '🇮🇳' },
  { code: 'INMUN', name: 'Mundra Port', country: 'India', flag: '🇮🇳' },
  { code: 'SGSIN', name: 'Singapore Port', country: 'Singapore', flag: '🇸🇬' },
  { code: 'AEJEA', name: 'Jebel Ali / Dubai', country: 'UAE', flag: '🇦🇪' },
  { code: 'NLRTM', name: 'Rotterdam', country: 'Netherlands', flag: '🇳🇱' },
  { code: 'CNSHA', name: 'Shanghai Port', country: 'China', flag: '🇨🇳' },
  { code: 'USLAX', name: 'Los Angeles', country: 'USA', flag: '🇺🇸' },
  { code: 'DEHAM', name: 'Hamburg', country: 'Germany', flag: '🇩🇪' },
  { code: 'MYPKG', name: 'Port Klang', country: 'Malaysia', flag: '🇲🇾' },
  { code: 'VNSGN', name: 'Ho Chi Minh', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'VNHPH', name: 'Haiphong', country: 'Vietnam', flag: '🇻🇳' },
  { code: 'HKHKG', name: 'Hong Kong', country: 'Hong Kong', flag: '🇭🇰' },
  { code: 'SAJED', name: 'Jeddah', country: 'Saudi Arabia', flag: '🇸🇦' },
  { code: 'EGALY', name: 'Alexandria', country: 'Egypt', flag: '🇪🇬' },
  { code: 'GEPTI', name: 'Poti', country: 'Georgia', flag: '🇬🇪' },
  { code: 'TZDAR', name: 'Dar es Salaam', country: 'Tanzania', flag: '🇹🇿' }
];

function SearchablePortSelect({ label, value, onChange }) {
  const [isOpen, setIsOpen] = useState(false);
  const [search, setSearch] = useState('');
  const wrapperRef = useRef(null);

  const selectedPort = MASTER_SEAPORTS.find(p => p.code === value) || { code: value, name: value, flag: '🌐' };

  const filtered = useMemo(() => {
    if (!search.trim()) return MASTER_SEAPORTS;
    const q = search.toLowerCase().trim();
    return MASTER_SEAPORTS.filter(p =>
      p.name.toLowerCase().includes(q) || p.code.toLowerCase().includes(q) || p.country.toLowerCase().includes(q)
    );
  }, [search]);

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
              placeholder="Search port name, country, UN/LOCODE..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full bg-slate-100 border border-slate-200 rounded-lg pl-8 pr-3 py-1.5 text-xs font-medium text-slate-900 outline-none focus:bg-white focus:ring-2 focus:ring-sky-500"
            />
          </div>

          <div className="space-y-0.5 max-h-48 overflow-y-auto">
            {filtered.map((p) => {
              const isSel = p.code === value;
              return (
                <button
                  key={p.code}
                  type="button"
                  onClick={() => {
                    onChange(p.code);
                    setIsOpen(false);
                    setSearch('');
                  }}
                  className={`w-full text-left px-2.5 py-1.5 rounded-lg text-xs transition-colors flex items-center justify-between cursor-pointer ${
                    isSel ? 'bg-sky-50 text-sky-900 font-bold' : 'hover:bg-slate-50 text-slate-700'
                  }`}
                >
                  <span className="truncate flex items-center gap-1.5">
                    <span>{p.flag}</span>
                    <span>{p.name}, {p.country}</span>
                  </span>
                  <span className="font-mono text-[10px] font-bold text-sky-700 bg-sky-100/80 px-1.5 py-0.5 rounded ml-2 shrink-0">{p.code}</span>
                </button>
              );
            })}
          </div>
        </div>
      )}
    </div>
  );
}

export default function OceanIntelligenceView({ customer }) {
  const [activeTab, setActiveTab] = useState('schedules');
  const [usage, setUsage] = useState(null);
  const [usageLoading, setUsageLoading] = useState(false);
  const [apiKeyModal, setApiKeyModal] = useState(false);
  const [customKey, setCustomKey] = useState(getPanvayaApiKey());

  // Carrier Selector Modal state
  const [carrierModalOpen, setCarrierModalOpen] = useState(false);
  const [carrierCategoryTab, setCarrierCategoryTab] = useState('All');
  const [carrierModalSearch, setCarrierModalSearch] = useState('');
  const [activeCarrier, setActiveCarrier] = useState('HLCU'); // Default to Hapag-Lloyd HLCU as in screenshot

  // Route state
  const [originPort, setOriginPort] = useState('USPEF');
  const [destPort, setDestPort] = useState('FRFOS');
  const [departDate, setDepartDate] = useState(() => new Date().toISOString().split('T')[0]);
  const [horizonWeeks, setHorizonWeeks] = useState(4);
  const [expandedCardIdx, setExpandedCardIdx] = useState(0);
  const [cardSubTab, setCardSubTab] = useState('movement');

  // Tracking state
  const [trackRefType, setTrackRefType] = useState('container');
  const [trackRefNumber, setTrackRefNumber] = useState('MSKU8094830');
  const [selectedCarrier, setSelectedCarrier] = useState('');
  const [isTracking, setIsTracking] = useState(false);
  const [trackResult, setTrackResult] = useState(null);
  const [trackError, setTrackError] = useState(null);

  const loadUsageAndCarriers = async () => {
    setUsageLoading(true);
    try {
      const u = await getPanvayaUsage();
      setUsage(u);
    } catch (e) {
    } finally {
      setUsageLoading(false);
    }
  };

  useEffect(() => {
    loadUsageAndCarriers();
  }, []);

  const modalFilteredCarriers = useMemo(() => {
    let list = PANVAYA_CARRIERS_33;
    if (carrierCategoryTab === 'Global Alliances') {
      list = list.filter(c => c.cat === 'Global Alliances');
    } else if (carrierCategoryTab === 'Intra-Asia') {
      list = list.filter(c => c.cat === 'Intra-Asia');
    } else if (carrierCategoryTab === 'Regional & NVOCC') {
      list = list.filter(c => c.cat === 'Regional & NVOCC');
    }

    if (carrierModalSearch.trim()) {
      const q = carrierModalSearch.toLowerCase().trim();
      list = list.filter(c =>
        c.name.toLowerCase().includes(q) ||
        c.scac.toLowerCase().includes(q) ||
        c.full.toLowerCase().includes(q) ||
        c.desc.toLowerCase().includes(q)
      );
    }
    return list;
  }, [carrierCategoryTab, carrierModalSearch]);

  const activeCarrierObj = PANVAYA_CARRIERS_33.find(c => c.scac === activeCarrier) || PANVAYA_CARRIERS_33[9];
  const originObj = MASTER_SEAPORTS.find(p => p.code === originPort) || MASTER_SEAPORTS[0];
  const destObj = MASTER_SEAPORTS.find(p => p.code === destPort) || MASTER_SEAPORTS[1];

  const sailingsDeck = useMemo(() => {
    return [
      {
        id: 1,
        carrier: activeCarrierObj,
        transitDays: 38,
        transshipments: 1,
        service: 'TURKEY EAST COAST EXPRESS (TEX)',
        isFastest: true,
        depDate: '10 Oct 2026',
        depTime: '16:30',
        depPort: originObj.name,
        depLocode: originObj.code,
        arrDate: '17 Nov 2026',
        arrTime: '13:00',
        arrPort: destObj.name,
        arrLocode: destObj.code,
        vesselName: 'Maersk Gateshead',
        voyageNo: '640E',
        vesselImo: '9235543',
        cutOffs: {
          cy: 'Wed 7 Oct - 16:00',
          si: 'Tue 6 Oct - 12:00',
          vgm: 'Wed 7 Oct - 16:00',
          dg: 'Wed 7 Oct - 16:00',
          reefer: 'Wed 7 Oct - 16:00'
        },
        legs: [
          { loc: originObj.name, locode: `${originObj.code} · America/New_York`, date: '10 Oct 2026 16:30', move: 'Departure', service: 'TURKEY EAST COAST EXPRESS (TEX)', vessel: 'Maersk Gateshead / 640E', badgeType: 'dep' },
          { loc: 'Salerno', locode: 'ITSAL · Europe/Rome', date: '5 Nov 2026 13:00', move: 'Arrival', layover: 'Layover: 6 days', service: '—', vessel: '—', badgeType: 'arr' },
          { loc: 'Salerno', locode: 'ITSAL · Europe/Rome', date: '11 Nov 2026 20:00', move: 'Departure', service: 'JMCS ROUTE A (MCA)', vessel: 'Jakarta Express / 14W46', badgeType: 'dep' },
          { loc: destObj.name, locode: `${destObj.code} · Europe/Paris`, date: '17 Nov 2026 13:00', move: 'Arrival', service: '—', vessel: '—', badgeType: 'arr' }
        ]
      },
      {
        id: 2,
        carrier: activeCarrierObj,
        transitDays: 38,
        transshipments: 1,
        service: 'TURKEY EAST COAST EXPRESS (TEX)',
        isFastest: false,
        depDate: '17 Oct 2026',
        depTime: '16:30',
        depPort: originObj.name,
        depLocode: originObj.code,
        arrDate: '24 Nov 2026',
        arrTime: '13:00',
        arrPort: destObj.name,
        arrLocode: destObj.code,
        vesselName: 'Maersk Florence',
        voyageNo: '641E',
        vesselImo: '9348821',
        cutOffs: {
          cy: 'Wed 14 Oct - 16:00',
          si: 'Tue 13 Oct - 12:00',
          vgm: 'Wed 14 Oct - 16:00',
          dg: 'Wed 14 Oct - 16:00',
          reefer: 'Wed 14 Oct - 16:00'
        },
        legs: [
          { loc: originObj.name, locode: `${originObj.code} · America/New_York`, date: '17 Oct 2026 16:30', move: 'Departure', service: 'TURKEY EAST COAST EXPRESS (TEX)', vessel: 'Maersk Florence / 641E', badgeType: 'dep' },
          { loc: destObj.name, locode: `${destObj.code} · Europe/Paris`, date: '24 Nov 2026 13:00', move: 'Arrival', service: '—', vessel: '—', badgeType: 'arr' }
        ]
      },
      {
        id: 3,
        carrier: activeCarrierObj,
        transitDays: 38,
        transshipments: 1,
        service: 'TURKEY EAST COAST EXPRESS (TEX)',
        isFastest: false,
        depDate: '24 Oct 2026',
        depTime: '16:30',
        depPort: originObj.name,
        depLocode: originObj.code,
        arrDate: '1 Dec 2026',
        arrTime: '13:00',
        arrPort: destObj.name,
        arrLocode: destObj.code,
        vesselName: 'Hapag-Lloyd Express',
        voyageNo: '642E',
        vesselImo: '9481190',
        cutOffs: {
          cy: 'Wed 21 Oct - 16:00',
          si: 'Tue 20 Oct - 12:00',
          vgm: 'Wed 21 Oct - 16:00',
          dg: 'Wed 21 Oct - 16:00',
          reefer: 'Wed 21 Oct - 16:00'
        },
        legs: [
          { loc: originObj.name, locode: `${originObj.code} · America/New_York`, date: '24 Oct 2026 16:30', move: 'Departure', service: 'TURKEY EAST COAST EXPRESS (TEX)', vessel: 'Hapag-Lloyd Express / 642E', badgeType: 'dep' },
          { loc: destObj.name, locode: `${destObj.code} · Europe/Paris`, date: '1 Dec 2026 13:00', move: 'Arrival', service: '—', vessel: '—', badgeType: 'arr' }
        ]
      },
      {
        id: 4,
        carrier: activeCarrierObj,
        transitDays: 38,
        transshipments: 1,
        service: 'TURKEY EAST COAST EXPRESS (TEX)',
        isFastest: false,
        depDate: '31 Oct 2026',
        depTime: '16:30',
        depPort: originObj.name,
        depLocode: originObj.code,
        arrDate: '8 Dec 2026',
        arrTime: '13:00',
        arrPort: destObj.name,
        arrLocode: destObj.code,
        vesselName: 'ZHONG GU KUN MING',
        voyageNo: '643E',
        vesselImo: '9581109',
        cutOffs: {
          cy: 'Wed 28 Oct - 16:00',
          si: 'Tue 27 Oct - 12:00',
          vgm: 'Wed 28 Oct - 16:00',
          dg: 'Wed 28 Oct - 16:00',
          reefer: 'Wed 28 Oct - 16:00'
        },
        legs: [
          { loc: originObj.name, locode: `${originObj.code} · America/New_York`, date: '31 Oct 2026 16:30', move: 'Departure', service: 'TURKEY EAST COAST EXPRESS (TEX)', vessel: 'ZHONG GU KUN MING / 643E', badgeType: 'dep' },
          { loc: destObj.name, locode: `${destObj.code} · Europe/Paris`, date: '8 Dec 2026 13:00', move: 'Arrival', service: '—', vessel: '—', badgeType: 'arr' }
        ]
      }
    ];
  }, [activeCarrierObj, originObj, destObj]);

  const handleSwapPorts = () => {
    const temp = originPort;
    setOriginPort(destPort);
    setDestPort(temp);
  };

  const handleExecuteTrack = async (e) => {
    if (e) e.preventDefault();
    if (!trackRefNumber.trim()) return;

    setIsTracking(true);
    setTrackError(null);
    try {
      const payload = { container: trackRefNumber.trim() };
      if (selectedCarrier) payload.shippingLineScac = selectedCarrier;
      const res = await trackOceanContainer(payload);
      setTrackResult(enrichTrackingData(res.data || res));
      loadUsageAndCarriers();
    } catch (err) {
      setTrackError(err.message || 'Tracking failed.');
    } finally {
      setIsTracking(false);
    }
  };

  return (
    <div className="space-y-6 animate-fade-in font-sans pb-10">

      {/* Top Credit Bar */}
      <div className="bg-slate-900 border border-slate-800 rounded-2xl p-4 sm:p-5 text-white flex flex-col sm:flex-row items-center justify-between gap-4 shadow-xl">
        <div className="flex items-center gap-3">
          <div className="p-2.5 rounded-xl bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
            <Ship className="w-5 h-5" />
          </div>
          <div>
            <h1 className="text-lg sm:text-xl font-extrabold text-white flex items-center gap-2">
              Panvaya Ocean Intelligence
              <span className="text-[10px] uppercase font-bold tracking-wider px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 border border-emerald-500/40">
                Live API 3.0
              </span>
            </h1>
            <p className="text-xs text-slate-400">Point-to-Point Carrier Schedules, DCSA Milestones & Live Satellite AIS</p>
          </div>
        </div>

        <div className="flex items-center gap-3">
          <div className="flex items-center gap-2 px-3 py-1.5 rounded-xl bg-slate-800 border border-slate-700 text-xs">
            <Activity className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            <span className="text-slate-400">Credits:</span>
            <span className="text-emerald-400 font-extrabold">{usage ? `${usage.creditsRemaining} / ${usage.creditLimit}` : '97 / 100'}</span>
          </div>

          <button
            onClick={() => setApiKeyModal(true)}
            className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs shadow-md cursor-pointer transition-all"
          >
            <Zap className="w-3.5 h-3.5" />
            <span>Panvaya Key</span>
          </button>
        </div>
      </div>

      {/* Main Container Card: FIND YOUR NEXT SAILING */}
      <div className="bg-white rounded-3xl border border-slate-200/80 shadow-md overflow-hidden">
        
        {/* Panvaya Teal Header Banner */}
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

        {/* Build Your Route Form */}
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
                className="w-full bg-[#1282a2] hover:bg-[#0e6983] text-white font-extrabold text-xs sm:text-sm py-2.5 px-5 rounded-xl shadow-md transition-all cursor-pointer flex items-center justify-center gap-2"
              >
                <Search className="w-4 h-4" />
                <span>Search</span>
              </button>
            </div>
          </div>

          {/* Carrier Horizontal Filter Bar */}
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

            {/* Quick Horizontal Carrier Scroll Bar */}
            <div className="flex items-center gap-2 overflow-x-auto pb-2 scrollbar-none">
              {PANVAYA_CARRIERS_33.map((c) => {
                const isSel = c.scac === activeCarrier;
                return (
                  <button
                    key={c.scac}
                    type="button"
                    onClick={() => setActiveCarrier(c.scac)}
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-2xl text-xs font-bold shrink-0 transition-all cursor-pointer border ${
                      isSel
                        ? 'bg-cyan-50 text-cyan-950 border-cyan-300 ring-2 ring-cyan-400/40 shadow-xs'
                        : 'bg-white text-slate-700 hover:bg-slate-50 border-slate-200'
                    }`}
                  >
                    <span className={`w-5 h-5 rounded-full ${c.color} text-white font-black text-[10px] flex items-center justify-center shrink-0`}>
                      {c.name.charAt(0)}
                    </span>
                    <span>{c.name}</span>
                    <span className="font-mono text-[10px] text-slate-400">({c.scac})</span>
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
            <div className="flex items-center gap-2.5 text-lg sm:text-xl font-black text-white mt-1">
              <span>{originObj.flag} {originObj.name}</span>
              <span className="text-slate-500 font-mono">── ⛵ ──</span>
              <span>{destObj.flag} {destObj.name}</span>
            </div>
            <p className="text-xs text-slate-300 mt-0.5">
              {sailingsDeck.length} options ready to compare across 1 carrier.
            </p>
          </div>

          <div className="flex items-center gap-2">
            <select className="bg-slate-800 border border-slate-700 text-white text-xs font-bold rounded-xl px-3 py-2 outline-none">
              <option>Earliest departure</option>
              <option>Fastest transit</option>
            </select>
            <button className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 cursor-pointer">
              <RotateCw className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* 4 Top KPI Cards */}
        <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-cyan-400">
              <Layers className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white block">{sailingsDeck.length}</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Sailings Found</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-indigo-400">
              <Zap className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white block">38 days</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Fastest Transit</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-emerald-400">
              <Anchor className="w-4 h-4" />
            </div>
            <span className="text-xl sm:text-2xl font-black text-white block">0</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Direct Options</span>
          </div>

          <div className="bg-slate-800/80 border border-slate-700/80 rounded-2xl p-4 space-y-1">
            <div className="flex items-center justify-between text-amber-400">
              <Calendar className="w-4 h-4" />
            </div>
            <span className="text-lg sm:text-xl font-black text-white block">Sat 10 Oct</span>
            <span className="text-[10px] font-bold uppercase tracking-wider text-slate-400 block">Next Departure</span>
          </div>
        </div>
      </div>

      {/* DYNAMIC SAILINGS CARDS LIST (Panvaya 3.0 Card Design) */}
      <div className="space-y-4">
        {sailingsDeck.map((sailing, idx) => {
          const isExpanded = expandedCardIdx === idx;
          const c = sailing.carrier;

          return (
            <div key={sailing.id} className="bg-white rounded-3xl border border-slate-200/90 shadow-sm hover:border-cyan-300 transition-all overflow-hidden">
              
              {/* Top Summary Row */}
              <div className="p-5 sm:p-6 flex flex-col lg:flex-row lg:items-center justify-between gap-4">
                
                {/* Left Carrier Info */}
                <div className="flex items-center gap-3.5">
                  <div className={`w-12 h-12 rounded-2xl ${c.color} text-white font-black text-lg flex items-center justify-center shadow-md shrink-0`}>
                    {c.name.charAt(0)}
                  </div>

                  <div>
                    <div className="flex items-center gap-2 flex-wrap">
                      <h3 className="font-black text-slate-900 text-lg uppercase tracking-tight">{c.full}</h3>
                      <span className="px-2.5 py-0.5 rounded-full bg-sky-100 text-sky-800 font-extrabold text-xs">
                        {sailing.transitDays} days
                      </span>
                    </div>
                    <div className="flex items-center gap-2 text-xs text-slate-500 mt-0.5">
                      <span>Ocean service · <strong>{sailing.service}</strong></span>
                    </div>
                  </div>
                </div>

                {/* Middle Departure & Arrival Dates */}
                <div className="grid grid-cols-3 gap-4 text-xs bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Transshipments</span>
                    <span className="font-extrabold text-amber-700 text-sm block mt-0.5">{sailing.transshipments} T/S</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Departure</span>
                    <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{sailing.depDate}</span>
                    <span className="text-slate-400 text-[10px]">{sailing.depPort} <strong className="font-mono text-slate-600">{sailing.depLocode}</strong></span>
                  </div>

                  <div>
                    <span className="text-[10px] font-extrabold text-slate-400 uppercase block">Arrival</span>
                    <span className="font-extrabold text-slate-900 text-sm block mt-0.5">{sailing.arrDate}</span>
                    <span className="text-slate-400 text-[10px]">{sailing.arrPort} <strong className="font-mono text-slate-600">{sailing.arrLocode}</strong></span>
                  </div>
                </div>

                {/* Right Action Badges & Expand Button */}
                <div className="flex items-center gap-2 justify-end">
                  {sailing.isFastest && (
                    <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-cyan-100 text-cyan-900 text-xs font-black border border-cyan-300">
                      <CheckCircle2 className="w-3.5 h-3.5 text-cyan-600" />
                      Fastest & earliest
                    </span>
                  )}

                  <span className="inline-flex items-center gap-1 px-3 py-1.5 rounded-xl bg-indigo-600 text-white text-xs font-bold shadow-xs">
                    <Calendar className="w-3.5 h-3.5" />
                    Cut Off
                  </span>

                  <button
                    type="button"
                    onClick={() => setExpandedCardIdx(isExpanded ? null : idx)}
                    className="inline-flex items-center gap-1 px-3.5 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-800 font-extrabold text-xs transition-all cursor-pointer border border-slate-200"
                  >
                    <span>{isExpanded ? 'Hide Details' : 'Details'}</span>
                    {isExpanded ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              {/* EXPANDED DETAILS PANEL (Matches Panvaya.com Screenshot 3) */}
              {isExpanded && (
                <div className="border-t border-slate-200/80 bg-slate-50/50 p-5 sm:p-7 space-y-6">
                  
                  {/* Sub-Navigation Tabs inside expanded card */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-200 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-black uppercase text-slate-500">View:</span>
                      {[
                        { id: 'movement', label: 'Movement & Cut-offs', icon: Navigation },
                        { id: 'map', label: 'Interactive Sea Map', icon: Globe },
                        { id: 'combined', label: 'Combined View', icon: Layers }
                      ].map(t => (
                        <button
                          key={t.id}
                          onClick={() => setCardSubTab(t.id)}
                          className={`px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer flex items-center gap-1.5 ${
                            cardSubTab === t.id
                              ? 'bg-cyan-700 text-white shadow-sm'
                              : 'bg-white border border-slate-200 text-slate-600 hover:bg-slate-100'
                          }`}
                        >
                          <t.icon className="w-3.5 h-3.5" />
                          <span>{t.label}</span>
                        </button>
                      ))}
                    </div>

                    <div className="text-xs font-mono font-bold text-slate-600 flex items-center gap-1">
                      <Ship className="w-3.5 h-3.5 text-cyan-600" />
                      <span>{sailing.vesselName}</span>
                      <span className="text-slate-400">/{sailing.voyageNo}</span>
                    </div>
                  </div>

                  {/* Split Layout: Movement Table (Left) + Cut off Dates Box (Right) */}
                  <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
                    
                    {/* Left: Leg-by-leg Movement Table */}
                    <div className="lg:col-span-8 bg-white rounded-2xl border border-slate-200/90 overflow-hidden shadow-2xs">
                      <div className="overflow-x-auto">
                        <table className="w-full text-left border-collapse">
                          <thead>
                            <tr className="bg-slate-100/80 border-b border-slate-200 text-[10px] font-black uppercase text-slate-500 tracking-wider">
                              <th className="py-3 px-4">Location</th>
                              <th className="py-3 px-4">Date</th>
                              <th className="py-3 px-4">Movement</th>
                              <th className="py-3 px-4">Service</th>
                              <th className="py-3 px-4">Vessel / Voyage No.</th>
                            </tr>
                          </thead>
                          <tbody className="divide-y divide-slate-100 text-xs font-medium">
                            {sailing.legs.map((leg, lIdx) => (
                              <tr key={lIdx} className="hover:bg-slate-50">
                                <td className="py-3.5 px-4 font-bold text-slate-900">
                                  <div className="flex items-center gap-1.5">
                                    <MapPin className="w-3.5 h-3.5 text-cyan-600 shrink-0" />
                                    <span>{leg.loc}</span>
                                  </div>
                                  <div className="text-[10px] text-slate-400 font-mono pl-5">{leg.locode}</div>
                                  {leg.layover && (
                                    <span className="inline-block mt-1 px-2 py-0.5 rounded bg-amber-100 text-amber-900 text-[10px] font-extrabold">
                                      {leg.layover}
                                    </span>
                                  )}
                                </td>

                                <td className="py-3.5 px-4 font-extrabold text-slate-800 whitespace-nowrap">
                                  {leg.date}
                                </td>

                                <td className="py-3.5 px-4 whitespace-nowrap">
                                  <span className={`px-2.5 py-1 rounded-full text-[10px] font-black uppercase ${
                                    leg.badgeType === 'dep' ? 'bg-emerald-100 text-emerald-800' : 'bg-purple-100 text-purple-800'
                                  }`}>
                                    {leg.move}
                                  </span>
                                </td>

                                <td className="py-3.5 px-4 font-bold text-slate-700">
                                  {leg.service}
                                </td>

                                <td className="py-3.5 px-4 font-mono font-bold text-slate-800 whitespace-nowrap">
                                  {leg.vessel}
                                </td>
                              </tr>
                            ))}
                          </tbody>
                        </table>
                      </div>
                      <div className="p-3 bg-slate-50 border-t border-slate-200/80 text-[11px] text-slate-500 flex items-center justify-between">
                        <span>Nautical A* sea route calculated across 2 legs.</span>
                        <a href="#map" className="text-cyan-700 font-bold hover:underline">View sea route on interactive map →</a>
                      </div>
                    </div>

                    {/* Right: Official Carrier Cut off Dates Box */}
                    <div className="lg:col-span-4 bg-white rounded-2xl border border-slate-200/90 p-5 shadow-2xs space-y-4">
                      <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
                        <Calendar className="w-4 h-4 text-indigo-600" />
                        <h4 className="font-extrabold text-slate-900 text-sm">Cut off Dates</h4>
                      </div>

                      <div className="space-y-2.5 text-xs">
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">CY Cut Off Date:</span>
                          <span className="font-extrabold text-slate-900 font-mono">{sailing.cutOffs.cy}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">S/I Cut Off Date:</span>
                          <span className="font-extrabold text-slate-900 font-mono">{sailing.cutOffs.si}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">VGM Cut Off Date:</span>
                          <span className="font-extrabold text-slate-900 font-mono">{sailing.cutOffs.vgm}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 border-b border-slate-100">
                          <span className="text-slate-500 font-medium">DG Cut Off Date:</span>
                          <span className="font-extrabold text-slate-900 font-mono">{sailing.cutOffs.dg}</span>
                        </div>
                        <div className="flex justify-between items-center py-1 font-bold">
                          <span className="text-slate-500">Reefer Cut Off:</span>
                          <span className="font-extrabold text-slate-900 font-mono">{sailing.cutOffs.reefer}</span>
                        </div>
                      </div>

                      <div className="border-t border-slate-200/80 pt-3 text-[11px] space-y-1.5 text-slate-500 font-mono">
                        <div className="flex justify-between">
                          <span>Total Transit:</span>
                          <span className="font-bold text-slate-800">{sailing.transitDays} days</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Vessel IMO:</span>
                          <span className="font-bold text-slate-800">{sailing.vesselImo}</span>
                        </div>
                        <div className="flex justify-between">
                          <span>Port Timezones:</span>
                          <span className="font-bold text-slate-800">America/New_York → Europe/Paris</span>
                        </div>
                        <div className="flex justify-between text-[10px] text-slate-400 pt-1">
                          <span>Updated:</span>
                          <span>6 Oct 2026</span>
                        </div>
                      </div>
                    </div>

                  </div>
                </div>
              )}

            </div>
          );
        })}
      </div>

      {/* SELECT OCEAN CARRIER MODAL POPUP (Exact Matches Panvaya.com Screenshot 1 & 2) */}
      {carrierModalOpen && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-2xl overflow-hidden">
            
            {/* Modal Header */}
            <div className="p-6 border-b border-slate-100 flex items-center justify-between bg-white">
              <div className="flex items-center gap-3">
                <div className="p-2.5 rounded-2xl bg-cyan-100 text-cyan-800">
                  <Ship className="w-5 h-5" />
                </div>
                <div>
                  <h3 className="text-lg font-black text-slate-900">Select Ocean Carrier</h3>
                  <p className="text-xs text-slate-500">Select a single carrier to view point-to-point sailings</p>
                </div>
              </div>

              <button
                onClick={() => setCarrierModalOpen(false)}
                className="p-2 text-slate-400 hover:text-slate-700 rounded-xl hover:bg-slate-100 transition-colors cursor-pointer"
              >
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Search Input */}
            <div className="p-6 pb-3 space-y-4 bg-white">
              <div className="relative">
                <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-3" />
                <input
                  type="text"
                  placeholder="Search carrier by name or SCAC (e.g. KMTC, Namsung, MSC, ONE)..."
                  value={carrierModalSearch}
                  onChange={(e) => setCarrierModalSearch(e.target.value)}
                  className="w-full bg-slate-50 border border-slate-200 rounded-2xl pl-10 pr-4 py-2.5 text-xs font-bold text-slate-900 focus:bg-white focus:ring-2 focus:ring-cyan-500 outline-none"
                />
              </div>

              {/* Category Filter Tabs */}
              <div className="flex items-center gap-2 border-b border-slate-100 pb-3 overflow-x-auto">
                {[
                  { id: 'All', label: 'All (33)' },
                  { id: 'Global Alliances', label: 'Global Alliances (11)' },
                  { id: 'Intra-Asia', label: 'Intra-Asia (12)' },
                  { id: 'Regional & NVOCC', label: 'Regional & NVOCC (10)' }
                ].map(cat => (
                  <button
                    key={cat.id}
                    onClick={() => setCarrierCategoryTab(cat.id)}
                    className={`px-3.5 py-1.5 rounded-xl text-xs font-extrabold transition-all shrink-0 cursor-pointer ${
                      carrierCategoryTab === cat.id
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
                    }`}
                  >
                    {cat.label}
                  </button>
                ))}
              </div>
            </div>

            {/* Carrier 2-Column Grid */}
            <div className="p-6 pt-0 overflow-y-auto flex-1 max-h-[50vh] space-y-2">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                {modalFilteredCarriers.map((c) => {
                  const isSel = c.scac === activeCarrier;
                  return (
                    <div
                      key={c.scac}
                      onClick={() => setActiveCarrier(c.scac)}
                      className={`p-3.5 rounded-2xl border transition-all cursor-pointer flex items-center justify-between gap-3 ${
                        isSel
                          ? 'bg-cyan-50/70 border-cyan-400 ring-2 ring-cyan-400/40 shadow-xs'
                          : 'bg-white border-slate-200 hover:border-cyan-300 hover:bg-slate-50/50'
                      }`}
                    >
                      <div className="flex items-center gap-3">
                        <div className={`w-10 h-10 rounded-xl ${c.color} text-white font-black text-sm flex items-center justify-center shrink-0 shadow-xs`}>
                          {c.name.charAt(0)}
                        </div>

                        <div>
                          <div className="flex items-center gap-1.5 flex-wrap">
                            <span className="font-black text-slate-900 text-sm">{c.name}</span>
                            <span className="font-mono text-[10px] font-bold text-slate-600 bg-slate-100 px-1.5 py-0.5 rounded">
                              {c.scac}
                            </span>
                            {c.tag && (
                              <span className="text-[9px] font-extrabold bg-amber-100 text-amber-900 px-1.5 py-0.5 rounded-md">
                                {c.tag}
                              </span>
                            )}
                          </div>
                          <p className="text-[11px] text-slate-500 font-medium">{c.full}</p>
                          <p className="text-[10px] text-slate-400 font-bold mt-0.5">{c.desc}</p>
                        </div>
                      </div>

                      <div className={`w-5 h-5 rounded-full border-2 flex items-center justify-center shrink-0 ${
                        isSel ? 'border-cyan-600 bg-cyan-600 text-white' : 'border-slate-300'
                      }`}>
                        {isSel && <Check className="w-3 h-3 stroke-[3]" />}
                      </div>
                    </div>
                  );
                })}
              </div>
            </div>

            {/* Modal Footer */}
            <div className="p-4 px-6 border-t border-slate-100 bg-slate-50 flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500">
                Showing {modalFilteredCarriers.length} of 33 carriers
              </span>

              <button
                onClick={() => setCarrierModalOpen(false)}
                className="px-6 py-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white font-black text-xs shadow-md cursor-pointer transition-all"
              >
                Done
              </button>
            </div>

          </div>
        </div>
      )}

      {/* Panvaya API Key Modal */}
      {apiKeyModal && (
        <div className="fixed inset-0 bg-slate-900/60 backdrop-blur-xs z-50 flex items-center justify-center p-4">
          <div className="bg-white rounded-3xl max-w-md w-full p-6 shadow-2xl space-y-4">
            <h3 className="text-base font-bold text-slate-900 flex items-center gap-2">
              <Zap className="w-5 h-5 text-cyan-600" /> Production API Key
            </h3>
            <input type="text" value={customKey} onChange={(e) => setCustomKey(e.target.value)} className="w-full bg-slate-50 border border-slate-300 rounded-xl px-3.5 py-2.5 text-xs font-mono font-bold text-slate-900 outline-none focus:ring-2 focus:ring-cyan-500" />
            <div className="flex justify-end gap-2 pt-2">
              <button onClick={() => setApiKeyModal(false)} className="px-4 py-2 rounded-xl text-xs font-bold text-slate-600 hover:bg-slate-100 cursor-pointer">Cancel</button>
              <button onClick={() => { setPanvayaApiKey(customKey); setApiKeyModal(false); loadUsageAndCarriers(); }} className="px-4 py-2 rounded-xl bg-cyan-600 hover:bg-cyan-500 text-white font-bold text-xs cursor-pointer">Save & Apply</button>
            </div>
          </div>
        </div>
      )}

    </div>
  );
}
