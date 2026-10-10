import { readList, writeJSON } from './storage.js';

// Saved addresses (localStorage). Replace with API calls when the backend has an addresses endpoint.
const KEY = 'sozokyu_addresses';

export const STATES = [
  'Andhra Pradesh', 'Arunachal Pradesh', 'Assam', 'Bihar', 'Chhattisgarh', 'Goa', 'Gujarat', 'Haryana',
  'Himachal Pradesh', 'Jharkhand', 'Karnataka', 'Kerala', 'Madhya Pradesh', 'Maharashtra', 'Manipur',
  'Meghalaya', 'Mizoram', 'Nagaland', 'Odisha', 'Punjab', 'Rajasthan', 'Sikkim', 'Tamil Nadu', 'Telangana',
  'Tripura', 'Uttar Pradesh', 'Uttarakhand', 'West Bengal', 'Delhi', 'Jammu and Kashmir', 'Ladakh',
  'Puducherry', 'Chandigarh',
];

export const getAddresses = () => readList(KEY);
export const saveAddresses = (list) => writeJSON(KEY, list);
export const getDefaultAddress = () => { const l = getAddresses(); return l.find((a) => a.isDefault) || l[0] || null; };
export const formatAddress = (a) => `${a.line}, ${a.city} - ${a.pincode}`;
