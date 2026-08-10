# AUTO-CAN Solutions — Full Website Documentation

_Complete reference: overview, links, architecture, integrations, and full source code._

> Sections 1–6 are written by hand. Section 7 is generated from the working tree by
> `npm run docs` — regenerate and commit it whenever the source changes materially.

---

## 1. Overview

**AUTO-CAN Solutions** is an automotive engineering & embedded software company (founded 2013, Jaipur, India; delivery centres in Jaipur and Pune). This repository is its marketing website — a modern, animated, **statically prerendered** React site optimised for search engines and AI answer engines.

| | |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Prerendering** | vite-react-ssg (static HTML per route) |
| **Routing** | React Router 6 |
| **Animation** | Framer Motion 11 (3D tilt, magnetic buttons, cursor glow, particle field) |
| **SEO** | Per-page meta + JSON-LD (Organization, WebSite, ProfessionalService, WebPage, BreadcrumbList, FAQPage, ItemList/Service) |
| **Backend** | None — fully static (no server, no database) |
| **Domain** | https://www.auto-can-solution.com |

---

## 2. Pages & links

| Page | Route | Prerendered file | Purpose |
|------|-------|------------------|---------|
| Home | `/` | `dist/index.html` | Hero, stats, domains, services, timeline, why-us, FAQ, CTA |
| Services | `/services` | `dist/services.html` | 6 core services + domain specialization + FAQ |
| Expertise | `/expertise` | `dist/expertise.html` | Foundational vs next-gen tech, test-case coverage |
| About | `/about` | `dist/about.html` | Company story, timeline, differentiators |
| Careers | `/careers` | `dist/careers.html` | ODC & Deputation models, L&D, Campus Connect |
| Contact | `/contact` | `dist/contact.html` | Contact info + validated enquiry form (posts to FormSubmit) |
| Privacy Policy | `/privacy-policy` | `dist/privacy-policy.html` | What the site collects and why |
| Terms | `/terms-and-conditions` | `dist/terms-and-conditions.html` | Site terms, governed by the courts at Jaipur |
| 404 | `*` | `dist/404.html` | Not-found page (prerendered, plus client fallback) |

**Crawl assets:** `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/site.webmanifest`

`/sitemap.xml` is generated at build time from the route table — see section 3. `vercel.json`
redirects `/privacy` → `/privacy-policy`, `/terms` → `/terms-and-conditions`, and `/v2` → `/`.

---

## 3. Run, build & deploy

```bash
npm ci           # install exactly what package-lock.json pins
npm run dev      # dev server → http://localhost:8013 (port set in vite.config.js)
npm run build    # regenerate sitemap, then static prerender → /dist
npm run preview  # preview production build
npm run lint     # ESLint, including react-hooks and jsx-a11y
npm run sitemap  # regenerate public/sitemap.xml on its own
npm run docs     # regenerate section 7 of this document
```

Prefer **`npm ci`** over `npm install`: it installs strictly from the lockfile and fails loudly
on a broken dependency tree, which is what keeps local, CI, and Vercel builds identical.

`npm run build` runs `scripts/generate-sitemap.mjs` first. That script derives each URL's
`<lastmod>` from the last commit touching the files that render it, and **fails the build** if
`src/routes.jsx` gains or loses a route that the sitemap doesn't account for — so the sitemap
cannot silently drift from the router.

Deploy the **`dist/`** folder to any static host (Vercel, Netlify, Cloudflare Pages, S3, etc.).
No server runtime required. `vercel.json` carries the production config: security headers
(including CSP), cache-control per asset class, `cleanUrls`, and redirects.

**CI** — `.github/workflows/ci.yml` runs `npm ci`, lint, and build on pushes to `main` and on
pull requests, then asserts that every route prerendered, that the generated `dist/sitemap.xml`
is well-formed with the expected URL count and production domain, and that no placeholder text
reached the HTML. (A push to a feature branch with no open PR runs nothing.)

---

## 4. Architecture & "API" / integration details

This is a **static front-end site**. There is **no custom backend API, no database, and no secret keys** anywhere in the codebase.

**Data sources (local, no network):**
- `src/data/site.js` — all company/marketing content
- `src/data/faq.js` — FAQ Q&A (also used for FAQ schema)
- `src/seo/site.config.js` — domain, org & contact config
- `src/seo/pages.seo.js` — per-page titles/descriptions

**External resources used:**
- **Google Fonts** — `https://fonts.googleapis.com` (Space Grotesk, Inter, JetBrains Mono). No API key.
- **FormSubmit** — `https://formsubmit.co`, for contact form delivery (see below). No API key.
- No analytics or trackers are wired in.

Both origins are allow-listed in the Content-Security-Policy in `vercel.json`; adding another
third-party service means widening that policy too.

### Contact form

`src/pages/Contact.jsx` is a real, working form. It validates on blur and on submit, keeps a
honeypot field (`_honey`) against bots, and POSTs JSON to FormSubmit's AJAX endpoint. On
failure it falls back to opening the visitor's mail client with the message pre-filled, so an
enquiry is never simply lost. The endpoint comes from `formEndpoint()` in
`src/seo/site.config.js`.

Two things to know:

1. **Activation is one-time and mandatory.** The first submission to a new address triggers a
   confirmation email from FormSubmit that someone must click. Until that happens, **no
   enquiry is delivered** — and because of the mailto fallback, the site will not look broken.
   Send a test enquiry and confirm it arrives before treating the form as live.
2. **`FORMSUBMIT_TOKEN` keeps the address out of the bundle.** Addressing the endpoint by raw
   email puts `ORG.email` in the JavaScript in plain text. FormSubmit issues a per-address
   random token that routes to the same mailbox; set it and the email drops out of the URL.
   Note this is only a partial win, since the Contact page also publishes the address as a
   visible `mailto:` link by design.

`_captcha: 'false'` is deliberate, not an oversight: FormSubmit's captcha requires the
redirect flow and would break the AJAX submission. The honeypot is the spam defence.

**Optional integrations to add later** (need your keys):
- Google Analytics 4 / Google Tag Manager (add script in `index.html`, and extend the CSP)
- Google Search Console verification meta tag (add in `index.html` or `src/seo/site.config.js`)

---

## 5. SEO / GEO / AEO summary

- **Prerendered HTML** per route (Google + AI crawlers see real content)
- **Per-page** `<title>`, description, canonical, Open Graph, Twitter
- **JSON-LD** graphs: Organization, WebSite, ProfessionalService (site-wide, 404 included);
  WebPage + BreadcrumbList (the eight content pages, not 404); FAQPage (Home, Services);
  ItemList + Service (Services). The helper is named `localBusinessSchema`, but the `@type` it
  emits is `ProfessionalService` — no `LocalBusiness` node appears in the output.
- **AEO:** FAQ content on-page + FAQPage schema (answer-engine friendly)
- **GEO:** `llms.txt` + `robots.txt` allowing GPTBot, PerplexityBot, Google-Extended, ClaudeBot, etc.
- See **SEO-GUIDE.md** for the off-page ranking checklist.

**Still outstanding before launch** — in `src/seo/site.config.js`: `telephone`,
`hq.streetAddress`, `hq.postalCode`, `sameAs`, and `FORMSUBMIT_TOKEN`. Each is omitted from
the emitted JSON-LD while empty, so the site ships safely without them; leave them blank
rather than approximate, as inaccurate business details are a negative trust signal. The
domain is already set consistently across `site.config.js`, `robots.txt`, `sitemap.xml`
(generated) and `llms.txt`.

---

## 6. Project structure

```
autocan-website/
├── index.html
├── package.json  ·  package-lock.json
├── vite.config.js  ·  eslint.config.js  ·  vercel.json
├── README.md  ·  SEO-GUIDE.md  ·  PROJECT-DOCUMENTATION.md
├── .github/workflows/ci.yml        CI: npm ci, lint, build, build assertions
├── scripts/
│   ├── generate-sitemap.mjs        public/sitemap.xml (runs in npm run build)
│   ├── generate-docs.mjs           section 7 of this document
│   └── build-car.mjs               3D model preprocessing
├── public/
│   ├── logo.png · hero-graphic.png/.webp · og-image.png · icons · favicon
│   ├── car.glb · human.glb         hero 3D models
│   ├── AUTO-CAN_Solutions_Portfolio.pdf
│   └── robots.txt · sitemap.xml · llms.txt · site.webmanifest
└── src/
    ├── main.jsx  ·  routes.jsx  ·  Layout.jsx
    ├── seo/      (site.config.js, schema.js, SEO.jsx, GlobalSEO.jsx, pages.seo.js)
    ├── data/     (site.js, faq.js, legal.js)
    ├── pages/    (Home, Services, Expertise, About, Careers, Contact,
    │              PrivacyPolicy, Terms, NotFound)
    ├── components/ (Navbar, Footer, HeroKit, HeroScene3D, TiltCard,
    │               MagneticButton, CursorGlow, AmbientBackground, DataRiver,
    │               AnimatedHeading, FAQ, Section, Page, ScrollToTop, CountUp,
    │               SmoothScroll, ServiceDiagrams, XpSections, LegalPage,
    │               NotFoundArt, Icons, motionPresets, useVisibleInterval)
    └── styles/   (global.css, pages.css)
```

`dist/` (build output), `dist-ssr/`, and `node_modules/` are generated and git-ignored.

---

<!-- BEGIN GENERATED APPENDIX -->

# 7. Full source code

_Generated from the working tree by `npm run docs` on 2026-08-10. Do not edit by hand —_
_edits here are overwritten. 59 files._

## `package.json`

```json
{
  "name": "autocan-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "AUTO-CAN Solutions \u2014 Automotive Engineering & Embedded Software. Marketing website.",
  "scripts": {
    "predev": "npm run sitemap",
    "dev": "vite",
    "build": "npm run sitemap && vite-react-ssg build",
    "sitemap": "node scripts/generate-sitemap.mjs",
    "docs": "node scripts/generate-docs.mjs",
    "preview": "vite preview",
    "lint": "eslint ."
  },
  "dependencies": {
    "framer-motion": "^11.3.19",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "vite-react-ssg": "0.9.1",
    "three": "^0.165.0",
    "lenis": "^1.1.14"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0",
    "@eslint/js": "^9.9.0",
    "eslint": "^9.9.0",
    "eslint-plugin-jsx-a11y": "^6.9.0",
    "eslint-plugin-react": "^7.35.0",
    "eslint-plugin-react-hooks": "^5.2.0",
    "globals": "^15.9.0"
  },
  "engines": {
    "node": ">=20"
  }
}
```

## `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 8013,
    open: true
  },
  build: {
    target: 'es2020',              // smaller output, no legacy transpiling
    cssCodeSplit: true,
    assetsInlineLimit: 4096,       // inline tiny assets, kill extra requests
    reportCompressedSize: false,   // faster builds
    minify: 'esbuild',
    rollupOptions: {
      output: {
        // Split vendor code so the small React/UI runtime caches separately
        // from the big (lazy) three.js bundle.
        manualChunks(id) {
          if (!id.includes('node_modules')) return
          if (id.includes('three')) return 'three'
          if (id.includes('react') || id.includes('scheduler')) return 'react'
          if (id.includes('framer-motion')) return 'motion'
          return 'vendor'
        },
      },
    },
    chunkSizeWarningLimit: 700,
  },
})
```

## `vercel.json`

```json
{
  "$schema": "https://openapi.vercel.sh/vercel.json",
  "buildCommand": "npm run build",
  "outputDirectory": "dist",
  "cleanUrls": true,
  "trailingSlash": false,
  "redirects": [
    { "source": "/v2", "destination": "/", "permanent": true },
    { "source": "/privacy", "destination": "/privacy-policy", "permanent": true },
    { "source": "/terms", "destination": "/terms-and-conditions", "permanent": true }
  ],
  "headers": [
    {
      "source": "/(.*)",
      "headers": [
        { "key": "X-Content-Type-Options", "value": "nosniff" },
        { "key": "X-Frame-Options", "value": "DENY" },
        { "key": "Referrer-Policy", "value": "strict-origin-when-cross-origin" },
        { "key": "Permissions-Policy", "value": "camera=(), microphone=(), geolocation=(), interest-cohort=(), payment=(), usb=()" },
        { "key": "Strict-Transport-Security", "value": "max-age=63072000; includeSubDomains; preload" },
        { "key": "Cross-Origin-Opener-Policy", "value": "same-origin" },
        { "key": "X-DNS-Prefetch-Control", "value": "on" },
        {
          "key": "Content-Security-Policy",
          "value": "default-src 'self'; base-uri 'self'; object-src 'none'; frame-ancestors 'none'; form-action 'self'; script-src 'self' 'unsafe-inline'; style-src 'self' 'unsafe-inline' https://fonts.googleapis.com; font-src 'self' https://fonts.gstatic.com data:; img-src 'self' data: blob:; connect-src 'self' https://formsubmit.co; worker-src 'self' blob:; manifest-src 'self'; upgrade-insecure-requests"
        }
      ]
    },
    {
      "source": "/assets/(.*)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }]
    },
    {
      "source": "/static-loader-data/(.*).json",
      "headers": [
        { "key": "Content-Type", "value": "application/json; charset=utf-8" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/static-loader-data-manifest-(.*).json",
      "headers": [
        { "key": "Content-Type", "value": "application/json; charset=utf-8" },
        { "key": "Cache-Control", "value": "public, max-age=31536000, immutable" }
      ]
    },
    {
      "source": "/(.*)\\.(glb|png|webp|jpg|svg|ico|pdf)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=604800, stale-while-revalidate=86400" }]
    },
    {
      "source": "/(sitemap.xml|robots.txt|llms.txt|site.webmanifest)",
      "headers": [{ "key": "Cache-Control", "value": "public, max-age=3600, stale-while-revalidate=86400" }]
    }
  ]
}
```

## `eslint.config.js`

```js
import js from '@eslint/js'
import globals from 'globals'
import react from 'eslint-plugin-react'
import reactHooks from 'eslint-plugin-react-hooks'
import jsxA11y from 'eslint-plugin-jsx-a11y'

/**
 * Flat config. The a11y plugin is deliberately included: most accessibility
 * regressions are introduced during ordinary feature work, and catching them
 * at lint time is far cheaper than catching them in an audit.
 */
export default [
  { ignores: ['dist/**', 'node_modules/**', 'scripts/**'] },
  js.configs.recommended,
  {
    files: ['**/*.{js,jsx}'],
    languageOptions: {
      ecmaVersion: 2022,
      sourceType: 'module',
      globals: { ...globals.browser, ...globals.es2021 },
      parserOptions: { ecmaFeatures: { jsx: true } },
    },
    settings: { react: { version: '18.3' } },
    plugins: { react, 'react-hooks': reactHooks, 'jsx-a11y': jsxA11y },
    rules: {
      ...react.configs.recommended.rules,
      ...reactHooks.configs.recommended.rules,
      ...jsxA11y.configs.recommended.rules,
      'react/react-in-jsx-scope': 'off',
      'react/prop-types': 'off',
      // React 18 wants the lowercase DOM attribute here; the plugin's rule is
      // written for React 19's camelCase support.
      'react/no-unknown-property': ['error', { ignore: ['fetchpriority'] }],
      'no-unused-vars': ['warn', { argsIgnorePattern: '^_', varsIgnorePattern: '^_' }],
      'no-console': ['warn', { allow: ['warn', 'error'] }],
    },
  },
]
```

## `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0, viewport-fit=cover" />

    <title>AUTO-CAN Solutions | Automotive Embedded Software &amp; HiL Testing</title>
    <meta name="description" content="AUTO-CAN Solutions — automotive embedded software and engineering company. HiL testing, AUTOSAR, ADAS, CAN/LIN/UDS stacks, test automation and R&D for OEMs and Tier-1 suppliers." />
    <meta name="author" content="AUTO-CAN Solutions" />
    <meta name="theme-color" content="#04060b" />
    <meta name="color-scheme" content="dark" />
    <meta name="format-detection" content="telephone=no" />

    <link rel="icon" href="/favicon.ico" sizes="48x48" />
    <link rel="icon" type="image/png" href="/icon-192.png" sizes="192x192" />
    <link rel="apple-touch-icon" href="/apple-touch-icon.png" />
    <link rel="manifest" href="/site.webmanifest" />

    <!-- Fonts: connect early, then load non-blocking (display=swap paints text immediately) -->
    <!-- The brand mark is in the first viewport on every route and measures as
         the LCP element once the text entrance is factored out. -->
    <link rel="preload" as="image" href="/logo.png" fetchpriority="high" />

    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link
      rel="preload"
      as="style"
      href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap"
      onload="this.onload=null;this.rel='stylesheet'"
    />
    <noscript><link rel="stylesheet" href="https://fonts.googleapis.com/css2?family=Space+Grotesk:wght@500;600;700&family=Inter:wght@400;500;600&family=JetBrains+Mono:wght@500&display=swap" /></noscript>

    <!-- Metric-matched fallbacks: text renders in the system font at the exact
         width the webfont will occupy, so the swap causes no layout shift. -->
    <style>
      @font-face {
        font-family: 'Inter Fallback';
        src: local('Arial'), local('Helvetica'), local('Liberation Sans');
        size-adjust: 107%; ascent-override: 90%; descent-override: 22%; line-gap-override: 0%;
      }
      @font-face {
        font-family: 'Grotesk Fallback';
        src: local('Arial'), local('Helvetica'), local('Liberation Sans');
        size-adjust: 105%; ascent-override: 96%; descent-override: 24%; line-gap-override: 0%;
      }
    </style>

    <!-- The 3D models (~910 KB) are fetched by the hero scene itself, only on
         the route that shows it and only once it scrolls into view. Prefetching
         them here downloaded ~900 KB on every page, including pages with no 3D. -->
  </head>
  <body>
    <div id="root"></div>
    <script type="module" src="/src/main.jsx"></script>
  </body>
</html>
```

## `src/main.jsx`

```jsx
import { ViteReactSSG } from 'vite-react-ssg'
import { createBrowserRouter } from 'react-router-dom'
import { routes } from './routes'
import './styles/global.css'
import './styles/pages.css'

// This site has no route loaders. vite-react-ssg still injects client loaders that
// fetch static-loader-data/*.json on every in-app navigation. When that request
// returns HTML (404 / soft-fallback), React Router crashes with:
//   Unexpected token '<', "<!DOCTYPE "... is not valid JSON
// Strip those loaders so client-side redirects/navigation stay resilient on Vercel.
function stripClientLoaders(routeList) {
  return routeList.map((route) => {
    const next = { ...route }
    delete next.loader
    if (Array.isArray(next.children)) next.children = stripClientLoaders(next.children)
    return next
  })
}

export const createRoot = ViteReactSSG({
  routes,
  customCreateRouter: (dataRoutes, opts) =>
    createBrowserRouter(stripClientLoaders(dataRoutes), opts),
})
```

## `src/routes.jsx`

```jsx
import Layout from './Layout'
import Home from './pages/Home'
import Services from './pages/Services'
import Expertise from './pages/Expertise'
import About from './pages/About'
import Careers from './pages/Careers'
import Contact from './pages/Contact'
import NotFound from './pages/NotFound'
import PrivacyPolicy from './pages/PrivacyPolicy'
import Terms from './pages/Terms'
export const routes = [
  {
    path: '/',
    element: <Layout />,
    children: [
      { index: true, element: <Home /> },
      { path: 'services', element: <Services /> },
      { path: 'expertise', element: <Expertise /> },
      { path: 'about', element: <About /> },
      { path: 'careers', element: <Careers /> },
      { path: 'contact', element: <Contact /> },
      { path: 'privacy-policy', element: <PrivacyPolicy /> },
      { path: 'terms-and-conditions', element: <Terms /> },
      { path: '404', element: <NotFound /> },
      { path: '*', element: <NotFound /> },
    ],
  },
]
```

## `src/Layout.jsx`

```jsx
import { Outlet } from 'react-router-dom'
import { MotionConfig } from 'framer-motion'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import SmoothScroll from './components/SmoothScroll'
import CursorGlow from './components/CursorGlow'
import AmbientBackground from './components/AmbientBackground'
import GlobalSEO from './seo/GlobalSEO'
export default function Layout() {
  return (
    <MotionConfig reducedMotion="user">
      <GlobalSEO />
      <SmoothScroll />
      <ScrollToTop />
      <AmbientBackground />
      <CursorGlow />
      <a href="#main-content" className="skip-link">Skip to main content</a>
      <Navbar />
      <main id="main-content"><Outlet /></main>
      <Footer />
    </MotionConfig>
  )
}
```

## `src/seo/GlobalSEO.jsx`

```jsx
import { Head } from 'vite-react-ssg'
import { organizationSchema, websiteSchema, localBusinessSchema, graph } from './schema'

// Site-wide JSON-LD injected on every prerendered page (single source of truth).
export default function GlobalSEO() {
  const data = graph([organizationSchema(), websiteSchema(), localBusinessSchema()])
  return (
    <Head>
      <script type="application/ld+json">{JSON.stringify(data)}</script>
    </Head>
  )
}
```

## `src/seo/SEO.jsx`

```jsx
import { Head } from 'vite-react-ssg'
import { SITE_URL, ORG } from './site.config'
import { webPageSchema, breadcrumbSchema, faqSchema, graph } from './schema'

/**
 * Per-page <head> tags + JSON-LD, baked into the prerendered HTML.
 *
 * `seo.type` optionally narrows the schema.org WebPage subtype
 * (AboutPage / ContactPage / CollectionPage) for richer entity understanding.
 */
export default function SEO({ seo, faqs, extraNodes = [], noindex = false }) {
  const url = SITE_URL + seo.path
  const img = SITE_URL + ORG.ogImage
  const imgAlt = seo.imageAlt || `${ORG.name} — ${ORG.slogan}`

  const nodes = [
    webPageSchema(seo),
    seo.breadcrumb && breadcrumbSchema(seo.breadcrumb),
    faqs?.length && faqSchema(faqs),
    ...extraNodes,
  ]

  return (
    <Head>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <link rel="canonical" href={url} />
      <meta
        name="robots"
        content={noindex ? 'noindex, nofollow' : 'index, follow, max-image-preview:large, max-snippet:-1, max-video-preview:-1'}
      />

      {/* Open Graph */}
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={ORG.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:image:secure_url" content={img} />
      <meta property="og:image:type" content="image/png" />
      <meta property="og:image:width" content={String(ORG.ogImageSize.width)} />
      <meta property="og:image:height" content={String(ORG.ogImageSize.height)} />
      <meta property="og:image:alt" content={imgAlt} />
      <meta property="og:locale" content="en_US" />

      {/* Twitter / X */}
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={img} />
      <meta name="twitter:image:alt" content={imgAlt} />

      <script type="application/ld+json">{JSON.stringify(graph(nodes))}</script>
    </Head>
  )
}
```

## `src/seo/pages.seo.js`

```js
export const pageSeo = {
  home: {
    path: '/', title: 'AUTO-CAN Solutions | Automotive Embedded Software & HiL Testing',
    description: 'AUTO-CAN Solutions is an automotive embedded software and engineering company (est. 2013, Jaipur India). HiL testing, AUTOSAR, ADAS, CAN/LIN/UDS stacks, test automation and R&D for OEMs and Tier-1 suppliers.',
    keywords: 'automotive embedded software, HiL testing, AUTOSAR, ADAS, ISO 26262, CAN LIN UDS, ECU testing, automotive engineering India',
    breadcrumb: [{ name: 'Home', path: '/' }],
  },
  services: {
    path: '/services', type: 'CollectionPage', title: 'Automotive Engineering Services | AUTO-CAN Solutions',
    description: 'End-to-end automotive embedded services: embedded SW stacks (BSW, CAN, LIN, UDS), engineering tools, test automation, HiL & V&V, and embedded hardware design.',
    keywords: 'automotive software services, embedded software stacks, test automation framework, HiL V&V, bootloader flashing tool, calibration tool',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }],
  },
  expertise: {
    path: '/expertise', type: 'CollectionPage', title: 'Domain Expertise & Standards | AUTO-CAN Solutions',
    description: 'Foundational and next-generation automotive expertise: MISRA C, Embedded Linux, CAN, FlexRay, AUTOSAR, ISO 26262, OTA, ADAS, Automotive Ethernet, cybersecurity and V2X.',
    keywords: 'AUTOSAR, ISO 26262, automotive ethernet, MISRA C, FlexRay, ADAS, OTA updates, V2X, automotive cybersecurity',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Expertise', path: '/expertise' }],
  },
  about: {
    path: '/about', type: 'AboutPage', title: 'About AUTO-CAN Solutions | A Decade of Automotive Engineering',
    description: 'Founded in 2013 in Jaipur, AUTO-CAN Solutions grew from HiL testing into a full-stack automotive embedded engineering partner. Learn our story, timeline and differentiators.',
    keywords: 'AUTO-CAN Solutions about, automotive engineering company India, HiL testing company, embedded software company Jaipur',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }],
  },
  careers: {
    path: '/careers', type: 'CollectionPage', title: 'Careers, Engagement Models & Campus Connect | AUTO-CAN Solutions',
    description: 'ODC and Deputation engagement models, structured Learning & Development, and Campus Connect partnerships that turn fresh talent into automotive embedded engineers.',
    keywords: 'automotive engineering careers, ODC model, deputation model, campus connect, automotive embedded training, Jaipur Pune delivery centres',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }],
  },
  privacy: {
    path: '/privacy-policy', title: 'Privacy Policy | AUTO-CAN Solutions',
    description: 'How AUTO-CAN Solutions handles information submitted through this website — what we collect, how it is used, third-party services, retention, and your rights.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Privacy Policy', path: '/privacy-policy' }],
  },
  terms: {
    path: '/terms-and-conditions', title: 'Terms & Conditions | AUTO-CAN Solutions',
    description: 'The terms governing use of the AUTO-CAN Solutions website, including permitted use, intellectual property, disclaimers, and limitation of liability.',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Terms & Conditions', path: '/terms-and-conditions' }],
  },
  contact: {
    path: '/contact', type: 'ContactPage', title: 'Contact AUTO-CAN Solutions | Automotive Embedded Partner',
    description: 'Talk to AUTO-CAN Solutions about your automotive program. Same-day deployment, flexible engagement models, and regulatory experience across NA, Europe, Japan and APAC.',
    keywords: 'contact AUTO-CAN Solutions, automotive embedded partner, hire automotive engineers, HiL testing services',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }],
  },
}
```

## `src/seo/schema.js`

```js
import { SITE_URL, ORG } from './site.config'
const abs = (p) => (p?.startsWith('http') ? p : SITE_URL + (p || ''))

function postalAddress(a) {
  const out = { '@type': 'PostalAddress', addressLocality: a.addressLocality, addressCountry: a.addressCountry }
  if (a.addressRegion) out.addressRegion = a.addressRegion
  if (a.streetAddress) out.streetAddress = a.streetAddress
  if (a.postalCode) out.postalCode = a.postalCode
  return out
}

export function organizationSchema() {
  const org = {
    '@type': 'Organization',
    '@id': SITE_URL + '/#organization',
    name: ORG.name,
    legalName: ORG.legalName,
    url: SITE_URL + '/',
    logo: { '@type': 'ImageObject', url: abs(ORG.logo) },
    slogan: ORG.slogan,
    foundingDate: ORG.founded,
    email: ORG.email,
    address: postalAddress(ORG.hq),
    areaServed: ORG.areaServed,
    knowsAbout: [
      'Automotive embedded software', 'Hardware-in-the-Loop testing', 'AUTOSAR',
      'ISO 26262 functional safety', 'ADAS', 'Automotive Ethernet', 'CAN LIN UDS',
      'OTA updates', 'V2X', 'Automotive cybersecurity',
    ],
  }
  org.contactPoint = [{
    '@type': 'ContactPoint',
    contactType: 'sales',
    email: ORG.email,
    areaServed: ORG.areaServed,
    availableLanguage: ['en'],
    ...(ORG.telephone ? { telephone: ORG.telephone } : {}),
  }]
  if (ORG.telephone) org.telephone = ORG.telephone
  if (ORG.sameAs?.length) org.sameAs = ORG.sameAs
  return org
}

export function localBusinessSchema() {
  const biz = {
    '@type': 'ProfessionalService',
    '@id': SITE_URL + '/#localbusiness',
    name: ORG.name,
    image: abs(ORG.ogImage),
    url: SITE_URL + '/',
    email: ORG.email,
    priceRange: '$$',
    address: postalAddress(ORG.hq),
    areaServed: ORG.areaServed,
    parentOrganization: { '@id': SITE_URL + '/#organization' },
  }
  if (ORG.telephone) biz.telephone = ORG.telephone
  return biz
}

export function websiteSchema() {
  return {
    '@type': 'WebSite',
    '@id': SITE_URL + '/#website',
    url: SITE_URL + '/',
    name: ORG.name,
    publisher: { '@id': SITE_URL + '/#organization' },
    inLanguage: 'en',
  }
}

export function webPageSchema({ path, title, description, type }) {
  return {
    '@type': type || 'WebPage',
    '@id': SITE_URL + path + '#webpage',
    url: SITE_URL + path,
    name: title,
    description,
    isPartOf: { '@id': SITE_URL + '/#website' },
    about: { '@id': SITE_URL + '/#organization' },
    inLanguage: 'en',
    primaryImageOfPage: { '@type': 'ImageObject', url: abs(ORG.ogImage) },
  }
}

export function breadcrumbSchema(items) {
  return {
    '@type': 'BreadcrumbList',
    itemListElement: items.map((it, i) => ({
      '@type': 'ListItem', position: i + 1, name: it.name, item: SITE_URL + it.path,
    })),
  }
}

export function faqSchema(faqs) {
  return {
    '@type': 'FAQPage',
    mainEntity: faqs.map((f) => ({
      '@type': 'Question', name: f.q,
      acceptedAnswer: { '@type': 'Answer', text: f.a },
    })),
  }
}

export function serviceSchema(services) {
  return {
    '@type': 'ItemList',
    name: 'AUTO-CAN Solutions — Core Services',
    itemListElement: services.map((s, i) => ({
      '@type': 'ListItem', position: i + 1,
      item: { '@type': 'Service', name: s.title, description: s.text, provider: { '@id': SITE_URL + '/#organization' } },
    })),
  }
}

// Wrap an array of node objects into a single @graph document
export function graph(nodes) {
  return { '@context': 'https://schema.org', '@graph': nodes.filter(Boolean) }
}
```

## `src/seo/site.config.js`

```js
// ── Central SEO config ─────────────────────────────────────────────
// Single source of truth for the domain, organisation identity, and the
// address/contact data that feeds the JSON-LD (Organization, LocalBusiness).
//
// Every optional field below is omitted from the emitted schema when left
// empty (see src/seo/schema.js), so a blank value is always safe. Never put
// approximate or placeholder contact data here — search engines treat
// inaccurate business details as a trust signal against the site. Fill each
// field once the real value is confirmed.
export const SITE_URL = 'https://www.auto-can-solution.com'
export const ORG = {
  name: 'AUTO-CAN Solutions',
  legalName: 'AUTO-CAN Solutions',
  slogan: 'Driven by AI. Powered by Innovation.',
  founded: '2013',
  logo: '/logo.png',
  ogImage: '/og-image.png',
  ogImageSize: { width: 1200, height: 630 },
  email: 'info@auto-can.in',

  // Format as an international number, e.g. '+91-141-4012345'.
  telephone: '',

  // Public profiles that confirm the entity, e.g.
  // 'https://www.linkedin.com/company/auto-can-solutions'
  sameAs: [],

  // Registered head office. Supplying streetAddress + postalCode together
  // unlocks the full LocalBusiness rich result; locality alone still yields a
  // valid, if less detailed, address block.
  hq: {
    streetAddress: '',
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '', // Jaipur postcodes are in the 302xxx range
    addressCountry: 'IN',
  },
  deliveryCentres: [
    { addressLocality: 'Jaipur', addressRegion: 'Rajasthan', addressCountry: 'IN' },
    { addressLocality: 'Pune', addressRegion: 'Maharashtra', addressCountry: 'IN' },
  ],
  areaServed: ['North America', 'Europe', 'Japan', 'APAC', 'India'],
}

// ── Contact form delivery ──────────────────────────────────────────
// The enquiry form posts to FormSubmit. Addressing it by raw email puts
// ORG.email in the client bundle in plain text, where scrapers will find it.
// FormSubmit issues a random token per address (shown on your FormSubmit
// dashboard after the address is activated) that routes to the same mailbox
// without revealing it — set it here and the email drops out of the bundle.
//
// Activation is one-time: the first submission to a new address triggers a
// confirmation email that must be clicked before any enquiry is delivered.
export const FORMSUBMIT_TOKEN = '' // e.g. 'a1b2c3d4e5f6...' — falls back to ORG.email

export const formEndpoint = () =>
  `https://formsubmit.co/ajax/${FORMSUBMIT_TOKEN || ORG.email}`
```

## `src/data/faq.js`

```js
// AEO/GEO answer content — concise, factual Q&A used both on-page and in FAQPage schema.
export const faqs = [
  { q: 'What does AUTO-CAN Solutions do?',
    a: 'AUTO-CAN Solutions is an automotive engineering and embedded software company founded in 2013 in Jaipur, India. It delivers Hardware-in-the-Loop (HiL) testing, embedded software stacks (BSW, CAN, LIN, UDS), test automation, embedded hardware, and R&D in AUTOSAR, ADAS, OTA and V2X for OEMs and Tier-1 suppliers.' },
  { q: 'Where is AUTO-CAN Solutions located?',
    a: 'AUTO-CAN Solutions is headquartered in Jaipur, Rajasthan, India, and operates delivery centres in Jaipur and Pune.' },
  { q: 'What engagement models does AUTO-CAN offer?',
    a: 'AUTO-CAN offers two models: an ODC (Offshore/On-site Development Centre) model with dedicated engineering pods, and a Deputation model where engineers are embedded directly at the client site. Commercial terms include Time & Material, Work Package, fixed-scope delivery, and risk–reward partnerships.' },
  { q: 'What automotive standards and technologies does AUTO-CAN specialize in?',
    a: 'AUTO-CAN specializes in MISRA C, Embedded Linux, CAN and FlexRay, plus next-generation focus areas including AUTOSAR architecture, ISO 26262 functional safety, Over-the-Air (OTA) updates, ADAS, Automotive Ethernet, automotive cybersecurity and V2X connectivity.' },
  { q: 'How quickly can AUTO-CAN deploy engineers?',
    a: 'AUTO-CAN maintains a 25–45% buffer bench of qualified engineers, enabling same-day resource deployment for on-demand client requirements.' },
]
```

## `src/data/legal.js`

```js
// Legal page content. Written to match how this website actually behaves:
// a static marketing site with a contact form relayed via FormSubmit,
// Google Fonts loaded from Google's CDN, and no analytics/ad trackers.
// Review with AUTO-CAN's legal counsel before relying on this content.

export const legalMeta = {
  updated: '20 July 2026',
  reviewNote:
    'This document reflects how this website currently operates. It is provided for information and does not constitute legal advice.',
}

export const privacySections = [
  { id: 'introduction', title: 'Introduction', body: [
    'AUTO-CAN Solutions (“we”, “us”, “our”) respects your privacy. This policy explains what information this website collects, how it is used, and the choices you have.',
    'This website is an informational site describing our automotive engineering and embedded software services. It does not require an account and does not sell products online.',
  ]},
  { id: 'information-we-collect', title: 'Information We Collect', body: [
    'The only personal information this website collects is what you choose to submit through the contact form:',
  ], list: [
    'Your name',
    'Your company or organisation (optional)',
    'Your work email address',
    'The area you are interested in',
    'The message you write about your programme',
  ], after: [
    'We do not run user accounts, payments, or profiling on this website.',
  ]},
  { id: 'how-information-is-used', title: 'How Information Is Used', body: [
    'Information submitted through the contact form is used solely to respond to your enquiry and to discuss potential engagement with our services. We do not use it for automated decision-making and we do not sell it to third parties.',
  ]},
  { id: 'cookies', title: 'Cookies & Similar Technologies', body: [
    'This website does not set its own tracking or advertising cookies. Essential browser storage may be used by your browser as part of normal page operation. Third-party services referenced below may receive standard technical data (such as your IP address) when their resources load.',
  ]},
  { id: 'third-party-services', title: 'Third-Party Services', body: [
    'The website relies on a small number of third-party services to function:',
  ], list: [
    'Form delivery — contact form submissions are relayed to our mailbox via FormSubmit (formsubmit.co). Your submitted details pass through this service.',
    'Fonts — typefaces are served by Google Fonts (fonts.googleapis.com / fonts.gstatic.com). Loading fonts discloses standard request data such as your IP address to Google.',
    'Hosting — the website is hosted on Vercel, which may keep standard server logs (IP address, browser type, pages requested) for security and operations.',
  ], after: [
    'Each of these providers processes data under its own privacy policy.',
  ]},
  { id: 'analytics', title: 'Analytics', body: [
    'This website does not currently include analytics or advertising trackers. If analytics are added in the future, this policy will be updated first.',
  ]},
  { id: 'data-retention', title: 'Data Retention', body: [
    'Contact enquiries are kept for as long as needed to handle your enquiry and any resulting business relationship, after which they are deleted or archived in line with our internal practice.',
  ]},
  { id: 'data-security', title: 'Data Security', body: [
    'The website is intended to be served over HTTPS, and form submissions are transmitted over encrypted connections. No method of transmission or storage is completely secure, and we cannot guarantee absolute security.',
  ]},
  { id: 'your-rights', title: 'Your Rights', body: [
    'You may ask us to access, correct, or delete the personal information you have submitted to us. To make a request, contact us at info@auto-can.in. Applicable statutory rights depend on your jurisdiction.',
  ]},
  { id: 'third-party-links', title: 'Third-Party Links', body: [
    'Pages on this website may link to external websites. We are not responsible for the content or privacy practices of those sites.',
  ]},
  { id: 'childrens-privacy', title: 'Children’s Privacy', body: [
    'This website is intended for business audiences and is not directed at children. We do not knowingly collect personal information from children.',
  ]},
  { id: 'changes', title: 'Changes to This Policy', body: [
    'We may update this policy from time to time. The “Last updated” date at the top of this page reflects the latest revision. Material changes will be reflected on this page.',
  ]},
  { id: 'contact', title: 'Contact', body: [
    'For privacy questions or requests, contact AUTO-CAN Solutions at info@auto-can.in, or write to us at our headquarters in Jaipur, Rajasthan, India.',
  ]},
]

