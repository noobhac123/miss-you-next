# Miss You — Premium Share Card

A mobile-first “Miss You” card site with a message-first landing layout, animated paper card, one-tap sharing, and **personalized server-generated Open Graph images**. This is a real Next.js app, not only a static mockup.

## What's included

- A large premium message card at the top of the page, showing the sender's name, recipient name, and note.
- Responsive layout for phones, tablets, and desktop.
- Reduced-motion support and lightweight CSS animations.
- Personal message composer with quick templates.
- WhatsApp, Facebook, X/Twitter, native share sheet (Instagram/other apps where supported), and copy-link options.
- A dynamic `/api/og` endpoint. Its share image uses the actual sender, recipient, and message passed in the URL.
- Page metadata generated server-side for each shared link. This is important because social preview crawlers may not execute browser JavaScript.
- Optional Monetag Direct Link. The sponsored button is hidden until a real HTTPS URL is configured.

## Run locally

Requires Node.js 20.9+ and npm.

```bash
npm install
npm run dev
```

Open `http://localhost:3000`.

## Publish online (recommended: Vercel)

1. Upload the contents of this folder to a new GitHub repository.
2. Import that repository in Vercel and deploy it as a Next.js project.
3. In Vercel → Project → Settings → Environment Variables, optionally add:
   - `NEXT_PUBLIC_MONETAG_DIRECT_LINK` = your real Monetag Direct Link. Leave unset to hide the sponsored button.
   - `NEXT_PUBLIC_SITE_URL` = your production HTTPS URL (optional; request host is otherwise detected automatically).
4. Redeploy after changing environment variables.
5. Open the deployed site on a phone and test one share link. The receiver URL should look like `https://your-domain/?from=Ashok&to=Bestie&msg=...&ref=...`.

Vercel's current Next.js deployment documentation: https://vercel.com/docs/frameworks/full-stack/nextjs

## Dynamic social preview

The shared URL contains the message parameters. Server-rendered metadata points to `/api/og?from=...&to=...&msg=...`, which generates a 1200×630 PNG with the sender's name designed into the card. The preview uses the recipient and message too.

Social platforms can cache link previews; after editing a message, a new message link receives a new `ref` value so its preview URL is unique. Instagram sharing from a browser is platform-dependent; the “Instagram / More” button opens the device's native share sheet when supported.

## Monetag

Set `NEXT_PUBLIC_MONETAG_DIRECT_LINK` to the exact URL supplied in your own Monetag dashboard. Do not use a made-up URL. The sponsored button is rendered only if the configured value starts with `http://` or `https://`; use the HTTPS URL provided by the network where available.

## Honest limits

- Message data is carried in the URL; do not put private or sensitive information in a share message.
- The referral `ref` and `parent` values preserve a link lineage, but this package does not claim global referral counts or earnings analytics. Those require a database/analytics backend.
- Shares, click-throughs, and revenue cannot be guaranteed.

## Local visual preview

`preview.html` is an optional lightweight visual preview for checking the layout. The production version is the Next.js app (`app/`) because only the server-rendered app can generate the per-sender social preview image. Do not deploy `preview.html` as a replacement for the production app if personalized OG images are required.
