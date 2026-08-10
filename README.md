# AUTO-CAN Solutions — Website

A modern, animated, **SEO-optimised** marketing website for **AUTO-CAN Solutions** (Automotive Engineering & Embedded Software), built with **React + Vite + Framer Motion** and **statically prerendered** for search engines and AI answer engines.

## Tech stack

- **React 18** + **Vite 5**
- **vite-react-ssg** — static prerendering: every route ships real HTML (great for Google + AI crawlers that don't run JavaScript)
- **React Router 6** — multi-page routing
- **Framer Motion 11** — 3D tilt cards, magnetic buttons, cursor glow, ambient background, scroll reveals, animated counters
- **Three.js** — the 3D hero scene (`HeroScene3D`), lazy-loaded behind a WebGL check with a static fallback, wrapped in an error boundary, and honouring `prefers-reduced-motion`
- **Lenis** — smooth scrolling
- **JSON-LD structured data** + per-page meta via the SSG `Head`

## Getting started

Requires **Node.js 20+**. `vite-react-ssg` pulls in `p-queue`/`p-timeout`, which declare
`engines.node: ">=20"`, so Node 18 is not a supported build environment despite what earlier
versions of this file claimed. CI builds on Node 20; Vercel reads `engines.node` from
`package.json`.

```bash
cd autocan-website
npm ci           # install exactly what package-lock.json pins
npm run dev      # dev server → http://localhost:8013
npm run build    # regenerate sitemap, then prerender → /dist
npm run preview  # preview the production build
npm run lint     # ESLint, incl. react-hooks and jsx-a11y
npm run sitemap  # regenerate public/sitemap.xml on its own
npm run docs     # regenerate the source appendix in PROJECT-DOCUMENTATION.md
```

Use **`npm ci`**, not `npm install`. It installs strictly from the lockfile and fails on a
broken dependency tree, so local, CI, and Vercel builds stay identical — `npm install` against
a warm `node_modules` will happily paper over a conflict that then breaks the deploy.

Deploy the `dist/` folder to any static host (Vercel, Netlify, Cloudflare Pages, etc.). Because pages are prerendered, crawlers get full HTML immediately.

**CI** — `.github/workflows/ci.yml` runs a clean install, lint, and build on pushes to `main`
and on pull requests, then checks that all nine routes prerendered, the sitemap is well-formed
and points at the production domain, and no placeholder text reached the HTML. Note a push to
a feature branch with no open PR runs nothing.

## SEO / GEO / AEO — what's built in

**Technical SEO**
- Static prerendered HTML for every route (real content, not an empty `<div id="root">`)
- Unique `<title>`, meta description, keywords, and canonical URL per page
- Open Graph + Twitter Card tags for rich social sharing
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, favicons
- Fast, mobile-first, accessible semantic markup

**Structured data (JSON-LD)**
- `Organization`, `WebSite`, `ProfessionalService` — site-wide, including the 404 page
- `WebPage` + `BreadcrumbList` — on all eight content pages (the 404 page renders a bare `<Head>` and emits neither)
- `FAQPage` (Home + Services) → eligible for Google FAQ rich results
- `ItemList` + `Service` (Services) → the six core services as structured entries

**AEO — Answer Engine Optimization**
- Concise, factual FAQ Q&A (`src/data/faq.js`) rendered on-page AND in FAQPage schema, so Google, ChatGPT, Perplexity and Gemini can quote direct answers.

**GEO — Generative Engine Optimization**
- `public/llms.txt` — a clean, factual summary of the company for AI crawlers
- `robots.txt` explicitly allows GPTBot, PerplexityBot, Google-Extended, ClaudeBot, Applebot-Extended, etc.
- Entity-rich copy and `knowsAbout` schema so AI engines understand what AUTO-CAN is.

## ⚠️ Before you go live — do these (one-time)

**Activate the contact form.** This is the one item that silently breaks enquiries. FormSubmit
requires a one-time confirmation: the first submission to a new address triggers an email that
someone must click before anything is delivered. Until then no enquiry arrives — and because
the form falls back to opening the visitor's mail client on failure, nothing looks broken. Send
a test enquiry and confirm it lands before treating the form as live.

The domain is set to **`https://www.auto-can-solution.com`** in `src/seo/site.config.js`,
`public/robots.txt`, and `public/llms.txt`. If it ever changes, update all three —
`sitemap.xml` picks the domain up automatically from `site.config.js`.

Still outstanding in **`src/seo/site.config.js`**:

1. `telephone` → international format, e.g. `+91-141-4012345`.
2. `hq.streetAddress` and `hq.postalCode` → the registered Jaipur address (both together unlock the full LocalBusiness rich result).
3. `sameAs` → real LinkedIn / social profile URLs.
4. `FORMSUBMIT_TOKEN` → the per-address token from your FormSubmit dashboard. It removes the address from the form's endpoint URL, but **not** from the bundle: the Contact page also publishes it as a visible `mailto:` link, so the address stays public by design. Treat the token as tidiness, not anti-scraping.

Each of these is omitted from the JSON-LD while empty, so the site is safe to ship as-is — but leave them blank rather than approximate. Search engines treat inaccurate business details as a negative trust signal.

See **`SEO-GUIDE.md`** for the full "get found on Google & AI" checklist (Search Console, backlinks, Google Business Profile, etc.).

## Editing content

- Company copy, services, timeline, etc. → `src/data/site.js`
- FAQ answers → `src/data/faq.js`
- Per-page titles/descriptions → `src/seo/pages.seo.js`
- Schema/JSON-LD logic → `src/seo/schema.js`
- Brand colours → CSS variables in `src/styles/global.css`

## Project structure

```
src/
├── main.jsx            # SSG entry (ViteReactSSG)
├── routes.jsx          # route table
├── Layout.jsx          # Navbar + Footer + global JSON-LD + <Outlet/>
├── seo/                # SEO.jsx, GlobalSEO.jsx, schema.js, site.config.js, pages.seo.js
├── components/         # HeroScene3D, TiltCard, MagneticButton, CursorGlow, FAQ, ...
├── data/               # site.js (content), faq.js, legal.js (privacy + terms)
├── pages/              # Home, Services, Expertise, About, Careers, Contact,
│                       #   PrivacyPolicy, Terms, NotFound
└── styles/             # global.css, pages.css
scripts/                # generate-sitemap.mjs, generate-docs.mjs, build-car.mjs
.github/workflows/      # ci.yml
public/                 # logo, hero image, 3D models, robots.txt, llms.txt, site.webmanifest
```

`public/sitemap.xml` and `dist/` are generated and git-ignored — don't edit them by hand.

## Contact form

`src/pages/Contact.jsx` posts to [FormSubmit](https://formsubmit.co) and needs no backend. It
validates on blur and on submit, carries a honeypot field against bots, and on failure falls
back to opening the visitor's mail client with the message pre-filled so an enquiry is never
lost. The endpoint comes from `formEndpoint()` in `src/seo/site.config.js`.

`_captcha: 'false'` is deliberate — FormSubmit's captcha needs the redirect flow and would
break the AJAX submission. The honeypot is the spam defence.

See the activation note above before going live.