export const termsSections = [
  { id: 'acceptance', title: 'Acceptance of Terms', body: [
    'By accessing or using this website you agree to these Terms & Conditions. If you do not agree, please do not use the website.',
  ]},
  { id: 'website-use', title: 'Use of the Website', body: [
    'This website provides information about AUTO-CAN Solutions and its automotive engineering and embedded software services. You may browse the site and contact us through the form for legitimate business purposes.',
  ]},
  { id: 'prohibited-use', title: 'Prohibited Use', body: [
    'You agree not to:',
  ], list: [
    'Attempt to disrupt, overload, or gain unauthorised access to the website or its hosting infrastructure',
    'Use the contact form to send unlawful, deceptive, or abusive content, or unsolicited bulk messages',
    'Scrape, republish, or misrepresent the website’s content as your own',
    'Use the website in any way that violates applicable law',
  ]},
  { id: 'intellectual-property', title: 'Intellectual Property', body: [
    'Unless otherwise indicated, the content of this website — including text, graphics, illustrations, logos, and page design — belongs to AUTO-CAN Solutions or its licensors and is protected by applicable intellectual property laws. Trademarks and product names of third parties (for example, vehicle manufacturers or standards bodies mentioned in a descriptive context) belong to their respective owners.',
    'You may view and print pages for your own business evaluation of our services. Any other reproduction or distribution requires our prior written consent.',
  ]},
  { id: 'information-accuracy', title: 'Information Accuracy', body: [
    'We aim to keep the information on this website accurate and current, but it is provided for general information only and may change without notice. Descriptions of capabilities and services do not constitute a binding offer; specific engagements are governed by separately agreed contracts.',
  ]},
  { id: 'service-information', title: 'Service Information', body: [
    'References to engagement models, capacity, timelines, or technical capabilities describe our general way of working. The applicable scope, deliverables, and commercial terms for any engagement are defined exclusively in the written agreement executed for that engagement.',
  ]},
  { id: 'user-submissions', title: 'Enquiries & Submissions', body: [
    'Information you send through the contact form is handled as described in our Privacy Policy. Do not submit confidential information through the form; a non-disclosure agreement can be arranged before sharing sensitive programme details.',
  ]},
  { id: 'third-party-links', title: 'Third-Party Links & Services', body: [
    'The website may reference or link to third-party websites and services. We do not control them and are not responsible for their content, availability, or practices.',
  ]},
  { id: 'disclaimer', title: 'Disclaimer', body: [
    'This website and its content are provided “as is” and “as available”, without warranties of any kind, whether express or implied, including fitness for a particular purpose, accuracy, or non-infringement, to the extent permitted by law.',
  ]},
  { id: 'limitation-of-liability', title: 'Limitation of Liability', body: [
    'To the maximum extent permitted by applicable law, AUTO-CAN Solutions shall not be liable for any indirect, incidental, or consequential damages arising from the use of, or inability to use, this website or its content.',
  ]},
  { id: 'governing-law', title: 'Governing Law', body: [
    'These terms are governed by the laws of India, and disputes are subject to the jurisdiction of the courts at Jaipur, Rajasthan.',
  ]},
  { id: 'changes', title: 'Changes to These Terms', body: [
    'We may revise these Terms & Conditions from time to time. The “Last updated” date reflects the latest revision. Continued use of the website after changes constitutes acceptance of the revised terms.',
  ]},
  { id: 'contact', title: 'Contact', body: [
    'Questions about these terms can be sent to info@auto-can.in.',
  ]},
]
```

## `src/data/site.js`

```js
// Central content source — all copy drawn from the AUTO-CAN Solutions Overview deck.

export const company = {
  name: 'AUTO-CAN Solutions',
  tagline: 'Driven by AI. Powered by Innovation.',
  kicker: 'Automotive Engineering & Embedded Software',
  hero: 'A decade of engineering trust in the automotive embedded software domain.',
  intro: 'AUTO-CAN Solutions is a specialist automotive embedded software and engineering partner, founded in 2013 in Jaipur, India. What began as a focused Hardware-in-the-Loop (HiL) testing practice has grown, one vertical at a time, into full-cycle capability across Testing, Development, and R&D — a trusted engineering partner to OEMs and Tier-1 suppliers worldwide, backed by a buffered engineering bench and in-house staffing, people management, and payroll support.',
  mission: 'To be the specialist engineering partner automotive OEMs and Tier-1 suppliers turn to when a program can’t afford to get embedded software wrong.',
  founded: '2013',
  location: 'Jaipur, Rajasthan, India',
  deliveryCentre: 'Jaipur · Pune',
  email: 'info@auto-can.in',
}

export const stats = [
  { value: 10, suffix: '+', label: 'Years in automotive embedded engineering' },
  { value: 6, suffix: '', label: 'Specialized capability verticals' },
  { value: 45, suffix: '%', label: 'Buffer bench (25–45%) for rapid scale-up' },
  { value: 2, suffix: '', label: 'Delivery locations: Jaipur · Pune' },
]

export const timeline = [
  { year: '2013', title: 'HiL Testing', text: 'Company incepted in Jaipur — automotive Hardware-in-the-Loop testing, the founding capability.' },
  { year: '2015', title: 'Test Tool Development', text: 'Dedicated Development & Testing Tool Development vertical launched.' },
  { year: '2016', title: 'Embedded Hardware', text: 'Embedded Hardware vertical spun off from the V&V practice.' },
  { year: '2017', title: 'Embedded Software', text: 'Embedded Software development vertical took shape — full-stack capability complete.' },
  { year: '2019', title: 'People Solution', text: 'End-to-End Workforce Management, Payroll, and Staffing Solutions.' },
  { year: '2021', title: 'Python & AI', text: 'Transforming ideas into intelligent applications using AI, Python, and cutting-edge technologies.' },
]

export const domains = [
  {
    no: '01',
    title: 'Testing',
    points: [
      'HiL, SiL & MiL testing',
      'Integration & system validation',
      'Regulatory & proving-ground testing',
      'Test automation frameworks',
    ],
  },
  {
    no: '02',
    title: 'Development',
    points: [
      'Embedded SW stacks: BSW, CAN, LIN, UDS',
      'Bootloader & flashing tools',
      'Embedded hardware design',
      'Calibration & diagnostic tools',
    ],
  },
  {
    no: '03',
    title: 'R&D',
    points: [
      'AUTOSAR & Functional Safety (ISO 26262)',
      'ADAS & Automotive Ethernet',
      'Cybersecurity & V2X connectivity',
      'OTA and next-gen mobility tech',
    ],
  },
]

export const services = [
  { no: '01', title: 'Embedded SW Stacks', text: 'BSW, CAN, LIN, UDS, Bootloader and other off-the-shelf automotive software stacks.' },
  { no: '02', title: 'Engineering Tools', text: 'Vehicle Simulator, Diagnostic Test Tool, SW Flashing Tool, Calibration Tool.' },
  { no: '03', title: 'Test Automation', text: 'Purpose-built Test Automation Framework for continuous validation.' },
  { no: '04', title: 'Test Case Repository', text: 'Coverage from traditional EMS, BCM, Lighting, HVAC to modern BMS, Infotainment, Connectivity.' },
  { no: '05', title: 'HiL & V&V', text: 'Hardware-in-the-Loop testing and verification & validation — the company’s founding discipline.' },
  { no: '06', title: 'Embedded Hardware', text: 'Hardware design and testing support for functionality, safety, and performance.' },
]

export const expertise = {
  foundational: {
    title: 'Foundational Expertise',
    note: 'Established, production-proven technologies that formed the company’s early engineering foundation.',
    items: ['MISRA C coding standards', 'Embedded Linux', 'CAN protocol & networks', 'FlexRay communication systems'],
  },
  nextGen: {
    title: 'Next-Generation Focus',
    note: 'Actively investing in the technologies shaping the next decade of mobility and connected vehicles.',
    items: [
      'AUTOSAR architecture',
      'Functional Safety (ISO 26262)',
      'Over-the-Air (OTA) updates',
      'ADAS — Advanced Driver Assistance',
      'Automotive Ethernet',
      'Automotive Cybersecurity',
      'V2X connectivity',
    ],
  },
}

export const engagementModels = [
  {
    tag: 'ODC MODEL',
    title: 'Offshore / On-site Development Centre',
    points: [
      'Dedicated engineering pods operating out of our Jaipur or Pune delivery centres',
      'Function as a true extension of the client’s own engineering team',
      'Backed by 25–45% buffer bench strength for rapid scale-up',
      'Best suited for long-term, program-based engagements',
    ],
  },
  {
    tag: 'DEPUTATION MODEL',
    title: 'On-Site Talent Deployment',
    points: [
      'Engineers deployed directly at the client’s site, embedded within their team',
      'Talent remains on AUTO-CAN’s payroll — no direct hiring overhead for the client',
      'Ideal for on-demand, project-specific, or short-to-mid term skill augmentation',
      'Gives engineers direct OEM / Tier-1 site exposure early in their careers',
    ],
  },
]

export const differentiators = [
  'Same-day resource deployment capability',
  'Deep bench of qualified subject matter experts',
  '100% flexibility across customer-specific processes',
  'Long-term, trusted industry presence since 2013',
  'Test-track and proving-ground vehicle testing experience',
]

export const engagementTerms = [
  'Time & Material (T&M)',
  'Work Package (WP) based delivery',
  'Delivery-based fixed-scope projects',
  'Risk–reward partnership models',
]

export const training = [
  { no: '1', title: 'Structured Onboarding', text: 'Every new hire completes a technical induction covering automotive embedded software fundamentals before joining live projects.' },
  { no: '2', title: 'Domain-Aligned Tracks', text: 'Training paths mapped directly to the Testing, Development, and R&D specializations, so learning translates straight into project readiness.' },
  { no: '3', title: 'Mentorship-Led Growth', text: 'Guidance from engineers with 10+ years of automotive domain experience, working alongside trainees on real client programs.' },
  { no: '4', title: 'Hands-On Tooling', text: 'Practical exposure to industry tools — Vehicle Simulator, Diagnostic Test Tool, SW Flashing Tool, Calibration Tool — not just theory.' },
]

export const campus = {
  studentGains: [
    'Structured training in real automotive embedded software domains — Testing, Development & R&D',
    'Hands-on exposure to industry-grade tools: Vehicle Simulator, Diagnostic Test Tool, SW Flashing Tool',
    'Mentorship from engineers with 10+ years of automotive domain experience',
    'A clear career path from trainee to specialist, via the ODC or Deputation model',
  ],
  waysToPartner: ['Campus hiring drives', 'Structured internship programs'],
  clientValue: [
    'Fresh talent trained specifically for automotive embedded software from day one',
    'Continuous pipeline feeding both ODC teams and client Deputation requests',
    'Reduces client ramp-up time — talent arrives pre-trained on domain fundamentals',
  ],
}

export const peoplePayroll = {
  eyebrow: 'People & Payroll',
  title: 'Built to support our people, not just our projects',
  lead: 'Staffing, people management, and payroll — handled in-house, end to end.',
  closing: 'Whether you join through an ODC team or a client Deputation, your staffing, people management, and payroll experience stays the same — consistent, transparent, and fully in-house.',
  items: [
    { no: '1', title: 'Staffing & Resource Planning', text: 'A dedicated staffing team matches every engineer to the right domain — Testing, Development, or R&D — and the right engagement model, from day one.' },
    { no: '2', title: 'People Management', text: 'Every engineer has a named reporting manager and HR point of contact, with regular check-ins, performance reviews, and career-path conversations.' },
    { no: '3', title: 'Payroll & Compliance', text: 'Transparent, on-time payroll with full statutory compliance — PF, ESI, and taxation — whether you’re on an ODC team or deployed on-site under Deputation.' },
    { no: '4', title: 'Benefits & Well-being', text: 'Health insurance, structured leave policies, and support systems built around the realities of working on demanding automotive programs.' },
  ],
}

export const navLinks = [
  { to: '/', label: 'Home' },
  { to: '/services', label: 'Services' },
  { to: '/expertise', label: 'Expertise' },
  { to: '/about', label: 'About' },
  { to: '/careers', label: 'Careers' },
  { to: '/contact', label: 'Contact' },
]
```

## `src/pages/About.jsx`

```jsx
import { motion } from 'framer-motion'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import CountUp from '../components/CountUp'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { fadeUp, scaleIn, staggerFast } from '../components/motionPresets'
import { company, timeline, stats, differentiators } from '../data/site'
export default function About() {
  return (
    <Page>
      <SEO seo={pageSeo.about} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Where It Began</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>A decade of engineering trust, <span className="gradient-text">one vertical at a time.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Incepted in {company.location.split(',')[0]} in {company.founded} as a specialist provider of Hardware-in-the-Loop (HiL) testing, AUTO-CAN steadily broadened its capabilities across the full automotive software development lifecycle.</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 30 }}><div className="container">
        <div className="split tilt-grid">
          <div className="hero-in" style={{ animationDelay: '0.34s' }}>
            <h2 className="section-title">Company background</h2>
            <p className="section-lead">{company.intro}</p>
            <p className="section-lead" style={{ marginTop: 16 }}>The company started as a niche player in vehicle Hardware-in-the-Loop testing — a discipline critical to validating electronic control units (ECUs) before they reach production vehicles. From this focused beginning, it built deep domain expertise along the way.</p>
          </div>
          <Reveal variants={scaleIn}><TiltCard className="card" intensity={12} style={{ padding: 40, textAlign: 'center' }}>
            <div className="tl-year" style={{ fontSize: '0.9rem' }}>YEAR OF INCEPTION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(4rem,10vw,7rem)', lineHeight: 1 }} className="gradient-text"><CountUp to={2013} suffix="" duration={1800} /></div>
            <p style={{ color: 'var(--text-dim)', marginTop: 10 }}>{company.location}</p>
          </TiltCard></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <RevealGroup className="stat-strip" variants={staggerFast}>{stats.map((s) => (
          <motion.div className="stat" key={s.label} variants={fadeUp}><div className="num"><CountUp to={s.value} suffix={s.suffix} /></div><div className="lbl">{s.label}</div></motion.div>
        ))}</RevealGroup>
      </div></section>
      <section className="mission-band" aria-label="Mission">
        <div className="container center">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
          >Our Mission</motion.span>
          <motion.blockquote
            className="mission-quote"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
          >
            {company.mission.split(' ').map((w, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0.12, filter: 'blur(4px)' }, show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.5 } } }}
                className={/wrong/.test(w) ? 'gradient-text' : undefined}
              >{w} </motion.span>
            ))}
          </motion.blockquote>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 20 }}><div className="container">
        <SectionHeader eyebrow="Growth Timeline" title='Building capability, <span class="gradient-text">one vertical at a time</span>' lead="A track record spanning more than a decade in the automotive embedded engineering domain." />
        <Reveal style={{ marginTop: 50, maxWidth: 760 }}><div className="timeline">{timeline.map((t) => (
          <div className="tl-item" key={t.year}><span className="tl-dot" /><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-text">{t.text}</div></div>
        ))}</div></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Business Model & Differentiators" title='Why clients choose <span class="gradient-text">AUTO-CAN</span>' />
        <RevealGroup className="why-list" style={{ marginTop: 30 }}>{differentiators.map((d, i) => (
          <motion.div className="why-item" key={d} variants={fadeUp}><span className="no">{String(i + 1).padStart(2, '0')}</span><p>{d}</p></motion.div>
        ))}</RevealGroup>
        <Reveal className="center" style={{ marginTop: 46 }}><MagneticButton to="/contact" className="btn btn-primary">Partner with us <span className="arrow" aria-hidden="true">→</span></MagneticButton></Reveal>
      </div></section>
    </Page>
  )
}
```

## `src/pages/Careers.jsx`

```jsx
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { motion } from 'framer-motion'
import { fadeUp, scaleIn } from '../components/motionPresets'
import { engagementModels, training, campus, peoplePayroll } from '../data/site'
export default function Careers() {
  return (
    <Page>
      <SEO seo={pageSeo.careers} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Talent · Engagement · Campus Connect</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>Building talent, <span className="gradient-text">the AUTO-CAN way.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Open roles across Testing, Development, and R&D — for freshers and experienced engineers alike. Structured training turns fresh talent into automotive engineers, and flexible engagement models put that talent to work on your programs.</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.34s' }}>
          <div className="section-head">
            <span className="eyebrow">Engagement Models</span>
            <h2 className="section-title">Two ways to work with <span className="gradient-text">our talent</span></h2>
            <p className="section-lead">Built around client convenience and talent growth.</p>
          </div>
        </div>
        <div className="split tilt-grid" style={{ marginTop: 50 }}>{engagementModels.map((m) => (
          <Reveal key={m.tag}><TiltCard className="card" intensity={9} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <span className="model-tag">{m.tag}</span><h3 className="model-title">{m.title}</h3>
            <ul className="pointlist">{m.points.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul>
          </TiltCard></Reveal>
        ))}</div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Learning & Development" title='Structured training, <span class="gradient-text">real project readiness</span>' lead="All training, quality, and HR frameworks operate under AUTO-CAN Solutions — ensuring consistent standards across every engineering team." />
        <RevealGroup className="grid grid-2 tilt-grid" style={{ marginTop: 48 }}>{training.map((t) => (
          <TiltCard className="card icard" key={t.no} variants={fadeUp}><span className="card-num">{t.no.padStart(2, '0')}</span><h3 className="icard__title">{t.title}</h3><p className="icard__text">{t.text}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section pp-section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow={peoplePayroll.eyebrow} title='Built to support <span class="gradient-text">our people</span>, not just our projects' lead={peoplePayroll.lead} />
        <div className="pp-grid" style={{ marginTop: 50 }}>
          <motion.span
            className="pp-rail"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {peoplePayroll.items.map((p, i) => (
            <motion.div
              className="pp-card"
              key={p.no}
              initial={{ opacity: 0, y: 44, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.14, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="pp-card__dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.14, type: 'spring', stiffness: 260, damping: 14 }}
              >{p.no}</motion.span>
              <h3 className="icard__title" style={{ marginTop: 18 }}>{p.title}</h3>
              <p className="icard__text">{p.text}</p>
            </motion.div>
          ))}
        </div>
        <Reveal><p className="pp-closing">{peoplePayroll.closing}</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Campus Connect" title='For colleges & institutes — <span class="gradient-text">real automotive careers</span>' lead="Partner with us to open real automotive engineering careers for your students." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 48 }}>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">What students gain</h3><ul className="pointlist">{campus.studentGains.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">Ways to partner</h3><ul className="pointlist">{campus.waysToPartner.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">Why it matters for clients</h3><ul className="pointlist">{campus.clientValue.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
        </RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Industry-ready experts</span>
          <h2 style={{ marginTop: 18 }}>A talent pipeline built for automotive programs.</h2>
          <p>Fresh talent trained specifically for automotive embedded software from day one — with hands-on experience.</p>
          <MagneticButton to="/contact" className="btn btn-primary">Talk to us about talent <span className="arrow" aria-hidden="true">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
```

## `src/pages/Contact.jsx`

```jsx
import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal } from '../components/Section'
import MagneticButton from '../components/MagneticButton'
import { company, engagementTerms } from '../data/site'
import { formEndpoint } from '../seo/site.config'
import { MailIcon, PinIcon, FactoryIcon, HandshakeIcon } from '../components/Icons'

const INTERESTS = [
  'Embedded software & tooling',
  'HiL / Test automation',
  'R&D — AUTOSAR / ADAS / OTA',
  'ODC / Deputation talent',
  'Campus Connect partnership',
]

const LIMITS = { name: 80, company: 120, email: 254, message: 4000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

/** Pure, synchronous field validation — same rules on blur and on submit. */
function validate(values) {
  const errors = {}
  const name = values.name?.trim() ?? ''
  const email = values.email?.trim() ?? ''
  const message = values.message?.trim() ?? ''

  if (!name) errors.name = 'Please tell us your name.'
  else if (name.length < 2) errors.name = 'That name looks a little short.'
  else if (name.length > LIMITS.name) errors.name = `Please keep this under ${LIMITS.name} characters.`

  if (!email) errors.email = 'We need an email address to reply to.'
  else if (!EMAIL_RE.test(email)) errors.email = 'That doesn’t look like a valid email address.'

  if (!values.interest) errors.interest = 'Choose the area you’d like to discuss.'

  if (!message) errors.message = 'A sentence or two about your program helps us route your enquiry.'
  else if (message.length < 12) errors.message = 'Could you add a little more detail?'
  else if (message.length > LIMITS.message) errors.message = `Please keep this under ${LIMITS.message} characters.`

  if ((values.company ?? '').length > LIMITS.company) {
    errors.company = `Please keep this under ${LIMITS.company} characters.`
  }
  return errors
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const formRef = useRef(null)
  const successRef = useRef(null)

  const readValues = () => {
    const fd = new FormData(formRef.current)
    return Object.fromEntries(fd.entries())
  }

  const handleBlur = useCallback((e) => {
    const field = e.target.name
    if (!field) return
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(readValues()))
  }, [])

  const handleChange = useCallback((e) => {
    const field = e.target.name
    // Only clear errors as the user corrects them — never introduce new ones mid-typing.
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = validate(readValues())
      return next[field] ? prev : { ...prev, [field]: undefined }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = readValues()

    // Honeypot: real users never fill a visually hidden, aria-hidden field.
    if (data._honey) { setStatus('sent'); return }

    const found = validate(data)
    setErrors(found)
    setTouched({ name: true, company: true, email: true, interest: true, message: true })

    const firstBad = ['name', 'email', 'interest', 'message'].find((k) => found[k])
    if (firstBad) {
      formRef.current.querySelector(`[name="${firstBad}"]`)?.focus()
      return
    }

    setStatus('sending')
    delete data._honey

    try {
      const res = await fetch(formEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Website enquiry — ${data.name}${data.company ? ` (${data.company})` : ''}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error(`send failed: ${res.status}`)
      setStatus('sent')
      // Move focus to the confirmation so screen-reader users land on the result.
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('error')
      const body = encodeURIComponent(
        `Name: ${data.name}\nCompany: ${data.company || '-'}\nEmail: ${data.email}\nInterested in: ${data.interest}\n\n${data.message}`
      )
      window.location.href =
        `mailto:${company.email}?subject=${encodeURIComponent('Website enquiry — ' + data.name)}&body=${body}`
    }
  }

  const fieldProps = (name) => ({
    name,
    id: name,
    onBlur: handleBlur,
    onChange: handleChange,
    'aria-invalid': touched[name] && errors[name] ? 'true' : undefined,
    'aria-describedby': touched[name] && errors[name] ? `${name}-error` : undefined,
  })

  const FieldError = ({ name }) =>
    touched[name] && errors[name] ? (
      <span className="field__error" id={`${name}-error`}>
        <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.6v4.2M8 11.2v.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {errors[name]}
      </span>
    ) : null

  const sending = status === 'sending'

  return (
    <Page>
      <SEO seo={pageSeo.contact} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Let’s Work Together</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>Put a proven engineering bench <span className="gradient-text">behind your program.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Tell us about your automotive program and we’ll get back to you with the right engagement model and team.</p></div>
      </div></section>

      <section className="section" style={{ paddingTop: 30 }}><div className="container">
        <div className="contact-grid">
          <Reveal className="contact-info">
            <div className="info-row"><span className="ico"><MailIcon /></span><div><div className="k">Email</div><div className="v"><a href={`mailto:${company.email}`}>{company.email}</a></div></div></div>
            <div className="info-row"><span className="ico"><PinIcon /></span><div><div className="k">Headquarters</div><div className="v">{company.location}</div></div></div>
            <div className="info-row"><span className="ico"><FactoryIcon /></span><div><div className="k">Delivery Centre</div><div className="v">{company.deliveryCentre}</div></div></div>
            <div className="info-row"><span className="ico"><HandshakeIcon /></span><div><div className="k">Engagement models</div><div className="v">{engagementTerms.join(' · ')}</div></div></div>
          </Reveal>

          <Reveal>
            <div className="card contact-card">
              {status === 'sent' ? (
                <motion.div
                  ref={successRef}
                  tabIndex={-1}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="form-success"
                  role="status"
                >
                  <span className="form-success__mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  </span>
                  <strong>Thank you — your message is on its way.</strong>
                  <p>Our team reviews every enquiry personally and will be in touch shortly.</p>
                  <div style={{ marginTop: 16 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => { setStatus('idle'); setErrors({}); setTouched({}) }}>
                      Send another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={sending}>
                  {/* Spam trap — hidden from sighted users and assistive tech alike */}
                  <div className="hp" aria-hidden="true">
                    <label htmlFor="_honey">Leave this field empty</label>
                    <input id="_honey" name="_honey" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="name">Full name <span className="field__req" aria-hidden="true">*</span></label>
                      <input {...fieldProps('name')} type="text" placeholder="Your name" autoComplete="name" maxLength={LIMITS.name} required />
                      <FieldError name="name" />
                    </div>
                    <div className="field">
                      <label htmlFor="company">Company <span className="field__opt">optional</span></label>
                      <input {...fieldProps('company')} type="text" placeholder="Organization" autoComplete="organization" maxLength={LIMITS.company} />
                      <FieldError name="company" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="email">Work email <span className="field__req" aria-hidden="true">*</span></label>
                      <input {...fieldProps('email')} type="email" placeholder="you@company.com" autoComplete="email" inputMode="email" maxLength={LIMITS.email} required />
                      <FieldError name="email" />
                    </div>
                    <div className="field">
                      <label htmlFor="interest">I’m interested in <span className="field__req" aria-hidden="true">*</span></label>
                      <select {...fieldProps('interest')} defaultValue="" required>
                        <option value="" disabled>Select…</option>
                        {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <FieldError name="interest" />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="message">Tell us about your program <span className="field__req" aria-hidden="true">*</span></label>
                    <textarea {...fieldProps('message')} rows={5} placeholder="A few lines about your project, scope and timeline…" maxLength={LIMITS.message} required />
                    <FieldError name="message" />
                  </div>

                  <MagneticButton
                    type="submit"
                    className="btn btn-primary form__submit"
                    disabled={sending}
                    strength={0.5}
                  >
                    {sending ? 'Sending…' : 'Send message'}
                    <span className="arrow" aria-hidden="true">→</span>
                  </MagneticButton>

                  <p className="form__note">
                    We reply from a real inbox — no automated sequences. See our{' '}
                    <a href="/privacy-policy">privacy policy</a>.
                  </p>

                  {/* Single live region announces every state change once */}
                  <div className="form__status" role="status" aria-live="polite">
                    {sending && <span>Sending your message…</span>}
                    {status === 'error' && (
                      <span className="form__status--error" role="alert">
                        We couldn’t reach the form service, so we’ve opened your email client instead.
                        You can also write to us directly at {company.email}.
                      </span>
                    )}
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div></section>
    </Page>
  )
}
```

## `src/pages/Expertise.jsx`

```jsx
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import { fadeUp } from '../components/motionPresets'
import { expertise } from '../data/site'
export default function Expertise() {
  return (
    <Page>
      <SEO seo={pageSeo.expertise} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Domain Expertise & Standards</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>10+ years of <span className="gradient-text">technology depth.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>From foundational, production-proven technologies to the next-generation systems shaping connected and autonomous mobility.</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <div className="split tilt-grid">
          <Reveal><TiltCard className="card" intensity={9} style={{ height: '100%' }}>
            <span className="model-tag">FOUNDATIONAL</span>
            <h2 className="model-title">{expertise.foundational.title}</h2>
            <p className="expertise-note">{expertise.foundational.note}</p>
            <div className="taglist">{expertise.foundational.items.map((i) => <span className="tag" key={i}>{i}</span>)}</div>
          </TiltCard></Reveal>
          <Reveal><TiltCard className="card" intensity={9} style={{ height: '100%' }}>
            <span className="model-tag" style={{ color: 'var(--violet-300)' }}>NEXT-GENERATION</span>
            <h2 className="model-title">{expertise.nextGen.title}</h2>
            <p className="expertise-note">{expertise.nextGen.note}</p>
            <div className="taglist">{expertise.nextGen.items.map((i) => <span className="tag" key={i}>{i}</span>)}</div>
          </TiltCard></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Test Case Repository" title='Validation coverage from <span class="gradient-text">classic to connected</span>' lead="A purpose-built test automation framework and repository spanning traditional and modern automotive systems." />
        <RevealGroup className="grid grid-2 tilt-grid" style={{ marginTop: 46 }}>
          <TiltCard className="card" intensity={9} variants={fadeUp}><h3 className="icard__title">Traditional systems</h3><div className="taglist">{['EMS','BCM','Lighting','HVAC','Body Electronics'].map((t) => <span className="tag" key={t}>{t}</span>)}</div></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp}><h3 className="icard__title">Modern systems</h3><div className="taglist">{['BMS','Infotainment','Connectivity','ADAS','Telematics'].map((t) => <span className="tag" key={t}>{t}</span>)}</div></TiltCard>
        </RevealGroup>
      </div></section>
    </Page>
  )
}
```

## `src/pages/Home.jsx`

```jsx
import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { faqs } from '../data/faq'
import FAQ from '../components/FAQ'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import CountUp from '../components/CountUp'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import AnimatedHeading from '../components/AnimatedHeading'
import { fadeUp, scaleIn, staggerFast } from '../components/motionPresets'
import { HeroVisual, BootConsole } from '../components/HeroKit'
import DataRiver from '../components/DataRiver'
import { Manifesto, VModel, TwinSync } from '../components/XpSections'
import { company, stats, domains, services, timeline, differentiators } from '../data/site'
const marqueeItems = ['HiL Testing','AUTOSAR','ISO 26262','CAN · LIN · UDS','ADAS','Automotive Ethernet','OTA Updates','V2X','Cybersecurity','MISRA C']
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <Page>
      <SEO seo={pageSeo.home} faqs={faqs} />
      <section className="hero" ref={heroRef}>
        <div className="container">
          <motion.div className="hero__inner" style={{ y: yContent, opacity }}>
            {/* The hero entrance is CSS-driven on purpose — see AnimatedHeading.
                Framer would hold this copy at opacity 0 until hydration, which
                made the lead paragraph the LCP element at ~7s on a slow phone. */}
            <div className="hero__copy">
              <span className="eyebrow hero-in" style={{ animationDelay: '0.02s' }}>{company.kicker}</span>
              <AnimatedHeading className="hero__h1" segments={[{ text: 'Engineering the' }, { text: 'software', gradient: true }, { text: 'that moves the modern vehicle.' }]} />
              <p className="hero__lead hero-in" style={{ animationDelay: '0.14s' }}>{company.hero} From Hardware-in-the-Loop testing to AUTOSAR, ADAS and next-gen mobility — AUTO-CAN is the specialist partner behind production-ready embedded systems.</p>
              <BootConsole />
              <div className="hero__actions hero-in" style={{ animationDelay: '0.5s' }}>
                <MagneticButton to="/services" className="btn btn-primary">Explore capabilities <span className="arrow" aria-hidden="true">→</span></MagneticButton>
                <MagneticButton to="/contact" className="btn btn-ghost">Work with us</MagneticButton>
              </div>
              <div className="hero__meta hero-in" style={{ animationDelay: '0.62s' }}>
                <div className="hero__meta-item"><div className="k">Since 2013</div><div className="l">Founded in Jaipur, India</div></div>
                <div className="hero__meta-item"><div className="k">10+ yrs</div><div className="l">Automotive embedded depth</div></div>
                <div className="hero__meta-item"><div className="k">2 Cities</div><div className="l">Jaipur · Pune</div></div>
              </div>
            </div>
            <HeroVisual />
          </motion.div>
        </div>
        <div className="hero__scroll hero-in" aria-hidden="true" style={{ animationDelay: '0.85s' }}><span>Scroll</span><span className="line" /></div>
      </section>
      <div className="marquee" aria-hidden="true">
        <motion.div className="marquee__track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>{[...marqueeItems, ...marqueeItems].map((m, i) => (<span className="marquee__item" key={i}>{m}</span>))}</motion.div>
      </div>
      <section className="section-sm"><div className="container">
        <RevealGroup className="stat-strip" variants={staggerFast}>{stats.map((s) => (
          <motion.div className="stat" key={s.label} variants={fadeUp}><div className="num"><CountUp to={s.value} suffix={s.suffix} /></div><div className="lbl">{s.label}</div></motion.div>
        ))}</RevealGroup>
      </div></section>
      <Manifesto />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Domain Specialization" title='Specialized across <span class="gradient-text">three core domains</span>' lead="Automotive Testing · Development · R&D — a full-stack capability built one vertical at a time." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 54 }}>{domains.map((d) => (
          <TiltCard className="card icard" key={d.no} variants={fadeUp}><span className="domain-num">{d.no}</span><h3 className="icard__title">{d.title}</h3><ul className="pointlist">{d.points.map((p) => (<li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>))}</ul></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <VModel />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Core Services" title='End-to-end automotive <span class="gradient-text">embedded engineering</span>' lead="Off-the-shelf software stacks, purpose-built tooling, and validation frameworks that shorten your path to production." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 54 }}>{services.map((s) => (
          <TiltCard className="card icard" key={s.no} variants={fadeUp}><span className="card-num">{s.no}</span><h3 className="icard__title">{s.title}</h3><p className="icard__text">{s.text}</p></TiltCard>
        ))}</RevealGroup>
        <Reveal className="center" style={{ marginTop: 46 }}><MagneticButton to="/services" className="btn btn-ghost">See all services <span className="arrow" aria-hidden="true">→</span></MagneticButton></Reveal>
      </div></section>
      <TwinSync />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">The AUTO-CAN Journey</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>Building capability, <span className="gradient-text">one vertical at a time.</span></h2>
            <p className="section-lead">An organic, capability-led growth model — adding one specialized vertical at a time — became the hallmark of the company’s approach and the foundation for everything that followed.</p>
            <MagneticButton to="/about" className="btn btn-ghost" style={{ marginTop: 26 }}>Read our story <span className="arrow" aria-hidden="true">→</span></MagneticButton>
          </Reveal>
          <Reveal><div className="timeline">{timeline.map((t) => (
            <div className="tl-item" key={t.year}><span className="tl-dot" /><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-text">{t.text}</div></div>
          ))}</div></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Why Clients Choose AUTO-CAN" title='A partner engineered for <span class="gradient-text">speed and trust</span>' />
        <RevealGroup className="why-list" style={{ marginTop: 30 }}>{differentiators.map((d, i) => (
          <motion.div className="why-item" key={d} variants={fadeUp}><span className="no">{String(i + 1).padStart(2, '0')}</span><p>{d}</p></motion.div>
        ))}</RevealGroup>
      </div></section>
      <FAQ items={faqs} />
      <DataRiver />
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Ready when you are</span>
          <h2 style={{ marginTop: 18 }}>Let’s put a proven engineering bench behind your program.</h2>
          <p>Flexible engagement models, 25–45% buffer capacity, and a decade of proven automotive embedded delivery.</p>
          <MagneticButton to="/contact" className="btn btn-primary" strength={0.5}>Start a conversation <span className="arrow" aria-hidden="true">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
```

## `src/pages/NotFound.jsx`

```jsx
import { Link, useNavigate } from 'react-router-dom'
import { Head } from 'vite-react-ssg'
import Page from '../components/Page'
import NotFoundArt from '../components/NotFoundArt'

export default function NotFound() {
  const navigate = useNavigate()
  return (
    <Page>
      <Head>
        <html lang="en" />
        <title>Signal Lost — Page Not Found | AUTO-CAN Solutions</title>
        <meta name="description" content="This route isn’t on the network. Head back to AUTO-CAN Solutions — automotive embedded software, HiL testing, AUTOSAR and ADAS engineering." />
        <meta name="robots" content="noindex, nofollow" />
        <meta property="og:type" content="website" />
        <meta property="og:site_name" content="AUTO-CAN Solutions" />
        <meta property="og:title" content="Signal Lost — Page Not Found | AUTO-CAN Solutions" />
      </Head>
      <div className="container nf">
        <NotFoundArt />
        <h1 className="nf__title">Signal lost — this route isn’t on the network.</h1>
        <p className="nf__text">
          The page you’re looking for may have moved, changed, or no longer exists.
        </p>
        <div className="nf__actions">
          <Link to="/" className="btn btn-primary">Return home <span className="arrow" aria-hidden="true">→</span></Link>
          <Link to="/services" className="btn btn-ghost">Explore services</Link>
          <button className="btn btn-ghost" onClick={() => navigate(-1)}>Go back</button>
        </div>
        <p className="nf__hint" aria-hidden="true">Tip · tap the broken node to attempt a reconnect</p>
      </div>
    </Page>
  )
}
```

## `src/pages/PrivacyPolicy.jsx`

```jsx
import LegalPage from '../components/LegalPage'
import { pageSeo } from '../seo/pages.seo'
import { privacySections } from '../data/legal'

export default function PrivacyPolicy() {
  return (
    <LegalPage
      seo={pageSeo.privacy}
      eyebrow="Legal"
      title="Privacy Policy"
      sections={privacySections}
    />
  )
}
```

## `src/pages/Services.jsx`

```jsx
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { faqs } from '../data/faq'
import FAQ from '../components/FAQ'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { fadeUp, scaleIn } from '../components/motionPresets'
import { services, domains, engagementTerms } from '../data/site'
import { serviceDiagrams } from '../components/ServiceDiagrams'
import { serviceSchema } from '../seo/schema'
export default function Services() {
  return (
    <Page>
      <SEO seo={pageSeo.services} faqs={faqs} extraNodes={[serviceSchema(services)]} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Core Services</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>End-to-end automotive <span className="gradient-text">embedded software</span> & engineering.</h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Six service lines that cover the full lifecycle — from off-the-shelf software stacks and purpose-built tooling to Hardware-in-the-Loop validation and embedded hardware.</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }} aria-labelledby="service-lines"><div className="container">
        <h2 id="service-lines" className="sr-only">Our six service lines</h2>
        <RevealGroup className="grid grid-3 tilt-grid">{services.map((s) => (
          <TiltCard className="card icard" key={s.no} variants={fadeUp}>{serviceDiagrams[s.no]}<span className="card-num">{s.no}</span><h3 className="icard__title">{s.title}</h3><p className="icard__text">{s.text}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="How We Specialize" title='Three domains, <span class="gradient-text">one delivery bench</span>' lead="Every service maps to deep, production-proven expertise across testing, development and R&D." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 50 }}>{domains.map((d) => (
          <TiltCard className="card icard" key={d.no} variants={fadeUp}><span className="domain-num">{d.no}</span><h3 className="icard__title">{d.title}</h3><ul className="pointlist">{d.points.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <FAQ items={faqs} />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Flexible engagement</span>
          <h2 style={{ marginTop: 18 }}>Delivery structured around your program.</h2>
          <div className="taglist" style={{ justifyContent: 'center', marginTop: 8, marginBottom: 30 }}>{engagementTerms.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          <MagneticButton to="/careers" className="btn btn-primary">See engagement models <span className="arrow" aria-hidden="true">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
```

## `src/pages/Terms.jsx`

```jsx
import LegalPage from '../components/LegalPage'
import { pageSeo } from '../seo/pages.seo'
import { termsSections } from '../data/legal'

export default function Terms() {
  return (
    <LegalPage
      seo={pageSeo.terms}
      eyebrow="Legal"
      title="Terms & Conditions"
      sections={termsSections}
    />
  )
}
```

## `src/components/AmbientBackground.jsx`

```jsx
import { useEffect, useRef } from 'react'

/**
 * Premium ambient layer — deep, luxurious light pools that drift and blend
 * like ink suspended in still water.
 *
 * Motion is STRICTLY continuous: every position comes from smooth sine/cosine
 * curves with no modulo wrapping, no respawns and no random values, so nothing
 * can ever jump, pop or flash. Opacity is constant per pool — the only change
 * is slow positional drift, which the eye reads as calm, expensive movement.
 *
 * Canvas 2D, GPU-friendly (a handful of large radial gradients), capped DPR,
 * paused when the tab is hidden, and rendered as a single still frame for
 * prefers-reduced-motion users.
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let raf, w, h, dpr

    // Rich, restrained palette — deep sapphire, teal and royal indigo.
    // ax/ay = drift amplitude (fraction of viewport), fx/fy = drift speed.
    // Amplitudes are wide but motion is slow: luxurious, never busy.
    const pools = [
      { rgb: [ 56, 152, 224], sx: 0.24, sy: 0.26, ax: 0.13, ay: 0.09, fx: 0.055, fy: 0.041, ph: 0.0, r: 0.62, a: 0.16 },
      { rgb: [ 79,  92, 214], sx: 0.76, sy: 0.30, ax: 0.11, ay: 0.10, fx: 0.043, fy: 0.062, ph: 1.9, r: 0.66, a: 0.15 },
      { rgb: [ 34, 168, 176], sx: 0.52, sy: 0.76, ax: 0.14, ay: 0.08, fx: 0.037, fy: 0.052, ph: 3.6, r: 0.58, a: 0.13 },
      { rgb: [ 24, 190, 214], sx: 0.34, sy: 0.58, ax: 0.10, ay: 0.11, fx: 0.066, fy: 0.033, ph: 5.1, r: 0.44, a: 0.10 },
      { rgb: [122, 132, 236], sx: 0.68, sy: 0.66, ax: 0.12, ay: 0.09, fx: 0.048, fy: 0.058, ph: 2.7, r: 0.40, a: 0.09 },
    ]

    const draw = (timeMs) => {
      const t = timeMs / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'   // pigments blend, never flicker
      const maxSide = Math.max(w, h)
      for (const p of pools) {
        // Pure continuous curves — bounded, smooth, no wrap-around jumps.
        const cx = (p.sx + Math.sin(t * p.fx * Math.PI * 2 + p.ph) * p.ax) * w
        const cy = (p.sy + Math.cos(t * p.fy * Math.PI * 2 + p.ph * 1.3) * p.ay) * h
        const rad = p.r * maxSide
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const [r, gc, b] = p.rgb
        g.addColorStop(0,    `rgba(${r},${gc},${b},${p.a})`)
        g.addColorStop(0.42, `rgba(${r},${gc},${b},${p.a * 0.55})`)
        g.addColorStop(0.72, `rgba(${r},${gc},${b},${p.a * 0.18})`)
        g.addColorStop(1,    `rgba(${r},${gc},${b},0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2)
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) draw(0)
    }

    const frame = (time) => {
      draw(time)
      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (reduced) return
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(frame)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-bg" aria-hidden="true" />
}
```

## `src/components/AnimatedHeading.jsx`

```jsx
/**
 * Word-by-word 3D flip-up heading.
 *
 * Deliberately CSS-driven rather than JS-driven: this is the LCP element on
 * the home page, and a Framer entrance would hold it at opacity 0 until React
 * hydrates — on a throttled phone that pushed LCP past 6s. A CSS keyframe
 * starts painting on the very first frame the stylesheet lands, so the
 * heading is visible immediately whether or not JS has arrived.
 *
 * `segments` = array of { text, gradient?:bool }.
 */
export default function AnimatedHeading({ segments, className = '', as: Tag = 'h1' }) {
  let index = 0
  return (
    <Tag className={`${className} anim-head`}>
      {segments.map((seg, si) =>
        seg.text.split(' ').map((wtext, wi) => {
          const i = index++
          return (
            <span
              key={`${si}-${wi}`}
              className={`anim-head__w${seg.gradient ? ' gradient-text' : ''}`}
              style={{ animationDelay: `${0.06 + i * 0.045}s` }}
            >
              {wtext}
            </span>
          )
        })
      )}
    </Tag>
  )
}
```

## `src/components/CountUp.jsx`

```jsx
import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Animated number that counts up when scrolled into view.
 * Assistive tech reads the final value once (via the visually-hidden span)
 * instead of every intermediate frame.
 */
export default function CountUp({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(reduced ? to : 0)

  useEffect(() => {
    if (!inView || reduced) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, to, duration, reduced])

  return (
    <span ref={ref}>
      <span aria-hidden="true">{value}{suffix}</span>
      <span className="sr-only">{to}{suffix}</span>
    </span>
  )
}
```

## `src/components/CursorGlow.jsx`

```jsx
import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Soft brand-colored light that trails the cursor across the whole page.
 *  Skipped entirely on touch devices and for reduced-motion users. */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.5 })

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isCoarse || reducedMotion) return
    setEnabled(true)
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        left: sx,
        top: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: 460,
        height: 460,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
        background:
          'radial-gradient(circle, rgba(129,140,248,0.12), rgba(34,211,238,0.06) 40%, transparent 68%)',
        filter: 'blur(6px)',
      }}
    />
  )
}
```

## `src/components/DataRiver.jsx`

```jsx
/**
 * "Data river" — an abstract liquid stream of information flowing
 * between sections. Three layered bezier currents with drifting
 * dashes and a few carried droplets. Pure CSS animation (stroke
 * dashoffset + transform), pauses under prefers-reduced-motion.
 * Decorative only.
 */
export default function DataRiver() {
  return (
    <div className="river" aria-hidden="true">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="river__svg" focusable="false">
        <defs>
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(129,140,248,0)" />
            <stop offset="0.18" stopColor="rgba(129,140,248,0.45)" />
            <stop offset="0.55" stopColor="rgba(103,232,249,0.55)" />
            <stop offset="0.85" stopColor="rgba(129,140,248,0.4)" />
            <stop offset="1" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <path className="river__stream river__stream--1"
          d="M-20 70 C 180 30, 340 105, 560 68 S 940 28, 1220 62" />
        <path className="river__stream river__stream--2"
          d="M-20 88 C 220 55, 420 118, 640 82 S 1000 48, 1220 84" />
        <path className="river__stream river__stream--3"
          d="M-20 52 C 160 92, 400 30, 620 55 S 980 95, 1220 44" />
      </svg>
    </div>
  )
}
```

## `src/components/FAQ.css`

```css
.faq { max-width: 820px; margin: 0 auto; border-top: 1px solid var(--border); }
.faq__item {
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s ease;
}
.faq__item.is-open { border-bottom-color: rgba(103, 232, 249, 0.35); }
.faq__qwrap { margin: 0; font: inherit; }
.faq__q {
  width: 100%;
  cursor: pointer;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 16px;
  padding: 24px 8px;
  background: none;
  border: none;
  color: var(--text);
  font-family: var(--font-display);
  font-weight: 500;
  font-size: 1.05rem;
  text-align: left;
}
.faq__icon {
  flex: 0 0 auto;
  font-size: 1.4rem;
  color: var(--text-faint);
  line-height: 1;
  transition: color 0.25s ease, transform 0.3s var(--ease-lux);
}
.faq__a { overflow: hidden; }
.faq__item.is-open .faq__icon { color: var(--cyan-300); }
.faq__a p { padding: 0 8px 24px; color: var(--text-dim); margin: 0; max-width: 68ch; }
.faq__q:focus-visible { outline: 2px solid var(--cyan-400); outline-offset: -2px; border-radius: 10px; }
.faq__q:hover { color: var(--cyan-300); }
.faq__q:hover .faq__icon { color: var(--cyan-300); }
```

## `src/components/FAQ.jsx`

```jsx
import { useId, useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHeader } from './Section'
import './FAQ.css'

/**
 * Accessible disclosure list.
 * Each question is a <button aria-expanded aria-controls>; each answer is a
 * region labelled by its question, so screen readers announce the pairing.
 */
export default function FAQ({
  items,
  eyebrow = 'FAQ',
  title = 'Frequently asked <span class="gradient-text">questions</span>',
  lead,
}) {
  const uid = useId()
  const [open, setOpen] = useState(0)

  return (
    <section className="section" style={{ paddingTop: 0 }} aria-labelledby={`${uid}-heading`}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} headingId={`${uid}-heading`} />
        <Reveal className="faq" style={{ marginTop: 40 }}>
          {items.map((f, i) => {
            const isOpen = open === i
            const btnId = `${uid}-q-${i}`
            const panelId = `${uid}-a-${i}`
            return (
              <div className={`faq__item ${isOpen ? 'is-open' : ''}`} key={f.q}>
                <h3 className="faq__qwrap">
                  <button
                    id={btnId}
                    className="faq__q"
                    type="button"
                    onClick={() => setOpen(isOpen ? -1 : i)}
                    aria-expanded={isOpen}
                    aria-controls={panelId}
                  >
                    <span>{f.q}</span>
                    <span className="faq__icon" aria-hidden="true">{isOpen ? '−' : '+'}</span>
                  </button>
                </h3>
                <AnimatePresence initial={false}>
                  {isOpen && (
                    <motion.div
                      id={panelId}
                      role="region"
                      aria-labelledby={btnId}
                      className="faq__a"
                      initial={{ height: 0, opacity: 0 }}
                      animate={{ height: 'auto', opacity: 1 }}
                      exit={{ height: 0, opacity: 0 }}
                      transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}
                    >
                      <p>{f.a}</p>
                    </motion.div>
                  )}
                </AnimatePresence>
              </div>
            )
          })}
        </Reveal>
      </div>
    </section>
  )
}
```

## `src/components/Footer.css`

```css
/* ============================================================
   Footer — moonlit glass basement
   ============================================================ */
.footer {
  position: relative;
  padding: clamp(72px, 8vw, 100px) 0 calc(36px + env(safe-area-inset-bottom));
  border-top: 1px solid var(--border);
  background: linear-gradient(180deg, transparent, rgba(8, 12, 24, 0.85));
  overflow: hidden;
}
.footer::before {
  content: '';
  position: absolute;
  top: 0; left: 20%; right: 20%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(199, 210, 254, 0.6), rgba(103, 232, 249, 0.6), transparent);
}
.footer__glow {
  position: absolute;
  top: -160px; left: 50%; transform: translateX(-50%);
  width: 780px; height: 340px;
  background: radial-gradient(closest-side, rgba(99, 102, 241, 0.18), rgba(34, 211, 238, 0.06) 60%, transparent);
  filter: blur(24px);
  pointer-events: none;
}

.footer__cta {
  position: relative;
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 40px;
  margin: 0 0 72px;
}
.footer__ctatitle {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.5rem, 2.8vw, 2.2rem);
  line-height: 1.12;
  letter-spacing: -0.022em;
  margin: 16px 0 10px;
  max-width: 560px;
  text-wrap: balance;
}
.footer__ctatext { color: var(--text-faint); font-size: 0.92rem; }
.footer__ctabtn { flex: 0 0 auto; }
@media (max-width: 760px) {
  .footer__cta { flex-direction: column; align-items: flex-start; gap: 24px; }
}

.footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  padding: 44px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
}
.footer__brand {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-display); font-weight: 700; font-size: 1.3rem;
}
.footer__brand img { width: 40px; height: 40px; border-radius: 9px; }
.footer__tagline {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  color: var(--indigo-300);
  margin: 18px 0 14px;
}
.footer__muted { color: var(--text-faint); font-size: 0.9rem; line-height: 1.8; }

.footer__col h3 {
  font-family: var(--font-mono);
  font-size: 0.72rem;
  text-transform: uppercase;
  letter-spacing: 0.22em;
  color: var(--text-faint);
  margin-bottom: 16px;
}
.footer__col a {
  display: block;
  color: var(--text-dim);
  font-size: 0.94rem;
  padding: 6px 0;
  transition: color 0.2s ease, transform 0.2s ease;
}
.footer__col a:hover { color: var(--cyan-300); transform: translateX(4px); }

.footer__bottom {
  display: flex;
  justify-content: space-between;
  align-items: center;
  gap: 12px;
  padding-top: 26px;
  color: var(--text-faint);
  font-size: 0.85rem;
}
.footer__mono { font-family: var(--font-mono); letter-spacing: 0.06em; }

/* Legal links are standalone controls, not inline prose — give them a real
   hit area (WCAG 2.5.8 Target Size, 24x24 minimum). */
.footer__legal { display: flex; flex-wrap: wrap; gap: 4px 18px; justify-content: center; }
.footer__legal a {
  display: inline-flex;
  align-items: center;
  min-height: 28px;
  padding: 2px 4px;
  border-radius: 6px;
  color: var(--text-faint);
  transition: color 0.2s ease;
}
.footer__legal a:hover { color: var(--cyan-300); }

@media (max-width: 860px) {
  .footer__grid { grid-template-columns: 1fr 1fr; gap: 30px; }
  .footer__brandcol { grid-column: 1 / -1; }
  .footer__bottom { flex-direction: column; text-align: center; }
}
```

## `src/components/Footer.jsx`

```jsx
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company, navLinks } from '../data/site'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <motion.div
          className="footer__cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer__ctacopy">
            <span className="eyebrow">Let’s build together</span>
            <h2 className="footer__ctatitle">Put a proven automotive bench behind your next program.</h2>
            <p className="footer__ctatext">Same-day deployment · 25–45% buffer bench · a decade of delivery.</p>
          </div>
          <Link to="/contact" className="btn btn-primary footer__ctabtn">
            Start a conversation <span className="arrow" aria-hidden="true">→</span>
          </Link>
        </motion.div>

        <div className="footer__grid">
          <div className="footer__brandcol">
            <div className="footer__brand">
              <img src="/logo.png" alt="" width="40" height="40" loading="lazy" />
              <span>AUTO<span style={{ color: 'var(--cyan-400)' }}>-</span>CAN</span>
            </div>
            <p className="footer__tagline">{company.tagline}</p>
            <p className="footer__muted">
              Founded {company.founded} · {company.location}<br />
              Delivery centre · {company.deliveryCentre}
            </p>
          </div>

          <div className="footer__col">
            <h3>Navigate</h3>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </div>

          <div className="footer__col">
            <h3>Capabilities</h3>
            <Link to="/services">Embedded SW Stacks</Link>
            <Link to="/services">Test Automation</Link>
            <Link to="/expertise">HiL &amp; V&amp;V</Link>
            <Link to="/expertise">AUTOSAR &amp; ISO 26262</Link>
          </div>

          <div className="footer__col">
            <h3>Engage</h3>
            <Link to="/careers">ODC Model</Link>
            <Link to="/careers">Deputation Model</Link>
            <Link to="/careers">Campus Connect</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <nav className="footer__legal" aria-label="Legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
          <span className="footer__mono">Driven by AI · Powered by Innovation</span>
        </div>
      </div>
    </footer>
  )
}
```

## `src/components/HeroKit.jsx`

```jsx
import { motion } from 'framer-motion'
import { Component, lazy, Suspense, useEffect, useRef, useState } from 'react'
import { ShieldIcon, BoltIcon, GlobeIcon } from './Icons'
import useVisibleInterval from './useVisibleInterval'
const HeroScene3D = lazy(() => import('./HeroScene3D'))

export const SPEC_STACK = [
  ['AUTOSAR Adaptive', 'Classic AUTOSAR', 'SOME/IP', 'CAN FD', 'Ethernet', 'ROS2'],
  ['ISO 26262 ASIL-D', 'Cyber Security', 'ASPICE', 'AI Validation'],
  ['ADAS Level 3', 'OTA', 'Digital Twin', 'CI/CD'],
]
export function CycleCard({ items, interval, className, icon, floatDur }) {
  const [i, setI] = useState(0)
  useVisibleInterval(() => setI((v) => (v + 1) % items.length), interval)
  return (
    <motion.div
      className={`chip3d ${className}`}
      aria-hidden="true"
      animate={{ y: [0, -10, 0] }}
      transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut' }}
    >
      {icon}
      <motion.span key={i} className="chip3d__label" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <b>{items[i]}</b>
      </motion.span>
    </motion.div>
  )
}
export const BOOT_LINES = [
  '> HiL rig · 1,248/1,248 test cases passed ✓',
  '> AUTOSAR RTE generated in 3.2s ✓',
  '> OTA package signed · SHA-256 verified ✓',
  '> CAN FD bus load 42% · timing optimal ✓',
  '> ISO 26262 ASIL-D audit · compliant ✓',
  '> ADAS perception stack · 60 fps validated ✓',
]
export function BootConsole() {
  const [line, setLine] = useState(0)
  // Start fully typed: the prerendered HTML then contains the real line, so the
  // block has its final height at first paint instead of growing from 0 and
  // shoving the buttons below it down (that shift was worth 0.12 CLS).
  const [chars, setChars] = useState(BOOT_LINES[0].length)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setChars(BOOT_LINES[0].length); return }
    const id = setInterval(() => {
      setChars((c) => {
        if (c < BOOT_LINES[line].length) return c + 1
        return c
      })
    }, 28)
    const hold = setTimeout(() => { setLine((l) => (l + 1) % BOOT_LINES.length); setChars(0) }, BOOT_LINES[line].length * 28 + 2200)
    return () => { clearInterval(id); clearTimeout(hold) }
  }, [line])
  return (
    <div className="boot-console hero-in" style={{ animationDelay: '0.4s' }} aria-hidden="true">
      {BOOT_LINES[line].slice(0, chars)}<span className="boot-console__cursor" />
    </div>
  )
}
export function XRayButton() {
  const [on, setOn] = useState(false)
  const toggle = () => {
    const next = !on
    setOn(next)
    window.dispatchEvent(new CustomEvent('ac-xray', { detail: next }))
  }
  return (
    <button type="button" className={`xray-btn ${on ? 'is-on' : ''}`} onClick={toggle} aria-pressed={on}>
      <span className="xray-btn__dot" aria-hidden="true" />
      {on ? 'Exit X-Ray' : 'Digital Twin X-Ray'}
    </button>
  )
}

