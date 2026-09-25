import React, { useState, useEffect } from 'react';
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
  RotateCcw
} from 'lucide-react';

export default function CustomerTrackingView({ customer, prefilledQuery = '' }) {
  const [searchInput, setSearchInput] = useState(prefilledQuery);
  const [searchedContainer, setSearchedContainer] = useState(prefilledQuery ? prefilledQuery.trim().toUpperCase() : null);
  const [copied, setCopied] = useState(false);
  const [isSearching, setIsSearching] = useState(false);

  useEffect(() => {
    if (prefilledQuery && prefilledQuery.trim()) {
      setSearchInput(prefilledQuery);
      setSearchedContainer(prefilledQuery.trim().toUpperCase());
    }
  }, [prefilledQuery]);

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

  // Progressive connected arrow pipeline steps
  const progressivePipeline = [
    { id: 1, label: 'Origin ICD Plant', sub: 'Dadri / Aligarh Hub', status: 'completed', icon: Building2 },
    { id: 2, label: 'Customs & LEO', sub: 'ICEGATE Passed', status: 'completed', icon: ShieldCheck },
    { id: 3, label: 'DFC Rail Corridor', sub: 'Wagon SPJ-4482', status: 'completed', icon: Train },
    { id: 4, label: 'Port Gateway', sub: 'JNPT / BMCT Port', status: 'current', icon: Anchor },
    { id: 5, label: 'Ocean Liner', sub: 'Arabian Sea Route', status: 'upcoming', icon: Ship },
    { id: 6, label: 'Port of Discharge', sub: 'Jebel Ali / Delivery', status: 'upcoming', icon: CheckCircle2 }
  ];

  // Detailed lifecycle milestones
  const milestones = [
    {
      step: 1,
      title: 'Booking Confirmed & Empty Released',
      location: 'ICD Dadri / Factory Hub',
      timestamp: '2026-03-22 09:30 AM',
      status: 'completed',
      details: 'Container pre-inspected (PTI OK), release order RO-98124 issued.',
      icon: Building2
    },
    {
      step: 2,
      title: 'Factory Stuffed & Terminal Gate-In',
      location: 'TRANSWORLD-DADRI / ALLCARGO CFS',
      timestamp: '2026-03-23 04:15 PM',
      status: 'completed',
      details: 'Loaded with export cargo. SPJ Electronic Seal #SPJ-SEAL-99824 verified. Reefer genset connected.',
      icon: Truck
    },
    {
      step: 3,
      title: 'Customs Examination & EDI LEO Issued',
      location: 'Customs Inland Container Depot (ICD Dadri)',
      timestamp: '2026-03-24 11:00 AM',
      status: 'completed',
      details: `ICEGATE Shipping Bill cleared. Let Export Order (LEO) passed under GSTIN: ${customer?.gstin || '09AAACF3799A1ZN'}.`,
      icon: ShieldCheck
    },
    {
      step: 4,
      title: 'Loaded on Dedicated Freight Rake (DFC Railhead)',
      location: 'Western Dedicated Freight Corridor (WDFC)',
      timestamp: '2026-03-25 02:40 AM',
      status: 'completed',
      details: 'Wagon No. CONCOR/SPJ-4482. Rail transit to Gateway Port in progress (Speed: 75 km/h).',
      icon: Train
    },
    {
      step: 5,
      title: 'Gateway Port In-Transit / Discharging',
      location: 'Jawaharlal Nehru Port (JNPT / BMCT Terminal)',
      timestamp: '2026-03-26 18:00 PM (Est)',
      status: 'current',
      details: 'Port Gate-In queue scheduled. Stacking allocated at Yard Bay 42-East for vessel loading.',
      icon: Anchor
    },
    {
      step: 6,
      title: 'Vessel Staged & Ocean In-Transit',
      location: 'EVERGREEN LINE • Arabian Sea Corridor',
      timestamp: '2026-03-27 22:00 PM (Est)',
      status: 'upcoming',
      details: 'Vessel: MV EVER GLOBE / V.0442W. Feeder connection to Arabian Gulf.',
      icon: Ship
    },
    {
      step: 7,
      title: 'Port of Discharge & Consignee Delivery',
      location: 'Jebel Ali Port (AEJEA), UAE',
      timestamp: '2026-04-02 10:00 AM (ETA)',
      status: 'upcoming',
      details: 'Final discharge, delivery order release & warehouse de-stuffing.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in max-w-5xl mx-auto">
      
      {/* 1. Clean Minimal Search Bar Box */}
      <div className="bg-white p-6 sm:p-8 rounded-3xl border border-slate-200 shadow-card space-y-4">
        <div className="text-center max-w-lg mx-auto space-y-1.5">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-blue-50 border border-blue-200 text-blue-800 text-[11px] font-bold uppercase tracking-wider">
            <Navigation className="w-3.5 h-3.5 text-blue-600" />
            SPJ Multimodal Track & Trace
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display text-slate-900 tracking-tight">
            Track Cargo & Container Status
          </h2>
          <p className="text-xs sm:text-sm text-slate-500 font-medium">
            Enter your Container Number, B/L Number, or Seal Number to get real-time tracking
          </p>
        </div>

        {/* Input & Track Form */}
        <form onSubmit={handleTrackSubmit} className="max-w-xl mx-auto flex flex-col sm:flex-row items-center gap-2 pt-2">
          <div className="relative w-full">
            <Search className="w-4 h-4 text-slate-400 absolute left-4 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchInput}
              onChange={(e) => setSearchInput(e.target.value)}
              placeholder="Enter Container # (e.g. TRIU8629477)"
              className="w-full pl-11 pr-4 py-3 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border-2 border-slate-200 focus:border-[#0284c7] rounded-2xl text-xs sm:text-sm font-bold text-slate-900 placeholder-slate-400 focus:outline-none uppercase transition-all shadow-inner"
              required
              autoFocus
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
        <div className="flex items-center justify-center gap-2 text-xs text-slate-400 pt-1 flex-wrap">
          <span className="font-semibold text-[11px]">Quick Track:</span>
          {['TRIU8629477', 'SUDU6130211', 'TEMU570284'].map((code) => (
            <button
              key={code}
              type="button"
              onClick={() => {
                setSearchInput(code);
                setSearchedContainer(code);
              }}
              className="px-2.5 py-1 rounded-lg bg-slate-100 hover:bg-slate-200 text-slate-700 font-mono text-[11px] font-bold border border-slate-200 transition-colors cursor-pointer"
            >
              {code}
            </button>
          ))}
        </div>
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
                      {searchedContainer}
                    </span>
                    <button
                      onClick={() => handleCopy(searchedContainer)}
                      className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors cursor-pointer"
                      title="Copy Container Number"
                    >
                      {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                  <span className="text-xs text-slate-400">
                    Type: <strong className="text-slate-200">40 FT REEFER (-18°C)</strong> • Shipping Line: <strong className="text-cyan-300">EVERGREEN / MSC</strong>
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
                  Rail In-Transit (WDFC)
                </span>
                <span className="text-[11px] text-slate-300 block mt-0.5">
                  Loc: <strong>Dadri Railhead Bay-4</strong>
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Route Corridor</span>
                <span className="font-bold text-slate-200 block mt-0.5">From: TRANSWORLD-DADRI</span>
                <span className="font-bold text-cyan-300 block">To: Jebel Ali Port (AEJEA)</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Estimated Delivery (ETA)</span>
                <span className="text-sm font-black text-amber-300 block font-mono mt-0.5">
                  2026-03-28 14:00 IST
                </span>
                <span className="text-[11px] text-slate-400 block">Progress: Stage 4 of 6</span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Verification & Seals</span>
                <span className="font-mono text-slate-200 block mt-0.5">
                  Seal: <strong className="text-white">SPJ-SEAL-99824</strong>
                </span>
                <span className="text-[11px] text-emerald-400 font-bold block">
                  ✓ Customs LEO Passed
                </span>
              </div>
            </div>

          </div>

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
