// Product search.
//  - "t-shirt", "t shirt", "tshirts"   -> T-Shirt category
//  - "shirt" / "hoodies" / "jackets"   -> exactly that category (so "shirt" doesn't return T-shirts)
//  - "men" / "women"                   -> gender
//  - anything else ("black", "wool")   -> matches colour, name or description
//  - several words must all match      ("black hoodie")
const CATEGORIES = ['shirt', 'tshirt', 'hoodie', 'jacket'];

const clean = (s) => String(s).toLowerCase().replace(/[^a-z0-9]/g, '');
const singular = (w) => (w.length > 3 && w.endsWith('s') && !w.endsWith('ss') ? w.slice(0, -1) : w);

function parseQuery(query) {
  return String(query || '')
    .toLowerCase()
    .replace(/\bt[\s-]*shirts?\b/g, 'tshirt')       // "t shirt" / "t-shirts" -> one word
    .split(/\s+/)
    .map((w) => w.replace(/[’']s?$/, ''))            // men's -> men
    .filter(Boolean)
    .map((w) => ({ raw: w, word: singular(clean(w)) }))
    .filter((t) => t.word);
}

function matchesToken(p, { word }) {
  if (['men', 'man', 'male', 'mens'].includes(word)) return p.gender === 'Men';
  if (['women', 'woman', 'female', 'ladie', 'lady', 'womens'].includes(word)) return p.gender === 'Women';
  if (CATEGORIES.includes(word)) return clean(p.category) === word;
  return clean(`${p.color} ${p.name} ${p.description}`).includes(word);
}

export function searchProducts(list, query) {
  const tokens = parseQuery(query);
  if (!tokens.length) return list;
  return list.filter((p) => tokens.every((t) => matchesToken(p, t)));
}