// Live "operations console" header — sells a working robotic AI workshop.
const WHUD_LINES = [
  'ROBOTIC WELD CELL · ACTIVE',
  'DIGITAL-TWIN SYNC · 99.2%',
  'AI VISION INSPECT · PASS',
  'TORQUE CALIBRATION · OK',
  'SEAM SCAN · 1,248 PTS',
]
export function WorkshopHUD() {
  const [i, setI] = useState(0)
  useVisibleInterval(() => setI((v) => (v + 1) % WHUD_LINES.length), 2600, { pauseOnReducedMotion: true })
  return (
    <div className="whud" aria-hidden="true">
      <span className="whud__dot" />
      <span className="whud__brand">AI WORKSHOP</span>
      <span className="whud__sep" />
      <span className="whud__cell">CELL 01</span>
      <span className="whud__sep" />
      <motion.span key={i} className="whud__status"
        initial={{ opacity: 0, y: 4 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.35 }}>
        {WHUD_LINES[i]}
      </motion.span>
      <span className="whud__bar"><span className="whud__fill" /></span>
    </div>
  )
}

// Static fallback shown whenever the WebGL scene can't run.
function HeroFallback() {
  return (
    <div className="scene3d scene3d--fallback" role="img" aria-label="AUTO-CAN digital-twin engineering visualization">
      <picture>
        <source srcSet="/hero-graphic.webp" type="image/webp" />
        <img src="/hero-graphic.png" alt="" width="900" height="569" loading="eager" decoding="async" fetchpriority="high" />
      </picture>
    </div>
  )
}

// Catches render/runtime errors from the lazy 3D scene and swaps in the fallback.
class HeroErrorBoundary extends Component {
  constructor(props) { super(props); this.state = { failed: false } }
  static getDerivedStateFromError() { return { failed: true } }
  componentDidCatch() { /* swallowed — fallback covers the UX */ }
  render() { return this.state.failed ? <HeroFallback /> : this.props.children }
}

// Live camera tag — monitoring-console cue with a real ticking clock.
export function CamTag() {
  const [now, setNow] = useState('')
  const tick = () => setNow(new Date().toLocaleTimeString('en-GB', { hour12: false }))
  useEffect(() => { tick() }, [])
  useVisibleInterval(tick, 1000)
  return (
    <div className="camtag" aria-hidden="true">
      <span className="camtag__dot" />
      LIVE · {now}
    </div>
  )
}

// Station status strip — bottom console readout.
export function StatusStrip() {
  return (
    <div className="statstrip" aria-hidden="true">
      <span><i className="ok" />ROBOT · ACTIVE</span>
      <span><i className="ok" />TECH · ON STATION</span>
    </div>
  )
}

// Detect WebGL support once on the client.
function hasWebGL() {
  try {
    const c = document.createElement('canvas')
    return !!(window.WebGLRenderingContext && (c.getContext('webgl') || c.getContext('experimental-webgl')))
  } catch { return false }
}

/**
 * Hero visual — the live 3D AI-workshop scene, dressed as a real
 * monitoring console: corner brackets, live camera tag, ops HUD and
 * station status strip. Falls back to the poster if WebGL is unavailable.
 */
export function HeroVisual() {
  const [ready, setReady] = useState(false)
  const [webgl, setWebgl] = useState(true)
  const frameRef = useRef(null)
  useEffect(() => {
    setWebgl(hasWebGL())
    const onFail = () => setWebgl(false)
    window.addEventListener('ac-webgl-failed', onFail)

    // Defer the 576 KB three.js chunk until the hero is in view and the main
    // thread is idle — keeps first paint and interactivity fast.
    let idle
    const start = () => {
      const cb = () => setReady(true)
      idle = window.requestIdleCallback ? requestIdleCallback(cb, { timeout: 1200 }) : setTimeout(cb, 200)
    }
    const el = frameRef.current
    if (!el || !('IntersectionObserver' in window)) { start(); return () => window.removeEventListener('ac-webgl-failed', onFail) }
    const io = new IntersectionObserver(([e]) => { if (e.isIntersecting) { start(); io.disconnect() } }, { rootMargin: '200px' })
    io.observe(el)
    return () => {
      io.disconnect()
      if (idle) (window.cancelIdleCallback ? cancelIdleCallback(idle) : clearTimeout(idle))
      window.removeEventListener('ac-webgl-failed', onFail)
    }
  }, [])
  return (
    <div className="hero__visual hero__visual--3d">
      <motion.div ref={frameRef} className="scene3d__frame" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        {ready && !webgl && <HeroFallback />}
        {ready && webgl && (
          <HeroErrorBoundary>
            <Suspense fallback={<div className="scene3d scene3d--loading" aria-hidden="true" />}>
              <HeroScene3D />
            </Suspense>
          </HeroErrorBoundary>
        )}
        <span className="scene-scrim" aria-hidden="true" />
        <span className="scene-corners" aria-hidden="true" />
        <WorkshopHUD />
        <CamTag />
        <StatusStrip />
        <CycleCard items={SPEC_STACK[0]} interval={4200} floatDur={4} className="chip3d--1" icon={<span className="chip3d__ico chip3d__ico--orange"><BoltIcon /></span>} />
        <CycleCard items={SPEC_STACK[1]} interval={5300} floatDur={4.6} className="chip3d--2" icon={<span className="chip3d__ico chip3d__ico--blue"><ShieldIcon /></span>} />
        <CycleCard items={SPEC_STACK[2]} interval={6100} floatDur={5.2} className="chip3d--3" icon={<span className="chip3d__ico chip3d__ico--orange"><GlobeIcon /></span>} />
        <XRayButton />
      </motion.div>
    </div>
  )
}
```

## `src/components/HeroScene3D.jsx`

```jsx
import { useEffect, useRef } from 'react'
import * as THREE from 'three'
import { Reflector } from 'three/examples/jsm/objects/Reflector.js'

/**
 * AUTO-CAN hero v4 — enterprise automotive showroom.
 *  · luxury EV sedan: PBR clearcoat pearl paint, panoramic black glass,
 *    LED DRLs, matrix headlight lenses, carbon splitter & skirts, chrome
 *    beltline, multi-spoke alloys w/ orange calipers, blue underglow
 *  · true mirror floor (planar reflection) + soft contact shadow
 *  · KUKA-class industrial robot: cast-metal links, hydraulic joints,
 *    cable dressing — IK arm welding a seam with sparks + weld light
 *  · cinematic rig: blue key / orange rim / white top / HDRI env, light
 *    sweep across the paint, holographic rings, blueprint dimension lines
 * All procedural. Reduced-motion renders a single styled frame.
 */

const BLUE = 0x818cf8
const BLUE_SOFT = 0xa5b4fc
const ORANGE = 0x22d3ee
const INK = 0x04060b

function makeGlowTexture() {
  const c = document.createElement('canvas')
  c.width = c.height = 64
  const ctx = c.getContext('2d')
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32)
  g.addColorStop(0, 'rgba(255,255,255,1)')
  g.addColorStop(0.35, 'rgba(255,255,255,0.5)')
  g.addColorStop(1, 'rgba(255,255,255,0)')
  ctx.fillStyle = g
  ctx.fillRect(0, 0, 64, 64)
  return new THREE.CanvasTexture(c)
}
function glowSprite(tex, color, sx, sy, opacity = 1) {
  const s = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color, transparent: true, opacity,
    blending: THREE.AdditiveBlending, depthWrite: false,
  }))
  s.scale.set(sx, sy, 1)
  return s
}
function edgeLines(geo, color, opacity = 0.9, threshold = 12) {
  const e = new THREE.EdgesGeometry(geo, threshold)
  geo.dispose()
  return new THREE.LineSegments(e, new THREE.LineBasicMaterial({ color, transparent: true, opacity }))
}

// ---------------- car: lofted parametric body ----------------
const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}
// piecewise-smooth interpolation over [x, value] control points (x descending)
function interp(ctrl, x) {
  if (x >= ctrl[0][0]) return ctrl[0][1]
  for (let i = 0; i < ctrl.length - 1; i++) {
    const [xa, va] = ctrl[i], [xb, vb] = ctrl[i + 1]
    if (x <= xa && x >= xb) {
      const t = (xa - x) / (xa - xb)
      const ts = t * t * (3 - 2 * t)
      return va + (vb - va) * ts
    }
  }
  return ctrl[ctrl.length - 1][1]
}
// design curves (x from nose 2.72 to tail -2.52)
const TOP = [[2.62, 0.54], [2.3, 0.6], [1.2, 0.66], [0.9, 0.7], [0.0, 0.76], [-1.0, 0.78], [-1.8, 0.76], [-2.3, 0.73], [-2.52, 0.7]]
const HALF_W = [[2.62, 0.52], [2.35, 0.72], [1.55, 0.92], [0.6, 0.9], [-0.5, 0.91], [-1.5, 0.96], [-2.3, 0.86], [-2.52, 0.64]]
const FLARE = (x) => 0.022 * Math.exp(-(((x - 1.55) / 0.55) ** 2)) + 0.032 * Math.exp(-(((x + 1.5) / 0.6) ** 2))
const archLift = (x) => {
  const f = 0.3 + Math.sqrt(Math.max(0, 0.5 ** 2 - (x - 1.55) ** 2))
  const r = 0.3 + Math.sqrt(Math.max(0, 0.52 ** 2 - (x + 1.5) ** 2))
  return Math.max(0.17, f, r)
}

