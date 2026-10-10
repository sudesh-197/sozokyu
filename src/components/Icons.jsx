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

export const SearchIcon = createIcon(<><circle cx="11" cy="11" r="8" /><path d="M21 21l-4.3-4.3" /></>, 15);
export const BasketIcon = createIcon(<><path d="M3 10h18l-1.7 9.1a2 2 0 0 1-2 1.9H6.7a2 2 0 0 1-2-1.9L3 10z" /><path d="M8 10l3-6M16 10l-3-6" /></>);
export const ChevronDownIcon = createIcon(<path d="M6 9l6 6 6-6" />, 15);
export const CheckIcon = createIcon(<path d="M5 12l5 5 9-10" />, 14, { strokeWidth: 2 });
export const MinusIcon = createIcon(<path d="M5 12h14" />);
export const PlusIcon = createIcon(<path d="M12 5v14M5 12h14" />);
export const TrashIcon = createIcon(<path d="M4 7h16M10 11v6M14 11v6M6 7l1 12a2 2 0 0 0 2 2h6a2 2 0 0 0 2-2l1-12M9 7V4h6v3" />, 20);
export const MenuIcon = createIcon(<path d="M4 7h16M4 12h10M4 17h16" />, 18, { strokeLinejoin: undefined });

export const HeartIcon = ({ color, size = 18, fill = false }) => (
  <svg width={size} height={size} viewBox="0 0 24 24" {...base} {...(color ? { stroke: color } : {})} {...(fill ? { fill: color || '#111' } : {})}>
    <path d="M12 20s-7.5-4.6-7.5-10A4.5 4.5 0 0 1 12 7.2 4.5 4.5 0 0 1 19.5 10c0 5.4-7.5 10-7.5 10z" />
  </svg>
);
