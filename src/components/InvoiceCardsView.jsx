import React, { useState } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  ExternalLink, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Container, 
  Ship, 
  MapPin, 
  ArrowUpRight, 
  Copy, 
  Check, 
  CreditCard,
  Building2,
  FileText
} from 'lucide-react';

export default function InvoiceCardsView({ 
  invoices, 
  customer, 
  onSelectInvoice 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [copiedId, setCopiedId] = useState(null);

  const formatCurrency = (val) => {
    return '₹ ' + Number(val || 0).toLocaleString('en-IN');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  // Filter invoices
  const filteredInvoices = (invoices || []).filter((inv) => {
    const s = searchTerm.toLowerCase().trim();
    const matchesSearch = !s || (
      inv.invoiceNo.toLowerCase().includes(s) ||
      inv.jobOrderNo.toLowerCase().includes(s) ||
      inv.bookingNo.toLowerCase().includes(s) ||
      inv.shippingLine.toLowerCase().includes(s) ||
      inv.destinationPort.toLowerCase().includes(s) ||
      (inv.containerNumbers || []).some(c => c.toLowerCase().includes(s))
    );

    const matchesStatus = statusFilter === 'ALL' || inv.status.toUpperCase().includes(statusFilter);

    return matchesSearch && matchesStatus;
  });

  // Calculate quick metrics
  const totalBilled = (invoices || []).reduce((sum, i) => sum + i.totalAmount, 0);
  const totalPaid = (invoices || []).filter(i => i.status === 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);
  const pendingAmount = (invoices || []).filter(i => i.status !== 'Paid').reduce((sum, i) => sum + i.totalAmount, 0);

  return (
    <div className="space-y-4 sm:space-y-6 animate-fade-in">
      
      {/* 1. High-Impact KPI Snapshot Cards */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2.5 sm:gap-4">
        
        {/* Total Invoiced */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-start justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Total Invoiced (FY24-25)
            </span>
            <div className="text-base sm:text-2xl font-black font-display text-slate-900 mt-1">
              {formatCurrency(totalBilled)}
            </div>
            <span className="text-[10px] sm:text-xs text-slate-500 font-medium mt-0.5 block">
              {(invoices || []).length} Total Cargo Invoices
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-purple-50 border border-purple-200 text-[#2b1f55] flex items-center justify-center shrink-0">
            <Receipt className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Total Paid & Settled */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-start justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Settled / Paid
            </span>
            <div className="text-base sm:text-2xl font-black font-display text-emerald-600 mt-1">
              {formatCurrency(totalPaid)}
            </div>
            <span className="text-[10px] sm:text-xs text-emerald-600 font-semibold mt-0.5 block flex items-center gap-1">
              <CheckCircle2 className="w-3 h-3" /> Fully Cleared
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-emerald-50 border border-emerald-200 text-emerald-600 flex items-center justify-center shrink-0">
            <CheckCircle2 className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-start justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Pending Clearance
            </span>
            <div className="text-base sm:text-2xl font-black font-display text-amber-600 mt-1">
              {formatCurrency(pendingAmount)}
            </div>
            <span className="text-[10px] sm:text-xs text-amber-600 font-semibold mt-0.5 block flex items-center gap-1">
              <Clock className="w-3 h-3" /> Net-15 Credit
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-amber-50 border border-amber-200 text-amber-600 flex items-center justify-center shrink-0">
            <Clock className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

        {/* Available Credit Limit */}
        <div className="bg-white p-3.5 sm:p-5 rounded-2xl border border-slate-200 shadow-card flex items-start justify-between">
          <div>
            <span className="text-[10px] sm:text-xs font-bold text-slate-400 uppercase tracking-wider block">
              Available Credit Limit
            </span>
            <div className="text-base sm:text-2xl font-black font-display text-[#2b1f55] mt-1">
              {formatCurrency(customer?.financialOverview?.availableCredit || 35720000)}
            </div>
            <span className="text-[10px] sm:text-xs text-purple-700 font-semibold mt-0.5 block">
              Limit: {formatCurrency(customer?.financialOverview?.creditLimit || 50000000)}
            </span>
          </div>
          <div className="w-8 h-8 sm:w-10 sm:h-10 rounded-xl bg-blue-50 border border-blue-200 text-blue-600 flex items-center justify-center shrink-0">
            <CreditCard className="w-4 h-4 sm:w-5 sm:h-5" />
          </div>
        </div>

      </div>

      {/* 2. Search, Status Filter & Actions Bar */}
      <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200 shadow-card flex flex-col sm:flex-row items-center justify-between gap-3">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-4 h-4 text-slate-400 absolute left-3.5 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            placeholder="Search by Invoice #, Job Order, Container #, Port..."
            className="w-full pl-9 pr-4 py-2.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-[#ff6a00] rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none focus:ring-3 focus:ring-[#ff6a00]/15 transition-all"
          />
        </div>

        {/* Status Filter Tabs */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'PAID', label: 'Paid & Settled' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'PROCESSING', label: 'Processing' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => setStatusFilter(tab.id)}
                className={`px-3 py-2 rounded-xl text-xs font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#2b1f55] text-white shadow-sm'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. High-Density Invoices Cards Layout (Cards Format) */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white p-12 rounded-3xl border border-slate-200 text-center space-y-3 shadow-card">
          <AlertCircle className="w-10 h-10 text-amber-500 mx-auto" />
          <h3 className="text-base font-bold text-slate-900">No Invoices Found</h3>
          <p className="text-xs text-slate-500 max-w-sm mx-auto">
            No invoices matched your filter "{searchTerm || statusFilter}". Try clearing your search keyword.
          </p>
          <button
            onClick={() => {
              setSearchTerm('');
              setStatusFilter('ALL');
            }}
            className="px-4 py-2 bg-slate-100 hover:bg-slate-200 text-slate-800 rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Clear Filters
          </button>
        </div>
      ) : (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {filteredInvoices.map((inv) => {
            const isPaid = inv.status === 'Paid';
            const isPending = inv.status.includes('Pending');

            return (
              <div 
                key={inv.id}
                className="bg-white rounded-3xl border border-slate-200 shadow-card hover:shadow-card-hover transition-all duration-200 overflow-hidden flex flex-col justify-between hover-lift"
              >
                {/* Top Section */}
                <div className="p-4 sm:p-5 space-y-3.5">
                  
                  {/* Card Header: Invoice # & Status Badge */}
                  <div className="flex items-start justify-between gap-2 border-b border-slate-100 pb-3">
                    <div>
                      <div className="flex items-center gap-2 flex-wrap">
                        <span className="font-mono font-extrabold text-sm sm:text-base text-[#2b1f55]">
                          {inv.invoiceNo}
                        </span>
                        <button
                          onClick={() => handleCopy(inv.invoiceNo, inv.id)}
                          title="Copy Invoice Number"
                          className="p-1 rounded-lg hover:bg-slate-100 text-slate-400 hover:text-slate-700 transition-colors cursor-pointer"
                        >
                          {copiedId === inv.id ? (
                            <Check className="w-3.5 h-3.5 text-emerald-600" />
                          ) : (
                            <Copy className="w-3.5 h-3.5" />
                          )}
                        </button>
                      </div>
                      <div className="flex items-center gap-2 text-[11px] text-slate-500 mt-1 font-medium">
                        <span className="flex items-center gap-1">
                          <Calendar className="w-3 h-3 text-slate-400" />
                          Dated: {inv.date}
                        </span>
                        <span>•</span>
                        <span>Due: {inv.dueDate}</span>
                      </div>
                    </div>

                    {/* Status Pill */}
                    <div className="shrink-0 text-right">
                      <span className={`inline-flex items-center gap-1 px-2.5 py-1 rounded-full text-xs font-black ${
                        isPaid 
                          ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                          : isPending 
                          ? 'bg-amber-50 text-amber-700 border border-amber-200 animate-pulse' 
                          : 'bg-blue-50 text-blue-700 border border-blue-200'
                      }`}>
                        {isPaid && <CheckCircle2 className="w-3 h-3" />}
                        {isPending && <Clock className="w-3 h-3" />}
                        {inv.status}
                      </span>
                      {isPaid && inv.paidOn && (
                        <span className="text-[10px] text-slate-400 block mt-0.5 font-medium">
                          Paid on {inv.paidOn}
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Shipment & Logistics Details Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 text-xs bg-slate-50/80 p-3 rounded-2xl border border-slate-100">
                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Job Order (JO)</span>
                      <span className="font-mono font-bold text-blue-800 truncate block mt-0.5">{inv.jobOrderNo}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Booking / Shipping Line</span>
                      <span className="font-semibold text-slate-800 truncate block mt-0.5">{inv.shippingLine}</span>
                    </div>

                    <div>
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination Port</span>
                      <span className="font-semibold text-slate-800 truncate block mt-0.5 flex items-center gap-1">
                        <Ship className="w-3 h-3 text-cyan-600 shrink-0" />
                        <span className="truncate">{inv.destinationPort}</span>
                      </span>
                    </div>

                    <div className="col-span-2 sm:col-span-3 pt-2 border-t border-slate-200/60">
                      <span className="text-[10px] font-bold text-slate-400 uppercase block">Cargo & Terminal</span>
                      <div className="flex items-center justify-between gap-2 mt-0.5 flex-wrap">
                        <span className="font-medium text-slate-800 text-[11px]">
                          📦 {inv.commodity}
                        </span>
                        <span className="text-[10px] font-bold text-purple-900 bg-purple-100/70 px-2 py-0.5 rounded-md border border-purple-200">
                          {inv.terminal}
                        </span>
                      </div>
                    </div>
                  </div>

                  {/* Containers Tag List */}
                  <div className="space-y-1">
                    <div className="flex items-center justify-between text-[10px] font-bold text-slate-400 uppercase">
                      <span className="flex items-center gap-1">
                        <Container className="w-3 h-3 text-orange-500" />
                        Containers Billed ({inv.containerCount})
                      </span>
                      <span className="text-slate-500 font-semibold">{inv.containerType}</span>
                    </div>
                    <div className="flex items-center gap-1.5 flex-wrap">
                      {(inv.containerNumbers || []).map((cNo, cIdx) => (
                        <span 
                          key={cIdx} 
                          className="font-mono text-[11px] font-bold bg-white px-2 py-0.5 rounded-lg border border-slate-200 text-slate-800 shadow-2xs"
                        >
                          {cNo}
                        </span>
                      ))}
                    </div>
                  </div>

                </div>

                {/* Bottom Section: Financial Total & Actions */}
                <div className="p-4 sm:p-5 bg-gradient-to-r from-slate-50 via-purple-50/30 to-slate-50 border-t border-slate-100 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                  
                  {/* Amount Breakdown */}
                  <div>
                    <div className="text-[10px] font-bold text-slate-500 uppercase tracking-wider">
                      Total Invoice Value (Incl. GST)
                    </div>
                    <div className="text-xl sm:text-2xl font-black font-display text-[#2b1f55] mt-0.5">
                      {formatCurrency(inv.totalAmount)}
                    </div>
                    <div className="text-[10px] text-slate-400 font-medium">
                      Taxable: {formatCurrency(inv.taxableAmount)} + GST: {formatCurrency(inv.cgst + inv.sgst + inv.igst)}
                    </div>
                  </div>

                  {/* Action Buttons */}
                  <div className="flex items-center gap-2">
                    <button
                      onClick={() => onSelectInvoice(inv)}
                      className="flex-1 sm:flex-initial flex items-center justify-center gap-1.5 px-3.5 py-2.5 bg-[#2b1f55] hover:bg-[#3b2b73] text-white rounded-xl text-xs font-bold transition-all shadow-sm cursor-pointer active:scale-95"
                    >
                      <FileText className="w-3.5 h-3.5 text-amber-400" />
                      <span>View Breakdown</span>
                    </button>

                    <button
                      onClick={() => onSelectInvoice(inv)}
                      title="Download PDF"
                      className="p-2.5 rounded-xl bg-white hover:bg-slate-100 border border-slate-200 text-slate-700 transition-colors shadow-2xs cursor-pointer"
                    >
                      <Download className="w-4 h-4 text-slate-600" />
                    </button>
                  </div>

                </div>

              </div>
            );
          })}
        </div>
      )}

    </div>
  );
}