function buildBodyGeometry() {
  const NX = 120, NR = 64
  const stations = []
  for (let i = 0; i < NX; i++) {
    const x = 2.62 - (i / (NX - 1)) * (2.62 + 2.52)
    stations.push(x)
  }
  const verts = [], idx = [], cols = []
  // two-tone paint: black metallic above, white-silver band below the beltline
  const TONE_DARK = [0.028, 0.032, 0.045]
  const TONE_SILVER = [0.9, 0.93, 0.97]
  const toneAt = (y) => {
    const s = 1 - smooth(0.5, 0.62, y) // silver body sides, black metallic above the beltline
    return [
      TONE_DARK[0] + (TONE_SILVER[0] - TONE_DARK[0]) * s,
      TONE_DARK[1] + (TONE_SILVER[1] - TONE_DARK[1]) * s,
      TONE_DARK[2] + (TONE_SILVER[2] - TONE_DARK[2]) * s,
    ]
  }
  for (let i = 0; i < NX; i++) {
    const x = stations[i]
    const yTop = interp(TOP, x)
    const y0 = archLift(x)
    const w = interp(HALF_W, x) * (1 - 0.08 * smooth(2.2, 2.62, x)) // nose plan taper
    for (let k = 0; k < NR; k++) {
      const th = -Math.PI / 2 + (k / NR) * Math.PI * 2
      const sy = Math.sin(th), cz = Math.cos(th)
      // arches are cut only near the body sides; the floor between the
      // wheels stays low so the belly doesn't lift and expose a tunnel
      const side = smooth(0.45, 0.85, Math.abs(cz))
      const yBot = 0.17 + (y0 - 0.17) * side
      const yc = (yBot + yTop) / 2
      const ry = Math.max((yTop - yBot) / 2, 0.02)
      let y = yc + ry * Math.sign(sy) * Math.abs(sy) ** 0.85
      let z = w * Math.sign(cz) * Math.abs(cz) ** 0.66
      // gentle shoulder roll-in toward the beltline
      z *= 1 - smooth(yTop - 0.14, yTop, y) * 0.1
      // muscular haunch/arch flares at mid-body height
      z *= 1 + FLARE(x) * Math.exp(-(((y - 0.5) / 0.2) ** 2))
      // sill tuck: body is widest at the shoulder and narrows toward the
      // rockers so the wheels sit flush with the fenders and stay visible
      z *= 1 - 0.16 * (1 - smooth(0.24, 0.52, y))
      verts.push(x, y, z)
      cols.push(...toneAt(y))
    }
  }
  for (let i = 0; i < NX - 1; i++) {
    for (let k = 0; k < NR; k++) {
      const a = i * NR + k
      const b = i * NR + ((k + 1) % NR)
      const c = (i + 1) * NR + k
      const d = (i + 1) * NR + ((k + 1) % NR)
      idx.push(a, b, c, b, d, c)
    }
  }
  // end caps
  const noseC = verts.length / 3
  const noseY = (archLift(2.62) + interp(TOP, 2.62)) / 2
  verts.push(2.62, noseY, 0)
  cols.push(...toneAt(noseY))
  for (let k = 0; k < NR; k++) idx.push(noseC, k, (k + 1) % NR)
  const tailC = verts.length / 3
  const li = (NX - 1) * NR
  const tailY = (archLift(-2.52) + interp(TOP, -2.52)) / 2
  verts.push(-2.52, tailY, 0)
  cols.push(...toneAt(tailY))
  for (let k = 0; k < NR; k++) idx.push(tailC, li + ((k + 1) % NR), li + k)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

function buildCar(tex) {
  const car = new THREE.Group()
  const carbonRef = new THREE.MeshStandardMaterial({ color: 0x0c1220, metalness: 0.55, roughness: 0.5 })

  // two-tone metallic paint (vertex colors: black metallic + white-silver band)
  const paint = new THREE.MeshPhysicalMaterial({
    color: 0xffffff, vertexColors: true, metalness: 0.9, roughness: 0.33,
    clearcoat: 0.7, clearcoatRoughness: 0.06, envMapIntensity: 0.6,
    reflectivity: 1.0,
  })
  const bodyGeo = buildBodyGeometry()
  car.add(new THREE.Mesh(bodyGeo, paint))
  // hidden hologram wireframe revealed in X-ray scan mode
  const xrayEdges = new THREE.LineSegments(
    new THREE.EdgesGeometry(bodyGeo, 18),
    new THREE.LineBasicMaterial({ color: 0x60a5fa, transparent: true, opacity: 0 })
  )
  car.add(xrayEdges)
  paint.transparent = true

  // panoramic glass — tinted but transmissive, interior silhouette visible
  const winShape = new THREE.Shape()
  winShape.moveTo(-1.8, 0.74)
  winShape.quadraticCurveTo(-1.62, 1.0, -1.15, 1.05)   // rear window + kink
  winShape.quadraticCurveTo(-0.5, 1.11, 0.1, 1.08)      // long flat roof
  winShape.quadraticCurveTo(0.62, 1.01, 1.02, 0.72)     // windshield
  winShape.lineTo(-1.8, 0.74)
  const winGeo = new THREE.ExtrudeGeometry(winShape, { depth: 1.32, bevelEnabled: false, curveSegments: 20 })
  winGeo.translate(0, 0.02, -0.66)
  {
    const pos = winGeo.attributes.position
    for (let i = 0; i < pos.count; i++) {
      const y = pos.getY(i)
      if (y > 0.78) pos.setZ(i, pos.getZ(i) * (1 - smooth(0.78, 1.15, y) * 0.52))
    }
    winGeo.computeVertexNormals()
  }
  const glassMat = new THREE.MeshPhysicalMaterial({
    color: 0x0a1524, metalness: 0.0, roughness: 0.06, envMapIntensity: 0.9,
    transparent: true, opacity: 0.92, clearcoat: 0.5, clearcoatRoughness: 0.04,
    reflectivity: 1.0,
  })
  car.add(new THREE.Mesh(winGeo, glassMat))
  // chrome DLO trim where glass meets body (what separates roof from paint)
  const dloMat = new THREE.MeshStandardMaterial({ color: 0xd6dde8, metalness: 1, roughness: 0.12 })
  const dloPts = (zOff) => new THREE.CatmullRomCurve3([
    new THREE.Vector3(1.0, 0.745, zOff * 0.92),
    new THREE.Vector3(0.2, 0.77, zOff),
    new THREE.Vector3(-0.9, 0.775, zOff),
    new THREE.Vector3(-1.78, 0.75, zOff * 0.9),
  ])
  for (const z of [0.62, -0.62]) {
    car.add(new THREE.Mesh(new THREE.TubeGeometry(dloPts(z), 24, 0.011, 6), dloMat))
  }

  // interior silhouette: seats, dash
  const cabinMat = new THREE.MeshStandardMaterial({ color: 0x0a0f1a, metalness: 0.2, roughness: 0.9 })
  for (const sx of [-0.85, -0.25]) {
    const seat = new THREE.Mesh(new THREE.CapsuleGeometry(0.08, 0.12, 3, 8), cabinMat)
    seat.position.set(sx, 0.7, 0.22)
    car.add(seat)
    const seat2 = seat.clone(); seat2.position.z = -0.26
    car.add(seat2)
  }
  const dash = new THREE.Mesh(new THREE.BoxGeometry(0.16, 0.1, 1.1), cabinMat)
  dash.position.set(0.48, 0.72, 0)
  car.add(dash)

  // premium side mirrors on stalks
  const mirBody = new THREE.MeshPhysicalMaterial({ color: 0xf3f6fc, metalness: 0.6, roughness: 0.2, clearcoat: 1 })
  for (const z of [0.68, -0.68]) {
    const pod = new THREE.Mesh(new THREE.SphereGeometry(0.055, 12, 8), mirBody)
    pod.scale.set(1.5, 0.7, 1.0)
    pod.position.set(0.72, 0.8, z + (z > 0 ? 0.08 : -0.08))
    car.add(pod)
  }

  // black lower rocker trim (reference sedan sill)
  for (const z of [0.76, -0.76]) {
    const sill = new THREE.Mesh(new THREE.BoxGeometry(1.9, 0.07, 0.04), carbonRef)
    sill.position.set(0.05, 0.23, z)
    car.add(sill)
  }

  // flush door handles
  const handleMat = new THREE.MeshStandardMaterial({ color: 0xb9c4d6, metalness: 1, roughness: 0.25 })
  for (const z of [0.87, -0.87]) {
    const h = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.024, 0.014), handleMat)
    h.position.set(0.14, 0.62, z * 0.98)
    car.add(h)
  }

  // front fascia: dark intake, carbon splitter, signature light bar
  const carbon = new THREE.MeshStandardMaterial({ color: 0x0c1220, metalness: 0.55, roughness: 0.5 })
  const intake = new THREE.Mesh(new THREE.BoxGeometry(0.18, 0.14, 1.1), carbon)
  intake.position.set(2.5, 0.26, 0)
  car.add(intake)
  // upright illuminated grille: chrome frame + vertical slats (original design)
  const grilleFrame = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.3, 0.66), new THREE.MeshStandardMaterial({
    color: 0x11161f, metalness: 0.8, roughness: 0.3 }))
  grilleFrame.position.set(2.56, 0.42, 0)
  car.add(grilleFrame)
  const slatMat = new THREE.MeshStandardMaterial({ color: 0xcfd6e2, metalness: 1, roughness: 0.15 })
  for (let i = 0; i < 7; i++) {
    const slat = new THREE.Mesh(new THREE.BoxGeometry(0.05, 0.26, 0.02), slatMat)
    slat.position.set(2.6, 0.42, -0.27 + i * 0.09)
    car.add(slat)
  }
  const grilleGlow = new THREE.Mesh(new THREE.BoxGeometry(0.02, 0.3, 0.02), new THREE.MeshStandardMaterial({
    color: 0xffffff, emissive: 0xdbeafe, emissiveIntensity: 2.5, roughness: 0.3 }))
  for (const zg of [0.35, -0.35]) {
    const g = grilleGlow.clone(); g.position.set(2.6, 0.42, zg); car.add(g)
  }
  const splitter = new THREE.Mesh(new THREE.BoxGeometry(0.4, 0.05, 1.5), carbon)
  splitter.position.set(2.46, 0.15, 0)
  car.add(splitter)
  const sigBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.016, 0.016, 0.98),
    new THREE.MeshStandardMaterial({ color: 0xffffff, emissive: 0xcfe2ff, emissiveIntensity: 3.6, roughness: 0.2 })
  )
  sigBar.position.set(2.6, 0.58, 0)
  car.add(sigBar)
  const emblem = glowSprite(tex, BLUE, 0.11, 0.11, 0.95)
  emblem.position.set(2.62, 0.6, 0)
  car.add(emblem)

  // crystal laser-LED headlights: chrome internals + blue projectors under a glass cover
  const chromeMat = new THREE.MeshStandardMaterial({ color: 0xe7edf6, metalness: 1, roughness: 0.08 })
  const projMat = new THREE.MeshStandardMaterial({ color: 0x9cc6ff, emissive: 0x7db4ff, emissiveIntensity: 1.4, roughness: 0.1 })
  for (const z of [0.44, -0.44]) {
    const cluster = new THREE.Group()
    cluster.position.set(2.46, 0.54, z)
    cluster.rotation.y = z > 0 ? 0.3 : -0.3
    for (let i = 0; i < 3; i++) {
      const barrel = new THREE.Mesh(new THREE.CylinderGeometry(0.028, 0.036, 0.05, 12), chromeMat)
      barrel.rotation.z = Math.PI / 2
      barrel.position.set(0.02, 0, (i - 1) * 0.075)
      cluster.add(barrel)
      const proj = new THREE.Mesh(new THREE.SphereGeometry(0.017, 8, 6), projMat)
      proj.position.set(0.05, 0, (i - 1) * 0.075)
      cluster.add(proj)
    }
    const cover = new THREE.Mesh(new THREE.SphereGeometry(0.14, 14, 10), new THREE.MeshPhysicalMaterial({
      color: 0xbfd8ff, metalness: 0.1, roughness: 0.04, transparent: true, opacity: 0.3, envMapIntensity: 1.6,
    }))
    cover.scale.set(0.85, 0.42, 1.3)
    cover.position.x = 0.05
    cluster.add(cover)
    // sharp DRL blade above the cluster
    const drl = new THREE.Mesh(new THREE.BoxGeometry(0.016, 0.012, 0.3), new THREE.MeshStandardMaterial({
      color: 0xffffff, emissive: 0xdbeafe, emissiveIntensity: 4.4, roughness: 0.2 }))
    drl.position.set(0.03, 0.09, 0)
    drl.rotation.x = z > 0 ? -0.2 : 0.2
    cluster.add(drl)
    car.add(cluster)
  }

  // tail: full-width light bar on the ducktail + diffuser
  const tailBar = new THREE.Mesh(
    new THREE.BoxGeometry(0.03, 0.04, 1.28),
    new THREE.MeshStandardMaterial({ color: 0xff5533, emissive: 0xff2f0f, emissiveIntensity: 3, roughness: 0.3 })
  )
  tailBar.position.set(-2.5, 0.62, 0)
  car.add(tailBar)
  const tailBarRef = tailBar
  const diffuser = new THREE.Mesh(new THREE.BoxGeometry(0.34, 0.12, 1.34), carbon)
  diffuser.position.set(-2.42, 0.18, 0)
  car.add(diffuser)
  // integrated ducktail spoiler lip
  const lip = new THREE.Mesh(new THREE.BoxGeometry(0.26, 0.03, 1.3), carbon)
  lip.position.set(-2.2, 0.76, 0)
  lip.rotation.z = 0.08
    car.add(lip)

  // wheels: torus tires (real sidewall), forged multi-spoke, discs, bolts, calipers
  const wheels = []
  const tireMat = new THREE.MeshStandardMaterial({ color: 0x07090f, metalness: 0.05, roughness: 0.95 })
  const rimMat = new THREE.MeshStandardMaterial({ color: 0xaeb8c6, metalness: 1, roughness: 0.22 })
  const hubMat = new THREE.MeshStandardMaterial({ color: 0x131b2c, metalness: 0.8, roughness: 0.35 })
  const calMat = new THREE.MeshStandardMaterial({ color: ORANGE, metalness: 0.45, roughness: 0.38 })
  for (const [x, y, z] of [[1.55, 0.28, 0.84], [1.55, 0.28, -0.84], [-1.5, 0.28, 0.84], [-1.5, 0.28, -0.84]]) {
    const wheel = new THREE.Group()
    // tire: torus (round sidewall) + tread band
    const tire = new THREE.Mesh(new THREE.TorusGeometry(0.355, 0.105, 14, 36), tireMat)
    wheel.add(tire)
    const tread = new THREE.Mesh(new THREE.CylinderGeometry(0.455, 0.455, 0.15, 36), tireMat)
    tread.rotation.x = Math.PI / 2
    wheel.add(tread)
    const face = z > 0 ? 0.105 : -0.105
    // forged rim: dish + 10 twin spokes + bolts + valve
    const dish = new THREE.Mesh(new THREE.CylinderGeometry(0.34, 0.34, 0.02, 32), hubMat)
    dish.rotation.x = Math.PI / 2
    dish.position.z = face * 0.6
    wheel.add(dish)
    const lipRing = new THREE.Mesh(new THREE.TorusGeometry(0.34, 0.012, 6, 40), new THREE.MeshStandardMaterial({ color: 0xd7dfea, metalness: 1, roughness: 0.15 }))
    lipRing.position.z = face
    wheel.add(lipRing)
    const hub = new THREE.Mesh(new THREE.CylinderGeometry(0.08, 0.08, 0.05, 16), rimMat)
    hub.rotation.x = Math.PI / 2
    hub.position.z = face
    wheel.add(hub)
    for (let i = 0; i < 10; i++) {
      const a = (i / 10) * Math.PI * 2
      const spoke = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.29, 0.024), rimMat)
      spoke.position.set(Math.cos(a + Math.PI / 2) * 0.185, Math.sin(a + Math.PI / 2) * 0.185, face)
      spoke.rotation.z = a
      wheel.add(spoke)
    }
    for (let i = 0; i < 5; i++) {
      const a = (i / 5) * Math.PI * 2
      const bolt = new THREE.Mesh(new THREE.CylinderGeometry(0.011, 0.011, 0.02, 6), hubMat)
      bolt.rotation.x = Math.PI / 2
      bolt.position.set(Math.cos(a) * 0.045, Math.sin(a) * 0.045, face + 0.02 * Math.sign(face))
      wheel.add(bolt)
    }
    const valve = new THREE.Mesh(new THREE.CylinderGeometry(0.006, 0.006, 0.03, 6), rimMat)
    valve.position.set(0.3, 0.12, face)
    valve.rotation.z = 1.2
    wheel.add(valve)
    wheel.position.set(x, y, z)
    car.add(wheel)
    wheels.push(wheel)
    // brake disc + orange caliper (fixed to car)
    const disc = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.24, 0.02, 28),
      new THREE.MeshStandardMaterial({ color: 0x9aa5b6, metalness: 1, roughness: 0.32 }))
    disc.rotation.x = Math.PI / 2
    disc.position.set(x, y, z + face * 0.35)
    car.add(disc)
    const cal = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.15, 0.07), calMat)
    cal.position.set(x + 0.15, y + 0.1, z + face * 0.3)
    car.add(cal)
    // dark arch depth
    const archShadow = new THREE.Sprite(new THREE.SpriteMaterial({
      map: tex, color: 0x000000, transparent: true, opacity: 0.38, depthWrite: false }))
    archShadow.scale.set(1.0, 1.0, 1)
    archShadow.position.set(x, y + 0.05, z * 0.72)
    car.add(archShadow)
  }

  // contact shadow + blue underglow
  const shadow = new THREE.Sprite(new THREE.SpriteMaterial({
    map: tex, color: 0x000000, transparent: true, opacity: 0.62, depthWrite: false,
  }))
  shadow.scale.set(5.8, 1.7, 1)
  shadow.position.set(0, 0.04, 0)
  car.add(shadow)
  const under = glowSprite(tex, 0x7db4ff, 4.2, 1.0, 0.32)
  under.position.set(0, 0.09, 0)
  car.add(under)

  const headL = glowSprite(tex, 0xbcd8ff, 0.34, 0.34, 0.45); headL.position.set(2.7, 0.5, 0.46)
  const headR = glowSprite(tex, 0xbcd8ff, 0.34, 0.34, 0.45); headR.position.set(2.7, 0.5, -0.46)
  const tailG = glowSprite(tex, 0xff5533, 1.6, 0.3, 0.5); tailG.position.set(-2.6, 0.62, 0)
  car.add(headL, headR, tailG)

  // volumetric headlight beams + light pool thrown on the floor
  const beamMat = new THREE.MeshBasicMaterial({
    color: 0xe9f3ff, transparent: true, opacity: 0.06,
    blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
  })
  const beams = []
  for (const z of [0.44, -0.44]) {
    const beam = new THREE.Mesh(new THREE.ConeGeometry(0.56, 3.0, 20, 1, true), beamMat.clone())
    beam.rotation.z = Math.PI / 2 + 0.055 // tilt the throw slightly toward the road
    beam.position.set(4.16, 0.4, z)
    beam.userData.keep = true // stay visible even when a photoreal car.glb loads
    car.add(beam)
    beams.push(beam)
  }
  const beamPool = glowSprite(tex, 0xe9f3ff, 2.2, 0.8, 0.1)
  beamPool.position.set(4.7, 0.07, 0)
  car.add(beamPool)

  return { car, wheels, under, headlights: [headL, headR], tailBarRef, paint, xrayEdges, glassMat, beams, beamPool }
}

// ---------------- industrial robot (KUKA-class) ----------------
const L1 = 1.35
const L2 = 1.25

function cablesAlong(len, offX, offZ) {
  const curve = new THREE.CatmullRomCurve3([
    new THREE.Vector3(offX, 0.06, offZ),
    new THREE.Vector3(offX + 0.06, len * 0.5, offZ + 0.03),
    new THREE.Vector3(offX, len - 0.06, offZ),
  ])
  return new THREE.Mesh(
    new THREE.TubeGeometry(curve, 12, 0.022, 6),
    new THREE.MeshStandardMaterial({ color: 0x10141f, metalness: 0.2, roughness: 0.8 })
  )
}

function buildRobot(tex) {
  const root = new THREE.Group()
  const industrialOrange = new THREE.MeshStandardMaterial({ color: 0x6366f1, metalness: 0.5, roughness: 0.42 })
  const cast = new THREE.MeshStandardMaterial({ color: 0x1c2333, metalness: 0.75, roughness: 0.35 })
  const steel = new THREE.MeshStandardMaterial({ color: 0xaab6c8, metalness: 1, roughness: 0.3 })

  // floor plinth + slewing base
  const plinth = new THREE.Mesh(new THREE.BoxGeometry(0.95, 0.16, 0.95), cast)
  plinth.position.y = 0.08
  root.add(plinth)
  const slew = new THREE.Mesh(new THREE.CylinderGeometry(0.36, 0.42, 0.22, 20), industrialOrange)
  slew.position.y = 0.27
  root.add(slew)
  // pedestal column
  const column = new THREE.Mesh(new THREE.CylinderGeometry(0.24, 0.3, 0.55, 16), industrialOrange)
  column.position.y = 0.65
  root.add(column)
  // shoulder axis housing (big hydraulic joint)
  const shoulderHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.22, 0.22, 0.46, 16), cast)
  shoulderHousing.rotation.x = Math.PI / 2
  shoulderHousing.position.y = 1.0
  root.add(shoulderHousing)

  // IK-driven links
  const shoulder = new THREE.Group()
  shoulder.position.set(0, 1.0, 0)
  root.add(shoulder)
  const link1 = new THREE.Mesh(new THREE.BoxGeometry(0.26, L1, 0.22), industrialOrange)
  link1.position.y = L1 / 2
  shoulder.add(link1)
  // ribs + counterweight for the cast look
  const rib = new THREE.Mesh(new THREE.BoxGeometry(0.29, L1 * 0.55, 0.06), cast)
  rib.position.set(0, L1 * 0.45, 0.14)
  shoulder.add(rib)
  const counter = new THREE.Mesh(new THREE.BoxGeometry(0.3, 0.34, 0.26), cast)
  counter.position.y = -0.22
  shoulder.add(counter)
  shoulder.add(cablesAlong(L1, 0.16, 0.06))

  const elbow = new THREE.Group()
  elbow.position.y = L1
  shoulder.add(elbow)
  const elbowHousing = new THREE.Mesh(new THREE.CylinderGeometry(0.16, 0.16, 0.4, 14), cast)
  elbowHousing.rotation.x = Math.PI / 2
  elbow.add(elbowHousing)
  const link2 = new THREE.Mesh(new THREE.BoxGeometry(0.18, L2 - 0.32, 0.16), industrialOrange)
  link2.position.y = (L2 - 0.32) / 2 + 0.05
  elbow.add(link2)
  elbow.add(cablesAlong(L2 - 0.2, 0.11, 0.05))
  // wrist + torch
  const wristHub = new THREE.Mesh(new THREE.CylinderGeometry(0.075, 0.075, 0.2, 12), steel)
  wristHub.position.y = L2 - 0.22
  elbow.add(wristHub)
  const torch = new THREE.Mesh(new THREE.ConeGeometry(0.06, 0.24, 12), cast)
  torch.position.y = L2 - 0.06
  elbow.add(torch)
  const spark = glowSprite(tex, 0x9be8ff, 0.34, 0.34, 1)
  spark.position.y = L2
  elbow.add(spark)
  // hydraulic cylinder between counterweight and forearm
  const hydro = new THREE.Group()
  const cyl = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.045, 0.5, 10), steel)
  cyl.position.y = 0.25
  const rod = new THREE.Mesh(new THREE.CylinderGeometry(0.022, 0.022, 0.5, 8), steel)
  rod.position.y = 0.62
  hydro.add(cyl, rod)
  hydro.position.set(-0.16, 0.25, 0)
  hydro.rotation.z = -0.35
  shoulder.add(hydro)
  // laser scanner emitter on the wrist
  const scanHead = new THREE.Mesh(new THREE.BoxGeometry(0.07, 0.05, 0.09), cast)
  scanHead.position.y = L2 - 0.3
  elbow.add(scanHead)

  // warning ring on the plinth
  const ring = new THREE.Mesh(new THREE.TorusGeometry(0.5, 0.012, 6, 40), new THREE.MeshStandardMaterial({
    color: ORANGE, emissive: ORANGE, emissiveIntensity: 0.9, metalness: 0.2, roughness: 0.5,
  }))
  ring.rotation.x = Math.PI / 2
  ring.position.y = 0.17
  root.add(ring)

  return { root, shoulder, elbow, spark }
}

// ---------------- holo + blueprint dressing ----------------
function buildBlueprint() {
  const g = new THREE.Group()
  const mat = new THREE.LineBasicMaterial({ color: BLUE_SOFT, transparent: true, opacity: 0.22 })
  const dim = (x1, y1, x2, y2, z) => {
    const t = 0.08
    const pts = [
      new THREE.Vector3(x1, y1 - t, z), new THREE.Vector3(x1, y1 + t, z),
      new THREE.Vector3(x1, y1, z), new THREE.Vector3(x2, y2, z),
      new THREE.Vector3(x2, y2 - t, z), new THREE.Vector3(x2, y2 + t, z),
    ]
    const geo = new THREE.BufferGeometry().setFromPoints(pts)
    g.add(new THREE.LineSegments(geo, mat))
  }
  dim(-2.6, 2.3, 2.7, 2.3, -1.4)   // overall length dim
  dim(3.15, 0.05, 3.15, 1.55, -1.2) // height dim
  return g
}

