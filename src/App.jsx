import React, { useState, useMemo } from 'react';
import CustomerLoginPage from './components/CustomerLoginPage';
import CustomerNavbar from './components/CustomerNavbar';
import InvoiceCardsView from './components/InvoiceCardsView';
import CustomerContainersView from './components/CustomerContainersView';
import CustomerProfileView from './components/CustomerProfileView';
import CustomerSupportView from './components/CustomerSupportView';
import InvoiceDetailModal from './components/InvoiceDetailModal';
import { CUSTOMER_ACCOUNTS } from './data/customerData';
import REAL_INVOICES_DATA from './data/realInvoices.json';

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
    return CUSTOMER_ACCOUNTS['HMA']; // Default initial demo client (HMA Agro Industries)
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
  const customerInvoices = REAL_INVOICES_DATA[customerCode] || REAL_INVOICES_DATA['HMA'] || [];

  // Generate live containers from real database records
  const customerContainers = customerInvoices.slice(0, 12).map((inv, idx) => ({
    contNo: inv.containerNo || `TEMU${500100 + idx}`,
    size: inv.containerSize || '40 FT',
    type: inv.containerType || 'REEFER (-18°C)',
    temp: inv.containerType.includes('REEFER') ? '-18.2°C' : 'Ambient',
    tempStatus: inv.containerType.includes('REEFER') ? 'Active Cold Chain Plugged' : 'Standard Stacking',
    sealNo: `SPJ-SEAL-${89400 + idx}`,
    bookingNo: `BK-${inv.jobNo || (250100 + idx)}`,
    jobOrderNo: `JO/${customerCode}/${inv.jobNo || (250100 + idx)}`,
    shippingLine: inv.shippingLine || 'COSCO',
    commodity: 'Frozen Cargo / Agro Export',
    origin: `${currentCustomer.name} Processing Plant`,
    terminal: inv.terminal || 'DADRI-ALLCARGO',
    destination: inv.destinationPort || 'Jebel Ali Port',
    status: inv.status === 'Paid' ? 'Dispatched to Gateway Port' : 'Yard Staging & Verification',
    inDate: inv.date,
    outDate: inv.status === 'Paid' ? inv.date : '-',
    eta: '2026-03-28 14:00',
    liveGPS: `${inv.terminal} Line #Bay-${(idx % 8) + 1}`,
    health: 'Optimal'
  }));

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans selection:bg-[#0284c7] selection:text-white">
      
      {/* Client Header Navbar with Prominent Executive Banner */}
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customer={currentCustomer}
        onLogout={handleLogout}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3 sm:space-y-5">
        
        {/* Dynamic View Router */}
        {activeTab === 'invoices' && (
          <InvoiceCardsView
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
      <footer className="border-t border-slate-200 py-5 bg-white text-center text-xs text-slate-500 mt-8">
        <div className="max-w-[1700px] mx-auto px-4 flex flex-col sm:flex-row items-center justify-between gap-2">
          <div className="flex items-center gap-2.5">
            <img 
              src="/logo.png" 
              alt="SPJ Logo" 
              className="h-5 w-auto object-contain" 
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span>© {new Date().getFullYear()} <strong>SPJ Group of Companies</strong> — Client Invoicing & Freight Gateway.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
            <span>Corporate Hub: Kalkaji, New Delhi</span>
            <span className="text-emerald-700 font-bold">● Active Oracle Session</span>
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
