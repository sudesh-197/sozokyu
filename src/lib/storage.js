// localStorage that never throws (private mode, quota, blocked storage...).
export const getItem = (key) => {
  try {
    return localStorage.getItem(key);
  } catch {
    return null;
  }
};
export const setItem = (key, value) => {
  try {
    localStorage.setItem(key, value);
  } catch {
    /* storage unavailable */
  }
};
export const removeItem = (key) => {
  try {
    localStorage.removeItem(key);
  } catch {
    /* storage unavailable */
  }
};

/** parsed JSON, or `fallback` when missing / unreadable */
export const readJSON = (key, fallback = null) => {
  try {
    return JSON.parse(localStorage.getItem(key)) || fallback;
  } catch {
    return fallback;
  }
};
/** like readJSON, but always an array */
export const readList = (key) => {
  const v = readJSON(key, []);
  return Array.isArray(v) ? v : [];
};
export const writeJSON = (key, value) => setItem(key, JSON.stringify(value));
