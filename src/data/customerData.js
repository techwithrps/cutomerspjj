// SPJ Global Client Portal Master Dataset & Real Database Statistics

export const CUSTOMER_ACCOUNTS = {
  'HMA': {
    id: 'CUST-1793',
    code: 'HMA',
    name: 'HMA AGRO INDUSTRIES LTD',
    legalName: 'HMA Agro Industries Limited',
    tagline: 'India\'s #1 Frozen Meat & Multimodal Cold Chain Exporter',
    rank: '#1 Key Enterprise Account',
    share: '8.17% of SPJ Total Enterprise Billing',
    gstin: '09AACCH0450J1ZQ',
    iec: '0508012489',
    pan: 'AACCH0450J',
    category: 'Tier-1 Enterprise Exporter',
    registeredAddress: '2/220, GL Complex, Delhi Gate, Agra, Uttar Pradesh - 282002',
    primaryHub: 'DADRI-ALLCARGO / TRANSWORLD-DADRI',
    activeTerminals: ['DADRI-ALLCARGO', 'DADRI-CMA-CGM', 'TRANSWORLD-DADRI', 'MUNDRA SEAPORT', 'NHAVA SHEVA (JNPT)'],
    contactPerson: 'Gulzar Ahmed / Shahnawaz Qureshi',
    designation: 'VP - Global Cold Logistics',
    email: 'exports@hmaagro.com',
    phone: '+91 98102 33491',
    relationshipManager: {
      name: 'Vikramaditya Chauhan',
      role: 'Sr. Key Account Director — SPJ Group',
      phone: '+91 98110 44290',
      email: 'v.chauhan@spjcargo.com',
      whatsapp: '+919811044290',
      office: 'SPJ Corporate Tower, Kalkaji, New Delhi'
    },
    // Exact figures from SPJ Oracle Database Leaderboard
    exactStats: {
      invoiceCount: 4647,
      netBilledAmount: 5139501005.03, // ₹ 513.95 Cr
      taxAmount: 925110180.91,       // ₹ 92.51 Cr
      grossRevenue: 6064611185.94,    // ₹ 606.46 Cr
      contribution: '8.17%',
      activeContainersCount: 148,
      onTimeDeliveryRate: '99.4%'
    }
  },
  'INTL': {
    id: 'CUST-1845',
    code: 'INTL',
    name: 'INTERNATIONAL AGRO FOODS',
    legalName: 'International Agro Foods Pvt Ltd',
    tagline: 'Global Agro Export & Livestock Supply Chain',
    rank: '#2 Key Enterprise Account',
    share: '7.85% of SPJ Total Enterprise Billing',
    gstin: '09AACFI2693D1ZF',
    iec: '0599001422',
    pan: 'AACFI2693D',
    category: 'Tier-1 Enterprise Exporter',
    registeredAddress: 'Industrial Area, Ghaziabad, Uttar Pradesh - 201001',
    primaryHub: 'DADRI-ALLCARGO',
    activeTerminals: ['DADRI-ALLCARGO', 'DADRI-CONCOR', 'NHAVA SHEVA (JNPT)'],
    contactPerson: 'Mohd. Tariq',
    designation: 'Head of Freight & Marine Operations',
    email: 'logistics@internationalagro.com',
    phone: '+91 120 410 8822',
    relationshipManager: {
      name: 'Vikramaditya Chauhan',
      role: 'Sr. Key Account Director — SPJ Group',
      phone: '+91 98110 44290',
      email: 'v.chauhan@spjcargo.com',
      whatsapp: '+919811044290',
      office: 'SPJ Corporate Tower, Kalkaji, New Delhi'
    },
    exactStats: {
      invoiceCount: 6650,
      netBilledAmount: 4957130521.90, // ₹ 495.71 Cr
      taxAmount: 892283493.94,
      grossRevenue: 5849414015.84,
      contribution: '7.88%',
      activeContainersCount: 182,
      onTimeDeliveryRate: '99.2%'
    }
  },
  'RUSTAM': {
    id: 'CUST-1847',
    code: 'RUSTAM',
    name: 'RUSTAM FOODS PVT LTD',
    legalName: 'Rustam Foods Private Limited',
    tagline: 'Premium Quality Frozen Meat & Cold Storage Exporters',
    rank: '#3 Key Enterprise Account',
    share: '7.16% of SPJ Total Enterprise Billing',
    gstin: '09AADCR4401N1Z8',
    iec: '0505008812',
    pan: 'AADCR4401N',
    category: 'Tier-1 Enterprise Exporter',
    registeredAddress: 'Industrial Area, Site-2, Unnao, Uttar Pradesh - 209801',
    primaryHub: 'KANPUR-ALLCARGO / DADRI',
    activeTerminals: ['KANPUR-ALLCARGO', 'DADRI-ALLCARGO', 'MUNDRA SEAPORT'],
    contactPerson: 'Rustam Qureshi / Saleem Akhtar',
    designation: 'Managing Director & Supply Head',
    email: 'contact@rustamfoods.com',
    phone: '+91 515 282 0451',
    relationshipManager: {
      name: 'Rohit Verma',
      role: 'Key Account Manager — UP Central',
      phone: '+91 98110 44292',
      email: 'r.verma@spjcargo.com',
      whatsapp: '+919811044292',
      office: 'SPJ Hub, Panki, Kanpur'
    },
    exactStats: {
      invoiceCount: 6890,
      netBilledAmount: 4506574085.37, // ₹ 450.66 Cr
      taxAmount: 811183335.37,
      grossRevenue: 5317757420.74,
      contribution: '7.16%',
      activeContainersCount: 124,
      onTimeDeliveryRate: '98.9%'
    }
  },
  'ALAMMAR': {
    id: 'CUST-1840',
    code: 'ALAMMAR',
    name: 'AL AMMAR FROZEN FOODS',
    legalName: 'Al Ammar Frozen Foods Exports Pvt Ltd',
    tagline: 'Leading Agro Exporters & Temperature Controlled Logistics',
    rank: '#4 Key Enterprise Account',
    share: '7.16% of SPJ Total Enterprise Billing',
    gstin: '09AAMCA6593K1ZX',
    iec: '0597003112',
    pan: 'AAMCA6593K',
    category: 'Tier-1 Enterprise Exporter',
    registeredAddress: 'Gate No 38-40, Al Ammar Village, Amarpur Kondla, Aligarh, Uttar Pradesh - 202001',
    primaryHub: 'DADRI-ALLCARGO / ALIGARH',
    activeTerminals: ['DADRI-ALLCARGO', 'DADRI-CONCOR', 'NHAVA SHEVA (JNPT)'],
    contactPerson: 'Harish Ahmed / Zubair Khan',
    designation: 'Director of Logistics & Cold Chain',
    email: 'alammar@alammarfoods.com',
    phone: '+91 98714 88001',
    relationshipManager: {
      name: 'Vikramaditya Chauhan',
      role: 'Sr. Key Account Director — SPJ Group',
      phone: '+91 98110 44290',
      email: 'v.chauhan@spjcargo.com',
      whatsapp: '+919811044290',
      office: 'SPJ Corporate Tower, Kalkaji, New Delhi'
    },
    exactStats: {
      invoiceCount: 7725,
      netBilledAmount: 4505083965.13, // ₹ 450.51 Cr
      taxAmount: 810915113.72,
      grossRevenue: 5315999078.85,
      contribution: '7.16%',
      activeContainersCount: 165,
      onTimeDeliveryRate: '99.5%'
    }
  },
  'FAIR': {
    id: 'CUST-1827',
    code: 'FAIR',
    name: 'FAIR EXPORTS (INDIA) PVT LTD',
    legalName: 'Fair Exports (India) Private Limited',
    tagline: 'Lulu Group International Flagship Export Partner',
    rank: '#5 Key Enterprise Account',
    share: '7.11% of SPJ Total Enterprise Billing',
    gstin: '09AAACF3799A1ZN',
    iec: '0588004521',
    pan: 'AAACF3799A',
    category: 'Tier-1 Enterprise Exporter',
    registeredAddress: 'National Highway 24, Rampur / Bareilly Road, Uttar Pradesh',
    primaryHub: 'DADRI-ALLCARGO / MUMBAI',
    activeTerminals: ['DADRI-ALLCARGO', 'MUNDRA SEAPORT', 'NHAVA SHEVA (JNPT)'],
    contactPerson: 'M. K. Yousuf / Rajesh Pillai',
    designation: 'General Manager - Shipping & Marine Freight',
    email: 'shipping@fairexports.net',
    phone: '+91 22 2683 8800',
    relationshipManager: {
      name: 'Pooja Nair',
      role: 'Key Account Lead — Western & Northern Corridor',
      phone: '+91 98110 44295',
      email: 'p.nair@spjcargo.com',
      whatsapp: '+919811044295',
      office: 'SPJ Seaport Wing, Nhava Sheva, Navi Mumbai'
    },
    exactStats: {
      invoiceCount: 17558,
      netBilledAmount: 4474045779.43, // ₹ 447.40 Cr
      taxAmount: 805328240.30,
      grossRevenue: 5279374019.73,
      contribution: '7.11%',
      activeContainersCount: 210,
      onTimeDeliveryRate: '99.6%'
    }
  }
};

