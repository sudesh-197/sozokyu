# SVG icons

One `.svg` file per icon. The file name is the icon key (`cart.svg` -> `"cart"`).
Every icon is connected in `src/components/Icons.jsx` with `svgIcon("<file-name>")`.

How a file is read
- the file's own `viewBox` and `width` (= default size in px) are used, so icons exported at 15 / 16 / 18 / 20 / 24 px all work
- `stroke="#111111"` is removed on load, so the icon follows the `color` prop (default #111);
  stroke-width / linecap / linejoin / fills stay as exported from Figma
- multi-colour icons (google.svg) keep their own fills

To change an icon, edit or replace its file. To add one, drop `name.svg` here and add
`export const NameIcon = svgIcon("name");` to `src/components/Icons.jsx`.

| file | component | where it shows |
|---|---|---|
| cart | BasketIcon | header cart |
| bag-add | BagAddIcon | product-card "add to bag" |
| search | SearchIcon | header / search box |
| menu | MenuIcon | header menu |
| chevron-down | ChevronDownIcon | dropdown arrows |
| heart | HeartIcon | wishlist buttons |
| user, location, logout | UserIcon, LocationIcon, LogoutIcon | account menu |
| sort, palette, wallet, filter | SortIcon, PaletteIcon, WalletIcon, FilterIcon | mobile filter bar |
| wallet, truck-delivery | WalletIcon, TruckDeliveryIcon | delivery check |
| apple, google | AppleLogo, GoogleLogo | login buttons |
| info, package, package-delivered | InfoIcon, PackageIcon, PackageDeliveredIcon | available, not used yet |
| minus, plus, check, trash | MinusIcon, PlusIcon, CheckIcon, TrashIcon | cart drawer / filters |
