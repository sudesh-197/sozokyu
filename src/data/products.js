// All images live in /public/assets/images as optimised .webp files (see scripts/build-images.mjs).
const A = (id) => `${import.meta.env.BASE_URL}assets/images/${id}.webp`;

export const heroImage = A("b89e55ef-ebdf-409b-b805-50f139d0c686");
export const heroImageMobile = A("d83dfecc-912f-457c-af15-18ad445525ab"); // collection banner (phones)

const DESC = "Premium wool-blend varsity jacket with contrast sleeves .";

// Shared copy for the product-details page (same text as the Figma design).
const defaultDescription =
  "A modern everyday jacket featuring a relaxed oversized silhouette, vintage-inspired dusty rose wash, and functional utility pockets. Designed for effortless streetwear styling, it combines durable construction with a soft, worn-in appearance.";

const defaultDetails = [
  ["Material:", "Premium cotton denim/twill"],
  ["Color:", "Dusty Rose Pink"],
  ["Fit:", "Relaxed oversized fit"],
  ["Style:", "Casual utility streetwear"],
  ["Collar:", "Classic pointed collar"],
  ["Closure:", "Front metal snap buttons"],
  ["Pockets:", "Two oversized utility patch pockets"],
  ["Sleeves:", "Full-length sleeves"],
];

export const sizes = ["S", "M", "L", "XL", "XXL"];

/**
 * Every product shares this shape. Detail-page extras (gallery, variants, tag, ...)
 * default to the product's own image; override them per product when you have more photos.
 *  - price:       shown on the cards
 *  - detailPrice: shown on the details page (Figma shows ₹1999 there)
 */
const mk = (id, image, box, imgStyle, extra = {}) => ({
  id,
  name: "Riverton Varsity Jacket",
  description: DESC,
  price: 4999,
  detailPrice: 1999,
  tag: "Men Jacket",
  longDescription: defaultDescription,
  details: defaultDetails,
  image,
  box,
  imgStyle,
  gallery: [image, image, image],
  variants: [image, image, image],
  ...extra,
});
const cover = {
  left: 0,
  top: 0,
  width: "100%",
  height: "100%",
  objectFit: "cover",
};

