import React, { useState } from 'react';
import { 
  X, 
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
  ExternalLink,
  Navigation,
  Anchor,
  Train,
  Building2,
  Calendar,
  Layers,
  Search,
  ArrowRight,
  Activity,
  Gauge
} from 'lucide-react';

export default function CustomerTrackingModal({ container, initialQuery, onClose, customer }) {
  const [copied, setCopied] = useState(false);
  const [searchQuery, setSearchQuery] = useState(initialQuery || container?.contNo || 'TRIU8629477');

  if (!container && !initialQuery) return null;

  const contNo = container?.contNo || searchQuery || 'TRIU8629477';
  const isReefer = container?.type?.includes('REEFER') || true;

  const handleCopy = (text) => {
    navigator.clipboard.writeText(text);
    setCopied(true);
    setTimeout(() => setCopied(false), 2000);
  };

  // High-level Corridor Pipeline Steps
  const pipelineSteps = [
    { label: 'Origin Factory', sub: 'ICD Dadri', status: 'completed', icon: Building2 },
    { label: 'Customs & LEO', sub: 'ICEGATE Passed', status: 'completed', icon: ShieldCheck },
    { label: 'DFC Rail Rake', sub: 'In-Transit WDFC', status: 'completed', icon: Train },
    { label: 'Port Gateway', sub: 'JNPT / Nhava Sheva', status: 'current', icon: Anchor },
    { label: 'Ocean Vessel', sub: 'Evergreen / Hapag', status: 'upcoming', icon: Ship },
    { label: 'Final Destination', sub: 'Jebel Ali / UAE', status: 'upcoming', icon: CheckCircle2 }
  ];

  // Tracking milestones
  const milestones = [
    {
      step: 1,
      title: 'Booking Confirmed & Empty Released',
      location: container?.origin || 'ICD Dadri / Aligarh Export Hub',
      timestamp: '2026-03-22 09:30 AM',
      status: 'completed',
      details: 'Container inspected, pre-tripped (PTI OK), release order RO-98124 issued.',
      icon: Building2
    },
    {
      step: 2,
      title: 'Factory Stuffed & Terminal Gate-In',
      location: container?.terminal || 'TRANSWORLD-DADRI / ALLCARGO CFS',
      timestamp: '2026-03-23 04:15 PM',
      status: 'completed',
      details: `Loaded with export cargo. SPJ Electronic Seal #${container?.sealNo || 'SPJ-SEAL-99824'} verified. Reefer genset connected.`,
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
      location: `${container?.shippingLine || 'EVERGREEN / HAPAG-LLOYD'} Liner • Arabian Sea Corridor`,
      timestamp: '2026-03-27 22:00 PM (Est)',
      status: 'upcoming',
      details: 'Vessel: MV EVER GLOBE / V.0442W. Feeder connection to Arabian Gulf / Global Hub.',
      icon: Ship
    },
    {
      step: 7,
      title: 'Port of Discharge & Consignee Delivery',
      location: container?.destination || 'Jebel Ali Port (AEJEA), UAE',
      timestamp: '2026-04-02 10:00 AM (ETA)',
      status: 'upcoming',
      details: 'Final discharge, delivery order release & warehouse de-stuffing.',
      icon: CheckCircle2
    }
  ];

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-2 sm:p-4 md:p-6 bg-slate-950/80 backdrop-blur-md animate-fade-in overflow-y-auto">
      
      {/* Modal Container */}
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[92vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#1e40af] p-4 sm:p-5 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-11 sm:h-11 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-cyan-300 shadow-inner shrink-0">
              <Container className="w-6 h-6" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-base sm:text-lg font-black font-display tracking-tight text-white">
                  SPJ Container Live Tracker
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-[11px] text-blue-100/80 mt-0.5">
                Multimodal Rail, Yard & Ocean Freight Lifecycle • SPJ Cargo Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Action Bar */}
        <div className="p-3 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Enter Container / Seal / BL #"
                className="w-full pl-8 pr-3 py-1.5 bg-white border border-slate-300 focus:border-[#0284c7] rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 uppercase focus:outline-none"
              />
            </div>
            <button 
              type="button"
              className="px-3.5 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-sm transition-colors cursor-pointer"
            >
              Track
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
            <button
              onClick={() => handleCopy(window.location.href)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Tracking'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm cursor-pointer"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tracking Slip</span>
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-5 overflow-y-auto space-y-4 flex-1">
          
          {/* Main Container Info Card */}
          <div className="bg-gradient-to-br from-slate-900 via-[#0b1329] to-[#0f172a] text-white p-4 sm:p-5 rounded-2xl shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 relative z-10">
              
              {/* Container Number & Type */}
              <div className="space-y-1 col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-slate-800/80 pb-2 sm:pb-0 sm:pr-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Container Number</span>
                <div className="flex items-center gap-1.5">
                  <span className="font-mono text-base sm:text-lg font-black text-cyan-400 tracking-wide">
                    {contNo}
                  </span>
                  <button 
                    onClick={() => handleCopy(contNo)}
                    className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3 h-3" />
                  </button>
                </div>
                <div className="inline-flex items-center gap-1 px-2 py-0.5 rounded-md bg-blue-500/20 text-blue-300 text-[10px] font-bold border border-blue-500/30 mt-0.5">
                  <span>{container?.size || '40 FT'} {container?.type || 'REEFER (-18°C)'}</span>
                </div>
              </div>

              {/* Status & Movement */}
              <div className="space-y-1 col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-slate-800/80 pb-2 sm:pb-0 sm:pr-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Movement Status</span>
                <span className="text-xs sm:text-sm font-black text-emerald-400 flex items-center gap-1">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse shrink-0"></span>
                  <span className="truncate">{container?.status || 'Rail In-Transit (WDFC)'}</span>
                </span>
                <span className="text-[10px] text-slate-300 font-medium block truncate">
                  Loc: <strong className="text-white">{container?.liveGPS || 'WDFC Dadri Yard Bay-4'}</strong>
                </span>
              </div>

              {/* Origin & Destination */}
              <div className="space-y-1 col-span-2 sm:col-span-1 border-b sm:border-b-0 sm:border-r border-slate-800/80 pb-2 sm:pb-0 sm:pr-3">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Route Corridor</span>
                <div className="text-[11px] font-bold text-slate-200 truncate">
                  <span className="text-slate-400">From:</span> {container?.terminal || 'TRANSWORLD-DADRI'}
                </div>
                <div className="text-[11px] font-bold text-cyan-300 truncate">
                  <span className="text-slate-400">To:</span> {container?.destination || 'Jebel Ali Port (AEJEA)'}
                </div>
                <span className="text-[9px] text-slate-400 block truncate">
                  Line: <strong className="text-white">{container?.shippingLine || 'EVERGREEN LINE'}</strong>
                </span>
              </div>

              {/* ETA & Seals */}
              <div className="space-y-1 col-span-2 sm:col-span-1">
                <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Delivery (ETA)</span>
                <span className="text-xs sm:text-sm font-black text-amber-300 block font-mono">
                  {container?.eta || '2026-03-28 14:00'}
                </span>
                <div className="text-[10px] text-slate-300 font-mono truncate">
                  Seal: <strong className="text-white">{container?.sealNo || 'SPJ-SEAL-99824'}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Horizontal Corridor Progress Tracker */}
          <div className="bg-slate-50 border border-slate-200/80 rounded-2xl p-3 sm:p-4">
            <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block mb-3">
              Corridor Transit Progress (Multimodal Pipeline)
            </span>
            <div className="grid grid-cols-2 sm:grid-cols-3 lg:grid-cols-6 gap-2">
              {pipelineSteps.map((step, sIdx) => {
                const isD = step.status === 'completed';
                const isC = step.status === 'current';
                const StepIcon = step.icon;
                return (
                  <div 
                    key={sIdx} 
                    className={`p-2 rounded-xl border text-center relative transition-all ${
                      isC 
                        ? 'bg-blue-600 text-white border-blue-600 shadow-md ring-2 ring-blue-300' 
                        : isD 
                        ? 'bg-emerald-50 text-emerald-900 border-emerald-200' 
                        : 'bg-white text-slate-400 border-slate-200 opacity-60'
                    }`}
                  >
                    <StepIcon className={`w-4 h-4 mx-auto mb-1 ${isC ? 'text-white animate-bounce' : isD ? 'text-emerald-600' : 'text-slate-400'}`} />
                    <div className="text-[10px] font-bold truncate leading-tight">{step.label}</div>
                    <div className={`text-[8px] truncate mt-0.5 ${isC ? 'text-blue-100' : isD ? 'text-emerald-700 font-semibold' : 'text-slate-400'}`}>{step.sub}</div>
                  </div>
                );
              })}
            </div>
          </div>

          {/* Cold Chain Reefer Telemetry Widget */}
          {isReefer && (
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border border-cyan-500/30 rounded-2xl p-3 sm:p-4 space-y-2.5">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-7 h-7 rounded-lg bg-cyan-600 text-white flex items-center justify-center font-bold shadow-sm">
                    <Thermometer className="w-4 h-4" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Live Cold Chain Telemetry & Sensor Metrics
                    </h4>
                    <span className="text-[10px] text-cyan-800 font-medium">
                      Daikin / Carrier Transicold Micro-Link 3 Gateway • Continuous Sampling
                    </span>
                  </div>
                </div>

                <span className="px-2.5 py-0.5 rounded-full text-[9px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  TEMP OPTIMAL (-18°C)
                </span>
              </div>

              {/* 4 Sensor Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 pt-1">
                <div className="bg-white p-2.5 rounded-xl border border-cyan-200/80 shadow-2xs text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Setpoint</span>
                  <span className="font-mono text-sm sm:text-base font-black text-blue-700 block mt-0.5">-18.0°C</span>
                  <span className="text-[8px] text-emerald-600 font-bold">Locked Target</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-cyan-200/80 shadow-2xs text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Supply Air</span>
                  <span className="font-mono text-sm sm:text-base font-black text-cyan-700 block mt-0.5">-18.4°C</span>
                  <span className="text-[8px] text-cyan-600 font-bold">Active Evaporator</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-cyan-200/80 shadow-2xs text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Return Air</span>
                  <span className="font-mono text-sm sm:text-base font-black text-indigo-700 block mt-0.5">-17.9°C</span>
                  <span className="text-[8px] text-indigo-600 font-bold">Cargo Ambient</span>
                </div>

                <div className="bg-white p-2.5 rounded-xl border border-cyan-200/80 shadow-2xs text-center">
                  <span className="text-[9px] font-bold text-slate-500 uppercase block">Power Source</span>
                  <span className="font-mono text-xs sm:text-sm font-black text-emerald-700 block mt-0.5 flex items-center justify-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-emerald-600" />
                    440V CLIP-ON
                  </span>
                  <span className="text-[8px] text-emerald-600 font-bold">Continuous Genset</span>
                </div>
              </div>
            </div>
          )}

          {/* Multimodal Milestone Progress Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-5 shadow-2xs space-y-4">
            <div className="flex items-center justify-between border-b border-slate-100 pb-2.5">
              <div>
                <h3 className="text-xs sm:text-sm font-black text-slate-900">
                  Multimodal Milestone Journey
                </h3>
                <p className="text-[11px] text-slate-500">
                  Real-time synchronization with SPJ Yard Gate, Indian Railways EDI & Seaport Gateways
                </p>
              </div>
              <span className="text-[11px] font-bold text-slate-600 bg-slate-100 px-2.5 py-1 rounded-lg">
                Step 4 of 7 Completed
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 sm:pl-7 space-y-4 before:absolute before:left-3 before:top-2 before:bottom-2 before:w-0.5 before:bg-slate-200">
              {milestones.map((item, idx) => {
                const isDone = item.status === 'completed';
                const isCur = item.status === 'current';
                const IconComponent = item.icon;

                return (
                  <div key={idx} className="relative group">
                    {/* Node Badge */}
                    <div className={`absolute -left-6 sm:-left-7 top-0.5 w-6 h-6 rounded-full flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-emerald-600 text-white shadow-sm ring-3 ring-emerald-100' 
                        : isCur 
                        ? 'bg-blue-600 text-white shadow-md ring-3 ring-blue-100 animate-pulse' 
                        : 'bg-slate-100 text-slate-400 border border-slate-300'
                    }`}>
                      <IconComponent className="w-3 h-3" />
                    </div>

                    {/* Step Card */}
                    <div className={`p-3 rounded-xl border transition-all ${
                      isCur 
                        ? 'bg-blue-50/70 border-blue-200 shadow-2xs' 
                        : isDone 
                        ? 'bg-white border-slate-200 hover:border-slate-300' 
                        : 'bg-slate-50/60 border-slate-200 opacity-60'
                    }`}>
                      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-0.5">
                        <div className="flex items-center gap-1.5">
                          <span className={`text-xs font-black ${isCur ? 'text-blue-950' : 'text-slate-900'}`}>
                            {item.title}
                          </span>
                          {isCur && (
                            <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-blue-600 text-white uppercase tracking-wider">
                              In Progress
                            </span>
                          )}
                        </div>
                        <span className="text-[10px] font-mono font-semibold text-slate-500">
                          {item.timestamp}
                        </span>
                      </div>

                      <div className="text-[11px] font-bold text-slate-700 mt-0.5 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-rose-500 shrink-0" />
                        <span>{item.location}</span>
                      </div>

                      <p className="text-[11px] text-slate-600 mt-1 font-medium leading-relaxed">
                        {item.details}
                      </p>
                    </div>
                  </div>
                );
              })}
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="p-3 sm:p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authenticated Data Source: SPJ Yard Management & Shipping Line EDI Portals</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-1.5 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
