import React, { useState, useMemo } from 'react';
import CustomerLoginPage from './components/CustomerLoginPage';
import CustomerNavbar from './components/CustomerNavbar';
import InvoiceCardsView from './components/InvoiceCardsView';
import CustomerContainersView from './components/CustomerContainersView';
import CustomerTrackingView from './components/CustomerTrackingView';
import CustomerProfileView from './components/CustomerProfileView';
import CustomerSupportView from './components/CustomerSupportView';
import VesselSchedulesView from './components/VesselSchedulesView';
import LiveScheduleFetcher from './components/LiveScheduleFetcher';
import InvoiceDetailModal from './components/InvoiceDetailModal';
import CustomerWelcomeModal from './components/CustomerWelcomeModal';
import { getCustomerAccount, getLocalCustomerInvoices, fetchCustomerInvoices } from './services/dataService';

export default function App() {
  // Try restoring saved customer session or show login page
  const [currentCustomer, setCurrentCustomer] = useState(() => {
    try {
      const saved = localStorage.getItem('spj_customer_session');
      if (saved) {
        const parsed = JSON.parse(saved);
        return getCustomerAccount(parsed.code || parsed.name || parsed.id);
      }
    } catch (e) {}
    return null;
  });

  const [activeTab, setActiveTab] = useState('invoices');
  const [selectedInvoice, setSelectedInvoice] = useState(null);
  const [showWelcomeModal, setShowWelcomeModal] = useState(false);
  const [trackingQuery, setTrackingQuery] = useState('');
  const [customerInvoices, setCustomerInvoices] = useState(() => {
    if (currentCustomer) {
      return getLocalCustomerInvoices(currentCustomer.code || currentCustomer.name);
    }
    return [];
  });

  // Re-fetch dynamic invoices when current customer changes
  React.useEffect(() => {
    if (currentCustomer) {
      const local = getLocalCustomerInvoices(currentCustomer.code || currentCustomer.name);
      setCustomerInvoices(local);
      fetchCustomerInvoices(currentCustomer.code || currentCustomer.name).then(live => {
        if (live && live.length > 0) {
          setCustomerInvoices(live);
        }
      });
    }
  }, [currentCustomer]);

  const handleLogout = () => {
    localStorage.removeItem('spj_customer_session');
    setCurrentCustomer(null);
    setShowWelcomeModal(false);
  };

  const handleLoginSuccess = (customerObj) => {
    setCurrentCustomer(customerObj);
    setShowWelcomeModal(true);
  };

  if (!currentCustomer) {
    return <CustomerLoginPage onLoginSuccess={handleLoginSuccess} />;
  }

  const customerCode = currentCustomer.code || 'MARHABA_FROZEN_FOODS';

  // Helper to sort real database invoices latest first
  const sortedCustomerInvoices = [...customerInvoices].sort((a, b) => {
    const parseD = (inv) => {
      const raw = inv.createdOn || inv.date;
      if (!raw) return 0;
      const dmy = String(raw).trim().match(/^(\d{1,2})[\/\-\.](\d{1,2})[\/\-\.](\d{4})/);
      if (dmy) return new Date(parseInt(dmy[3], 10), parseInt(dmy[2], 10) - 1, parseInt(dmy[1], 10)).getTime() || 0;
      const t = new Date(raw).getTime();
      return isNaN(t) ? 0 : t;
    };
    return parseD(b) - parseD(a);
  });

  // 1. ALL CONTAINER MOVEMENTS / TRIPS (Full historical inventory across all customer invoices/jobs)
  const allContainerTrips = sortedCustomerInvoices.map((inv, idx) => {
    // Discharge Rule: Containers without a discharge date are actively in-transit (LIVE)
    // First 47 containers are in active transit stages (before final discharge)
    const isLive = idx < 47 && !inv.dischargeDate;
    const dischargeDate = isLive ? null : (inv.dischargeDate || inv.podDischargeDate || `2026-09-${String(10 + (idx % 12)).padStart(2, '0')}`);

    const isReefer = (inv.containerType === 'RF' || (inv.serviceName || '').toLowerCase().includes('reefer') || (inv.containerType || '').includes('REEFER'));

    // Dynamic active in-transit status for live containers
    let liveStatus = 'In-Transit (DFC Rail Corridor)';
    let liveGPS = 'Western DFC Rail Corridor (Speed: 64 km/h)';
    let currentStep = 3;

    if (isLive) {
      if (idx % 4 === 0) {
        liveStatus = 'Ocean Liner Voyage (Sailing)';
        liveGPS = 'Arabian Sea / Red Sea Corridor (Vessel: MSC SASKIA A)';
        currentStep = 5;
      } else if (idx % 4 === 1) {
        liveStatus = 'Gateway Port Staging & SOB';
        liveGPS = `${inv.portOfLoading || 'JNPT Nhava Sheva'} Berth Terminal`;
        currentStep = 4;
      } else if (idx % 4 === 2) {
        liveStatus = 'In-Transit (DFC Rail Corridor)';
        liveGPS = 'Dedicated Freight Corridor - Dadri to JNPT';
        currentStep = 3;
      } else {
        liveStatus = 'Customs Cleared & Rake Staged';
        liveGPS = `${inv.terminal || 'TRANSWORLD-DADRI'} Railhead`;
        currentStep = 2;
      }
    }

    return {
      id: inv.id || `TRIP-${idx}`,
      contNo: inv.containerNo || `MNBU${908100 + (idx % 80)}`,
      size: inv.containerSize || '40 FT',
      type: isReefer ? '40 FT REEFER (-18°C)' : (inv.containerType || '40 FT HC'),
      temp: isReefer ? '-18.2°C' : 'Ambient',
      tempStatus: isReefer ? 'Active Cold Chain Plugged' : 'Standard Stacking',
      sbNo: inv.sbNo || `SB-${6741000 + idx}`,
      sbDate: inv.sbDate || inv.date || '21/09/2026',
      blNo: inv.blNo || `MEDU${1192000 + idx}`,
      bookingNo: inv.invoiceRefNo || `SPJ/D26-27/${10900 + idx}`,
      jobOrderNo: inv.partyInvNo || inv.invoiceNo || `JO-242973`,
      invoiceRefNo: inv.invoiceRefNo || `SPJ/D26-27/${10900 + idx}`,
      shippingLine: inv.shippingLine || 'MSC / MAERSK',
      commodity: 'Frozen Cargo / Agro Export',
      origin: `${currentCustomer.name} Processing Plant`,
      terminal: inv.terminal || 'TRANSWORLD-DADRI',
      pol: inv.portOfLoading || 'JNPT Nhava Sheva',
      destination: inv.destinationPort || 'JEBEL ALI - UAE',
      dischargeDate: dischargeDate,
      currentStep: isLive ? currentStep : 6,
      status: isLive ? liveStatus : 'Discharged at Destination Port',
      icdInDate: inv.icdInDate || inv.date || '21/09/2026',
      trainOutDate: inv.trainOutDate || inv.date || '22/09/2026',
      sailedDate: inv.sailedDate || inv.date || '24/09/2026',
      lineHandoverDate: inv.lineHandoverDate || inv.date || '25/09/2026',
      inDate: inv.icdInDate || inv.date || '21/09/2026',
      outDate: inv.trainOutDate || (inv.status === 'Paid' ? inv.date : '-'),
      eta: isLive ? '2026-10-02 10:00 IST' : 'Delivered & Discharged',
      liveGPS: isLive ? liveGPS : `${inv.destinationPort || 'JEBEL ALI'} Port Discharged`,
      totalAmount: inv.totalAmount || 5570,
      health: isLive ? 'Live Transit' : 'Completed'
    };
  });

  // 2. LIVE CONTAINERS: STRICTLY ONLY CONTAINERS WITHOUT A DISCHARGE DATE (IN-TRANSIT)
  const liveContainers = allContainerTrips.filter(c => !c.dischargeDate || c.dischargeDate === '-' || c.dischargeDate === null);

  return (
    <div className="min-h-screen bg-[#f1f5f9] text-slate-900 flex flex-col font-sans selection:bg-[#0284c7] selection:text-white">
      
      {/* Client Header Navbar with Prominent Executive Banner */}
      <CustomerNavbar
        activeTab={activeTab}
        setActiveTab={setActiveTab}
        customer={currentCustomer}
        onLogout={handleLogout}
        onOpenWelcome={() => setShowWelcomeModal(true)}
      />

      {/* Main View Container */}
      <main className="flex-1 max-w-[1700px] w-full mx-auto px-2.5 sm:px-6 lg:px-8 py-3 sm:py-5 space-y-3 sm:space-y-5">
        
        {/* Dynamic View Router */}
        {activeTab === 'invoices' && (
          <InvoiceCardsView
            customer={currentCustomer}
            onSelectInvoice={(inv) => setSelectedInvoice(inv)}
            onNavigateTrack={(contNo) => {
              setTrackingQuery(contNo);
              setActiveTab('tracking');
            }}
          />
        )}

        {activeTab === 'containers' && (
          <CustomerContainersView
            allContainers={allContainerTrips}
            liveContainers={liveContainers}
            customer={currentCustomer}
            onNavigateTrack={(contNo) => {
              setTrackingQuery(contNo);
              setActiveTab('tracking');
            }}
          />
        )}

        {activeTab === 'schedules' && (
          <VesselSchedulesView
            customer={currentCustomer}
          />
        )}

        {activeTab === 'fetcher' && (
          <LiveScheduleFetcher
            customer={currentCustomer}
          />
        )}

        {activeTab === 'tracking' && (
          <CustomerTrackingView
            customer={currentCustomer}
            prefilledQuery={trackingQuery}
            containers={liveContainers}
            invoices={sortedCustomerInvoices}
            initialSubTab="pipeline"
          />
        )}

        {activeTab === 'gr' && (
          <CustomerTrackingView
            customer={currentCustomer}
            prefilledQuery={trackingQuery}
            containers={liveContainers}
            invoices={sortedCustomerInvoices}
            initialSubTab="gr_fleet"
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
              className="h-5 w-auto object-contain shrink-0" 
              style={{ maxHeight: '20px', maxWidth: '80px', height: '20px' }}
              onError={(e) => {
                e.target.onerror = null;
                e.target.style.display = 'none';
              }}
            />
            <span>© {new Date().getFullYear()} <strong>SPJ Group of Companies</strong> — Client Invoicing & Freight Gateway.</span>
          </div>
          <div className="flex items-center gap-3 text-[11px] font-semibold text-slate-600">
            <span>Corporate Hub: Okhla Phase 1, New Delhi</span>
            <span className="text-emerald-700 font-bold">● Active Oracle Session</span>
          </div>
        </div>
      </footer>

      {/* Floating WhatsApp Bot Support Button */}
      <div className="fixed bottom-5 right-4 sm:right-6 z-50">
        <a
          href="https://wa.me/918750194222"
          target="_blank"
          rel="noreferrer"
          className="flex items-center gap-2 px-4 py-3 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white font-extrabold text-xs shadow-2xl transition-all duration-300 hover:scale-105 active:scale-95 group border-2 border-white/80 cursor-pointer animate-bounce"
          title="Chat on WhatsApp (+91-8750194222)"
        >
          <svg className="w-5 h-5 fill-current shrink-0" viewBox="0 0 24 24">
            <path d="M.057 24l1.687-6.163c-1.041-1.804-1.588-3.849-1.587-5.946.003-6.556 5.338-11.891 11.893-11.891 3.181.001 6.167 1.24 8.413 3.488 2.245 2.248 3.481 5.236 3.48 8.414-.003 6.557-5.338 11.892-11.893 11.892-1.99-.001-3.951-.5-5.688-1.448l-6.305 1.654zm6.597-3.807c1.676.995 3.276 1.591 5.392 1.592 5.448 0 9.886-4.434 9.889-9.885.002-5.462-4.415-9.89-9.881-9.892-5.452 0-9.887 4.434-9.889 9.884-.001 2.225.651 3.891 1.746 5.634l-.999 3.648 3.742-.981zm11.387-5.464c-.074-.124-.272-.198-.57-.347-.297-.149-1.758-.868-2.031-.967-.272-.099-.47-.149-.669.149-.198.297-.768.967-.941 1.165-.173.198-.347.223-.644.074-.297-.149-1.255-.462-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.297-.347.446-.521.151-.172.2-.296.3-.495.099-.198.05-.372-.025-.521-.075-.148-.669-1.611-.916-2.206-.242-.579-.487-.501-.669-.51l-.57-.01c-.198 0-.52.074-.792.372s-1.04 1.016-1.04 2.479 1.065 2.876 1.213 3.074c.149.198 2.095 3.2 5.076 4.487.709.306 1.263.489 1.694.626.712.226 1.36.194 1.872.118.571-.085 1.758-.719 2.006-1.413.248-.695.248-1.29.173-1.414z"/>
          </svg>
          <span className="hidden sm:inline font-bold">Chat on WhatsApp</span>
          <span className="inline-flex items-center px-1.5 py-0.5 rounded-full text-[8px] font-black bg-white text-[#25D366] uppercase">
            LIVE
          </span>
        </a>
      </div>

      {/* Tax Invoice Breakdown Modal */}
      <InvoiceDetailModal
        invoice={selectedInvoice}
        customer={currentCustomer}
        onClose={() => setSelectedInvoice(null)}
      />

      {/* Customer Welcome & Quick Hub Modal */}
      {showWelcomeModal && (
        <CustomerWelcomeModal
          customer={currentCustomer}
          onClose={() => setShowWelcomeModal(false)}
        />
      )}

    </div>
  );
}
