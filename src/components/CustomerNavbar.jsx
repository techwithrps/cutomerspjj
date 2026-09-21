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
  CreditCard
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
    { id: 'containers', label: 'Container Tracking', shortLabel: 'Containers', icon: Container },
    { id: 'profile', label: 'Company & Account Details', shortLabel: 'Account', icon: Building2 },
    { id: 'support', label: 'Relationship Manager', shortLabel: 'Support', icon: Headphones },
  ];

  const currentItem = navItems.find(item => item.id === activeTab) || navItems[0];
  const CurrentIcon = currentItem.icon;

  return (
    <header className="sticky top-0 z-40 bg-white border-b border-slate-200 shadow-xs w-full">
      <div className="max-w-[1700px] mx-auto px-3 sm:px-6 lg:px-8 w-full">
        <div className="flex items-center justify-between h-14 sm:h-20 gap-2">
          
          {/* Logo & Portal Badge */}
          <div className="flex items-center gap-3 shrink-0">
            <img 
              src="/logo.png" 
              alt="SPJ Group of Companies" 
              className="h-8 sm:h-12 w-auto object-contain cursor-pointer" 
              onClick={() => {
                setActiveTab('invoices');
                setMobileMenuOpen(false);
              }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <div className="hidden sm:block border-l border-slate-200 pl-3">
              <span className="text-[10px] font-black text-[#ff6a00] uppercase tracking-wider block leading-none">
                Client Portal
              </span>
              <span className="text-xs font-bold text-slate-800 leading-tight block mt-0.5">
                Invoice & Cargo Gateway
              </span>
            </div>
          </div>

          {/* 📱 MOBILE: Clean Menu Button */}
          <div className="flex items-center gap-2 lg:hidden">
            {/* Active Tab Pill */}
            <div className="flex items-center gap-1.5 px-2.5 py-1 bg-purple-50 text-[#2b1f55] rounded-xl border border-purple-200 text-[11px] font-bold">
              <CurrentIcon className="w-3.5 h-3.5 text-[#ff6a00]" />
              <span className="truncate max-w-[110px]">{currentItem.shortLabel}</span>
            </div>

            {/* Hamburger Button */}
            <button
              type="button"
              onClick={() => setMobileMenuOpen(prev => !prev)}
              className="flex items-center gap-1.5 px-3 py-1.5 bg-[#2b1f55] hover:bg-[#3b2b73] text-white rounded-xl text-xs font-extrabold shadow-sm active:scale-95 transition-all cursor-pointer border border-purple-800/50"
            >
              {mobileMenuOpen ? (
                <>
                  <X className="w-4 h-4 text-amber-400" />
                  <span>Close</span>
                </>
              ) : (
                <>
                  <Menu className="w-4 h-4 text-amber-400" />
                  <span>Menu</span>
                </>
              )}
            </button>
          </div>

          {/* 📱 Mobile Dropdown / Drawer Modal */}
          {mobileMenuOpen && (
            <div className="fixed inset-0 z-[100] lg:hidden">
              {/* Dimmed Backdrop */}
              <div 
                className="fixed inset-0 bg-slate-950/60 backdrop-blur-xs transition-opacity duration-200"
                onClick={() => setMobileMenuOpen(false)}
              />

              {/* Menu Card */}
              <div 
                onClick={(e) => e.stopPropagation()}
                className="fixed top-16 right-3 left-3 sm:left-auto sm:right-6 sm:w-96 bg-white rounded-3xl shadow-2xl border border-slate-200 p-4 z-[101] animate-scale-in space-y-3.5 max-h-[calc(100vh-80px)] overflow-y-auto"
              >
                {/* Customer Account Header Card in Menu */}
                {customer && (
                  <div className="p-3.5 bg-gradient-to-r from-slate-900 via-[#1e133d] to-[#2b1f55] rounded-2xl text-white shadow-md space-y-2">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center gap-2.5">
                        <div className="w-9 h-9 rounded-xl bg-white/15 border border-white/20 flex items-center justify-center font-black text-xs text-purple-200 shrink-0">
                          <Building2 className="w-5 h-5 text-amber-400" />
                        </div>
                        <div className="min-w-0">
                          <span className="text-xs font-extrabold text-white block truncate">
                            {customer.name}
                          </span>
                          <span className="text-[10px] text-purple-200 block">
                            Code: {customer.code} • GSTIN: {customer.gstin}
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

                    <div className="flex items-center justify-between pt-1 border-t border-white/10 text-[10px]">
                      <span className="text-slate-300 flex items-center gap-1">
                        <MapPin className="w-3 h-3 text-orange-400" />
                        {customer.primaryHub}
                      </span>
                      <span className="px-2 py-0.5 rounded-full bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30">
                        Active Account
                      </span>
                    </div>
                  </div>
                )}

                {/* Navigation Items */}
                <div className="space-y-1.5">
                  <div className="text-[10px] font-bold text-slate-400 uppercase tracking-wider px-2 py-0.5">
                    Client Navigation
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
                            ? 'bg-gradient-to-r from-[#2b1f55] to-[#453084] text-white shadow-md' 
                            : 'text-slate-700 hover:bg-slate-100'
                        }`}
                      >
                        <div className="flex items-center gap-3">
                          <Icon className={`w-4 h-4 ${isActive ? 'text-amber-400' : 'text-slate-400'}`} />
                          <span>{item.label}</span>
                        </div>
                        <ChevronRight className={`w-4 h-4 ${isActive ? 'text-white' : 'text-slate-300'}`} />
                      </button>
                    );
                  })}
                </div>

                {/* Logout Button */}
                <div className="pt-2 border-t border-slate-100">
                  <button
                    onClick={() => {
                      setMobileMenuOpen(false);
                      if (onLogout) onLogout();
                    }}
                    className="w-full flex items-center justify-center gap-2 px-4 py-3 rounded-2xl text-xs font-extrabold bg-rose-50 hover:bg-rose-100 text-rose-700 border border-rose-200 active:scale-[0.99] transition-all cursor-pointer shadow-xs"
                  >
                    <LogOut className="w-4 h-4 text-rose-600" />
                    <span>Sign Out from Client Portal</span>
                  </button>
                </div>

              </div>
            </div>
          )}

          {/* 💻 DESKTOP: Navigation Tabs */}
          <nav className="hidden lg:flex items-center bg-slate-100/90 p-1.5 rounded-2xl border border-slate-200 gap-1">
            {navItems.map((item) => {
              const Icon = item.icon;
              const isActive = activeTab === item.id;
              return (
                <button
                  key={item.id}
                  onClick={() => setActiveTab(item.id)}
                  className={`flex items-center gap-2 px-4 py-2.5 rounded-xl text-xs font-bold transition-all duration-200 whitespace-nowrap cursor-pointer ${
                    isActive
                      ? 'bg-[#2b1f55] text-white shadow-md'
                      : 'text-slate-600 hover:text-[#2b1f55] hover:bg-white'
                  }`}
                >
                  <Icon className="w-4 h-4" />
                  <span>{item.label}</span>
                </button>
              );
            })}
          </nav>

          {/* 💻 DESKTOP: Customer Account Capsule */}
          {customer && (
            <div className="hidden lg:flex items-center bg-slate-50 hover:bg-slate-100/90 transition-all border border-slate-200 rounded-2xl p-1.5 pl-3.5 gap-3 shadow-2xs shrink-0">
              <div className="flex flex-col text-left">
                <div className="flex items-center gap-1.5">
                  <span className="text-xs font-extrabold text-slate-900 tracking-tight leading-none max-w-[200px] truncate">
                    {customer.name}
                  </span>
                  <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[9px] font-black bg-purple-100 text-[#2b1f55] border border-purple-200 leading-none">
                    {customer.code}
                  </span>
                </div>
                <span className="text-[10px] text-slate-500 font-semibold mt-0.5 leading-none truncate max-w-[200px]">
                  GST: {customer.gstin}
                </span>
              </div>

              <div className="w-8 h-8 rounded-xl bg-gradient-to-br from-[#2b1f55] to-[#453084] text-white flex items-center justify-center font-black text-xs shadow-sm shrink-0">
                <Building2 className="w-4 h-4 text-purple-200" />
              </div>

              <button
                onClick={onLogout}
                title="Sign Out"
                className="p-1.5 rounded-xl text-slate-400 hover:text-rose-600 hover:bg-rose-50 border border-transparent hover:border-rose-200 transition-all cursor-pointer"
              >
                <LogOut className="w-4 h-4" />
              </button>
            </div>
          )}

        </div>
      </div>
    </header>
  );
}
