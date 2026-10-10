# Sozokyu – Home + Collection + Product Details (React + Vite)

    npm install
    npm run dev

Routes
- `/`               Home (hero, features, browse products, style strip)
- Login popup: opens automatically on first visit (X closes it); the header profile icon reopens it. Demo auth in `src/lib/auth.js`
- `/collection`     Collection with filters
- `/product/:id`    Product details (opens from any product card, ids 1–20)

Images
- All images are served locally from `public/assets/images/*.webp` (fast, cacheable, no Figma dependency).
- Build them once with `npm install && npm run images`. The script downloads each image,
  resizes (max 1920px) and converts to WebP. Figma links expire after ~7 days; for any that
  fail, export the PNG from Figma into `assets-source/<id>.png` and run `npm run images` again.
- Hero images load eagerly; all other images use `loading="lazy"`.

## Images

All images are local WebP files in `public/assets/images/`, named by their Figma id:

- `<id>.webp` – full size (max 1920px wide)
- `<id>-640.webp` – small copy used for thumbnails, the ticker strip and phones

`npm run images` (re)creates them: it converts anything in `assets-source/<id>.png`, downloads missing ones
from Figma, makes the 640px copies and rewrites `src/data/image-manifest.json`.
Hosts get long-lived cache rules from `vercel.json` / `public/_headers`.