// Real Tariff breakdown catalog from SPJ Database
export const REAL_SERVICE_CATALOG = [
  { serviceName: 'Ocean Freight Charges', itemCount: 74698, billAmount: 21880306465.32, taxAmount: 3938455163.76, grossRevenue: 25818761629.08 },
  { serviceName: 'Line THC And Repo Charges', itemCount: 39851, billAmount: 2978203334.26, taxAmount: 536076600.17, grossRevenue: 3514279934.43 },
  { serviceName: 'Inland Haulage Charges (Liner)', itemCount: 11663, billAmount: 1991754563.28, taxAmount: 358515821.39, grossRevenue: 2350270384.67 },
  { serviceName: 'Transportation Charges', itemCount: 56445, billAmount: 1650133705.00, taxAmount: 297024066.90, grossRevenue: 1947157771.90 },
  { serviceName: 'Line THC And Repo Charges - INR', itemCount: 15093, billAmount: 1064082838.06, taxAmount: 191534910.85, grossRevenue: 1255617748.91 },
  { serviceName: 'Line THC Charges', itemCount: 20002, billAmount: 703871192.12, taxAmount: 126696814.58, grossRevenue: 830568006.70 },
  { serviceName: 'Detention Charges', itemCount: 130940, billAmount: 569174451.42, taxAmount: 102451401.26, grossRevenue: 671625852.68 },
  { serviceName: 'VDS on 40\' Reefer Export Loaded Container', itemCount: 129, billAmount: 556137540.00, taxAmount: 100104757.20, grossRevenue: 656242297.20 },
  { serviceName: 'Agency Charges', itemCount: 73983, billAmount: 418461453.38, taxAmount: 75323061.61, grossRevenue: 493784514.99 },
  { serviceName: 'Rail Freight Charges', itemCount: 4453, billAmount: 416200000.00, taxAmount: 74916000.00, grossRevenue: 491116000.00 }
];