export const products = [
  mk(
    1,
    A("e8f466aa-90fa-4d8c-8409-cb27de00c238"),
    [300, 400],
    { left: "-5.27%", top: "1.89%", width: "100%", height: "100%" },
    {
      name: "Embroidered Casual Shirt",
      description: "Lightweight shirt featuring subtle embroidered details.",
      price: 2799,
      detailPrice: 2799,
    },
  ),
  mk(
    2,
    A("4a37bcda-9af2-4c9d-b711-38ca247e958c"),
    [282, 368],
    { left: "-2.71%", top: "3%", width: "100%", height: "115.14%" },
    {
      name: "Graphic Knit Tee",
      description: "Relaxed graphic tee with a bold statement print.",
      price: 2499,
      detailPrice: 2499,
    },
  ),
  mk(
    3,
    A("b8353e65-d6f4-4552-b6cd-10347f6e3612"),
    [265, 353],
    { left: "-16.6%", top: "5.13%", width: "133.21%", height: "100%" },
    {
      name: "Floral Embroidered Jacket",
      description: "Statement jacket with bold floral embroidery details.",
      price: 4599,
      detailPrice: 4599,
    },
  ),
  mk(
    4,
    A("52effb41-718c-4dd2-a5b6-367c23a347cd"),
    [491, 655],
    { left: "-0.05%", top: "2.11%", width: "100.05%", height: "100%" },
    {
      name: "Linen Camp Shirt",
      description: "Lightweight shirt featuring subtle embroidered details.",
      price: 1799,
      detailPrice: 1799,
    },
  ),
  mk(
    5,
    A("aa625146-38f0-41ee-a4f3-172de64941ac"),
    [337, 450],
    { left: 0, top: "0.02%", width: "100%", height: "112.5%" },
    {
      name: "Textured Utility Jacket",
      description: "Structured jacket with a rugged textured finish.",
      price: 4299,
      detailPrice: 4299,
    },
  ),
  mk(
    6,
    A("31eb254b-e1e5-4865-8995-8174d609f5c4"),
    [337, 439],
    { left: "0.04%", top: "2.97%", width: "100%", height: "114.95%" },
    {
      name: "Printed Resort Shirt",
      description: "Relaxed printed shirt made for effortless styling.",
      price: 2899,
      detailPrice: 2899,
    },
  ),
  mk(
    7,
    A("0cb86172-fd06-4efc-b021-f55a639af086"),
    [456, 607],
    { left: "-3.13%", top: "2.28%", width: "100%", height: "112.69%" },
    {
      name: "Fleece Zip Jacket",
      description: "Warm fleece jacket with a clean everyday silhouette.",
      price: 3499,
      detailPrice: 3499,
    },
  ),
  mk(
    8,
    A("d33593d8-bbd4-4e9e-b53a-f7f9cbe8fdde"),
    [413, 550],
    { left: "-38.89%", top: "-3.93%", width: "177.78%", height: "100%" },
    {
      name: "Sherpa Collar Jacket",
      description: "Casual jacket with a soft contrast sherpa collar.",
      price: 3999,
      detailPrice: 3999,
    },
  ),
  mk(
    9,
    A("191f23c5-c851-4588-9323-bd4b32b115cc"),
    [300, 400],
    { left: 0, top: "1.93%", width: "100%", height: "100%" },
    {
      name: "Relaxed Black Shirt",
      description: "Minimal black shirt with a clean relaxed silhouette.",
      price: 2599,
      detailPrice: 2599,
    },
  ),
  mk(
    10,
    A("6748acb0-054e-4a90-bb36-67511f0ef3f0"),
    [282, 368],
    { left: 0, top: "4.8%", width: "100%", height: "114.95%" },
    {
      name: "Oversized Hoodie",
      description: "Soft oversized hoodie designed for everyday comfort.",
      price: 3199,
      detailPrice: 3199,
    },
  ),
  mk(
    11,
    A("63abe233-e322-4057-af09-df1ac0a9c209"),
    [316, 421],
    { left: 0, top: "4.22%", width: "100%", height: "100.06%" },
    {
      name: "Essential Zip Hoodie",
      description: "Classic zip hoodie with a comfortable relaxed fit.",
      price: 3299,
      detailPrice: 3299,
    },
  ),
  mk(
    12,
    A("6e3c2299-4b53-4662-87a4-cf24b1434f96"),
    [321, 428],
    { left: "-0.08%", top: "2.76%", width: "100%", height: "112.54%" },
    {
      name: "Relaxed Open Shirt",
      description: "Lightweight open shirt with an effortless fit.",
      price: 2699,
      detailPrice: 2699,
    },
  ),
  mk(21, A("image 133"), [300, 600], cover, {
    name: "Flower Printed Tee",
    description: "Premium wool-blend varsity tee with contrast sleeves",
    price: 1299,
    detailPrice: 1299,
  }),
  mk(22, A("d33593d8-bbd4-4e9e-b53a-f7f9cbe8fdde"), [267, 400], cover, {
    name: "Corduroy Overshirt",
    description: "Relaxed corduroy overshirt with a soft textured finish.",
    price: 3299,
    detailPrice: 3299,
    gallery: [
      A("a8a80f9b-6da6-46ce-9d34-444b17e4926a"),
      A("3c1f6a52-8d41-4b7e-9a3e-5b0c7d2e1f10"),
      A("7e9d2b84-1a6c-4f35-b8d0-2c4e6a9f3b71"),
    ],
    variants: [
      A("a8a80f9b-6da6-46ce-9d34-444b17e4926a"),
      A("b5a40e97-62d3-48c1-8f7a-0d1e3c5b9a28"),
      A("d2c86f13-9b57-4e0a-a1c4-7f3b8e6d5042"),
    ],
    availableSizes: ["S", "M", "L", "XL", "XXL"],
    relatedIds: [5, 1, 2, 21],
  }),
];

