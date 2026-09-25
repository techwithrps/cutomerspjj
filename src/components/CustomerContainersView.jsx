import React, { useState } from 'react';
import { 
  Container, 
  Search, 
  MapPin, 
  Thermometer, 
  ShieldCheck, 
  Truck, 
  Ship, 
  Clock, 
  CheckCircle2, 
  AlertCircle,
  Copy,
  Check,
  Navigation,
  ArrowRight
} from 'lucide-react';

export default function CustomerContainersView({ containers = [], customer, onNavigateTrack }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const filtered = (containers || []).filter((c) => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    return (
      (c.contNo || '').toLowerCase().includes(s) ||
      (c.sealNo || '').toLowerCase().includes(s) ||
      (c.bookingNo || '').toLowerCase().includes(s) ||
      (c.jobOrderNo || '').toLowerCase().includes(s) ||
      (c.destination || '').toLowerCase().includes(s) ||
      (c.terminal || '').toLowerCase().includes(s) ||
      (c.shippingLine || '').toLowerCase().includes(s) ||
      (c.origin || '').toLowerCase().includes(s) ||
      (c.status || '').toLowerCase().includes(s) ||
      (c.size || '').toLowerCase().includes(s) ||
      (c.type || '').toLowerCase().includes(s)
    );
  });

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Search Header */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        <div>
          <div className="flex items-center gap-2">
            <h2 className="text-base sm:text-lg font-black font-display text-slate-900">
              Live Container & Yard Fleet Tracking
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {filtered.length} Active Boxes
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real-time status for containers booked under {customer?.name}
          </p>
        </div>

        <div className="relative w-full sm:max-w-xs">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search Container / Seal #..."
            className="w-full pl-9 pr-8 py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#0284c7] rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all uppercase"
          />
          {searchTerm && (
            <button
              onClick={() => setSearchTerm('')}
              className="absolute right-2.5 top-1/2 -translate-y-1/2 text-xs text-slate-400 hover:text-slate-700 cursor-pointer p-0.5"
            >
              ✕
            </button>
          )}
        </div>
      </div>

      {/* Containers Grid */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-card">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Active Containers Found</h3>
          <p className="text-xs text-slate-500">
            No active container matches your query "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          {filtered.map((item, idx) => {
            const isReefer = item.type?.includes('REEFER');

            return (
              <div 
                key={idx}
                className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-200 p-4 sm:p-5 space-y-4 hover-lift"
              >
                {/* Header */}
                <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className="font-mono font-black text-sm sm:text-base text-[#0b1329] bg-slate-100 px-2.5 py-0.5 rounded-xl border border-slate-300">
                        {item.contNo}
                      </span>
                      <button
                        onClick={() => handleCopy(item.contNo, item.contNo)}
                        className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors"
                        title="Copy Container Number"
                      >
                        {copiedId === item.contNo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                      </button>
                    </div>
                    <span className="text-[11px] text-slate-500 font-semibold block mt-1">
                      Seal: <strong className="font-mono text-slate-800">{item.sealNo}</strong>
                    </span>
                  </div>

                  <div className="text-right">
                    <span className="px-2.5 py-1 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 inline-block">
                      {item.status}
                    </span>
                    <span className="text-[10px] text-slate-400 block mt-1 font-mono">
                      {item.size} {item.type}
                    </span>
                  </div>
                </div>

                {/* Cold Chain Reefer Monitoring Pill */}
                {isReefer && (
                  <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-200 p-3 rounded-2xl flex items-center justify-between text-xs">
                    <div className="flex items-center gap-2">
                      <div className="w-7 h-7 rounded-lg bg-blue-600 text-white flex items-center justify-center font-bold">
                        <Thermometer className="w-4 h-4" />
                      </div>
                      <div>
                        <span className="font-bold text-blue-900 block">Cold Chain Reefer Monitoring</span>
                        <span className="text-[10px] text-blue-700 font-medium">{item.tempStatus}</span>
                      </div>
                    </div>
                    <div className="font-mono font-black text-blue-800 text-sm sm:text-base">
                      {item.temp}
                    </div>
                  </div>
                )}

                {/* Logistics Route Matrix */}
                <div className="grid grid-cols-2 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Origin / Plant</span>
                    <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.origin}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Terminal</span>
                    <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.terminal}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination Gateway</span>
                    <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.destination}</span>
                  </div>

                  <div>
                    <span className="text-[10px] font-bold text-slate-400 uppercase block">Shipping Line</span>
                    <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.shippingLine}</span>
                  </div>
                </div>

                {/* Live GPS & Direct Track Action Button */}
                <div className="flex items-center justify-between text-xs pt-1 gap-2 flex-wrap sm:flex-nowrap">
                  <div className="flex items-center gap-1.5 text-slate-600 truncate">
                    <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                    <span className="text-[11px] font-semibold truncate">{item.liveGPS}</span>
                  </div>

                  <button
                    onClick={() => {
                      if (onNavigateTrack) {
                        onNavigateTrack(item.contNo);
                      }
                    }}
                    className="px-4 py-2 rounded-xl bg-gradient-to-r from-[#0b1329] to-[#0284c7] hover:opacity-95 text-white font-extrabold text-xs shadow-md flex items-center gap-1.5 transition-all cursor-pointer hover:scale-105 active:scale-95 shrink-0"
                  >
                    <Navigation className="w-3.5 h-3.5" />
                    <span>Track Container</span>
                    <ArrowRight className="w-3.5 h-3.5" />
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
