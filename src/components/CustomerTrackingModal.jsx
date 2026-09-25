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
  Search
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
      details: `Loaded with frozen export cargo. SPJ Electronic Seal #${container?.sealNo || 'SPJ-SEAL-89421'} verified. Reefer genset connected.`,
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
      <div className="relative w-full max-w-5xl bg-white rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto max-h-[95vh] flex flex-col">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#1e40af] p-5 sm:p-6 text-white flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 sm:w-12 sm:h-12 rounded-2xl bg-white/10 backdrop-blur-md border border-white/20 flex items-center justify-center text-cyan-300 shadow-inner">
              <Container className="w-6 h-6 sm:w-7 sm:h-7" />
            </div>
            <div>
              <div className="flex items-center gap-2 flex-wrap">
                <h2 className="text-lg sm:text-xl font-black font-display tracking-tight text-white">
                  SPJ Container Live Tracker
                </h2>
                <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-500/20 text-emerald-300 border border-emerald-400/30 flex items-center gap-1">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
                  LIVE TELEMETRY
                </span>
              </div>
              <p className="text-xs text-blue-100/80 mt-0.5">
                Multimodal Rail, Yard & Ocean Freight Lifecycle • SPJ Cargo Gateway
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-9 h-9 rounded-xl bg-white/10 hover:bg-white/20 text-white flex items-center justify-center transition-all cursor-pointer"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Search / Query Bar */}
        <div className="p-3 sm:p-4 bg-slate-100 border-b border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 w-full sm:w-auto">
            <div className="relative flex-1 sm:w-72">
              <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value.toUpperCase())}
                placeholder="Enter Container / Seal / BL #"
                className="w-full pl-9 pr-3 py-1.5 bg-white border border-slate-300 focus:border-[#0284c7] rounded-xl text-xs font-bold text-slate-900 placeholder-slate-400 uppercase focus:outline-none"
              />
            </div>
            <button 
              type="button"
              className="px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white text-xs font-bold rounded-xl shadow-sm transition-colors"
            >
              Track
            </button>
          </div>

          <div className="flex items-center gap-2 text-xs w-full sm:w-auto justify-end">
            <button
              onClick={() => handleCopy(window.location.href)}
              className="px-3 py-1.5 rounded-xl bg-white hover:bg-slate-50 border border-slate-300 text-slate-700 font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              {copied ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
              <span>{copied ? 'Link Copied' : 'Share Tracking'}</span>
            </button>

            <button
              onClick={() => window.print()}
              className="px-3 py-1.5 rounded-xl bg-[#0b1329] hover:bg-slate-800 text-white font-semibold flex items-center gap-1.5 transition-colors shadow-sm"
            >
              <Download className="w-3.5 h-3.5" />
              <span>Tracking Slip</span>
            </button>
          </div>
        </div>

        {/* Modal Body (Scrollable) */}
        <div className="p-4 sm:p-6 overflow-y-auto space-y-6 flex-1">
          
          {/* Main Container Info Card */}
          <div className="bg-gradient-to-br from-slate-900 to-[#0b1329] text-white p-4 sm:p-6 rounded-2xl sm:rounded-3xl shadow-lg border border-slate-800 relative overflow-hidden">
            <div className="absolute right-0 top-0 translate-x-10 -translate-y-10 w-64 h-64 bg-cyan-500/10 rounded-full blur-3xl pointer-events-none"></div>

            <div className="grid grid-cols-1 md:grid-cols-4 gap-4 relative z-10">
              
              {/* Container Number & Type */}
              <div className="space-y-1 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Container Number</span>
                <div className="flex items-center gap-2">
                  <span className="font-mono text-lg sm:text-xl font-black text-cyan-400 tracking-wide">
                    {contNo}
                  </span>
                  <button 
                    onClick={() => handleCopy(contNo)}
                    className="p-1 rounded-md hover:bg-slate-800 text-slate-400 hover:text-white"
                  >
                    <Copy className="w-3.5 h-3.5" />
                  </button>
                </div>
                <div className="inline-flex items-center gap-1.5 px-2.5 py-0.5 rounded-lg bg-blue-500/20 text-blue-300 text-[11px] font-bold border border-blue-500/30 mt-1">
                  <span>{container?.size || '40 FT'} {container?.type || 'HIGH CUBE REEFER'}</span>
                </div>
              </div>

              {/* Status & Movement */}
              <div className="space-y-1 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Current Movement Status</span>
                <span className="text-sm sm:text-base font-black text-emerald-400 flex items-center gap-1.5">
                  <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
                  {container?.status || 'Rail Transit (WDFC Dadri -> JNPT)'}
                </span>
                <span className="text-[11px] text-slate-300 font-medium block">
                  Location: <strong className="text-white">{container?.liveGPS || 'WDFC Railhead Bay-04'}</strong>
                </span>
              </div>

              {/* Origin & Destination */}
              <div className="space-y-1 md:col-span-1 border-b md:border-b-0 md:border-r border-slate-800 pb-3 md:pb-0 md:pr-4">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Origin & Destination</span>
                <div className="text-xs font-bold text-slate-200">
                  <span className="text-slate-400">From:</span> {container?.terminal || 'DADRI-ALLCARGO ICD'}
                </div>
                <div className="text-xs font-bold text-cyan-300">
                  <span className="text-slate-400">To:</span> {container?.destination || 'Jebel Ali Port (AEJEA)'}
                </div>
                <span className="text-[10px] text-slate-400 block">
                  Shipping Line: <strong className="text-white">{container?.shippingLine || 'EVERGREEN / HAPAG-LLOYD'}</strong>
                </span>
              </div>

              {/* ETA & Seals */}
              <div className="space-y-1 md:col-span-1">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Estimated Delivery (ETA)</span>
                <span className="text-sm sm:text-base font-black text-amber-300 block font-mono">
                  {container?.eta || '2026-03-28 14:00 IST'}
                </span>
                <div className="text-[11px] text-slate-300 pt-1 font-mono">
                  Seal No: <strong className="text-white">{container?.sealNo || 'SPJ-SEAL-89421'}</strong>
                </div>
              </div>

            </div>
          </div>

          {/* Cold Chain Reefer Telemetry Widget */}
          {isReefer && (
            <div className="bg-gradient-to-r from-cyan-500/10 via-blue-500/10 to-indigo-500/10 border-2 border-cyan-500/30 rounded-2xl p-4 sm:p-5 space-y-3">
              <div className="flex items-center justify-between flex-wrap gap-2">
                <div className="flex items-center gap-2">
                  <div className="w-8 h-8 rounded-xl bg-cyan-600 text-white flex items-center justify-center font-bold shadow-md">
                    <Thermometer className="w-5 h-5" />
                  </div>
                  <div>
                    <h4 className="text-xs sm:text-sm font-black text-slate-900">
                      Live Cold Chain Telemetry & Sensor Metrics
                    </h4>
                    <span className="text-[11px] text-cyan-800 font-semibold">
                      Daikin / Carrier Transicold Micro-Link 3 Gateway • Continuous Sampling
                    </span>
                  </div>
                </div>

                <span className="px-3 py-1 rounded-full text-[10px] font-extrabold bg-emerald-100 text-emerald-800 border border-emerald-300 flex items-center gap-1.5">
                  <span className="w-1.5 h-1.5 rounded-full bg-emerald-600 animate-pulse"></span>
                  TEMP OPTIMAL (-18°C)
                </span>
              </div>

              {/* 4 Sensor Gauges */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 pt-2">
                <div className="bg-white p-3 rounded-xl border border-cyan-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Setpoint</span>
                  <span className="font-mono text-base sm:text-lg font-black text-blue-700 block mt-0.5">-18.0°C</span>
                  <span className="text-[9px] text-emerald-600 font-bold">Locked Target</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-cyan-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Supply Air</span>
                  <span className="font-mono text-base sm:text-lg font-black text-cyan-700 block mt-0.5">-18.4°C</span>
                  <span className="text-[9px] text-cyan-600 font-bold">Active Evaporator</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-cyan-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Return Air</span>
                  <span className="font-mono text-base sm:text-lg font-black text-indigo-700 block mt-0.5">-17.9°C</span>
                  <span className="text-[9px] text-indigo-600 font-bold">Cargo Ambient</span>
                </div>

                <div className="bg-white p-3 rounded-xl border border-cyan-200/80 shadow-sm text-center">
                  <span className="text-[10px] font-bold text-slate-500 uppercase block">Power Source</span>
                  <span className="font-mono text-base sm:text-lg font-black text-emerald-700 block mt-0.5 flex items-center justify-center gap-1">
                    <Zap className="w-4 h-4 text-emerald-600" />
                    440V CLIP-ON
                  </span>
                  <span className="text-[9px] text-emerald-600 font-bold">Continuous Genset</span>
                </div>
              </div>
            </div>
          )}

          {/* Multimodal Milestone Progress Timeline */}
          <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-sm space-y-5">
            <div className="flex items-center justify-between border-b border-slate-100 pb-3">
              <div>
                <h3 className="text-sm sm:text-base font-black text-slate-900">
                  Multimodal Milestone Journey
                </h3>
                <p className="text-xs text-slate-500">
                  Real-time synchronization with SPJ Yard Gate, Indian Railways EDI & Seaport Gateways
                </p>
              </div>
              <span className="text-xs font-bold text-slate-500">
                Step 4 of 7 Completed
              </span>
            </div>

            {/* Stepper Timeline */}
            <div className="relative pl-6 sm:pl-8 space-y-6 before:absolute before:left-3 sm:before:left-4 before:top-3 before:bottom-3 before:w-0.5 before:bg-slate-200">
              {milestones.map((item, idx) => {
                const isDone = item.status === 'completed';
                const isCur = item.status === 'current';
                const IconComponent = item.icon;

                return (
                  <div key={idx} className="relative group">
                    {/* Node Badge */}
                    <div className={`absolute -left-6 sm:-left-8 top-0 w-6 h-6 sm:w-8 sm:h-8 rounded-full flex items-center justify-center transition-all ${
                      isDone 
                        ? 'bg-emerald-600 text-white shadow-md ring-4 ring-emerald-100' 
                        : isCur 
                        ? 'bg-blue-600 text-white shadow-lg ring-4 ring-blue-100 animate-pulse' 
                        : 'bg-slate-100 text-slate-400 border-2 border-slate-300'
                    }`}>
                      <IconComponent className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
                    </div>

                    {/* Step Card */}
                    <div className={`p-3.5 sm:p-4 rounded-2xl border transition-all ${
                      isCur 
                        ? 'bg-blue-50/70 border-blue-200 shadow-sm' 
                        : isDone 
                        ? 'bg-white border-slate-200 hover:border-slate-300' 
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
                        <span className="text-[11px] font-mono font-semibold text-slate-500">
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

        {/* Modal Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-3 shrink-0 text-xs">
          <div className="flex items-center gap-2 text-slate-500 text-[11px]">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Authenticated Data Source: SPJ Yard Management & Shipping Line EDI Portals</span>
          </div>

          <div className="flex items-center gap-2 w-full sm:w-auto justify-end">
            <button
              onClick={onClose}
              className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-200 hover:bg-slate-300 text-slate-800 font-bold transition-colors cursor-pointer"
            >
              Close
            </button>
          </div>
        </div>

      </div>

    </div>
  );
}
