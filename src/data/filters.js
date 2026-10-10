// Options shown in the sidebar. Counts are calculated from the real products (see getFilterCounts in lib/catalog.js).
export const categories = ['Shirt', 'T-Shirt', 'Hoodie', 'Jacket'].map((label) => ({ label }));
export const genders = ['Men', 'Women'];
export const colors = ['Black', 'Red', 'Green', 'Beige', 'Multi'].map((label) => ({ label }));
export const sizes = ['XS', 'S', 'M', 'L', 'XL'].map((label) => ({ label }));

// `key` is what goes in the URL (?price=799-999,2500+)
export const prices = [
  { key: '799-999', label: '₹ 799 - ₹ 999', min: 799, max: 999 },
  { key: '1000-1499', label: '₹ 1000 - ₹ 1499', min: 1000, max: 1499 },
  { key: '1500-1999', label: '₹ 1500 - ₹ 1999', min: 1500, max: 1999 },
  { key: '2000-2499', label: '₹ 2000 - ₹ 2499', min: 2000, max: 2499 },
  { key: '2500+', label: 'More than ₹2499', min: 2500, max: Infinity },
];
