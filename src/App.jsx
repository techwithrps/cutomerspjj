import React, { useState, useEffect } from 'react';
import CustomerLoginPage from './components/CustomerLoginPage';
import CustomerNavbar from './components/CustomerNavbar';
import InvoiceCardsView from './components/InvoiceCardsView';
import CustomerContainersView from './components/CustomerContainersView';
import CustomerProfileView from './components/CustomerProfileView';
import CustomerSupportView from './components/CustomerSupportView';
import InvoiceDetailModal from './components/InvoiceDetailModal';
import { 
  CUSTOMER_ACCOUNTS, 
  CUSTOMER_INVOICES, 
  CUSTOMER_CONTAINERS 
} from './data/customerData';
import { 
  Building2, 
  ShieldCheck, 
  MapPin, 
  Receipt, 
  Container, 
  Globe2,
  Sparkles,
  PhoneCall
} from 'lucide-react';

export default function App() {
  // Try restoring saved customer session or default to HMA
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('spj_customer_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return CUSTOMER_ACCOUNTS[parsed.code] || CUSTOMER_ACCOUNTS['HMA'];
      }
    } catch (e) {}
    return CUSTOMER_ACCOUNTS['HMA']; // Default initial demo client
  });

  const [activeTab, setActiveTab] = useState('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState(null);

  const handleLogout = () => {
    localStorage.removeItem('spj_customer_session');
    setCurrentCustomer(null);
  };

  if (!currentCustomer) {
    return <CustomerLoginPage onLoginSuccess={(c) => setCurrentCustomer(c)} />;
  }

  const customerCode = currentCustomer.code || 'HMA';
  const customerInvoices = CUSTOMER_INVOICES[customerCode] || [];
  const customerContainers = CUSTOMER_CONTAINERS[customerCode] || [];

  return (
    <div className="min-h-screen bg-[#f8fafc] text-slate-900 flex flex-col font-sans selection:bg-[#ff6a00] selection:text-white">
      
      {/* Client Header Navbar */}
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customer={currentCustomer}
        onLogout={handleLogout}
      />

      {/* Verified Shipper Strip */}
      <div className="bg-[#150f2e] text-white py-1.5 px-3 border-b border-purple-900/50 text-[11px] overflow-x-auto whitespace-nowrap">
        <div className="max-w-[1700px] mx-auto flex items-center justify-between gap-4">
          <div className="flex items-center gap-2">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span className="font-bold text-slate-200">Authenticated Enterprise Shipper:</span>
            <span className="text-amber-400 font-extrabold font-display">{currentCustomer.name}</span>
            <span className="text-purple-300 font-mono">({currentCustomer.code})</span>
          </div>

          <div className="hidden sm:flex items-center gap-4 text-slate-300 font-medium text-[10px]">
            <span className="flex items-center gap-1">
              <MapPin className="w-3 h-3 text-orange-400" />
              Primary Hub: <strong>{currentCustomer.primaryHub}</strong>
            </span>
            <span>•</span>
            <span>GST: <strong>{currentCustomer.gstin}</strong></span>
            <span>•</span>
            <span className="text-emerald-300 font-bold">256-Bit SSL Encrypted Connection</span>
          </div>
        </div>
      </div>

      {/* Main Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-3 sm:px-6 lg:px-8 py-4 sm:py-6 space-y-4 sm:space-y-6">
        
        {/* Dynamic View Router */}
        {activeTab === 'invoices' && (
          <InvoiceCardsView
            invoices={customerInvoices}
            customer={currentCustomer}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
          />
        )}

        {activeTab === 'containers' && (
          <CustomerContainersView
            containers={customerContainers}
            customer={currentCustomer}
          />
        )}

        {activeTab === 'profile' && (
          <CustomerProfileView
            customer={currentCustomer}
          />
        )}

        {activeTab === 'support' && (
          <CustomerSupportView
            customer={currentCustomer}
          />
        )}

      </main>

      {/* Modern Client Footer */}
      <footer className="border-t border-slate-200 py-6 bg-white text-center text-xs text-slate-500 mt-12">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-3">
          <div className="flex items-center gap-3">
            <img 
              src="/logo.png" 
              alt="SPJ Logo" 
              className="h-6 w-auto object-contain" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span>© {new Date().getFullYear()} <strong>SPJ Group of Companies</strong> — Client Invoicing & Cargo Gateway.</span>
          </div>
          <div className="flex items-center gap-4 text-xs font-semibold text-slate-600">
            <span>Corporate Office: Kalkaji, New Delhi</span>
            <span className="text-emerald-700 font-bold">● Active Client Portal Session</span>
          </div>
        </div>
      </footer>

      {/* Tax Invoice Breakdown Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        customer={currentCustomer}
        onClose={() => setSelectedInvoice(null)}
      />

    </div>
  );
}