/* ---------------- Home page products (ids 13-20) ---------------- */
const VERT = "linear-gradient(to bottom, #acc3e0, #bbcfe9)";

// Home grid copy + prices – taken from the Figma "Browse All You Needs" cards.
// (box / imgStyle below are the collection-page crops; the home grid has its own exact Figma crops in homeCardLayout.)
const home = (name, description, price, category) => ({
  name,
  description,
  price,
  detailPrice: price,
  category,
});

export const homeProducts = [
  mk(
    13,
    A("af0d604a-89f4-4075-a371-28537e5adbf3"),
    [263, 395],
    { left: "-0.33%", top: "4%", width: "100.13%", height: "100%" },
    home(
      "Graphic Knit Tee",
      "Premium wool-blend jacket with embroidered details.",
      4999,
      "T-Shirt",
    ),
  ),
  mk(
    14,
    A("7386cf37-fa92-4d6b-b35d-eb0dbe49753e"),
    [597, 448],
    { left: "4.46%", top: "-0.02%", width: "100.09%", height: "100%" },
    {
      ...home(
        "Oversized Hoodie",
        "Soft oversized hoodie designed for everyday comfort.",
        3499,
        "Hoodie",
      ),
      plain: true,
    },
  ),
  mk(
    15,
    A("5a870568-42a4-412b-b81f-da9c965af736"),
    [449, 449],
    { left: 0, top: "2.03%", width: "100%", height: "100%" },
    home(
      "Floral Embroidered Jacket",
      "Statement jacket with bold floral embroidery details.",
      4599,
      "Jacket",
    ),
  ),
  mk(16, A("a4476443-e424-4d6e-bab7-1fa82af4321a"), [731, 548], cover, {
    ...home(
      "Relaxed Crew Sweatshirt",
      "Relaxed-fit sweatshirt made from soft cotton fleece.",
      2999,
      "Hoodie",
    ),
    plain: true,
  }),
  mk(
    17,
    A("d26cb08c-cb3e-443b-8150-461e04ef902a"),
    [687, 515],
    { left: 0, top: "-0.06%", width: "100%", height: "100.05%" },
    {
      ...home(
        "Embroidered Heritage Jacket",
        "Contemporary jacket with detailed embroidery and relaxed fit.",
        4299,
        "Jacket",
      ),
      plain: true,
    },
  ),
  mk(
    18,
    A("b127bab5-2eac-4b23-823f-31014c2a0400"),
    [360, 480],
    { left: "-5.27%", top: "1.89%", width: "100%", height: "100%" },
    {
      ...home(
        "Embroidered Casual Shirt",
        "Lightweight shirt featuring subtle embroidered details.",
        2799,
        "Shirt",
      ),
      bg: VERT,
    },
  ),
  mk(19, A("6ff6bd28-b603-4e66-b9db-4826f457c988"), [687, 515], cover, {
    ...home(
      "Contrast Stitch Overshirt",
      "Structured overshirt with clean contrast stitching.",
      3299,
      "Shirt",
    ),
    plain: true,
  }),
  mk(20, A("91adb410-84ed-4169-a820-1acdae53ab9d"), [687, 515], cover, {
    ...home(
      "Relaxed Denim Jacket",
      "Modern denim jacket with a relaxed layered silhouette.",
      3999,
      "Jacket",
    ),
    plain: true,
  }),
];

/**
 * Exact image placement inside the 301.5 x 240 blue "Background" of each home card (Figma node 2839:2609 and siblings).
 * box = the Figma "image 125" frame, imgStyle = its crop. Keyed by product id.
 */