export default function HeroScene3D() {
  const mountRef = useRef(null)

  useEffect(() => {
    const el = mountRef.current
    if (!el) return
    try {
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches

    const scene = new THREE.Scene()
    scene.fog = new THREE.FogExp2(0x04060b, 0.02)
    const camera = new THREE.PerspectiveCamera(33, 1, 0.1, 60)
    camera.position.set(-0.4, 2.3, 10.4)
    camera.lookAt(-0.1, 0.55, 0)

    let renderer
    try {
      renderer = new THREE.WebGLRenderer({ antialias: !coarse, alpha: true, powerPreference: 'high-performance' })
      if (!renderer.getContext()) throw new Error('no-webgl-context')
    } catch (err) {
      // No usable WebGL context — surface to the error boundary for the static fallback.
      if (typeof window !== 'undefined') {
        window.dispatchEvent(new CustomEvent('ac-webgl-failed'))
      }
      throw err
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, coarse ? 1.35 : 1.6))
    renderer.toneMapping = THREE.ACESFilmicToneMapping
    renderer.toneMappingExposure = 1.12
    el.appendChild(renderer.domElement)

    const pmrem = new THREE.PMREMGenerator(renderer)
    // Automotive-studio environment: long white softbox strips over a dark
    // room — this is what gives real car photography its crisp reflections.
    const studio = new THREE.Scene()
    studio.background = new THREE.Color(0x0a0d14)
    const soft = (wd, hg, x, y, z, ry, intensity) => {
      const m = new THREE.Mesh(
        new THREE.PlaneGeometry(wd, hg),
        new THREE.MeshBasicMaterial({ color: new THREE.Color(intensity, intensity, intensity) })
      )
      m.position.set(x, y, z); m.rotation.y = ry; m.lookAt(0, 0, 0)
      studio.add(m)
    }
    soft(14, 2.2, 0, 8, 0, 0, 9)        // long ceiling strip (the classic beltline highlight)
    soft(8, 1.4, -9, 4, 3, 0, 4)        // left softbox
    soft(8, 1.4, 9, 4, -3, 0, 3.2)      // right softbox
    soft(5, 1.0, 0, 3, -9, 0, 2.2)      // back accent
    const cyanCard = new THREE.Mesh(new THREE.PlaneGeometry(6, 1), new THREE.MeshBasicMaterial({ color: new THREE.Color(0.4, 1.6, 2.0) }))
    cyanCard.position.set(-6, 1.4, 6); cyanCard.lookAt(0, 0.6, 0)
    studio.add(cyanCard)                 // subtle cool kicker in the paint
    const envTex = pmrem.fromScene(studio, 0.03).texture
    studio.traverse((o) => { if (o.geometry) o.geometry.dispose() })
    scene.environment = envTex

    const glowTex = makeGlowTexture()
    const world = new THREE.Group()
    scene.add(world)

    // ---- cinematic studio rig ----
    scene.add(new THREE.HemisphereLight(0xbdd4ff, 0x0a0f1c, 0.75))
    const top = new THREE.DirectionalLight(0xffffff, 1.5)   // white top light
    top.position.set(1, 9, 2)
    scene.add(top)
    const keyBlue = new THREE.PointLight(BLUE, 36, 16)      // blue key
    keyBlue.position.set(5, 2.6, 3.5)
    world.add(keyBlue)
    const rimOrange = new THREE.PointLight(ORANGE, 28, 13)  // orange rim
    rimOrange.position.set(-4, 1.6, -2.5)
    world.add(rimOrange)
    const bounce = new THREE.PointLight(0x9fb6e8, 8, 8)     // ground bounce
    bounce.position.set(0, 0.15, 2)
    world.add(bounce)

    // volumetric-style soft glows
    const volBlue = glowSprite(glowTex, BLUE, 7, 5, 0.12); volBlue.position.set(2, 2.2, -3)
    const volOrange = glowSprite(glowTex, ORANGE, 5, 4, 0.1); volOrange.position.set(-3.4, 1.8, -2.6)
    world.add(volBlue, volOrange)
    // colored light pools on the showroom floor
    const poolBlue = glowSprite(glowTex, BLUE, 6, 2.2, 0.14); poolBlue.position.set(3.2, 0.12, 1.5)
    const poolOrange = glowSprite(glowTex, ORANGE, 4.5, 1.8, 0.12); poolOrange.position.set(-3.6, 0.12, 1.2)
    const poolCyan = glowSprite(glowTex, 0x7dd3fc, 3.5, 1.4, 0.1); poolCyan.position.set(0.5, 0.12, 2.8)
    world.add(poolBlue, poolOrange, poolCyan)

    // ---- floating diagnostic platform (the engineering island) ----
    const platShape = new THREE.Shape()
    {
      const W = 6.6, D = 4.3, R = 1.1 // half-width, half-depth, corner radius
      platShape.moveTo(-W + R, -D)
      platShape.lineTo(W - R, -D); platShape.absarc(W - R, -D + R, R, -Math.PI / 2, 0, false)
      platShape.lineTo(W, D - R); platShape.absarc(W - R, D - R, R, 0, Math.PI / 2, false)
      platShape.lineTo(-W + R, D); platShape.absarc(-W + R, D - R, R, Math.PI / 2, Math.PI, false)
      platShape.lineTo(-W, -D + R); platShape.absarc(-W + R, -D + R, R, Math.PI, Math.PI * 1.5, false)
    }
    // mirror deck (desktop) + dark glaze, clipped to the platform shape
    if (!coarse) {
      const mirror = new Reflector(new THREE.ShapeGeometry(platShape, 24), {
        clipBias: 0.003, textureWidth: 1024, textureHeight: 1024, color: 0x9aa4b8,
      })
      mirror.rotation.x = -Math.PI / 2
      mirror.position.y = -0.001
      world.add(mirror)
    }
    const glaze = new THREE.Mesh(
      new THREE.ShapeGeometry(platShape, 24),
      new THREE.MeshStandardMaterial({
        color: INK, metalness: 0.7, roughness: 0.4,
        transparent: true, opacity: coarse ? 1 : 0.82, envMapIntensity: 0.5,
      })
    )
    glaze.rotation.x = -Math.PI / 2
    glaze.position.y = coarse ? 0 : 0.001
    world.add(glaze)
    // slab body with glowing rim
    const slabGeo = new THREE.ExtrudeGeometry(platShape, { depth: 0.55, bevelEnabled: true, bevelThickness: 0.06, bevelSize: 0.06, bevelSegments: 2, curveSegments: 24 })
    const slab = new THREE.Mesh(slabGeo, new THREE.MeshStandardMaterial({ color: 0x090f1c, metalness: 0.55, roughness: 0.6 }))
    slab.rotation.x = Math.PI / 2
    slab.position.y = -0.005
    world.add(slab)
    const rimPts = platShape.getPoints(64).map((p) => new THREE.Vector3(p.x, 0.015, -p.y))
    rimPts.push(rimPts[0].clone())
    const rim = new THREE.Line(
      new THREE.BufferGeometry().setFromPoints(rimPts),
      new THREE.LineBasicMaterial({ color: BLUE, transparent: true, opacity: 0.8 })
    )
    world.add(rim)
    // island float: glow beneath the slab
    const underIsland = glowSprite(glowTex, BLUE, 12, 4.5, 0.16)
    underIsland.position.set(0, -1.3, 0)
    world.add(underIsland)
    const underIsland2 = glowSprite(glowTex, ORANGE, 6, 2.5, 0.08)
    underIsland2.position.set(-2.5, -1.6, 0)
    world.add(underIsland2)
    // deck grid
    const grid = new THREE.GridHelper(8, 12, BLUE, 0x14203a)
    grid.material.transparent = true
    grid.material.opacity = 0.16
    grid.position.y = 0.003
    world.add(grid)

    // ---- overhead sensor gantry with scanning beams ----
    const gantry = new THREE.Group()
    world.add(gantry)
    const gantryMat = new THREE.MeshStandardMaterial({ color: 0x1a2233, metalness: 0.8, roughness: 0.35 })
    const post = new THREE.Mesh(new THREE.CylinderGeometry(0.07, 0.09, 2.7, 10), gantryMat)
    post.position.set(0.4, 1.35, -3.0)
    gantry.add(post)
    const beam = new THREE.Mesh(new THREE.BoxGeometry(0.14, 0.1, 5.2), gantryMat)
    beam.position.set(0.4, 2.72, -0.4)
    gantry.add(beam)
    const beamStrip = new THREE.Mesh(new THREE.BoxGeometry(0.03, 0.02, 4.8), new THREE.MeshStandardMaterial({
      color: BLUE, emissive: BLUE, emissiveIntensity: 1.6, roughness: 0.4 }))
    beamStrip.position.set(0.4, 2.66, -0.4)
    gantry.add(beamStrip)
    const scanBeams = []
    for (const bz of [-1.4, 0, 1.4]) {
      const pod = new THREE.Mesh(new THREE.BoxGeometry(0.12, 0.08, 0.16), gantryMat)
      pod.position.set(0.4, 2.6, bz)
      gantry.add(pod)
      const beamGeo = new THREE.PlaneGeometry(0.22, 1.75)
      const b = new THREE.Mesh(beamGeo, new THREE.MeshBasicMaterial({
        color: BLUE_SOFT, transparent: true, opacity: 0.06,
        blending: THREE.AdditiveBlending, depthWrite: false, side: THREE.DoubleSide,
      }))
      b.position.set(0.4, 1.72, bz)
      gantry.add(b)
      scanBeams.push(b)
    }

    // (Old translucent holographic avatar removed — the real technician is
    //  now loaded from /human.glb and placed beside the car.)

    // ---- holo icon totems on the platform corners ----
    const totems = []
    for (const [tx, tz, col] of [[-4.9, 2.4, ORANGE], [5.2, -2.9, BLUE]]) {
      const post = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.05, 8), gantryMat)
      post.position.set(tx, 0.52, tz)
      world.add(post)
      const icon = glowSprite(glowTex, col, 0.5, 0.5, 0.8)
      icon.position.set(tx, 1.3, tz)
      world.add(icon)
      const haloRing = edgeLines(new THREE.TorusGeometry(0.26, 0.012, 6, 28), col, 0.6, 60)
      haloRing.position.set(tx, 1.3, tz)
      world.add(haloRing)
      totems.push({ icon, haloRing })
    }

    // ---- diagnostic trolley + cable dressing ----
    const trolley = new THREE.Group()
    const trolleyBody = new THREE.Mesh(new THREE.BoxGeometry(0.42, 0.58, 0.34), new THREE.MeshStandardMaterial({
      color: 0x18202f, metalness: 0.7, roughness: 0.4 }))
    trolleyBody.position.y = 0.44
    trolley.add(trolleyBody)
    for (let i = 0; i < 3; i++) {
      const dot = new THREE.Mesh(new THREE.SphereGeometry(0.02, 6, 6), new THREE.MeshStandardMaterial({
        color: i === 1 ? ORANGE : BLUE, emissive: i === 1 ? ORANGE : BLUE, emissiveIntensity: 2 }))
      dot.position.set(0.28, 0.62 - i * 0.14, 0.1)
      trolley.add(dot)
    }
    const trolleyDots = trolley.children.slice(1)
    trolley.position.set(4.2, 0, 2.45)
    world.add(trolley)
    const cableMat = new THREE.MeshStandardMaterial({ color: 0x10141f, metalness: 0.2, roughness: 0.85 })
    const cable1 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(4.0, 0.3, 2.4), new THREE.Vector3(3.0, 0.06, 1.9), new THREE.Vector3(2.2, 0.04, 1.3),
    ]), 12, 0.025, 6), cableMat)
    world.add(cable1)
    const cable2 = new THREE.Mesh(new THREE.TubeGeometry(new THREE.CatmullRomCurve3([
      new THREE.Vector3(-5.2, 0.04, 1.2), new THREE.Vector3(-6.2, -0.3, 1.4), new THREE.Vector3(-6.5, -0.9, 1.5),
    ]), 10, 0.03, 6), cableMat)
    world.add(cable2)

    // ---- inspection-bay stage platform (diorama) ----
    const stage = new THREE.Group()
    world.add(stage)
    const plinth = new THREE.Mesh(
      new THREE.BoxGeometry(10.8, 0.24, 6.8),
      new THREE.MeshStandardMaterial({ color: 0x0d1424, metalness: 0.65, roughness: 0.45, envMapIntensity: 0.5 })
    )
    plinth.position.set(-0.2, -0.135, 0)
    stage.add(plinth)
    const rimMatGlow = new THREE.MeshStandardMaterial({ color: BLUE, emissive: BLUE, emissiveIntensity: 1.8, roughness: 0.4 })
    for (const [w2, d2, px, pz] of [[10.8, 0.05, -0.2, 3.4], [10.8, 0.05, -0.2, -3.4], [0.05, 6.8, 5.2, 0], [0.05, 6.8, -5.6, 0]]) {
      const rim = new THREE.Mesh(new THREE.BoxGeometry(w2, 0.025, d2), rimMatGlow)
      rim.position.set(px, 0.012, pz)
      stage.add(rim)
    }
    // blueprint decals on the deck
    const bpCanvas = document.createElement('canvas')
    bpCanvas.width = 512; bpCanvas.height = 320
    {
      const c = bpCanvas.getContext('2d')
      c.strokeStyle = 'rgba(96,165,250,0.9)'
      c.lineWidth = 2
      c.strokeRect(20, 20, 180, 90)
      c.strokeRect(40, 40, 60, 30)
      c.beginPath(); c.arc(260, 70, 40, 0, Math.PI * 2); c.stroke()
      c.beginPath(); c.arc(260, 70, 22, 0, Math.PI * 2); c.stroke()
      c.beginPath(); c.moveTo(330, 30); c.lineTo(490, 30); c.lineTo(470, 110); c.lineTo(350, 110); c.closePath(); c.stroke()
      for (let i = 0; i < 6; i++) { c.beginPath(); c.moveTo(30 + i * 80, 150); c.lineTo(70 + i * 80, 150); c.stroke() }
      c.strokeRect(30, 180, 440, 60)
      for (let i = 1; i < 8; i++) { c.beginPath(); c.moveTo(30 + i * 55, 180); c.lineTo(30 + i * 55, 240); c.stroke() }
      c.font = '16px monospace'
      c.fillStyle = 'rgba(96,165,250,0.9)'
      c.fillText('AC-EV01 · DIGITAL TWIN BAY', 30, 285)
      c.fillText('REF 26262 / A-SPICE', 330, 285)
    }
    const bpTex = new THREE.CanvasTexture(bpCanvas)
    const bpPlane = new THREE.Mesh(
      new THREE.PlaneGeometry(6.6, 4.1),
      new THREE.MeshBasicMaterial({ map: bpTex, transparent: true, opacity: 0.22, depthWrite: false })
    )
    bpPlane.rotation.x = -Math.PI / 2
    bpPlane.position.set(0.4, 0.014, 0)
    stage.add(bpPlane)
    // display totems
    for (const [tx, tz, rot] of [[4.5, 1.9, -0.5], [-4.8, -1.6, 0.6]]) {
      const pole = new THREE.Mesh(new THREE.CylinderGeometry(0.035, 0.05, 1.15, 10),
        new THREE.MeshStandardMaterial({ color: 0x1c2333, metalness: 0.7, roughness: 0.4 }))
      pole.position.set(tx, 0.57, tz)
      stage.add(pole)
      const totem = new THREE.Mesh(
        new THREE.PlaneGeometry(0.78, 0.5),
        new THREE.MeshBasicMaterial({ map: bpTex, transparent: true, opacity: 0.65, side: THREE.DoubleSide, depthWrite: false })
      )
      totem.position.set(tx, 1.3, tz)
      totem.rotation.y = rot
      stage.add(totem)
    }

    // ---- holographic rings ----
    const ringGroup = new THREE.Group()
    ringGroup.position.set(0.3, 1.45, -2.2)
    world.add(ringGroup)
    const rBlue = edgeLines(new THREE.TorusGeometry(3.15, 0.03, 6, 64, Math.PI), BLUE, 0.45, 60)
    const rOrange = edgeLines(new THREE.TorusGeometry(3.15, 0.03, 6, 64, Math.PI), ORANGE, 0.45, 60)
    rOrange.rotation.z = Math.PI
    ringGroup.add(rBlue, rOrange)
    const ring2 = edgeLines(new THREE.TorusGeometry(2.4, 0.018, 6, 64), BLUE_SOFT, 0.22, 60)
    ring2.position.set(0.3, 1.45, -2.6)
    ring2.rotation.x = 0.35
    world.add(ring2)

    // ---- blueprint dimension lines ----
    const blueprint = buildBlueprint()
    world.add(blueprint)

    // ---- holo floor projection ring under the car ----
    const holoRing = new THREE.Group()
    holoRing.position.set(0.75, 0.012, 0)
    world.add(holoRing)
    const hr1 = edgeLines(new THREE.TorusGeometry(3.0, 0.008, 4, 80), BLUE, 0.35, 60)
    hr1.rotation.x = Math.PI / 2
    holoRing.add(hr1)
    for (let i = 0; i < 12; i++) {
      const a = (i / 12) * Math.PI * 2
      const dash = edgeLines(new THREE.BoxGeometry(0.22, 0.001, 0.02), BLUE_SOFT, 0.4)
      dash.position.set(Math.cos(a) * 2.72, 0, Math.sin(a) * 2.72)
      dash.rotation.y = -a + Math.PI / 2
      holoRing.add(dash)
    }

    // ---- floating telemetry HUD panel ----
    const hudCanvas = document.createElement('canvas')
    hudCanvas.width = 512; hudCanvas.height = 320
    {
      const c = hudCanvas.getContext('2d')
      c.fillStyle = 'rgba(13,20,40,0.72)'
      c.strokeStyle = 'rgba(96,165,250,0.9)'
      c.lineWidth = 3
      c.beginPath(); c.roundRect(6, 6, 500, 308, 22); c.fill(); c.stroke()
      c.fillStyle = 'rgba(96,165,250,1)'
      c.font = '600 30px monospace'
      c.fillText('VEHICLE TELEMETRY', 34, 58)
      c.fillStyle = 'rgba(255,138,0,0.95)'
      c.fillText('● LIVE', 380, 58)
      c.strokeStyle = 'rgba(96,165,250,0.4)'
      c.lineWidth = 2
      for (let i = 0; i < 3; i++) { c.beginPath(); c.moveTo(34, 100 + i * 56); c.lineTo(478, 100 + i * 56); c.stroke() }
      c.strokeStyle = 'rgba(255,138,0,0.9)'
      c.lineWidth = 4
      c.beginPath()
      c.moveTo(34, 220)
      for (let x = 0; x <= 444; x += 20) c.lineTo(34 + x, 220 - Math.abs(Math.sin(x * 0.045)) * 90 - Math.random() * 14)
      c.stroke()
      c.fillStyle = 'rgba(96,165,250,0.85)'
      for (let i = 0; i < 6; i++) c.fillRect(40 + i * 78, 268 - (18 + (i * 37) % 34), 40, 18 + (i * 37) % 34 + 14)
    }
    const hudTex = new THREE.CanvasTexture(hudCanvas)
    const hud = new THREE.Mesh(
      new THREE.PlaneGeometry(2.5, 1.56),
      new THREE.MeshBasicMaterial({ map: hudTex, transparent: true, opacity: 0.92, depthWrite: false, side: THREE.DoubleSide })
    )
    hud.position.set(3.1, 2.3, -2.7)
    hud.rotation.y = -0.45
    world.add(hud)
    // billboard stand
    const standMat = new THREE.MeshStandardMaterial({ color: 0x1a2233, metalness: 0.8, roughness: 0.35 })
    for (const px of [2.75, 3.85]) {
      const bpost = new THREE.Mesh(new THREE.CylinderGeometry(0.045, 0.06, 1.55, 8), standMat)
      bpost.position.set(px, 0.78, -2.7 - (px - 3.3) * 0.48)
      world.add(bpost)
    }

    // ---- engineering callout leader lines ----
    const calloutMat = new THREE.LineBasicMaterial({ color: BLUE_SOFT, transparent: true, opacity: 0.55 })
    const callout1 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(0.4, 1.18, 0), new THREE.Vector3(1.35, 2.0, -1.1), new THREE.Vector3(1.6, 2.0, -1.4),
    ]), calloutMat)
    world.add(callout1)
    const callout2 = new THREE.Line(new THREE.BufferGeometry().setFromPoints([
      new THREE.Vector3(2.25, 0.3, 1.0), new THREE.Vector3(3.1, 1.15, 1.0), new THREE.Vector3(3.7, 1.15, 1.0),
    ]), calloutMat)
    world.add(callout2)
    const cDot1 = glowSprite(glowTex, BLUE_SOFT, 0.12, 0.12, 0.9); cDot1.position.set(0.4, 1.18, 0)
    const cDot2 = glowSprite(glowTex, ORANGE, 0.12, 0.12, 0.9); cDot2.position.set(2.25, 0.3, 1.0)
    world.add(cDot1, cDot2)

    // ---- hologram scan ring sweeping the car ----
    const scanRing = new THREE.Mesh(
      new THREE.TorusGeometry(1.05, 0.014, 6, 60),
      new THREE.MeshBasicMaterial({ color: BLUE_SOFT, transparent: true, opacity: 0.3, blending: THREE.AdditiveBlending, depthWrite: false })
    )
    scanRing.rotation.y = Math.PI / 2
    scanRing.scale.y = 0.78
    scanRing.position.set(0.75, 0.72, 0)
    world.add(scanRing)

    // ---- wheel telemetry arcs (front wheel) ----
    const gauge = new THREE.Group()
    gauge.position.set(2.25, 0.28, 1.0)
    world.add(gauge)
    const ga1 = edgeLines(new THREE.TorusGeometry(0.62, 0.012, 4, 40, Math.PI * 1.2), BLUE_SOFT, 0.6, 60)
    const ga2 = edgeLines(new THREE.TorusGeometry(0.5, 0.01, 4, 40, Math.PI * 0.8), ORANGE, 0.55, 60)
    gauge.add(ga1, ga2)

    // ---- car + robot ----
    const { car, under, headlights, tailBarRef, paint, xrayEdges, glassMat, beams, beamPool } = buildCar(glowTex)
    car.position.x = 0.75
    world.add(car)

    // ---- photoreal upgrade slot ----------------------------------------
    // Drop a licensed model at public/car.glb and it automatically replaces
    // the procedural body: auto-scaled to the scene, grounded on the mirror
    // floor, centered, and lit by the full cinematic rig. The underglow,
    // contact shadow and light glows are kept.
    // Load the photoreal model straight away (no HEAD pre-flight round-trip).
    // The browser has already been told to preload /car.glb in index.html, so
    // by the time the GLTFLoader chunk arrives the bytes are usually cached.
    let loadedModel = null
    let humanModel = null, humanBaseY = 0, humanBaseRot = 0, humanBaseX = 0, humanRing = null, humanScan = null
    import('three/examples/jsm/loaders/GLTFLoader.js').then(({ GLTFLoader }) => {
      new GLTFLoader().load('/car.glb', (gltf) => {
        const m = gltf.scene
        const box = new THREE.Box3().setFromObject(m)
        const size = box.getSize(new THREE.Vector3())
        // most car models are longest along X or Z — face the nose to +X
        if (size.z > size.x) m.rotation.y = -Math.PI / 2
        const box2 = new THREE.Box3().setFromObject(m)
        const size2 = box2.getSize(new THREE.Vector3())
        const scale = 5.1 / Math.max(size2.x, 0.001)
        m.scale.setScalar(scale)
        const box3 = new THREE.Box3().setFromObject(m)
        m.position.y -= box3.min.y
        m.position.x -= (box3.min.x + box3.max.x) / 2
        m.position.z -= (box3.min.z + box3.max.z) / 2
        // Realism pass keyed by material name — real car paint colour,
        // proper glass, chrome trim, matte tires. Solid from every angle.
        m.traverse((o) => {
          if (!o.isMesh || !o.material) return
          const mats = Array.isArray(o.material) ? o.material : [o.material]
          o.material = mats.map((mat) => {
            const n = (mat.name || '').toLowerCase()
            if (n.includes('glass')) {
              return new THREE.MeshPhysicalMaterial({
                color: 0x0d1826, metalness: 0.1, roughness: 0.05,
                transparent: true, opacity: 0.42, depthWrite: false,
                envMapIntensity: 2.0, side: THREE.FrontSide,
              })
            }
            if (n.includes('paint') || n.includes('body')) {
              return new THREE.MeshPhysicalMaterial({
                color: 0x1c4f9e,                 // rich royal-blue metallic (brand)
                metalness: 0.88, roughness: 0.24,
                clearcoat: 1, clearcoatRoughness: 0.08,
                envMapIntensity: 1.6, side: THREE.DoubleSide,
              })
            }
            if (n.includes('tire') || n.includes('tyre')) {
              return new THREE.MeshStandardMaterial({
                color: 0x14171c, metalness: 0.05, roughness: 0.88,
                envMapIntensity: 0.5, side: THREE.DoubleSide,
              })
            }
            // trim / everything else: bright polished metal
            return new THREE.MeshStandardMaterial({
              color: 0xdfe6ef, metalness: 1, roughness: 0.14,
              envMapIntensity: 1.8, side: THREE.DoubleSide,
            })
          })
          o.material = Array.isArray(o.material) && o.material.length === 1 ? o.material[0] : o.material
        })
        // hide procedural body/wheels, keep sprites (shadow, glows) + tagged beams
        for (const ch of car.children) {
          if (!(ch instanceof THREE.Sprite) && !ch.userData.keep) ch.visible = false
        }
        car.add(m)
        // dark cabin fill — a small ellipsoid that tapers with the body, so
        // the car reads solid through the glass without poking outside panels
        {
          const mb = new THREE.Box3().setFromObject(m)
          const ms = mb.getSize(new THREE.Vector3())
          const inner = new THREE.Mesh(
            new THREE.SphereGeometry(1, 18, 12),
            new THREE.MeshStandardMaterial({ color: 0x0a0d13, roughness: 0.92, metalness: 0.1 })
          )
          inner.scale.set(ms.x * 0.27, ms.y * 0.22, ms.z * 0.27)
          inner.position.set(-ms.x * 0.03, ms.y * 0.36, 0)
          car.add(inner)
        }
        loadedModel = m
      }, undefined, () => { /* model unavailable — keep procedural car */ })

      // Optional realistic human: drop a rigged human model at public/human.glb
      // and a technician/engineer figure appears standing beside the car —
      // auto-scaled to human height, grounded on the floor, facing the car,
      // and relit by the scene's environment so it matches the composition.
      // If the file isn't present nothing shows (no error).
      new GLTFLoader().load('/human.glb', (gltf) => {
        const h = gltf.scene
        const hb = new THREE.Box3().setFromObject(h)
        const hs = hb.getSize(new THREE.Vector3())
        h.scale.setScalar(1.82 / Math.max(hs.y, 0.001))         // ~human height
        const hb2 = new THREE.Box3().setFromObject(h)
        h.position.y -= hb2.min.y                               // feet on the floor
        h.position.x = 0.95                                     // clear of the Cyber-Security chip
        h.position.z = 3.35                                     // forward toward the viewer
        h.rotation.y = -Math.PI * 0.34                          // 3/4 toward the viewer, glancing at the car
        // Colour the technician by part name: blue coverall, safety helmet,
        // glowing cyan AR visor, cyan gloves. Textured models are left as-is.
        const skin = {
          Coverall: { color: 0x2d5aaf },   // deep engineer-blue coverall
          Head:     { color: 0xe0bd98 },   // skin
          Helmet:   { color: 0xffb43e },   // safety-orange hard hat
          Visor:    { color: 0x8ff2ff },   // cyan AR visor
          Glove:    { color: 0x5ec2ec },   // cyan gloves
          Boot:     { color: 0x33394a },   // dark boots
          Vest:     { color: 0xdff23a },   // hi-vis safety vest
        }
        const partKey = (o) => {
          const n = (o.name || '') + ' ' + ((o.material && o.material.name) || '')
          return Object.keys(skin).find((k) => n.includes(k))
        }
        h.traverse((o) => {
          if (!o.isMesh || !o.material) return
          const textured = Array.isArray(o.material) ? o.material.some((m) => m.map) : o.material.map
          if (textured) return   // photoreal model: keep authored textures
          if (o.geometry && o.geometry.attributes && o.geometry.attributes.color) {
            // model carries baked directional shading in its vertex colours →
            // renders as a properly-lit 3D character (not a flat cartoon)
            o.material = new THREE.MeshBasicMaterial({ vertexColors: true, toneMapped: false })
          } else {
            const c = skin[partKey(o)] || skin.Coverall
            o.material = new THREE.MeshBasicMaterial({ color: c.color, toneMapped: false })
          }
        })
        // strong frontal key + fill + cyan rim so the technician is fully lit
        const hKey = new THREE.SpotLight(0xffffff, 140, 11, Math.PI / 4, 0.5, 1.0)
        hKey.position.set(h.position.x + 1.1, 3.4, h.position.z + 3.4)
        hKey.target.position.set(h.position.x, 1.05, h.position.z)
        world.add(hKey, hKey.target)
        const hFill = new THREE.PointLight(0xcfe0ff, 40, 7)
        hFill.position.set(h.position.x + 0.2, 1.7, h.position.z + 1.8)
        world.add(hFill)
        const hRim = new THREE.PointLight(0x67e8f9, 22, 4.5)
        hRim.position.set(h.position.x - 0.9, 1.85, h.position.z - 0.8)
        world.add(hRim)
        // holographic inspection tablet in front of the figure — "AI workshop" cue
        const tablet = new THREE.Mesh(new THREE.PlaneGeometry(0.42, 0.28),
          new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.55, side: THREE.DoubleSide, depthWrite: false }))
        tablet.position.set(h.position.x + 0.3, 1.18, h.position.z + 0.4)
        tablet.rotation.set(-0.5, 0.5, -0.05)
        world.add(tablet)
        const tabletGlow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x67e8f9, transparent: true, opacity: 0.4, depthWrite: false }))
        tabletGlow.scale.set(0.9, 0.7, 1); tabletGlow.position.copy(tablet.position); world.add(tabletGlow)
        // soft contact shadow under the figure
        const hShadow = new THREE.Sprite(new THREE.SpriteMaterial({ map: glowTex, color: 0x000000, transparent: true, opacity: 0.42, depthWrite: false }))
        hShadow.scale.set(1.0, 0.46, 1); hShadow.position.set(h.position.x, 0.02, h.position.z); world.add(hShadow)
        const hRing = new THREE.Mesh(
          new THREE.TorusGeometry(0.62, 0.014, 8, 48),
          new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.6, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
        )
        hRing.rotation.x = Math.PI / 2
        hRing.position.set(h.position.x, 0.03, h.position.z)
        world.add(hRing)
        // scanning beam from the tablet toward the car (inspection cue)
        const scanBeam = new THREE.Mesh(
          new THREE.PlaneGeometry(2.4, 0.14),
          new THREE.MeshBasicMaterial({ color: 0x67e8f9, transparent: true, opacity: 0.14, side: THREE.DoubleSide, blending: THREE.AdditiveBlending, depthWrite: false, toneMapped: false })
        )
        scanBeam.position.set(h.position.x - 1.15, 1.05, h.position.z - 0.55)
        scanBeam.rotation.set(-0.15, 0.7, 0.02)
        world.add(scanBeam)
        humanScan = scanBeam
        world.add(h)
        humanModel = h; humanBaseY = h.position.y; humanBaseRot = h.rotation.y; humanBaseX = h.position.x; humanRing = hRing
      }, undefined, () => { /* no human model provided — scene shows car + robot only */ })
    }).catch(() => {})

    const { root: robot, shoulder, elbow, spark } = buildRobot(glowTex)
    const ROBOT_POS = new THREE.Vector3(-3.05, 0, 0.4)
    robot.position.copy(ROBOT_POS)
    world.add(robot)

    // weld seam along the trunk shoulder
    const seamA = new THREE.Vector2(-1.35, 0.76)
    const seamB = new THREE.Vector2(-0.75, 0.79)
    const shoulderWorld = new THREE.Vector2(ROBOT_POS.x, 1.0)
    const weldLight = new THREE.PointLight(0xffa050, 0, 5)
    world.add(weldLight)

    // blue inspection laser fan (visible during scan mode)
    const laserGeo = new THREE.BufferGeometry()
    laserGeo.setAttribute('position', new THREE.BufferAttribute(new Float32Array(9), 3))
    const laser = new THREE.Mesh(laserGeo, new THREE.MeshBasicMaterial({
      color: BLUE_SOFT, transparent: true, opacity: 0.16, side: THREE.DoubleSide,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    world.add(laser)
    const laserLine = glowSprite(glowTex, BLUE_SOFT, 0.16, 0.16, 0)
    world.add(laserLine)

    // spark burst particles
    const S_COUNT = coarse ? 16 : 30
    const sPos = new Float32Array(S_COUNT * 3)
    const sVel = []
    const sLife = new Float32Array(S_COUNT)
    for (let i = 0; i < S_COUNT; i++) { sLife[i] = Math.random(); sVel.push(new THREE.Vector3()) }
    const sGeo = new THREE.BufferGeometry()
    sGeo.setAttribute('position', new THREE.BufferAttribute(sPos, 3))
    const sparks = new THREE.Points(sGeo, new THREE.PointsMaterial({
      color: 0xffc078, size: 0.05, transparent: true, opacity: 0.95,
      blending: THREE.AdditiveBlending, depthWrite: false,
    }))
    world.add(sparks)

    // light sweep across the paint
    const sweep = glowSprite(glowTex, 0xffffff, 0.7, 4.2, 0)
    sweep.position.set(-3, 1.2, 0.9)
    world.add(sweep)

    // ambient data particles
    const pCount = coarse ? 80 : 160
    const pPos = new Float32Array(pCount * 3)
    for (let i = 0; i < pCount; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 15
      pPos[i * 3 + 1] = Math.random() * 5.5
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 10
    }
    const pGeo = new THREE.BufferGeometry()
    pGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3))
    const particles = new THREE.Points(pGeo, new THREE.PointsMaterial({
      color: BLUE_SOFT, size: 0.045, transparent: true, opacity: 0.55,
    }))
    world.add(particles)

    // ---- 2-link IK ----
    const solveArm = (tx, ty) => {
      let dx = tx - shoulderWorld.x
      let dy = ty - shoulderWorld.y
      let d = Math.hypot(dx, dy)
      d = Math.min(Math.max(d, Math.abs(L1 - L2) + 0.05), L1 + L2 - 0.02)
      const baseAng = Math.atan2(dy, dx)
      const cosA = (L1 * L1 + d * d - L2 * L2) / (2 * L1 * d)
      const a = Math.acos(Math.min(Math.max(cosA, -1), 1))
      const th1 = baseAng + a
      const ex = shoulderWorld.x + Math.cos(th1) * L1
      const ey = shoulderWorld.y + Math.sin(th1) * L1
      const th2 = Math.atan2(ty - ey, tx - ex)
      shoulder.rotation.z = th1 - Math.PI / 2
      elbow.rotation.z = th2 - th1
      return { x: ex + Math.cos(th2) * L2, y: ey + Math.sin(th2) * L2 }
    }

    // X-ray digital-twin mode (toggled from the page UI)
    let scanTarget = 0, scanBlend = 0
    const onScanToggle = (e) => { scanTarget = e.detail ? 1 : 0 }
    window.addEventListener('ac-xray', onScanToggle)

    // interaction — hover parallax + free 360° drag-orbit with inertia
    let targetRX = 0, targetRY = 0
    const onPointer = (e) => {
      const r = el.getBoundingClientRect()
      targetRY = ((e.clientX - r.left) / r.width - 0.5) * 0.34
      targetRX = ((e.clientY - r.top) / r.height - 0.5) * 0.15
    }
    if (!coarse && !reduced) el.addEventListener('pointermove', onPointer)

    let dragging = false
    let dragYaw = 0, dragPitch = 0
    let yawVel = 0
    let lastX = 0, lastY = 0
    el.style.cursor = 'grab'
    el.style.touchAction = 'pan-y' // keep vertical page scroll on touch
    const onDown = (e) => {
      dragging = true
      yawVel = 0
      lastX = e.clientX
      lastY = e.clientY
      el.style.cursor = 'grabbing'
      el.setPointerCapture?.(e.pointerId)
    }
    const onDrag = (e) => {
      if (!dragging) return
      const dx = e.clientX - lastX
      const dy = e.clientY - lastY
      lastX = e.clientX
      lastY = e.clientY
      dragYaw += dx * 0.008            // full, unbounded 360° yaw
      yawVel = dx * 0.008
      dragPitch = Math.min(0.4, Math.max(-0.25, dragPitch + dy * 0.003))
    }
    const onUp = (e) => {
      dragging = false
      el.style.cursor = 'grab'
      el.releasePointerCapture?.(e.pointerId)
    }
    if (!reduced) {
      el.addEventListener('pointerdown', onDown)
      el.addEventListener('pointermove', onDrag)
      window.addEventListener('pointerup', onUp)
      el.addEventListener('pointercancel', onUp)
    }
    let scrollRot = 0
    const onScroll = () => { scrollRot = window.scrollY * 0.00035 }
    if (!reduced) window.addEventListener('scroll', onScroll, { passive: true })

    const resize = () => {
      const w = el.clientWidth, h = el.clientHeight
      if (!w || !h) return
      renderer.setSize(w, h, false)
      camera.aspect = w / h
      camera.updateProjectionMatrix()
    }
    resize()
    const ro = new ResizeObserver(resize)
    ro.observe(el)

    let raf, running = false
    const clock = new THREE.Clock()
    let prev = 0
    const BASE_YAW = -0.38 // three-quarter front composition

    const tick = () => {
      const t = clock.getElapsedTime()
      const dt = Math.min(t - prev, 0.05)
      prev = t

      if (!dragging) {
        dragYaw += yawVel          // momentum after release
        yawVel *= 0.94
        dragPitch += (0 - dragPitch) * 0.02 // pitch eases back level
      }
      world.rotation.y += ((BASE_YAW + targetRY + scrollRot + dragYaw) - world.rotation.y) * (dragging ? 0.35 : 0.08)
      world.rotation.x += ((0.015 + targetRX + dragPitch) - world.rotation.x) * (dragging ? 0.35 : 0.06)

      // vehicle breathing
      car.position.y = Math.sin(t * 0.9) * 0.018
      // Lights are STEADY (no pulsing/blinking) and softly dimmed, like a real
      // car parked under studio lighting rather than headlights on full beam.
      under.material.opacity = 0.3
      headlights[0].material.opacity = 0.42
      headlights[1].material.opacity = 0.42
      beams[0].material.opacity = 0.05
      beams[1].material.opacity = 0.05
      beamPool.material.opacity = 0.08
      tailBarRef.material.emissiveIntensity = 2.0

      // holo rings
      ringGroup.rotation.z = t * 0.18
      ring2.rotation.z = -t * 0.12
      holoRing.rotation.y = t * 0.15
      gauge.rotation.z = t * 0.6
      ga2.rotation.z = -t * 0.9
      scanRing.position.x = 0.75 + Math.sin(t * 0.35) * 2.3
      scanRing.material.opacity = 0.16 + Math.abs(Math.sin(t * 0.35)) * 0.18
      hud.material.opacity = 0.86 + Math.sin(t * 1.6) * 0.06
      // gantry scan beams pulse in sequence
      for (let i = 0; i < scanBeams.length; i++) {
        scanBeams[i].material.opacity = 0.02 + Math.abs(Math.sin(t * 1.2 + i * 1.1)) * 0.06
      }
      // (holographic engineer removed)
      if (humanModel) {
        // livelier idle: breathing bob + weight shift + a slow glance between car and tablet
        humanModel.position.y = humanBaseY + Math.sin(t * 1.7) * 0.022
        humanModel.rotation.y = humanBaseRot + Math.sin(t * 0.42) * 0.13 + Math.sin(t * 1.1) * 0.03
        humanModel.rotation.z = Math.sin(t * 0.85) * 0.012
        humanModel.position.x = humanBaseX + Math.sin(t * 0.42) * 0.05
      }
      if (humanRing) humanRing.rotation.z = t * 0.45
      if (humanScan) humanScan.material.opacity = 0.06 + Math.abs(Math.sin(t * 2.1)) * 0.2
      // totems pulse
      for (let i = 0; i < totems.length; i++) {
        totems[i].icon.material.opacity = 0.5 + Math.abs(Math.sin(t * 1.6 + i * 2)) * 0.5
        totems[i].haloRing.rotation.y = t * (0.6 + i * 0.3)
        totems[i].icon.position.y = 1.3 + Math.sin(t * 1.2 + i) * 0.05
      }
      // trolley status LEDs blink
      for (let i = 0; i < trolleyDots.length; i++) {
        trolleyDots[i].material.emissiveIntensity = 1.8
      }
      cDot1.material.opacity = 0.8
      cDot2.material.opacity = 0.8
      blueprint.position.y = Math.sin(t * 0.7) * 0.03

      // light sweep: pass every ~7s
      const cyc = (t % 7) / 7
      sweep.position.x = -3.4 + cyc * 7.2
      sweep.material.opacity = Math.sin(cyc * Math.PI) * 0.16

      // robot welding along seam
      const u = (Math.sin(t * 0.65) + 1) / 2
      const tx = seamA.x + (seamB.x - seamA.x) * u
      const ty = seamA.y + (seamB.y - seamA.y) * u + car.position.y
      const tip = solveArm(tx, ty)
      // X-ray blend: paint dissolves into hologram wireframe
      scanBlend += (scanTarget - scanBlend) * 0.06
      paint.opacity = 1 - scanBlend * 0.85
      glassMat.opacity = 0.92 - scanBlend * 0.66
      xrayEdges.material.opacity = scanBlend * 0.78
      under.material.color.setHex(scanBlend > 0.5 ? 0x60a5fa : 0x7db4ff)

      // alternate: 6s welding, 6s laser inspection (laser locked on in X-ray)
      const scanMode = scanBlend > 0.5 ? true : (t % 12) >= 6
      const working = !scanMode && Math.abs(Math.cos(t * 0.65)) > 0.25
      // laser fan during scan mode
      if (scanMode) {
        const lp = laser.geometry.attributes.position.array
        lp[0] = tip.x; lp[1] = tip.y; lp[2] = 0.82
        lp[3] = tx - 0.45; lp[4] = ty - 0.28; lp[5] = 0.86
        lp[6] = tx + 0.45; lp[7] = ty - 0.2; lp[8] = 0.86
        laser.geometry.attributes.position.needsUpdate = true
        laser.material.opacity = 0.12 + Math.abs(Math.sin(t * 6)) * 0.1
        laserLine.material.opacity = 0.8
        laserLine.position.set(tx + Math.sin(t * 4) * 0.4, ty - 0.24, 0.86)
      } else {
        laser.material.opacity = 0
        laserLine.material.opacity = 0
      }
      const flick = working ? (0.42 + Math.abs(Math.sin(t * 7)) * 0.22) : 0.05
      spark.material.opacity = flick
      const ssc = 0.2 + flick * 0.2
      spark.scale.set(ssc, ssc, 1)
      weldLight.position.set(tip.x, tip.y, 0.8)
      weldLight.intensity = working ? 9 + Math.abs(Math.sin(t * 6)) * 5 : 0.4

      const arr2 = sparks.geometry.attributes.position.array
      for (let i = 0; i < S_COUNT; i++) {
        sLife[i] -= dt * 1.6
        if (sLife[i] <= 0 && working) {
          sLife[i] = 0.35 + Math.random() * 0.4
          arr2[i * 3] = tip.x; arr2[i * 3 + 1] = tip.y; arr2[i * 3 + 2] = 0.8
          sVel[i].set((Math.random() - 0.3) * 1.6, Math.random() * 1.8 + 0.4, (Math.random() - 0.5) * 1.2)
        } else if (sLife[i] > 0) {
          sVel[i].y -= 4.5 * dt
          arr2[i * 3] += sVel[i].x * dt
          arr2[i * 3 + 1] += sVel[i].y * dt
          arr2[i * 3 + 2] += sVel[i].z * dt
        } else {
          arr2[i * 3 + 1] = -10
        }
      }
      sparks.geometry.attributes.position.needsUpdate = true

      // ambient particles
      const arr = particles.geometry.attributes.position.array
      for (let i = 0; i < pCount; i++) {
        arr[i * 3 + 1] += 0.0035
        if (arr[i * 3 + 1] > 5.5) arr[i * 3 + 1] = 0
      }
      particles.geometry.attributes.position.needsUpdate = true

      renderer.render(scene, camera)
      if (running) raf = requestAnimationFrame(tick)
    }

    if (reduced) {
      world.rotation.y = BASE_YAW
      solveArm(seamA.x, seamA.y)
      weldLight.intensity = 6
      weldLight.position.set(seamA.x, seamA.y, 0.8)
      renderer.render(scene, camera)
    } else {
      running = true
      raf = requestAnimationFrame(tick)
    }

    const io = new IntersectionObserver(([entry]) => {
      if (reduced) return
      if (entry.isIntersecting && !running) { running = true; clock.start(); prev = 0; raf = requestAnimationFrame(tick) }
      else if (!entry.isIntersecting && running) { running = false; cancelAnimationFrame(raf) }
    })
    io.observe(el)
    const onVis = () => {
      if (reduced) return
      if (document.hidden && running) { running = false; cancelAnimationFrame(raf) }
      else if (!document.hidden && !running) { running = true; raf = requestAnimationFrame(tick) }
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      running = false
      cancelAnimationFrame(raf)
      io.disconnect()
      ro.disconnect()
      document.removeEventListener('visibilitychange', onVis)
      el.removeEventListener('pointermove', onPointer)
      el.removeEventListener('pointerdown', onDown)
      el.removeEventListener('pointermove', onDrag)
      window.removeEventListener('pointerup', onUp)
      el.removeEventListener('pointercancel', onUp)
      window.removeEventListener('scroll', onScroll)
      window.removeEventListener('ac-xray', onScanToggle)
      glowTex.dispose()
      hudTex.dispose()
      envTex.dispose()
      if (loadedModel) {
        loadedModel.traverse((o) => {
          if (o.geometry) o.geometry.dispose()
          if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
        })
      }
      pmrem.dispose()
      scene.traverse((o) => {
        if (o.geometry) o.geometry.dispose()
        if (o.material) (Array.isArray(o.material) ? o.material : [o.material]).forEach((m) => m.dispose())
      })
      renderer.dispose()
      el.removeChild(renderer.domElement)
    }
    } catch {
      // any scene-init failure → graceful poster fallback, never a black panel
      window.dispatchEvent(new CustomEvent('ac-webgl-failed'))
    }
  }, [])

  return <div ref={mountRef} className="scene3d" aria-hidden="true" />
}
```

## `src/components/Icons.jsx`

```jsx
/**
 * Crisp inline SVG icon set (replaces emoji for consistent cross-platform
 * rendering). All icons inherit currentColor and are aria-hidden by default.
 */
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const MailIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
)
export const PinIcon = (p) => (
  <svg {...base} {...p}><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
)
export const FactoryIcon = (p) => (
  <svg {...base} {...p}><path d="M3 21V9l6 4V9l6 4V4h6v17Z" /><path d="M8 17h.01M12 17h.01M16 17h.01" /></svg>
)
export const HandshakeIcon = (p) => (
  <svg {...base} {...p}><path d="m11 17 2 2a2 2 0 0 0 2.8-2.8l-4.2-4.2m-4.4 4.4L5 14.2a2 2 0 0 1 0-2.8L9.6 6.8a2 2 0 0 1 2.8 0l.4.4m-5.6 7.2 2 2a2 2 0 0 0 2.8 0" /><path d="m18.8 13.8 1.7-1.7a2 2 0 0 0 0-2.8l-4.2-4.2a2 2 0 0 0-2.8 0l-1.1 1.1" /></svg>
)
export const GlobeIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 2.6 4 5.8 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.8-4-9s1.2-6.4 4-9Z" /></svg>
)
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3 5 6v5c0 4.6 3 8.4 7 10 4-1.6 7-5.4 7-10V6Z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const BoltIcon = (p) => (
  <svg {...base} {...p}><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2Z" /></svg>
)
export const CheckIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
```

## `src/components/LegalPage.jsx`

```jsx
import Page from './Page'
import SEO from '../seo/SEO'
import { legalMeta } from '../data/legal'

/**
 * Shared layout for Privacy Policy / Terms & Conditions.
 * Reading-first: quiet background, sticky section navigation,
 * editorial typography, minimal animation.
 */
export default function LegalPage({ seo, eyebrow, title, sections }) {
  return (
    <Page>
      <SEO seo={seo} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">{eyebrow}</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>{title}</h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p className="legal__updated">Last updated · {legalMeta.updated}</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 20 }}><div className="container">
        <div className="legal">
          <nav className="legal__toc" aria-label={`${title} sections`}>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>{s.title}</a>
            ))}
          </nav>
          <div className="legal__body">
            <p className="legal__note">{legalMeta.reviewNote}</p>
            {sections.map((s) => (
              <section className="legal__section" id={s.id} key={s.id}>
                <h2>{s.title}</h2>
                {s.body?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
                {s.after?.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
          </div>
        </div>
      </div></section>
    </Page>
  )
}
```

## `src/components/MagneticButton.jsx`

```jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Button/link that is magnetically pulled toward the cursor.
 * Renders a react-router <Link> when `to` is given, otherwise a <button>.
 *
 * - Buttons default to `type="button"` so they can never accidentally submit
 *   a surrounding form; pass `type="submit"` explicitly when that is intended.
 * - The magnetic pull is skipped entirely for reduced-motion users.
 * - `disabled` is honoured natively (no pointer-events hacks).
 */
export default function MagneticButton({
  children,
  to,
  className = '',
  strength = 0.4,
  type,
  disabled,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el || reduced || disabled) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  const isLink = Boolean(to)
  const Comp = isLink ? motion(Link) : motion.button
  const extraProps = isLink
    ? { to }
    : { type: type || 'button', disabled }

  return (
    <Comp
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={{ x: sx, y: sy }}
      {...extraProps}
      {...rest}
    >
      {children}
    </Comp>
  )
}
```

## `src/components/Navbar.css`

```css
/* ============================================================
   Navbar — floating liquid-glass dock
   ============================================================ */
@keyframes acNavIn {
  from { transform: translate3d(0, -70px, 0); }
  to   { transform: none; }
}
.nav--enter { animation: acNavIn 0.55s var(--ease-lux) both; }
@media (prefers-reduced-motion: reduce) {
  .nav--enter { animation: none; }
}

.nav {
  position: fixed;
  top: max(14px, env(safe-area-inset-top)); left: 0; right: 0;
  z-index: 100;
  padding: 0 18px;
  padding-left: max(18px, env(safe-area-inset-left));
  padding-right: max(18px, env(safe-area-inset-right));
  transition: top 0.35s var(--ease-lux);
}

.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  gap: 20px;
  height: 66px;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 14px 0 18px;
  border-radius: 100px;
  border: 1px solid rgba(255, 255, 255, 0.07);
  background: linear-gradient(180deg, rgba(16, 22, 39, 0.5), rgba(8, 12, 22, 0.42));
  backdrop-filter: blur(22px) saturate(170%);
  -webkit-backdrop-filter: blur(22px) saturate(170%);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.08),
    0 18px 50px -22px rgba(0, 0, 0, 0.75);
  transition: border-color 0.35s ease, background 0.35s ease, box-shadow 0.35s ease;
}
.nav--scrolled .nav__inner {
  border-color: rgba(255, 255, 255, 0.11);
  background: linear-gradient(180deg, rgba(14, 19, 34, 0.78), rgba(6, 9, 17, 0.7));
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.09),
    0 22px 60px -22px rgba(0, 0, 0, 0.85),
    0 0 40px -18px rgba(99, 102, 241, 0.35);
}

.nav__brand { display: flex; align-items: center; gap: 12px; }
.nav__logo {
  width: 38px; height: 38px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 6px 18px -6px rgba(99, 102, 241, 0.6);
}
.nav__brandtext {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.18rem;
  letter-spacing: 0.02em;
  white-space: nowrap;
}
.nav__dash { color: var(--cyan-400); }

.nav__links { display: flex; align-items: center; gap: 4px; }
.nav__link {
  position: relative;
  font-size: 0.92rem;
  font-weight: 500;
  color: var(--text-dim);
  padding: 9px 15px;
  border-radius: 100px;
  transition: color 0.25s ease, background 0.25s ease;
}
.nav__link:hover { color: var(--text); background: rgba(255, 255, 255, 0.05); }
.nav__link.is-active {
  color: var(--text);
  background: rgba(255, 255, 255, 0.06);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08);
}
.nav__link.is-active::after {
  content: '';
  position: absolute;
  bottom: 3px; left: 50%; transform: translateX(-50%);
  width: 16px; height: 2px; border-radius: 3px;
  background: var(--grad-accent);
  box-shadow: 0 0 8px rgba(34, 211, 238, 0.6);
}

.nav__cta { padding: 10px 20px; font-size: 0.88rem; }

.nav__progress {
  position: fixed;
  left: 0; right: 0; top: 0;
  height: 2px;
  width: 100%;
  transform-origin: 0%;
  background: var(--grad-accent);
  box-shadow: 0 0 12px rgba(34, 211, 238, 0.5);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 10px;
}
.nav__burger span {
  width: 22px; height: 2px; border-radius: 2px;
  background: var(--text);
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.nav__burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__burger.is-open span:nth-child(2) { opacity: 0; }
.nav__burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mobile-menu {
  position: fixed;
  top: 92px; left: 14px; right: 14px;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 22px 26px;
  border-radius: 24px;
  background: rgba(8, 12, 22, 0.92);
  border: 1px solid var(--border-strong);
  backdrop-filter: blur(24px) saturate(160%);
  -webkit-backdrop-filter: blur(24px) saturate(160%);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.08), 0 30px 70px -20px rgba(0, 0, 0, 0.9);
  max-height: calc(100dvh - 106px - env(safe-area-inset-bottom));
  padding-bottom: calc(26px + env(safe-area-inset-bottom));
  overflow-y: auto;
  overscroll-behavior: contain;
}
.mobile-menu__link {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.1rem;
  padding: 14px 4px;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
}
.mobile-menu__link.is-active { color: var(--cyan-300); }

@media (max-width: 900px) {
  .nav__links, .nav .btn.nav__cta { display: none; }
  .nav__burger { display: flex; }
  .nav { top: 10px; padding: 0 12px; }
  .nav__inner { height: 60px; }
}
```

## `src/components/Navbar.jsx`

```jsx
import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { navLinks } from '../data/site'
import './Navbar.css'

/**
 * Floating glass navigation dock.
 *
 * Accessibility contract for the mobile drawer:
 *  - focus moves into the drawer when it opens and returns to the trigger on close
 *  - Tab is trapped inside the drawer while it is open
 *  - Escape closes it; so does a click on the scrim or a route change
 *  - body scroll (native and Lenis) is locked while it is open
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const burgerRef = useRef(null)
  const drawerRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on navigation
  useEffect(() => { setOpen(false) }, [location.pathname])

  const close = useCallback(() => {
    setOpen(false)
    burgerRef.current?.focus()
  }, [])

  // Scroll lock + focus management + focus trap
  useEffect(() => {
    if (!open) return

    const { body } = document
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    window.__lenis?.stop()

    const drawer = drawerRef.current
    const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstLink = drawer?.querySelector(FOCUSABLE)
    firstLink?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return }
      if (e.key !== 'Tab' || !drawer) return
      const nodes = Array.from(drawer.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !drawer.contains(active))) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault(); first.focus()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      body.style.overflow = prevOverflow
      window.__lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <>
      {/* Entrance is a CSS keyframe, not a Framer transition: the brand mark is
          an LCP candidate, and a JS-driven fade kept it at opacity 0 until
          React hydrated. */}
      <header className={`nav nav--enter ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__brand" aria-label="AUTO-CAN Solutions — home">
            <img
              src="/logo.png"
              alt=""
              width="42"
              height="42"
              className="nav__logo"
              decoding="async"
              fetchpriority="high"
            />
            <span className="nav__brandtext">
              AUTO<span className="nav__dash" aria-hidden="true">-</span>CAN
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/contact" className="btn btn-primary nav__cta">
            Work With Us
            <span className="arrow" aria-hidden="true">→</span>
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className={`nav__burger ${open ? 'is-open' : ''}`}
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav__scrim"
              aria-hidden="true"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.nav
              id="mobile-menu"
              ref={drawerRef}
              aria-label="Mobile navigation"
              className="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink to={l.to} className="mobile-menu__link" end={l.to === '/'}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: 8 }}>
                Work With Us <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
```

## `src/components/NotFoundArt.jsx`

```jsx
import { useEffect, useRef, useState } from 'react'

/**
 * "Signal lost" — animated network diagram for the 404 page.
 *
 * A cool data pulse travels the bus, breaks at the missing node (brief warm
 * spark + water ripple), then the loop resets. Pure SVG + CSS; it stills
 * completely under prefers-reduced-motion.
 *
 * Accessibility: the SVG itself is decorative (`aria-hidden`) because it
 * restates the headline. The "reconnect" affordance is a real <button>
 * layered over the broken node — an interactive element nested inside an
 * `role="img"` graphic would be an ARIA violation, and a native button gets
 * keyboard, focus ring and announcement behaviour for free.
 */
export default function NotFoundArt() {
  const [reconnecting, setReconnecting] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const tryReconnect = () => {
    if (reconnecting) return
    setReconnecting(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setReconnecting(false), 1600)
  }

  return (
    <div className={`nf-art ${reconnecting ? 'is-reconnecting' : ''}`}>
      <svg viewBox="0 0 640 300" className="nf-art__svg" aria-hidden="true" focusable="false">
        {/* big 404 woven into the diagram */}
        <text x="320" y="120" textAnchor="middle" className="nf-404">4<tspan className="nf-404__zero">0</tspan>4</text>

        {/* network bus */}
        <line x1="40" y1="210" x2="270" y2="210" className="sdg-ln" />
        <line x1="370" y1="210" x2="600" y2="210" className="sdg-ln nf-art__dead" />
        <path d="M306 196 l28 28 M334 196 l-28 28" className="nf-break" />

        {/* nodes */}
        <circle cx="40" cy="210" r="10" className="sdg-node" />
        <circle cx="40" cy="210" r="3.5" className="sdg-core" />
        <text x="40" y="242" textAnchor="middle" className="sdg-lbl">SOURCE</text>

        <g className="nf-broken">
          <circle cx="320" cy="210" r="13" className="nf-broken__node" />
          <text x="320" y="245" textAnchor="middle" className="sdg-lbl">ROUTE NOT FOUND</text>
          <circle cx="320" cy="210" r="14" className="nf-ripple" />
          <circle cx="320" cy="210" r="14" className="nf-ripple nf-ripple--2" />
          <g className="nf-spark">
            <path d="M320 196 v-9 M330 200 l6 -7 M310 200 l-6 -7" />
          </g>
          <path d="M280 210 C 300 178, 340 178, 360 210" className="nf-arc" />
        </g>

        <circle cx="600" cy="210" r="10" className="sdg-node nf-art__dim" />
        <circle cx="600" cy="210" r="3.5" className="sdg-core nf-art__dim" />
        <text x="600" y="242" textAnchor="middle" className="sdg-lbl">DESTINATION</text>

        <circle className="nf-pulse" r="4" />
      </svg>

      {/* Real control, positioned over the broken node in the diagram */}
      <button
        type="button"
        className="nf-art__reconnect"
        onClick={tryReconnect}
        aria-live="polite"
      >
        <span className="sr-only">
          {reconnecting ? 'Attempting to reconnect the broken route…' : 'Attempt to reconnect the broken route'}
        </span>
      </button>
    </div>
  )
}
```

## `src/components/Page.jsx`

```jsx
import { motion } from 'framer-motion'

/**
 * Consistent page-level enter transition.
 * `will-change` is intentionally omitted — the transform is short-lived and
 * promoting every page to its own layer costs more than it saves.
 */
export default function Page({ children }) {
  return (
    <motion.div
      initial={{ opacity: 0, y: 16 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
    >
      {children}
    </motion.div>
  )
}
```

## `src/components/ScrollToTop.jsx`

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'

// Jump to top on every route change (instant — plays nice with Lenis).
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => {
    if (window.__lenis) window.__lenis.scrollTo(0, { immediate: true })
    else window.scrollTo(0, 0)
  }, [pathname])
  return null
}
```

## `src/components/Section.jsx`

```jsx
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from './motionPresets'

