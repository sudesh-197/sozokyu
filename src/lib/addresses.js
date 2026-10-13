import { readList, writeJSON } from "./storage.js";

// Saved addresses (localStorage). Replace with API calls when the backend has an addresses endpoint.
const KEY = "sozokyu_addresses";

export const STATES = [
  "Andhra Pradesh",
  "Arunachal Pradesh",
  "Assam",
  "Bihar",
  "Chhattisgarh",
  "Goa",
  "Gujarat",
  "Haryana",
  "Himachal Pradesh",
  "Jharkhand",
  "Karnataka",
  "Kerala",
  "Madhya Pradesh",
  "Maharashtra",
  "Manipur",
  "Meghalaya",
  "Mizoram",
  "Nagaland",
  "Odisha",
  "Punjab",
  "Rajasthan",
  "Sikkim",
  "Tamil Nadu",
  "Telangana",
  "Tripura",
  "Uttar Pradesh",
  "Uttarakhand",
  "West Bengal",
  "Delhi",
  "Jammu and Kashmir",
  "Ladakh",
  "Puducherry",
  "Chandigarh",
];

export const getAddresses = () => readList(KEY);
export const saveAddresses = (list) => writeJSON(KEY, list);
export const getDefaultAddress = () => {
  const l = getAddresses();
  return l.find((a) => a.isDefault) || l[0] || null;
};
export const formatAddress = (a) => `${a.line}, ${a.city} - ${a.pincode}`;
const norm = (v) =>
  String(v ?? "")
    .trim()
    .toLowerCase()
    .replace(/\s+/g, " ");
const sameAddress = (a, b) =>
  ["name", "phone", "line", "city", "pincode"].every(
    (k) => norm(a[k]) === norm(b[k]),
  );

/** Saves an address typed at checkout unless the same one is already saved.
 *  First saved address becomes the default. Never throws, so it can't stop an order. */
export function saveAddressIfNew(address) {
  try {
    const list = getAddresses();
    if (list.some((a) => sameAddress(a, address))) return false;
    saveAddresses([
      ...list,
      { ...address, id: `a${Date.now()}`, isDefault: list.length === 0 },
    ]);
    return true;
  } catch {
    return false;
  }
}
