/** 1899 -> "1,899" */
export const inr = (n) => Number(n).toLocaleString("en-IN");

/** 1899 -> "₹1,899" */
export const rupee = (n) => `₹${inr(n)}`;
