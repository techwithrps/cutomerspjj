import React, { useState } from 'react';
import { 
  Receipt, 
  Container, 
  Building2, 
  Headphones, 
  LogOut, 
  Menu, 
  X, 
  ShieldCheck, 
  MapPin, 
  ChevronRight, 
  CheckCircle2, 
  Navigation, 
  Ship, 
  Cpu, 
  Sparkles,
  Truck
} from 'lucide-react';

export default function CustomerNavbar({ 
  activeTab, 
  setActiveTab, 
  customer, 
  onLogout,
  onOpenWelcome 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'invoices', label: 'Invoices', fullLabel: 'My Invoices', icon: Receipt },
    { id: 'containers', label: 'Containers', fullLabel: 'Containers', icon: Container },
    { id: 'tracking', label: 'Tracking', fullLabel: 'Track Container', icon: Navigation },
    { id: 'gr', label: 'Fleet GR', fullLabel: 'Fleet GR / Bilty', icon: Truck, isHighlight: true },
    { id: 'schedules', label: 'Vessels', fullLabel: 'Vessel Schedules', icon: Ship },
    { id: 'fetcher', label: 'API Hub', fullLabel: 'Live API Scraper', icon: Cpu },
    { id: 'profile', label: 'Profile', fullLabel: 'Account Profile', icon: Building2 },
    { id: 'support', label: 'Support', fullLabel: 'RM Support', icon: Headphones },
  ];

  const currentItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const CurrentIcon = currentItem.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#0b1329] text-white border-b border-slate-800 shadow-lg w-full">
      
      {/* 1. Main Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-2 sm:gap-4">
          
          {/* Left: Logo & Portal Branding */}
          <div className="flex items-center gap-2 sm:gap-3 shrink-0">
            <div 
              onClick={() => {
                setActiveTab('invoices');
                setMobileMenuOpen(false);
              }}
              className="bg-white/95 backdrop-blur-md px-2 sm:px-2.5 py-1 rounded-xl shadow-xs flex items-center shrink-0 cursor-pointer hover:opacity-90 transition-opacity"
            >
              <img 
                src="/logo.png" 
                alt="SPJ Group of Companies" 
                className="h-5.5 sm:h-7 w-auto object-contain" 
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-[#00f2fe] uppercase">
                  CLIENT PORTAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-[11px] font-semibold text-slate-300 hidden lg:inline truncate max-w-[170px] xl:max-w-none">
                Invoicing & Multimodal Gateway
              </span>
            </div>
          </div>

          {/* Center: Navigation Tabs (Desktop & Tablet) */}
          <nav className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 gap-0.5 sm:gap-1 shrink-0">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              const isTracking = item.id === 'tracking';
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-1.5 px-2 xl:px-2.5 2xl:px-3 py-1.5 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5 shrink-0" />
                  <span className="hidden 2xl:inline">{item.fullLabel}</span>
                  <span className="inline 2xl:hidden">{item.label}</span>
                  {isTracking && (
                    <span className="px-1.5 py-0.2 rounded-full text-[8px] font-black bg-cyan-400 text-slate-950 uppercase animate-pulse shrink-0">
                      LIVE
                    </span>
                  )}
                </button>
              );
            })}
          </nav>

          {/* Right Action Items: Big Red LOGOUT BUTTON & Mobile Toggle */}
          <div className="flex items-center gap-2 shrink-0">
            
            {/* 🔴 ALWAYS-VISIBLE HIGH-CONTRAST LOGOUT BUTTON */}
            <button
              onClick={onLogout}
              type="button"
              title="Sign Out / Logout from Client Portal"
              className="flex items-center gap-1.5 px-3 py-1.5 sm:px-3.5 sm:py-2 bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white font-black text-xs rounded-xl shadow-md shadow-rose-950/40 border border-rose-400/40 transition-all hover:scale-105 active:scale-95 cursor-pointer shrink-0"
            >
              <LogOut className="w-3.5 h-3.5 sm:w-4 sm:h-4 text-white shrink-0" />
              <span className="font-extrabold uppercase tracking-wide text-xs">Logout</span>
            </button>

            {/* 📱 MOBILE / TABLET MENU TOGGLE (< lg screens) */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex lg:hidden items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer border border-cyan-400/30 shrink-0"
            >
              {mobileMenuOpen ? <X className="w-4 h-4 text-amber-300" /> : <Menu className="w-4 h-4 text-amber-300" />}
              <span className="text-xs font-bold">Menu</span>
            </button>

          </div>

        </div>
      </div>

      {/* 2. Prominent Client Executive Banner Strip with Secondary Information */}
      {customer && (
        <div className="bg-gradient-to-r from-[#070d1e] via-[#0f172a] to-[#070d1e] py-2 px-3 sm:px-6 lg:px-8 border-t border-slate-800/80">
          <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            
            {/* Customer Title & Status */}
            <div 
              onClick={onOpenWelcome}
              className="flex items-center gap-2 min-w-0 cursor-pointer group"
              title="Click to view Welcome Overview Modal"
            >
              <div className="w-5 h-5 rounded-md bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0 group-hover:scale-110 transition-transform">
                <CheckCircle2 className="w-3 h-3 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 flex-wrap min-w-0">
                <span className="text-xs sm:text-sm font-extrabold text-white group-hover:text-cyan-200 font-display truncate max-w-[280px] sm:max-w-none transition-colors">
                  {customer.name}
                </span>
                <span className="text-[9px] font-black px-2 py-0.5 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                  {customer.code} CLIENT HUB
                </span>
              </div>
            </div>

            {/* Hub, GST & Verified Badge */}
            <div className="flex items-center gap-2.5 sm:gap-3 text-[10px] sm:text-[11px] text-slate-300 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Hub: <strong className="text-white">{(customer.primaryHub || 'TRANSWORLD-DADRI').replace(/--+/g, '-')}</strong></span>
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline">GST: <strong className="font-mono text-white">{customer.gstin}</strong></span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                SSL Verified
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 📱 Mobile Drawer Modal Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] xl:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div 
            onClick={(e) => e.stopPropagation()}
            className="fixed top-16 right-3 left-3 sm:left-auto sm:right-6 sm:w-96 bg-[#0f172a] text-white rounded-3xl shadow-2xl border border-slate-700 p-4 z-[101] animate-scale-in space-y-3.5 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {/* Customer Account Header Card in Menu (Clickable for Welcome Overview) */}
            {customer && (
              <div 
                onClick={() => {
                  if (onOpenWelcome) onOpenWelcome();
                  setMobileMenuOpen(false);
                }}
                className="p-3.5 bg-gradient-to-r from-slate-900 to-[#1e293b] hover:border-cyan-500/60 rounded-2xl border border-slate-700 shadow-md space-y-2 cursor-pointer transition-all group active:scale-98"
                title="View Company Welcome Overview"
              >
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 group-hover:bg-cyan-500/30 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-300 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-white block truncate group-hover:text-cyan-200">
                        {customer.name}
                      </span>
                      <span className="text-[10px] text-cyan-300 block font-mono">
                        GST: {customer.gstin}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={(e) => {
                      e.stopPropagation();
                      setMobileMenuOpen(false);
                    }}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-[10px]">
                  <span className="text-slate-300 flex items-center gap-1 truncate">
                    <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                    {customer.primaryHub}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 shrink-0">
                    Active
                  </span>
                </div>
              </div>
            )}

            {/* Navigation Items */}
            <div className="space-y-1.5">
              <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                Client Modules
              </div>
              {navItems.map((item) => {
                const Icon = item.icon;
                const isActive = activeTab === item.id;
                return (
                  <button
                    key={item.id}
                    onClick={() => {
                      setActiveTab(item.id);
                      setMobileMenuOpen(false);
                    }}
                    className={`w-full flex items-center justify-between px-3.5 py-3 rounded-2xl text-xs font-bold transition-all cursor-pointer text-left ${
                      isActive 
                        ? 'bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white shadow-md' 
                        : 'text-slate-300 hover:bg-slate-800'
                    }`}
                  >
                    <div className="flex items-center gap-3">
                      <Icon className={`w-4 h-4 ${isActive ? 'text-amber-300' : 'text-slate-400'}`} />
                      <span>{item.fullLabel || item.label}</span>
                    </div>
                    <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-500'}`} />
                  </button>
                );
              })}
            </div>

            {/* Logout Button */}
            <div className="pt-2 border-t border-slate-800">
              <button
                onClick={() => {
                  setMobileMenuOpen(false);
                  if (onLogout) onLogout();
                }}
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-black bg-gradient-to-r from-rose-600 to-red-600 hover:from-rose-500 hover:to-red-500 text-white active:scale-[0.99] transition-all cursor-pointer shadow-lg shadow-rose-950/50 uppercase tracking-wide"
              >
                <LogOut className="w-4 h-4 text-white" />
                <span>Sign Out from Client Portal</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
