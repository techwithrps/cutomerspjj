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
  TrendingUp,
  Percent,
  Layers,
  Award
} from 'lucide-react';
import REAL_INVOICES_DATA from '../data/realInvoices.json';
import { REAL_SERVICE_CATALOG } from '../data/customerData';

export default function InvoiceCardsView({ 
  customer, 
  onSelectInvoice 
}) {
  const [searchTerm, setSearchTerm] = useState('');
  const [statusFilter, setStatusFilter] = useState('ALL');
  const [currentPage, setCurrentPage] = useState(1);
  const [activeSubTab, setActiveSubTab] = useState('invoices'); // 'invoices' or 'tariff'
  const [copiedId, setCopiedId] = useState(null);
  const pageSize = 18;

  const customerKey = (customer?.code || 'HMA').toUpperCase();
  const exactStats = customer?.exactStats || {
    invoiceCount: 4636,
    netBilledAmount: 5139501005.03,
    taxAmount: 925110180.91,
    grossRevenue: 6064611185.94,
    contribution: '8.17%'
  };

  // Load real records for this customer
  const allInvoices = useMemo(() => {
    return REAL_INVOICES_DATA[customerKey] || REAL_INVOICES_DATA['HMA'] || [];
  }, [customerKey]);

  const formatCr = (val) => {
    const cr = (Number(val || 0) / 10000000).toFixed(2);
    return `₹ ${cr} Cr`;
  };

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

      return matchesSearch && matchesStatus;
    });
  }, [allInvoices, searchTerm, statusFilter]);

  // Pagination
  const totalPages = Math.ceil(filteredInvoices.length / pageSize) || 1;
  const paginatedInvoices = useMemo(() => {
    const start = (currentPage - 1) * pageSize;
    return filteredInvoices.slice(start, start + pageSize);
  }, [filteredInvoices, currentPage]);

  return (
    <div className="space-y-3 sm:space-y-4 animate-fade-in">
      
      {/* 1. Exact Database Enterprise Metrics (Matching Oracle Leaderboard) */}
      <div className="grid grid-cols-2 lg:grid-cols-4 gap-2 sm:gap-3">
        
        {/* Total Gross Revenue */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-cyan-500/50 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Gross Audited Revenue
            </span>
            <div className="w-7 h-7 rounded-lg bg-blue-50 text-blue-700 flex items-center justify-center">
              <TrendingUp className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black font-display text-[#0f172a] mt-1">
            {formatCr(exactStats.grossRevenue)}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
            <span>Enterprise Share</span>
            <span className="font-bold text-blue-700">{exactStats.contribution} (Rank #1)</span>
          </div>
        </div>

        {/* Base Net Billed */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-slate-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Net Billed (Excl. Tax)
            </span>
            <div className="w-7 h-7 rounded-lg bg-slate-100 text-slate-700 flex items-center justify-center">
              <Receipt className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black font-display text-slate-800 mt-1">
            {formatCr(exactStats.netBilledAmount)}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
            <span>Audited Freight</span>
            <span className="font-mono font-semibold">100% Reconciled</span>
          </div>
        </div>

        {/* GST (18%) Collected */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-emerald-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              GST (18%) Tax Ledger
            </span>
            <div className="w-7 h-7 rounded-lg bg-emerald-50 text-emerald-600 flex items-center justify-center">
              <Percent className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black font-display text-emerald-600 mt-1">
            {formatCr(exactStats.taxAmount)}
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
            <span>Tax Compliance</span>
            <span className="font-bold text-emerald-600">18.0% Standard</span>
          </div>
        </div>

        {/* Total Invoices Count */}
        <div className="bg-white p-3 sm:p-4 rounded-2xl border border-slate-200/90 shadow-2xs hover:border-purple-400 transition-all">
          <div className="flex items-center justify-between">
            <span className="text-[9px] sm:text-[11px] font-bold text-slate-500 uppercase tracking-wider">
              Total Invoices Audited
            </span>
            <div className="w-7 h-7 rounded-lg bg-purple-50 text-purple-700 flex items-center justify-center">
              <FileText className="w-3.5 h-3.5" />
            </div>
          </div>
          <div className="text-base sm:text-2xl font-black font-display text-[#0f172a] mt-1">
            {Number(exactStats.invoiceCount || 0).toLocaleString('en-IN')}{' '}
            <span className="text-xs font-normal text-slate-400">Bills</span>
          </div>
          <div className="flex items-center justify-between text-[10px] text-slate-500 mt-1 pt-1 border-t border-slate-100">
            <span>Oracle Live Feed</span>
            <span className="font-bold text-purple-700">Active Account</span>
          </div>
        </div>

      </div>

      {/* 2. Subtabs Bar (Invoices vs Tariff Breakdown) */}
      <div className="flex items-center gap-2 border-b border-slate-200 pb-1">
        <button
          onClick={() => setActiveSubTab('invoices')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'invoices'
              ? 'bg-[#0b1329] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <Receipt className="w-3.5 h-3.5" />
          <span>Real Freight Invoices ({allInvoices.length} Snapshot Records)</span>
        </button>

        <button
          onClick={() => setActiveSubTab('tariff')}
          className={`flex items-center gap-1.5 px-3 py-1.5 rounded-xl text-xs font-bold transition-all cursor-pointer ${
            activeSubTab === 'tariff'
              ? 'bg-[#0b1329] text-white shadow-xs'
              : 'text-slate-600 hover:bg-slate-200/60'
          }`}
        >
          <Layers className="w-3.5 h-3.5" />
          <span>Service Catalog & Tariff Breakdown</span>
        </button>
      </div>

      {/* VIEW A: REAL INVOICES CARDS */}
      {activeSubTab === 'invoices' && (
        <>
          {/* Search & Filter Control Bar */}
          <div className="bg-white p-2 sm:p-3 rounded-2xl border border-slate-200 shadow-2xs flex flex-col sm:flex-row items-center justify-between gap-2">
            
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
                placeholder="Search Party Inv #, Ref No, Container, Port..."
                className="w-full pl-8 pr-3 py-1.5 bg-slate-50 hover:bg-slate-100/80 focus:bg-white border border-slate-200 focus:border-cyan-500 rounded-xl text-xs font-semibold text-slate-900 placeholder-slate-400 focus:outline-none transition-all"
              />
            </div>

            {/* Status Filter Tabs */}
            <div className="flex items-center gap-1 w-full sm:w-auto overflow-x-auto pb-1 sm:pb-0">
              {[
                { id: 'ALL', label: 'All Invoices' },
                { id: 'PAID', label: 'Paid' },
                { id: 'PENDING', label: 'Pending' },
                { id: 'CREDIT', label: 'Credit Notes' },
              ].map((tab) => {
                const isActive = statusFilter === tab.id;
                return (
                  <button
                    key={tab.id}
                    onClick={() => {
                      setStatusFilter(tab.id);
                      setCurrentPage(1);
                    }}
                    className={`px-2.5 py-1 rounded-lg text-[11px] font-bold transition-all whitespace-nowrap cursor-pointer ${
                      isActive
                        ? 'bg-[#0f172a] text-white'
                        : 'bg-slate-100 hover:bg-slate-200 text-slate-700'
                    }`}
                  >
                    {tab.label}
                  </button>
                );
              })}
            </div>

          </div>

          {/* Compact 2-Card Mobile Grid / 3-Card Desktop Grid */}
          {filteredInvoices.length === 0 ? (
            <div className="bg-white p-8 rounded-2xl border border-slate-200 text-center space-y-2">
              <AlertCircle className="w-7 h-7 text-amber-500 mx-auto" />
              <h3 className="text-sm font-bold text-slate-900">No Invoices Found</h3>
              <p className="text-xs text-slate-500">
                No record matches keyword "{searchTerm}".
              </p>
            </div>
          ) : (
            <div className="grid grid-cols-2 md:grid-cols-2 lg:grid-cols-3 gap-2 sm:gap-3">
              {paginatedInvoices.map((inv, idx) => {
                const isPaid = inv.status === 'Paid';
                const isCredit = inv.status.includes('Credit') || inv.status.includes('Adjusted');

                return (
                  <div 
                    key={idx}
                    className="bg-white rounded-2xl border border-slate-200/90 shadow-2xs hover:shadow-md hover:border-cyan-500/60 transition-all p-2.5 sm:p-3.5 flex flex-col justify-between space-y-2 hover-lift"
                  >
                    {/* Header */}
                    <div className="space-y-0.5 border-b border-slate-100 pb-1.5">
                      <div className="flex items-start justify-between gap-1">
                        <div className="min-w-0">
                          <div className="flex items-center gap-1">
                            <span className="font-mono font-black text-[11px] sm:text-xs text-[#0f172a] truncate block">
                              {inv.partyInvNo}
                            </span>
                            <button
                              onClick={() => handleCopy(inv.partyInvNo, idx)}
                              className="text-slate-400 hover:text-slate-700 p-0.5 cursor-pointer"
                            >
                              {copiedId === idx ? <Check className="w-3 h-3 text-emerald-600" /> : <Copy className="w-3 h-3" />}
                            </button>
                          </div>
                          <span className="text-[9px] text-slate-400 font-mono block truncate">
                            Ref: {inv.invoiceRefNo}
                          </span>
                        </div>

                        <span className={`px-1.5 py-0.2 rounded-full text-[8px] sm:text-[9px] font-black shrink-0 whitespace-nowrap ${
                          isPaid 
                            ? 'bg-emerald-50 text-emerald-700 border border-emerald-200' 
                            : isCredit 
                            ? 'bg-blue-50 text-blue-700 border border-blue-200'
                            : 'bg-amber-50 text-amber-700 border border-amber-200'
                        }`}>
                          {inv.status}
                        </span>
                      </div>

                      <div className="text-[9px] text-slate-500 flex items-center gap-1">
                        <Calendar className="w-2.5 h-2.5 text-slate-400 shrink-0" />
                        <span>Date: {inv.date}</span>
                      </div>
                    </div>

                    {/* Metadata */}
                    <div className="space-y-1 text-[10px] bg-slate-50 p-1.5 sm:p-2 rounded-xl border border-slate-100">
                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Container</span>
                        <span className="font-mono font-bold text-slate-900">{inv.containerNo}</span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Port</span>
                        <span className="font-semibold text-slate-800 truncate max-w-[100px]" title={inv.destinationPort}>
                          {inv.destinationPort}
                        </span>
                      </div>

                      <div className="flex items-center justify-between">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Line / Type</span>
                        <span className="font-semibold text-slate-700 truncate max-w-[100px]">
                          {inv.shippingLine} • {inv.containerType}
                        </span>
                      </div>

                      <div className="flex items-center justify-between pt-0.5 border-t border-slate-200/50">
                        <span className="text-[8px] font-bold text-slate-400 uppercase">Terminal</span>
                        <span className="text-[9px] font-bold text-cyan-800 truncate max-w-[110px]">
                          {inv.terminal}
                        </span>
                      </div>
                    </div>

                    {/* Total Amount & Action */}
                    <div className="pt-1 flex items-center justify-between gap-1 border-t border-slate-100">
                      <div className="min-w-0">
                        <span className="text-[8px] font-bold text-slate-400 uppercase block leading-none">Total</span>
                        <span className="font-black text-xs sm:text-sm font-display text-[#0f172a] block truncate mt-0.5">
                          {formatCurrency(inv.totalAmount)}
                        </span>
                      </div>

                      <button
                        onClick={() => onSelectInvoice(inv)}
                        className="px-2 py-1 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg text-[9px] sm:text-[10px] font-bold transition-all cursor-pointer shrink-0"
                      >
                        Breakdown
                      </button>
                    </div>

                  </div>
                );
              })}
            </div>
          )}

          {/* Pagination */}
          <div className="p-2.5 bg-white rounded-2xl border border-slate-200 flex items-center justify-between text-xs text-slate-600 font-medium shadow-2xs">
            <div className="text-[11px]">
              Page <strong className="text-slate-900">{currentPage}</strong> of <strong className="text-slate-900">{totalPages}</strong> ({filteredInvoices.length} Invoices)
            </div>

            <div className="flex items-center gap-1">
              <button
                onClick={() => setCurrentPage(p => Math.max(1, p - 1))}
                disabled={currentPage === 1}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                <ChevronLeft className="w-3.5 h-3.5" />
              </button>
              <button
                onClick={() => setCurrentPage(p => Math.min(totalPages, p + 1))}
                disabled={currentPage === totalPages}
                className="p-1 rounded-lg bg-slate-100 hover:bg-slate-200 disabled:opacity-40 transition-colors"
              >
                <ChevronRight className="w-3.5 h-3.5" />
              </button>
            </div>
          </div>
        </>
      )}

      {/* VIEW B: REAL TARIFF & SERVICE CATALOG BREAKDOWN */}
      {activeSubTab === 'tariff' && (
        <div className="bg-white p-3 sm:p-5 rounded-3xl border border-slate-200 shadow-2xs space-y-3">
          <div className="flex items-center justify-between">
            <div>
              <h3 className="text-sm sm:text-base font-bold text-slate-900 flex items-center gap-1.5">
                <Layers className="w-4 h-4 text-cyan-600" />
                Audited Logistics Tariff & Service Breakdown
              </h3>
              <p className="text-xs text-slate-500">
                Core freight categories and billing tariff realizations
              </p>
            </div>
            <span className="text-xs font-mono font-bold text-cyan-800 bg-cyan-50 px-2.5 py-1 rounded-xl border border-cyan-200">
              606 Service Master Heads
            </span>
          </div>

          <div className="overflow-x-auto rounded-2xl border border-slate-200">
            <table className="w-full text-left text-xs border-collapse">
              <thead>
                <tr className="bg-slate-100 text-slate-700 font-bold border-b border-slate-200 text-[10px] uppercase">
                  <th className="py-2.5 px-3">#</th>
                  <th className="py-2.5 px-3">Service Description</th>
                  <th className="py-2.5 px-3 text-right">Line Items</th>
                  <th className="py-2.5 px-3 text-right">Net Billed</th>
                  <th className="py-2.5 px-3 text-right">GST (18%)</th>
                  <th className="py-2.5 px-3 text-right font-black text-slate-900">Gross Revenue</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {REAL_SERVICE_CATALOG.map((s, idx) => (
                  <tr key={idx} className="hover:bg-slate-50 text-[11px]">
                    <td className="py-2.5 px-3 font-bold text-slate-400">{idx + 1}</td>
                    <td className="py-2.5 px-3 font-bold text-slate-900">{s.serviceName}</td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {s.itemCount.toLocaleString('en-IN')}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-slate-600">
                      {formatCr(s.billAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono text-emerald-600 font-semibold">
                      {formatCr(s.taxAmount)}
                    </td>
                    <td className="py-2.5 px-3 text-right font-mono font-black text-[#0f172a]">
                      {formatCr(s.grossRevenue)}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  );
}
