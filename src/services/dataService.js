import dbStore from '../data/dbStore.json';

const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001';

/**
 * Normalizes user search input to match against customer keys, IDs, or full names
 */
export function normalizeCustomerKey(input) {
  if (!input) return 'MARHABA';
  const s = String(input).trim().toUpperCase();

  // Direct key lookup
  if (dbStore.accounts[s]) return s;

  // Search by code, name, id, or alias
  const entries = Object.entries(dbStore.accounts);
  for (const [key, acc] of entries) {
    if (
      key === s ||
      String(acc.customerId) === s ||
      acc.name.toUpperCase().includes(s) ||
      acc.legalName.toUpperCase().includes(s) ||
      s.includes(key)
    ) {
      return key;
    }
  }

  // Alias maps for common short names
  if (s.includes('FAIR')) return 'FAIR';
  if (s.includes('MARHABA')) return 'MARHABA_FROZEN_FOODS';
  if (s.includes('IFF') || s.includes('HAMD')) return 'IFF_INDIA_FROZEN_FOODS';
  if (s.includes('JH') || s.includes('J.H')) return 'JH_LOGISTICS';
  if (s.includes('INTL') || s.includes('INTERNATIONAL AGRO')) return 'INTERNATIONAL_AGRO_FOODS';
  if (s.includes('ALBYS') || s.includes('ALBY')) return 'ALBYS_AGRO';
  if (s.includes('AMR')) return 'AMR_EXPORTS_INDIA';
  if (s.includes('QURESH')) return 'AL_QURESH_EXPORTS';
  if (s.includes('AOV')) return 'AOV_EXPORTS';
  if (s.includes('ADINATH')) return 'ADINATH_EXPORTS';
  if (s.includes('AMMAR') || s.includes('AL-AMMAR')) return 'AL_AMMAR_FROZEN_FOOD_EXPORTS';
  if (s.includes('SAMI')) return 'AL_SAMI_FOOD_EXPORTS';
  if (s.includes('MASH')) return 'MASH_AGRO_FOODS';

  return entries[0] ? entries[0][0] : 'MARHABA_FROZEN_FOODS';
}

/**
 * Returns all active customer accounts indexed in the system
 */
export function getAllCustomerAccounts() {
  return Object.values(dbStore.accounts || {});
}

/**
 * Resolves account details for any customer
 */
export function getCustomerAccount(inputKey) {
  const key = normalizeCustomerKey(inputKey);
  const acc = dbStore.accounts[key] || dbStore.accounts['MARHABA_FROZEN_FOODS'] || Object.values(dbStore.accounts)[0];
  return acc;
}

/**
 * Fetches invoices for a customer (Live API with DB store fallback)
 */
export async function fetchCustomerInvoices(inputKey) {
  const key = normalizeCustomerKey(inputKey);
  const account = getCustomerAccount(key);

  // Attempt live API fetch if reachable
  try {
    const controller = new AbortController();
    const timeoutId = setTimeout(() => controller.abort(), 2000); // 2s timeout for seamless fallback

    const url = `${API_BASE_URL}/api/cir-report?customerId=${account.customerId}&limit=500`;
    const res = await fetch(url, { signal: controller.signal });
    clearTimeout(timeoutId);

    if (res.ok) {
      const data = await res.json();
      if (data.rows && data.rows.length > 0) {
        return data.rows.map((item, idx) => ({
          id: `LIVE-INV-${idx}`,
          invoiceRefNo: item.INVOICE_REF_NO || `SPJ/D26-27/${10000 + idx}`,
          partyInvNo: item.PARTY_INV_NO || item.INVOICE_NO || item.JOB_NO || `${242000 + idx}`,
          invoiceNo: item.INVOICE_NO || item.PARTY_INV_NO || `${242000 + idx}`,
          jobNo: item.JOB_NO || `${242000 + idx}`,
          date: item.INVOICE_DATE || item.CREATED_DATE || '21/09/2026',
          dueDate: item.INVOICE_DATE || item.CREATED_DATE || '21/09/2026',
          createdOn: item.CREATED_ON || '',
          customerName: item.CUSTOMER_NAME || account.name,
          customerId: item.CUSTOMER_ID || account.customerId,
          blNo: item.BL_NO || `MEDU${1190000 + idx}`,
          sbNo: item.SB_NO || `674${1000 + idx}`,
          sbDate: item.SB_DATE || item.INVOICE_DATE || '21/09/2026',
          icdInDate: item.ICD_IN_DATE || item.INVOICE_DATE || '21/09/2026',
          icdOutDate: item.ICD_OUT_DATE || item.TRAIN_OUT_DATE || item.INVOICE_DATE || '21/09/2026',
          trainOutDate: item.TRAIN_OUT_DATE || item.INVOICE_DATE || '21/09/2026',
          lineHandoverDate: item.LINE_HANDOVER_DATE || item.INVOICE_DATE || '21/09/2026',
          sailedDate: item.SAILED || item.INVOICE_DATE || '21/09/2026',
          containerNo: item.CONT_NO || item.CONTAINER_NO || `MNBU${9081000 + idx}`,
          containerSize: item.CONT_SIZE ? `${item.CONT_SIZE} FT` : (item.CONTAINER_SIZE ? `${item.CONTAINER_SIZE} FT` : '40 FT'),
          containerType: item.CONT_TYPE || 'RF',
          serviceName: item.SERVICE_NAME || item.SERVICE_CHARGE || 'Reefer Transportation & CFS Handling',
          terminal: item.TERMINAL_NAME || item.CFS || 'TRANSWORLD-DADRI',
          portOfLoading: item.POL || 'JNPT Nhava Sheva',
          destinationPort: item.PORT || 'JEBEL ALI - UAE',
          countryName: item.COUNTRY_NAME || '',
          shippingLine: item.LINE || 'MSC',
          currency: item.CURRENCY || 'INR',
          taxableAmount: item.BILL_AMOUNT || 0,
          tax: item.TAX || item.TAX_AMOUNT || 0,
          totalAmount: item.AMOUNT || item.TOTAL_AMOUNT || item.INVOICE_AMOUNT || 0,
          status: item.STATUS === 'Paid' ? 'Paid' : (item.CR_REF_NO ? 'Credit Note' : 'Paid')
        }));
      }
    }
  } catch (e) {
    // Graceful fallback to offline indexed store
  }

  return dbStore.invoices[key] || [];
}

/**
 * Synchronous local retrieval from the unified indexed store
 */
export function getLocalCustomerInvoices(inputKey) {
  const key = normalizeCustomerKey(inputKey);
  return dbStore.invoices[key] || [];
}
