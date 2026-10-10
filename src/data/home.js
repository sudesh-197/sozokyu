// All images live in /public/assets/images as optimised .webp files (see scripts/build-images.mjs).
const A = (id) => `${import.meta.env.BASE_URL}assets/images/${id}.webp`;

export const homeAssets = {
  hero: A('85ac98fc-9856-465b-8a45-54b7c299c9c2'),
  heroMobile: A('a177eee9-0a1d-458b-90d1-01c264418eab'), // portrait hero for phones
  feature: A('f10836a3-e36a-46e2-82b1-3e02d82a107c'),
  cluster: {
    left: A('7386cf37-fa92-4d6b-b35d-eb0dbe49753e'),
    center: A('60200e51-a91b-4ebd-95cf-366822792d52'),
    right: A('a4476443-e424-4d6e-bab7-1fa82af4321a'),
  },
};

// "Hold on, new products are coming!" – three stacked cards, back -> front (Figma 3296:5467 / 5473 / 5479).
// w = card width, img = photo width (height is always 282), top = offset inside the 306px stack, crop = Figma image crop.
export const stackCards = [
  { w: 456, img: 233, top: 0,  opacity: 0.7, src: homeAssets.cluster.right,  crop: { height: '100%', left: '-22.1%', top: 0, width: '161.37%' } },
  { w: 487, img: 273, top: 12, opacity: 0.9, src: homeAssets.cluster.left,   crop: null },
  { w: 539, img: 313, top: 24, opacity: 1,   src: homeAssets.cluster.center, crop: { height: '106.42%', left: '-9.42%', top: '0.1%', width: '127.54%' } },
];

// Phone version of the same stack (390px Figma frame 2859:1421 -> 3298:5601).
// w / h = card size, top = offset inside the 190px stack. The photo is always h x (313/282), so no img width here.
const phoneCrop = { height: '106.42%', left: '-9.42%', top: '0.1%', width: '127.54%' };
export const stackCardsPhone = [
  { w: 259,   h: 135, top: 0,  opacity: 0.7, src: homeAssets.cluster.right,  crop: null },
  { w: 286.7, h: 150, top: 12, opacity: 0.9, src: homeAssets.cluster.left,   crop: null },
  { w: 318,   h: 166, top: 24, opacity: 1,   src: homeAssets.cluster.center, crop: phoneCrop },
];

export const categoryPills = ['All', 'T-Shirt', 'Shirt', 'Hoodie', 'Jacket'];

// Full-bleed strip of six portraits. `style` reproduces the Figma crops.
export const strip = [
  { src: A('7386cf37-fa92-4d6b-b35d-eb0dbe49753e') },
  { src: A('e5ad084e-2312-4cac-87cf-448c162bfcdf'), style: { height: '100%', left: '-45.45%', top: '0.09%', width: '177.78%' } },
  { src: A('60200e51-a91b-4ebd-95cf-366822792d52'), style: { height: '100%', left: '-32.78%', top: '0.1%', width: '177.78%' } },
  { src: A('91adb410-84ed-4169-a820-1acdae53ab9d'), style: { height: '100%', left: '-38.71%', top: '0.03%', width: '177.78%' } },
  { src: A('a4476443-e424-4d6e-bab7-1fa82af4321a') },
  { src: A('6509f51a-db95-4728-bcc2-105eea6ff1ae') },
];

// Login page image (Figma asset – expires after 7 days; export to /public/images)
export const loginImage = A('2ab10748-8f96-42b5-b043-5cda9c52e1f7');