// Wraps content in a scroll-reveal container.
export function Reveal({ children, className = '', variants = fadeUp, ...rest }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// Staggered group — children should use `fadeUp` (or the shared item variant).
export function RevealGroup({ children, className = '', variants = stagger, ...rest }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

/**
 * Section header: eyebrow + heading + optional lead.
 *
 * `title` accepts a small, author-controlled subset of markup so a phrase can
 * carry the brand gradient. It is never derived from user input or a network
 * response, so there is no injection surface — but it is still normalised to
 * <span>/<em>/<br> only, so a future content edit cannot introduce script.
 */
const ALLOWED_MARKUP = /<(?!\/?(?:span|em|br)\b)[^>]*>/gi
const sanitizeTitle = (html) =>
  String(html)
    .replace(ALLOWED_MARKUP, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')

export function SectionHeader({ eyebrow, title, lead, align = 'left', headingId, as: Heading = 'h2' }) {
  return (
    <Reveal className={`section-head ${align === 'center' ? 'center mx-auto' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading
        id={headingId}
        className="section-title"
        dangerouslySetInnerHTML={{ __html: sanitizeTitle(title) }}
      />
      {lead && (
        <p
          className="section-lead"
          style={align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
```

## `src/components/ServiceDiagrams.jsx`

```jsx
/**
 * Original technical SVG illustrations for the six service lines.
 * One shared visual language: thin precision lines, graphite surfaces,
 * moonlight/frost strokes, a travelling cyan data signal, and a brief
 * warm "validated" pulse at the destination (the water × fire moment).
 * All diagrams are decorative (aria-hidden) and animate via CSS only,
 * so prefers-reduced-motion instantly stills them.
 */

const S = { className: 'sdg', viewBox: '0 0 320 150', 'aria-hidden': true, focusable: false }

/* 01 — Embedded SW Stacks: layered AUTOSAR-style architecture */
export function StackDiagram() {
  const layers = [
    ['APPLICATION', 18], ['RTE', 44], ['AUTOSAR / BSW', 70], ['MCAL', 96], ['MCU / HW', 122],
  ]
  return (
    <svg {...S}>
      {layers.map(([label, y], i) => (
        <g key={label}>
          <rect x="78" y={y - 9} width="164" height="20" rx="5" className={`sdg-panel ${i === 4 ? 'sdg-panel--deep' : ''}`} />
          <text x="160" y={y + 4.5} textAnchor="middle" className="sdg-lbl">{label}</text>
        </g>
      ))}
      <line x1="160" y1="9" x2="160" y2="141" className="sdg-rail" />
      <circle className="sdg-sig" style={{ '--sx': '160px', '--sy': '6px', '--ex': '160px', '--ey': '130px' }} r="3" />
      <circle cx="160" cy="132" r="6" className="sdg-ignite" />
    </svg>
  )
}

/* 02 — Engineering Tools: connected toolchain */
export function ToolchainDiagram() {
  const nodes = [
    ['REQ', 34], ['DEV', 97], ['BUILD', 160], ['DEBUG', 223], ['VALIDATE', 286],
  ]
  return (
    <svg {...S}>
      <line x1="34" y1="75" x2="286" y2="75" className="sdg-ln" />
      {nodes.map(([label, x], i) => (
        <g key={label}>
          <circle cx={x} cy="75" r="9" className="sdg-node" />
          <circle cx={x} cy="75" r="3" className="sdg-core" />
          <text x={x} y={i % 2 ? 52 : 102} textAnchor="middle" className="sdg-lbl">{label}</text>
        </g>
      ))}
      <circle className="sdg-sig" style={{ '--sx': '34px', '--sy': '75px', '--ex': '286px', '--ey': '75px' }} r="3" />
      <circle cx="286" cy="75" r="9" className="sdg-ignite" />
    </svg>
  )
}

/* 03 — Test Automation: input → engine → ECU → verdict */
export function PipelineDiagram() {
  return (
    <svg {...S}>
      <line x1="42" y1="75" x2="278" y2="75" className="sdg-ln" />
      <circle cx="30" cy="75" r="9" className="sdg-node" />
      <text x="30" y="102" textAnchor="middle" className="sdg-lbl">INPUT</text>
      <rect x="88" y="53" width="66" height="44" rx="9" className="sdg-panel" />
      <text x="121" y="72" textAnchor="middle" className="sdg-lbl">AUTOMATION</text>
      <text x="121" y="84" textAnchor="middle" className="sdg-lbl">ENGINE</text>
      <rect x="182" y="58" width="50" height="34" rx="7" className="sdg-panel" />
      <text x="207" y="79" textAnchor="middle" className="sdg-lbl">ECU</text>
      <circle cx="278" cy="75" r="10" className="sdg-node" />
      <path d="M273.5 75 l3.2 3.4 l6-6.8" className="sdg-check" />
      <text x="278" y="104" textAnchor="middle" className="sdg-lbl">PASS</text>
      <circle className="sdg-sig" style={{ '--sx': '30px', '--sy': '75px', '--ex': '278px', '--ey': '75px' }} r="3" />
      <circle cx="278" cy="75" r="10" className="sdg-ignite" />
    </svg>
  )
}

/* 04 — Test Case Repository: traceability chain */
export function RepoDiagram() {
  const rows = [
    ['REQUIREMENTS', 22], ['TEST CASES', 57], ['EXECUTION', 92], ['RESULTS', 127],
  ]
  return (
    <svg {...S}>
      <line x1="160" y1="22" x2="160" y2="127" className="sdg-ln" />
      {rows.map(([label, y]) => (
        <g key={label}>
          <rect x="96" y={y - 11} width="128" height="22" rx="6" className="sdg-panel" />
          <text x="160" y={y + 4} textAnchor="middle" className="sdg-lbl">{label}</text>
          <line x1="82" y1={y} x2="92" y2={y} className="sdg-tick" />
          <line x1="228" y1={y} x2="238" y2={y} className="sdg-tick" />
        </g>
      ))}
      <circle className="sdg-sig" style={{ '--sx': '160px', '--sy': '20px', '--ex': '160px', '--ey': '124px' }} r="3" />
      <circle cx="160" cy="127" r="6" className="sdg-ignite" />
    </svg>
  )
}

/* 05 — HiL & V&V: closed simulation ↔ ECU loop */
export function HilDiagram() {
  return (
    <svg {...S}>
      <rect x="110" y="10" width="100" height="26" rx="7" className="sdg-panel" />
      <text x="160" y="27" textAnchor="middle" className="sdg-lbl">SIMULATION</text>
      <rect x="122" y="62" width="76" height="26" rx="7" className="sdg-panel sdg-panel--deep" />
      <text x="160" y="79" textAnchor="middle" className="sdg-lbl">HiL / SiL</text>
      <rect x="130" y="114" width="60" height="26" rx="7" className="sdg-panel" />
      <text x="160" y="131" textAnchor="middle" className="sdg-lbl">ECU</text>
      {/* loop rails */}
      <path d="M110 23 H74 V127 h56" className="sdg-ln" />
      <path d="M210 23 h36 V127 h-56" className="sdg-ln" />
      <text x="52" y="79" textAnchor="middle" className="sdg-lbl sdg-lbl--side">SENSORS</text>
      <text x="272" y="79" textAnchor="middle" className="sdg-lbl sdg-lbl--side">ACTUATORS</text>
      <circle className="sdg-sig sdg-sig--loopL" r="3" />
      <circle className="sdg-sig sdg-sig--loopR" r="3" />
      <circle cx="160" cy="75" r="7" className="sdg-ignite" />
    </svg>
  )
}

/* 06 — Embedded Hardware: abstract ECU board */
export function HardwareDiagram() {
  const pads = [
    ['CAN', 30, 40, 96, 40], ['LIN', 30, 75, 96, 75], ['PWR', 30, 110, 96, 110],
    ['I/O', 290, 40, 224, 40], ['MEM', 290, 75, 224, 75], ['SNS', 290, 110, 224, 110],
  ]
  return (
    <svg {...S}>
      <rect x="58" y="16" width="204" height="118" rx="12" className="sdg-board" />
      <rect x="126" y="47" width="68" height="56" rx="8" className="sdg-panel sdg-panel--deep" />
      <text x="160" y="72" textAnchor="middle" className="sdg-lbl">MCU</text>
      <text x="160" y="86" textAnchor="middle" className="sdg-lbl sdg-lbl--side">32-BIT</text>
      {pads.map(([label, tx, ty, _px2, py2]) => (
        <g key={label + ty}>
          <line x1={tx < 160 ? 96 : 224} y1={py2} x2={tx < 160 ? 126 : 194} y2={py2 === 40 ? 55 : py2 === 110 ? 95 : 75} className="sdg-ln" />
          <circle cx={tx < 160 ? 96 : 224} cy={py2} r="3.4" className="sdg-node" />
          <text x={tx} y={ty + 4} textAnchor="middle" className="sdg-lbl sdg-lbl--side">{label}</text>
        </g>
      ))}
      <circle className="sdg-sig" style={{ '--sx': '96px', '--sy': '40px', '--ex': '126px', '--ey': '55px' }} r="3" />
      <circle cx="160" cy="75" r="5" className="sdg-ignite" style={{ animationDelay: '2.2s' }} />
    </svg>
  )
}

/* Map by service number used in src/data/site.js */
export const serviceDiagrams = {
  '01': <StackDiagram />,
  '02': <ToolchainDiagram />,
  '03': <PipelineDiagram />,
  '04': <RepoDiagram />,
  '05': <HilDiagram />,
  '06': <HardwareDiagram />,
}
```

## `src/components/SmoothScroll.jsx`

```jsx
import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Buttery inertial scrolling via Lenis. Uses native scroll position under
 * the hood, so framer-motion's useScroll / scroll-linked effects stay in
 * perfect sync. Disabled for reduced-motion users. The instance is exposed
 * on window.__lenis so ScrollToTop can jump instantly on route change.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    window.__lenis = lenis
    let raf
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
  return null
}
```

## `src/components/TiltCard.jsx`

```jsx
import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/** True only where a real hovering pointer exists — i.e. where tilt is usable. */
function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setFine(mq.matches)
    const onChange = (e) => setFine(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return fine
}

/**
 * 3D pointer-tracking tilt card with a moving light glare.
 * Drop-in replacement for a `.card` div. Pass `intensity` to tune the tilt.
 *
 * Every motion hook is declared unconditionally at the top level (rules of
 * hooks); only the glare *element* renders conditionally. The springs are
 * neutralised on touch devices and for reduced-motion users, where the tilt
 * can never fire and the per-frame work would be pure waste.
 */
export default function TiltCard({
  children,
  className = '',
  intensity = 12,
  glare = true,
  style,
  as: Tag = motion.div,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced
  const amount = active ? intensity : 0

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })

  const rotateY = useTransform(sx, [0, 1], [-amount, amount])
  const rotateX = useTransform(sy, [0, 1], [amount, -amount])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(220px circle at ${x} ${y}, rgba(255,255,255,0.16), transparent 60%)`
  )

  const handleMove = (e) => {
    const el = ref.current
    if (!el || !active) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        ...style,
      }}
      whileHover={active ? { z: 30 } : undefined}
      {...rest}
    >
      <div style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
      {glare && active && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: glareBg,
          }}
        />
      )}
    </Tag>
  )
}
```

## `src/components/XpSections.jsx`

```jsx
import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'
import CountUp from './CountUp'
import MagneticButton from './MagneticButton'
import { Reveal } from './Section'

/* ============================================================
   Immersive sections (originally the /v2 concept page),
   now merged into the main site.
   ============================================================ */

export function Manifesto() {
  const words = 'Software is the new horsepower.'.split(' ')
  return (
    <section className="xp-manifesto">
      <div className="container center">
        <motion.p
          className="xp-manifesto__kicker"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          THE SOFTWARE-DEFINED VEHICLE ERA
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
          className="xp-manifesto__h"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className={i >= words.length - 1 ? 'gradient-text' : undefined}
            >
              {w}{' '}
            </motion.span>
          ))}
        </motion.h2>
        <Reveal><p className="xp-manifesto__p">A modern vehicle runs on a hundred million lines of code. We are the engineering bench that writes, integrates, and proves that code — from the first requirement to the proving ground.</p></Reveal>
      </div>
    </section>
  )
}

export function VModel() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const left = [
    ['Requirements', 60, 40], ['System Design', 150, 120], ['SW Architecture', 240, 200], ['Implementation', 345, 285],
  ]
  const right = [
    ['Unit Testing', 450, 200], ['Integration & HiL', 545, 120], ['System Validation', 640, 40],
  ]
  return (
    <section className="xp-vmodel" ref={ref}>
      <div className="container">
        <Reveal className="center mx-auto section-head">
          <span className="eyebrow">Engineering Process</span>
          <h2 className="section-title">The V, drawn in <span className="gradient-text">real programs.</span></h2>
          <p className="section-lead mx-auto" style={{ textAlign: 'center' }}>Every AUTO-CAN engagement follows the automotive V-model — requirements on the way down, verification all the way up.</p>
        </Reveal>
        <div className="xp-vmodel__stage">
          <svg viewBox="0 0 700 340" className="xp-vmodel__svg" aria-hidden="true">
            <motion.path
              d="M 60 50 L 345 295 L 640 50"
              fill="none" stroke="url(#vgrad)" strokeWidth="2.5" strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
            <defs>
              <linearGradient id="vgrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            {[...left, ...right].map(([label, x, y], i) => (
              <motion.g key={label} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 * i, duration: 0.4 }}>
                <circle cx={x} cy={y} r="7" fill="#04060B" stroke={i < 4 ? '#818CF8' : '#22D3EE'} strokeWidth="2.5" />
                <text x={x} y={y - 16} textAnchor="middle" className="xp-vmodel__label">{label}</text>
              </motion.g>
            ))}
            <motion.line x1="150" y1="120" x2="545" y2="120" stroke="#818CF8" strokeDasharray="5 7" strokeOpacity="0.3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }} />
            <motion.line x1="240" y1="200" x2="450" y2="200" stroke="#818CF8" strokeDasharray="5 7" strokeOpacity="0.3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.35 }} />
          </svg>
        </div>
      </div>
    </section>
  )
}

function CarWheel({ cx, cy }) {
  const spokes = [0, 1, 2, 3, 4].map((k) => {
    const a = ((-90 + k * 72) * Math.PI) / 180
    return {
      k,
      x1: cx + Math.cos(a) * 3.2,
      y1: cy + Math.sin(a) * 3.2,
      x2: cx + Math.cos(a) * 8.4,
      y2: cy + Math.sin(a) * 8.4,
    }
  })
  return (
    <g>
      <circle cx={cx} cy={cy} r="15.5" fill="#0B0E15" stroke="#20262F" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="12.6" fill="none" stroke="#171C24" strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r="9.6" fill="url(#acCarRim)" stroke="#39424F" strokeWidth="0.8" />
      {spokes.map((s) => (
        <line key={s.k} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#5E6A79" strokeWidth="1.7" strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r="2.8" fill="#707D8D" stroke="#39424F" strokeWidth="0.6" />
    </g>
  )
}

export function TwinSync() {
  return (
    <section className="xp-twin">
      <div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">Digital Twin</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>Every vehicle exists <span className="gradient-text">twice.</span></h2>
            <p className="section-lead">The physical car on the proving ground — and its digital twin in our validation environment, running the same software against a million simulated kilometres. When they agree, you ship.</p>
            <MagneticButton to="/services" className="btn btn-ghost" style={{ marginTop: 26 }}>Explore validation <span className="arrow" aria-hidden="true">→</span></MagneticButton>
          </Reveal>
          <Reveal>
            <div className="xp-twin__panel">
              <svg viewBox="0 0 300 90" className="xp-twin__car xp-twin__car--real" aria-hidden="true">
                <defs>
                  <linearGradient id="acCarBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F1F5F9" />
                    <stop offset="0.4" stopColor="#B7C2CF" />
                    <stop offset="0.72" stopColor="#7C8A9B" />
                    <stop offset="1" stopColor="#3C4757" />
                  </linearGradient>
                  <linearGradient id="acCarGlass2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#64789A" />
                    <stop offset="0.5" stopColor="#26364B" />
                    <stop offset="1" stopColor="#0C1524" />
                  </linearGradient>
                  <radialGradient id="acCarRim" cx="0.5" cy="0.42" r="0.62">
                    <stop offset="0" stopColor="#EAF0F6" />
                    <stop offset="0.55" stopColor="#9AA7B6" />
                    <stop offset="1" stopColor="#495566" />
                  </radialGradient>
                  <radialGradient id="acCarShadow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="rgba(0,0,0,0.5)" />
                    <stop offset="1" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>
                <ellipse cx="152" cy="83" rx="140" ry="6" fill="url(#acCarShadow)" />
                <path d="M16 76 L16 62 Q16 56 24 54 L70 44 L120 41 L205 41 L262 45 Q284 48 286 56 L286 76 L248 76 Q228 50 208 76 L90 76 Q70 50 50 76 Z" fill="url(#acCarBody)" stroke="#2A3342" strokeWidth="0.8" strokeLinejoin="round" />
                <path d="M22 66 L70 60 L206 59 L276 63" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M118 41 Q124 26 150 24 L196 24 Q207 27 210 41 Z" fill="url(#acCarGlass2)" stroke="#2A3342" strokeWidth="0.8" strokeLinejoin="round" />
                <path d="M128 39 L150 27 L162 27 L140 39 Z" fill="rgba(255,255,255,0.14)" />
                <rect x="161.5" y="25" width="2.6" height="16" fill="rgba(12,17,26,0.85)" />
                <path d="M164 41 L164 74" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
                <rect x="150" y="46" width="10" height="2.6" rx="1.3" fill="rgba(18,25,37,0.85)" />
                <path d="M119 39 Q110 36 108 41 Q108 43 111 43 L119 42 Z" fill="url(#acCarBody)" stroke="#2A3342" strokeWidth="0.6" />
                <path d="M17 56 Q22 55 25 56 L25 60 Q21 61 17 60 Z" fill="#FFF3D6" />
                <path d="M279 50 L286 52 L286 58 L279 58 Z" fill="#EF4444" />
                <CarWheel cx={70} cy={70} />
                <CarWheel cx={228} cy={70} />
              </svg>
              <div className="xp-twin__stream" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
              <svg viewBox="0 0 300 90" className="xp-twin__car xp-twin__car--twin" aria-hidden="true">
                <path d="M16 76 L16 62 Q16 56 24 54 L70 44 L120 41 L205 41 L262 45 Q284 48 286 56 L286 76 L248 76 Q228 50 208 76 L90 76 Q70 50 50 76 Z" fill="none" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="6 5" strokeLinejoin="round" />
                <path d="M118 41 Q124 26 150 24 L196 24 Q207 27 210 41" fill="none" stroke="#60A5FA" strokeWidth="1.4" strokeDasharray="5 4" />
                <circle cx="70" cy="70" r="14" fill="none" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="4 4" />
                <circle cx="228" cy="70" r="14" fill="none" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="4 4" />
              </svg>
              <div className="xp-twin__stats">
                <div><div className="k"><CountUp to={99} suffix="%" /></div><div className="l">Signal parity</div></div>
                <div><div className="k"><CountUp to={1248} suffix="" /></div><div className="l">Test cases / cycle</div></div>
                <div><div className="k"><CountUp to={24} suffix="/7" /></div><div className="l">Continuous validation</div></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
```

## `src/components/motionPresets.js`

```js
// Shared Framer Motion variants used across the site.

export const fadeUp = {
  hidden: { opacity: 0, y: 32 },
  show: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

export const fadeIn = {
  hidden: { opacity: 0 },
  show: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } },
}

export const scaleIn = {
  hidden: { opacity: 0, scale: 0.94 },
  show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } },
}

export const stagger = {
  hidden: {},
  show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } },
}

export const staggerFast = {
  hidden: {},
  show: { transition: { staggerChildren: 0.07 } },
}

export const viewport = { once: true, amount: 0.25 }
```

## `src/components/useVisibleInterval.js`

```js
import { useEffect, useRef } from 'react'

/**
 * setInterval that pauses while the tab is hidden and respects
 * prefers-reduced-motion. Ambient UI (cycling chips, clocks, HUD readouts)
 * should never keep the main thread — or a laptop battery — busy in a
 * background tab.
 *
 * Pass `delay = null` to disable.
 */
export default function useVisibleInterval(callback, delay, { pauseOnReducedMotion = false } = {}) {
  const saved = useRef(callback)
  useEffect(() => { saved.current = callback }, [callback])

  useEffect(() => {
    if (delay == null) return
    if (pauseOnReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let id = null
    const start = () => { if (id == null) id = setInterval(() => saved.current(), delay) }
    const stop = () => { if (id != null) { clearInterval(id); id = null } }
    const onVis = () => (document.hidden ? stop() : start())

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
  }, [delay, pauseOnReducedMotion])
}
```

## `src/styles/global.css`

```css
/* ============================================================
   AUTO-CAN Solutions — "Moonlight Obsidian" Design System
   Matte black · graphite · deep navy — electric cyan, royal
   indigo & moonlight silver. Liquid-glass surfaces, edge
   lighting, cinematic ambient motion.
   ============================================================ */

:root {
  color-scheme: dark;

  /* ---- Ink (surfaces) ---- */
  --ink-0: #04060b;   /* page — matte black-navy */
  --ink-1: #070a12;   /* graphite navy           */
  --ink-2: #0b101d;   /* raised navy             */
  --ink-3: #101627;   /* deep navy               */

  /* ---- Moonlight accents ---- */
  --cyan-300: #67e8f9;
  --cyan-400: #22d3ee;
  --cyan-500: #06b6d4;
  --indigo-300: #a5b4fc;
  --indigo-400: #818cf8;
  --indigo-500: #6366f1;
  --violet-300: #c4b5fd;
  --violet-400: #a78bfa;
  --silver: #e8edf6;
  --pearl: #f6f8fd;

  /* ---- Text ---- */
  --text: #eef2fa;
  --text-dim: #9aa6c4;
  --text-faint: #7b87a3;

  /* ---- Glass ---- */
  --glass: rgba(255, 255, 255, 0.035);
  --glass-2: rgba(255, 255, 255, 0.06);
  --glass-deep: rgba(11, 16, 29, 0.52);
  --border: rgba(255, 255, 255, 0.08);
  --border-strong: rgba(255, 255, 255, 0.15);
  --rim: inset 0 1px 0 rgba(255, 255, 255, 0.09);

  /* ---- Effects ---- */
  --grad-brand: linear-gradient(100deg, #f0f4fc 0%, #c8d6f2 45%, #8fb8e8 78%, #a5b4fc 100%);
  --grad-accent: linear-gradient(120deg, var(--indigo-500), var(--cyan-500));
  --grad-accent-soft: linear-gradient(120deg, rgba(99, 102, 241, 0.16), rgba(34, 211, 238, 0.14));
  --glow-cyan: 0 0 44px rgba(34, 211, 238, 0.28);
  --glow-indigo: 0 0 44px rgba(99, 102, 241, 0.3);
  --shadow-card: 0 30px 70px -28px rgba(0, 0, 0, 0.75);
  --shadow-float: 0 20px 50px -20px rgba(2, 6, 16, 0.9), 0 0 0 1px rgba(255, 255, 255, 0.04);

  --radius: 22px;
  --radius-sm: 14px;
  --radius-xs: 10px;
  --radius-pill: 100px;
  --maxw: 1200px;

  /* ---- Spacing scale (4px base) — use these, not magic numbers ---- */
  --sp-1: 4px;   --sp-2: 8px;   --sp-3: 12px;  --sp-4: 16px;
  --sp-5: 20px;  --sp-6: 24px;  --sp-8: 32px;  --sp-10: 40px;
  --sp-12: 48px; --sp-16: 64px; --sp-20: 80px; --sp-24: 96px;

  /* ---- Motion scale ---- */
  --dur-1: 0.15s;  /* state flips: hover, focus       */
  --dur-2: 0.28s;  /* component transitions           */
  --dur-3: 0.45s;  /* entrances, page-level moves     */
  --dur-4: 0.7s;   /* hero / signature moments        */

  /* ---- Semantic status colours (AA on --ink-0 and on glass) ---- */
  --ok: #5eead4;
  --ok-soft: rgba(94, 234, 212, 0.12);
  --warn: #fbbf24;
  --danger: #fca5a5;
  --danger-strong: #f87171;
  --danger-soft: rgba(248, 113, 113, 0.1);
  --danger-border: rgba(248, 113, 113, 0.5);

  /* ---- Elevation ---- */
  --elev-1: 0 4px 14px -6px rgba(0, 0, 0, 0.5);
  --elev-2: 0 12px 40px -18px rgba(0, 0, 0, 0.55);
  --elev-3: 0 30px 70px -28px rgba(0, 0, 0, 0.75);

  --font-display: 'Space Grotesk', 'Grotesk Fallback', system-ui, sans-serif;
  --font-body: 'Inter', 'Inter Fallback', system-ui, sans-serif;
  --font-mono: 'JetBrains Mono', ui-monospace, monospace;

  --ease-lux: cubic-bezier(0.22, 1, 0.36, 1);
}

* { box-sizing: border-box; margin: 0; padding: 0; }

html { -webkit-text-size-adjust: 100%; }
@media (prefers-reduced-motion: no-preference) {
  html { scroll-behavior: smooth; }
}
@media (prefers-reduced-motion: reduce) {
  *, *::before, *::after {
    animation-duration: 0.01ms !important;
    animation-iteration-count: 1 !important;
    transition-duration: 0.01ms !important;
  }
}

body {
  font-family: var(--font-body);
  background: var(--ink-0);
  color: var(--text);
  line-height: 1.65;
  overflow-x: hidden;
  -webkit-font-smoothing: antialiased;
  text-rendering: optimizeLegibility;
}

/* ---- Cinematic ambient base: deep navy wash + moonlight pools ---- */
body::before {
  content: '';
  position: fixed;
  inset: 0;
  z-index: -3;
  background:
    radial-gradient(62vw 62vw at 12% -8%, rgba(56, 130, 220, 0.13), transparent 64%),
    radial-gradient(56vw 56vw at 94% 2%, rgba(79, 92, 214, 0.12), transparent 60%),
    radial-gradient(74vw 48vw at 50% 114%, rgba(34, 168, 190, 0.1), transparent 64%),
    linear-gradient(175deg, #050a14 0%, #04070f 38%, var(--ink-0) 70%, #02040a 100%);
}

/* ---- Film-grain noise (data-URI turbulence) ---- */
body::after {
  content: '';
  position: fixed;
  inset: 0;
  z-index: 60;
  pointer-events: none;
  opacity: 0.05;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='160' height='160'%3E%3Cfilter id='n'%3E%3CfeTurbulence type='fractalNoise' baseFrequency='0.9' numOctaves='2' stitchTiles='stitch'/%3E%3C/filter%3E%3Crect width='100%25' height='100%25' filter='url(%23n)'/%3E%3C/svg%3E");
  background-size: 160px 160px;
  mix-blend-mode: overlay;
}

a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
button { font-family: inherit; cursor: pointer; }
ul { list-style: none; }

::selection { background: rgba(34, 211, 238, 0.3); color: #fff; }

:focus-visible {
  outline: 2px solid var(--cyan-400);
  outline-offset: 3px;
  border-radius: 4px;
}
.btn:focus-visible, .tag:focus-visible { outline-offset: 2px; }

/* Visually hidden, still announced by assistive tech. */
.sr-only {
  position: absolute !important;
  width: 1px; height: 1px;
  padding: 0; margin: -1px;
  overflow: hidden;
  clip: rect(0, 0, 0, 0);
  clip-path: inset(50%);
  white-space: nowrap;
  border: 0;
}

.skip-link {
  position: fixed;
  top: -60px; left: 16px;
  z-index: 200;
  padding: 12px 20px;
  background: var(--indigo-500);
  color: #fff;
  border-radius: 10px;
  font-weight: 600;
  transition: top 0.2s ease;
}
.skip-link:focus { top: 12px; }

/* ---- Scrollbar ---- */
::-webkit-scrollbar { width: 10px; }
::-webkit-scrollbar-track { background: var(--ink-0); }
::-webkit-scrollbar-thumb { background: #182036; border-radius: 20px; border: 3px solid var(--ink-0); }
::-webkit-scrollbar-thumb:hover { background: #26314f; }

/* ============================================================
   Layout
   ============================================================ */
.container {
  width: 100%;
  max-width: var(--maxw);
  margin: 0 auto;
  padding: 0 24px;
  padding-left: max(24px, env(safe-area-inset-left));
  padding-right: max(24px, env(safe-area-inset-right));
}
.section { padding: clamp(76px, 6vw + 44px, 120px) 0; position: relative; }
.section-sm { padding: clamp(56px, 4vw + 32px, 76px) 0; }

.eyebrow {
  display: inline-flex;
  align-items: center;
  gap: 12px;
  font-family: var(--font-mono);
  font-size: 11.5px;
  font-weight: 500;
  letter-spacing: 0.28em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.eyebrow::before {
  content: '';
  width: 26px;
  height: 1px;
  background: linear-gradient(90deg, var(--cyan-400), rgba(34, 211, 238, 0.1));
}
.section-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.9rem, 4vw, 3.1rem);
  line-height: 1.04;
  letter-spacing: -0.03em;
  margin: 24px 0 0;
  text-wrap: balance;
}
.section-lead {
  color: var(--text-dim);
  font-size: clamp(1rem, 1.5vw, 1.16rem);
  max-width: 640px;
  margin-top: 18px;
  font-weight: 400;
}

/* ---- Gradient text — moonlight sheen ---- */
.gradient-text {
  background: var(--grad-brand);
  background-size: 160% 100%;
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

/* ============================================================
   Buttons — liquid glass & pearl
   ============================================================ */
.btn {
  position: relative;
  overflow: hidden;
  display: inline-flex;
  align-items: center;
  gap: 10px;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 0.95rem;
  letter-spacing: 0.01em;
  padding: 15px 28px;
  border-radius: 100px;
  border: 1px solid transparent;
  transition: transform 0.28s var(--ease-lux), box-shadow 0.28s var(--ease-lux),
    background 0.28s var(--ease-lux), border-color 0.28s var(--ease-lux);
  will-change: transform;
}

/* Pearl — moonlight silver primary */
.btn-primary {
  background: linear-gradient(180deg, #ffffff 0%, #dfe6f3 55%, #c9d4e8 100%);
  color: #0a0e1a;
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 0.9),
    inset 0 -8px 16px rgba(96, 120, 170, 0.28),
    0 14px 38px -12px rgba(180, 205, 255, 0.35);
}
.btn-primary:hover {
  transform: translateY(-2px);
  box-shadow:
    inset 0 1px 0 rgba(255, 255, 255, 1),
    inset 0 -8px 16px rgba(96, 120, 170, 0.22),
    0 18px 44px -14px rgba(148, 202, 255, 0.42);
}

/* Glass ghost */
.btn-ghost {
  background: var(--glass);
  border-color: var(--border-strong);
  color: var(--text);
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  box-shadow: var(--rim);
}
.btn-ghost:hover {
  transform: translateY(-2px);
  border-color: rgba(129, 140, 248, 0.55);
  background: var(--glass-2);
  box-shadow: var(--rim), 0 0 28px rgba(99, 102, 241, 0.18);
}

/* Shine sweep */
.btn::after {
  content: '';
  position: absolute;
  top: 0; bottom: 0;
  left: -80%;
  width: 55%;
  background: linear-gradient(105deg, transparent, rgba(255, 255, 255, 0.4), transparent);
  transform: skewX(-20deg);
  transition: left 0.65s ease;
  pointer-events: none;
}
.btn:hover::after { left: 130%; }
.btn .arrow { transition: transform 0.28s var(--ease-lux); }
.btn:hover .arrow { transform: translateX(4px); }
.btn:active { transform: translateY(0) scale(0.98); }

/* Disabled — visibly inert, still perceivable (WCAG 1.4.3 does not apply to
   disabled controls, but keeping ~3:1 avoids the "is it broken?" moment). */
.btn:disabled,
.btn[aria-disabled='true'] {
  cursor: not-allowed;
  opacity: 0.55;
  transform: none !important;
  box-shadow: var(--rim);
  filter: saturate(0.6);
}
.btn:disabled::after,
.btn[aria-disabled='true']::after { display: none; }
.btn:disabled:hover,
.btn[aria-disabled='true']:hover { transform: none; }

.btn-sm { padding: 10px 18px; font-size: 0.86rem; }

/* Only promote to its own layer while it is actually moving. */
.btn { will-change: auto; }
@media (hover: hover) and (pointer: fine) {
  .btn:hover { will-change: transform; }
}

/* ============================================================
   Cards — frosted liquid glass
   ============================================================ */
.card {
  position: relative;
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.055) 0%, rgba(255, 255, 255, 0.018) 45%, rgba(255, 255, 255, 0.03) 100%);
  border: 1px solid var(--border);
  border-radius: var(--radius);
  padding: 32px;
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  box-shadow: var(--rim), 0 12px 40px -18px rgba(0, 0, 0, 0.55);
  transition: border-color 0.35s var(--ease-lux), box-shadow 0.35s var(--ease-lux);
}

/* Edge-lit gradient border on hover */
.card::before {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  padding: 1px;
  background: linear-gradient(135deg, rgba(165, 180, 252, 0.75), rgba(103, 232, 249, 0.4) 40%, transparent 70%);
  -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0);
  -webkit-mask-composite: xor;
  mask-composite: exclude;
  opacity: 0;
  transition: opacity 0.4s var(--ease-lux);
  pointer-events: none;
}
@media (hover: hover) and (pointer: fine) {
  .card:hover {
    transform: translateY(-4px);
    box-shadow: var(--rim), var(--shadow-card);
  }
  .card:hover::before { opacity: 1; }
}

/* Specular sweep across glass */
.card:not(.pulse-ring)::after {
  content: '';
  position: absolute;
  inset: 0;
  border-radius: inherit;
  background: linear-gradient(105deg, transparent 42%, rgba(255, 255, 255, 0.09) 50%, rgba(255, 255, 255, 0.02) 55%, transparent 62%);
  background-size: 260% 100%;
  background-position: 115% 0;
  background-repeat: no-repeat;
  transition: background-position 1s ease;
  pointer-events: none;
}
@media (hover: hover) and (pointer: fine) {
  .card:not(.pulse-ring):hover::after { background-position: -35% 0; }
}

.card-num {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  color: var(--cyan-300);
  letter-spacing: 0.12em;
}

/* ============================================================
   Grid helpers
   ============================================================ */
.grid { display: grid; gap: 22px; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }

@media (max-width: 980px) {
  .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); }
}
@media (max-width: 640px) {
  .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; }
}

/* ---- utilities ---- */
.center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }
.badge-check {
  display: inline-flex; align-items: center; justify-content: center;
  width: 22px; height: 22px; flex: 0 0 22px; border-radius: 50%;
  background: var(--grad-accent-soft); border: 1px solid var(--border);
  color: var(--cyan-300);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

.info-row,
.xp-twin__panel,
.pp-card {
  box-shadow: var(--rim);
}

/* ---- Large displays: let the layout breathe without stretching text ---- */
@media (min-width: 1920px) {
  :root { --maxw: 1320px; }
}
@media (min-width: 2400px) {
  :root { --maxw: 1400px; }
  html { font-size: 17px; }
}

/* ---- Glass fallback when backdrop-filter is unsupported ---- */
@supports not ((backdrop-filter: blur(4px)) or (-webkit-backdrop-filter: blur(4px))) {
  .card, .nav__inner, .mobile-menu, .cta-band, .xp-vmodel__stage, .xp-twin__panel,
  .hero__meta-item, .info-row, .pp-card, .chip3d, .xray-btn, .tag, .btn-ghost {
    background-color: rgba(13, 18, 32, 0.92);
  }
}

/* ---- Touch devices: comfortable targets, no iOS zoom-on-focus ---- */
@media (pointer: coarse) {
  .field input,
  .field select,
  .field textarea { font-size: 16px; }
  .btn { padding: 15px 26px; }
  .faq__q { min-height: 56px; }
}


/* ---- Small screens: lighter glass blur for faster paint ---- */
@media (max-width: 640px) {
  .nav__inner, .mobile-menu { backdrop-filter: blur(12px) saturate(150%); -webkit-backdrop-filter: blur(12px) saturate(150%); }
  .card, .cta-band, .xp-vmodel__stage, .xp-twin__panel { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
  .chip3d, .hero__meta-item, .info-row, .eyebrow, .tag { backdrop-filter: blur(8px); -webkit-backdrop-filter: blur(8px); }
  /* Film grain is a full-viewport blended composite layer. It is invisible at
     phone pixel densities but measurably delays paint on low-end hardware, so
     drop it entirely rather than merely fading it. */
  body::after { display: none; }
}

/* ============================================================
   Reduced motion — stop decorative loops outright rather than
   compressing them to 0.01ms (which leaves them frozen mid-frame).
   ============================================================ */
@media (prefers-reduced-motion: reduce) {
  .marquee__track { transform: none !important; }
  .marquee { -webkit-mask-image: none; mask-image: none; }
  .river__stream,
  .sdg-sig, .sdg-ignite,
  .nf-pulse, .nf-ripple, .nf-spark, .nf-broken__node,
  .xp-twin__stream span,
  .hero__scroll .line { animation: none !important; }
}

/* ============================================================
   Print — a clean, ink-cheap document (legal pages get printed)
   ============================================================ */
@media print {
  .ambient-bg, .nav, .mobile-menu, .nav__scrim, .footer__glow,
  .river, .hero__visual, .marquee, .skip-link { display: none !important; }
  body { background: #fff; color: #111; }
  body::before, body::after { display: none; }
  .card, .cta-band, .info-row { background: none; border: 1px solid #ccc; box-shadow: none; backdrop-filter: none; }
  .gradient-text { color: #111 !important; -webkit-text-fill-color: #111; }
  a[href^='http']::after { content: ' (' attr(href) ')'; font-size: 0.8em; color: #555; }
  .section { padding: 24px 0; }
}
```

## `src/styles/pages.css`

```css
/* ============================================================
   AUTO-CAN — page styles ("Moonlight Obsidian")
   Liquid glass, aurora light, floating depth layers.
   ============================================================ */

/* ---------- Ambient canvas (aurora component) ---------- */
.ambient-bg {
  position: fixed;
  inset: 0;
  z-index: -2;
  width: 100%;
  height: 100%;
  pointer-events: none;
}

/* ============================================================
   HERO
   ============================================================ */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: clamp(120px, 14svh, 150px) 0 clamp(60px, 8svh, 90px);
  overflow: hidden;
}

/* Short viewports (landscape phones, small laptops): compact hero */
@media (max-height: 560px) {
  .hero { min-height: auto; padding: 110px 0 56px; }
  .hero__scroll { display: none; }
}

.hero__particles { position: absolute; inset: 0; pointer-events: none; }

/* Floating blur orbs */
.blob {
  position: absolute;
  border-radius: 50%;
  filter: blur(90px);
  pointer-events: none;
  will-change: transform;
}
.blob--blue { background: radial-gradient(circle, rgba(99, 102, 241, 0.28), transparent 65%); }
.blob--orange { background: radial-gradient(circle, rgba(34, 211, 238, 0.2), transparent 65%); }

/* ============================================================
   Hero entrance — CSS, not JS.
   These elements are the page's LCP candidates. Driving the entrance from
   the stylesheet means they paint on the first frame after CSS arrives,
   instead of waiting for React to hydrate before becoming visible.
   ============================================================ */
@keyframes acHeroIn {
  from { opacity: 0; transform: translate3d(0, 18px, 0); }
  to   { opacity: 1; transform: none; }
}
@keyframes acHeroWord {
  from { opacity: 0; transform: translate3d(0, 0.42em, 0) rotateX(-58deg); }
  to   { opacity: 1; transform: none; }
}
.hero-in {
  animation: acHeroIn 0.7s var(--ease-lux) both;
}
.anim-head { perspective: 800px; }
.anim-head__w {
  display: inline-block;
  transform-origin: bottom;
  margin-right: 0.28em;
  animation: acHeroWord 0.7s var(--ease-lux) both;
}
/* No entrance for people who asked for less motion — just show the content. */
@media (prefers-reduced-motion: reduce) {
  .hero-in, .anim-head__w { animation: none !important; opacity: 1; transform: none; }
}

.hero__copy { min-width: 0; }

.hero__inner {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: clamp(36px, 4vw, 56px);
  align-items: center;
}

.hero__h1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.4rem, 5vw, 4.1rem);
  line-height: 1.04;
  letter-spacing: -0.032em;
  margin-top: 26px;
  text-wrap: balance;
}

.hero__lead {
  color: var(--text-dim);
  font-size: clamp(1.02rem, 1.6vw, 1.18rem);
  max-width: 560px;
  margin-top: 22px;
}

.hero__actions { display: flex; flex-wrap: wrap; gap: 16px; margin-top: 34px; }
@media (max-width: 520px) {
  .boot-console { font-size: 11px; letter-spacing: 0; }
}

.hero__meta {
  display: flex;
  flex-wrap: wrap;
  gap: 14px;
  margin-top: 44px;
}
.hero__meta-item {
  padding: 14px 20px;
  border-radius: var(--radius-sm);
  background: var(--glass);
  border: 1px solid var(--border);
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  box-shadow: var(--rim);
  transition: border-color 0.3s ease, transform 0.3s var(--ease-lux);
}
.hero__meta-item:hover { border-color: rgba(129, 140, 248, 0.4); transform: translateY(-3px); }
.hero__meta-item .k {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.05rem;
  background: var(--grad-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.hero__meta-item .l { font-size: 0.78rem; color: var(--text-faint); margin-top: 2px; }

/* Scroll cue */
.hero__scroll {
  position: absolute;
  bottom: 28px;
  left: 50%;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: var(--text-faint);
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.3em;
  text-transform: uppercase;
}
.hero__scroll .line {
  width: 1px; height: 44px;
  background: linear-gradient(180deg, var(--cyan-400), transparent);
  animation: acScrollLine 2.2s var(--ease-lux) infinite;
  transform-origin: top;
}
@keyframes acScrollLine {
  0% { transform: scaleY(0); opacity: 0; }
  35% { transform: scaleY(1); opacity: 1; }
  100% { transform: scaleY(1) translateY(18px); opacity: 0; }
}

/* ---------- Hero 3D visual ---------- */
.hero__visual { position: relative; }
.hero__visual--3d { perspective: 1200px; }

.scene3d__frame {
  position: relative;
  border-radius: 26px;
  overflow: visible;
  /* Reserve the exact final box so the lazily-mounted scene causes no shift. */
  aspect-ratio: 10 / 8.4;
}
.scene3d__frame > .scene3d,
.scene3d__frame > .scene3d--loading { height: 100%; }
.scene3d {
  width: 100%;
  aspect-ratio: 10 / 8.4;
  border-radius: 26px;
  overflow: hidden;
  background:
    radial-gradient(90% 70% at 50% 22%, rgba(129, 140, 248, 0.12), transparent 60%),
    linear-gradient(180deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012) 40%, rgba(4, 6, 12, 0.6));
  border: 1px solid var(--border);
  box-shadow:
    var(--rim),
    0 40px 90px -30px rgba(0, 0, 0, 0.8),
    0 0 80px -30px rgba(99, 102, 241, 0.35);
}
.scene3d--loading {
  width: 100%;
  aspect-ratio: 10 / 8.4;
  border-radius: 26px;
  background: var(--glass);
  border: 1px solid var(--border);
}

/* Floating spec chips over the 3D scene */
.chip3d {
  position: absolute;
  display: flex;
  align-items: center;
  gap: 10px;
  padding: 11px 18px;
  border-radius: 100px;
  background: rgba(13, 18, 32, 0.6);
  border: 1px solid var(--border-strong);
  backdrop-filter: blur(20px) saturate(160%);
  -webkit-backdrop-filter: blur(20px) saturate(160%);
  box-shadow: var(--rim), var(--shadow-float);
  font-size: 0.82rem;
  color: var(--text);
  white-space: nowrap;
  z-index: 3;
}
.chip3d--1 { top: 15%; left: -6%; }
.chip3d--2 { top: 38%; right: -8%; }
.chip3d--3 { bottom: 10%; left: -2%; }
.chip3d__ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 26px; height: 26px;
  border-radius: 50%;
  font-size: 13px;
}
.chip3d__ico--blue { background: rgba(99, 102, 241, 0.18); color: var(--indigo-300); box-shadow: none; }
.chip3d__ico--orange { background: rgba(34, 211, 238, 0.14); color: var(--cyan-300); box-shadow: none; }
.chip3d__label b { font-weight: 600; }

/* X-ray toggle */
.xray-btn {
  position: absolute;
  bottom: -18px;
  right: 8%;
  z-index: 4;
  display: inline-flex;
  align-items: center;
  gap: 9px;
  padding: 10px 18px;
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.12em;
  text-transform: uppercase;
  color: var(--text-dim);
  background: rgba(13, 18, 32, 0.72);
  border: 1px solid var(--border-strong);
  backdrop-filter: blur(18px);
  -webkit-backdrop-filter: blur(18px);
  box-shadow: var(--rim), var(--shadow-float);
  transition: color 0.3s ease, border-color 0.3s ease, box-shadow 0.3s ease;
}
.xray-btn:hover { color: var(--text); border-color: rgba(103, 232, 249, 0.5); }
.xray-btn.is-on {
  color: var(--cyan-300);
  border-color: rgba(103, 232, 249, 0.6);
  box-shadow: var(--rim), 0 0 26px rgba(34, 211, 238, 0.25);
}
.xray-btn__dot {
  width: 7px; height: 7px; border-radius: 50%;
  background: var(--text-faint);
  transition: background 0.3s ease, box-shadow 0.3s ease;
}
.xray-btn.is-on .xray-btn__dot { background: var(--cyan-400); box-shadow: 0 0 10px var(--cyan-400); }

/* Boot console */
.boot-console {
  /* Locked to exactly one line: the six rotating messages differ in length, and
     letting them wrap would reflow the buttons below on every cycle. Clipping
     also reads correctly — a terminal truncates, it doesn't wrap. */
  min-height: 1.7em;
  white-space: nowrap;
  overflow: hidden;
  max-width: 100%;
  margin-top: 26px;
  font-family: var(--font-mono);
  font-size: 12.5px;
  color: var(--cyan-300);
  opacity: 0.85;
  letter-spacing: 0.02em;
}
.boot-console__cursor {
  display: inline-block;
  opacity: 0.85;
  width: 7px; height: 14px;
  margin-left: 3px;
  background: var(--cyan-400);
  vertical-align: -2px;
  box-shadow: 0 0 8px var(--cyan-400);
}

/* ============================================================
   MARQUEE
   ============================================================ */
.faq__qwrap { margin: 0; font: inherit; font-weight: inherit; }

.marquee {
  position: relative;
  overflow: hidden;
  padding: 22px 0;
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  background: linear-gradient(90deg, rgba(255, 255, 255, 0.015), rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.015));
  mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 12%, #000 88%, transparent);
}
.marquee__track { display: flex; gap: 54px; width: max-content; }
.marquee__item {
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.22em;
  text-transform: uppercase;
  color: var(--text-faint);
  white-space: nowrap;
  display: flex;
  align-items: center;
  gap: 54px;
}
.marquee__item::after {
  content: '◆';
  font-size: 7px;
  color: var(--indigo-400);
  text-shadow: 0 0 8px var(--indigo-400);
}

/* ============================================================
   STATS — open editorial strip
   ============================================================ */
.stat-strip {
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  border-top: 1px solid var(--border);
}
.stat {
  text-align: left;
  padding: 30px 28px 6px 0;
  border-right: 1px solid var(--border);
  margin-right: 28px;
}
.stat:last-child { border-right: 0; margin-right: 0; }
.stat .num {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.1rem, 3.6vw, 2.9rem);
  letter-spacing: -0.03em;
  color: var(--silver);
  line-height: 1.1;
}
.stat .num::after {
  content: '';
  display: block;
  width: 22px;
  height: 2px;
  margin-top: 12px;
  background: var(--grad-accent);
  border-radius: 2px;
}
.stat .lbl { color: var(--text-faint); font-size: 0.85rem; margin-top: 12px; max-width: 24ch; }
@media (max-width: 900px) {
  .stat-strip { grid-template-columns: 1fr 1fr; row-gap: 10px; }
  .stat:nth-child(2n) { border-right: 0; margin-right: 0; }
}
@media (max-width: 480px) {
  .stat-strip { grid-template-columns: 1fr 1fr; }
  .stat { padding: 22px 16px 4px 0; margin-right: 16px; }
}

/* ============================================================
   CONTENT CARDS
   ============================================================ */
.icard__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.22rem;
  letter-spacing: -0.01em;
  margin-top: 14px;
}
.icard__text { color: var(--text-dim); font-size: 0.94rem; margin-top: 10px; }

