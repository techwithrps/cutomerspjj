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
  FileText,
  Sparkles,
  ChevronRight
} from 'lucide-react';
import { getContainerStageInfo, FEATURED_STAGE_EXAMPLES } from '../services/dataService';

export default function CustomerContainersView({ allContainers = [], liveContainers = [], containers = [], customer, onNavigateTrack }) {
  const [subTab, setSubTab] = useState('live'); // 'live' | 'master'
  const [stageFilter, setStageFilter] = useState('ALL'); // 'ALL' | 2 | 3 | 4 | 5 | 6
  const [searchTerm, setSearchTerm] = useState('');
  const [copiedId, setCopiedId] = useState(null);
  const [currentPage, setCurrentPage] = useState(1);
  const pageSize = 12;

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  const effectiveLiveList = liveContainers.length > 0 ? liveContainers : containers;
  const effectiveAllList = allContainers.length > 0 ? allContainers : containers;
  const activeDataset = subTab === 'live' ? effectiveLiveList : effectiveAllList;

  const filtered = activeDataset.filter((c) => {
    const stageInfo = c.stageInfo || getContainerStageInfo(c);
    if (stageFilter !== 'ALL' && stageInfo.stageNumber !== Number(stageFilter)) {
      return false;
    }

    const s = searchTerm.toLowerCase().trim();
    if (!s) return true;
    return (
      (c.contNo || '').toLowerCase().includes(s) ||
      (c.sbNo || '').toLowerCase().includes(s) ||
      (c.blNo || '').toLowerCase().includes(s) ||
      (c.partyInvNo || '').toLowerCase().includes(s) ||
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
      (c.dischargeDate || '').toLowerCase().includes(s) ||
      (c.sbDate || '').toLowerCase().includes(s) ||
      stageInfo.shortTag.toLowerCase().includes(s)
    );
  });

  const totalPages = Math.ceil(filtered.length / pageSize) || 1;
  const paginated = filtered.slice((currentPage - 1) * pageSize, currentPage * pageSize);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* 1. Header with View Mode Switcher, Stage Filter Pills & Search Bar */}
      <div className="bg-white p-4 sm:p-5 rounded-2xl sm:rounded-3xl border border-slate-200 shadow-card space-y-4">
        
        <div className="flex flex-col lg:flex-row items-center justify-between gap-4">
          {/* Title & Customer Context */}
          <div className="w-full lg:w-auto">
            <div className="flex items-center gap-2 flex-wrap">
              <h2 className="text-base sm:text-lg font-black font-display text-slate-900">
                Container Management & Fleet Hub
              </h2>
              <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-blue-50 text-blue-700 border border-blue-200">
                {filtered.length} {subTab === 'live' ? 'Live Active' : 'Total Trips'}
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
                {effectiveLiveList.length}
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
                {effectiveAllList.length} Trips
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
              placeholder="Search Container, Party Inv, SB #..."
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

        {/* Stage Filter Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 pt-1 scrollbar-none text-xs">
          <span className="text-[11px] font-bold text-slate-400 uppercase mr-1 shrink-0">Filter By Stage:</span>
          
          <button
            onClick={() => {
              setStageFilter('ALL');
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer ${
              stageFilter === 'ALL'
                ? 'bg-slate-900 text-white shadow-xs'
                : 'bg-slate-100 text-slate-600 hover:bg-slate-200'
            }`}
          >
            All Stages ({activeDataset.length})
          </button>

          <button
            onClick={() => {
              setStageFilter(2);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              stageFilter === 2
                ? 'bg-amber-500 text-white border-amber-500 shadow-xs'
                : 'bg-amber-50/70 text-amber-800 border-amber-200 hover:bg-amber-100'
            }`}
          >
            Stage 2: Customs Cleared
          </button>

          <button
            onClick={() => {
              setStageFilter(3);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              stageFilter === 3
                ? 'bg-blue-600 text-white border-blue-600 shadow-xs'
                : 'bg-blue-50/70 text-blue-800 border-blue-200 hover:bg-blue-100'
            }`}
          >
            Stage 3: DFC Rail Transit
          </button>

          <button
            onClick={() => {
              setStageFilter(4);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              stageFilter === 4
                ? 'bg-indigo-600 text-white border-indigo-600 shadow-xs'
                : 'bg-indigo-50/70 text-indigo-800 border-indigo-200 hover:bg-indigo-100'
            }`}
          >
            Stage 4: Port Staging & SOB
          </button>

          <button
            onClick={() => {
              setStageFilter(5);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              stageFilter === 5
                ? 'bg-purple-600 text-white border-purple-600 shadow-xs'
                : 'bg-purple-50/70 text-purple-800 border-purple-200 hover:bg-purple-100'
            }`}
          >
            Stage 5: Ocean Sailing
          </button>

          <button
            onClick={() => {
              setStageFilter(6);
              setCurrentPage(1);
            }}
            className={`px-3 py-1.5 rounded-xl font-bold transition-all shrink-0 cursor-pointer border ${
              stageFilter === 6
                ? 'bg-emerald-600 text-white border-emerald-600 shadow-xs'
                : 'bg-emerald-50/70 text-emerald-800 border-emerald-200 hover:bg-emerald-100'
            }`}
          >
            Stage 6: Discharged & Delivered
          </button>
        </div>

      </div>

      {/* 3. Empty State */}
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
          {/* TAB 1: LIVE CONTAINER VIEW (Minimal 2-column Grid on Mobile) */}
          {subTab === 'live' && (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
              {paginated.map((item, idx) => {
                const isReefer = (item.type || '').includes('REEFER') || (item.type || '').includes('RF');
                const stageInfo = item.stageInfo || getContainerStageInfo(item);

                return (
                  <div 
                    key={item.id || idx}
                    className="bg-white rounded-xl sm:rounded-3xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-2 sm:p-5 flex flex-col justify-between space-y-1.5 sm:space-y-4 hover-lift"
                  >
                    {/* Top Prominent Stage Tag */}
                    <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1.5 sm:pb-2">
                      <span className={`px-2 py-0.5 rounded-md text-[8px] sm:text-[10px] font-black border uppercase tracking-wider ${stageInfo.badgeClass}`}>
                        {stageInfo.shortTag}
                      </span>
                      <span className="text-[8px] sm:text-[10px] text-slate-400 font-mono truncate">
                        {item.size} {item.type}
                      </span>
                    </div>

                    {/* Header */}
                    <div className="flex items-start justify-between gap-1">
                      <div className="min-w-0">
                        <div className="flex items-center gap-1">
                          <span className="font-mono font-black text-[11px] sm:text-base text-[#0b1329] bg-slate-100 px-1.5 py-0.5 sm:px-2.5 sm:py-0.5 rounded-md sm:rounded-xl border border-slate-300 truncate">
                            {item.contNo}
                          </span>
                          <button
                            onClick={() => handleCopy(item.contNo, item.contNo)}
                            className="p-0.5 rounded hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer shrink-0"
                            title="Copy Container Number"
                          >
                            {copiedId === item.contNo ? <Check className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-emerald-600" /> : <Copy className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />}
                          </button>
                        </div>
                        <div className="text-[8px] sm:text-[11px] text-slate-500 font-medium mt-0.5 truncate">
                          Party Inv: <strong className="font-mono text-slate-800">{item.partyInvNo || item.jobOrderNo || 'N/A'}</strong>
                        </div>
                      </div>

                      <div className="text-right shrink-0">
                        <span className="px-1.5 py-0.5 sm:px-2.5 sm:py-1 rounded-full text-[7px] sm:text-[10px] font-black bg-blue-50 text-blue-700 border border-blue-200 inline-block whitespace-nowrap">
                          {item.shippingLine}
                        </span>
                        <span className="text-[7px] sm:text-[10px] text-slate-400 block mt-0.5 font-mono truncate">
                          SB: {item.sbNo || 'N/A'}
                        </span>
                      </div>
                    </div>

                    {/* Cold Chain Reefer Monitoring Pill */}
                    {isReefer && (
                      <div className="bg-gradient-to-r from-blue-500/10 via-cyan-500/10 to-blue-500/10 border border-blue-200 p-1.5 sm:p-3 rounded-lg sm:rounded-2xl flex items-center justify-between text-[8px] sm:text-xs">
                        <div className="flex items-center gap-1 sm:gap-2 min-w-0">
                          <Thermometer className="w-3 h-3 sm:w-4 sm:h-4 text-blue-600 shrink-0" />
                          <span className="font-bold text-blue-900 truncate">Reefer Temp</span>
                        </div>
                        <div className="font-mono font-black text-blue-800 text-[10px] sm:text-base shrink-0">
                          {item.temp}
                        </div>
                      </div>
                    )}

                    {/* Logistics Route Matrix with Actual Dates - High Density Minimal */}
                    <div className="grid grid-cols-2 gap-1 sm:gap-2 text-[8px] sm:text-xs bg-slate-50 p-1.5 sm:p-3 rounded-lg sm:rounded-2xl border border-slate-100">
                      <div>
                        <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">ICD Gate-In</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">
                          {item.icdInDate || item.inDate || '21/09/2026'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">Train Dispatch</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">
                          {item.trainOutDate || '21/09/2026'}
                        </span>
                      </div>

                      <div>
                        <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">POL</span>
                        <span className="font-semibold text-slate-800 truncate block mt-0.5">{item.pol}</span>
                      </div>

                      <div>
                        <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">POD</span>
                        <span className="font-semibold text-cyan-800 truncate block mt-0.5">{item.destination}</span>
                      </div>
                    </div>

                    {/* Action Button */}
                    <div className="pt-1 border-t border-slate-100 flex items-center justify-between gap-1">
                      <span className="text-[7px] sm:text-[10px] text-slate-400 font-mono truncate">
                        {item.terminal}
                      </span>
                      <button
                        onClick={() => {
                          if (onNavigateTrack) {
                            onNavigateTrack(item.contNo);
                          }
                        }}
                        className="px-2 py-1 sm:px-4 sm:py-2 rounded-md sm:rounded-xl bg-gradient-to-r from-[#0b1329] to-[#0284c7] hover:opacity-95 text-white font-extrabold text-[8px] sm:text-xs shadow-xs flex items-center gap-1 transition-all cursor-pointer active:scale-95 shrink-0"
                      >
                        <Navigation className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5" />
                        <span>Track</span>
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* TAB 2: CONTAINER MASTER / INVENTORY VIEW */}
          {subTab === 'master' && (
            <>
              {/* Mobile 2-Column Minimal Cards (< md screens) */}
              <div className="grid grid-cols-2 md:hidden gap-2">
                {paginated.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="bg-white rounded-xl border border-slate-200/90 shadow-2xs p-2 flex flex-col justify-between space-y-1.5"
                  >
                    <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1">
                      <span className="font-mono font-black text-[10px] text-[#0b1329] bg-slate-100 px-1 py-0.5 rounded border border-slate-200 truncate">
                        {item.contNo}
                      </span>
                      <span className="px-1 py-0.2 rounded text-[7px] font-black bg-emerald-50 text-emerald-700 border border-emerald-200 truncate">
                        {item.status || 'OK'}
                      </span>
                    </div>

                    <div className="space-y-0.5 text-[8px] text-slate-600 bg-slate-50 p-1.5 rounded-lg border border-slate-100">
                      <div className="flex justify-between">
                        <span className="text-slate-400">TYPE:</span>
                        <span className="font-bold text-slate-800">{item.size} {item.type}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">SB #:</span>
                        <span className="font-mono font-bold text-blue-700 truncate max-w-[70px]">{item.sbNo || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">DEST:</span>
                        <span className="font-bold text-slate-800 truncate max-w-[70px]">{item.destination || '-'}</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-slate-400">LINE:</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[70px]">{item.shippingLine || '-'}</span>
                      </div>
                    </div>

                    <button
                      onClick={() => onNavigateTrack && onNavigateTrack(item.contNo)}
                      className="w-full py-1 rounded-lg bg-[#0284c7] hover:bg-[#0369a1] text-white font-black text-[9px] shadow-xs flex items-center justify-center gap-1 cursor-pointer"
                    >
                      <Navigation className="w-2.5 h-2.5" />
                      <span>Track</span>
                    </button>
                  </div>
                ))}
              </div>

              {/* Desktop Full Master Table (md+ screens) */}
              <div className="hidden md:block bg-white rounded-3xl border border-slate-200 shadow-card overflow-hidden">
                <div className="overflow-x-auto">
                  <table className="w-full text-left border-collapse">
                    <thead>
                      <tr className="bg-slate-50 border-b border-slate-200 text-[11px] font-black text-slate-500 uppercase tracking-wider">
                        <th className="py-3.5 px-4">Container #</th>
                        <th className="py-3.5 px-3">Size / Type</th>
                        <th className="py-3.5 px-3">Gate-In Date</th>
                        <th className="py-3.5 px-3">Train Out Date</th>
                        <th className="py-3.5 px-3">Sailed Date</th>
                        <th className="py-3.5 px-3">Discharge Date</th>
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
                                className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
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
                            {item.dischargeDate ? (
                              <div>
                                <span className="font-mono font-bold text-slate-900 block">{item.dischargeDate}</span>
                                <span className="text-[9px] font-bold text-emerald-600 block">Discharged</span>
                              </div>
                            ) : (
                              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-blue-50 text-blue-700 border border-blue-200 inline-flex items-center gap-1">
                                <span className="w-1.5 h-1.5 rounded-full bg-blue-500 animate-pulse"></span>
                                In-Transit (Live)
                              </span>
                            )}
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
                            {(() => {
                              const stageInfo = item.stageInfo || getContainerStageInfo(item);
                              return (
                                <div className="space-y-1">
                                  <span className={`px-2 py-0.5 rounded-md text-[9px] font-black border whitespace-nowrap block uppercase tracking-wider ${stageInfo.badgeClass}`}>
                                    {stageInfo.shortTag}
                                  </span>
                                  <span className="text-[10px] text-slate-500 block truncate max-w-[140px]">
                                    {item.status}
                                  </span>
                                </div>
                              );
                            })()}
                          </td>

                          <td className="py-3.5 px-4 text-right">
                            <button
                              onClick={() => {
                                if (onNavigateTrack) {
                                  onNavigateTrack(item.contNo);
                                }
                              }}
                              className="px-3 py-1.5 rounded-xl bg-gradient-to-r from-[#0b1329] to-[#0284c7] hover:opacity-95 text-white font-black text-xs shadow-xs transition-all cursor-pointer inline-flex items-center gap-1"
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
            </>
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
