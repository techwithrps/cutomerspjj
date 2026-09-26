import React from 'react';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Phone, 
  Mail, 
  MessageSquare, 
  CreditCard, 
  FileText, 
  CheckCircle2, 
  Clock, 
  Award,
  ExternalLink,
  Users
} from 'lucide-react';

export default function CustomerProfileView({ customer }) {
  if (!customer) return null;

  const defaultRm = {
    name: 'Mr. Dinesh',
    role: 'Key Account Director — SPJ Group',
    phone: '+91-8750194222',
    altPhone: '+91-9310209222',
    email: 'info@spjcargo.com',
    emails: ['info@spjcargo.com', 'ashish@spjcargo.com', 'hemant@spjcargo.com'],
    whatsapp: '+918750194222',
    office: 'D-9/3 Okhla , Industrial Estate, Phase -1, Okhla Industrial Estate Phase 1, New Delhi-110020, Delhi, India'
  };

  const rm = (customer.relationshipManager && customer.relationshipManager.name && !customer.relationshipManager.name.includes('Pooja'))
    ? { ...defaultRm, ...customer.relationshipManager }
    : defaultRm;
  const fin = customer.financialOverview;

  const formatCurrency = (val) => {
    return '₹ ' + Number(val || 0).toLocaleString('en-IN');
  };

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* Top Banner */}
      <div className="bg-gradient-to-r from-slate-900 via-[#1e133d] to-[#2b1f55] rounded-3xl p-5 sm:p-8 text-white shadow-card flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
        <div className="flex items-center gap-4">
          <div className="w-14 h-14 sm:w-16 sm:h-16 rounded-2xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-amber-400 shrink-0 shadow-lg">
            <Building2 className="w-8 h-8" />
          </div>
          <div>
            <div className="flex items-center gap-2 flex-wrap">
              <h1 className="text-xl sm:text-2xl font-black font-display text-white">
                {customer.name}
              </h1>
              <span className="px-2.5 py-0.5 rounded-full text-[10px] font-black bg-purple-500/30 text-purple-200 border border-purple-400/40">
                {customer.category}
              </span>
            </div>
            <p className="text-xs sm:text-sm text-purple-200 mt-1">
              {customer.tagline}
            </p>
          </div>
        </div>

        <div className="flex items-center gap-2 shrink-0">
          <span className="px-3 py-1.5 rounded-xl bg-emerald-500/20 text-emerald-300 font-bold border border-emerald-500/30 text-xs flex items-center gap-1.5">
            <CheckCircle2 className="w-4 h-4 text-emerald-400" />
            Verified Enterprise Shipper
          </span>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4 sm:gap-6">
        
        {/* Left 2 Cols: Corporate Legal & Logistics Hubs */}
        <div className="lg:col-span-2 space-y-4 sm:space-y-6">
          
          {/* Statutory & Tax Details */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <ShieldCheck className="w-5 h-5 text-[#2b1f55]" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Statutory & Government Compliance Profile
              </h2>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-3 text-xs">
              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">GSTIN Number</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{customer.gstin}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">IEC Code (DGFT)</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{customer.iec}</span>
              </div>

              <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100">
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Income Tax PAN</span>
                <span className="font-mono font-bold text-slate-900 block mt-0.5">{customer.pan}</span>
              </div>
            </div>

            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 text-xs">
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Registered Office Address</span>
              <p className="font-semibold text-slate-800 mt-1 leading-relaxed">
                {customer.registeredAddress}
              </p>
            </div>
          </div>

          {/* Active Operational Hubs */}
          <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-4">
            <div className="flex items-center gap-2 border-b border-slate-100 pb-3">
              <MapPin className="w-5 h-5 text-[#ff6a00]" />
              <h2 className="text-sm sm:text-base font-bold text-slate-900">
                Assigned Operational Terminals & Ports
              </h2>
            </div>

            <div className="space-y-3 text-xs">
              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block">Designated Primary Hub</span>
                <span className="font-extrabold text-[#2b1f55] text-sm block mt-0.5">
                  📍 {customer.primaryHub}
                </span>
              </div>

              <div>
                <span className="text-[10px] font-bold text-slate-400 uppercase block mb-1.5">Authorized Terminals</span>
                <div className="flex items-center gap-2 flex-wrap">
                  {(customer.activeTerminals || []).map((term, i) => (
                    <span key={i} className="px-3 py-1 rounded-xl bg-purple-50 text-purple-900 border border-purple-200 font-bold text-xs">
                      {term}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          </div>

        </div>

        {/* Right 1 Col: Relationship Manager & Financial Ledger */}
        <div className="space-y-4 sm:space-y-6">
          
          {/* Dedicated SPJ Relationship Manager */}
          {rm && (
            <div className="bg-gradient-to-br from-[#2b1f55] to-[#453084] rounded-3xl p-5 text-white shadow-card space-y-4">
              <div className="flex items-center gap-2 border-b border-white/10 pb-3">
                <Users className="w-5 h-5 text-amber-400" />
                <h3 className="text-sm font-bold text-white">
                  Your Dedicated SPJ Manager
                </h3>
              </div>

              <div className="space-y-1">
                <h4 className="text-base font-black text-white">{rm.name}</h4>
                <p className="text-[11px] text-slate-300 leading-relaxed">📍 {rm.office}</p>
              </div>

              <div className="space-y-2 pt-2 border-t border-white/10 text-xs">
                {/* Phone numbers */}
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-1.5">
                  <a 
                    href={`tel:${rm.phone || '+91-8750194222'}`} 
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{rm.phone || '+91-8750194222'}</span>
                  </a>

                  <a 
                    href={`tel:${rm.altPhone || '+91-9310209222'}`} 
                    className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-semibold transition-colors text-[11px]"
                  >
                    <Phone className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                    <span className="truncate">{rm.altPhone || '+91-9310209222'}</span>
                  </a>
                </div>

                {/* Emails list */}
                <div className="space-y-1">
                  {['info@spjcargo.com', 'ashish@spjcargo.com', 'hemant@spjcargo.com'].map((em) => (
                    <a 
                      key={em}
                      href={`mailto:${em}`} 
                      className="flex items-center gap-2 p-2 rounded-xl bg-white/10 hover:bg-white/20 text-white font-medium transition-colors text-[11px]"
                    >
                      <Mail className="w-3.5 h-3.5 text-cyan-400 shrink-0" />
                      <span className="truncate">{em}</span>
                    </a>
                  ))}
                </div>

                <a 
                  href={`https://wa.me/${(rm.whatsapp || '+918750194222').replace(/[^0-9]/g, '')}`} 
                  target="_blank" 
                  rel="noreferrer"
                  className="flex items-center justify-center gap-2 p-2.5 rounded-xl bg-emerald-600 hover:bg-emerald-700 text-white font-bold transition-all shadow-md cursor-pointer"
                >
                  <MessageSquare className="w-4 h-4" />
                  <span>Chat on WhatsApp</span>
                </a>
              </div>
            </div>
          )}

          {/* Account Health Pill */}
          {fin && (
            <div className="bg-white p-5 rounded-3xl border border-slate-200 shadow-card space-y-3 text-xs">
              <div className="flex items-center gap-2 border-b border-slate-100 pb-2.5 font-bold text-slate-900">
                <CreditCard className="w-4 h-4 text-blue-600" />
                Credit Terms & Service Level
              </div>

              <div className="space-y-2">
                <div className="flex justify-between">
                  <span className="text-slate-500">Approved Credit Limit:</span>
                  <span className="font-bold text-slate-900">{formatCurrency(fin.creditLimit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">Utilized Balance:</span>
                  <span className="font-bold text-amber-600">{formatCurrency(fin.utilizedCredit)}</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-slate-500">On-Time Delivery SLA:</span>
                  <span className="font-bold text-emerald-600">{fin.onTimeDeliveryRate}</span>
                </div>
              </div>
            </div>
          )}

        </div>

      </div>

    </div>
  );
}
