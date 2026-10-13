const base = { fill: 'none', stroke: '#111', strokeWidth: 1.5, strokeLinecap: 'round', strokeLinejoin: 'round' };

/**
 * Builds a 24x24 line icon. Every icon takes `color` (stroke) and `size`; any other prop
 * (className, strokeWidth, aria-hidden ...) goes straight onto the <svg>.
 * `defaults` replaces the shared stroke style (use `undefined` to drop an attribute).
 */
export const createIcon = (paths, defaultSize = 18, defaults) =>
  function Icon({ color, size = defaultSize, ...rest }) {
    return (
      <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...defaults} {...(color ? { stroke: color } : {})} {...rest}>
        {paths}
      </svg>
    );
  };

// ---- SVG files live in src/assets/icons/*.svg; the file name is the key ("cart.svg" -> "cart") ----
const files = import.meta.glob('../assets/icons/*.svg', { query: '?raw', import: 'default', eager: true });
const sources = Object.fromEntries(
  Object.entries(files).map(([path, raw]) => [path.split('/').pop().replace('.svg', ''), raw])
);

/**
 * Builds an icon component from src/assets/icons/<name>.svg.
 * Uses the file's own viewBox and width (default size). `stroke="#111111"` is dropped so the
 * `color` prop works; other attributes (stroke-width, fills ...) stay as exported.
 */
export const svgIcon = (name, defaults) => {
  const raw = sources[name];
  if (!raw) throw new Error(`Missing icon file: src/assets/icons/${name}.svg`);
  const viewBox = /viewBox="([^"]+)"/.exec(raw)?.[1] ?? '0 0 24 24';
  const size = Number(/\swidth="([\d.]+)"/.exec(raw)?.[1]) || 18;
  const inner = raw
    .replace(/<\?xml[^>]*>/, '')
    .replace(/<svg[^>]*>/, '')
    .replace(/<\/svg>/, '')
    .replace(/\sstroke="#111111"/gi, '')
    .trim();
  return createIcon(<g dangerouslySetInnerHTML={{ __html: inner }} />, size, { viewBox, ...defaults });
};

// header + shop
export const SearchIcon = svgIcon('search');
export const BasketIcon = svgIcon('cart'); // header cart -> assets/icons/cart.svg
export const BagAddIcon = svgIcon('bag-add'); // product-card "add to bag"
export const MenuIcon = svgIcon('menu');
export const ChevronDownIcon = svgIcon('chevron-down');
export const CheckIcon = svgIcon('check', { strokeWidth: 2 });
export const MinusIcon = svgIcon('minus');
export const PlusIcon = svgIcon('plus');
export const TrashIcon = svgIcon('trash');

// account / filters / delivery / info
export const UserIcon = svgIcon('user');
export const LocationIcon = svgIcon('location');
export const LogoutIcon = svgIcon('logout');
export const SortIcon = svgIcon('sort');
export const PaletteIcon = svgIcon('palette');
export const WalletIcon = svgIcon('wallet');
export const FilterIcon = svgIcon('filter');
export const TruckDeliveryIcon = svgIcon('truck-delivery');
export const PackageIcon = svgIcon('package');
export const PackageDeliveredIcon = svgIcon('package-delivered');
export const InfoIcon = svgIcon('info');

// brand logos keep their own colours
export const AppleLogo = svgIcon('apple', { stroke: 'none' });
export const GoogleLogo = svgIcon('google', { stroke: 'none' });

const Heart = svgIcon('heart');
export const HeartIcon = ({ color, size, fill = false }) => (
  <Heart color={color} size={size} {...(fill ? { fill: color || '#111' } : {})} />
);