const fc = (w, left, top, width) => ({
  box: [w, 395],
  imgStyle: { left, top, width, height: "100%" },
  plain: false,
  bg: undefined,
});
export const homeCardLayout = {
  13: fc(263, "-0.33%", "4%", "100.13%"),
  14: fc(302, "-33.8%", 0, "174.39%"),
  15: fc(263, "-25.1%", "4.18%", "150.19%"),
  16: fc(301, "-37.57%", 0, "174.97%"),
  17: fc(302, "-36.95%", 0, "174.39%"),
  18: fc(263, "-6.32%", "4.17%", "112.64%"),
  19: fc(301, "-37.4%", 0, "174.97%"),
  20: fc(301, "-37.57%", 0, "174.97%"),
};

// catalogue info used by search (and the filters) – category, gender, colour
const META = {
  1: ["Shirt", "Men", "Beige"],
  2: ["T-Shirt", "Men", "Multi"],
  3: ["Jacket", "Men", "Multi"],
  4: ["Shirt", "Men", "Green"],
  5: ["Jacket", "Men", "Beige"],
  6: ["Shirt", "Men", "Multi"],
  7: ["Jacket", "Men", "Multi"],
  8: ["Jacket", "Men", "Beige"],
  9: ["Shirt", "Men", "Black"],
  10: ["Hoodie", "Men", "Multi"],
  11: ["Hoodie", "Men", "Multi"],
  12: ["Shirt", "Men", "Red"],
  13: ["T-Shirt", "Women", "Multi"],
  14: ["Hoodie", "Women", "Beige"],
  15: ["T-Shirt", "Men", "Green"],
  16: ["Hoodie", "Women", "Green"],
  17: ["Jacket", "Men", "Red"],
  18: ["Shirt", "Men", "Multi"],
  19: ["Jacket", "Men", "Black"],
  20: ["Jacket", "Men", "Multi"],
  21: ["Jacket", "Men", "Green"],
  22: ["Jacket", "Men", "Red"],
};

// ---- store data used by sorting and the sidebar links ----
// sizes each product is sold in (used by the Size filter). Everything has S–XL, some also XS.
const HAS_XS = [1, 3, 5, 7, 9, 11, 13, 15, 17, 19];
const POPULARITY = {
  // higher = more popular
  1: 92,
  2: 97,
  3: 85,
  4: 60,
  5: 72,
  6: 90,
  7: 55,
  8: 48,
  9: 66,
  10: 81,
  11: 77,
  12: 58,
  13: 94,
  14: 70,
  15: 63,
  16: 83,
  17: 52,
  18: 74,
  19: 68,
  20: 79,
  21: 75,
  22: 71,
};
const NEW_ARRIVALS = [9, 10, 11, 12, 18, 19, 20];
const BEST_SELLERS = [1, 2, 3, 5, 6, 13, 14];
const ON_SALE = [3, 6, 9, 12, 15, 17, 19];

// Placeholder copy per category (short card text, long details text) - replace with real product copy / backend data.
const CATEGORY_COPY = {
  Shirt: [
    "Everyday shirt with a clean, modern cut.",
    "A modern everyday shirt with a clean cut and a comfortable fit, easy to dress up or down.",
  ],
  "T-Shirt": [
    "Soft everyday tee with a relaxed feel.",
    "A soft everyday tee designed for comfort and easy layering.",
  ],
  Hoodie: [
    "Cosy hoodie made for everyday comfort.",
    "A cosy hoodie designed for everyday comfort, with a relaxed streetwear look.",
  ],
  Jacket: [
    "Statement jacket for effortless layering.",
    "A modern everyday jacket designed for effortless streetwear styling and easy layering.",
  ],
};

