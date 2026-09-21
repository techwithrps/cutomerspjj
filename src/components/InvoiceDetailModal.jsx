import React from 'react';
import { 
  X, 
  Printer, 
  Download, 
  Receipt, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
  ShieldCheck, 
  MapPin, 
  Container,
  FileCheck2
} from 'lucide-react';

export default function InvoiceDetailModal({ invoice, customer, onClose }) {
  if (!invoice) return null;

  const formatCurrency = (val) => {
    return '₹ ' + Number(val || 0).toLocaleString('en-IN', { minimumFractionDigits: 2 });
  };

  const isPaid = invoice.status === 'Paid';

  const handlePrint = () => {
    window.print();
  };

  return (
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/60 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-3xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in">
        
        {/* Modal Top Bar */}
        <div className="bg-gradient-to-r from-slate-900 via-[#1e133d] to-[#2b1f55] p-4 sm:p-6 text-white flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-white/10 border border-white/20 flex items-center justify-center font-black text-amber-400">
              <Receipt className="w-5 h-5" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-base sm:text-lg font-black font-display text-white">
                  Tax Invoice Statement
                </h3>
                <span className={`px-2 py-0.5 rounded-full text-[10px] font-black ${
                  isPaid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-xs text-purple-200 font-mono mt-0.5">
                {invoice.invoiceNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Tax Invoice"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Modal"
              className="p-2 rounded-xl bg-white/10 hover:bg-white/20 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body Content */}
        <div className="p-4 sm:p-6 space-y-6 max-h-[75vh] overflow-y-auto">
          
          {/* Header B2B Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4 pb-4 border-b border-slate-200 text-xs">
            {/* SPJ Group (Billed By) */}
            <div className="bg-slate-50 p-3.5 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[10px] font-bold text-slate-400 uppercase tracking-wider block">Service Provider (SPJ Group)</span>
              <span className="font-extrabold text-slate-900 block text-sm">SPJ Cargo & Logistics Pvt. Ltd.</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                E-6, Third Floor, Kalkaji, New Delhi - 110019<br />
                <strong>GSTIN:</strong> 07AAACS9821K1ZB | <strong>PAN:</strong> AAACS9821K<br />
                <strong>Billing Hub:</strong> {invoice.terminal}
              </p>
            </div>

            {/* Billed To (Customer) */}
            <div className="bg-purple-50/50 p-3.5 rounded-2xl border border-purple-100 space-y-1">
              <span className="text-[10px] font-bold text-purple-700 uppercase tracking-wider block">Billed To (Client)</span>
              <span className="font-extrabold text-slate-900 block text-sm">{customer?.name || 'Valued Client'}</span>
              <p className="text-slate-600 text-[11px] leading-relaxed">
                {customer?.registeredAddress || 'Corporate Address'}<br />
                <strong>GSTIN:</strong> {customer?.gstin || '-'} | <strong>IEC:</strong> {customer?.iec || '-'}<br />
                <strong>Job Order:</strong> {invoice.jobOrderNo} | <strong>Booking:</strong> {invoice.bookingNo}
              </p>
            </div>
          </div>

          {/* Shipment Meta Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2.5 text-xs bg-slate-50 p-3 rounded-2xl border border-slate-100">
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Invoice Date</span>
              <span className="font-bold text-slate-800">{invoice.date}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Payment Due</span>
              <span className="font-bold text-slate-800">{invoice.dueDate}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Shipping Line</span>
              <span className="font-bold text-slate-800">{invoice.shippingLine}</span>
            </div>
            <div>
              <span className="text-[10px] font-bold text-slate-400 uppercase block">Destination Port</span>
              <span className="font-bold text-slate-800">{invoice.destinationPort}</span>
            </div>
          </div>

          {/* Itemized Charges Table */}
          <div className="border border-slate-200 rounded-2xl overflow-hidden">
            <div className="bg-slate-100 px-4 py-2 text-xs font-bold text-slate-700 uppercase tracking-wider">
              Itemized Multimodal Cargo Charges
            </div>
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-50 border-b border-slate-200 text-slate-600 font-semibold">
                <tr>
                  <th className="p-3">#</th>
                  <th className="p-3">Description of Freight Service</th>
                  <th className="p-3 text-center">Qty</th>
                  <th className="p-3 text-right">Unit Rate</th>
                  <th className="p-3 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                {(invoice.chargesBreakdown || []).map((item, idx) => (
                  <tr key={idx} className="hover:bg-slate-50">
                    <td className="p-3 font-mono text-slate-400">{idx + 1}</td>
                    <td className="p-3 font-medium text-slate-800">{item.desc}</td>
                    <td className="p-3 text-center font-semibold text-slate-700">{item.qty}</td>
                    <td className="p-3 text-right font-mono text-slate-600">{formatCurrency(item.rate)}</td>
                    <td className="p-3 text-right font-mono font-bold text-slate-900">{formatCurrency(item.amount)}</td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>

          {/* Calculation Summary */}
          <div className="flex flex-col sm:flex-row justify-between items-start gap-4 pt-2">
            <div className="text-xs text-slate-500 space-y-1">
              <span className="font-bold text-slate-700 block">Associated Container Numbers:</span>
              <div className="flex items-center gap-1.5 flex-wrap">
                {(invoice.containerNumbers || []).map((c, i) => (
                  <span key={i} className="font-mono text-[11px] bg-slate-100 px-2 py-0.5 rounded border border-slate-200 font-semibold">
                    {c}
                  </span>
                ))}
              </div>
            </div>

            <div className="w-full sm:w-72 bg-slate-50 p-4 rounded-2xl border border-slate-200 space-y-2 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Amount:</span>
                <span className="font-mono font-bold">{formatCurrency(invoice.taxableAmount)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>CGST (9%):</span>
                <span className="font-mono">{formatCurrency(invoice.cgst)}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>SGST (9%):</span>
                <span className="font-mono">{formatCurrency(invoice.sgst)}</span>
              </div>
              <div className="pt-2 border-t border-slate-200 flex justify-between text-sm font-black text-[#2b1f55]">
                <span>Grand Total:</span>
                <span className="font-mono text-base text-[#ff6a00]">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-4 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[11px] text-slate-500 flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            Digitally generated by SPJ Enterprise Cloud
          </span>
          <button
            onClick={onClose}
            className="px-4 py-2 bg-[#2b1f55] hover:bg-[#3b2b73] text-white rounded-xl text-xs font-bold transition-all cursor-pointer"
          >
            Close Window
          </button>
        </div>

      </div>
    </div>
  );
}
