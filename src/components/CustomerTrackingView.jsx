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
  FileText, 
  Download, 
  Share2, 
  Copy, 
  Check, 
  Navigation, 
  Anchor, 
  Train, 
  Building2, 
  Calendar, 
  Layers, 
  Search, 
  Radio, 
  RotateCcw,
  ArrowRight
} from 'lucide-react';

export default function CustomerTrackingView({ customer, prefilledQuery = 'TRIU8629477' }) {
  const [searchQuery, setSearchQuery] = useState(prefilledQuery);
  const [activeQuery, setActiveQuery] = useState(prefilledQuery);
  const [copied, setCopied] = useState(false);

  useEffect(() => {
    if (prefilledQuery) {
      setSearchQuery(prefilledQuery);
      setActiveQuery(prefilledQuery);
    }
  }, [prefilledQuery]);

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  const handleSearch = (e) => {
    if (e) e.preventDefault();
    if (searchQuery.trim()) {
      setActiveQuery(searchQuery.trim().toUpperCase());
    }
  };

  // Pipeline summary
  const pipelineSteps = [
    { label: 'Origin Plant', sub: 'ICD Dadri Hub', status: 'completed', icon: Building2 },
    { label: 'Customs & LEO', sub: 'ICEGATE Cleared', status: 'completed', icon: ShieldCheck },
    { label: 'DFC Rail Rake', sub: 'In-Transit WDFC', status: 'completed', icon: Train },
    { label: 'Port Gateway', sub: 'JNPT / BMCT Terminal', status: 'current', icon: Anchor },
    { label: 'Ocean Liner', sub: 'Evergreen / Hapag', status: 'upcoming', icon: Ship },
    { label: 'Destination', sub: 'Jebel Ali / Global', status: 'upcoming', icon: CheckCircle2 }
  ];

  // Milestones
  const milestones = [
    {
      step: 1,
      title: 'Booking Confirmed & Empty Container Released',
      location: 'ICD Dadri / Aligarh Export Hub',
      timestamp: '2026-03-22 09:30 AM',
      status: 'completed',
      details: 'Container inspected, pre-tripped (PTI OK), release order RO-98124 issued.',
      icon: Building2
    },
    {
      step: 2,
      title: 'Factory Stuffed & Terminal Gate-In',
      location: 'TRANSWORLD-DADRI / ALLCARGO CFS',
      timestamp: '2026-03-23 04:15 PM',
      status: 'completed',
      details: `Loaded with frozen export cargo. Electronic Seal #SPJ-SEAL-99824 verified. Reefer genset connected.`,
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
      details: 'Vessel: MV EVER GLOBE / V.0442W. Feeder connection to Arabian Gulf / Global Hub.',
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
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* 1. Track Search Hero Header */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#1e40af] p-5 sm:p-8 rounded-3xl text-white shadow-xl flex flex-col lg:flex-row items-center justify-between gap-6 relative overflow-hidden">
        <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-96 h-96 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

        <div className="space-y-2 text-center lg:text-left relative z-10">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            SPJ Multimodal Track & Trace Portal
          </div>
          <h1 className="text-2xl sm:text-3xl font-black font-display tracking-tight text-white">
            Container Tracking & Live Status
          </h1>
          <p className="text-xs sm:text-sm text-cyan-100/90 font-normal max-w-xl">
            Real-time track & trace for container movements across Inland CFS, DFC Rail Corridors, Seaport Terminals, and Ocean Line Carriers.
          </p>
        </div>

        {/* Search Bar on Hero */}
        <form onSubmit={handleSearch} className="w-full lg:w-auto flex flex-col sm:flex-row items-center gap-2 relative z-10">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
              placeholder="Enter Container # (e.g. TRIU8629477)"
              className="w-full pl-10 pr-4 py-3 bg-white text-slate-900 border-2 border-white/30 focus:border-cyan-400 rounded-2xl text-xs sm:text-sm font-bold placeholder-slate-400 focus:outline-none shadow-md uppercase"
              required
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-6 py-3 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Track Container</span>
          </button>
        </form>
      </div>

      {/* 2. Container Summary Card & Top Actions */}
      <div className="bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#0f172a] text-white p-5 sm:p-6 rounded-3xl shadow-lg border border-slate-800 space-y-4">
        
        <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3 border-b border-slate-800 pb-4">
          <div className="flex items-center gap-3">
            <div className="w-11 h-11 rounded-2xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center text-cyan-300">
              <Container className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-mono text-xl sm:text-2xl font-black text-cyan-400 tracking-wider">
                  {activeQuery}
                </span>
                <button
                  onClick={() => handleCopy(activeQuery)}
                  className="p-1 rounded-lg hover:bg-slate-800 text-slate-400 hover:text-white transition-colors"
                  title="Copy Container Number"
                >
                  {copied ? <Check className="w-4 h-4 text-emerald-400" /> : <Copy className="w-4 h-4" />}
                </button>
              </div>
              <span className="text-xs text-slate-400">
                Type: <strong className="text-slate-200">40 FT HIGH CUBE REEFER (-18°C)</strong> • Carrier: <strong className="text-cyan-300">EVERGREEN LINE</strong>
              </span>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={() => handleCopy(window.location.href)}
              className="px-3.5 py-1.5 rounded-xl bg-white/10 hover:bg-white/20 border border-white/20 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors cursor-pointer"
            >
              <Share2 className="w-3.5 h-3.5" />
              <span>Share Link</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3.5 py-1.5 rounded-xl bg-gradient-to-r from-blue-600 to-indigo-600 hover:opacity-90 text-white text-xs font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Download Slip</span>
            </button>
          </div>
        </div>

        {/* 4 Details Columns */}
        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 text-xs pt-1">
          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Current Movement Status</span>
            <span className="text-sm font-black text-emerald-400 flex items-center gap-1.5 mt-0.5">
              <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
              Rail In-Transit (WDFC)
            </span>
            <span className="text-[11px] text-slate-300 block mt-0.5">
              Loc: <strong>WDFC Dadri Yard Bay-4</strong>
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
            <span className="text-[11px] text-slate-400 block">Transit Day: 4 of 7</span>
          </div>

          <div>
            <span className="text-[10px] font-bold text-slate-400 uppercase block">Verification & Seals</span>
            <span className="font-mono text-slate-200 block mt-0.5">
              Seal: <strong className="text-white">SPJ-SEAL-99824</strong>
            </span>
            <span className="text-[11px] text-emerald-400 font-bold block">
              ✓ Customs LEO Cleared
            </span>
          </div>
        </div>

      </div>

      {/* 3. Multimodal Corridor Pipeline Steps */}
      <div className="bg-white border border-slate-200 rounded-3xl p-4 sm:p-5 shadow-card space-y-3">
        <span className="text-xs font-bold text-slate-500 uppercase tracking-wider block">
          Multimodal Transit Pipeline Progression
        </span>
        <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2 sm:gap-3">
          {pipelineSteps.map((step, sIdx) => {
            const isD = step.status === 'completed';
            const isC = step.status === 'current';
            const StepIcon = step.icon;
            return (
              <div 
                key={sIdx} 
                className={`p-3 rounded-2xl border text-center transition-all ${
                  isC 
                    ? 'bg-gradient-to-br from-blue-600 to-indigo-700 text-white border-blue-600 shadow-md ring-2 ring-blue-300' 
                    : isD 
                    ? 'bg-emerald-50 text-emerald-950 border-emerald-200' 
                    : 'bg-slate-50 text-slate-400 border-slate-200 opacity-60'
                }`}
              >
                <StepIcon className={`w-5 h-5 mx-auto mb-1.5 ${isC ? 'text-white animate-bounce' : isD ? 'text-emerald-600' : 'text-slate-400'}`} />
                <div className="text-xs font-black truncate">{step.label}</div>
                <div className={`text-[10px] truncate mt-0.5 ${isC ? 'text-blue-100' : isD ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>{step.sub}</div>
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
                Live Cold Chain Reefer Telemetry & Sensor Sampling
              </h3>
              <span className="text-[11px] text-cyan-800 font-medium">
                Daikin / Carrier Transicold Micro-Link 3 Gateway • 10-minute IoT sync
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
          <div className="bg-white p-3.5 rounded-2xl border border-cyan-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Setpoint</span>
            <span className="font-mono text-lg font-black text-blue-700 block mt-0.5">-18.0°C</span>
            <span className="text-[9px] text-emerald-600 font-bold">Locked Target</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-cyan-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Supply Air</span>
            <span className="font-mono text-lg font-black text-cyan-700 block mt-0.5">-18.4°C</span>
            <span className="text-[9px] text-cyan-600 font-bold">Active Evaporator</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-cyan-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Return Air</span>
            <span className="font-mono text-lg font-black text-indigo-700 block mt-0.5">-17.9°C</span>
            <span className="text-[9px] text-indigo-600 font-bold">Cargo Ambient</span>
          </div>

          <div className="bg-white p-3.5 rounded-2xl border border-cyan-200 shadow-2xs text-center">
            <span className="text-[10px] font-bold text-slate-500 uppercase block">Power Source</span>
            <span className="font-mono text-sm sm:text-base font-black text-emerald-700 block mt-0.5 flex items-center justify-center gap-1">
              <Zap className="w-4 h-4 text-emerald-600" />
              440V CLIP-ON
            </span>
            <span className="text-[9px] text-emerald-600 font-bold">Continuous Genset</span>
          </div>
        </div>
      </div>

      {/* 5. Detailed Milestone Journey Stepper */}
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
  );
}
