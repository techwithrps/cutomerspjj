import React from 'react';
import { 
  Headphones, 
  Phone, 
  Mail, 
  MessageSquare, 
  MapPin, 
  ShieldCheck, 
  Clock, 
  HelpCircle,
  CheckCircle2,
  FileQuestion
} from 'lucide-react';

export default function CustomerSupportView({ customer }) {
  const rm = customer?.relationshipManager;

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e133d] to-[#2b1f55] rounded-3xl p-5 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-amber-400 shrink-0">
            <Headphones className="w-7 h-7" />
          </div>
          <div>
            <h1 className="text-xl sm:text-2xl font-black font-display text-white">
              Dedicated Shipper Support & RM Desk
            </h1>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              Priority 24x7 Assistance for Invoicing, Yard Movements & Container Clearances
            </p>
          </div>
        </div>

        <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs flex items-center gap-1.5 shrink-0">
          <Clock className="w-4 h-4 text-emerald-400" />
          24/7 Operations Helpdesk
        </span>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-4 sm:gap-6">
        
        {/* Dedicated RM Direct Box */}
        {rm && (
          <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 text-sm sm:text-base">
              <ShieldCheck className="w-5 h-5 text-[#2b1f55]" />
              Assigned Key Account Director
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-base font-extrabold text-[#2b1f55] block">{rm.name}</span>
              <span className="text-xs text-purple-800 font-semibold block">{rm.role}</span>
              <span className="text-[11px] text-slate-500 block">{rm.office}</span>
            </div>

            <div className="space-y-2 text-xs">
              <a 
                href={`tel:${rm.phone}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Phone className="w-4 h-4 text-emerald-600" />
                  <span>Call Direct: {rm.phone}</span>
                </div>
                <span className="text-[10px] text-slate-400">Direct Line</span>
              </a>

              <a 
                href={`mailto:${rm.email}`}
                className="flex items-center justify-between p-3 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 transition-colors"
              >
                <div className="flex items-center gap-2.5">
                  <Mail className="w-4 h-4 text-blue-600" />
                  <span className="truncate">{rm.email}</span>
                </div>
                <span className="text-[10px] text-slate-400">Email</span>
              </a>

              <a 
                href={`https://wa.me/${rm.whatsapp.replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md"
              >
                <MessageSquare className="w-4 h-4" />
                <span>Instant WhatsApp Communication</span>
              </a>
            </div>
          </div>
        )}

        {/* Central Operations & Escalation Matrix */}
        <div className="bg-white p-5 sm:p-6 rounded-3xl border border-slate-200 shadow-card space-y-4">
          <div className="flex items-center gap-2 border-b border-slate-100 pb-3 font-bold text-slate-900 text-sm sm:text-base">
            <HelpCircle className="w-5 h-5 text-[#ff6a00]" />
            SPJ Central Operations & Billing Desk
          </div>

          <div className="space-y-3 text-xs">
            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">National Freight Invoicing Desk</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">For e-invoicing queries, GST reconciliations & ledger statements</span>
              <div className="flex items-center gap-3 mt-2 text-blue-700 font-bold">
                <span>billing@spjcargo.com</span>
                <span>•</span>
                <span>+91 11 4100 8899</span>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">24x7 Yard Gate & Reefer Cold Chain Control</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Emergency temperature monitoring, seal verification & rake updates</span>
              <div className="flex items-center gap-3 mt-2 text-emerald-700 font-bold">
                <span>operations.dadri@spjcargo.com</span>
                <span>•</span>
                <span>+91 98110 00192</span>
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-[11px] text-purple-900 font-medium">
              📍 <strong>SPJ Corporate Headquarters:</strong> E-6, Third Floor, Kalkaji, New Delhi-110019, India
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
