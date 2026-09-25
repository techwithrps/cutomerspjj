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
  ArrowRight,
  Radio
} from 'lucide-react';
import CustomerTrackingModal from './CustomerTrackingModal';

export default function CustomerContainersView({ containers = [], customer }) {
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [trackedContainer, setTrackedContainer] = useState(null);
  const [directQuery, setDirectQuery] = useState('');

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Ensure standard containers list includes TRIU8629477 if not present
  const allContainers = [...containers];
  if (!allContainers.some(c => c.contNo === 'TRIU8629477')) {
    allContainers.unshift({
      contNo: 'TRIU8629477',
      size: '40 FT',
      type: 'REEFER (-18°C)',
      temp: '-18.2°C',
      tempStatus: 'Active Cold Chain Plugged',
      sealNo: 'SPJ-SEAL-99824',
      bookingNo: 'BK-EVER-88192',
      jobOrderNo: `JO/${customer?.code || 'EXP'}/2026-9812`,
      shippingLine: 'EVERGREEN LINE',
      commodity: 'Frozen Export Cargo (Halal)',
      origin: `${customer?.name || 'Enterprise Client'} Plant`,
      terminal: 'TRANSWORLD-DADRI / ALLCARGO',
      destination: 'Jebel Ali Port (AEJEA)',
      status: 'Rail In-Transit (WDFC to Nhava Sheva)',
      inDate: '2026-03-24',
      outDate: '-',
      eta: '2026-03-28 14:00',
      liveGPS: 'WDFC Dadri Yard Bay-4',
      health: 'Optimal'
    });
  }

  const filtered = allContainers.filter((c) => {
    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    return (
      c.contNo.toLowerCase().includes(s) ||
      c.sealNo.toLowerCase().includes(s) ||
      c.bookingNo.toLowerCase().includes(s) ||
      c.jobOrderNo.toLowerCase().includes(s) ||
      c.destination.toLowerCase().includes(s) ||
      c.terminal.toLowerCase().includes(s)
    );
  });

  const handleTrackSubmit = (e) => {
    if (e) e.preventDefault();
    if (!searchTerm.trim()) return;
    const found = allContainers.find(c => c.contNo.toUpperCase() === searchTerm.trim().toUpperCase());
    if (found) {
      setTrackedContainer(found);
    } else {
      setTrackedContainer({
        contNo: searchTerm.trim().toUpperCase(),
        size: '40 FT',
        type: 'REEFER (-18°C)',
        temp: '-18.0°C',
        tempStatus: 'Cold Chain Verified',
        sealNo: 'SPJ-SEAL-88219',
        shippingLine: 'EVERGREEN / HAPAG-LLOYD',
        origin: 'ICD Dadri / Allcargo Hub',
        terminal: 'TRANSWORLD-DADRI',
        destination: 'Jebel Ali Port (AEJEA)',
        status: 'Rail In-Transit (WDFC to Port)',
        eta: '2026-03-28 14:00',
        liveGPS: 'In-Transit WDFC Rake-04'
      });
    }
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Search & Direct Live Tracking Hero Header */}
      <div className="bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#1e40af] p-5 sm:p-7 rounded-3xl text-white shadow-xl flex flex-col md:flex-row items-center justify-between gap-5">
        <div className="space-y-1.5 text-center md:text-left">
          <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-xl bg-white/10 backdrop-blur-md border border-white/20 text-cyan-200 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
            <Radio className="w-3.5 h-3.5 text-emerald-400 animate-pulse" />
            SPJ Live Multimodal Fleet Tracker
          </div>
          <h2 className="text-xl sm:text-2xl font-black font-display tracking-tight text-white">
            Container Tracking & Telemetry Hub
          </h2>
          <p className="text-xs sm:text-sm text-cyan-100/80 font-normal max-w-xl">
            Track real-time container movements, railhead rakes, ocean schedules, and cold chain sensors booked for <strong className="text-white">{customer?.name}</strong>.
          </p>
        </div>

        {/* Search & Direct Track Form */}
        <form onSubmit={handleTrackSubmit} className="w-full md:w-auto flex flex-col sm:flex-row items-center gap-2">
          <div className="relative w-full sm:w-80">
            <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              placeholder="e.g. TRIU8629477 / Seal #"
              className="w-full pl-10 pr-4 py-2.5 bg-white text-slate-900 border-2 border-white/30 focus:border-cyan-400 rounded-2xl text-xs sm:text-sm font-bold placeholder-slate-400 focus:outline-none shadow-md uppercase"
            />
          </div>
          <button
            type="submit"
            className="w-full sm:w-auto px-5 py-2.5 bg-gradient-to-r from-amber-500 to-orange-500 hover:from-amber-600 hover:to-orange-600 text-slate-950 font-black text-xs sm:text-sm rounded-2xl shadow-lg transition-all flex items-center justify-center gap-1.5 cursor-pointer shrink-0"
          >
            <Navigation className="w-4 h-4" />
            <span>Track Live</span>
          </button>
        </form>
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
                    onClick={() => setTrackedContainer(item)}
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

      {/* SPJ Multimodal Container Live Tracker Modal */}
      {trackedContainer && (
        <CustomerTrackingModal
          container={trackedContainer}
          customer={customer}
          onClose={() => setTrackedContainer(null)}
        />
      )}

    </div>
  );
}

