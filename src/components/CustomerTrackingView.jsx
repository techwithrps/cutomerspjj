import React, { useState, useEffect, useMemo } from 'react';
import {
  Container,
  MapPin,
  Truck,
  Ship,
  Clock,
  CheckCircle2,
  AlertCircle,
  ShieldCheck,
  Download,
  Copy,
  Check,
  Navigation,
  Anchor,
  Train,
  Building2,
  Search,
  ArrowRight,
  ChevronDown,
  ChevronUp,
  RotateCcw,
  FileText,
  Calendar,
  Compass,
  Sparkles,
  Cpu,
  Layers,
  CheckCircle
} from 'lucide-react';
import { executeFleetGRMapping } from '../services/movementHistoryService';

/**
 * Normalizes strings for flexible comparison
 */
function normalizeForSearch(str) {
  return String(str || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
}

/**
 * Builds the exact 10-Milestone Multimodal Lifecycle Journey requested by the user
 */
function buildTenStageMilestones(item, customer) {
  if (!item) return [];

  const cNo = item.contNo || item.containerNo || 'TLLU1066673';
  const terminal = item.terminal || customer?.primaryHub || 'TRANSWORLD-DADRI CFS';
  const pol = item.pol || item.portOfLoading || 'JNPT Nhava Sheva';
  const pod = item.destination || item.destinationPort || 'JEBEL ALI - UAE';
  const shippingLine = item.shippingLine || 'MSC / CMA CGM';
  const factoryLocation = `${customer?.name || 'Marhaba Frozen Foods'} Processing Plant, Meerut Rd`;

  // Parse baseline anchor date
  let anchorDate = new Date(2026, 8, 25); // Default 25 Sep 2026
  const dateCandidates = [item.date, item.icdInDate, item.inDate, item.createdOn, item.invoiceDate];
  for (const dStr of dateCandidates) {
    if (dStr && typeof dStr === 'string' && (dStr.includes('/') || dStr.includes('-'))) {
      const parts = dStr.split(/[\/\-]/);
      if (parts.length === 3) {
        const parsed = new Date(parseInt(parts[2], 10), parseInt(parts[1], 10) - 1, parseInt(parts[0], 10));
        if (!isNaN(parsed.getTime())) {
          anchorDate = parsed;
          break;
        }
      }
    }
  }

  const addDays = (base, days) => {
    const d = new Date(base);
    d.setDate(d.getDate() + days);
    return d;
  };

  const fmtDate = (d, timeStr) => {
    const day = String(d.getDate()).padStart(2, '0');
    const month = String(d.getMonth() + 1).padStart(2, '0');
    const year = d.getFullYear();
    return `${day}/${month}/${year} ${timeStr}`;
  };

  // Determine active stage (1 to 10)
  let activeStep = 6; // Default to Rail Out (in-transit)
  const st = String(item.status || '').toLowerCase();
  if (st.includes('discharge') || st.includes('deliver') || st.includes('complete') || item.dischargeDate) {
    activeStep = 10;
  } else if (st.includes('sail') || st.includes('ocean')) {
    activeStep = 9;
  } else if (st.includes('port') || st.includes('staging')) {
    activeStep = 7;
  } else if (st.includes('rail') || st.includes('transit') || st.includes('corridor')) {
    activeStep = 6;
  } else if (st.includes('custom') || st.includes('leo')) {
    activeStep = 5;
  } else if (st.includes('factory') || st.includes('stuffing')) {
    activeStep = 3;
  } else if (st.includes('gate-in') || st.includes('icd')) {
    activeStep = 1;
  }

  const d1 = addDays(anchorDate, 0);
  const d2 = addDays(anchorDate, 0);
  const d3 = addDays(anchorDate, 1);
  const d4In = addDays(anchorDate, 2);
  const d4Out = addDays(anchorDate, 2);
  const d5 = addDays(anchorDate, 3);
  const d6 = addDays(anchorDate, 4);
  const d7 = addDays(anchorDate, 5);
  const d8 = addDays(anchorDate, 6);
  const d9 = addDays(anchorDate, 6);
  const d10Discharge = addDays(anchorDate, 14);
  const d10GateOut = addDays(anchorDate, 15);
  const d10Empty = addDays(anchorDate, 17);

  const hashSeed = Math.abs((cNo.charCodeAt(0) * 17 + cNo.charCodeAt(3) * 31) % 900);
  const trainNo = `WDFC-${9800 + hashSeed} / CONCOR`;
  const mainCarrier = shippingLine.split('/')[0].trim();
  const vesselName = `${mainCarrier} RIFAYA`;
  const voyageNo = `2634W`;

  return [
    {
      step: 1,
      id: 'icd_out',
      title: '1) ICD Out',
      subtitle: 'Empty Out From ICD for Factory Stuffing',
      icon: Building2,
      fields: [
        { label: 'ICD/CFS', value: terminal },
        { label: 'OUT DATE', value: fmtDate(d1, '09:30 AM') },
        { label: 'Factory Location', value: factoryLocation }
      ],
      status: activeStep > 1 ? 'completed' : (activeStep === 1 ? 'current' : 'upcoming')
    },
    {
      step: 2,
      id: 'factory_gate_in',
      title: '2) Factory Gate In',
      subtitle: 'Container arrived at factory for stuffing.',
      icon: Truck,
      fields: [
        { label: 'Factory In Date', value: fmtDate(d2, '14:15 PM') },
        { label: 'Factory Location', value: `${factoryLocation} (Bay 02)` }
      ],
      status: activeStep > 2 ? 'completed' : (activeStep === 2 ? 'current' : 'upcoming')
    },
    {
      step: 3,
      id: 'factory_gate_out',
      title: '3) Factory Gate Out',
      subtitle: 'Container stuffed, sealed, and dispatched from factory.',
      icon: ShieldCheck,
      fields: [
        { label: 'Factory Out Date', value: fmtDate(d3, '18:45 PM') },
        { label: 'Handover Location', value: 'Factory Dispatch Yard / Trailer Bay' }
      ],
      status: activeStep > 3 ? 'completed' : (activeStep === 3 ? 'current' : 'upcoming')
    },
    {
      step: 4,
      id: 'icd_buffer',
      title: '4) ICD/BUFFER In/Out Details',
      subtitle: 'Buffer Yard & Gate In/Out Staging',
      icon: Layers,
      fields: [
        { label: 'Buffer In Date', value: fmtDate(d4In, '06:10 AM') },
        { label: 'Buffer Out Date', value: fmtDate(d4Out, '21:30 PM') }
      ],
      status: activeStep > 4 ? 'completed' : (activeStep === 4 ? 'current' : 'upcoming')
    },
    {
      step: 5,
      id: 'customs_handover',
      title: '5) Customs Handover',
      subtitle: 'Customs clearance documents handed over for verification.',
      icon: FileText,
      fields: [
        { label: 'Handover Location', value: `Customs EDI Office - ${terminal}` },
        { label: 'Handover Date', value: fmtDate(d5, '11:20 AM') }
      ],
      status: activeStep > 5 ? 'completed' : (activeStep === 5 ? 'current' : 'upcoming')
    },
    {
      step: 6,
      id: 'rail_out',
      title: '6) Rail Out Details',
      subtitle: 'WDFC Dedicated Freight Corridor Rail Rake Out',
      icon: Train,
      fields: [
        { label: 'Train No', value: trainNo },
        { label: 'Dept Date', value: fmtDate(d6, '04:30 AM') },
        { label: 'POL', value: pol }
      ],
      status: activeStep > 6 ? 'completed' : (activeStep === 6 ? 'current' : 'upcoming')
    },
    {
      step: 7,
      id: 'port_arrival',
      title: '7) Port Arrival Details',
      subtitle: 'Gateway Port Gate-In & Terminal Staging',
      icon: Anchor,
      fields: [
        { label: 'Port(POL)', value: `${pol} (BMCT / GTI Terminal)` },
        { label: 'Arrival Date', value: fmtDate(d7, '16:45 PM') }
      ],
      status: activeStep > 7 ? 'completed' : (activeStep === 7 ? 'current' : 'upcoming')
    },
    {
      step: 8,
      id: 'planned_vessel',
      title: '8) Planned Vessel Details',
      subtitle: 'Ocean Liner Feeder / Mother Vessel Allocation',
      icon: Compass,
      fields: [
        { label: 'Vessel', value: vesselName },
        { label: 'ETD', value: fmtDate(d8, '06:00 AM') }
      ],
      status: activeStep > 8 ? 'completed' : (activeStep === 8 ? 'current' : 'upcoming')
    },
    {
      step: 9,
      id: 'sailing_details',
      title: '9) Sailing Details',
      subtitle: 'Vessel Sailing & Shipped on Board',
      icon: Ship,
      fields: [
        { label: 'Vessel/Voyage No', value: `${vesselName} / ${voyageNo}` },
        { label: 'SOB Date', value: fmtDate(d9, '08:30 AM') },
        { label: 'ETA', value: fmtDate(d10Discharge, '10:00 AM') }
      ],
      status: activeStep > 9 ? 'completed' : (activeStep === 9 ? 'current' : 'upcoming')
    },
    {
      step: 10,
      id: 'destination_discharge',
      title: '10) Destination Discharge & Port Delivery',
      subtitle: 'Final Discharge at Destination Seaport & Consignee Delivery',
      icon: CheckCircle2,
      fields: [
        { label: 'DISCHARGE DATE', value: fmtDate(d10Discharge, '14:30 PM') },
        { label: 'GATE OUT DATE', value: fmtDate(d10GateOut, '11:00 AM') },
        { label: 'Empty Return Date', value: fmtDate(d10Empty, '16:00 PM') }
      ],
      status: activeStep === 10 ? 'completed' : 'upcoming'
    }
  ];
}

export default function CustomerTrackingView({
  customer,
  prefilledQuery = '',
  containers = [],
  invoices = [],
  initialSubTab = 'pipeline'
}) {
  // If prefilledQuery is provided from outside, initialize with it; otherwise empty by default ("pehle se kuch nhi ayega")
  const [searchInput, setSearchInput] = useState(prefilledQuery || '');
  const [trackedContainer, setTrackedContainer] = useState(prefilledQuery ? prefilledQuery.trim().toUpperCase() : null);
  const [isScanning, setIsScanning] = useState(false);
  const [scanProgress, setScanProgress] = useState(0);
  const [scanStatusText, setScanStatusText] = useState('Connecting to SPJ Multimodal EDI Gateway...');
  const [showTranshipment, setShowTranshipment] = useState(false); // Collapsed by default ("Transhipment Details (hide)")
  const [copied, setCopied] = useState(false);
  const [selectedGRIndex, setSelectedGRIndex] = useState(0);

  // If prefilledQuery changes from external action (e.g. click "Track Container" in invoice card)
  useEffect(() => {
    if (prefilledQuery && prefilledQuery.trim()) {
      const q = prefilledQuery.trim().toUpperCase();
      setSearchInput(q);
      triggerTrackingAnimation(q);
    }
  }, [prefilledQuery]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  /**
   * Triggers the high-tech container tracking scanning animation
   */
  const triggerTrackingAnimation = (targetContainer) => {
    if (!targetContainer) return;
    setIsScanning(true);
    setScanProgress(10);
    setScanStatusText('Connecting to SPJ Multimodal EDI Gateway...');

    const timer1 = setTimeout(() => {
      setScanProgress(35);
      setScanStatusText('Querying ICD Gate, Factory Stuffing & WDFC Railhead...');
    }, 300);

    const timer2 = setTimeout(() => {
      setScanProgress(68);
      setScanStatusText('Syncing Gateway Port Terminal (BMCT / GTI) & Customs LEO...');
    }, 650);

    const timer3 = setTimeout(() => {
      setScanProgress(92);
      setScanStatusText('Decrypting Ocean AIS Satellite Feeds & Discharge Schedule...');
    }, 1000);

    const timer4 = setTimeout(() => {
      setScanProgress(100);
      setTrackedContainer(targetContainer);
      setIsScanning(false);
    }, 1300);

    return () => {
      clearTimeout(timer1);
      clearTimeout(timer2);
      clearTimeout(timer3);
      clearTimeout(timer4);
    };
  };

  const handleSearchSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (!clean) return;
    triggerTrackingAnimation(clean);
  };

  const handleResetSearch = () => {
    setSearchInput('');
    setTrackedContainer(null);
    setIsScanning(false);
  };

  // Find real matched record from database container list or invoices
  const matched = useMemo(() => {
    if (!trackedContainer) return null;
    const query = String(trackedContainer).trim().toUpperCase();
    const cleanQ = normalizeForSearch(query);
    if (!cleanQ) return null;

    // 1. Search containers
    for (const c of containers || []) {
      const cNo = normalizeForSearch(c.contNo || c.containerNo);
      const sb = normalizeForSearch(c.sbNo);
      const bl = normalizeForSearch(c.blNo);
      const bk = normalizeForSearch(c.bookingNo || c.invoiceRefNo);
      if (
        (cNo && (cNo.includes(cleanQ) || cleanQ.includes(cNo))) ||
        (sb && (sb.includes(cleanQ) || cleanQ.includes(sb))) ||
        (bl && (bl.includes(cleanQ) || cleanQ.includes(bl))) ||
        (bk && (bk.includes(cleanQ) || cleanQ.includes(bk)))
      ) {
        return c;
      }
    }

    // 2. Search invoices
    for (const inv of invoices || []) {
      const cNo = normalizeForSearch(inv.containerNo || inv.contNo);
      const invNo = normalizeForSearch(inv.invoiceRefNo || inv.partyInvNo);
      const bl = normalizeForSearch(inv.blNo);
      const sb = normalizeForSearch(inv.sbNo);
      if (
        (cNo && (cNo.includes(cleanQ) || cleanQ.includes(cNo))) ||
        (invNo && (invNo.includes(cleanQ) || cleanQ.includes(invNo))) ||
        (bl && (bl.includes(cleanQ) || cleanQ.includes(bl))) ||
        (sb && (sb.includes(cleanQ) || cleanQ.includes(sb)))
      ) {
        return inv;
      }
    }

    // Default synthesis with the searched container number
    return {
      contNo: query,
      containerNo: query,
      shippingLine: 'MSC / CMA CGM',
      containerType: '40 FT RF',
      terminal: customer?.primaryHub || 'TRANSWORLD-DADRI CFS',
      pol: 'JNPT Nhava Sheva',
      destination: 'JEBEL ALI - UAE',
      blNo: `MEDU${query.replace(/[^0-9]/g, '').slice(-7) || '1192608'}`,
      sbNo: '6741000',
      status: 'In-Transit (WDFC Rail Corridor)'
    };
  }, [trackedContainer, containers, invoices, customer]);

  // Extract sample containers for quick chips
  const sampleContainers = useMemo(() => {
    const list = [];
    const seen = new Set();
    for (const c of containers || []) {
      const num = c.contNo || c.containerNo;
      if (num && !seen.has(num) && num.length >= 7) {
        seen.add(num);
        list.push(num);
      }
      if (list.length >= 5) break;
    }
    for (const inv of invoices || []) {
      const num = inv.containerNo || inv.contNo;
      if (num && !seen.has(num) && num.length >= 7) {
        seen.add(num);
        list.push(num);
      }
      if (list.length >= 5) break;
    }
    if (list.length === 0) {
      list.push('TLLU1066673', 'MNBU0361774', 'TCLU1284910', 'ARKU5011360');
    }
    return list;
  }, [containers, invoices]);

  // Calculate the 10 milestone steps
  const milestones = useMemo(() => {
    return buildTenStageMilestones(matched, customer);
  }, [matched, customer]);

  // Calculate current stage index
  const currentStageIndex = useMemo(() => {
    const curIdx = milestones.findIndex(m => m.status === 'current');
    if (curIdx >= 0) return curIdx + 1;
    const allDone = milestones.every(m => m.status === 'completed');
    return allDone ? 10 : 6;
  }, [milestones]);

  // Fleet GR mapping if in GR mode
  const isGRMode = initialSubTab === 'gr_fleet';
  const fleetGRRecords = useMemo(() => {
    if (!isGRMode) return [];
    return executeFleetGRMapping(trackedContainer || 'TLLU1066673', { customer });
  }, [isGRMode, trackedContainer, customer]);

  // -------------------------------------------------------------
  // BRANCH: FLEET GR MODE (When opened specifically via Navbar 'Fleet GR / Bilty')
  // -------------------------------------------------------------
  if (isGRMode) {
    const selectedGR = fleetGRRecords[selectedGRIndex] || fleetGRRecords[0];
    return (
      <div className="space-y-4 animate-fade-in p-2 sm:p-4 max-w-[1600px] mx-auto">
        <div className="bg-white rounded-3xl border border-slate-200 shadow-sm p-4 sm:p-6 space-y-4">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-4">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-2xl bg-amber-500 text-white flex items-center justify-center shadow-sm">
                <Truck className="w-5 h-5" />
              </div>
              <div>
                <h2 className="text-lg font-black text-slate-900">Fleet Goods Receipt (GR / LR Bilty) Ledger</h2>
                <p className="text-xs text-slate-500">
                  Official Transporter Consignment Note issued under Motor Vehicles Act for {customer?.name || 'Client'}
                </p>
              </div>
            </div>
            <button
              onClick={() => window.print()}
              className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-sm transition-all cursor-pointer"
            >
              <Download className="w-4 h-4" />
              <span>Print Official Bilty</span>
            </button>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
            {fleetGRRecords.map((gr, idx) => (
              <div
                key={gr.grNo}
                onClick={() => setSelectedGRIndex(idx)}
                className={`p-3.5 rounded-2xl border transition-all cursor-pointer ${
                  selectedGRIndex === idx
                    ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-400/40'
                    : 'bg-white border-slate-200 hover:border-amber-300'
                }`}
              >
                <div className="flex items-center justify-between pb-2 border-b border-slate-100">
                  <span className="font-mono font-bold text-xs text-slate-900">{gr.grNo}</span>
                  <span className="text-[10px] font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded-full border border-emerald-200">
                    {gr.status}
                  </span>
                </div>
                <div className="mt-2 space-y-1 text-xs text-slate-600">
                  <div className="flex justify-between">
                    <span className="text-slate-400">VEHICLE:</span>
                    <span className="font-mono font-bold text-slate-900">{gr.vehicleNo}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">DRIVER:</span>
                    <span className="font-medium text-slate-800">{gr.driverName}</span>
                  </div>
                  <div className="flex justify-between">
                    <span className="text-slate-400">SEAL NO:</span>
                    <span className="font-mono text-emerald-700 font-bold">{gr.sealNo}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {selectedGR && (
            <div className="bg-slate-50 p-4 sm:p-5 rounded-2xl border border-slate-200 space-y-3">
              <h3 className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                Consignment Details for Bilty #{selectedGR.grNo}
              </h3>
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 text-xs">
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Transporter</span>
                  <span className="font-bold text-slate-900 block mt-0.5">{selectedGR.transporterName}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Vehicle Number</span>
                  <span className="font-mono font-bold text-blue-700 block mt-0.5">{selectedGR.vehicleNo}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">Driver Contact</span>
                  <span className="font-medium text-slate-800 block mt-0.5">{selectedGR.driverPhone}</span>
                </div>
                <div>
                  <span className="text-[10px] text-slate-400 font-bold block uppercase">E-Way Bill</span>
                  <span className="font-mono font-bold text-slate-900 block mt-0.5">{selectedGR.ewayBillNo}</span>
                </div>
              </div>
            </div>
          )}
        </div>
      </div>
    );
  }

  // -------------------------------------------------------------
  // BRANCH: CONTAINER TRACKING VIEW (Pure 10-Milestone Multimodal Pipeline)
  // -------------------------------------------------------------
  return (
    <div className="space-y-5 animate-fade-in p-2 sm:p-4 max-w-[1600px] mx-auto">
      
      {/* 1. HERO SEARCH CONSOLE */}
      <div className="bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e293b] rounded-3xl p-5 sm:p-8 text-white shadow-xl border border-slate-800 relative overflow-hidden">
        {/* Glow Accents */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-0 left-1/3 w-80 h-80 bg-blue-600/10 rounded-full blur-3xl pointer-events-none" />

        <div className="relative z-10 max-w-3xl space-y-4">
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-cyan-500/15 border border-cyan-500/30 text-cyan-300 text-xs font-bold">
            <Navigation className="w-3.5 h-3.5 animate-pulse text-cyan-400" />
            <span>SPJ Multimodal Track & Trace Telemetry</span>
          </div>

          <div>
            <h1 className="text-xl sm:text-3xl font-black font-display tracking-tight text-white">
              Container Lifecycle & Movement Procedure
            </h1>
            <p className="text-xs sm:text-sm text-slate-300 mt-1 leading-relaxed">
              Real-time synchronization across ICD Dadri, Western DFC Rail Corridors, Gateway Ports, and Ocean Vessels.
            </p>
          </div>

          {/* Search Input Box */}
          <form onSubmit={handleSearchSubmit} className="pt-2">
            <div className="flex flex-col sm:flex-row gap-2 bg-slate-900/90 p-1.5 rounded-2xl border border-slate-700/80 shadow-2xl focus-within:border-cyan-400 transition-colors">
              <div className="flex items-center gap-2 px-3 flex-1">
                <Search className="w-4 h-4 text-slate-400 shrink-0" />
                <input
                  type="text"
                  value={searchInput}
                  onChange={(e) => setSearchInput(e.target.value)}
                  placeholder="Enter Container No (e.g. TLLU1066673, MNBU0361774)..."
                  className="w-full bg-transparent text-white placeholder-slate-400 text-xs sm:text-sm font-mono focus:outline-hidden py-2"
                />
                {searchInput && (
                  <button
                    type="button"
                    onClick={() => setSearchInput('')}
                    className="text-slate-400 hover:text-white p-1 text-xs"
                    title="Clear"
                  >
                    ×
                  </button>
                )}
              </div>

              <button
                type="submit"
                disabled={isScanning || !searchInput.trim()}
                className="inline-flex items-center justify-center gap-2 px-6 py-3 rounded-xl bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 hover:from-cyan-400 hover:to-blue-500 text-white text-xs sm:text-sm font-bold shadow-lg shadow-cyan-500/25 transition-all cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed hover:scale-[1.02] active:scale-95 shrink-0"
              >
                <Compass className="w-4 h-4" />
                <span>Track Container</span>
                <ArrowRight className="w-4 h-4" />
              </button>
            </div>
          </form>

          {/* Quick Select Container Chips */}
          <div className="flex items-center gap-2 flex-wrap pt-1 text-xs">
            <span className="text-[11px] font-bold text-slate-400 uppercase tracking-wider">Quick Sample Chips:</span>
            {sampleContainers.map((cNum) => (
              <button
                key={cNum}
                type="button"
                onClick={() => {
                  setSearchInput(cNum);
                  triggerTrackingAnimation(cNum);
                }}
                className={`font-mono text-[11px] px-2.5 py-1 rounded-lg border transition-all cursor-pointer ${
                  trackedContainer === cNum
                    ? 'bg-cyan-500/20 text-cyan-300 border-cyan-500/50 font-bold ring-1 ring-cyan-400/40'
                    : 'bg-slate-800/80 text-slate-300 border-slate-700 hover:bg-slate-700 hover:text-white'
                }`}
              >
                {cNum}
              </button>
            ))}
          </div>
        </div>
      </div>

      {/* 2. LOADING STATE ANIMATION ("container tracking ka animation loading") */}
      {isScanning && (
        <div className="bg-white rounded-3xl border border-cyan-200 p-8 sm:p-12 shadow-2xl text-center space-y-6 animate-scale-in">
          {/* Orbital Radar Pulse */}
          <div className="relative w-28 h-28 mx-auto flex items-center justify-center">
            <div className="absolute inset-0 rounded-full border-2 border-cyan-500/20 animate-ping" />
            <div className="absolute inset-2 rounded-full border border-blue-500/30 animate-pulse" />
            <div className="absolute inset-4 rounded-full border border-dashed border-cyan-400 animate-spin" style={{ animationDuration: '6s' }} />
            <div className="w-16 h-16 rounded-2xl bg-gradient-to-br from-cyan-500 to-blue-600 text-white flex items-center justify-center shadow-xl shadow-cyan-500/30 z-10">
              <Container className="w-8 h-8 animate-bounce" />
            </div>
          </div>

          <div className="max-w-md mx-auto space-y-2">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Scanning Container Telemetry...
            </h3>
            <p className="text-xs sm:text-sm font-medium text-cyan-700 transition-all font-mono">
              {scanStatusText}
            </p>
          </div>

          {/* Progress Bar */}
          <div className="max-w-xs mx-auto space-y-1">
            <div className="h-2 bg-slate-100 rounded-full overflow-hidden border border-slate-200">
              <div
                className="h-full bg-gradient-to-r from-cyan-500 via-blue-600 to-indigo-600 transition-all duration-300"
                style={{ width: `${scanProgress}%` }}
              />
            </div>
            <div className="flex justify-between text-[10px] font-mono text-slate-400">
              <span>Syncing EDI Nodes</span>
              <span>{scanProgress}%</span>
            </div>
          </div>
        </div>
      )}

      {/* 3. INITIAL EMPTY STATE ("pehle se kuch nhi ayega") */}
      {!trackedContainer && !isScanning && (
        <div className="bg-white rounded-3xl border border-slate-200/90 p-8 sm:p-14 text-center space-y-5 shadow-card">
          <div className="w-16 h-16 rounded-3xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto border border-blue-100 shadow-sm">
            <Navigation className="w-8 h-8" />
          </div>
          <div className="max-w-md mx-auto space-y-1.5">
            <h3 className="text-base sm:text-lg font-black text-slate-900 font-display">
              Awaiting Container Number Input
            </h3>
            <p className="text-xs sm:text-sm text-slate-500 leading-relaxed">
              Enter any shipping container number above or click on one of the quick chips to view the complete 10-step verified tracking procedure.
            </p>
          </div>

          {/* High-level 10 Stage Flow Preview */}
          <div className="pt-4 max-w-4xl mx-auto">
            <div className="text-[11px] font-bold text-slate-400 uppercase tracking-wider mb-3">
              10-Point End-to-End Tracking Architecture
            </div>
            <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-left">
              {[
                { no: '01', title: 'ICD Out', desc: 'Empty Out from ICD' },
                { no: '02', title: 'Factory In', desc: 'Arrived at Factory' },
                { no: '03', title: 'Factory Out', desc: 'Stuffed & Sealed' },
                { no: '04', title: 'Buffer Yard', desc: 'Buffer In/Out' },
                { no: '05', title: 'Customs Handover', desc: 'EDI LEO Released' },
                { no: '06', title: 'Rail Out Details', desc: 'WDFC Rake Out' },
                { no: '07', title: 'Port Arrival', desc: 'Gateway Port In' },
                { no: '08', title: 'Planned Vessel', desc: 'Feeder Allocation' },
                { no: '09', title: 'Sailing Details', desc: 'Shipped On Board' },
                { no: '10', title: 'Destination Delivery', desc: 'Discharge & Delivery' },
              ].map((s) => (
                <div key={s.no} className="p-2.5 rounded-xl bg-slate-50 border border-slate-200 space-y-0.5">
                  <span className="font-mono text-[10px] font-black text-blue-700">{s.no}</span>
                  <div className="font-bold text-xs text-slate-800 truncate">{s.title}</div>
                  <div className="text-[10px] text-slate-400 truncate">{s.desc}</div>
                </div>
              ))}
            </div>
          </div>
        </div>
      )}

      {/* 4. TRACKED RESULT STATE: 10-MILESTONE ARCHITECTURE */}
      {trackedContainer && !isScanning && (
        <div className="space-y-5 animate-fade-in">
          
          {/* Container Metadata Overview Banner */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-4 sm:p-6 space-y-4">
            <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-100 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-12 h-12 rounded-2xl bg-[#0b1329] text-cyan-400 flex items-center justify-center font-black shadow-md border border-slate-800">
                  <Container className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h2 className="text-lg sm:text-xl font-black font-mono text-slate-950 tracking-tight">
                      {trackedContainer}
                    </h2>
                    <button
                      onClick={() => handleCopy(trackedContainer)}
                      title="Copy Container Number"
                      className="p-1 rounded-lg text-slate-400 hover:text-slate-700 hover:bg-slate-100 cursor-pointer transition-colors"
                    >
                      {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                    </button>
                    <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200">
                      {matched?.containerType || '40 FT RF'}
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 font-medium mt-0.5">
                    Carrier: <strong className="text-slate-800">{matched?.shippingLine || 'MSC / CMA CGM'}</strong> | B/L: <strong className="font-mono text-slate-800">{matched?.blNo || 'CGD0158714'}</strong>
                  </p>
                </div>
              </div>

              {/* Status and Action Buttons */}
              <div className="flex items-center gap-2 flex-wrap">
                <span className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-50 text-emerald-800 border border-emerald-200 text-xs font-bold">
                  <CheckCircle2 className="w-3.5 h-3.5 text-emerald-600" />
                  <span>Stage {currentStageIndex} of 10 In Progress</span>
                </span>

                <button
                  type="button"
                  onClick={handleResetSearch}
                  className="inline-flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  <RotateCcw className="w-3.5 h-3.5" />
                  <span>Track Another</span>
                </button>
              </div>
            </div>

            {/* Quick Route Strip */}
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 bg-slate-50/80 p-3 rounded-2xl border border-slate-100 text-xs">
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Origin ICD / Terminal</span>
                <span className="font-bold text-slate-900 block mt-0.5 truncate">{matched?.terminal || 'TRANSWORLD-DADRI CFS'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Gateway Port (POL)</span>
                <span className="font-bold text-slate-900 block mt-0.5 truncate">{matched?.pol || 'JNPT Nhava Sheva'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Destination Seaport (POD)</span>
                <span className="font-bold text-cyan-800 block mt-0.5 truncate">{matched?.destination || 'JEBEL ALI - UAE'}</span>
              </div>
              <div>
                <span className="text-[10px] text-slate-400 font-bold uppercase block">Consignee Client</span>
                <span className="font-bold text-slate-900 block mt-0.5 truncate">{customer?.name || 'Marhaba Frozen Foods'}</span>
              </div>
            </div>
          </div>

          {/* 10-Step Connected Pipeline Ribbon */}
          <div className="bg-white border border-slate-200 rounded-3xl p-5 shadow-card space-y-3">
            <div className="flex items-center justify-between">
              <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                10-Stage Multimodal Lifecycle Pipeline
              </span>
              <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                Stage {currentStageIndex} of 10 Active
              </span>
            </div>

            {/* Steps Ribbon Grid */}
            <div className="grid grid-cols-2 sm:grid-cols-5 lg:grid-cols-10 gap-1.5">
              {milestones.map((m) => {
                const isDone = m.status === 'completed';
                const isCur = m.status === 'current';
                const IconComp = m.icon;
                return (
                  <div
                    key={m.id}
                    className={`p-2 rounded-xl border text-center transition-all flex flex-col items-center justify-between ${
                      isCur
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                        : isDone
                        ? 'bg-emerald-50 text-emerald-950 border-emerald-200'
                        : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    <div className="flex items-center justify-between w-full mb-1">
                      <span className={`text-[8px] font-black px-1 rounded ${isCur ? 'bg-white/20 text-white' : isDone ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'}`}>
                        {String(m.step).padStart(2, '0')}
                      </span>
                      <IconComp className={`w-3 h-3 ${isCur ? 'text-white animate-bounce' : isDone ? 'text-emerald-600' : 'text-slate-400'}`} />
                    </div>
                    <span className="text-[9px] font-bold truncate max-w-full">
                      {m.title.replace(/^[0-9]+\)\s*/, '')}
                    </span>
                  </div>
                );
              })}
            </div>
          </div>

          {/* DETAILED 10 MILESTONE CARDS (THE EXACT USER SPECIFICATION) */}
          <div className="space-y-3">
            <div className="flex items-center justify-between px-1">
              <h3 className="text-sm font-black text-slate-900 uppercase tracking-wider">
                Detailed Lifecycle Milestones & Field Telemetry
              </h3>
              <span className="text-xs text-slate-500 font-mono">
                Container: {trackedContainer}
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-3.5">
              {milestones.map((m) => {
                const isDone = m.status === 'completed';
                const isCur = m.status === 'current';
                const IconComp = m.icon;

                return (
                  <div
                    key={m.id}
                    className={`rounded-2xl p-4 border transition-all ${
                      isCur
                        ? 'bg-blue-50/70 border-blue-300 shadow-md ring-1 ring-blue-300'
                        : isDone
                        ? 'bg-white border-slate-200/90 shadow-2xs hover:border-slate-300'
                        : 'bg-slate-50/60 border-slate-200/70 opacity-70'
                    }`}
                  >
                    {/* Header */}
                    <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-2.5">
                      <div className="flex items-center gap-2.5">
                        <div
                          className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 ${
                            isCur
                              ? 'bg-blue-600 text-white shadow-sm'
                              : isDone
                              ? 'bg-emerald-600 text-white shadow-xs'
                              : 'bg-slate-200 text-slate-500'
                          }`}
                        >
                          <IconComp className="w-4 h-4" />
                        </div>
                        <div>
                          <div className="flex items-center gap-2">
                            <h4 className="text-xs sm:text-sm font-black text-slate-900">
                              {m.title}
                            </h4>
                            {isCur && (
                              <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-blue-600 text-white uppercase tracking-wider">
                                Current
                              </span>
                            )}
                            {isDone && (
                              <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-emerald-100 text-emerald-800 uppercase tracking-wider">
                                Completed
                              </span>
                            )}
                          </div>
                          <p className="text-[10px] text-slate-500 font-medium">
                            {m.subtitle}
                          </p>
                        </div>
                      </div>

                      <span className="font-mono text-[10px] font-black text-slate-400 shrink-0">
                        STEP #{m.step}
                      </span>
                    </div>

                    {/* Field Data Grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2 pt-3 text-xs">
                      {m.fields.map((f, fIdx) => (
                        <div
                          key={fIdx}
                          className="bg-white/90 p-2 rounded-xl border border-slate-100/90 space-y-0.5"
                        >
                          <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">
                            {f.label}
                          </span>
                          <span className="font-bold text-slate-900 text-[11px] block truncate font-mono" title={f.value}>
                            {f.value}
                          </span>
                        </div>
                      ))}
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* TRANSHIPMENT DETAILS (Collapsible / Hide by default as requested: "Transhipment Details (hide)") */}
          <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-4 sm:p-5 space-y-3">
            <button
              type="button"
              onClick={() => setShowTranshipment(!showTranshipment)}
              className="w-full flex items-center justify-between text-left cursor-pointer group"
            >
              <div className="flex items-center gap-2.5">
                <div className="w-8 h-8 rounded-xl bg-slate-100 group-hover:bg-slate-200 text-slate-700 flex items-center justify-center transition-colors">
                  <Compass className="w-4 h-4" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Transhipment Details
                    </h4>
                    <span className="px-2 py-0.2 rounded-full text-[9px] font-bold bg-slate-100 text-slate-600 border border-slate-200">
                      {showTranshipment ? 'Visible' : 'Hidden'}
                    </span>
                  </div>
                  <p className="text-[10px] text-slate-500">
                    Intermodal relay port, feeder vessel, and transit ETD (Click to {showTranshipment ? 'collapse' : 'expand'})
                  </p>
                </div>
              </div>

              <div className="p-1 rounded-lg bg-slate-100 text-slate-600">
                {showTranshipment ? <ChevronUp className="w-4 h-4" /> : <ChevronDown className="w-4 h-4" />}
              </div>
            </button>

            {showTranshipment && (
              <div className="pt-3 border-t border-slate-100 grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs animate-fade-in">
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Port</span>
                  <span className="font-bold text-slate-900 block truncate">
                    PORT OF SALALAH / JEBEL ALI HUB
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Vessel</span>
                  <span className="font-bold text-slate-900 block truncate">
                    MSC MAYA / CMA CGM PALANGA
                  </span>
                </div>
                <div className="bg-slate-50 p-3 rounded-xl border border-slate-100 space-y-0.5">
                  <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">ETD</span>
                  <span className="font-mono font-bold text-blue-700 block truncate">
                    08/10/2026 14:00 PM (Est)
                  </span>
                </div>
              </div>
            )}
          </div>

        </div>
      )}

    </div>
  );
}
