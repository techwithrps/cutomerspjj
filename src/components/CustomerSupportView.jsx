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
  const defaultRm = {
    name: 'Mr. Dinesh',
    phone: '+91-8750194222',
    altPhone: '+91-9310209222',
    email: 'info@spjcargo.com',
    emails: ['info@spjcargo.com', 'ashish@spjcargo.com', 'hemant@spjcargo.com'],
    whatsapp: '+918750194222',
    office: 'D-9/3 Okhla , Industrial Estate, Phase -1, Okhla Industrial Estate Phase 1, New Delhi-110020, Delhi, India'
  };

  const rm = (customer?.relationshipManager && customer.relationshipManager.name && !customer.relationshipManager.name.includes('Pooja'))
    ? { ...defaultRm, ...customer.relationshipManager }
    : defaultRm;

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
              SPJ Dedicated RM Desk
            </div>

            <div className="bg-purple-50/60 p-4 rounded-2xl border border-purple-100 space-y-1.5">
              <span className="text-base font-extrabold text-[#2b1f55] block">{rm.name}</span>
              <span className="text-[11px] text-slate-600 block leading-relaxed">
                📍 {rm.office}
              </span>
            </div>

            <div className="space-y-2 text-xs">
              {/* Phone Lines */}
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <a 
                  href={`tel:${rm.phone || '+91-8750194222'}`}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs">{rm.phone || '+91-8750194222'}</span>
                </a>

                <a 
                  href={`tel:${rm.altPhone || '+91-9310209222'}`}
                  className="flex items-center justify-center gap-2 p-2.5 rounded-2xl bg-slate-50 hover:bg-slate-100 text-slate-800 font-bold border border-slate-200 transition-colors"
                >
                  <Phone className="w-3.5 h-3.5 text-emerald-600 shrink-0" />
                  <span className="text-xs">{rm.altPhone || '+91-9310209222'}</span>
                </a>
              </div>

              {/* Email Addresses */}
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-200 space-y-1.5">
                <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Corporate RM Desks</span>
                <div className="flex flex-wrap gap-2 text-[11px]">
                  {['info@spjcargo.com', 'ashish@spjcargo.com', 'hemant@spjcargo.com'].map((em) => (
                    <a
                      key={em}
                      href={`mailto:${em}`}
                      className="inline-flex items-center gap-1.5 px-2.5 py-1 rounded-xl bg-white hover:bg-blue-50 text-blue-700 font-bold border border-slate-200 transition-colors shadow-2xs"
                    >
                      <Mail className="w-3 h-3 text-blue-600 shrink-0" />
                      <span>{em}</span>
                    </a>
                  ))}
                </div>
              </div>

              {/* WhatsApp CTA */}
              <a 
                href={`https://wa.me/${(rm.whatsapp || '+918750194222').replace(/[^0-9]/g, '')}`}
                target="_blank"
                rel="noreferrer"
                className="flex items-center justify-center gap-2 p-3 rounded-2xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md cursor-pointer"
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
                <a href="mailto:info@spjcargo.com" className="hover:underline">info@spjcargo.com</a>
                <span>•</span>
                <a href="tel:+918750194222" className="hover:underline">+91-8750194222</a>
              </div>
            </div>

            <div className="p-3 bg-slate-50 rounded-2xl border border-slate-100">
              <span className="font-bold text-slate-900 block text-xs">24x7 Yard Gate & Reefer Cold Chain Control</span>
              <span className="text-slate-500 text-[11px] block mt-0.5">Emergency temperature monitoring, seal verification & rake updates</span>
              <div className="flex items-center gap-3 mt-2 text-emerald-700 font-bold">
                <a href="mailto:ashish@spjcargo.com" className="hover:underline">ashish@spjcargo.com</a>
                <span>•</span>
                <a href="tel:+919310209222" className="hover:underline">+91-9310209222</a>
              </div>
            </div>

            <div className="p-3 bg-purple-50/60 rounded-2xl border border-purple-100 text-[11px] text-purple-900 font-medium leading-relaxed">
              📍 <strong>SPJ Corporate Headquarters:</strong> D-9/3 Okhla , Industrial Estate, Phase -1, Okhla Industrial Estate Phase 1, New Delhi-110020, Delhi, India
            </div>
          </div>
        </div>

      </div>

    </div>
  );
}
