import React, { useEffect } from 'react';
import { 
  Building2, 
  ShieldCheck, 
  CheckCircle2, 
  MapPin, 
  Receipt, 
  Container, 
  Headphones, 
  ArrowRight, 
  X, 
  Sparkles,
  Phone,
  MessageCircle,
  FileCheck2,
  Lock,
  ExternalLink
} from 'lucide-react';

export default function CustomerWelcomeModal({ customer, onClose, onNavigateTab }) {
  if (!customer) return null;

  // Listen to Escape key to close
  useEffect(() => {
    const handleKeyDown = (e) => {
      if (e.key === 'Escape') {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [onClose]);

  const stats = customer.exactStats || {};
  const formatCurrency = (val) => {
    if (!val) return '₹ 4.02 Cr';
    const num = Number(val);
    if (num >= 10000000) return `₹ ${(num / 10000000).toFixed(2)} Cr`;
    if (num >= 100000) return `₹ ${(num / 100000).toFixed(2)} Lakh`;
    return '₹ ' + Math.round(num).toLocaleString('en-IN');
  };

  const rm = customer.relationshipManager || {
    name: 'Pooja Nair',
    role: 'Key Account Lead - Western & Northern Corridor',
    phone: '+91 98110 44295',
    whatsapp: '+919811044295'
  };

  return (
    <div className="fixed inset-0 z-[120] overflow-y-auto bg-slate-950/80 backdrop-blur-md flex items-center justify-center p-3 sm:p-5 animate-fade-in">
      <div 
        onClick={(e) => e.stopPropagation()}
        className="bg-white w-full max-w-lg sm:max-w-xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in relative"
      >
        {/* Top Header Glow Banner */}
        <div className="bg-gradient-to-br from-[#0b1329] via-[#0f172a] to-[#1e293b] p-5 sm:p-6 text-white relative overflow-hidden">
          {/* Subtle Background Pattern */}
          <div className="absolute top-0 right-0 -mt-6 -mr-6 w-36 h-36 bg-cyan-500/10 rounded-full blur-2xl pointer-events-none"></div>
          <div className="absolute bottom-0 left-0 -mb-6 -ml-6 w-36 h-36 bg-blue-500/10 rounded-full blur-2xl pointer-events-none"></div>

          {/* Close button */}
          <button
            onClick={onClose}
            className="absolute top-4 right-4 p-1.5 rounded-xl bg-white/10 hover:bg-white/20 text-slate-300 hover:text-white transition-colors cursor-pointer"
            title="Dismiss Welcome"
          >
            <X className="w-4 h-4" />
          </button>

          {/* Badge & Portal Tag */}
          <div className="flex items-center gap-2 mb-3">
            <span className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-full text-[10px] font-black bg-cyan-500/20 text-[#00f2fe] border border-cyan-500/30 uppercase tracking-wider">
              <Sparkles className="w-3 h-3 text-cyan-300 animate-pulse" />
              Welcome to SPJ Client Portal
            </span>
            <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[9px] font-bold bg-emerald-500/20 text-emerald-300 border border-emerald-500/30">
              <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping"></span>
              Live Session Active
            </span>
          </div>

          {/* Customer Name Title */}
          <div className="space-y-1">
            <h2 className="text-lg sm:text-2xl font-black font-display text-white tracking-tight leading-tight">
              {customer.name}
            </h2>
            <div className="flex items-center gap-2 flex-wrap text-xs text-cyan-200/90 font-medium">
              <span className="font-mono bg-cyan-950/60 px-2 py-0.5 rounded border border-cyan-800/60">
                GSTIN: {customer.gstin || '09AAACS9677K1Z6'}
              </span>
              <span>•</span>
              <span className="text-slate-300">{customer.category || 'Verified Enterprise Exporter'}</span>
            </div>
          </div>
        </div>

        {/* Modal Body Info Cards */}
        <div className="p-4 sm:p-6 space-y-4 max-h-[70vh] overflow-y-auto">
          
          {/* Quick Stats Grid */}
          <div className="grid grid-cols-3 gap-2 sm:gap-3 text-center">
            <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Total Billed</span>
              <span className="font-black text-xs sm:text-base text-slate-900 font-display block mt-0.5">
                {formatCurrency(stats.grossRevenue || 40200000)}
              </span>
              <span className="text-[9px] text-emerald-600 font-bold block mt-0.5">100% Reconciled</span>
            </div>

            <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Invoices</span>
              <span className="font-black text-xs sm:text-base text-blue-700 font-display block mt-0.5">
                {stats.invoiceCount || 100} Bills
              </span>
              <span className="text-[9px] text-slate-500 font-medium block mt-0.5">Tax Cleared</span>
            </div>

            <div className="bg-slate-50 p-2.5 sm:p-3 rounded-2xl border border-slate-100">
              <span className="text-[9px] sm:text-[10px] font-bold text-slate-400 uppercase block">Containers</span>
              <span className="font-black text-xs sm:text-base text-slate-900 font-display block mt-0.5">
                {stats.activeContainersCount || 80} Boxes
              </span>
              <span className="text-[9px] text-cyan-700 font-bold block mt-0.5">Reefer Cold Chain</span>
            </div>
          </div>

          {/* Operating Hub & Gateway Status */}
          <div className="bg-slate-50 rounded-2xl p-3.5 border border-slate-200/80 space-y-2">
            <div className="flex items-center justify-between text-xs">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <MapPin className="w-3.5 h-3.5 text-cyan-600" />
                Primary Logistics Hub
              </span>
              <span className="font-black text-slate-900 text-xs font-mono">
                {customer.primaryHub || 'TRANSWORLD-DADRI'}
              </span>
            </div>

            <div className="flex items-center justify-between text-xs pt-2 border-t border-slate-200/60">
              <span className="text-[10px] font-bold text-slate-500 uppercase tracking-wider flex items-center gap-1">
                <ShieldCheck className="w-3.5 h-3.5 text-emerald-600" />
                Live Oracle ERP Sync
              </span>
              <span className="px-2 py-0.5 rounded-full text-[9px] font-black bg-emerald-100 text-emerald-800 border border-emerald-300">
                Connected & Verified
              </span>
            </div>
          </div>

          {/* Dedicated Relationship Manager Card */}
          <div className="bg-gradient-to-r from-blue-50/70 to-indigo-50/70 rounded-2xl p-3.5 border border-blue-100 flex items-center justify-between gap-3">
            <div className="min-w-0">
              <span className="text-[9px] font-bold text-blue-800 uppercase tracking-wider block">
                Dedicated RM Desk
              </span>
              <span className="font-extrabold text-slate-900 text-xs block truncate mt-0.5">
                {rm.name}
              </span>
              <span className="text-[10px] text-slate-500 block truncate">
                {rm.role}
              </span>
            </div>

            <div className="flex items-center gap-1.5 shrink-0">
              <a
                href={`https://wa.me/${rm.whatsapp?.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noopener noreferrer"
                className="p-2 rounded-xl bg-[#25D366] hover:bg-[#20bd5a] text-white transition-all shadow-xs"
                title="WhatsApp RM"
              >
                <MessageCircle className="w-3.5 h-3.5" />
              </a>
              <a
                href={`tel:${rm.phone?.replace(/[^0-9+]/g, '')}`}
                className="p-2 rounded-xl bg-slate-900 hover:bg-slate-800 text-white transition-all shadow-xs"
                title="Call RM"
              >
                <Phone className="w-3.5 h-3.5" />
              </a>
            </div>
          </div>

        </div>

        {/* Modal Action Footer */}
        <div className="p-4 bg-slate-50 border-t border-slate-200 flex flex-col sm:flex-row items-center justify-between gap-2.5">
          <div className="text-[11px] text-slate-500 text-center sm:text-left">
            <span>Press <strong>Enter</strong> or click below to continue.</span>
          </div>

          <button
            type="button"
            onClick={onClose}
            className="w-full sm:w-auto px-6 py-2.5 bg-gradient-to-r from-[#0b1329] via-[#0284c7] to-[#2563eb] hover:opacity-95 text-white font-extrabold text-xs rounded-xl shadow-lg flex items-center justify-center gap-2 transition-all duration-200 hover:scale-105 active:scale-95 cursor-pointer"
          >
            <span>Enter Customer Portal</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </div>

      </div>
    </div>
  );
}