.domain-num {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 3rem;
  line-height: 1;
  letter-spacing: -0.04em;
  background: linear-gradient(180deg, rgba(199, 210, 254, 0.5), rgba(199, 210, 254, 0.06));
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}

.pointlist { margin-top: 18px; display: flex; flex-direction: column; gap: 12px; }
.pointlist li {
  display: flex;
  gap: 12px;
  align-items: flex-start;
  color: var(--text-dim);
  font-size: 0.93rem;
  line-height: 1.5;
}

/* ============================================================
   WHY — numbered editorial list
   ============================================================ */
.why-list {
  display: grid;
  grid-template-columns: 1fr 1fr;
  column-gap: 64px;
}
.why-item {
  display: flex;
  align-items: baseline;
  gap: 22px;
  padding: 24px 4px;
  border-bottom: 1px solid var(--border);
  transition: border-color 0.3s ease;
}
.why-item:hover { border-color: rgba(129, 140, 248, 0.35); }
.why-item .no {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  color: var(--cyan-300);
  letter-spacing: 0.12em;
  flex: 0 0 auto;
}
.why-item p {
  font-weight: 500;
  font-size: 1.02rem;
  color: var(--text);
  line-height: 1.5;
}
@media (max-width: 760px) {
  .why-list { grid-template-columns: 1fr; }
  .why-item { padding: 18px 2px; }
}

/* ============================================================
   SPLIT + TIMELINE
   ============================================================ */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: clamp(36px, 5vw, 60px); }
@media (max-width: 900px) { .split { grid-template-columns: 1fr; gap: 40px; } }

.timeline { position: relative; padding-left: 34px; }
.timeline::before {
  content: '';
  position: absolute;
  left: 7px; top: 8px; bottom: 8px;
  width: 1px;
  background: linear-gradient(180deg, var(--indigo-400), rgba(34, 211, 238, 0.5), transparent);
}
.tl-item { position: relative; padding-bottom: 34px; }
.tl-item:last-child { padding-bottom: 0; }
.tl-dot {
  position: absolute;
  left: -34px; top: 7px;
  width: 15px; height: 15px;
  border-radius: 50%;
  background: var(--ink-1);
  border: 2px solid var(--indigo-400);
  box-shadow: 0 0 14px rgba(129, 140, 248, 0.55), inset 0 0 4px rgba(129, 140, 248, 0.6);
}
.tl-year {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.18em;
  color: var(--cyan-300);
}
.tl-title { font-family: var(--font-display); font-weight: 600; font-size: 1.1rem; margin-top: 4px; }
.tl-text { color: var(--text-dim); font-size: 0.9rem; margin-top: 5px; max-width: 480px; }

/* ============================================================
   CTA BAND — backlit glass panel
   ============================================================ */
.cta-band {
  position: relative;
  text-align: center;
  padding: 64px 44px;
  border-radius: 30px;
  background:
    radial-gradient(70% 120% at 50% -20%, rgba(99, 102, 241, 0.2), transparent 60%),
    radial-gradient(50% 90% at 80% 120%, rgba(34, 211, 238, 0.1), transparent 55%),
    linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  border: 1px solid var(--border-strong);
  overflow: hidden;
  backdrop-filter: blur(18px) saturate(150%);
  -webkit-backdrop-filter: blur(18px) saturate(150%);
  box-shadow: var(--rim), 0 40px 90px -40px rgba(0, 0, 0, 0.8);
}
.cta-band::before {
  content: '';
  position: absolute;
  top: 0; left: 15%; right: 15%;
  height: 1px;
  background: linear-gradient(90deg, transparent, rgba(199, 210, 254, 0.8), rgba(103, 232, 249, 0.8), transparent);
}
.cta-band h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.7rem, 3.6vw, 2.6rem);
  letter-spacing: -0.02em;
  max-width: 720px;
  margin: 18px auto 0;
  text-wrap: balance;
}
.cta-band p { color: var(--text-dim); max-width: 560px; margin: 16px auto 30px; }

/* ============================================================
   PAGE HERO (inner pages)
   ============================================================ */
.page-hero {
  padding: clamp(140px, 12svh + 60px, 190px) 0 clamp(40px, 5vw, 60px);
  position: relative;
}
@media (max-height: 560px) {
  .page-hero { padding-top: 120px; }
}
.page-hero h1 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.1rem, 4.4vw, 3.4rem);
  line-height: 1.04;
  letter-spacing: -0.03em;
  margin-top: 24px;
  max-width: 850px;
  text-wrap: balance;
}
.page-hero p {
  color: var(--text-dim);
  font-size: clamp(1rem, 1.6vw, 1.16rem);
  max-width: 640px;
  margin-top: 20px;
}

/* ============================================================
   TAGS
   ============================================================ */
.taglist { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 22px; }
.tag {
  padding: 9px 18px;
  border-radius: 100px;
  font-size: 0.85rem;
  color: var(--text-dim);
  background: var(--glass);
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  box-shadow: var(--rim);
  transition: color 0.3s ease, border-color 0.3s ease, transform 0.3s var(--ease-lux), box-shadow 0.3s ease;
}
.tag:hover {
  color: var(--text);
  border-color: rgba(103, 232, 249, 0.45);
  transform: translateY(-2px);
  box-shadow: var(--rim), 0 0 20px rgba(34, 211, 238, 0.15);
}

.model-tag {
  font-family: var(--font-mono);
  font-size: 11px;
  letter-spacing: 0.26em;
  color: var(--cyan-300);
}
.model-title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.5rem;
  letter-spacing: -0.015em;
  margin-top: 12px;
}
.expertise-note { color: var(--text-dim); font-size: 0.94rem; margin-top: 12px; }

/* ============================================================
   MISSION BAND
   ============================================================ */
.mission-band {
  position: relative;
  padding: 130px 0;
  overflow: hidden;
}
.mission-band::before {
  content: '';
  position: absolute;
  inset: 0;
  background:
    radial-gradient(60% 90% at 50% 50%, rgba(99, 102, 241, 0.09), transparent 65%),
    radial-gradient(35% 55% at 70% 40%, rgba(34, 211, 238, 0.06), transparent 60%);
  pointer-events: none;
}
.mission-quote {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.6rem, 3.4vw, 2.7rem);
  line-height: 1.25;
  letter-spacing: -0.02em;
  max-width: 880px;
  margin: 30px auto 0;
  text-wrap: balance;
}

/* ============================================================
   PEOPLE & PAYROLL
   ============================================================ */
.pp-grid {
  position: relative;
  display: grid;
  grid-template-columns: repeat(4, 1fr);
  gap: 22px;
  perspective: 1000px;
}
@media (max-width: 1080px) { .pp-grid { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 620px) { .pp-grid { grid-template-columns: 1fr; } }
.pp-rail {
  position: absolute;
  top: -26px; left: 0; right: 0;
  height: 1px;
  background: linear-gradient(90deg, var(--indigo-400), var(--cyan-400), transparent);
  transform-origin: left;
}
.pp-card {
  position: relative;
  padding: 30px 26px;
  border-radius: var(--radius);
  background: linear-gradient(165deg, rgba(255, 255, 255, 0.05), rgba(255, 255, 255, 0.015));
  border: 1px solid var(--border);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
  transition: border-color 0.3s ease, transform 0.3s var(--ease-lux);
}
.pp-card:hover { border-color: rgba(129, 140, 248, 0.4); transform: translateY(-4px); }
.pp-card__dot {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px;
  border-radius: 50%;
  font-family: var(--font-display);
  font-weight: 700;
  color: #0a0e1a;
  background: linear-gradient(180deg, #fff, #c9d4e8);
  box-shadow: 0 0 24px rgba(199, 210, 254, 0.4), inset 0 1px 0 #fff;
}
.pp-closing {
  margin-top: 44px;
  color: var(--text-dim);
  max-width: 720px;
  font-size: 1.02rem;
  border-left: 2px solid var(--cyan-400);
  padding-left: 22px;
}

/* ============================================================
   CONTACT
   ============================================================ */
.contact-grid { display: grid; grid-template-columns: 0.85fr 1.15fr; gap: clamp(30px, 4vw, 50px); align-items: start; }
@media (max-width: 900px) { .contact-grid { grid-template-columns: 1fr; } }

.contact-info { display: flex; flex-direction: column; gap: 16px; }
.info-row {
  display: flex;
  gap: 16px;
  align-items: flex-start;
  padding: 20px 22px;
  border-radius: var(--radius-sm);
  background: var(--glass);
  border: 1px solid var(--border);
  backdrop-filter: blur(14px) saturate(150%);
  -webkit-backdrop-filter: blur(14px) saturate(150%);
  transition: border-color 0.3s ease, transform 0.3s var(--ease-lux);
}
.info-row:hover { border-color: rgba(103, 232, 249, 0.4); transform: translateX(4px); }
.info-row .ico {
  display: inline-flex;
  align-items: center;
  justify-content: center;
  width: 40px; height: 40px; flex: 0 0 40px;
  border-radius: 12px;
  font-size: 17px;
  color: var(--cyan-300);
  background: var(--grad-accent-soft);
  border: 1px solid var(--border);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.1);
}
.info-row .k {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-faint);
}
.info-row .v { font-size: 0.95rem; margin-top: 3px; }
.info-row .v a { color: var(--cyan-300); display: inline-flex; align-items: center; min-height: 26px; }
.info-row .v a:hover { text-decoration: underline; }

/* ---------- Luxury form ---------- */
.form { display: flex; flex-direction: column; gap: 20px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 20px; }
@media (max-width: 560px) { .form-row { grid-template-columns: 1fr; } }
.field { display: flex; flex-direction: column; gap: 8px; min-width: 0; }
.contact-grid > * { min-width: 0; }
.field label {
  font-family: var(--font-mono);
  font-size: 10.5px;
  letter-spacing: 0.2em;
  text-transform: uppercase;
  color: var(--text-faint);
  transition: color 0.25s ease;
}
.field:focus-within label { color: var(--cyan-300); }
.field input,
.field select,
.field textarea {
  width: 100%;
  min-width: 0;
  font-family: var(--font-body);
  font-size: 0.95rem;
  color: var(--text);
  background: rgba(255, 255, 255, 0.03);
  border: 1px solid var(--border);
  border-radius: 14px;
  padding: 15px 18px;
  outline: none;
  backdrop-filter: blur(10px);
  -webkit-backdrop-filter: blur(10px);
  box-shadow: var(--rim);
  transition: border-color 0.3s ease, box-shadow 0.3s ease, background 0.3s ease;
}
.field input::placeholder,
.field textarea::placeholder { color: var(--text-faint); }
.field input:focus,
.field select:focus,
.field textarea:focus {
  border-color: rgba(103, 232, 249, 0.55);
  background: rgba(255, 255, 255, 0.05);
  box-shadow: var(--rim), 0 0 0 4px rgba(34, 211, 238, 0.09), 0 0 24px rgba(34, 211, 238, 0.12);
}
.field textarea { min-height: 130px; resize: vertical; }

/* Native select needs an explicit arrow once the OS chrome is overridden */
.field select {
  appearance: none;
  -webkit-appearance: none;
  padding-right: 44px;
  background-image: url("data:image/svg+xml,%3Csvg xmlns='http://www.w3.org/2000/svg' width='12' height='8' viewBox='0 0 12 8' fill='none'%3E%3Cpath d='M1 1.5 6 6.5l5-5' stroke='%237b87a3' stroke-width='1.6' stroke-linecap='round' stroke-linejoin='round'/%3E%3C/svg%3E");
  background-repeat: no-repeat;
  background-position: right 18px center;
}
.field select option { background: var(--ink-2); color: var(--text); }

/* ---- Required / optional affordances ---- */
.field__req { color: var(--cyan-400); margin-left: 2px; }
.field__opt {
  margin-left: 6px;
  letter-spacing: 0.12em;
  color: rgba(123, 135, 163, 0.75);
  text-transform: none;
}

/* ---- Invalid state ---- */
.field input[aria-invalid='true'],
.field select[aria-invalid='true'],
.field textarea[aria-invalid='true'] {
  border-color: var(--danger-border);
  background: var(--danger-soft);
}
.field input[aria-invalid='true']:focus,
.field select[aria-invalid='true']:focus,
.field textarea[aria-invalid='true']:focus {
  box-shadow: var(--rim), 0 0 0 4px rgba(248, 113, 113, 0.14);
}
.field:focus-within:has([aria-invalid='true']) label { color: var(--danger); }

.field__error {
  display: flex;
  align-items: flex-start;
  gap: 7px;
  color: var(--danger);
  font-size: 0.82rem;
  line-height: 1.45;
}
.field__error svg { flex: 0 0 auto; margin-top: 2px; }

/* ---- Honeypot: hidden from people and from assistive tech ---- */
.hp {
  position: absolute;
  left: -9999px;
  width: 1px; height: 1px;
  overflow: hidden;
  opacity: 0;
  pointer-events: none;
}

/* ---- Submit + status ---- */
.form__submit { align-self: flex-start; }
.form__note {
  font-size: 0.8rem;
  color: var(--text-faint);
  margin-top: -6px;
}
.form__note a { color: var(--cyan-300); text-decoration: underline; text-underline-offset: 3px; }
.form__status:empty { display: none; }
.form__status {
  font-size: 0.85rem;
  color: var(--text-dim);
}
.form__status--error { color: var(--danger); display: block; }

.contact-card { padding: clamp(22px, 3vw, 32px); }

/* ---- Success ---- */
.form-success {
  color: var(--text-dim);
  background: linear-gradient(160deg, rgba(94, 234, 212, 0.08), rgba(34, 211, 238, 0.04));
  border: 1px solid rgba(103, 232, 249, 0.3);
  border-radius: var(--radius-sm);
  padding: clamp(22px, 3vw, 30px);
}
.form-success:focus { outline: none; }
.form-success:focus-visible { outline: 2px solid var(--cyan-400); outline-offset: 4px; }
.form-success strong { display: block; color: var(--cyan-300); font-size: 1.05rem; margin-top: 14px; }
.form-success p { margin-top: 8px; }
.form-success__mark {
  display: inline-flex;
  align-items: center; justify-content: center;
  width: 44px; height: 44px;
  border-radius: 50%;
  color: var(--ok);
  background: var(--ok-soft);
  border: 1px solid rgba(94, 234, 212, 0.35);
  box-shadow: inset 0 1px 0 rgba(255, 255, 255, 0.12);
}

/* ============================================================
   404
   ============================================================ */
.nf {
  min-height: 78vh;
  display: flex;
  align-items: center;
  justify-content: center;
  text-align: center;
}

/* ============================================================
   XP — Manifesto
   ============================================================ */
.xp-manifesto { padding: 150px 0 130px; position: relative; overflow: hidden; }
.xp-manifesto::before {
  content: '';
  position: absolute;
  inset: 0;
  background: radial-gradient(55% 75% at 50% 45%, rgba(129, 140, 248, 0.08), transparent 65%);
  pointer-events: none;
}
.xp-manifesto__kicker {
  font-family: var(--font-mono);
  font-size: 11.5px;
  letter-spacing: 0.34em;
  color: var(--text-faint);
}
.xp-manifesto__h {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(2.2rem, 5.4vw, 4.3rem);
  line-height: 1.05;
  letter-spacing: -0.03em;
  margin-top: 26px;
  text-wrap: balance;
}
.xp-manifesto__p {
  color: var(--text-dim);
  max-width: 620px;
  margin: 26px auto 0;
  font-size: 1.05rem;
}

/* ============================================================
   XP — V-Model
   ============================================================ */
.xp-vmodel { padding: 40px 0 120px; }
.xp-vmodel__stage {
  margin-top: 50px;
  padding: 40px 26px 26px;
  border-radius: 30px;
  background:
    radial-gradient(65% 100% at 50% 0%, rgba(99, 102, 241, 0.08), transparent 60%),
    linear-gradient(165deg, rgba(255, 255, 255, 0.04), rgba(255, 255, 255, 0.01));
  border: 1px solid var(--border);
  backdrop-filter: blur(14px) saturate(140%);
  -webkit-backdrop-filter: blur(14px) saturate(140%);
  box-shadow: var(--rim), 0 30px 80px -35px rgba(0, 0, 0, 0.7);
}
.xp-vmodel__svg { width: 100%; height: auto; display: block; }
.xp-vmodel__label {
  fill: var(--text-dim);
  font-family: var(--font-mono);
  font-size: 12.5px;
  letter-spacing: 0.04em;
}

/* ============================================================
   XP — Digital Twin
   ============================================================ */
.xp-twin { padding: 40px 0 120px; }
.xp-twin__panel {
  position: relative;
  padding: 40px 34px 30px;
  border-radius: 28px;
  background:
    radial-gradient(70% 60% at 50% 0%, rgba(34, 211, 238, 0.07), transparent 60%),
    linear-gradient(165deg, rgba(255, 255, 255, 0.045), rgba(255, 255, 255, 0.012));
  border: 1px solid var(--border);
  backdrop-filter: blur(16px) saturate(150%);
  -webkit-backdrop-filter: blur(16px) saturate(150%);
}
.xp-twin__car { width: 100%; height: auto; display: block; }
.xp-twin__car--twin { opacity: 0.85; filter: drop-shadow(0 0 12px rgba(103, 232, 249, 0.35)); }

.xp-twin__stream {
  display: flex;
  justify-content: center;
  gap: 26px;
  padding: 14px 0;
}
.xp-twin__stream span {
  width: 1px; height: 26px;
  background: linear-gradient(180deg, transparent, var(--cyan-400), transparent);
  animation: acStream 1.6s ease-in-out infinite;
}
.xp-twin__stream span:nth-child(2) { animation-delay: 0.2s; }
.xp-twin__stream span:nth-child(3) { animation-delay: 0.4s; }
.xp-twin__stream span:nth-child(4) { animation-delay: 0.6s; }
.xp-twin__stream span:nth-child(5) { animation-delay: 0.8s; }
@keyframes acStream {
  0%, 100% { opacity: 0.55; transform: scaleY(0.85); }
  50% { opacity: 0.85; transform: scaleY(1); }
}

.xp-twin__stats {
  display: grid;
  grid-template-columns: repeat(3, 1fr);
  gap: 18px;
  margin-top: 26px;
  padding-top: 24px;
  border-top: 1px solid var(--border);
  text-align: center;
}
.xp-twin__stats .k {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.5rem;
  background: var(--grad-brand);
  -webkit-background-clip: text;
  background-clip: text;
  color: transparent;
}
.xp-twin__stats .l { font-size: 0.76rem; color: var(--text-faint); margin-top: 4px; }

/* ============================================================
   Responsive — hero
   ============================================================ */
@media (max-width: 1024px) {
  .hero__inner { grid-template-columns: 1fr; gap: 60px; }
  .hero { padding-top: 140px; }
  .chip3d--1 { left: 0; }
  .chip3d--2 { right: 0; }
}
@media (max-width: 640px) {
  .hero { padding-top: 120px; min-height: auto; }
  .hero__meta { gap: 10px; }
  .hero__meta-item { padding: 12px 16px; }
  .hero__scroll { display: none; }
  .chip3d { font-size: 0.72rem; padding: 8px 13px; }
  .cta-band { padding: 56px 24px; }
}

/* ============================================================
   TECHNICAL SVG DIAGRAMS (service illustrations)
   Cool moonlight signal → brief warm validation pulse.
   ============================================================ */
