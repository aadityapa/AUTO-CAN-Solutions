# Go-live checklist

Status of the AUTO-CAN Solutions website as of the pre-launch audit, and the
steps left to put it in front of the public.

---

## 1. Blocking — do these before announcing the site

### 1.1 Activate the contact form ⚠️

**This is the one failure that hides itself.** The enquiry form posts to
FormSubmit, which requires a one-time confirmation before it will deliver
anything: the first submission to a new address triggers an email that someone
must click. Until that happens **no enquiry reaches the inbox** — and because
the form falls back to opening the visitor's mail client when the request
fails, the page still looks like it worked.

1. Open the deployed `/contact` page.
2. Send a real test enquiry.
3. Check `info@auto-can.in` for the FormSubmit activation email and click the link.
4. Send a second test enquiry and confirm it arrives.

Only after step 4 is the form live.

Optional hardening: copy the per-address token from your FormSubmit dashboard
into `FORMSUBMIT_TOKEN` in `src/seo/site.config.js`. It removes the address
from the endpoint URL — though not from the page, which publishes it as a
`mailto:` link by design.

### 1.2 Point the domain at the deployment

`SITE_URL` in `src/seo/site.config.js` is `https://www.auto-can-solution.com`
and is the single source of truth; `sitemap.xml` is generated from it. If the
production domain differs, change it there and mirror it in
`public/robots.txt` and `public/llms.txt`, then rebuild.

Confirm after deploying:

- `https://<domain>/robots.txt` resolves
- `https://<domain>/sitemap.xml` resolves and lists 8 URLs
- `https://<domain>/llms.txt` resolves
- A bad URL such as `https://<domain>/nope` returns the 404 page **with a 404 status**
- `https://<domain>/privacy` and `/terms` redirect to the full paths

---

## 2. Ready, but incomplete until you supply the data

These fields are empty and are cleanly omitted from the JSON-LD, so the site
ships safely without them. Leave anything unconfirmed blank rather than
approximate — inaccurate business details work against you in search.

| Field in `src/seo/site.config.js` | Unlocks |
|---|---|
| `telephone` | Phone in Organization/LocalBusiness schema |
| `hq.streetAddress` + `hq.postalCode` | Full LocalBusiness rich result (both needed) |
| `sameAs` | Entity confirmation from LinkedIn and other profiles |

---

## 3. Verified — no action needed

Checked by rendering every route in headless Chromium at 1440×900 and 390×844.

- **Accessibility** — zero axe-core violations (WCAG 2.1 A/AA + best-practice)
  on all nine routes at both viewports. Skip link, focus indicators, keyboard
  nav, mobile-menu focus management and scroll lock, form error announcement.
- **Runtime** — no console errors, no page errors, no failed requests, no
  horizontal overflow, no broken images, exactly one `<h1>` per page.
- **Reduced motion** — no hydration errors and no content left invisible.
- **Without JavaScript** — full content renders; every route ships real
  prerendered HTML rather than an empty root div.
- **SEO** — one `<title>` and one description per page, all within snippet
  length; canonical and OpenGraph on all content pages; 404 is `noindex`;
  valid JSON-LD (Organization, WebSite, ProfessionalService, WebPage,
  BreadcrumbList, FAQPage, ItemList/Service); OG image 1200×630.
- **Build** — `npm ci`, `npm run lint`, `npm run build` all pass from a clean
  clone with no flags. CI runs the same on every push to `main` and every PR.

Copy note: the digital-twin panel and hero console are deliberately
qualitative. They previously showed invented figures ("99% signal parity",
"1,248/1,248 test cases passed", "AUTOSAR RTE generated in 3.2s") that a
prospective OEM client could read as measured results. Swap in real numbers
only when a program can back them.

---

## 4. Deploy

```bash
npm ci
npm run build      # regenerates sitemap.xml, prerenders to dist/
```

Deploy `dist/` to any static host. `vercel.json` carries the production
config — security headers including CSP, cache-control per asset class,
`cleanUrls`, and the redirects. On Vercel, connect the repo and it picks up
`buildCommand` and `outputDirectory` automatically; Node version comes from
`engines.node` (>= 20) in `package.json`.

**Note the CSP.** Adding any third-party script (analytics, chat widget, tag
manager) requires widening `Content-Security-Policy` in `vercel.json`, or it
will be blocked. Currently allowed: Google Fonts and `formsubmit.co`.

---

## 5. After launch

In rough order of impact:

1. **Google Search Console** — verify the domain, submit `sitemap.xml`, request indexing.
2. **Bing Webmaster Tools** — same; Bing also feeds ChatGPT search.
3. **Google Business Profile** — create/claim for Jaipur and Pune. Needs the real address, so it depends on §2.
4. **Validate the live URL** — [Rich Results Test](https://search.google.com/test/rich-results) should detect Organization and FAQ; check the social card on [opengraph.xyz](https://www.opengraph.xyz).
5. **Backlinks** — LinkedIn company page, automotive supplier directories, Clutch/GoodFirms, partner and client sites. This is what actually moves rankings.
6. **Consistent NAP** — name, address and phone identical everywhere online.
7. **Content cadence** — case studies and articles on HiL testing, AUTOSAR, ISO 26262 earn long-tail traffic and get quoted by AI answer engines.

See `SEO-GUIDE.md` for the fuller off-page checklist.

---

## 6. Keeping it healthy

- `npm run docs` regenerates the source appendix in `PROJECT-DOCUMENTATION.md`. Run it when the source changes materially.
- `public/sitemap.xml` and `dist/` are generated and git-ignored — never edit by hand.
- The sitemap generator **fails the build** if `src/routes.jsx` gains or loses a route it does not account for. If that happens, update `PAGES` in `scripts/generate-sitemap.mjs` (or `EXCLUDED` for a route that should not be indexed).
- Prefer `npm ci` over `npm install`, so local, CI and Vercel builds resolve identically.
