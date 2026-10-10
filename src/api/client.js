// Tiny API client. Works with both backends (Node/Express and FastAPI) – they share the same API.
// Set VITE_API_URL (e.g. https://api.yourshop.com/api) for production; in dev the Vite proxy handles "/api".
import { getItem, setItem, removeItem } from '../lib/storage.js';

const BASE = import.meta.env.VITE_API_URL || '/api';
const TOKEN_KEY = 'sozokyu_token';

const getToken = () => getItem(TOKEN_KEY);
export const setToken = (t) => (t ? setItem(TOKEN_KEY, t) : removeItem(TOKEN_KEY));

export class ApiError extends Error {
  constructor(status, detail, unavailable = false) {
    super(detail);
    this.status = status;
    this.detail = detail;
    this.unavailable = unavailable; // true when the server can't be reached at all
  }
}

async function request(path, { method = 'GET', body, auth = false } = {}) {
  const headers = {};
  if (body !== undefined) headers['Content-Type'] = 'application/json';
  const token = getToken();
  if (auth && token) headers.Authorization = `Bearer ${token}`;

  let res;
  try {
    res = await fetch(`${BASE}${path}`, { method, headers, body: body === undefined ? undefined : JSON.stringify(body) });
  } catch {
    throw new ApiError(0, 'Server unreachable', true);
  }

  let data = null;
  try { data = await res.json(); } catch {
    // our API always answers with JSON – anything else (a 404 page, index.html, a proxy error) means "no backend here"
    throw new ApiError(res.status, 'Server unavailable', true);
  }
  if (!res.ok) {
    const detail = data && typeof data.detail === 'string' ? data.detail : 'Request failed';
    throw new ApiError(res.status, detail, res.status >= 500);
  }
  return data;
}

const qs = (params = {}) => {
  const p = new URLSearchParams();
  Object.entries(params).forEach(([k, v]) => {
    if (v !== undefined && v !== null && v !== '') p.set(k, Array.isArray(v) ? v.join(',') : v);
  });
  const s = p.toString();
  return s ? `?${s}` : '';
};

export const api = {
  health: () => request('/health'),

  // products
  products: (params) => request(`/products${qs(params)}`),
  product: (id) => request(`/products/${id}`),
  filters: () => request('/products/filters'),

  // delivery
  checkPincode: (pincode) => request(`/delivery/check${qs({ pincode })}`),

  // auth
  login: ({ identifier, password }) => request('/auth/login', { method: 'POST', body: { identifier, password } }),
  register: ({ identifier, password, name }) => request('/auth/register', { method: 'POST', body: { identifier, password, name } }),
  me: () => request('/auth/me', { auth: true }),
  /** the login popup has no sign-up screen: unknown email/mobile numbers are registered on the fly */
  async loginOrRegister(credentials) {
    try {
      return await this.login(credentials);
    } catch (e) {
      if (e.status === 404) return this.register(credentials);
      throw e;
    }
  },

  // cart (needs login)
  cart: () => request('/cart', { auth: true }),
  addToCart: (productId, size, quantity = 1) => request('/cart', { method: 'POST', auth: true, body: { productId, size, quantity } }),
  updateCartItem: (itemId, quantity) => request(`/cart/${itemId}`, { method: 'PATCH', auth: true, body: { quantity } }),
  removeCartItem: (itemId) => request(`/cart/${itemId}`, { method: 'DELETE', auth: true }),
  clearCart: () => request('/cart', { method: 'DELETE', auth: true }),

  // orders (needs login)
  createOrder: (address) => request('/orders', { method: 'POST', auth: true, body: { address } }),
  orders: () => request('/orders', { auth: true }),
  order: (id) => request(`/orders/${id}`, { auth: true }),
};
