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
  Calendar,
  Train,
  Anchor,
  Layers,
  Activity,
  FileText
} from 'lucide-react';

export default function CustomerContainersView({ containers = [], customer, onNavigateTrack }) {
  const [subTab, setSubTab] = useState('live'); // 'live' | 'master'
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

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
      (c.sbNo || '').toLowerCase().includes(s) ||
      (c.blNo || '').toLowerCase().includes(s) ||
      (c.sealNo || '').toLowerCase().includes(s) ||
      (c.bookingNo || '').toLowerCase().includes(s) ||
      (c.jobOrderNo || '').toLowerCase().includes(s) ||
      (c.destination || '').toLowerCase().includes(s) ||
      (c.terminal || '').toLowerCase().includes(s) ||
      (c.pol || '').toLowerCase().includes(s) ||
      (c.shippingLine || '').toLowerCase().includes(s) ||
      (c.origin || '').toLowerCase().includes(s) ||
      (c.status || '').toLowerCase().includes(s) ||
      (c.size || '').toLowerCase().includes(s) ||
      (c.type || '').toLowerCase().includes(s) ||
      (c.icdInDate || '').toLowerCase().includes(s) ||
      (c.trainOutDate || '').toLowerCase().includes(s) ||
      (c.sailedDate || '').toLowerCase().includes(s) ||
      (c.sbDate || '').toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* 1. Header with View Mode Switcher & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-card flex flex-col lg:flex-row items-center justify-between gap-4">
        
        {/* Title & Customer Context */}
        <div className="w-full lg:w-auto">
          <div className="flex items-center gap-2 flex-wrap">
            <h2 className="text-base sm:text-lg font-black font-display text-slate-900">
              Container Management & Fleet Hub
            </h2>
            <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
              {filtered.length} Total Boxes
            </span>
          </div>
          <p className="text-xs text-slate-500 font-medium">
            Real Oracle database synchronized containers for {customer?.name}
          </p>
        </div>

        {/* 2 Subtabs Switcher: Container vs Live Container */}
        <div className="flex items-center bg-slate-100 p-1 rounded-2xl border border-slate-200 w-full lg:w-auto shrink-0 justify-center">
          <button
            onClick={() => {
              setSubTab('live');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === 'live'
                ? 'bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Activity className="w-3.5 h-3.5" />
            <span>Live Container</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
              subTab === 'live' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              {containers.length}
            </span>
          </button>

          <button
            onClick={() => {
              setSubTab('master');
              setCurrentPage(1);
            }}
            className={`flex items-center gap-2 px-4 py-2 rounded-xl text-xs font-black transition-all cursor-pointer ${
              subTab === 'master'
                ? 'bg-gradient-to-r from-[#0b1329] to-[#1e293b] text-white shadow-sm'
                : 'text-slate-600 hover:text-slate-900 hover:bg-slate-200/60'
            }`}
          >
            <Container className="w-3.5 h-3.5" />
            <span>Container</span>
            <span className={`px-1.5 py-0.2 rounded-full text-[9px] font-bold ${
              subTab === 'master' ? 'bg-white/20 text-white' : 'bg-slate-200 text-slate-700'
            }`}>
              All Records
            </span>
          </button>
        </div>

        {/* Search Input */}
        <div className="relative w-full lg:max-w-xs shrink-0">
          <Search className="w-4 h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search Container / SB # / Date..."
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

      {/* 2. Empty State */}
      {filtered.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-card">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Containers Found</h3>
          <p className="text-xs text-slate-500">
            No container matches your query "{searchTerm}".
          </p>
        </div>
      ) : (
        <>
          {/* TAB 1: LIVE CONTAINER VIEW (Fleet Cards & Cold Chain Telemetry) */}
          {subTab === 'live' && (
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {paginated.map((item, idx) => {
                const isReefer = (item.type || '').includes('REEFER') || (item.type || '').includes('RF');

                return (
                  <div 
                    key={item.id || idx}
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
                            className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                            title="Copy Container Number"
                          >
                            {copiedId === item.contNo ? <Check className="w-3.5 h-3.5 text-emerald-600" /> : <Copy className="w-3.5 h-3.5" />}
                          </button>
                        </div>
                        <div className="flex items-center gap-2 text-[11px] text-slate-500 font-semibold mt-1 flex-wrap">
                          <span>SB: <strong className="font-mono text-slate-800">{item.sbNo || 'N/A'}</strong> ({item.sbDate || item.inDate})</span>
                          <span className="text-slate-300">•</span>
                          <span>B/L: <strong className="font-mono text-slate-800">{item.blNo || 'N/A'}</strong></span>
                        </div>
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

                    {/* Logistics Route Matrix with Actual Dates */}
                    <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Gate-In (ICD)</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">
                          📅 {item.icdInDate || item.inDate || '21/09/2026'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Train Dispatch</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">
                          🚂 {item.trainOutDate || '21/09/2026'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Vessel Sailed</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">
                          🚢 {item.sailedDate || '21/09/2026'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Terminal CFS</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.terminal}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Gateway Port (POL)</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.pol}</span>
                      </div>

                      <div>
                        <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination Seaport</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.destination}</span>
                      </div>
                    </div>

                    {/* Live GPS & Direct Track Action Button */}
                    <div className="flex items-center justify-between text-xs pt-1 gap-2 flex-wrap sm:flex-nowrap">
                      <div className="flex items-center gap-1.5 text-slate-600 truncate">
                        <MapPin className="w-3.5 h-3.5 text-orange-500 shrink-0" />
                        <span className="text-[11px] font-semibold truncate">Corridor: {item.pol} (via {item.terminal})</span>
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

          {/* TAB 2: CONTAINER MASTER / INVENTORY TABLE VIEW */}
          {subTab === 'master' && (
            <div className="bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
              <div className="overflow-x-auto">
                <table className="w-full text-left border-collapse">
                  <thead>
                    <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                      <th className="py-3.5 px-4">Container #</th>
                      <th className="py-3.5 px-3">Size / Type</th>
                      <th className="py-3.5 px-3">Gate-In Date</th>
                      <th className="py-3.5 px-3">Train Out Date</th>
                      <th className="py-3.5 px-3">Sailed Date</th>
                      <th className="py-3.5 px-3">Shipping Bill #</th>
                      <th className="py-3.5 px-3">Terminal / POL</th>
                      <th className="py-3.5 px-3">Destination</th>
                      <th className="py-3.5 px-3">Line</th>
                      <th className="py-3.5 px-3">Status</th>
                      <th className="py-3.5 px-4 text-right">Action</th>
                    </tr>
                  </thead>
                  <tbody className="divide-y divide-slate-100 text-xs font-semibold text-slate-800">
                    {paginated.map((item, idx) => (
                      <tr key={item.id || idx} className="hover:bg-slate-50/80 transition-colors">
                        <td className="py-3.5 px-4">
                          <div className="flex items-center gap-1.5">
                            <span className="font-mono font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-lg border border-slate-200">
                              {item.contNo}
                            </span>
                            <button
                              onClick={() => handleCopy(item.contNo, item.contNo)}
                              className="text-slate-400 hover:text-slate-700 p-0.5"
                              title="Copy"
                            >
                              {copiedId === item.contNo ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <span className="text-[10px] text-slate-400 block mt-0.5">
                            B/L: {item.blNo || '-'}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 block">{item.size}</span>
                          <span className="text-[10px] text-slate-500 font-mono">{item.type}</span>
                        </td>

                        <td className="py-3.5 px-3 font-mono text-slate-700">
                          {item.icdInDate || item.inDate || '-'}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-slate-700">
                          {item.trainOutDate || '-'}
                        </td>

                        <td className="py-3.5 px-3 font-mono text-slate-700">
                          {item.sailedDate || '-'}
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-mono font-bold text-blue-700 block">{item.sbNo || '-'}</span>
                          <span className="text-[10px] text-slate-400 font-mono">Date: {item.sbDate || item.inDate || '-'}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-semibold text-slate-800 block truncate max-w-[140px]">{item.terminal}</span>
                          <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">POL: {item.pol}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-bold text-slate-800 truncate block max-w-[140px]">{item.destination}</span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="font-black text-slate-900 bg-slate-100 px-2 py-0.5 rounded-md border border-slate-200">
                            {item.shippingLine}
                          </span>
                        </td>

                        <td className="py-3.5 px-3">
                          <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 whitespace-nowrap inline-block">
                            {item.status}
                          </span>
                        </td>

                        <td className="py-3.5 px-4 text-right">
                          <button
                            onClick={() => {
                              if (onNavigateTrack) {
                                onNavigateTrack(item.contNo);
                              }
                            }}
                            className="px-3 py-1.5 rounded-xl bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
                          >
                            <Navigation className="w-3 h-3" />
                            <span>Track</span>
                          </button>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </div>
          )}

          {/* 3. Pagination Controls */}
          <div className="bg-white p-3.5 sm:p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3 text-xs">
            <div className="text-slate-500 font-medium">
              Showing <strong className="text-slate-900 font-bold">{Math.min((currentPage - 1) * pageSize + 1, filtered.length)}</strong> to <strong className="text-slate-900 font-bold">{Math.min(currentPage * pageSize, filtered.length)}</strong> of <strong className="text-slate-900 font-bold">{filtered.length}</strong> containers
            </div>

            <div className="flex items-center gap-2">
              <button
                disabled={currentPage === 1}
                onClick={() => setCurrentPage(prev => Math.max(prev - 1, 1))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Previous
              </button>

              <span className="px-3 py-1.5 rounded-xl bg-slate-900 text-white font-mono font-bold">
                Page {currentPage} of {totalPages}
              </span>

              <button
                disabled={currentPage === totalPages}
                onClick={() => setCurrentPage(prev => Math.min(prev + 1, totalPages))}
                className="px-3 py-1.5 rounded-xl border border-slate-200 bg-slate-50 hover:bg-slate-100 text-slate-700 font-bold disabled:opacity-40 disabled:cursor-not-allowed transition-all cursor-pointer"
              >
                Next
              </button>
            </div>
          </div>
        </>
      )}

    </div>
  );
}
