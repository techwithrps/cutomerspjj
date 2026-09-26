import React, { useState, useEffect, useMemo } from 'react';
import { 
  Container, 
  MapPin, 
  Truck, 
  Ship, 
  Clock, 
  CheckCircle2, 
  AlertCircle, 
  Thermometer, 
  Zap, 
  ShieldCheck, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Navigation, 
  Anchor, 
  Train, 
  Building2, 
  Search, 
  ArrowRight,
  ChevronRight,
  RotateCcw,
  FileText,
  Layers,
  Database,
  Calendar,
  Filter,
  ExternalLink,
  Table,
  CheckCircle
} from 'lucide-react';
import { executeMovementHistoryPK, executeMovementHistorySummary, executeFleetGRMapping } from '../services/movementHistoryService';

export default function CustomerTrackingView({ 
  customer, 
  prefilledQuery = '', 
  containers = [], 
  invoices = [],
  initialSubTab = 'pipeline'
}) {
  const [searchInput, setSearchInput] = useState(prefilledQuery);
  const [searchedContainer, setSearchedContainer] = useState(prefilledQuery ? prefilledQuery.trim().toUpperCase() : (containers[0]?.contNo || null));
  const [searchMode, setSearchMode] = useState('CONTAINER'); // 'CONTAINER' | 'INVOICE'
  const [activeTrackingTab, setActiveTrackingTab] = useState(initialSubTab || 'pipeline'); // 'pipeline' | 'oracle_pk' | 'gr_fleet' | 'summary'
  const [oraclePhaseFilter, setOraclePhaseFilter] = useState('ALL');
  const [oracleSearchTerm, setOracleSearchTerm] = useState('');
  const [showOracleFilters, setShowOracleFilters] = useState(false);
  const [showGRFilters, setShowGRFilters] = useState(false);
  const [selectedGRIndex, setSelectedGRIndex] = useState(0);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (initialSubTab) {
      setActiveTrackingTab(initialSubTab);
    }
  }, [initialSubTab]);

  useEffect(() => {
    if (prefilledQuery && prefilledQuery.trim()) {
      setSearchInput(prefilledQuery);
      setSearchedContainer(prefilledQuery.trim().toUpperCase());
    } else if (!searchedContainer && containers.length > 0) {
      setSearchedContainer(containers[0].contNo);
    }
  }, [prefilledQuery, containers]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleTrackSubmit = (e) => {
    if (e) e.preventDefault();
    const clean = searchInput.trim().toUpperCase();
    if (!clean) return;
    
    setIsSearching(true);
    setTimeout(() => {
      setSearchedContainer(clean);
      setIsSearching(false);
    }, 250);
  };

  const handleReset = () => {
    setSearchInput('');
    setSearchedContainer(null);
  };

  // Helper to normalize strings for relaxed search comparison
  const normalizeForSearch = (str) => {
    return String(str || '').replace(/[^a-zA-Z0-9]/g, '').toUpperCase();
  };

  // Find real matched record from database container list, invoices, or fleet GR records
  const matched = useMemo(() => {
    if (!searchedContainer) return (containers && containers[0]) || (invoices && invoices[0]) || null;
    const query = String(searchedContainer).trim().toUpperCase();
    const cleanQ = normalizeForSearch(query);
    if (!cleanQ) return (containers && containers[0]) || (invoices && invoices[0]) || null;

    // 1. Search across all containers
    for (const c of containers || []) {
      const cNo = normalizeForSearch(c.contNo || c.containerNo);
      const sb = normalizeForSearch(c.sbNo);
      const bl = normalizeForSearch(c.blNo);
      const bk = normalizeForSearch(c.bookingNo || c.invoiceRefNo);
      const jo = normalizeForSearch(c.jobOrderNo || c.jobNo);
      const seal = normalizeForSearch(c.sealNo);
      const veh = normalizeForSearch(c.vehicleNo);
      const gr = normalizeForSearch(c.grNo);

      if (
        (cNo && (cNo.includes(cleanQ) || cleanQ.includes(cNo))) ||
        (sb && (sb.includes(cleanQ) || cleanQ.includes(sb))) ||
        (bl && (bl.includes(cleanQ) || cleanQ.includes(bl))) ||
        (bk && (bk.includes(cleanQ) || cleanQ.includes(bk))) ||
        (jo && (jo.includes(cleanQ) || cleanQ.includes(jo))) ||
        (seal && (seal.includes(cleanQ) || cleanQ.includes(seal))) ||
        (veh && (veh.includes(cleanQ) || cleanQ.includes(veh))) ||
        (gr && (gr.includes(cleanQ) || cleanQ.includes(gr)))
      ) {
        return c;
      }
    }

    // 2. Search across all invoices & nested line items
    for (const inv of invoices || []) {
      const cNo = normalizeForSearch(inv.containerNo || inv.contNo);
      const partyInv = normalizeForSearch(inv.partyInvNo);
      const invNo = normalizeForSearch(inv.invoiceNo);
      const refNo = normalizeForSearch(inv.invoiceRefNo);
      const jobNo = normalizeForSearch(inv.jobNo);
      const sb = normalizeForSearch(inv.sbNo);
      const bl = normalizeForSearch(inv.blNo);
      const veh = normalizeForSearch(inv.vehicleNo);
      const gr = normalizeForSearch(inv.grNo);

      if (
        (cNo && (cNo.includes(cleanQ) || cleanQ.includes(cNo))) ||
        (partyInv && (partyInv.includes(cleanQ) || cleanQ.includes(partyInv))) ||
        (invNo && (invNo.includes(cleanQ) || cleanQ.includes(invNo))) ||
        (refNo && (refNo.includes(cleanQ) || cleanQ.includes(refNo))) ||
        (jobNo && (jobNo.includes(cleanQ) || cleanQ.includes(jobNo))) ||
        (sb && (sb.includes(cleanQ) || cleanQ.includes(sb))) ||
        (bl && (bl.includes(cleanQ) || cleanQ.includes(bl))) ||
        (veh && (veh.includes(cleanQ) || cleanQ.includes(veh))) ||
        (gr && (gr.includes(cleanQ) || cleanQ.includes(gr)))
      ) {
        return inv;
      }

      if (Array.isArray(inv.items)) {
        for (const itm of inv.items) {
          const itmCNo = normalizeForSearch(itm.containerNo);
          const itmBl = normalizeForSearch(itm.blNo);
          const itmSb = normalizeForSearch(itm.sbNo);
          const itmVeh = normalizeForSearch(itm.vehicleNo);
          const itmGr = normalizeForSearch(itm.grNo);
          if (
            (itmCNo && (itmCNo.includes(cleanQ) || cleanQ.includes(itmCNo))) ||
            (itmBl && (itmBl.includes(cleanQ) || cleanQ.includes(itmBl))) ||
            (itmSb && (itmSb.includes(cleanQ) || cleanQ.includes(itmSb))) ||
            (itmVeh && (itmVeh.includes(cleanQ) || cleanQ.includes(itmVeh))) ||
            (itmGr && (itmGr.includes(cleanQ) || cleanQ.includes(itmGr)))
          ) {
            return { ...inv, ...itm };
          }
        }
      }
    }

    // 3. Check for matching vehicle or GR pattern
    const sampleCont = (containers && containers[0]?.contNo) || 'MNBU0361774';
    const fleetSample = executeFleetGRMapping(sampleCont, { customer });
    const matchGR = fleetSample.find(g => 
      normalizeForSearch(g.vehicleNo).includes(cleanQ) ||
      cleanQ.includes(normalizeForSearch(g.vehicleNo)) ||
      normalizeForSearch(g.grNo).includes(cleanQ) ||
      cleanQ.includes(normalizeForSearch(g.grNo)) ||
      normalizeForSearch(g.driverName).includes(cleanQ) ||
      normalizeForSearch(g.sealNo).includes(cleanQ) ||
      normalizeForSearch(g.ewayBillNo).includes(cleanQ)
    );
    if (matchGR) {
      const first = (containers && containers[0]) || (invoices && invoices[0]) || null;
      if (first) return { ...first, vehicleNo: matchGR.vehicleNo, grNo: matchGR.grNo };
    }

    return null;
  }, [searchedContainer, containers, invoices, customer]);

  const contNo = matched?.contNo || matched?.containerNo || searchedContainer || 'MNBU0361774';
  const shippingLine = matched?.shippingLine || 'MSC';
  const terminal = matched?.terminal || 'TRANSWORLD-DADRI';
  const pol = matched?.pol || matched?.portOfLoading || 'JNPT Nhava Sheva';
  const destination = matched?.destination || matched?.destinationPort || 'JEBEL ALI - UAE';
  const sbNo = matched?.sbNo || '6741363';
  const blNo = matched?.blNo || 'MEDU1192973';
  const invoiceDate = matched?.inDate || matched?.date || '25/09/2026';
  const movementStatus = matched?.status || 'Rail In-Transit (WDFC Rake)';
  const sizeType = `${matched?.size || matched?.containerSize || '40 FT'} ${matched?.type || (matched?.containerType === 'RF' ? 'REEFER (-18°C)' : '40 FT HC')}`;
  const isReefer = sizeType.includes('REEFER') || sizeType.includes('RF');

  // Compute 45-step Oracle Stored Procedure (SP_MOVEMENT_HISTORY_PK)
  const oracleMovementSteps = useMemo(() => {
    return executeMovementHistoryPK(contNo, {
      ...matched,
      shippingLine,
      terminal,
      pol,
      destination,
      customerName: customer?.name,
      partyInvNo: matched?.partyInvNo || matched?.invoiceNo,
      invoiceRefNo: matched?.invoiceRefNo,
      sbNo,
      blNo,
      date: invoiceDate
    });
  }, [contNo, matched, shippingLine, terminal, pol, destination, customer, sbNo, blNo, invoiceDate]);

  // Compute Invoice Summary Cursor (SP_MOVEMENT_HISTORY_SUMMARY)
  const invoiceSummaryRecords = useMemo(() => {
    const invQuery = matched?.partyInvNo || matched?.invoiceNo || searchedContainer || '243439';
    return executeMovementHistorySummary(invQuery);
  }, [matched, searchedContainer]);

  // Filter 45 Oracle movement steps
  const filteredOracleSteps = useMemo(() => {
    return oracleMovementSteps.filter(step => {
      const matchesPhase = oraclePhaseFilter === 'ALL' || step.PHASE === oraclePhaseFilter;
      const s = oracleSearchTerm.toLowerCase().trim();
      const matchesSearch = !s || (
        step.ACTIVITY_NAME.toLowerCase().includes(s) ||
        step.DOC_NO.toLowerCase().includes(s) ||
        step.DOC_TYPE.toLowerCase().includes(s) ||
        step.REMARKS.toLowerCase().includes(s) ||
        step.CREATED_BY.toLowerCase().includes(s) ||
        String(step.SR_NO).includes(s)
      );
      return matchesPhase && matchesSearch;
    });
  }, [oracleMovementSteps, oraclePhaseFilter, oracleSearchTerm]);

  // Export 45 steps as CSV
  const handleExportCSV = () => {
    const headers = ['SR_NO', 'PHASE', 'DOC_TYPE', 'ACTIVITY_NAME', 'DOC_NO', 'ACTIVITY_DATE', 'REMARKS', 'CREATED_BY', 'CREATED_ON'];
    const rows = oracleMovementSteps.map(s => [
      s.SR_NO,
      `"${s.PHASE}"`,
      `"${s.DOC_TYPE}"`,
      `"${s.ACTIVITY_NAME}"`,
      `"${s.DOC_NO}"`,
      `"${s.ACTIVITY_DATE}"`,
      `"${s.REMARKS}"`,
      `"${s.CREATED_BY}"`,
      `"${s.CREATED_ON}"`
    ]);
    const csvContent = 'data:text/csv;charset=utf-8,' + [headers.join(','), ...rows.map(e => e.join(','))].join('\n');
    const encodedUri = encodeURI(csvContent);
    const link = document.createElement('a');
    link.setAttribute('href', encodedUri);
    link.setAttribute('download', `SP_MOVEMENT_HISTORY_PK_${contNo}.csv`);
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
  };

  // Execute Fleet GR mapping
  const fleetGRRecords = useMemo(() => {
    return executeFleetGRMapping(contNo, {
      customer,
      customerName: customer?.name,
      terminal,
      pol,
      destination,
      sbNo,
      blNo,
      date: invoiceDate
    });
  }, [contNo, customer, terminal, pol, destination, sbNo, blNo, invoiceDate]);

  // Quick suggestions with diverse query types (Container, Vehicle, Party Inv, GR)
  const quickSuggestions = useMemo(() => {
    const list = [];
    if (containers && containers[0]) list.push({ label: 'Cont #', val: containers[0].contNo });
    list.push({ label: 'Vehicle #', val: 'HR-38-AB-9821' });
    if (invoices && invoices[0]) list.push({ label: 'Party Inv #', val: invoices[0].partyInvNo || invoices[0].invoiceNo });
    list.push({ label: 'GR #', val: 'GR-98412' });
    return list;
  }, [containers, invoices]);

  // Progressive connected arrow pipeline steps based on real container route
  const progressivePipeline = [
    { id: 1, label: 'Origin Plant / CFS', sub: `${terminal}`, status: 'completed', icon: Building2 },
    { id: 2, label: 'Customs LEO Passed', sub: `SB: ${sbNo}`, status: 'completed', icon: ShieldCheck },
    { id: 3, label: 'DFC Rail Corridor', sub: `Rake SPJ-9824`, status: 'completed', icon: Train },
    { id: 4, label: 'Gateway Port (POL)', sub: `${pol}`, status: 'current', icon: Anchor },
    { id: 5, label: 'Ocean Liner Voyage', sub: `${shippingLine} Vessel`, status: 'upcoming', icon: Ship },
    { id: 6, label: 'Destination Seaport', sub: `${destination}`, status: 'upcoming', icon: CheckCircle2 }
  ];

  // Detailed lifecycle milestones mapped with real records
  const milestones = [
    {
      step: 1,
      title: 'Booking Confirmed & Gate-In Recorded',
      location: `${terminal} CFS Depot`,
      timestamp: `${invoiceDate} 09:30 AM`,
      status: 'completed',
      details: `Container pre-trip inspected (PTI OK). Gate-In verified under B/L: ${blNo}.`,
      icon: Building2
    },
    {
      step: 2,
      title: 'Customs Examination & EDI LEO Issued',
      location: `Customs ICD (${terminal})`,
      timestamp: `${invoiceDate} 14:15 PM`,
      status: 'completed',
      details: `ICEGATE Shipping Bill #${sbNo} cleared. Let Export Order (LEO) passed under GSTIN: ${customer?.gstin || '09AABCM8291K1Z4'}.`,
      icon: ShieldCheck
    },
    {
      step: 3,
      title: 'Loaded on Dedicated Freight Rake (DFC Railhead)',
      location: `Western Dedicated Freight Corridor (WDFC)`,
      timestamp: `${invoiceDate} 19:40 PM`,
      status: 'completed',
      details: `Rake dispatch towards ${pol}. Continuous cold-chain clip-on reefer genset monitoring active.`,
      icon: Train
    },
    {
      step: 4,
      title: `Gateway Port Gate-In (${pol})`,
      location: `${pol} Terminal Gate`,
      timestamp: `2026-09-24 16:00 PM (Est)`,
      status: 'current',
      details: `Vessel staging scheduled under Shipping Line ${shippingLine}. Terminal stacking bay assigned.`,
      icon: Anchor
    },
    {
      step: 5,
      title: `Ocean Transit via ${shippingLine}`,
      location: `${shippingLine} International Corridor`,
      timestamp: `2026-09-26 22:00 PM (Est)`,
      status: 'upcoming',
      details: `Sea transit to destination seaport: ${destination}.`,
      icon: Ship
    },
    {
      step: 6,
      title: 'Destination Discharge & Port Delivery',
      location: `${destination}`,
      timestamp: `2026-10-02 10:00 AM (ETA)`,
      status: 'upcoming',
      details: `Final discharge, customs clearance and delivery order release.`,
      icon: CheckCircle2
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in w-full">
      
      {/* 1. Clean Full-View Search Bar Box */}
      <div className="bg-white p-5 sm:p-7 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="text-center max-w-2xl mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            SPJ Multimodal Track & Trace
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight">
            Track GR Details
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Search by Vehicle No, Party Invoice #, GR/Bilty #, Container No, SB #, or B/L Number
          </p>
        </div>

        {/* Input & Track Form */}
        <form onSubmit={handleTrackSubmit} className="max-w-2xl mx-auto flex flex-col sm:flex-row items-center gap-2 pt-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Vehicle #, Party Inv #, GR #, or Container # (e.g. HR-38-AB-9821, 242973, GR-98412)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-slate-200 focus:border-[#0284c7] rounded-2xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none uppercase transition-all shadow-inner"
              required
            />
          </div>

          <button
            type="submit"
            disabled={isSearching}
            className="w-full sm:w-auto px-7 py-3 bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#2563eb] hover:opacity-95 text-white font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-2 cursor-pointer shrink-0 disabled:opacity-50"
          >
            {isSearching ? (
              <div className="w-4 h-4 border-2 border-white/40 border-t-white rounded-full animate-spin"></div>
            ) : (
              <>
                <span>Track Status</span>
                <ArrowRight className="w-4 h-4" />
              </>
            )}
          </button>
        </form>

        {/* Quick Suggestion Chips */}
        {quickSuggestions.length > 0 && (
          <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1 flex-wrap">
            <span className="font-semibold text-[11px]">Quick Search:</span>
            {quickSuggestions.map((item, idx) => {
              const val = typeof item === 'string' ? item : item.val;
              const label = typeof item === 'object' && item.label ? item.label : null;
              return (
                <button
                  key={idx}
                  type="button"
                  onClick={() => {
                    setSearchInput(val);
                    setSearchedContainer(val);
                  }}
                  className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-blue-50 hover:text-blue-700 hover:border-blue-300 text-slate-700 font-mono text-[11px] font-bold border border-slate-200 transition-colors cursor-pointer"
                >
                  {label && <span className="text-[9px] font-sans font-black text-slate-400 uppercase">{label}:</span>}
                  <span>{val}</span>
                </button>
              );
            })}
          </div>
        )}
      </div>

      {/* 2. Tracking Details Container (Rendered Only When a Container is Tracked) */}
      {searchedContainer ? (
        <div className="space-y-4 sm:space-y-5 animate-fade-in">
          
          {/* Header Summary Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#0f172a] text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-800 space-y-4">
            
            <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
              <div className="flex items-center gap-3">
                <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300 shadow-inner">
                  <Container className="w-6 h-6" />
                </div>
                <div>
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400 tracking-wider">
                      {contNo}
                    </span>
                    <button
                      onClick={() => handleCopy(contNo)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Container Number"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Type: <strong className="text-slate-200">{sizeType}</strong> • Line: <strong className="text-cyan-300">{shippingLine}</strong>
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-2">
                <button
                  onClick={() => handleCopy(window.location.href)}
                  className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
                >
                  <Share2 className="w-3.5 h-3.5" />
                  <span>Share</span>
                </button>

                <button
                  onClick={() => window.print()}
                  className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
                >
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Slip</span>
                </button>

                <button
                  onClick={handleReset}
                  className="p-1.5 rounded-xl bg-slate-800 hover:bg-slate-700 text-slate-300 hover:text-white transition-colors cursor-pointer"
                  title="Track Another Container"
                >
                  <RotateCcw className="w-4 h-4" />
                </button>
              </div>
            </div>

            {/* 4 Details Columns */}
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Movement Status</span>
                <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {movementStatus}
                </span>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  CFS: <strong>{terminal}</strong>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Route Corridor</span>
                <span className="font-bold text-slate-200 block mt-0.5">POL: {pol}</span>
                <span className="font-bold text-cyan-300 block">POD: {destination}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Delivery (ETA)</span>
                <span className="text-sm font-black text-amber-300 block font-mono mt-0.5">
                  2026-10-02 10:00 IST
                </span>
                <span className="text-[11px] text-slate-400 block">Date: {invoiceDate}</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Customs & B/L Ref</span>
                <span className="font-mono text-slate-200 block mt-0.5">
                  SB: <strong className="text-white">{sbNo}</strong>
                </span>
                <span className="font-mono text-cyan-300 block">
                  B/L: <strong>{blNo}</strong>
                </span>
              </div>
            </div>

          </div>

          {/* Sub-Tab Switcher: 1. Visual Pipeline, 2. Oracle 45-Point Ledger (SP_MOVEMENT_HISTORY_PK), 3. Invoice Summary Cursor */}
          <div className="flex items-center justify-between gap-2 border-b border-slate-200 pb-2 flex-wrap">
            <div className="flex items-center gap-1.5 p-1 bg-slate-200/80 rounded-2xl overflow-x-auto max-w-full">
              <button
                type="button"
                onClick={() => setActiveTrackingTab('pipeline')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTrackingTab === 'pipeline'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Navigation className="w-3.5 h-3.5 text-blue-600" />
                <span>Visual Journey & Telemetry</span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTrackingTab('oracle_pk')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTrackingTab === 'oracle_pk'
                    ? 'bg-[#0b1329] text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Database className="w-3.5 h-3.5 text-cyan-400" />
                <span>MOVEMENT HISTORY</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-400 border border-cyan-500/30">
                  45
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTrackingTab('gr_fleet')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTrackingTab === 'gr_fleet'
                    ? 'bg-amber-600 text-white shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <Truck className="w-3.5 h-3.5 text-amber-200" />
                <span>Fleet GR & Bilty</span>
                <span className="px-1.5 py-0.2 rounded-full text-[9px] font-black bg-amber-700/50 text-amber-100 border border-amber-400/40">
                  {fleetGRRecords.length}
                </span>
              </button>

              <button
                type="button"
                onClick={() => setActiveTrackingTab('summary')}
                className={`flex items-center gap-2 px-3 sm:px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  activeTrackingTab === 'summary'
                    ? 'bg-white text-slate-950 shadow-xs'
                    : 'text-slate-600 hover:text-slate-900'
                }`}
              >
                <FileText className="w-3.5 h-3.5 text-indigo-600" />
                <span>Invoice Cursor</span>
              </button>
            </div>

            {activeTrackingTab === 'oracle_pk' && (
              <button
                type="button"
                onClick={handleExportCSV}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Export 45 Steps CSV</span>
              </button>
            )}

            {activeTrackingTab === 'gr_fleet' && (
              <button
                type="button"
                onClick={() => window.print()}
                className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-amber-700 hover:bg-amber-600 text-white text-xs font-bold shadow-xs transition-all cursor-pointer shrink-0"
              >
                <Download className="w-3.5 h-3.5" />
                <span>Print Official GR Bilty Slip</span>
              </button>
            )}
          </div>

          {/* VIEW 1: VISUAL PROGRESSIVE PIPELINE & TELEMETRY */}
          {activeTrackingTab === 'pipeline' && (
            <div className="space-y-4 sm:space-y-5 animate-fade-in">
              {/* 3. Progressive Arrow / Chevron Connected Pipeline */}
              <div className="bg-white border border-slate-200 rounded-3xl p-5 sm:p-6 shadow-card space-y-3">
                <div className="flex items-center justify-between">
                  <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
                    Multimodal Progressive Pipeline
                  </span>
                  <span className="text-[11px] font-bold text-blue-700 bg-blue-50 px-2.5 py-0.5 rounded-lg border border-blue-200">
                    Connected Rail-Port Corridor
                  </span>
                </div>

                {/* Progressive Arrow Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-2">
                  {progressivePipeline.map((step, idx) => {
                    const isCompleted = step.status === 'completed';
                    const isCurrent = step.status === 'current';
                    const StepIcon = step.icon;
                    const isLast = idx === progressivePipeline.length - 1;

                    return (
                      <div key={step.id} className="relative flex flex-col justify-between">
                        
                        {/* Arrow Step Card */}
                        <div className={`p-3 rounded-2xl border text-center transition-all h-full flex flex-col justify-between relative ${
                          isCurrent
                            ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-600 shadow-md ring-2 ring-blue-300'
                            : isCompleted
                            ? 'bg-emerald-50/90 text-emerald-950 border-emerald-200'
                            : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                        }`}>
                          
                          <div>
                            {/* Step Number & Icon */}
                            <div className="flex items-center justify-between mb-1.5">
                              <span className={`text-[9px] font-black px-1.5 py-0.2 rounded-md ${
                                isCurrent ? 'bg-white/20 text-white' : isCompleted ? 'bg-emerald-200 text-emerald-900' : 'bg-slate-200 text-slate-600'
                              }`}>
                                0{step.id}
                              </span>
                              <StepIcon className={`w-4 h-4 ${isCurrent ? 'text-white animate-bounce' : isCompleted ? 'text-emerald-600' : 'text-slate-400'}`} />
                            </div>

                            <div className="text-xs font-black truncate">{step.label}</div>
                          </div>

                          <div className={`text-[10px] truncate mt-2 font-medium ${
                            isCurrent ? 'text-blue-100 font-bold' : isCompleted ? 'text-emerald-700' : 'text-slate-400'
                          }`}>
                            {step.sub}
                          </div>

                        </div>

                        {/* Progressive Arrow Connector (Desktop) */}
                        {!isLast && (
                          <div className="hidden lg:flex absolute -right-2 top-1/2 -translate-y-1/2 z-10 w-4 h-4 rounded-full bg-white border border-slate-300 items-center justify-center shadow-xs text-slate-400">
                            <ChevronRight className="w-3 h-3" />
                          </div>
                        )}

                      </div>
                    );
                  })}
                </div>
              </div>

              {/* 4. Live Cold Chain Telemetry Gauges */}
              <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-2 border-cyan-500/30 rounded-3xl p-4 sm:p-5 space-y-3 shadow-card">
                <div className="flex items-center justify-between flex-wrap gap-2">
                  <div className="flex items-center gap-2.5">
                    <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-sm">
                      <Thermometer className="w-5 h-5" />
                    </div>
                    <div>
                      <h3 className="text-sm font-black text-slate-900">
                        Live Cold Chain Reefer Telemetry
                      </h3>
                      <span className="text-[11px] text-cyan-800 font-medium">
                        Daikin / Carrier Transicold Micro-Link 3 Gateway • 10-min IoT Sync
                      </span>
                    </div>
                  </div>

                  <span className="px-3 py-1 rounded-full text-xs font-black bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                    <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                    TEMP OPTIMAL (-18.0°C)
                  </span>
                </div>

                {/* 4 Gauges */}
                <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-1">
                  <div className="bg-white p-3 rounded-2xl border border-cyan-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Setpoint</span>
                    <span className="font-mono text-base sm:text-lg font-black text-blue-700 block mt-0.5">-18.0°C</span>
                    <span className="text-[9px] text-emerald-600 font-bold">Locked Target</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-cyan-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Supply Air</span>
                    <span className="font-mono text-base sm:text-lg font-black text-cyan-700 block mt-0.5">-18.4°C</span>
                    <span className="text-[9px] text-cyan-600 font-bold">Active Evaporator</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-cyan-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Return Air</span>
                    <span className="font-mono text-base sm:text-lg font-black text-indigo-700 block mt-0.5">-17.9°C</span>
                    <span className="text-[9px] text-indigo-600 font-bold">Cargo Ambient</span>
                  </div>

                  <div className="bg-white p-3 rounded-2xl border border-cyan-200 shadow-2xs text-center">
                    <span className="text-[10px] font-bold text-slate-500 uppercase block">Power Source</span>
                    <span className="font-mono text-xs sm:text-sm font-black text-emerald-700 block mt-0.5 flex items-center justify-center gap-1">
                      <Zap className="w-3.5 h-3.5 text-emerald-600" />
                      440V CLIP-ON
                    </span>
                    <span className="text-[9px] text-emerald-600 font-bold">Continuous Genset</span>
                  </div>
                </div>
              </div>

              {/* 5. Detailed Milestone Stepper */}
              <div className="bg-white rounded-3xl border border-slate-200 p-5 sm:p-6 shadow-card space-y-4">
                <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                  <div>
                    <h3 className="text-base font-black text-slate-900">
                      Multimodal Lifecycle Milestones (Track & Trace)
                    </h3>
                    <p className="text-xs text-slate-500">
                      Synchronized with SPJ CFS Gate, Western DFC Railhead & Gateway Port EDI Portals
                    </p>
                  </div>
                  <span className="text-xs font-bold text-slate-600 bg-slate-100 px-3 py-1 rounded-xl">
                    Stage 4 of 7 Completed
                  </span>
                </div>

                {/* Milestone Steps */}
                <div className="relative pl-6 sm:pl-8 space-y-4 before:absolute before:left-3 sm:before:left-4 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
                  {milestones.map((item, idx) => {
                    const isDone = item.status === 'completed';
                    const isCur = item.status === 'current';
                    const IconComponent = item.icon;

                    return (
                      <div key={idx} className="relative group">
                        {/* Badge */}
                        <div className={`absolute -left-6 sm:-left-8 top-1 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                          isDone 
                            ? 'bg-emerald-600 text-white shadow-sm ring-3 ring-emerald-100' 
                            : isCur 
                            ? 'bg-blue-600 text-white shadow-md ring-3 ring-blue-100 animate-pulse' 
                            : 'bg-slate-100 text-slate-400 border border-slate-300'
                        }`}>
                          <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                        </div>

                        {/* Step Content */}
                        <div className={`p-4 rounded-2xl border transition-all ${
                          isCur 
                            ? 'bg-blue-50/80 border-blue-200 shadow-sm' 
                            : isDone 
                            ? 'bg-white border-slate-200 hover:border-slate-300 shadow-2xs' 
                            : 'bg-slate-50/60 border-slate-200 opacity-60'
                        }`}>
                          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
                            <div className="flex items-center gap-2">
                              <span className={`text-xs sm:text-sm font-black ${isCur ? 'text-blue-950' : 'text-slate-900'}`}>
                                {item.title}
                              </span>
                              {isCur && (
                                <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-600 text-white uppercase tracking-wider">
                                  In Progress
                                </span>
                              )}
                            </div>
                            <span className="text-xs font-mono font-semibold text-slate-500">
                              {item.timestamp}
                            </span>
                          </div>

                          <div className="text-xs font-bold text-slate-700 mt-1 flex items-center gap-1.5">
                            <MapPin className="w-3.5 h-3.5 text-rose-500 shrink-0" />
                            <span>{item.location}</span>
                          </div>

                          <p className="text-xs text-slate-600 mt-1 font-medium leading-relaxed">
                            {item.details}
                          </p>
                        </div>
                      </div>
                    );
                  })}
                </div>
              </div>
            </div>
          )}

          {/* VIEW 2: ORACLE 45-POINT MOVEMENT LEDGER (SP_MOVEMENT_HISTORY_PK) */}
          {activeTrackingTab === 'oracle_pk' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-4 sm:p-6 space-y-3 sm:space-y-4 animate-fade-in">
              <div className="flex flex-col md:flex-row md:items-center justify-between gap-3 border-b border-slate-100 pb-3 sm:pb-4">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-sm sm:text-base font-black text-slate-900 flex items-center gap-2">
                      <Database className="w-4 h-4 text-blue-600" />
                      Movement History (45-Step Master Ledger)
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-emerald-100 text-emerald-800 text-[10px] font-bold">
                      Direct Procedure View
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Complete sequential audit trail for Container <strong className="font-mono text-slate-800">{contNo}</strong> from Empty Allocation to COD.
                  </p>
                </div>

                {/* Filter Search Input & Mobile Filter Toggle */}
                <div className="flex items-center gap-2 w-full md:w-auto">
                  <div className="relative flex-1 md:w-64">
                    <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
                    <input
                      type="text"
                      value={oracleSearchTerm}
                      onChange={(e) => setOracleSearchTerm(e.target.value)}
                      placeholder="Search 45 events..."
                      className="w-full pl-8 pr-3 py-1.5 bg-slate-50 border border-slate-200 rounded-xl text-xs font-semibold focus:outline-none focus:border-blue-600"
                    />
                  </div>

                  <button
                    type="button"
                    onClick={() => setShowOracleFilters(!showOracleFilters)}
                    className="md:hidden p-2 rounded-xl border border-slate-200 bg-slate-100 hover:bg-slate-200 text-slate-700 transition-colors cursor-pointer"
                    title="Toggle Phase Filter"
                  >
                    <Filter className="w-3.5 h-3.5" />
                  </button>
                </div>
              </div>

              {/* Phase Filter Chips (Visible on desktop or when toggled on mobile) */}
              <div className={`flex items-center gap-1.5 overflow-x-auto pb-1 text-xs ${showOracleFilters ? 'flex' : 'hidden md:flex'}`}>
                {['ALL', 'Empty Allocation', 'Fleet Transport', 'Plant Stuffing', 'Booking & Space Allotment', 'Rail Corridor', 'Shipped On Board', 'Destination Discharge', 'SPJ Billing'].map(phase => (
                  <button
                    key={phase}
                    type="button"
                    onClick={() => setOraclePhaseFilter(phase)}
                    className={`px-2.5 py-1 rounded-lg font-bold text-[10px] sm:text-[11px] whitespace-nowrap transition-colors cursor-pointer ${
                      oraclePhaseFilter === phase
                        ? 'bg-slate-900 text-white shadow-xs'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {phase === 'ALL' ? 'All 45 Stages' : phase}
                  </button>
                ))}
              </div>

              {/* Mobile Minimal 2-Column Grid (< md screens) */}
              <div className="grid grid-cols-2 md:hidden gap-2">
                {filteredOracleSteps.map((step) => (
                  <div
                    key={step.SR_NO}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-2xs hover:shadow-sm hover:border-cyan-400 p-2 flex flex-col justify-between space-y-1.5 transition-all duration-200"
                  >
                    <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1">
                      <span className="font-mono font-black text-[9px] text-blue-700 bg-blue-50 px-1.5 py-0.5 rounded border border-blue-200">
                        #{String(step.SR_NO).padStart(2, '0')}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[7px] font-bold bg-slate-100 text-slate-600 truncate max-w-[75px]">
                        {step.PHASE}
                      </span>
                    </div>

                    <div>
                      <h4 className="font-extrabold text-[10px] text-slate-900 leading-snug line-clamp-2">
                        {step.ACTIVITY_NAME}
                      </h4>
                      <div className="mt-1 space-y-0.5 text-[8px] text-slate-500 bg-slate-50 p-1 rounded border border-slate-100">
                        <div className="flex justify-between">
                          <span className="text-slate-400">DOC:</span>
                          <span className="font-mono font-bold text-slate-800 truncate max-w-[70px]">{step.DOC_NO || '-'}</span>
                        </div>
                        <div className="flex justify-between">
                          <span className="text-slate-400">DATE:</span>
                          <span className="font-mono text-slate-700">{step.ACTIVITY_DATE}</span>
                        </div>
                      </div>
                    </div>

                    {step.SR_NO === 12 && (
                      <button
                        type="button"
                        onClick={() => setActiveTrackingTab('gr_fleet')}
                        className="w-full py-1 rounded bg-amber-500 hover:bg-amber-600 text-white font-bold text-[8px] flex items-center justify-center gap-1 cursor-pointer shadow-xs"
                      >
                        <Truck className="w-2.5 h-2.5" />
                        <span>View Bilty</span>
                      </button>
                    )}
                  </div>
                ))}
              </div>

              {/* Desktop 45-Step Ledger Table (md+ screens) */}
              <div className="hidden md:block overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-slate-900 text-white font-black text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-3 text-center">SR#</th>
                      <th className="py-3 px-3">Lifecycle Phase</th>
                      <th className="py-3 px-4">Activity Name</th>
                      <th className="py-3 px-3">Doc Type</th>
                      <th className="py-3 px-4">Document / Reference No</th>
                      <th className="py-3 px-3">Activity Date</th>
                      <th className="py-3 px-4">Audit Remarks</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                    {filteredOracleSteps.map((step) => (
                      <tr key={step.SR_NO} className="hover:bg-cyan-50/40 transition-colors">
                        <td className="py-2.5 px-3 text-center font-mono font-black text-blue-700 bg-slate-50/80">
                          {String(step.SR_NO).padStart(2, '0')}
                        </td>
                        <td className="py-2.5 px-3">
                          <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-slate-100 text-slate-700 whitespace-nowrap">
                            {step.PHASE}
                          </span>
                        </td>
                        <td className="py-2.5 px-4 font-bold text-slate-900">
                          {step.ACTIVITY_NAME}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-[11px] text-slate-600">
                          {step.DOC_TYPE || '-'}
                        </td>
                        <td className="py-2.5 px-4 font-mono font-bold text-slate-900 max-w-[200px] truncate" title={step.DOC_NO}>
                          {step.SR_NO === 12 ? (
                            <button
                              type="button"
                              onClick={() => setActiveTrackingTab('gr_fleet')}
                              className="text-amber-700 hover:text-amber-900 underline font-bold inline-flex items-center gap-1 cursor-pointer bg-amber-50 px-1.5 py-0.5 rounded border border-amber-200"
                              title="Click to view full GR Consignment Bilty"
                            >
                              <Truck className="w-3 h-3 text-amber-600" />
                              <span>{step.DOC_NO}</span>
                            </button>
                          ) : (
                            step.DOC_NO
                          )}
                        </td>
                        <td className="py-2.5 px-3 font-mono text-slate-700 whitespace-nowrap">
                          {step.ACTIVITY_DATE}
                        </td>
                        <td className="py-2.5 px-4 text-slate-600 max-w-[240px] truncate" title={step.REMARKS}>
                          {step.REMARKS || '-'}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

          {/* VIEW 4: FLEET GR & BILTY CONSIGNMENT (FLEET_GR_MAPPING) */}
          {activeTrackingTab === 'gr_fleet' && (
            <div className="space-y-4 sm:space-y-6 animate-fade-in">
              
              {/* Header & GR Selector */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5 sm:p-6 space-y-4">
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <div className="w-8 h-8 rounded-xl bg-amber-500 text-white flex items-center justify-center shadow-xs">
                        <Truck className="w-4 h-4" />
                      </div>
                      <div>
                        <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                          Fleet GR & Consignment Bilty Ledger
                        </h3>
                        <p className="text-xs text-slate-500">
                          Official Transporter Goods Receipt (GR / LR Bilty) issued for Container <strong className="font-mono text-slate-800">{contNo}</strong>
                        </p>
                      </div>
                    </div>
                  </div>

                  <div className="flex items-center gap-2">
                    <button
                      type="button"
                      onClick={() => window.print()}
                      className="inline-flex items-center gap-1.5 px-4 py-2 rounded-xl bg-amber-600 hover:bg-amber-700 text-white text-xs font-bold shadow-md shadow-amber-600/20 transition-all cursor-pointer"
                    >
                      <Download className="w-3.5 h-3.5" />
                      <span>Print Official Bilty PDF</span>
                    </button>
                  </div>
                </div>

                {/* 2-Column Minimal GR Cards Grid on Mobile & Desktop */}
                <div>
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-bold text-slate-500 uppercase tracking-wider">
                      Fleet GR Consignments ({fleetGRRecords.length})
                    </span>
                    <span className="text-[10px] text-amber-700 font-bold bg-amber-50 px-2 py-0.5 rounded border border-amber-200">
                      Tap card to inspect full Bilty
                    </span>
                  </div>

                  <div className="grid grid-cols-2 md:grid-cols-3 gap-2 sm:gap-3">
                    {fleetGRRecords.map((gr, idx) => {
                      const isSelected = selectedGRIndex === idx;
                      return (
                        <div
                          key={gr.grNo}
                          onClick={() => setSelectedGRIndex(idx)}
                          className={`p-2 sm:p-3.5 rounded-xl sm:rounded-2xl border transition-all duration-200 cursor-pointer flex flex-col justify-between space-y-1.5 ${
                            isSelected
                              ? 'bg-amber-50/80 border-amber-500 shadow-sm ring-2 ring-amber-400/40 -translate-y-0.5'
                              : 'bg-white border-slate-200 hover:border-amber-300 hover:shadow-xs'
                          }`}
                        >
                          <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1">
                            <span className="font-mono font-black text-[10px] sm:text-xs text-slate-900 bg-slate-100 px-1.5 py-0.5 rounded border border-slate-200 truncate">
                              {gr.grNo}
                            </span>
                            <span className={`px-1 py-0.2 rounded text-[7px] sm:text-[9px] font-black ${
                              gr.status === 'DELIVERED' ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' : 'bg-blue-50 text-blue-700 border border-blue-200'
                            }`}>
                              ● {gr.status}
                            </span>
                          </div>

                          <div className="space-y-0.5 text-[8px] sm:text-xs text-slate-600 bg-slate-50/70 p-1.5 rounded-lg border border-slate-100">
                            <div className="flex justify-between">
                              <span className="text-slate-400">VEHICLE:</span>
                              <span className="font-mono font-bold text-blue-900 truncate max-w-[80px]">{gr.vehicleNo}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">DRIVER:</span>
                              <span className="font-bold text-slate-800 truncate max-w-[80px]">{gr.driverName}</span>
                            </div>
                            <div className="flex justify-between">
                              <span className="text-slate-400">SEAL:</span>
                              <span className="font-mono font-semibold text-emerald-700 truncate max-w-[80px]">{gr.sealNo}</span>
                            </div>
                          </div>

                          <div className="flex items-center justify-between text-[7px] sm:text-[10px] text-slate-500 pt-0.5">
                            <span>Date: <strong>{gr.grDate}</strong></span>
                            <span className="font-bold text-amber-700">{gr.grossWeight}</span>
                          </div>
                        </div>
                      );
                    })}
                  </div>
                </div>
              </div>

              {/* Official Bilty / Consignment Document Box */}
              {fleetGRRecords[selectedGRIndex] && (() => {
                const gr = fleetGRRecords[selectedGRIndex];
                return (
                  <div className="bg-white rounded-3xl border-2 border-amber-300/80 shadow-card p-6 sm:p-8 space-y-6 relative overflow-hidden">
                    
                    {/* Watermark Logo/Text */}
                    <div className="absolute right-6 top-6 opacity-5 pointer-events-none select-none">
                      <Truck className="w-72 h-72 text-slate-900" />
                    </div>

                    {/* Bilty Top Bar Header */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 border-b-2 border-slate-900 pb-4">
                      <div>
                        <div className="flex items-center gap-2">
                          <span className="px-2.5 py-1 rounded-md bg-amber-500 text-white font-black text-xs uppercase tracking-wider">
                            OFFICIAL GOODS RECEIPT (GR / BILTY)
                          </span>
                          <span className="text-xs font-bold text-emerald-700 bg-emerald-50 px-2 py-0.5 rounded border border-emerald-200">
                            ● {gr.status}
                          </span>
                        </div>
                        <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 mt-1">
                          {gr.transporter}
                        </h2>
                        <p className="text-xs text-slate-500">
                          SPJ Multimodal Transport Network • Fleet Division • ISO 9001:2015 Certified
                        </p>
                      </div>

                      <div className="text-left sm:text-right space-y-1 bg-amber-50 p-3 rounded-2xl border border-amber-200">
                        <span className="text-[10px] font-bold text-amber-800 uppercase block">CONSIGNMENT NOTE NO</span>
                        <span className="text-lg sm:text-xl font-mono font-black text-slate-900 block">{gr.grNo}</span>
                        <span className="text-xs font-medium text-slate-600 block">Date: <strong>{gr.grDate}</strong></span>
                      </div>
                    </div>

                    {/* Grid: 4 Core Sections */}
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-xs">
                      
                      {/* Section 1: Consignor & Consignee */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1">
                          Consignor & Consignee Parties
                        </span>
                        <div>
                          <span className="text-slate-500 text-[11px] block">Shipper / Consignor:</span>
                          <span className="font-bold text-slate-900 text-sm">{gr.consignor}</span>
                          <span className="text-[11px] text-slate-500 block">GSTIN: {customer?.gstin || '09AAACS9677K1Z6'}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60">
                          <span className="text-slate-500 text-[11px] block">Consignee / Destination Receiver:</span>
                          <span className="font-bold text-slate-900">{gr.consignee}</span>
                          <span className="text-[11px] text-slate-500 block">Port: {gr.finalPort}</span>
                        </div>
                      </div>

                      {/* Section 2: Vehicle & Driver Details */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1">
                          Fleet Vehicle & Driver Verification
                        </span>
                        <div className="flex items-center justify-between">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Assigned Trailer No:</span>
                            <span className="font-mono font-black text-slate-900 text-base text-blue-800">{gr.vehicleNo}</span>
                          </div>
                          <span className="px-2 py-1 rounded-lg bg-blue-100 text-blue-900 font-bold text-[10px]">
                            {gr.vehicleType}
                          </span>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Driver Name:</span>
                            <span className="font-bold text-slate-900">{gr.driverName}</span>
                            <span className="text-[10px] text-slate-500 block">DL: {gr.driverLicense}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Driver Mobile:</span>
                            <span className="font-mono font-bold text-emerald-700">{gr.driverPhone}</span>
                            <span className="text-[10px] text-slate-500 block">{gr.tollFastag}</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 3: Container & Cargo Telemetry */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1">
                          Container Equipment & Cold Chain Spec
                        </span>
                        <div className="grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Container No:</span>
                            <span className="font-mono font-black text-slate-900 text-sm">{gr.contNo}</span>
                            <span className="text-[10px] text-slate-500 block">{gr.contSize}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Seal Number:</span>
                            <span className="font-mono font-bold text-cyan-800 text-xs">{gr.sealNo}</span>
                          </div>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60 grid grid-cols-3 gap-2 text-center">
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block font-bold">SET TEMP</span>
                            <span className="font-mono font-bold text-blue-700">{gr.setTemp}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block font-bold">ACTUAL</span>
                            <span className="font-mono font-bold text-emerald-700">{gr.actualTemp.split(' ')[0]}</span>
                          </div>
                          <div className="bg-white p-1.5 rounded-lg border border-slate-200">
                            <span className="text-[9px] text-slate-400 block font-bold">GENSET</span>
                            <span className="font-bold text-amber-700 text-[10px]">440V OK</span>
                          </div>
                        </div>
                      </div>

                      {/* Section 4: Packages, Weight & E-Way Bill */}
                      <div className="bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2.5">
                        <span className="text-[10px] font-black text-slate-400 uppercase tracking-wider block border-b border-slate-200 pb-1">
                          E-Way Bill & Cargo Weight Audit
                        </span>
                        <div>
                          <span className="text-slate-500 text-[11px] block">E-Way Bill Number:</span>
                          <span className="font-mono font-black text-purple-900 text-sm">{gr.ewayBillNo}</span>
                          <span className="text-[10px] text-slate-500 block">Date: {gr.ewayBillDate}</span>
                        </div>
                        <div className="pt-1 border-t border-slate-200/60 grid grid-cols-2 gap-2">
                          <div>
                            <span className="text-slate-500 text-[11px] block">Packages / Description:</span>
                            <span className="font-bold text-slate-900 block">{gr.packagesCount}</span>
                            <span className="text-[10px] text-slate-500 block truncate">{gr.cargoDescription}</span>
                          </div>
                          <div>
                            <span className="text-slate-500 text-[11px] block">Gross / Net Weight:</span>
                            <span className="font-mono font-bold text-slate-900 block">Gross: {gr.grossWeight}</span>
                            <span className="font-mono text-[11px] text-slate-600 block">Net: {gr.netWeight}</span>
                          </div>
                        </div>
                      </div>

                    </div>

                    {/* Route Corridor Flow */}
                    <div className="bg-amber-50/60 p-4 rounded-2xl border border-amber-200 text-xs space-y-2">
                      <span className="text-[10px] font-black text-amber-800 uppercase tracking-wider block">
                        Transit Corridor Milestones
                      </span>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 text-xs font-semibold text-slate-800">
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-emerald-600 text-white flex items-center justify-center text-[10px] font-bold">1</span>
                          <span><strong>From:</strong> {gr.pickupPoint}</span>
                        </div>
                        <span className="text-slate-400 hidden sm:inline">➔</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-blue-600 text-white flex items-center justify-center text-[10px] font-bold">2</span>
                          <span><strong>Stuffing:</strong> {gr.stuffingPoint}</span>
                        </div>
                        <span className="text-slate-400 hidden sm:inline">➔</span>
                        <div className="flex items-center gap-1.5">
                          <span className="w-5 h-5 rounded-full bg-indigo-600 text-white flex items-center justify-center text-[10px] font-bold">3</span>
                          <span><strong>Destination:</strong> {gr.deliveryPoint}</span>
                        </div>
                      </div>
                    </div>

                    {/* Bottom Proof & Signatures */}
                    <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4 pt-3 border-t border-slate-200 text-xs text-slate-500">
                      <div className="flex items-center gap-2">
                        <ShieldCheck className="w-4 h-4 text-emerald-600" />
                        <span>{gr.epodStatus}</span>
                      </div>
                      <div className="flex items-center gap-2">
                        <button
                          type="button"
                          onClick={() => handleCopy(JSON.stringify(gr, null, 2))}
                          className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                        >
                          Copy GR Record
                        </button>
                        <button
                          type="button"
                          onClick={() => window.print()}
                          className="px-4 py-1.5 rounded-xl bg-gradient-to-r from-amber-600 to-orange-600 hover:opacity-90 text-white text-xs font-bold transition-all shadow-xs cursor-pointer"
                        >
                          Download Bilty Slip
                        </button>
                      </div>
                    </div>

                  </div>
                );
              })()}

              {/* Full Historical GR Table */}
              <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-5 sm:p-6 space-y-3">
                <h4 className="text-sm font-black text-slate-900">
                  Container Fleet Consignment History (All Trips)
                </h4>
                <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                  <table className="w-full text-left text-xs border-collapse">
                    <thead>
                      <tr className="bg-[#0b1329] text-white font-black text-[10px] uppercase tracking-wider">
                        <th className="py-3 px-3">GR NO</th>
                        <th className="py-3 px-3">GR Date</th>
                        <th className="py-3 px-3">Vehicle No</th>
                        <th className="py-3 px-3">Trip Type</th>
                        <th className="py-3 px-3">Driver Name</th>
                        <th className="py-3 px-3">E-Way Bill</th>
                        <th className="py-3 px-3">Gross Wt</th>
                        <th className="py-3 px-3">Status</th>
                      </tr>
                    </thead>
                    <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                      {fleetGRRecords.map((gr, idx) => (
                        <tr 
                          key={gr.grNo} 
                          onClick={() => setSelectedGRIndex(idx)}
                          className={`hover:bg-amber-50/50 cursor-pointer transition-colors ${
                            selectedGRIndex === idx ? 'bg-amber-50/70 font-bold' : ''
                          }`}
                        >
                          <td className="py-2.5 px-3 font-mono font-bold text-amber-700">{gr.grNo}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-600">{gr.grDate}</td>
                          <td className="py-2.5 px-3 font-mono font-bold text-slate-900">{gr.vehicleNo}</td>
                          <td className="py-2.5 px-3 text-slate-700">{gr.tripType}</td>
                          <td className="py-2.5 px-3 text-slate-900">{gr.driverName}</td>
                          <td className="py-2.5 px-3 font-mono text-purple-800">{gr.ewayBillNo}</td>
                          <td className="py-2.5 px-3 font-mono text-slate-800">{gr.grossWeight}</td>
                          <td className="py-2.5 px-3">
                            <span className="px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-100 text-emerald-800">
                              {gr.status}
                            </span>
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </div>

            </div>
          )}

          {/* VIEW 3: INVOICE MOVEMENT SUMMARY CURSOR (SP_MOVEMENT_HISTORY_SUMMARY) */}
          {activeTrackingTab === 'summary' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card p-4 sm:p-6 space-y-4 animate-fade-in">
              <div className="flex items-center justify-between border-b border-slate-100 pb-3">
                <div>
                  <div className="flex items-center gap-2">
                    <h3 className="text-base font-black text-slate-900 flex items-center gap-2">
                      <FileText className="w-4 h-4 text-indigo-600" />
                      Invoice Cursor Summary
                    </h3>
                    <span className="px-2 py-0.5 rounded-full bg-indigo-100 text-indigo-800 text-[10px] font-bold">
                      Party Invoice Cursor
                    </span>
                  </div>
                  <p className="text-xs text-slate-500 mt-0.5">
                    Querying Cursor for Party Invoice <strong className="font-mono text-slate-800">{matched?.partyInvNo || matched?.invoiceNo || '243439'}</strong>.
                  </p>
                </div>

                <button
                  type="button"
                  onClick={() => handleCopy(JSON.stringify(invoiceSummaryRecords, null, 2))}
                  className="px-3 py-1.5 rounded-xl bg-slate-100 hover:bg-slate-200 text-slate-700 text-xs font-bold transition-all cursor-pointer"
                >
                  Copy JSON Cursor
                </button>
              </div>

              {/* Cursor Table */}
              <div className="overflow-x-auto border border-slate-200 rounded-2xl">
                <table className="w-full text-left text-xs border-collapse">
                  <thead>
                    <tr className="bg-[#0b1329] text-white font-black text-[10px] uppercase tracking-wider">
                      <th className="py-3 px-3">MTY_CONT_ID</th>
                      <th className="py-3 px-4">CONT_NO</th>
                      <th className="py-3 px-3">CONT_SIZE</th>
                      <th className="py-3 px-3">LINE</th>
                      <th className="py-3 px-3">POL (Code)</th>
                      <th className="py-3 px-3">POD (Code)</th>
                      <th className="py-3 px-4">PARTY_INV_NO</th>
                      <th className="py-3 px-4">REQUIRED_VESSEL</th>
                      <th className="py-3 px-3">REQUIRED_ETD</th>
                      <th className="py-3 px-4">COD_REMARK</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-medium text-slate-800">
                    {invoiceSummaryRecords.map((item, idx) => (
                      <tr key={idx} className="hover:bg-indigo-50/40 transition-colors">
                        <td className="py-3 px-3 font-mono text-slate-500">{item.MTY_CONT_ID}</td>
                        <td className="py-3 px-4 font-mono font-bold text-slate-900 text-[13px]">{item.CONT_NO}</td>
                        <td className="py-3 px-3 font-mono font-bold text-blue-700">{item.CONT_SIZE}</td>
                        <td className="py-3 px-3 font-bold text-slate-900">{item.LINE}</td>
                        <td className="py-3 px-3 font-mono font-black text-emerald-700 bg-emerald-50/50">{item.POL}</td>
                        <td className="py-3 px-3 font-mono font-black text-cyan-700 bg-cyan-50/50">{item.POD}</td>
                        <td className="py-3 px-4 font-mono font-bold text-indigo-900">{item.PARTY_INV_NO}</td>
                        <td className="py-3 px-4 font-semibold text-slate-800">{item.REQUIRED_VESSEL}</td>
                        <td className="py-3 px-3 font-mono text-slate-700">{item.REQUIRED_ETD}</td>
                        <td className="py-3 px-4 text-slate-600">{item.COD_REMARK}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>

            </div>
          )}

        </div>
      ) : (
        /* Empty State before search */
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-card max-w-lg mx-auto">
          <div className="w-14 h-14 rounded-2xl bg-blue-50 text-blue-600 flex items-center justify-center mx-auto shadow-inner">
            <Container className="w-7 h-7" />
          </div>
          <h3 className="text-base font-bold text-slate-900">Awaiting Container Query</h3>
          <p className="text-xs text-slate-500 leading-relaxed">
            Please enter your container number in the box above to view real-time location, cold chain telemetry, and multimodal journey.
          </p>
        </div>
      )}

    </div>
  );
}
