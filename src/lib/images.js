// Helpers for the optimised images in /public/assets/images.
//   <id>.webp       full size (max 1920px wide)
//   <id>-640.webp   small copy for thumbnails, the ticker strip and small screens
// (both are created by `npm run images`, which also writes src/data/image-manifest.json)
import manifest from '../data/image-manifest.json';

const ID = /([0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12})\.webp$/;

/** small (640px) copy of an image – use for anything displayed small */
export const small = (url) => (ID.test(url) ? url.replace(/\.webp$/, '-640.webp') : url);

/** src + srcSet + sizes: the browser downloads the small copy when it is big enough for the slot */
export function responsive(url, sizes) {
  const id = url.match(ID)?.[1];
  const meta = id && manifest[id];
  if (!meta || meta.w <= 640) return { src: url };
  return { src: url, srcSet: `${small(url)} 640w, ${url} ${meta.w}w`, sizes };
}
