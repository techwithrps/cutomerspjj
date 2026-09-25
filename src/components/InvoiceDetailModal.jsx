import React from 'react';
import { 
  X, 
  Printer, 
  Receipt, 
  Building2, 
  Calendar, 
  CheckCircle2, 
  Clock, 
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
    <div className="fixed inset-0 z-50 overflow-y-auto bg-slate-950/70 backdrop-blur-xs flex items-center justify-center p-3 sm:p-6 animate-fade-in">
      <div className="bg-white w-full max-w-2xl rounded-3xl shadow-2xl border border-slate-200 overflow-hidden my-auto animate-scale-in">
        
        {/* Modal Top Bar */}
        <div className="bg-[#0b1329] p-4 sm:p-5 text-white flex items-center justify-between border-b border-slate-800">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-cyan-500/20 border border-cyan-500/30 flex items-center justify-center font-black text-cyan-300">
              <Receipt className="w-4 h-4" />
            </div>
            <div>
              <div className="flex items-center gap-2">
                <h3 className="text-sm sm:text-base font-black font-display text-white">
                  Tax Invoice Statement
                </h3>
                <span className={`px-2 py-0.2 rounded-full text-[9px] font-black ${
                  isPaid ? 'bg-emerald-500/20 text-emerald-300 border border-emerald-500/30' : 'bg-amber-500/20 text-amber-300 border border-amber-500/30'
                }`}>
                  {invoice.status}
                </span>
              </div>
              <p className="text-[11px] text-cyan-300 font-mono mt-0.5">
                {invoice.invoiceRefNo || invoice.partyInvNo}
              </p>
            </div>
          </div>

          <div className="flex items-center gap-2">
            <button
              onClick={handlePrint}
              title="Print Tax Invoice"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <Printer className="w-4 h-4" />
            </button>
            <button
              onClick={onClose}
              title="Close Modal"
              className="p-1.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-slate-200 hover:text-white transition-colors cursor-pointer"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Invoice Body Content */}
        <div className="p-4 sm:p-5 space-y-4 max-h-[75vh] overflow-y-auto">
          
          {/* Header B2B Grid */}
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3 pb-3 border-b border-slate-200 text-xs">
            {/* SPJ Group (Billed By) */}
            <div className="bg-slate-50 p-3 rounded-2xl border border-slate-100 space-y-1">
              <span className="text-[9px] font-bold text-slate-400 uppercase tracking-wider block">Service Provider</span>
              <span className="font-extrabold text-slate-900 block text-xs">SPJ Cargo & Logistics Pvt. Ltd.</span>
              <p className="text-slate-600 text-[10px] leading-relaxed">
                E-6, Third Floor, Kalkaji, New Delhi - 110019<br />
                <strong>GSTIN:</strong> 07AAACS9821K1ZB | <strong>Hub:</strong> {invoice.terminal}
              </p>
            </div>

            {/* Billed To (Customer) */}
            <div className="bg-cyan-50/40 p-3 rounded-2xl border border-cyan-100 space-y-1">
              <span className="text-[9px] font-bold text-cyan-800 uppercase tracking-wider block">Billed To (Client)</span>
              <span className="font-extrabold text-slate-900 block text-xs">{customer?.name || invoice.customerName}</span>
              <p className="text-slate-600 text-[10px] leading-relaxed">
                <strong>Party Inv:</strong> {invoice.partyInvNo}<br />
                <strong>Job No:</strong> {invoice.jobNo} | <strong>BL No:</strong> {invoice.blNo}
              </p>
            </div>
          </div>

          {/* Shipment Meta Details */}
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-2 text-xs bg-slate-50 p-2.5 rounded-xl border border-slate-100">
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Invoice Date</span>
              <span className="font-bold text-slate-800 text-[11px]">{invoice.date}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Container No</span>
              <span className="font-mono font-bold text-slate-800 text-[11px]">{invoice.containerNo}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Shipping Line</span>
              <span className="font-bold text-slate-800 text-[11px]">{invoice.shippingLine}</span>
            </div>
            <div>
              <span className="text-[9px] font-bold text-slate-400 uppercase block">Destination Port</span>
              <span className="font-bold text-slate-800 text-[11px] truncate block">{invoice.destinationPort}</span>
            </div>
          </div>

          {/* Charges Table */}
          <div className="border border-slate-200 rounded-xl overflow-hidden">
            <table className="w-full text-left text-xs">
              <thead className="bg-slate-100 border-b border-slate-200 text-slate-700 font-bold text-[10px] uppercase">
                <tr>
                  <th className="p-2.5">Service Description</th>
                  <th className="p-2.5 text-center">Type</th>
                  <th className="p-2.5 text-right">Taxable (₹)</th>
                  <th className="p-2.5 text-right">GST / Tax</th>
                  <th className="p-2.5 text-right">Total (₹)</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-slate-100">
                <tr className="hover:bg-slate-50">
                  <td className="p-2.5 font-medium text-slate-800 text-[11px]">
                    {invoice.serviceName || 'Multimodal Cargo Freight & Yard Handling'}
                  </td>
                  <td className="p-2.5 text-center text-slate-600 text-[11px]">{invoice.containerType || '40 FT RF'}</td>
                  <td className="p-2.5 text-right font-mono text-slate-700 text-[11px]">{formatCurrency(invoice.taxableAmount || invoice.billAmount || (invoice.totalAmount / 1.18))}</td>
                  <td className="p-2.5 text-right font-mono text-slate-700 text-[11px]">{formatCurrency(invoice.tax || invoice.taxAmount || (invoice.totalAmount - (invoice.totalAmount / 1.18)))}</td>
                  <td className="p-2.5 text-right font-mono font-bold text-slate-900 text-[11px]">{formatCurrency(invoice.totalAmount)}</td>
                </tr>
              </tbody>
            </table>
          </div>

          {/* Grand Total Bar */}
          <div className="flex justify-end pt-1">
            <div className="w-full sm:w-64 bg-slate-50 p-3 rounded-xl border border-slate-200 space-y-1.5 text-xs">
              <div className="flex justify-between text-slate-600">
                <span>Taxable Value:</span>
                <span className="font-mono font-bold">{formatCurrency(invoice.taxableAmount || invoice.billAmount || (invoice.totalAmount / 1.18))}</span>
              </div>
              <div className="flex justify-between text-slate-600">
                <span>Total GST / Tax:</span>
                <span className="font-mono">{formatCurrency(invoice.tax || invoice.taxAmount || (invoice.totalAmount - (invoice.totalAmount / 1.18)))}</span>
              </div>
              <div className="pt-1.5 border-t border-slate-200 flex justify-between text-xs font-black text-[#0f172a]">
                <span>Grand Total:</span>
                <span className="font-mono text-sm text-[#0284c7]">{formatCurrency(invoice.totalAmount)}</span>
              </div>
            </div>
          </div>

        </div>

        {/* Modal Footer */}
        <div className="bg-slate-50 p-3 border-t border-slate-200 flex items-center justify-between">
          <span className="text-[10px] text-slate-500 flex items-center gap-1">
            <FileCheck2 className="w-3.5 h-3.5 text-emerald-600" />
            Verified by SPJ Oracle ERP Cloud
          </span>
          <button
            onClick={onClose}
            className="px-3 py-1.5 bg-[#0f172a] hover:bg-slate-800 text-white rounded-lg text-xs font-bold transition-all cursor-pointer"
          >
            Close
          </button>
        </div>

      </div>
    </div>
  );
}