.sdg { width: 100%; height: auto; display: block; margin: 2px 0 10px; }
.sdg-panel {
  fill: rgba(255, 255, 255, 0.035);
  stroke: rgba(165, 180, 252, 0.32);
  stroke-width: 1;
}
.sdg-panel--deep { fill: rgba(99, 102, 241, 0.1); stroke: rgba(165, 180, 252, 0.5); }
.sdg-board { fill: rgba(255, 255, 255, 0.02); stroke: rgba(154, 166, 196, 0.28); stroke-width: 1; }
.sdg-ln, .sdg-rail { stroke: rgba(154, 166, 196, 0.3); stroke-width: 1.1; fill: none; }
.sdg-rail { stroke-dasharray: 2 5; }
.sdg-tick { stroke: rgba(103, 232, 249, 0.35); stroke-width: 1.4; }
.sdg-node { fill: #0b101d; stroke: rgba(165, 180, 252, 0.55); stroke-width: 1.2; }
.sdg-core { fill: rgba(103, 232, 249, 0.85); }
.sdg-check { fill: none; stroke: var(--cyan-300); stroke-width: 1.6; stroke-linecap: round; stroke-linejoin: round; }
.sdg-lbl {
  font-family: var(--font-mono);
  font-size: 9px;
  letter-spacing: 0.09em;
  fill: rgba(154, 166, 196, 0.78);
}
.sdg-lbl--side { font-size: 8px; fill: rgba(123, 135, 163, 0.7); }

/* travelling data signal — water: cool, continuous, calm */
.sdg-sig {
  fill: var(--cyan-300);
  filter: drop-shadow(0 0 4px rgba(103, 232, 249, 0.8));
  animation: sdgTravel 5.2s var(--ease-lux) infinite;
}
@keyframes sdgTravel {
  0% { transform: translate(var(--sx), var(--sy)); opacity: 0; }
  6% { opacity: 1; }
  58% { transform: translate(var(--ex), var(--ey)); opacity: 1; }
  64%, 100% { transform: translate(var(--ex), var(--ey)); opacity: 0; }
}
/* HiL loop signals follow the loop rails */
.sdg-sig--loopL { animation: sdgLoopL 5.2s linear infinite; }
.sdg-sig--loopR { animation: sdgLoopR 5.2s linear infinite; }
@keyframes sdgLoopL {
  0% { transform: translate(108px, 23px); opacity: 1; }
  30% { transform: translate(74px, 23px); }
  70% { transform: translate(74px, 127px); }
  100% { transform: translate(128px, 127px); opacity: 1; }
}
@keyframes sdgLoopR {
  0% { transform: translate(192px, 127px); opacity: 1; }
  30% { transform: translate(246px, 127px); }
  70% { transform: translate(246px, 23px); }
  100% { transform: translate(212px, 23px); opacity: 1; }
}

/* fire: the brief warm "validated" pulse at the destination */
.sdg-ignite {
  fill: none;
  stroke: rgba(255, 176, 102, 0.9);
  stroke-width: 1.4;
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation: sdgIgnite 5.2s var(--ease-lux) infinite;
}
@keyframes sdgIgnite {
  0%, 56% { opacity: 0; transform: scale(0.6); }
  62% { opacity: 0.9; transform: scale(1); }
  78% { opacity: 0; transform: scale(1.8); }
  100% { opacity: 0; }
}

/* ============================================================
   DATA RIVER — liquid section transition
   ============================================================ */
.river {
  position: relative;
  height: clamp(70px, 9vw, 120px);
  margin: -20px 0;
  pointer-events: none;
  mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
  -webkit-mask-image: linear-gradient(90deg, transparent, #000 10%, #000 90%, transparent);
}
.river__svg { width: 100%; height: 100%; display: block; }
.river__stream {
  fill: none;
  stroke: url(#riverGrad);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 26 34;
  animation: riverFlow 9s linear infinite;
  opacity: 0.75;
}
.river__stream--2 { stroke-width: 1; animation-duration: 13s; animation-delay: -4s; opacity: 0.45; }
.river__stream--3 { stroke-width: 0.8; animation-duration: 17s; animation-delay: -8s; opacity: 0.3; }
@keyframes riverFlow { to { stroke-dashoffset: -300; } }

/* ============================================================
   404 — "Signal lost"
   ============================================================ */
.nf { flex-direction: column; gap: 8px; padding: 140px 0 80px; }
.nf-art { width: min(640px, 92vw); margin: 0 auto; }
.nf-art__svg { width: 100%; height: auto; display: block; overflow: visible; }
.nf-404 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 128px;
  letter-spacing: -0.04em;
  fill: rgba(232, 237, 246, 0.94);
}
.nf-404__zero { fill: none; stroke: rgba(165, 180, 252, 0.65); stroke-width: 2; }
.nf-art__dead { stroke-dasharray: 3 6; opacity: 0.5; }
.nf-art__dim { opacity: 0.55; }
.nf-break {
  stroke: rgba(255, 176, 102, 0.65);
  stroke-width: 1.6;
  stroke-linecap: round;
  fill: none;
}
.nf-broken { pointer-events: none; }

/* The reconnect control sits exactly over the broken node in the diagram. */
.nf-art { position: relative; }
.nf-art__reconnect {
  position: absolute;
  left: 50%;
  top: 70%;
  transform: translate(-50%, -50%);
  width: 64px; height: 64px;
  border: 0;
  border-radius: 50%;
  background: transparent;
  cursor: pointer;
}
.nf-art__reconnect:focus-visible {
  outline: 2px solid var(--cyan-400);
  outline-offset: 2px;
}
@media (hover: hover) and (pointer: fine) {
  .nf-art__reconnect:hover { background: radial-gradient(circle, rgba(34, 211, 238, 0.12), transparent 70%); }
}
.nf-broken__node {
  fill: rgba(11, 16, 29, 0.9);
  stroke: rgba(255, 176, 102, 0.7);
  stroke-width: 1.4;
  stroke-dasharray: 4 4;
  animation: nfNodeSpin 14s linear infinite;
  transform-origin: center;
  transform-box: fill-box;
}
@keyframes nfNodeSpin { to { transform: rotate(360deg); } }

/* pulse travels then dies at the break */
.nf-pulse {
  fill: var(--cyan-300);
  filter: drop-shadow(0 0 5px rgba(103, 232, 249, 0.9));
  animation: nfPulse 6s var(--ease-lux) infinite;
}
@keyframes nfPulse {
  0% { transform: translate(40px, 210px); opacity: 0; }
  6% { opacity: 1; }
  42% { transform: translate(303px, 210px); opacity: 1; }
  46% { transform: translate(308px, 210px); opacity: 0; }
  100% { transform: translate(308px, 210px); opacity: 0; }
}
/* warm spark at impact */
.nf-spark path {
  stroke: rgba(255, 176, 102, 0.95);
  stroke-width: 1.6;
  stroke-linecap: round;
  fill: none;
}
.nf-spark {
  opacity: 0;
  transform-origin: 320px 205px;
  animation: nfSpark 6s var(--ease-lux) infinite;
}
@keyframes nfSpark {
  0%, 41% { opacity: 0; transform: scale(0.5); }
  45% { opacity: 1; transform: scale(1); }
  54% { opacity: 0; transform: scale(1.5); }
  100% { opacity: 0; }
}
/* water ripple spreading from the break */
.nf-ripple {
  fill: none;
  stroke: rgba(103, 232, 249, 0.5);
  stroke-width: 1;
  opacity: 0;
  transform-origin: center;
  transform-box: fill-box;
  animation: nfRipple 6s var(--ease-lux) infinite;
}
.nf-ripple--2 { animation-delay: 0.25s; }
@keyframes nfRipple {
  0%, 42% { opacity: 0; transform: scale(0.6); }
  48% { opacity: 0.8; transform: scale(1.2); }
  68% { opacity: 0; transform: scale(2.6); }
  100% { opacity: 0; }
}
/* click-to-reconnect arc */
.nf-arc {
  fill: none;
  stroke: var(--cyan-300);
  stroke-width: 1.4;
  stroke-linecap: round;
  stroke-dasharray: 130;
  stroke-dashoffset: 130;
  opacity: 0;
}
.is-reconnecting .nf-arc {
  animation: nfArc 1.5s var(--ease-lux) 1;
}
@keyframes nfArc {
  0% { opacity: 1; stroke-dashoffset: 130; }
  55% { opacity: 1; stroke-dashoffset: 0; stroke: #67e8f9; }
  70% { stroke: #ffb066; }
  100% { opacity: 0; stroke-dashoffset: 0; }
}
.nf__title {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: clamp(1.5rem, 3vw, 2.1rem);
  letter-spacing: -0.02em;
  margin-top: 10px;
}
.nf__text { color: var(--text-dim); max-width: 46ch; margin: 12px auto 28px; }
.nf__actions { display: flex; flex-wrap: wrap; gap: 14px; justify-content: center; }
.nf__hint { margin-top: 26px; font-family: var(--font-mono); font-size: 10.5px; letter-spacing: 0.18em; text-transform: uppercase; color: var(--text-faint); }

/* ============================================================
   LEGAL PAGES (Privacy / Terms)
   ============================================================ */
.legal { display: grid; grid-template-columns: 230px minmax(0, 1fr); gap: clamp(36px, 5vw, 70px); align-items: start; }
@media (max-width: 900px) { .legal { grid-template-columns: 1fr; } }
.legal__toc {
  position: sticky;
  top: 110px;
  display: flex;
  flex-direction: column;
  gap: 2px;
  border-left: 1px solid var(--border);
  padding-left: 4px;
}
@media (max-width: 900px) { .legal__toc { position: static; flex-direction: row; flex-wrap: wrap; border-left: 0; padding-left: 0; gap: 8px; } }
.legal__toc a {
  font-size: 0.84rem;
  color: var(--text-faint);
  padding: 7px 12px;
  border-radius: 8px;
  transition: color 0.25s ease, background 0.25s ease;
}
.legal__toc a:hover { color: var(--text); background: rgba(255, 255, 255, 0.04); }
.legal__body { max-width: 72ch; }
.legal__updated { font-family: var(--font-mono); font-size: 0.78rem; letter-spacing: 0.14em; text-transform: uppercase; color: var(--text-faint); margin-top: 14px; }
.legal__note {
  margin: 26px 0 8px;
  padding: 16px 20px;
  border-left: 2px solid var(--violet-400);
  background: rgba(167, 139, 250, 0.06);
  border-radius: 0 12px 12px 0;
  color: var(--text-dim);
  font-size: 0.9rem;
}
.legal__section { padding-top: 44px; scroll-margin-top: 110px; }
.legal__section h2 {
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.35rem;
  letter-spacing: -0.015em;
  padding-bottom: 12px;
  border-bottom: 1px solid var(--border);
  margin-bottom: 16px;
}
.legal__section p { color: var(--text-dim); font-size: 0.96rem; margin-bottom: 12px; }
.legal__section ul { list-style: none; margin: 4px 0 12px; }
.legal__section li {
  color: var(--text-dim);
  font-size: 0.96rem;
  padding: 5px 0 5px 22px;
  position: relative;
}
.legal__section li::before {
  content: '';
  position: absolute;
  left: 2px; top: 14px;
  width: 8px; height: 1px;
  background: var(--cyan-400);
}
.legal__section a { color: var(--cyan-300); }
.legal__section a:hover { text-decoration: underline; }

/* footer legal row */
.footer__legal { display: flex; gap: 18px; }
.footer__legal a { color: var(--text-faint); transition: color 0.2s ease; }
.footer__legal a:hover { color: var(--cyan-300); }

/* fire accent — primary CTA warm ignition on hover (5% energy) */
@media (hover: hover) and (pointer: fine) {
  .btn-primary:hover {
    box-shadow:
      inset 0 1px 0 rgba(255, 255, 255, 1),
      inset 0 -8px 16px rgba(96, 120, 170, 0.22),
      0 18px 44px -14px rgba(148, 202, 255, 0.42),
      0 4px 30px -6px rgba(255, 171, 94, 0.28);
  }
}

/* Static hero fallback (shown when WebGL is unavailable) */
.scene3d--fallback {
  display: flex;
  align-items: center;
  justify-content: center;
  padding: 0;
}
.scene3d--fallback img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
}

/* ============================================================
   AI-WORKSHOP OPS HUD (hero scene overlay)
   ============================================================ */
.whud {
  position: absolute;
  top: 14px; left: 16px;
  z-index: 5;
  display: flex;
  align-items: center;
  gap: 10px;
  max-width: 92%;
  padding: 8px 14px;
  border-radius: 100px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  white-space: nowrap;
  color: var(--text-dim);
  background: rgba(9, 13, 24, 0.72);
  border: 1px solid var(--border-strong);
  backdrop-filter: blur(16px) saturate(160%);
  -webkit-backdrop-filter: blur(16px) saturate(160%);
  box-shadow: var(--rim), 0 14px 34px -18px rgba(0, 0, 0, 0.8);
}
.whud__dot {
  width: 7px; height: 7px; flex: 0 0 7px; border-radius: 50%;
  background: #34e5a4;
  box-shadow: 0 0 10px #34e5a4, 0 0 3px #b6ffe6;
}
.whud__brand { color: var(--text); font-weight: 600; letter-spacing: 0.18em; }
.whud__cell { color: var(--cyan-300); }
.whud__sep { width: 1px; height: 12px; background: var(--border-strong); }
.whud__status { color: var(--text-dim); min-width: 168px; }
.whud__bar {
  position: relative;
  width: 58px; height: 3px;
  border-radius: 3px;
  background: rgba(255, 255, 255, 0.08);
  overflow: hidden;
  flex: 0 0 58px;
}
.whud__fill {
  position: absolute;
  top: 0; left: 0; height: 100%;
  width: 40%;
  border-radius: 3px;
  background: linear-gradient(90deg, transparent, var(--cyan-400), transparent);
  animation: whudScan 2.2s var(--ease-lux) infinite;
}
@keyframes whudScan {
  0% { left: -40%; }
  100% { left: 100%; }
}

@media (max-width: 620px) {
  .whud__status { min-width: 0; }
  .whud { font-size: 9px; gap: 7px; padding: 7px 11px; }
  .whud__cell, .whud__bar { display: none; }
}
@media (prefers-reduced-motion: reduce) {
  .whud__fill { animation: none; }
}

/* Photoreal hero media (video / image) — fills the scene panel */
.scene3d--media { padding: 0; overflow: hidden; display: block; background: #05070d; }
.scene3d--media video,
.scene3d--media img {
  width: 100%;
  height: 100%;
  object-fit: cover;
  border-radius: inherit;
  display: block;
}

/* Cinematic scrim over the hero media so HUD text stays readable */
.scene-scrim {
  position: absolute;
  inset: 0;
  z-index: 2;
  border-radius: 26px;
  pointer-events: none;
  background:
    linear-gradient(180deg, rgba(4, 6, 12, 0.55) 0%, transparent 22%, transparent 74%, rgba(4, 6, 12, 0.6) 100%);
}

/* ============================================================
   WORKSHOP CONSOLE DRESSING (hero panel)
   ============================================================ */
/* camera-viewfinder corner brackets */
.scene-corners { position: absolute; inset: 10px; z-index: 4; pointer-events: none; }
.scene-corners::before,
.scene-corners::after {
  content: '';
  position: absolute;
  width: 26px; height: 26px;
  border: 1.5px solid rgba(103, 232, 249, 0.45);
}
.scene-corners::before { top: 0; left: 0; border-right: 0; border-bottom: 0; border-top-left-radius: 8px; }
.scene-corners::after { bottom: 0; right: 0; border-left: 0; border-top: 0; border-bottom-right-radius: 8px; }

/* live camera tag with ticking clock */
.camtag {
  position: absolute;
  bottom: 14px; left: 16px;
  z-index: 5;
  display: inline-flex;
  align-items: center;
  gap: 8px;
  padding: 7px 12px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 10px;
  letter-spacing: 0.14em;
  color: var(--text-dim);
  background: rgba(9, 13, 24, 0.7);
  border: 1px solid var(--border-strong);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
}
.camtag__dot { width: 6px; height: 6px; border-radius: 50%; background: #ff5d5d; box-shadow: 0 0 8px rgba(255, 93, 93, 0.7); }

/* station status strip */
.statstrip {
  position: absolute;
  bottom: 14px; right: 16px;
  z-index: 5;
  display: flex;
  gap: 14px;
  padding: 7px 12px;
  border-radius: 8px;
  font-family: var(--font-mono);
  font-size: 9.5px;
  letter-spacing: 0.12em;
  color: var(--text-faint);
  background: rgba(9, 13, 24, 0.7);
  border: 1px solid var(--border);
  backdrop-filter: blur(12px);
  -webkit-backdrop-filter: blur(12px);
  white-space: nowrap;
}
.statstrip span { display: inline-flex; align-items: center; gap: 6px; }
.statstrip i.ok {
  width: 5px; height: 5px; border-radius: 50%;
  background: #34e5a4;
  box-shadow: 0 0 6px rgba(52, 229, 164, 0.7);
}

@media (max-width: 760px) {
  .statstrip { display: none; }          /* keep mobile clean */
  .camtag { bottom: 10px; left: 12px; font-size: 9px; }
}

/* ============================================================
   Mobile drawer scrim — dims and captures clicks behind the menu
   ============================================================ */
.nav__scrim {
  position: fixed;
  inset: 0;
  z-index: 98;
  background: rgba(2, 4, 10, 0.6);
  backdrop-filter: blur(2px);
  -webkit-backdrop-filter: blur(2px);
}
@media (min-width: 901px) { .nav__scrim { display: none; } }
```

## `scripts/build-car.mjs`

```js
/*
 * Generates public/car.glb — a two-tone luxury EV sedan.
 *   · Paint: black metallic (upper body) + white-silver band (lower body),
 *     encoded as vertex colours on a parametric lofted body.
 *   · Dark panoramic glass canopy, black rubber tyres, silver multi-spoke
 *     forged rims + brake discs, silver side mirrors.
 * Runs in plain Node (no DOM): builds THREE BufferGeometries, then packs
 * POSITION / NORMAL / COLOR_0 / indices into a single binary GLB by hand.
 *
 *   node scripts/build-car.mjs
 */
import * as THREE from 'three'
import { mergeGeometries } from 'three/examples/jsm/utils/BufferGeometryUtils.js'
import { writeFileSync, mkdirSync } from 'node:fs'
import { fileURLToPath } from 'node:url'
import { dirname, join } from 'node:path'

const __dirname = dirname(fileURLToPath(import.meta.url))
const OUT = join(__dirname, '..', 'public', 'car.glb')

/* ---------- parametric body (same design curves as the live scene) ---------- */
const smooth = (a, b, x) => {
  const t = Math.min(Math.max((x - a) / (b - a), 0), 1)
  return t * t * (3 - 2 * t)
}
function interp(ctrl, x) {
  if (x >= ctrl[0][0]) return ctrl[0][1]
  for (let i = 0; i < ctrl.length - 1; i++) {
    const [xa, va] = ctrl[i], [xb, vb] = ctrl[i + 1]
    if (x <= xa && x >= xb) {
      const t = (xa - x) / (xa - xb)
      const ts = t * t * (3 - 2 * t)
      return va + (vb - va) * ts
    }
  }
  return ctrl[ctrl.length - 1][1]
}
const TOP = [[2.62, 0.54], [2.3, 0.6], [1.2, 0.66], [0.9, 0.7], [0.0, 0.76], [-1.0, 0.78], [-1.8, 0.76], [-2.3, 0.73], [-2.52, 0.7]]
const HALF_W = [[2.62, 0.52], [2.35, 0.72], [1.55, 0.92], [0.6, 0.9], [-0.5, 0.91], [-1.5, 0.96], [-2.3, 0.86], [-2.52, 0.64]]
const FLARE = (x) => 0.022 * Math.exp(-(((x - 1.55) / 0.55) ** 2)) + 0.032 * Math.exp(-(((x + 1.5) / 0.6) ** 2))
const archLift = (x) => {
  const f = 0.3 + Math.sqrt(Math.max(0, 0.5 ** 2 - (x - 1.55) ** 2))
  const r = 0.3 + Math.sqrt(Math.max(0, 0.52 ** 2 - (x + 1.5) ** 2))
  return Math.max(0.17, f, r)
}

function buildBodyGeometry() {
  const NX = 120, NR = 64
  const stations = []
  for (let i = 0; i < NX; i++) stations.push(2.62 - (i / (NX - 1)) * (2.62 + 2.52))
  const verts = [], idx = [], cols = []
  const TONE_DARK = [0.028, 0.032, 0.045]    // deep gloss black metallic
  const TONE_SILVER = [0.9, 0.93, 0.97]      // bright white silver
  const toneAt = (y) => {
    const s = 1 - smooth(0.5, 0.62, y) // silver body sides, black metallic above the beltline
    return [
      TONE_DARK[0] + (TONE_SILVER[0] - TONE_DARK[0]) * s,
      TONE_DARK[1] + (TONE_SILVER[1] - TONE_DARK[1]) * s,
      TONE_DARK[2] + (TONE_SILVER[2] - TONE_DARK[2]) * s,
    ]
  }
  for (let i = 0; i < NX; i++) {
    const x = stations[i]
    const yTop = interp(TOP, x)
    const y0 = archLift(x)
    const w = interp(HALF_W, x) * (1 - 0.08 * smooth(2.2, 2.62, x))
    for (let k = 0; k < NR; k++) {
      const th = -Math.PI / 2 + (k / NR) * Math.PI * 2
      const sy = Math.sin(th), cz = Math.cos(th)
      // arches are cut only near the body sides; the floor between the
      // wheels stays low so the belly doesn't lift and expose a tunnel
      const side = smooth(0.45, 0.85, Math.abs(cz))
      const yBot = 0.17 + (y0 - 0.17) * side
      const yc = (yBot + yTop) / 2
      const ry = Math.max((yTop - yBot) / 2, 0.02)
      let y = yc + ry * Math.sign(sy) * Math.abs(sy) ** 0.85
      let z = w * Math.sign(cz) * Math.abs(cz) ** 0.66
      z *= 1 - smooth(yTop - 0.14, yTop, y) * 0.1
      z *= 1 + FLARE(x) * Math.exp(-(((y - 0.5) / 0.2) ** 2))
      // sill tuck: body is widest at the shoulder and narrows toward the
      // rockers so the wheels sit flush with the fenders and stay visible
      z *= 1 - 0.16 * (1 - smooth(0.24, 0.52, y))
      verts.push(x, y, z)
      cols.push(...toneAt(y))
    }
  }
  for (let i = 0; i < NX - 1; i++) {
    for (let k = 0; k < NR; k++) {
      const a = i * NR + k
      const b = i * NR + ((k + 1) % NR)
      const c = (i + 1) * NR + k
      const d = (i + 1) * NR + ((k + 1) % NR)
      idx.push(a, b, c, b, d, c)
    }
  }
  const noseC = verts.length / 3
  const noseY = (archLift(2.62) + interp(TOP, 2.62)) / 2
  verts.push(2.62, noseY, 0); cols.push(...toneAt(noseY))
  for (let k = 0; k < NR; k++) idx.push(noseC, k, (k + 1) % NR)
  const tailC = verts.length / 3
  const li = (NX - 1) * NR
  const tailY = (archLift(-2.52) + interp(TOP, -2.52)) / 2
  verts.push(-2.52, tailY, 0); cols.push(...toneAt(tailY))
  for (let k = 0; k < NR; k++) idx.push(tailC, li + ((k + 1) % NR), li + k)
  const geo = new THREE.BufferGeometry()
  geo.setAttribute('position', new THREE.Float32BufferAttribute(verts, 3))
  geo.setAttribute('color', new THREE.Float32BufferAttribute(cols, 3))
  geo.setIndex(idx)
  geo.computeVertexNormals()
  return geo
}

/* ---------- glass canopy ---------- */
function buildGlassGeometry() {
  const s = new THREE.Shape()
  s.moveTo(-1.8, 0.74)
  s.quadraticCurveTo(-1.62, 1.0, -1.15, 1.05)
  s.quadraticCurveTo(-0.5, 1.11, 0.1, 1.08)
  s.quadraticCurveTo(0.62, 1.01, 1.02, 0.72)
  s.lineTo(-1.8, 0.74)
  const g = new THREE.ExtrudeGeometry(s, { depth: 1.32, bevelEnabled: false, curveSegments: 20 })
  g.translate(0, 0.02, -0.66)
  const pos = g.attributes.position
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i)
    if (y > 0.78) pos.setZ(i, pos.getZ(i) * (1 - smooth(0.78, 1.15, y) * 0.52))
  }
  g.computeVertexNormals()
  g.deleteAttribute('uv')
  return g
}

/* ---------- wheels ---------- */
const tireGeos = []
const silverGeos = []
function place(geo, x, y, z) { const c = geo.clone(); c.translate(x, y, z); return c }

function buildWheel(x, y, z) {
  const face = z > 0 ? 0.105 : -0.105
  // tyre (black rubber)
  const tire = new THREE.TorusGeometry(0.355, 0.105, 14, 32)
  const tread = new THREE.CylinderGeometry(0.455, 0.455, 0.15, 32); tread.rotateX(Math.PI / 2)
  tireGeos.push(place(tire, x, y, z), place(tread, x, y, z))
  // forged silver rim
  const dish = new THREE.CylinderGeometry(0.34, 0.34, 0.02, 28); dish.rotateX(Math.PI / 2)
  silverGeos.push(place(dish, x, y, z + face * 0.6))
  const lipRing = new THREE.TorusGeometry(0.34, 0.012, 6, 32)
  silverGeos.push(place(lipRing, x, y, z + face))
  const hub = new THREE.CylinderGeometry(0.08, 0.08, 0.05, 14); hub.rotateX(Math.PI / 2)
  silverGeos.push(place(hub, x, y, z + face))
  for (let i = 0; i < 10; i++) {
    const a = (i / 10) * Math.PI * 2
    const spoke = new THREE.BoxGeometry(0.03, 0.29, 0.024)
    spoke.rotateZ(a)
    silverGeos.push(place(spoke, x + Math.cos(a + Math.PI / 2) * 0.185, y + Math.sin(a + Math.PI / 2) * 0.185, z + face))
  }
  // brake disc (silver)
  const disc = new THREE.CylinderGeometry(0.24, 0.24, 0.02, 24); disc.rotateX(Math.PI / 2)
  silverGeos.push(place(disc, x, y, z + face * 0.35))
  // dark inner-fender liner so the arch opening isn't see-through
  const liner = new THREE.CylinderGeometry(0.44, 0.44, 0.05, 20); liner.rotateX(Math.PI / 2)
  tireGeos.push(place(liner, x, y, z - face * 2))
}
for (const [x, y, z] of [[1.55, 0.28, 0.84], [1.55, 0.28, -0.84], [-1.5, 0.28, 0.84], [-1.5, 0.28, -0.84]]) buildWheel(x, y, z)

// side mirrors (silver)
for (const z of [0.72, -0.72]) {
  const pod = new THREE.SphereGeometry(0.055, 12, 8)
  pod.scale(1.5, 0.7, 1.0)
  silverGeos.push(place(pod, 0.72, 0.8, z))
}

function clean(g) { g.deleteAttribute('uv'); if (g.attributes.color) g.deleteAttribute('color'); return g }
const tiresMerged = mergeGeometries(tireGeos.map(clean))
const silverMerged = mergeGeometries(silverGeos.map(clean))
const bodyGeo = buildBodyGeometry()
const glassGeo = buildGlassGeometry()

/* ---------- GLB writer ---------- */
const FLOAT = 5126, UINT = 5125
const ARRAY_BUFFER = 34962, ELEMENT_ARRAY_BUFFER = 34963
const gltf = {
  asset: { version: '2.0', generator: 'autocan-build-car' },
  scene: 0, scenes: [{ nodes: [] }],
  nodes: [], meshes: [], materials: [], accessors: [], bufferViews: [], buffers: [],
}
const chunks = []
let byteOffset = 0
function addBufferView(buf, target) {
  const view = { buffer: 0, byteOffset, byteLength: buf.length }
  if (target) view.target = target
  gltf.bufferViews.push(view)
  chunks.push(buf)
  byteOffset += buf.length
  const pad = (4 - (byteOffset % 4)) % 4
  if (pad) { chunks.push(Buffer.alloc(pad)); byteOffset += pad }
  return gltf.bufferViews.length - 1
}
function addAccessor(typed, type, componentType, count, minmax, target) {
  const buf = Buffer.from(typed.buffer, typed.byteOffset, typed.byteLength)
  const bv = addBufferView(buf, target)
  const acc = { bufferView: bv, byteOffset: 0, componentType, count, type }
  if (minmax) { acc.min = minmax.min; acc.max = minmax.max }
  gltf.accessors.push(acc)
  return gltf.accessors.length - 1
}
function posMinMax(arr) {
  const min = [Infinity, Infinity, Infinity], max = [-Infinity, -Infinity, -Infinity]
  for (let i = 0; i < arr.length; i += 3) for (let j = 0; j < 3; j++) {
    min[j] = Math.min(min[j], arr[i + j]); max[j] = Math.max(max[j], arr[i + j])
  }
  return { min, max }
}
function addMaterial(name, baseColorFactor, metallicFactor, roughnessFactor, extra = {}) {
  gltf.materials.push({ name, doubleSided: true, pbrMetallicRoughness: { baseColorFactor, metallicFactor, roughnessFactor }, ...extra })
  return gltf.materials.length - 1
}
function addMesh(name, geo, material) {
  const pos = new Float32Array(geo.attributes.position.array)
  const posAcc = addAccessor(pos, 'VEC3', FLOAT, pos.length / 3, posMinMax(pos), ARRAY_BUFFER)
  const nrm = new Float32Array(geo.attributes.normal.array)
  const nrmAcc = addAccessor(nrm, 'VEC3', FLOAT, nrm.length / 3, null, ARRAY_BUFFER)
  const attributes = { POSITION: posAcc, NORMAL: nrmAcc }
  if (geo.attributes.color) {
    const col = new Float32Array(geo.attributes.color.array)
    attributes.COLOR_0 = addAccessor(col, 'VEC3', FLOAT, col.length / 3, null, ARRAY_BUFFER)
  }
  const idxSrc = geo.index ? geo.index.array : null
  let indices
  if (idxSrc) {
    const idx = new Uint32Array(idxSrc)
    indices = addAccessor(idx, 'SCALAR', UINT, idx.length, null, ELEMENT_ARRAY_BUFFER)
  }
  gltf.meshes.push({ name, primitives: [{ attributes, ...(indices != null ? { indices } : {}), material }] })
  gltf.nodes.push({ name, mesh: gltf.meshes.length - 1 })
  gltf.scenes[0].nodes.push(gltf.nodes.length - 1)
}

const matBody = addMaterial('BlackMetallicPaint', [1, 1, 1, 1], 0.95, 0.18)
const matGlass = addMaterial('Glass', [0.04, 0.08, 0.14, 1], 0.0, 0.06, { alphaMode: 'BLEND' })
const matTire = addMaterial('Tire', [0.06, 0.065, 0.075, 1], 0.05, 0.85)
const matSilver = addMaterial('SilverTrim', [0.92, 0.94, 0.98, 1], 1.0, 0.12)

addMesh('Body', bodyGeo, matBody)
addMesh('Glass', glassGeo, matGlass)
addMesh('Tires', tiresMerged, matTire)
addMesh('Silver', silverMerged, matSilver)

const binBuffer = Buffer.concat(chunks)
gltf.buffers.push({ byteLength: binBuffer.length })
let jsonBuf = Buffer.from(JSON.stringify(gltf), 'utf8')
const jsonPad = (4 - (jsonBuf.length % 4)) % 4
if (jsonPad) jsonBuf = Buffer.concat([jsonBuf, Buffer.from(' '.repeat(jsonPad))])

const header = Buffer.alloc(12)
header.writeUInt32LE(0x46546c67, 0)
header.writeUInt32LE(2, 4)
header.writeUInt32LE(12 + 8 + jsonBuf.length + 8 + binBuffer.length, 8)
const jsonHeader = Buffer.alloc(8)
jsonHeader.writeUInt32LE(jsonBuf.length, 0)
jsonHeader.writeUInt32LE(0x4e4f534a, 4)
const binHeader = Buffer.alloc(8)
binHeader.writeUInt32LE(binBuffer.length, 0)
binHeader.writeUInt32LE(0x004e4942, 4)

mkdirSync(dirname(OUT), { recursive: true })
writeFileSync(OUT, Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuffer]))
console.log(`car.glb written: ${(Buffer.concat([header, jsonHeader, jsonBuf, binHeader, binBuffer]).length / 1024).toFixed(1)} KB`)
console.log(`  meshes: ${gltf.meshes.length}, accessors: ${gltf.accessors.length}, bin: ${(binBuffer.length / 1024).toFixed(1)} KB`)
```

## `scripts/generate-docs.mjs`

````js
// Regenerates the "Full source code" appendix of PROJECT-DOCUMENTATION.md.
//
// The prose sections (1-6) are hand-written and stay hand-written — they carry
// judgement a script can't reproduce. Everything below the APPENDIX marker is
// mechanical: a verbatim dump of the source, which is exactly the part that
// went stale when files were added and renamed.
//
//   npm run docs
//
// Run it whenever the source changes materially, and commit the result.

import { readFileSync, readdirSync, writeFileSync, existsSync } from 'node:fs'
import { dirname, extname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')
const DOC = resolve(root, 'PROJECT-DOCUMENTATION.md')

const START = '<!-- BEGIN GENERATED APPENDIX -->'
const END = '<!-- END GENERATED APPENDIX -->'

// Ordered so the appendix reads top-down: config, entry points, then features.
// A string is a single file; { dir, ext } takes every matching file in a
// directory, sorted. Deliberately hand-rolled rather than using fs.globSync,
// which needs Node 22 — CI and Vercel run Node 20.
const SOURCES = [
  'package.json',
  'vite.config.js',
  'vercel.json',
  'eslint.config.js',
  'index.html',
  'src/main.jsx',
  'src/routes.jsx',
  'src/Layout.jsx',
  { dir: 'src/seo', ext: ['.js', '.jsx'] },
  { dir: 'src/data', ext: ['.js'] },
  { dir: 'src/pages', ext: ['.jsx'] },
  { dir: 'src/components', ext: ['.js', '.jsx', '.css'] },
  { dir: 'src/styles', ext: ['.css'] },
  { dir: 'scripts', ext: ['.mjs'] },
  'public/robots.txt',
  'public/llms.txt',
  'public/site.webmanifest',
]

const FENCE = {
  '.json': 'json',
  '.js': 'js',
  '.mjs': 'js',
  '.jsx': 'jsx',
  '.css': 'css',
  '.html': 'html',
  '.webmanifest': 'json',
  '.txt': 'text',
  '.xml': 'xml',
}

function expand(entry) {
  if (typeof entry === 'string') {
    return existsSync(resolve(root, entry)) ? [entry] : []
  }
  const dir = resolve(root, entry.dir)
  if (!existsSync(dir)) return []
  return readdirSync(dir, { withFileTypes: true })
    .filter((item) => item.isFile() && entry.ext.includes(extname(item.name)))
    .map((item) => `${entry.dir}/${item.name}`)
    .sort()
}

function collectFiles() {
  const seen = new Set()
  return SOURCES.flatMap(expand).filter((file) => !seen.has(file) && seen.add(file))
}

function renderAppendix(files) {
  const generated = new Date().toISOString().slice(0, 10)
  const body = files.map((file) => {
    const source = readFileSync(resolve(root, file), 'utf8').replace(/\s+$/, '')
    const lang = FENCE[extname(file)] ?? ''
    // A file containing ``` would break a 3-backtick fence.
    const fence = source.includes('```') ? '````' : '```'
    return `## \`${file}\`\n\n${fence}${lang}\n${source}\n${fence}\n`
  })

  return [
    START,
    '',
    `# 7. Full source code`,
    '',
    `_Generated from the working tree by \`npm run docs\` on ${generated}. Do not edit by hand —_`,
    `_edits here are overwritten. ${files.length} files._`,
    '',
    ...body,
    END,
  ].join('\n')
}

const files = collectFiles()
const current = readFileSync(DOC, 'utf8')
const appendix = renderAppendix(files)

let next
if (current.includes(START) && current.includes(END)) {
  // This script is itself part of the appendix, so its source contains both
  // marker strings. The real markers are the outermost pair: the first START
  // and the last END. Using indexOf for both would splice at the copy embedded
  // in this file and shred the document.
  next =
    current.slice(0, current.indexOf(START)) +
    appendix +
    current.slice(current.lastIndexOf(END) + END.length)
} else {
  // First run: replace everything from the old hand-pasted appendix onward.
  const legacy = current.search(/^#+ 7\. Full source code\s*$/m)
  const prose = legacy === -1 ? current.replace(/\s+$/, '') + '\n\n---\n\n' : current.slice(0, legacy)
  next = prose + appendix + '\n'
}

writeFileSync(DOC, next)
console.log(`[docs] appendix regenerated from ${files.length} files → PROJECT-DOCUMENTATION.md`)
````

## `scripts/generate-sitemap.mjs`

```js
// Generates public/sitemap.xml at build time.
//
// Hand-maintained sitemaps rot: the <lastmod> dates stop matching reality the
// first time someone edits a page and forgets the XML. Here each route's
// lastmod is the commit date of the newest source file that actually renders
// it, so the dates are correct by construction.
//
// Run automatically by `npm run build` (see package.json).

import { execFileSync } from 'node:child_process'
import { readFileSync, writeFileSync } from 'node:fs'
import { dirname, resolve } from 'node:path'
import { fileURLToPath } from 'node:url'

import { SITE_URL } from '../src/seo/site.config.js'

const root = resolve(dirname(fileURLToPath(import.meta.url)), '..')

// Shared content modules feed every page, so they count toward each lastmod.
const SITE_DATA = ['src/data/site.js']
const LEGAL_DATA = ['src/data/legal.js']
const FAQ_DATA = ['src/data/faq.js']

/**
 * `sources` drives lastmod only. `changefreq`/`priority` are hints; Google
 * largely ignores them, but Bing and smaller crawlers still read them.
 */
const PAGES = [
  {
    path: '/',
    changefreq: 'weekly',
    priority: '1.0',
    sources: ['src/pages/Home.jsx', ...SITE_DATA, ...FAQ_DATA],
    image: {
      loc: '/og-image.png',
      title: 'AUTO-CAN Solutions — engineering the software that moves the modern vehicle',
    },
  },
  { path: '/services', changefreq: 'monthly', priority: '0.9', sources: ['src/pages/Services.jsx', ...SITE_DATA, ...FAQ_DATA] },
  { path: '/expertise', changefreq: 'monthly', priority: '0.8', sources: ['src/pages/Expertise.jsx', ...SITE_DATA] },
  { path: '/about', changefreq: 'monthly', priority: '0.7', sources: ['src/pages/About.jsx', ...SITE_DATA] },
  { path: '/careers', changefreq: 'monthly', priority: '0.7', sources: ['src/pages/Careers.jsx', ...SITE_DATA] },
  { path: '/contact', changefreq: 'yearly', priority: '0.6', sources: ['src/pages/Contact.jsx', ...SITE_DATA] },
  { path: '/privacy-policy', changefreq: 'yearly', priority: '0.3', sources: ['src/pages/PrivacyPolicy.jsx', ...LEGAL_DATA] },
  { path: '/terms-and-conditions', changefreq: 'yearly', priority: '0.3', sources: ['src/pages/Terms.jsx', ...LEGAL_DATA] },
]

// Routes that exist but must never be indexed.
const EXCLUDED = new Set(['/404', '/*'])

/** Last commit date (YYYY-MM-DD) touching any of `files`, or today if unknown. */
function lastModified(files) {
  const dates = files
    .map((file) => {
      try {
        return execFileSync('git', ['log', '-1', '--format=%cs', '--', file], {
          cwd: root,
          encoding: 'utf8',
          stdio: ['ignore', 'pipe', 'ignore'],
        }).trim()
      } catch {
        return '' // not a git checkout, or file never committed
      }
    })
    .filter(Boolean)

  if (!dates.length) return new Date().toISOString().slice(0, 10)
  return dates.sort().at(-1)
}

/**
 * Guards against the sitemap silently drifting from the router. Parses the
 * child route paths out of routes.jsx and fails the build on any mismatch.
 */
function assertRoutesCovered() {
  const source = readFileSync(resolve(root, 'src/routes.jsx'), 'utf8')
  const declared = new Set(
    [...source.matchAll(/\{\s*path:\s*'([^']+)'/g)]
      .map(([, path]) => (path.startsWith('/') ? path : `/${path}`))
      .filter((path) => !EXCLUDED.has(path))
  )
  declared.add('/') // the index route

  const covered = new Set(PAGES.map((page) => page.path))
  const missing = [...declared].filter((path) => !covered.has(path))
  const stale = [...covered].filter((path) => !declared.has(path))

  if (missing.length || stale.length) {
    const problems = [
      missing.length && `routed but absent from the sitemap: ${missing.join(', ')}`,
      stale.length && `in the sitemap but not routed: ${stale.join(', ')}`,
    ].filter(Boolean)
    throw new Error(
      `sitemap is out of sync with src/routes.jsx\n  ${problems.join('\n  ')}\n` +
        '  Update PAGES in scripts/generate-sitemap.mjs (or EXCLUDED for noindex routes).'
    )
  }
}

function xmlEscape(value) {
  return value.replace(/[<>&'"]/g, (c) => `&${{ '<': 'lt', '>': 'gt', '&': 'amp', "'": 'apos', '"': 'quot' }[c]};`)
}

function buildSitemap() {
  const base = SITE_URL.replace(/\/$/, '')

  const urls = PAGES.map((page) => {
    const loc = `${base}${page.path}`
    const image = page.image
      ? `<image:image><image:loc>${base}${page.image.loc}</image:loc>` +
        `<image:title>${xmlEscape(page.image.title)}</image:title></image:image>`
      : ''
    return (
      `  <url><loc>${loc}</loc><lastmod>${lastModified(page.sources)}</lastmod>` +
      `<changefreq>${page.changefreq}</changefreq><priority>${page.priority}</priority>${image}</url>`
    )
  })

  return [
    '<?xml version="1.0" encoding="UTF-8"?>',
    '<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9" xmlns:image="http://www.google.com/schemas/sitemap-image/1.1">',
    ...urls,
    '</urlset>',
    '',
  ].join('\n')
}

assertRoutesCovered()
const out = resolve(root, 'public/sitemap.xml')
writeFileSync(out, buildSitemap())
console.log(`[sitemap] ${PAGES.length} URLs → public/sitemap.xml (${SITE_URL})`)
```

## `public/robots.txt`

```text
# robots.txt — AUTO-CAN Solutions
User-agent: *
Allow: /

# Major AI / answer engines (GEO/AEO) — explicitly welcomed
User-agent: GPTBot
Allow: /
User-agent: OAI-SearchBot
Allow: /
User-agent: ChatGPT-User
Allow: /
User-agent: PerplexityBot
Allow: /
User-agent: Google-Extended
Allow: /
User-agent: Applebot-Extended
Allow: /
User-agent: ClaudeBot
Allow: /
User-agent: Bytespider
Allow: /

Sitemap: https://www.auto-can-solution.com/sitemap.xml
```

## `public/llms.txt`

```text
# AUTO-CAN Solutions

> Automotive engineering & embedded software company founded in 2013 in Jaipur, India,
> with delivery centres in Jaipur and Pune. Specializes in Hardware-in-the-Loop (HiL)
> testing, embedded software stacks (BSW, CAN, LIN, UDS), test automation, embedded
> hardware, and R&D across AUTOSAR, ISO 26262, ADAS, Automotive Ethernet, OTA and V2X.
> Serves OEMs and Tier-1 suppliers across North America, Europe, Japan and APAC.

## Key facts
- Founded: 2013 (Jaipur, Rajasthan, India)
- Delivery centres: Jaipur, Pune
- Core domains: Automotive Testing, Development, R&D
- Engagement models: ODC (Offshore/On-site Development Centre) and Deputation
- Buffer bench: 25-45% for same-day resource deployment
- Standards: MISRA C, ISO 26262, AUTOSAR; protocols CAN, LIN, UDS, FlexRay, Automotive Ethernet
- Contact: info@auto-can.in

## Pages
- Home: https://www.auto-can-solution.com/
- Services: https://www.auto-can-solution.com/services
- Expertise & standards: https://www.auto-can-solution.com/expertise
- About & history: https://www.auto-can-solution.com/about
- Careers, engagement models & Campus Connect: https://www.auto-can-solution.com/careers
- Contact: https://www.auto-can-solution.com/contact
```

## `public/site.webmanifest`

```json
{
  "name": "AUTO-CAN Solutions",
  "short_name": "AUTO-CAN",
  "description": "Automotive engineering & embedded software since 2013 — HiL testing, AUTOSAR, ADAS and next-gen mobility.",
  "id": "/",
  "start_url": "/",
  "scope": "/",
  "display": "standalone",
  "orientation": "any",
  "background_color": "#04060b",
  "theme_color": "#04060b",
  "categories": ["business", "engineering", "technology"],
  "lang": "en",
  "dir": "ltr",
  "icons": [
    { "src": "/icon-192.png", "sizes": "192x192", "type": "image/png", "purpose": "any" },
    { "src": "/icon-512.png", "sizes": "512x512", "type": "image/png", "purpose": "any" },
    { "src": "/icon-maskable-512.png", "sizes": "512x512", "type": "image/png", "purpose": "maskable" }
  ]
}
```

<!-- END GENERATED APPENDIX -->
