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
  CreditCard,
  Sparkles,
  CheckCircle2
} from 'lucide-react';

export default function CustomerNavbar({ 
  activeTab, 
  setActiveTab, 
  customer, 
  onLogout 
}) {
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);

  const navItems = [
    { id: 'invoices', label: 'My Invoices (Cards)', shortLabel: 'Invoices', icon: Receipt },
    { id: 'containers', label: 'Live Containers', shortLabel: 'Containers', icon: Container },
    { id: 'profile', label: 'Company Account & Profile', shortLabel: 'Profile', icon: Building2 },
    { id: 'support', label: 'RM Desk & Support', shortLabel: 'Support', icon: Headphones },
  ];

  const currentItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const CurrentIcon = currentItem.icon;

  return (
    <header className="sticky top-0 z-40 bg-[#0b1329] text-white border-b border-slate-800 shadow-lg w-full">
      
      {/* 1. Main Navigation Bar */}
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-16 gap-3">
          
          {/* Logo & Portal Branding */}
          <div className="flex items-center gap-3 shrink-0">
            <div className="bg-white/95 backdrop-blur-md px-2.5 py-1 rounded-xl shadow-sm flex items-center shrink-0">
              <img 
                src="/logo.png" 
                alt="SPJ Group of Companies" 
                className="h-6 sm:h-8 w-auto object-contain cursor-pointer" 
                onClick={() => {
                  setActiveTab('invoices');
                  setMobileMenuOpen(false);
                }}
                onError={(e) => {
                  e.target.onerror = null;
                  e.target.style.display = 'none';
                }}
              />
            </div>

            <div className="hidden md:flex flex-col">
              <div className="flex items-center gap-1.5">
                <span className="text-[10px] font-black tracking-widest text-[#00f2fe] uppercase">
                  SPJ CLIENT PORTAL
                </span>
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-pulse"></span>
              </div>
              <span className="text-xs font-bold text-slate-200">
                Invoicing & Multimodal Cargo Gateway
              </span>
            </div>
          </div>

          {/* 💻 DESKTOP: Navigation Tabs */}
          <nav className="hidden lg:flex items-center bg-slate-900/90 p-1 rounded-xl border border-slate-700/80 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-3.5 py-2 rounded-lg text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-gradient-to-r from-[#0284c7] to-[#2563eb] text-white shadow-md'
                      : 'text-slate-300 hover:text-white hover:bg-slate-800'
                  }`}
                >
                  <Icon className="w-3.5 h-3.5" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 💻 DESKTOP: Customer Header Capsule & WhatsApp Button */}
          {customer && (
            <div className="hidden lg:flex items-center gap-2 shrink-0">
              {/* WhatsApp RM Button */}
              <a
                href={`https://wa.me/${(customer?.relationshipManager?.whatsapp || '919811044290').replace(/[^0-9]/g, '')}?text=${encodeURIComponent(`Hello SPJ Support, I am logged in from ${customer.name} Client Portal. Need assistance with invoices/containers.`)}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-emerald-600 hover:bg-emerald-500 text-white font-bold text-xs shadow-sm transition-all hover-lift"
              >
                <svg className="w-4 h-4 fill-current" viewBox="0 0 24 24">
                  <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
                </svg>
                <span>WhatsApp</span>
              </a>

              <div className="flex items-center bg-slate-900/95 border border-slate-700/80 hover:border-cyan-500/50 transition-all rounded-2xl p-1.5 pl-3 gap-2.5 shadow-md max-w-[260px] xl:max-w-xs">
                <div className="flex flex-col text-left min-w-0">
                  <div className="flex items-center gap-1.5 min-w-0">
                    <span className="text-xs font-black text-white tracking-tight truncate">
                      {customer.name}
                    </span>
                    <span className="inline-flex items-center px-1.5 py-0.2 rounded-full text-[9px] font-black bg-cyan-500/20 text-cyan-300 border border-cyan-500/30 shrink-0">
                      {customer.code}
                    </span>
                  </div>
                  <span className="text-[10px] text-slate-400 font-mono font-medium truncate">
                    GST: {customer.gstin}
                  </span>
                </div>

                <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#0284c7] to-[#1e40af] text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">
                  <Building2 className="w-4 h-4 text-cyan-200" />
                </div>
              </div>

              {/* Prominent High-Visibility Logout Button */}
              <button
                onClick={onLogout}
                title="Sign Out / Logout from Client Portal"
                className="flex items-center gap-1.5 px-3 py-2 rounded-xl bg-rose-500/20 hover:bg-rose-500/30 text-rose-300 hover:text-rose-100 border border-rose-500/40 text-xs font-black transition-all hover-lift active:scale-95 cursor-pointer shadow-sm shrink-0"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Logout</span>
              </button>
            </div>
          )}

          {/* 📱 MOBILE: Menu Button & Active Tab */}
          <div className="flex items-center gap-2 lg:hidden">
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-slate-900 text-cyan-300 rounded-xl border border-slate-700 text-[11px] font-bold">
              <CurrentIcon className="w-3.5 h-3.5 text-cyan-400" />
              <span className="truncate max-w-[100px]">{currentItem.shortLabel}</span>
            </div>

            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#0284c7] hover:bg-[#0369a1] text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer border border-cyan-400/30"
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-amber-300" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 text-amber-300" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>

        </div>
      </div>

      {/* 2. Prominent Client Executive Banner Strip (Shows Customer Name clearly on both Mobile & Web) */}
      {customer && (
        <div className="bg-gradient-to-r from-[#070d1e] via-[#0f172a] to-[#070d1e] py-2 px-3 sm:px-6 lg:px-8 border-t border-slate-800/80">
          <div className="max-w-[1700px] mx-auto flex flex-col sm:flex-row items-start sm:items-center justify-between gap-2">
            
            {/* Prominent Customer Title & Status */}
            <div className="flex items-center gap-2.5 min-w-0">
              <div className="w-6 h-6 rounded-lg bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center shrink-0">
                <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400" />
              </div>
              <div className="flex items-center gap-2 flex-wrap">
                <span className="text-xs sm:text-sm font-extrabold text-white font-display">
                  {customer.name}
                </span>
                <span className="text-[10px] font-black px-2 py-0.2 rounded-full bg-cyan-500/20 text-cyan-300 border border-cyan-500/30">
                  {customer.code} CLIENT HUB
                </span>
              </div>
            </div>

            {/* Hub, GST & Security Details */}
            <div className="flex items-center gap-3 text-[11px] text-slate-300 font-medium flex-wrap">
              <span className="flex items-center gap-1">
                <MapPin className="w-3 h-3 text-cyan-400 shrink-0" />
                <span>Primary Hub: <strong className="text-white">{customer.primaryHub}</strong></span>
              </span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="hidden md:inline">GST: <strong className="font-mono text-white">{customer.gstin}</strong></span>
              <span className="hidden md:inline text-slate-600">•</span>
              <span className="text-emerald-400 font-bold flex items-center gap-1">
                <ShieldCheck className="w-3 h-3" />
                Live SSL Verified
              </span>
            </div>

          </div>
        </div>
      )}

      {/* 📱 Mobile Drawer Modal Overlay */}
      {mobileMenuOpen && (
        <div className="fixed inset-0 z-[100] lg:hidden">
          <div 
            className="fixed inset-0 bg-slate-950/70 backdrop-blur-xs transition-opacity duration-200"
            onClick={() => setMobileMenuOpen(false)}
          />

          <div 
            onClick={(e) => e.stopPropagation()}
            className="fixed top-16 right-3 left-3 sm:left-auto sm:right-6 sm:w-96 bg-[#0f172a] text-white rounded-3xl shadow-2xl border border-slate-700 p-4 z-[101] animate-scale-in space-y-3.5 max-h-[calc(100vh-80px)] overflow-y-auto"
          >
            {/* Customer Account Header Card in Menu */}
            {customer && (
              <div className="p-3.5 bg-gradient-to-r from-slate-900 to-[#1e293b] rounded-2xl border border-slate-700 shadow-md space-y-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2.5 min-w-0">
                    <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-300 shrink-0">
                      <Building2 className="w-5 h-5" />
                    </div>
                    <div className="min-w-0">
                      <span className="text-xs font-extrabold text-white block truncate">
                        {customer.name}
                      </span>
                      <span className="text-[10px] text-cyan-300 block font-mono">
                        GST: {customer.gstin}
                      </span>
                    </div>
                  </div>
                  <button 
                    onClick={() => setMobileMenuOpen(false)}
                    className="p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>

                <div className="flex items-center justify-between pt-1 border-t border-slate-700 text-[10px]">
                  <span className="text-slate-300 flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-cyan-400" />
                    {customer.primaryHub}
                  </span>
                  <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
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
                      <span>{item.label}</span>
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
                className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold bg-rose-950/40 hover:bg-rose-900/60 text-rose-300 border border-rose-800/50 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
              >
                <LogOut className="w-4 h-4 text-rose-400" />
                <span>Sign Out from Client Portal</span>
              </button>
            </div>

          </div>
        </div>
      )}

    </header>
  );
}
