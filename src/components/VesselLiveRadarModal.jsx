import React, { useEffect, useRef } from 'react';
import { 
  X, 
  Navigation, 
  Compass, 
  Gauge, 
  Anchor, 
  Clock, 
  MapPin, 
  ArrowRight, 
  Activity, 
  ShieldCheck, 
  Radio, 
  Waves,
  ExternalLink,
  Calendar
} from 'lucide-react';
import L from 'leaflet';
import 'leaflet/dist/leaflet.css';

export default function VesselLiveRadarModal({ vessel, onClose }) {
  const mapContainerRef = useRef(null);
  const mapInstanceRef = useRef(null);

  useEffect(() => {
    if (!vessel || !mapContainerRef.current) return;

    // Destroy existing map instance if open
    if (mapInstanceRef.current) {
      mapInstanceRef.current.remove();
      mapInstanceRef.current = null;
    }

    const polCoords = vessel.polCode === 'MDCC' ? [22.7441, 69.7042] : [18.9486, 72.9512];
    const vesselCoords = vessel.telemetry ? [vessel.telemetry.lat, vessel.telemetry.lng] : polCoords;
    
    // Approximate POD Coordinates
    let podCoords = [vessel.podCode === 'TRMER' ? 36.8121 : (vessel.podCode === 'Jakarta' ? -6.1018 : 10.8231), 
                     vessel.podCode === 'TRMER' ? 34.6415 : (vessel.podCode === 'Jakarta' ? 106.8833 : 106.6297)];

    // Initialize Leaflet Map with Maritime Dark/Satellite/OpenStreetMap
    const map = L.map(mapContainerRef.current, {
      center: vesselCoords,
      zoom: vessel.telemetry?.speedKnots > 0 ? 5 : 8,
      zoomControl: true,
      attributionControl: false
    });

    mapInstanceRef.current = map;

    // Modern CartoDB Voyager / OpenSeaMap tiles
    L.tileLayer('https://{s}.basemaps.cartocdn.com/rastertiles/voyager/{z}/{x}/{y}{r}.png', {
      maxZoom: 18,
      subdomains: 'abcd',
    }).addTo(map);

    // Custom Vessel Marker Icon (Glowing Pulse Radar)
    const vesselIconHtml = `
      <div style="position: relative; width: 36px; height: 36px; display: flex; items-center; justify-content: center;">
        <div style="position: absolute; inset: 0; border-radius: 9999px; background: rgba(37, 99, 235, 0.35); animation: ping 1.5s cubic-bezier(0, 0, 0.2, 1) infinite;"></div>
        <div style="position: relative; width: 30px; height: 30px; border-radius: 9999px; background: #1d4ed8; border: 2px solid white; box-shadow: 0 4px 12px rgba(0,0,0,0.3); display: flex; align-items: center; justify-content: center; color: white;">
          <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2.5" stroke-linecap="round" stroke-linejoin="round">
            <path d="M2 21c.6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1 .6.5 1.2 1 2.5 1 2.5 0 2.5-2 5-2 1.3 0 1.9.5 2.5 1"/>
            <path d="M19.38 20A11.6 11.6 0 0 0 21 14l-9-4-9 4c0 2.9.94 5.34 2.81 7.76"/>
            <path d="M19 13V7a2 2 0 0 0-2-2H7a2 2 0 0 0-2 2v6"/>
            <path d="M12 10v4"/>
            <path d="M12 2v3"/>
          </svg>
        </div>
      </div>
    `;

    const vesselIcon = L.divIcon({
      html: vesselIconHtml,
      className: 'custom-vessel-marker',
      iconSize: [36, 36],
      iconAnchor: [18, 18],
      popupAnchor: [0, -18]
    });

    const polIcon = L.divIcon({
      html: `<div style="background: #059669; color: white; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 10px; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); white-space: nowrap;">🟢 POL: ${vessel.polCode}</div>`,
      className: 'pol-label-marker',
      iconSize: [80, 24],
      iconAnchor: [40, 12]
    });

    const podIcon = L.divIcon({
      html: `<div style="background: #dc2626; color: white; padding: 3px 8px; border-radius: 6px; font-weight: bold; font-size: 10px; border: 1.5px solid white; box-shadow: 0 2px 6px rgba(0,0,0,0.25); white-space: nowrap;">🎯 POD: ${vessel.podCode}</div>`,
      className: 'pod-label-marker',
      iconSize: [80, 24],
      iconAnchor: [40, 12]
    });

    L.marker(polCoords, { icon: polIcon }).addTo(map).bindPopup(`<b>Port of Loading:</b> ${vessel.pol}`);
    L.marker(podCoords, { icon: podIcon }).addTo(map).bindPopup(`<b>Port of Discharge:</b> ${vessel.pod}`);
    
    // Draw Nautical Waypoint Sea Path
    const seaPath = [polCoords, vesselCoords, podCoords];
    L.polyline(seaPath, {
      color: '#2563eb',
      weight: 3.5,
      dashArray: '6, 8',
      opacity: 0.85
    }).addTo(map);

    const marker = L.marker(vesselCoords, { icon: vesselIcon }).addTo(map);
    marker.bindPopup(`
      <div style="font-family: sans-serif; font-size: 12px; line-height: 1.4;">
        <strong style="color: #1e3a8a; font-size: 13px;">🚢 ${vessel.vesselName}</strong><br/>
        <b>Voyage:</b> ${vessel.voyage}<br/>
        <b>Speed:</b> ${vessel.telemetry?.speedKnots || 0} Knots<br/>
        <b>Status:</b> ${vessel.telemetry?.navStatus || 'Underway'}
      </div>
    `).openPopup();

    return () => {
      if (mapInstanceRef.current) {
        mapInstanceRef.current.remove();
        mapInstanceRef.current = null;
      }
    };
  }, [vessel]);

  if (!vessel) return null;

  const t = vessel.telemetry || {};

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center bg-slate-900/80 backdrop-blur-sm p-2 sm:p-4 animate-fade-in overflow-y-auto">
      <div className="bg-white w-full max-w-4xl rounded-2xl shadow-2xl border border-slate-200 overflow-hidden flex flex-col max-h-[92vh]">
        
        {/* Modal Header */}
        <div className="bg-gradient-to-r from-[#0b1329] via-[#16254c] to-[#0b1329] text-white p-4 sm:p-5 flex items-center justify-between border-b border-slate-700">
          <div className="flex items-center gap-3 min-w-0">
            <div className="w-10 h-10 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center shrink-0">
              <Radio className="w-5 h-5 text-cyan-400 animate-pulse" />
            </div>
            <div className="min-w-0">
              <div className="flex items-center gap-2 flex-wrap">
                <h3 className="text-base sm:text-lg font-black tracking-wide truncate">
                  {vessel.vesselName}
                </h3>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-cyan-500/20 text-cyan-300 border border-cyan-400/30">
                  Voyage: {vessel.voyage}
                </span>
                <span className="px-2 py-0.5 rounded-full text-[10px] font-extrabold bg-emerald-500/20 text-emerald-300 border border-emerald-400/30">
                  AIS LIVE
                </span>
              </div>
              <p className="text-xs text-slate-300 mt-0.5 truncate">
                Line: {vessel.lineName} • IMO: {vessel.imoCode} • MMSI: {vessel.mmsi || '563065000'}
              </p>
            </div>
          </div>

          <button
            onClick={onClose}
            className="w-8 h-8 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white flex items-center justify-center transition-all shrink-0 ml-2"
          >
            <X className="w-5 h-5" />
          </button>
        </div>

        {/* Modal Body */}
        <div className="p-3 sm:p-5 space-y-4 overflow-y-auto flex-1">
          
          {/* Telemetry KPI Strip */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 sm:gap-3">
            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <Gauge className="w-3.5 h-3.5 text-blue-600" />
                Live Speed (SOG)
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1">
                {t.speedKnots || 0} <span className="text-xs font-semibold text-slate-500">Knots</span>
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <Compass className="w-3.5 h-3.5 text-indigo-600" />
                Course / Heading
              </div>
              <p className="text-base sm:text-lg font-black text-slate-900 mt-1 truncate">
                {t.heading || '0° N'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <Waves className="w-3.5 h-3.5 text-cyan-600" />
                Sea Area / Zone
              </div>
              <p className="text-xs sm:text-sm font-black text-slate-900 mt-1 truncate" title={t.seaArea}>
                {t.seaArea || 'Indian Ocean'}
              </p>
            </div>

            <div className="bg-slate-50 border border-slate-200 rounded-xl p-3 shadow-xs">
              <div className="flex items-center gap-1.5 text-slate-500 text-[10px] font-bold uppercase">
                <Activity className="w-3.5 h-3.5 text-emerald-600" />
                Nav Status
              </div>
              <p className="text-xs sm:text-sm font-black text-emerald-700 mt-1 truncate" title={t.navStatus}>
                {t.navStatus || 'Underway'}
              </p>
            </div>
          </div>

          {/* Interactive Sea Map */}
          <div className="relative rounded-xl overflow-hidden border border-slate-300 shadow-inner h-[280px] sm:h-[340px] w-full bg-slate-100">
            <div ref={mapContainerRef} className="w-full h-full z-10" />
            
            {/* Overlay Telemetry Badge */}
            <div className="absolute top-3 right-3 z-20 bg-white/95 backdrop-blur-md px-3 py-1.5 rounded-xl border border-slate-200 shadow-md text-[11px] font-semibold text-slate-700 flex items-center gap-2">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-ping" />
              GPS: {t.lat?.toFixed(4)}° N, {t.lng?.toFixed(4)}° E
            </div>
          </div>

          {/* Voyage Route Timeline & Progress */}
          <div className="bg-slate-50 rounded-xl border border-slate-200 p-3.5 sm:p-4 space-y-3">
            <div className="flex items-center justify-between text-xs font-bold text-slate-700">
              <span className="flex items-center gap-1.5 text-emerald-700">
                <MapPin className="w-3.5 h-3.5" />
                POL: {vessel.pol} ({vessel.polCode})
              </span>
              <span className="flex items-center gap-1.5 text-red-700">
                <MapPin className="w-3.5 h-3.5" />
                POD: {vessel.pod} ({vessel.podCode})
              </span>
            </div>

            {/* Progress Bar */}
            <div className="w-full bg-slate-200 h-2.5 rounded-full overflow-hidden flex">
              <div 
                className="bg-gradient-to-r from-blue-600 to-cyan-500 h-full rounded-full transition-all duration-500" 
                style={{ width: `${Math.max(8, t.progressPercent || 15)}%` }}
              />
            </div>

            <div className="flex items-center justify-between text-[11px] text-slate-500 font-medium">
              <span>ETD: <strong className="text-slate-800">{vessel.etd}</strong></span>
              <span>Remaining: <strong className="text-blue-700">{t.distanceRemainingNm?.toLocaleString() || 2400} NM</strong></span>
              <span>ETA: <strong className="text-slate-800">{vessel.eta}</strong></span>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-100 p-3 sm:p-4 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2 text-xs text-slate-600">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-4 h-4 text-emerald-600 shrink-0" />
            <span>Official AIS Satellite Feed Powered by <strong>SPJ Marine Intelligence Engine</strong></span>
          </div>

          <button
            onClick={onClose}
            className="w-full sm:w-auto px-5 py-2 rounded-xl bg-slate-800 hover:bg-slate-900 text-white font-bold transition-all shadow-xs"
          >
            Close Radar View
          </button>
        </div>

      </div>
    </div>
  );
}
