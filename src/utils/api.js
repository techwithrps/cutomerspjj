// API Client for SPJ Customer Portal connecting to Live Enterprise Backend

const API_BASE = import.meta.env.VITE_API_URL || 'https://spj-mauve.vercel.app/api';

export const getAuthToken = () => {
  try {
    return localStorage.getItem('spj_customer_jwt') || localStorage.getItem('spj_auth_token');
  } catch {
    return null;
  }
};

export const setAuthToken = (token) => {
  try {
    if (token) {
      localStorage.setItem('spj_customer_jwt', token);
    } else {
      localStorage.removeItem('spj_customer_jwt');
    }
  } catch (e) {
    console.error('Error saving auth token:', e);
  }
};

export async function authFetch(endpoint, options = {}) {
  const token = getAuthToken();
  const headers = {
    'Content-Type': 'application/json',
    ...(token ? { 'Authorization': `Bearer ${token}` } : {}),
    ...(options.headers || {})
  };

  const url = endpoint.startsWith('http') ? endpoint : `${API_BASE}${endpoint.startsWith('/') ? '' : '/'}${endpoint}`;
  
  try {
    const res = await fetch(url, {
      ...options,
      headers
    });
    return res;
  } catch (err) {
    console.error(`[Customer API] Network error on ${url}:`, err.message);
    throw err;
  }
}
