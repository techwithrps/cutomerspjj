import React, { useState, useMemo } from 'react';
import { 
  Ship, 
  Search, 
  RotateCw, 
  MapPin, 
  ArrowRight, 
  Calendar, 
  Clock, 
  ChevronRight, 
  Filter, 
  LayoutGrid, 
  List, 
  Anchor, 
  Download, 
  Radio, 
  Compass, 
  Layers, 
  CheckCircle2, 
  Building2, 
  AlertCircle,
  ExternalLink,
  ChevronDown
} from 'lucide-react';
import { 
  SHIPPING_LINES, 
  PORTS_OF_LOADING, 
  PORTS_OF_DISCHARGE, 
  INITIAL_VESSEL_SCHEDULES 
} from '../data/vesselSchedulesData';
import { fetchLiveVesselSchedules } from '../services/vesselApiService';
import VesselLiveRadarModal from './VesselLiveRadarModal';
import * as XLSX from 'xlsx';

export default function VesselSchedulesView({ customer }) {
  const [mode, setMode] = useState('see_all'); // 'see_all', 'by_line', 'by_pod', 'by_pol'
  const [search, setSearch] = useState('');
  const [selectedLine, setSelectedLine] = useState('ALL');
  const [selectedPOD, setSelectedPOD] = useState('ALL');
  const [selectedPOL, setSelectedPOL] = useState('ALL');
  const [viewLayout, setViewLayout] = useState('grid'); // 'grid' | 'list'
  const [showMobileFilters, setShowMobileFilters] = useState(false);
  const [activeVesselModal, setActiveVesselModal] = useState(null);
  const [schedules, setSchedules] = useState(INITIAL_VESSEL_SCHEDULES);
  const [isRefreshing, setIsRefreshing] = useState(false);
  const [liveLoading, setLiveLoading] = useState(false);
  const [totalLiveCount, setTotalLiveCount] = useState(245);

  const loadLiveSchedules = async () => {
    setLiveLoading(true);
    try {
      const res = await fetchLiveVesselSchedules({
        pol: selectedPOL !== 'ALL' ? selectedPOL : undefined,
        pod: selectedPOD !== 'ALL' ? selectedPOD : undefined,
        shippingLine: selectedLine !== 'ALL' ? selectedLine : undefined,
        search: search.trim() ? search.trim() : undefined,
        limit: 100
      });
      if (res.success && res.schedules && res.schedules.length > 0) {
        setSchedules(res.schedules);
        setTotalLiveCount(res.total || res.schedules.length);
      }
    } catch (e) {
      console.error('Error fetching live schedules:', e);
    } finally {
      setLiveLoading(false);
      setIsRefreshing(false);
    }
  };

  React.useEffect(() => {
    loadLiveSchedules();
  }, [selectedLine, selectedPOD, selectedPOL, search]);

  // Active filters count
  const isFiltered = selectedLine !== 'ALL' || selectedPOD !== 'ALL' || selectedPOL !== 'ALL' || search.trim() !== '';

  const resetAllFilters = () => {
    setSelectedLine('ALL');
    setSelectedPOD('ALL');
    setSelectedPOL('ALL');
    setSearch('');
    setMode('see_all');
  };

  const handleRefresh = () => {
    setIsRefreshing(true);
    loadLiveSchedules();
  };

  // Filtered schedules
  const filteredSchedules = useMemo(() => {
    return schedules.filter(item => {
      // 1. Line Filter
      if (selectedLine !== 'ALL' && item.lineCode !== selectedLine && !item.lineName.toUpperCase().includes(selectedLine.toUpperCase())) {
        return false;
      }

      // 2. POD Filter
      if (selectedPOD !== 'ALL') {
        const podUpper = selectedPOD.toUpperCase();
        if (item.podCode.toUpperCase() !== podUpper && !item.pod.toUpperCase().includes(podUpper)) {
          return false;
        }
      }

      // 3. POL Filter
      if (selectedPOL !== 'ALL') {
        const polUpper = selectedPOL.toUpperCase();
        if (item.polCode.toUpperCase() !== polUpper && !item.pol.toUpperCase().includes(polUpper)) {
          return false;
        }
      }

      // 4. Search Bar
      if (search.trim()) {
        const s = search.toLowerCase().trim();
        const matched = (
          item.vesselName.toLowerCase().includes(s) ||
          item.voyage.toLowerCase().includes(s) ||
          item.imoCode.toLowerCase().includes(s) ||
          item.lineName.toLowerCase().includes(s) ||
          item.pol.toLowerCase().includes(s) ||
          item.polCode.toLowerCase().includes(s) ||
          item.pod.toLowerCase().includes(s) ||
          item.podCode.toLowerCase().includes(s)
        );
        if (!matched) return false;
      }

      return true;
    });
  }, [schedules, selectedLine, selectedPOD, selectedPOL, search]);

  // Export schedules to Excel
  const handleExportExcel = () => {
    const exportData = filteredSchedules.map((s, idx) => ({
      '#': idx + 1,
      'Shipping Line': s.lineName,
      'Vessel Name': s.vesselName,
      'Voyage No': s.voyage,
      'IMO / Code': s.imoCode,
      'Port of Loading (POL)': s.pol,
      'POL Code': s.polCode,
      'Port of Discharge (POD)': s.pod,
      'POD Code': s.podCode,
      'ETD': s.etd,
      'ETA': s.eta,
      'Cut-Off Date': s.cutOff || '—',
      'Status': s.status
    }));

    const ws = XLSX.utils.json_to_sheet(exportData);
    const wb = XLSX.utils.book_new();
    XLSX.utils.book_append_sheet(wb, ws, 'SPJ_Vessel_Schedules');
    XLSX.writeFile(wb, 'SPJ_Public_Vessel_Schedules.xlsx');
  };

  return (
    <div className="space-y-5 animate-fade-in pb-12 max-w-[1700px] mx-auto">
      
      {/* 1. Breadcrumb */}
      <div className="flex items-center gap-1.5 text-xs text-slate-500 font-semibold">
        <span className="hover:text-blue-600 cursor-pointer">Home</span>
        <ChevronRight className="w-3.5 h-3.5 text-slate-400" />
        <span className="text-[#2b1f55] font-bold">Vessel Schedules</span>
        <span className="text-slate-400 font-normal ml-2">| SPJ Group of Companies</span>
      </div>

      {/* 2. Page Header Banner */}
      <div className="bg-white rounded-2xl border border-slate-200 p-4 sm:p-6 shadow-soft flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div className="flex items-start sm:items-center gap-3.5">
          <div className="w-12 h-12 rounded-2xl bg-gradient-to-br from-rose-500 to-red-600 text-white flex items-center justify-center shadow-md shadow-red-500/20 shrink-0">
            <Ship className="w-6 h-6" />
          </div>
          <div>
            <h1 className="text-lg sm:text-2xl font-black font-display text-slate-900 tracking-tight flex items-center gap-2">
              Public Vessel Schedules
              <span className="text-[10px] sm:text-xs font-bold px-2.5 py-0.5 rounded-full bg-blue-50 text-blue-700 border border-blue-200">
                LIVE FEED
              </span>
            </h1>
            <p className="text-xs sm:text-sm text-slate-500 font-medium mt-0.5">
              Track sailing schedules, identify next available vessels, and monitor cutoff dates across Indian gateways.
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2.5 shrink-0">
          <button
            onClick={handleExportExcel}
            className="flex items-center gap-1.5 px-3.5 py-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-700 text-xs font-bold transition-all shadow-xs"
          >
            <Download className="w-3.5 h-3.5 text-slate-600" />
            Export Schedules
          </button>
        </div>
      </div>

      {/* 3. Mode Selection Bar (Exact JSB Navigation Theme) */}
      <div className="bg-white rounded-2xl border border-slate-200 p-2 sm:p-3 shadow-soft flex flex-col md:flex-row items-stretch md:items-center justify-between gap-3">
        
        {/* Navigation Mode Pills */}
        <div className="flex items-center gap-1.5 overflow-x-auto pb-1 md:pb-0 scrollbar-none">
          <button
            onClick={() => { setMode('see_all'); setSelectedPOD('ALL'); }}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === 'see_all'
                ? 'bg-[#e11d48] text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <LayoutGrid className="w-3.5 h-3.5" />
            See All
          </button>

          <button
            onClick={() => setMode('by_line')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === 'by_line'
                ? 'bg-[#e11d48] text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Building2 className="w-3.5 h-3.5" />
            By Line → POD → POL
          </button>

          <button
            onClick={() => setMode('by_pod')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === 'by_pod'
                ? 'bg-[#e11d48] text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <MapPin className="w-3.5 h-3.5" />
            By POD → POL
          </button>

          <button
            onClick={() => setMode('by_pol')}
            className={`px-4 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap flex items-center gap-1.5 ${
              mode === 'by_pol'
                ? 'bg-[#e11d48] text-white shadow-md shadow-rose-500/20'
                : 'text-slate-600 hover:bg-slate-100 hover:text-slate-900'
            }`}
          >
            <Anchor className="w-3.5 h-3.5" />
            By POL
          </button>
        </div>

        {/* Right Counter & View Toggle */}
        <div className="flex items-center gap-3 self-end md:self-auto shrink-0 text-xs">
          
          <div className="flex items-center bg-slate-100 p-1 rounded-xl border border-slate-200">
            <button
              onClick={() => setViewLayout('grid')}
              className={`p-1.5 rounded-lg transition-all ${viewLayout === 'grid' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              title="Grid View"
            >
              <LayoutGrid className="w-4 h-4" />
            </button>
            <button
              onClick={() => setViewLayout('list')}
              className={`p-1.5 rounded-lg transition-all ${viewLayout === 'list' ? 'bg-white text-slate-900 shadow-xs' : 'text-slate-500 hover:text-slate-900'}`}
              title="List View"
            >
              <List className="w-4 h-4" />
            </button>
          </div>

          <span className="text-slate-700 font-extrabold flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-slate-100 border border-slate-200">
            <Anchor className="w-3.5 h-3.5 text-blue-600" />
            <strong>{filteredSchedules.length}</strong> sailings available
          </span>

          <button
            onClick={handleRefresh}
            className="p-2 rounded-xl bg-slate-100 hover:bg-slate-200 border border-slate-300 text-slate-600 hover:text-slate-900 transition-all"
            title="Sync Schedules"
          >
            <RotateCw className={`w-3.5 h-3.5 ${isRefreshing ? 'animate-spin text-blue-600' : ''}`} />
          </button>
        </div>
      </div>

      {/* 4. Dropdown Filters & Search Bar with Mobile Filter Toggle */}
      <div className="bg-white rounded-2xl border border-slate-200 p-3 sm:p-4 shadow-soft space-y-3">
        {/* Search Bar & Mobile Filter Button */}
        <div className="flex items-center gap-2">
          <div className="relative flex-1">
            <Search className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
            <input
              type="text"
              placeholder="Search vessel or voyage..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              className="w-full pl-8 sm:pl-9 pr-4 py-1.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-2 focus:ring-blue-600 focus:bg-white transition-all shadow-xs"
            />
          </div>

          <button
            type="button"
            onClick={() => setShowMobileFilters(p => !p)}
            className={`flex sm:hidden items-center gap-1 px-3 py-1.5 rounded-xl text-xs font-bold transition-all border shrink-0 cursor-pointer ${
              showMobileFilters || isFiltered
                ? 'bg-blue-600 text-white border-blue-700 shadow-xs'
                : 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
            }`}
          >
            <Filter className="w-3 h-3" />
            <span>Filter</span>
            {isFiltered && <span className="w-1.5 h-1.5 rounded-full bg-cyan-300"></span>}
          </button>
        </div>

        {/* Dropdown Filters (Always on desktop, collapsible on mobile) */}
        <div className={`grid grid-cols-1 sm:grid-cols-3 gap-2 sm:gap-3 ${showMobileFilters ? 'block' : 'hidden sm:grid'}`}>
          {/* Shipping Lines Dropdown */}
          <div className="relative">
            <select
              value={selectedLine}
              onChange={(e) => setSelectedLine(e.target.value)}
              aria-label="Filter by Shipping Line"
              className="w-full pl-3 pr-8 py-1.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs truncate"
            >
              {SHIPPING_LINES.map(line => (
                <option key={line.id} value={line.id}>
                  {line.name}
                </option>
              ))}
            </select>
          </div>

          {/* POD Dropdown */}
          <div className="relative">
            <select
              value={selectedPOD}
              onChange={(e) => setSelectedPOD(e.target.value)}
              aria-label="Filter by Port of Discharge"
              className="w-full pl-3 pr-8 py-1.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs truncate"
            >
              {PORTS_OF_DISCHARGE.map(pod => (
                <option key={pod.code} value={pod.code}>
                  {pod.code === 'ALL' ? 'All PODs (Port of Discharge)' : `${pod.name} (${pod.codeShort || pod.code})`}
                </option>
              ))}
            </select>
          </div>

          {/* POL Dropdown */}
          <div className="relative">
            <select
              value={selectedPOL}
              onChange={(e) => setSelectedPOL(e.target.value)}
              aria-label="Filter by Port of Loading"
              className="w-full pl-3 pr-8 py-1.5 sm:py-2 bg-slate-50 border border-slate-300 rounded-xl text-[11px] sm:text-xs font-bold text-slate-800 focus:outline-none focus:ring-2 focus:ring-blue-600 cursor-pointer shadow-xs truncate"
            >
              {PORTS_OF_LOADING.map(pol => (
                <option key={pol.code} value={pol.code}>
                  {pol.code === 'ALL' ? 'All POLs (Port of Loading)' : `${pol.name} (${pol.short})`}
                </option>
              ))}
            </select>
          </div>
        </div>

        {/* Active Filter Chips */}
        {isFiltered && (
          <div className="flex items-center justify-between pt-2 border-t border-slate-100 text-xs">
            <div className="flex items-center gap-2 flex-wrap">
              <span className="text-slate-400 font-semibold">Active filters:</span>
              {selectedLine !== 'ALL' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-blue-50 text-blue-800 border border-blue-200 font-bold flex items-center gap-1">
                  Line: {selectedLine}
                  <button onClick={() => setSelectedLine('ALL')} className="hover:text-blue-950">×</button>
                </span>
              )}
              {selectedPOD !== 'ALL' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-rose-50 text-rose-800 border border-rose-200 font-bold flex items-center gap-1">
                  POD: {selectedPOD}
                  <button onClick={() => setSelectedPOD('ALL')} className="hover:text-rose-950">×</button>
                </span>
              )}
              {selectedPOL !== 'ALL' && (
                <span className="px-2.5 py-0.5 rounded-lg bg-emerald-50 text-emerald-800 border border-emerald-200 font-bold flex items-center gap-1">
                  POL: {selectedPOL}
                  <button onClick={() => setSelectedPOL('ALL')} className="hover:text-emerald-950">×</button>
                </span>
              )}
              {search && (
                <span className="px-2.5 py-0.5 rounded-lg bg-purple-50 text-purple-800 border border-purple-200 font-bold flex items-center gap-1">
                  Search: "{search}"
                  <button onClick={() => setSearch('')} className="hover:text-purple-950">×</button>
                </span>
              )}
            </div>

            <button
              onClick={resetAllFilters}
              className="text-rose-600 hover:text-rose-700 font-bold text-xs underline cursor-pointer"
            >
              Reset all
            </button>
          </div>
        )}
      </div>

      {/* 5. CONTENT BODY: "By POD -> POL" List Mode vs "See All" Card Grid */}
      {mode === 'by_pod' && selectedPOD === 'ALL' ? (
        
        /* 📍 BY POD LIST VIEW (Exact match with user Screenshot 2) */
        <div className="bg-white rounded-2xl border border-slate-200 shadow-soft overflow-hidden">
          <div className="p-4 bg-slate-50 border-b border-slate-200 flex items-center justify-between">
            <span className="text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              SELECT PORT OF DISCHARGE (POD)
            </span>
            <span className="text-xs text-slate-400 font-medium">
              Click a row to select & filter
            </span>
          </div>

          <div className="divide-y divide-slate-200">
            {PORTS_OF_DISCHARGE.filter(p => p.code !== 'ALL').map((pod, idx) => {
              return (
                <div
                  key={pod.code}
                  onClick={() => {
                    setSelectedPOD(pod.code);
                    setMode('see_all');
                  }}
                  className="p-4 hover:bg-slate-50 flex items-center justify-between cursor-pointer transition-all group"
                >
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-full bg-rose-50 text-rose-600 border border-rose-200 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                      <MapPin className="w-4 h-4" />
                    </div>
                    <div>
                      <div className="flex items-center gap-2">
                        <h4 className="font-extrabold text-slate-900 text-sm group-hover:text-blue-700 transition-colors">
                          {pod.name}
                        </h4>
                        <span className="px-1.5 py-0.2 rounded text-[10px] font-mono font-bold bg-slate-100 text-slate-600 border border-slate-200">
                          {pod.codeShort || pod.code}
                        </span>
                      </div>
                      <span className="text-xs text-slate-400 font-medium">
                        Destination: {pod.country}
                      </span>
                    </div>
                  </div>

                  <div className="flex items-center gap-6">
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">SCHEDULES</div>
                      <div className="font-extrabold text-sm text-slate-900">{pod.scheduleCount || 4}</div>
                    </div>
                    <div className="text-right">
                      <div className="text-[10px] font-bold text-slate-400 uppercase">UPCOMING</div>
                      <div className="font-extrabold text-sm text-rose-600">{pod.upcomingCount || 4}</div>
                    </div>
                    <ChevronRight className="w-4 h-4 text-slate-400 group-hover:translate-x-1 transition-transform" />
                  </div>
                </div>
              );
            })}
          </div>
        </div>

      ) : (

        /* 🚢 2-COLUMN VESSEL SCHEDULE CARDS (Exact match with user Screenshot 1 & 3) */
        filteredSchedules.length === 0 ? (
          <div className="bg-white rounded-2xl border border-slate-200 p-12 text-center shadow-soft">
            <AlertCircle className="w-10 h-10 text-amber-500 mx-auto mb-2" />
            <h3 className="text-base font-bold text-slate-800">No Matching Sailing Schedules Found</h3>
            <p className="text-xs text-slate-500 mt-1">Try resetting your shipping line, POD, or POL filters.</p>
            <button
              onClick={resetAllFilters}
              className="mt-4 px-4 py-2 rounded-xl bg-blue-600 text-white font-bold text-xs shadow-md hover:bg-blue-700 transition-all"
            >
              Show All Schedules
            </button>
          </div>
        ) : (
          <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-4">
            {filteredSchedules.map((item) => {
              return (
                <div
                  key={item.id}
                  className="bg-white rounded-xl sm:rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md transition-all duration-200 p-2 sm:p-5 flex flex-col justify-between space-y-2 sm:space-y-4 hover-lift"
                >
                  
                  {/* Card Header: Line Badge & Status */}
                  <div className="flex items-center justify-between gap-1 border-b border-slate-100 pb-1.5 sm:pb-3">
                    <div className="flex items-center gap-1.5 min-w-0">
                      <div className="w-6 h-6 sm:w-8 sm:h-8 rounded-lg sm:rounded-xl bg-slate-100 border border-slate-200 flex items-center justify-center font-black text-[9px] sm:text-xs text-blue-900 shrink-0 shadow-2xs">
                        {item.lineCode.slice(0, 3)}
                      </div>
                      <div className="min-w-0">
                        <h4 className="font-extrabold text-[10px] sm:text-xs text-slate-900 truncate">
                          {item.lineName}
                        </h4>
                      </div>
                    </div>

                    <span className="px-1.5 py-0.2 sm:px-2.5 sm:py-0.5 rounded-full text-[7px] sm:text-[10px] font-extrabold bg-emerald-50 text-emerald-700 border border-emerald-200 flex items-center gap-0.5 shrink-0 whitespace-nowrap">
                      <span className="w-1 h-1 rounded-full bg-emerald-500 animate-pulse" />
                      {item.status}
                    </span>
                  </div>

                  {/* Vessel Name & Voyage */}
                  <div className="space-y-0.5">
                    <div className="flex items-center gap-1">
                      <Ship className="w-3 h-3 sm:w-4 sm:h-4 text-[#e11d48] shrink-0" />
                      <h3 className="text-[11px] sm:text-base font-black text-slate-900 tracking-tight truncate">
                        {item.vesselName}
                      </h3>
                    </div>
                    <p className="text-[8px] sm:text-[11px] font-medium text-slate-500 truncate pl-4 sm:pl-5">
                      Voy: <strong className="text-slate-800">{item.voyage}</strong>
                    </p>
                  </div>

                  {/* Route Corridor Box (POL -> POD) */}
                  <div className="bg-slate-50 rounded-lg sm:rounded-xl p-1.5 sm:p-3 border border-slate-100 grid grid-cols-[1fr,auto,1fr] items-center gap-1 sm:gap-2 text-[8px] sm:text-xs">
                    
                    {/* POL */}
                    <div className="min-w-0">
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">POL</span>
                      <h5 className="font-black text-[9px] sm:text-xs text-slate-900 truncate" title={item.pol}>
                        {item.polCode}
                      </h5>
                      <span className="text-[7px] sm:text-[9px] text-slate-500 truncate block">{item.pol}</span>
                    </div>

                    {/* Arrow */}
                    <div className="flex items-center justify-center px-0.5">
                      <ArrowRight className="w-3 h-3 text-rose-500 shrink-0" />
                    </div>

                    {/* POD */}
                    <div className="min-w-0 text-right">
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">POD</span>
                      <h5 className="font-black text-[9px] sm:text-xs text-rose-700 truncate" title={item.pod}>
                        {item.podCode}
                      </h5>
                      <span className="text-[7px] sm:text-[9px] text-slate-500 truncate block">{item.pod}</span>
                    </div>

                  </div>

                  {/* Dates Strip (ETD, ETA) */}
                  <div className="grid grid-cols-2 gap-1 pt-1 border-t border-slate-100 text-[8px] sm:text-xs">
                    <div>
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">ETD</span>
                      <strong className="text-slate-900 font-extrabold text-[8px] sm:text-xs block truncate">{item.etd}</strong>
                    </div>

                    <div className="text-right">
                      <span className="text-[7px] sm:text-[9px] font-bold text-slate-400 uppercase block">ETA</span>
                      <strong className="text-slate-900 font-extrabold text-[8px] sm:text-xs block truncate">{item.eta}</strong>
                    </div>
                  </div>

                  {/* Card Actions (Live AIS Track Radar) */}
                  <div className="pt-1">
                    <button
                      onClick={() => setActiveVesselModal(item)}
                      className="w-full py-1 sm:py-2 px-2 sm:px-3 rounded-lg sm:rounded-xl bg-gradient-to-r from-[#0b1329] to-[#1e293b] hover:from-[#1e293b] hover:to-[#0b1329] text-white text-[8px] sm:text-xs font-bold transition-all shadow-xs flex items-center justify-center gap-1 group active:scale-95 cursor-pointer"
                    >
                      <Radio className="w-2.5 h-2.5 sm:w-3.5 sm:h-3.5 text-cyan-400 group-hover:scale-110 transition-transform animate-pulse" />
                      <span>Live Radar</span>
                    </button>
                  </div>

                </div>
              );
            })}
          </div>
        )

      )}

      {/* 6. Live AIS Ocean Radar Modal */}
      {activeVesselModal && (
        <VesselLiveRadarModal
          vessel={activeVesselModal}
          onClose={() => setActiveVesselModal(null)}
        />
      )}

    </div>
  );
}
