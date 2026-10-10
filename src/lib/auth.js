import { getItem, setItem, removeItem, readJSON, writeJSON } from "./storage.js";

// Front-end only demo auth (no backend). Replace the body of `login` with a real API call later.
const KEY = "sozokyu_user";

export const isEmail = (v) => /^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(v);
export const isMobile = (v) => /^\d{10}$/.test(v.replace(/[\s-]/g, ""));

export function validateMobile(value) {
  const v = value.trim();
  if (!v) return "Please enter your mobile number";
  if (!isMobile(v)) return "Enter a valid 10-digit mobile number";
  return "";
}

const isOtp = (v) => /^\d{6}$/.test(v);
export const OTP_SECONDS = 59;

export function validateOtp(value) {
  if (!value) return "Please enter the OTP";
  if (!isOtp(value)) return "Enter the 6-digit OTP";
  return "";
}

export function validateRegister({ name, email, phone }) {
  const errors = {};
  if (!name.trim()) errors.name = "Please enter your full name";
  if (!email.trim()) errors.email = "Please enter your email";
  else if (!isEmail(email.trim())) errors.email = "Enter a valid email address";
  const m = validateMobile(phone);
  if (m) errors.phone = m;
  return errors;
}

// Saves the signed-in user locally. `name` / `email` are only present after "Create Account".
export function login({ identifier, name, email }) {
  const user = {
    identifier: identifier.trim(),
    ...(name ? { name: name.trim() } : {}),
    ...(email ? { email: email.trim() } : {}),
  };
  writeJSON(KEY, user);
  window.dispatchEvent(new Event("sozokyu-auth")); // tells open pages the user changed
  return user;
}

export function logout() {
  ["sozokyu_user", "sozokyu_token", "sozokyu_cart", "sozokyu_orders", "sozokyu_addresses"].forEach(removeItem);
  window.dispatchEvent(new Event("sozokyu-auth"));
}

export const getUser = () => readJSON(KEY);

// "Show the login popup on the first visit only"
const SEEN_KEY = "sozokyu_login_prompt_seen";
export const hasSeenPrompt = () => getItem(SEEN_KEY) === "1";
export const markPromptSeen = () => setItem(SEEN_KEY, "1");

// Merge new details (name / email / phone) into the saved user
export function updateUser(patch) {
  const next = { ...(getUser() || {}), ...patch };
  writeJSON(KEY, next);
  return next;
}