[...products, ...homeProducts].forEach((p) => {
  const [category, gender, color] = META[p.id];
  p.category = p.category ?? category;
  p.gender = gender;
  p.color = color;
  p.availableSizes =
    p.availableSizes ??
    (HAS_XS.includes(p.id)
      ? ["XS", "S", "M", "L", "XL"]
      : ["S", "M", "L", "XL"]);
  p.popularity = POPULARITY[p.id];
  p.isNew = NEW_ARRIVALS.includes(p.id);
  p.isBest = BEST_SELLERS.includes(p.id);
  p.onSale = ON_SALE.includes(p.id);

  // The Figma mock reused one jacket's text for everything. Derive what we truthfully know from the data instead.
  p.tag = `${p.gender} ${p.category}`;
  if (CATEGORY_COPY[p.category]) {
    if (p.id === 13) p.description = CATEGORY_COPY[p.category][0];
    p.longDescription = CATEGORY_COPY[p.category][1];
  }
  p.details = [
    ["Category:", p.category],
    ["Gender:", p.gender],
    ["Color:", p.color],
    ["Sizes:", p.availableSizes.join(", ")],
  ];
});
const MOBILE_CROP = {
  // box = the Figma image frame (centred in the 171 x 152 blue background), imgStyle = its crop
  5: {
    box: [240, 360],
    imgStyle: { left: "-2.16%", top: "-2.46%", width: "100.09%", height: "100%" },
  },
  1: {
    box: [209, 279],
    imgStyle: { left: "-5.27%", top: "1.89%", width: "100%", height: "100%" },
  },
  2: {
    box: [180, 270],
    imgStyle: { left: "-0.08%", top: "3.82%", width: "100.13%", height: "100%" },
  },
  21: {
    box: [209, 279],
    imgStyle: { left: "-0.07%", top: "2.51%", width: "100.15%", height: "100%" },
  },
  22: { box: [216, 324], imgStyle: cover },
  6: { box: [235, 352], imgStyle: cover },
  3: {
    box: [204, 272],
    imgStyle: { left: "-16.6%", top: "5.13%", width: "133.21%", height: "100%" },
  },
  7: {
    box: [343, 457],
    imgStyle: { left: "-3.13%", top: "2.28%", width: "100%", height: "112.69%" },
  },
  8: {
    box: [279, 372],
    imgStyle: { left: "-38.89%", top: "-3.93%", width: "177.78%", height: "100%" },
  },
  9: {
    box: [233, 310],
    imgStyle: { left: 0, top: "1.93%", width: "100%", height: "100%" },
  },
  11: {
    box: [235, 314],
    imgStyle: { left: 0, top: "4.22%", width: "100%", height: "100.06%" },
  },
  12: {
    box: [235, 314],
    imgStyle: { left: "-0.08%", top: "2.76%", width: "100%", height: "112.54%" },
  },
};
products.forEach((p) => {
  if (MOBILE_CROP[p.id]) p.mobile = MOBILE_CROP[p.id];
});

// Figma order (phone frame): Textured Utility, Embroidered Casual, Graphic Knit, Flower Printed, Corduroy Overshirt,
// Printed Resort, Floral Embroidered, Fleece Zip, Sherpa Collar, Relaxed Black, Essential Zip Hoodie, Relaxed Open Shirt
const FIGMA_ORDER = [5, 1, 2, 21, 22, 6, 3, 7, 8, 9, 11, 12];
const rank = (id) => {
  const i = FIGMA_ORDER.indexOf(id);
  return i === -1 ? FIGMA_ORDER.length + id : i;
};
products.sort((a, b) => rank(a.id) - rank(b.id));
export const allProducts = [...products, ...homeProducts];
export const getProduct = (id) =>
  allProducts.find((p) => String(p.id) === String(id));
/** backend data wins, but keeps the frontend-only fields (popularity, new/best/sale flags) */
export const withLocalMeta = (item) => ({ ...getProduct(item.id), ...item });
/** same category (then same gender) first, from the collection items */
export const getRelated = (id, count = 4) => {
  const cur = getProduct(id);
  if (cur?.relatedIds)
    return cur.relatedIds.map(getProduct).filter(Boolean).slice(0, count);
  const score = (p) =>
    cur
      ? (p.category === cur.category ? 2 : 0) +
        (p.gender === cur.gender ? 1 : 0)
      : 0;
  return products
    .filter((p) => String(p.id) !== String(id))
    .sort((a, b) => score(b) - score(a) || a.id - b.id)
    .slice(0, count);
};
