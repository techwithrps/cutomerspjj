import React, { useState, useMemo } from 'react';
import { 
  Receipt, 
  Search, 
  Filter, 
  Calendar, 
  Download, 
  CheckCircle2, 
  Clock, 
  AlertCircle, 
  Container, 
  Ship, 
  MapPin, 
  Copy, 
  Check, 
  CreditCard,
  FileText,
  ChevronLeft,
  ChevronRight,
  TrendingUp
} from 'lucide-react';
import REAL_INVOICES_DATA from '../data/realInvoices.json';

export default function InvoiceCardsView({ 
  customer, 
  onSelectInvoice 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [tripTypeFilter, setTripTypeFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [copiedId, setCopiedId] = useState(null);
  const pageSize = 18;

  const customerKey = (customer?.code || 'HMA').toUpperCase();

  // Load real records for this customer
  const allInvoices = useMemo(() => {
    return REAL_INVOICES_DATA[customerKey] || REAL_INVOICES_DATA['HMA'] || [];
  }, [customerKey]);

  const formatCurrency = (val) => {
    return '₹ ' + Math.round(Number(val || 0)).toLocaleString('en-IN');
  };

  const handleCopy = (text, id) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 1500);
  };

  // Filter invoices
  const filteredInvoices = useMemo(() => {
    return allInvoices.filter((inv) => {
      const s = searchTerm.toLowerCase().trim();
      const matchesSearch = !s || (
        (inv.invoiceRefNo || '').toLowerCase().includes(s) ||
        (inv.partyInvNo || '').toLowerCase().includes(s) ||
        (inv.containerNo || '').toLowerCase().includes(s) ||
        (inv.destinationPort || '').toLowerCase().includes(s) ||
        (inv.shippingLine || '').toLowerCase().includes(s) ||
        (inv.terminal || '').toLowerCase().includes(s)
      );

      const matchesStatus = statusFilter === 'ALL' || (inv.status || '').toUpperCase().includes(statusFilter);
      const matchesTrip = tripTypeFilter === 'ALL' || (inv.tripType || '').toUpperCase() === tripTypeFilter;

      return matchesSearch && matchesStatus && matchesTrip;
    });
  }, [allInvoices, searchTerm, statusFilter, tripTypeFilter]);

  // Real KPIs calculations
  const totalBilled = useMemo(() => allInvoices.reduce((sum, i) => sum + (i.totalAmount || 0), 0), [allInvoices]);
  const totalPaid = useMemo(() => allInvoices.filter(i => i.status === 'Paid').reduce((sum, i) => sum + (i.totalAmount || 0), 0), [allInvoices]);
  const pendingAmount = useMemo(() => allInvoices.filter(i => i.status !== 'Paid').reduce((sum, i) => sum + (i.totalAmount || 0), 0), [allInvoices]);
  const totalContainers = allInvoices.length;

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage]);

  return (
    <div className="space-y-3 sm:space-y-5 animate-fade-in">
      
      {/* 1. Real Database Summary Metrics */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3.5">
        
        {/* Total Invoiced */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-blue-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Invoiced ({allInvoices.length})
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-600 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-black font-display text-slate-900 mt-1">
            {formatCurrency(totalBilled)}
          </div>
          <span className="text-[10px] text-slate-500 block mt-0.5">
            Real Oracle Snapshot Billed
          </span>
        </div>

        {/* Total Paid / Settled */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Settled & Paid
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <CheckCircle2 className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-black font-display text-emerald-600 mt-1">
            {formatCurrency(totalPaid)}
          </div>
          <span className="text-[10px] text-emerald-600 font-semibold block mt-0.5">
            Verified Payments
          </span>
        </div>

        {/* Pending Clearance */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-amber-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Pending Clearance
            </span>
            <div className="w-7 h-7 rounded-lg bg-amber-50 text-amber-600 flex items-center justify-center">
              <Clock className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-black font-display text-amber-600 mt-1">
            {formatCurrency(pendingAmount)}
          </div>
          <span className="text-[10px] text-amber-600 font-semibold block mt-0.5">
            Under Net Credit Terms
          </span>
        </div>

        {/* Active Cargo Moves */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-xs hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Containers
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-600 flex items-center justify-center">
              <Container className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-xl font-black font-display text-[#0f172a] mt-1">
            {totalContainers} TEUs
          </div>
          <span className="text-[10px] text-purple-700 font-semibold block mt-0.5">
            Active Multi-Modal Fleet
          </span>
        </div>

      </div>

      {/* 2. Compact Search & Filter Control Bar */}
      <div className="bg-white p-2.5 sm:p-3.5 rounded-2xl border border-slate-200 shadow-xs flex flex-col sm:flex-row items-center justify-between gap-2.5">
        
        {/* Search Input */}
        <div className="relative w-full sm:max-w-md">
          <Search className="w-3.5 h-3.5 text-slate-400 absolute left-3 top-1/2 -translate-y-1/2" />
          <input
            type="text"
            value={searchTerm}
            onChange={(e) => {
              setSearchTerm(e.target.value);
              setCurrentPage(1);
            }}
            placeholder="Search by Invoice Ref, Party Inv, Container #, Port..."
            className="w-full pl-8 pr-3 py-1.5 sm:py-2 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
          />
        </div>

        {/* Status Filters & Trip Pills */}
        <div className="flex items-center gap-1.5 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
          {[
            { id: 'ALL', label: 'All Invoices' },
            { id: 'PAID', label: 'Paid' },
            { id: 'PENDING', label: 'Pending' },
            { id: 'ADJUSTED', label: 'Credit Notes' },
          ].map((tab) => {
            const isActive = statusFilter === tab.id;
            return (
              <button
                key={tab.id}
                onClick={() => {
                  setStatusFilter(tab.id);
                  setCurrentPage(1);
                }}
                className={`px-2.5 py-1.5 rounded-xl text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                  isActive
                    ? 'bg-[#0f172a] text-white shadow-xs'
                    : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                }`}
              >
                {tab.label}
              </button>
            );
          })}
        </div>

      </div>

      {/* 3. Compact Invoice Cards Grid (2 cards per row on mobile, 3 cards on desktop) */}
      {filteredInvoices.length === 0 ? (
        <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2 shadow-xs">
          <AlertCircle className="w-8 h-8 text-amber-500 mx-auto" />
          <h3 className="text-sm font-bold text-slate-900">No Invoices Found</h3>
          <p className="text-xs text-slate-500">
            No record matched your keyword "{searchTerm}".
          </p>
        </div>
      ) : (
        <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3.5">
          {paginatedInvoices.map((inv, idx) => {
            const isPaid = inv.status === 'Paid';
            const isCredit = inv.status.includes('Credit') || inv.status.includes('Adjusted');

            return (
              <div 
                key={idx}
                className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-cyan-500/60 transition-all p-2.5 sm:p-4 flex flex-col justify-between space-y-2.5 hover-lift"
              >
                {/* Header: Invoice # & Status */}
                <div className="space-y-1 border-b border-slate-100 pb-2">
                  <div className="flex items-start justify-between gap-1">
                    <div className="min-w-0">
                      <div className="flex items-center gap-1">
                        <span className="font-mono font-black text-xs sm:text-sm text-[#0f172a] truncate block">
                          {inv.invoiceRefNo}
                        </span>
                        <button
                          onClick={() => handleCopy(inv.invoiceRefNo, idx)}
                          className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                        >
                          {copiedId === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                        </button>
                      </div>
                      <span className="text-[10px] text-slate-400 font-mono block truncate">
                        Party: {inv.partyInvNo}
                      </span>
                    </div>

                    <span className={`px-1.5 py-0.5 rounded-full text-[9px] font-black shrink-0 whitespace-nowrap ${
                      isPaid 
                        ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                        : isCredit 
                        ? 'bg-blue-50 text-blue-700 border border-blue-200'
                        : 'bg-amber-50 text-amber-700 border border-amber-200'
                    }`}>
                      {inv.status}
                    </span>
                  </div>

                  <div className="text-[10px] text-slate-500 flex items-center gap-1">
                    <Calendar className="w-3 h-3 text-slate-400 shrink-0" />
                    <span>Dated: {inv.date}</span>
                  </div>
                </div>

                {/* Cargo & Shipment Meta */}
                <div className="space-y-1.5 text-[11px] bg-slate-50 p-2 sm:p-2.5 rounded-xl border border-slate-100">
                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Container</span>
                    <span className="font-mono font-bold text-slate-900">{inv.containerNo}</span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Port / Country</span>
                    <span className="font-semibold text-slate-800 truncate max-w-[120px]" title={inv.destinationPort}>
                      {inv.destinationPort}
                    </span>
                  </div>

                  <div className="flex items-center justify-between">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Line / Type</span>
                    <span className="font-semibold text-slate-700 truncate max-w-[120px]">
                      {inv.shippingLine} • {inv.containerType}
                    </span>
                  </div>

                  <div className="flex items-center justify-between pt-1 border-t border-slate-200/60">
                    <span className="text-[9px] font-bold text-slate-400 uppercase">Terminal</span>
                    <span className="text-[10px] font-bold text-cyan-800 bg-cyan-50 px-1.5 py-0.2 rounded">
                      {inv.terminal}
                    </span>
                  </div>
                </div>

                {/* Amount & Actions */}
                <div className="pt-1 flex items-center justify-between gap-1 border-t border-slate-100">
                  <div className="min-w-0">
                    <span className="text-[9px] font-bold text-slate-400 uppercase block">Total Value</span>
                    <span className="font-black text-xs sm:text-sm font-display text-[#0f172a] block truncate">
                      {formatCurrency(inv.totalAmount)}
                    </span>
                  </div>

                  <button
                    onClick={() => onSelectInvoice(inv)}
                    className="px-2.5 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg text-[10px] font-bold transition-all cursor-pointer shrink-0"
                  >
                    Details
                  </button>
                </div>

              </div>
            );
          })}
        </div>
      )}

      {/* 4. Pagination Controller */}
      <div className="p-3 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium shadow-xs">
        <div>
          Showing Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredInvoices.length} Invoices)
        </div>

        <div className="flex items-center gap-1.5">
          <button
            onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <ChevronLeft className="w-4 h-4" />
          </button>
          <button
            onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="p-1.5 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
          >
            <ChevronRight className="w-4 h-4" />
          </button>
        </div>
      </div>

    </div>
  );
}
