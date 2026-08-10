# AUTO-CAN Solutions — Full Website Documentation

_Complete reference: overview, links, architecture, integrations, and full source code._
_Generated: 2026-07-11_

> ⚠️ **This is a point-in-time snapshot.** The embedded source listings below reflect the
> repository as of the generation date and have since drifted (the site now has privacy and
> terms pages, a rebuilt contact form, and a different domain). Treat `README.md` and the
> actual files in `src/` as authoritative; regenerate this document before relying on it.

---

## 1. Overview

**AUTO-CAN Solutions** is an automotive engineering & embedded software company (founded 2013, Jaipur, India; delivery centres in Jaipur and Pune). This repository is its marketing website — a modern, animated, **statically prerendered** React site optimised for search engines and AI answer engines.

| | |
|---|---|
| **Framework** | React 18 + Vite 5 |
| **Prerendering** | vite-react-ssg (static HTML per route) |
| **Routing** | React Router 6 |
| **Animation** | Framer Motion 11 (3D tilt, magnetic buttons, cursor glow, particle field) |
| **SEO** | Per-page meta + JSON-LD (Organization, WebSite, LocalBusiness, WebPage, Breadcrumb, FAQ) |
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
| Contact | `/contact` | `dist/contact.html` | Contact info + enquiry form (demo) |
| 404 | `*` | (client fallback) | Not-found page |

**Crawl assets:** `/robots.txt`, `/sitemap.xml`, `/llms.txt`, `/site.webmanifest`

---

## 3. Run, build & deploy

```bash
npm install      # install dependencies
npm run dev      # dev server → http://localhost:5173
npm run build    # static prerender → /dist
npm run preview  # preview production build
```

Deploy the **`dist/`** folder to any static host (Netlify, Vercel, Cloudflare Pages, GitHub Pages, S3, etc.). No server runtime required.

---

## 4. Architecture & "API" / integration details

This is a **static front-end site**. There is **no custom backend API, no database, and no secret keys** anywhere in the codebase.

**Data sources (local, no network):**
- `src/data/site.js` — all company/marketing content
- `src/data/faq.js` — FAQ Q&A (also used for FAQ schema)
- `src/seo/site.config.js` — domain, org & contact config
- `src/seo/pages.seo.js` — per-page titles/descriptions

**External resources used:**
- **Google Fonts** — `https://fonts.googleapis.com` (Sora, Inter, JetBrains Mono). No API key.
- That's it — no analytics, trackers, or third-party APIs are wired in by default.

**Contact form:** `src/pages/Contact.jsx` is a **front-end demo** — on submit it just shows a success state; nothing is sent anywhere. To make it live, wire it to an email/form API. Example with a fetch call:

```jsx
const handleSubmit = async (e) => {
  e.preventDefault()
  const data = Object.fromEntries(new FormData(e.target))
  await fetch('https://YOUR-ENDPOINT', {   // e.g. Formspree, or your API
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data),
  })
  setSent(true)
}
```

Popular no-backend options: **Formspree**, **Web3Forms**, **Getform**, or a serverless function (Netlify/Vercel Functions).

**Optional integrations to add later** (need your keys):
- Google Analytics 4 / Google Tag Manager (add script in `index.html`)
- Google Search Console verification meta tag (add in `index.html` or `src/seo/site.config.js`)

---

## 5. SEO / GEO / AEO summary

- **Prerendered HTML** per route (Google + AI crawlers see real content)
- **Per-page** `<title>`, description, canonical, Open Graph, Twitter
- **JSON-LD** graphs: Organization, WebSite, ProfessionalService, WebPage, BreadcrumbList, FAQPage
- **AEO:** FAQ content on-page + FAQPage schema (answer-engine friendly)
- **GEO:** `llms.txt` + `robots.txt` allowing GPTBot, PerplexityBot, Google-Extended, ClaudeBot, etc.
- See **SEO-GUIDE.md** for the off-page ranking checklist.

**Edit before launch** — in `src/seo/site.config.js`: `SITE_URL`, `telephone`, `hq.streetAddress`, `sameAs`. Mirror the domain in `robots.txt`, `sitemap.xml`, `llms.txt`.

---

## 6. Project structure

```
autocan-website/
├── index.html
├── package.json
├── vite.config.js
├── README.md
├── SEO-GUIDE.md
├── public/
│   ├── logo.png  ·  hero-graphic.png
│   ├── robots.txt  ·  sitemap.xml  ·  llms.txt  ·  site.webmanifest
└── src/
    ├── main.jsx  ·  routes.jsx  ·  Layout.jsx
    ├── seo/      (site.config.js, schema.js, SEO.jsx, GlobalSEO.jsx, pages.seo.js)
    ├── data/     (site.js, faq.js)
    ├── pages/    (Home, Services, Expertise, About, Careers, Contact, NotFound)
    ├── components/ (Navbar, Footer, TiltCard, MagneticButton, CursorGlow,
    │               ParticleField, AnimatedHeading, FAQ, Section, Page,
    │               ScrollToTop, CountUp, motionPresets)
    └── styles/   (global.css, pages.css)
```

---

# 7. Full source code


## `package.json`

```json
{
  "name": "autocan-website",
  "private": true,
  "version": "1.0.0",
  "type": "module",
  "description": "AUTO-CAN Solutions — Automotive Engineering & Embedded Software. Marketing website.",
  "scripts": {
    "dev": "vite",
    "build": "vite-react-ssg build",
    "preview": "vite preview"
  },
  "dependencies": {
    "framer-motion": "^11.3.19",
    "react": "^18.3.1",
    "react-dom": "^18.3.1",
    "react-router-dom": "^6.26.0",
    "vite-react-ssg": "^0.9.1"
  },
  "devDependencies": {
    "@vitejs/plugin-react": "^4.3.1",
    "vite": "^5.4.0"
  }
}```

## `vite.config.js`

```js
import { defineConfig } from 'vite'
import react from '@vitejs/plugin-react'

// https://vitejs.dev/config/
export default defineConfig({
  plugins: [react()],
  server: {
    port: 5173,
    open: true
  }
})
```

## `index.html`

```html
<!doctype html>
<html lang="en">
  <head>
    <meta charset="UTF-8" />
    <link rel="icon" type="image/png" href="/logo.png" />
    <link rel="apple-touch-icon" href="/logo.png" />
    <link rel="manifest" href="/site.webmanifest" />
    <meta name="viewport" content="width=device-width, initial-scale=1.0" />
    <meta name="theme-color" content="#070b16" />
    <meta name="author" content="AUTO-CAN Solutions" />
    <link rel="preconnect" href="https://fonts.googleapis.com" />
    <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin />
    <link href="https://fonts.googleapis.com/css2?family=Sora:wght@400;500;600;700;800&family=Inter:wght@400;500;600;700&family=JetBrains+Mono:wght@500;600&display=swap" rel="stylesheet" />
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
import { routes } from './routes'
import './styles/global.css'
import './styles/pages.css'
export const createRoot = ViteReactSSG({ routes })
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
      { path: '*', element: <NotFound /> },
    ],
  },
]
```

## `src/Layout.jsx`

```jsx
import { Outlet } from 'react-router-dom'
import Navbar from './components/Navbar'
import Footer from './components/Footer'
import ScrollToTop from './components/ScrollToTop'
import CursorGlow from './components/CursorGlow'
import GlobalSEO from './seo/GlobalSEO'
export default function Layout() {
  return (
    <>
      <GlobalSEO />
      <ScrollToTop />
      <CursorGlow />
      <Navbar />
      <main><Outlet /></main>
      <Footer />
    </>
  )
}
```

## `src/seo/site.config.js`

```js
// ── Central SEO config ─────────────────────────────────────────────
// Change SITE_URL to your real domain, then fill in phone/address to
// unlock full LocalBusiness rich results.
export const SITE_URL = 'https://www.auto-can.in' // TODO: set your real domain
export const ORG = {
  name: 'AUTO-CAN Solutions',
  legalName: 'AUTO-CAN Solutions',
  slogan: 'Driven by AI. Powered by Innovation.',
  founded: '2013',
  logo: '/logo.png',
  ogImage: '/hero-graphic.png',
  email: 'info@auto-can.in',
  telephone: '', // TODO: e.g. '+91-141-0000000' — leave '' to omit
  sameAs: [
    // TODO: add your real profiles
    // 'https://www.linkedin.com/company/auto-can-solutions',
  ],
  hq: {
    streetAddress: '', // TODO: street address in Jaipur
    addressLocality: 'Jaipur',
    addressRegion: 'Rajasthan',
    postalCode: '', // TODO
    addressCountry: 'IN',
  },
  deliveryCentre: {
    addressLocality: 'Pune',
    addressRegion: 'Maharashtra',
    addressCountry: 'IN',
  },
  areaServed: ['North America', 'Europe', 'Japan', 'APAC', 'India'],
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

export function webPageSchema({ path, title, description }) {
  return {
    '@type': 'WebPage',
    '@id': SITE_URL + path + '#webpage',
    url: SITE_URL + path,
    name: title,
    description,
    isPartOf: { '@id': SITE_URL + '/#website' },
    about: { '@id': SITE_URL + '/#organization' },
    inLanguage: 'en',
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

## `src/seo/SEO.jsx`

```jsx
import { Head } from 'vite-react-ssg'
import { SITE_URL, ORG } from './site.config'
import { webPageSchema, breadcrumbSchema, faqSchema, graph } from './schema'

// Renders per-page <head> tags + JSON-LD into the prerendered HTML.
export default function SEO({ seo, faqs, extraNodes = [] }) {
  const url = SITE_URL + seo.path
  const img = SITE_URL + ORG.ogImage
  const nodes = [
    webPageSchema(seo),
    seo.breadcrumb && breadcrumbSchema(seo.breadcrumb),
    faqs?.length && faqSchema(faqs),
    ...extraNodes,
  ]
  const jsonLd = graph(nodes)
  return (
    <Head>
      <html lang="en" />
      <title>{seo.title}</title>
      <meta name="description" content={seo.description} />
      {seo.keywords && <meta name="keywords" content={seo.keywords} />}
      <link rel="canonical" href={url} />
      <meta name="robots" content="index, follow, max-image-preview:large, max-snippet:-1" />
      <meta property="og:type" content="website" />
      <meta property="og:site_name" content={ORG.name} />
      <meta property="og:title" content={seo.title} />
      <meta property="og:description" content={seo.description} />
      <meta property="og:url" content={url} />
      <meta property="og:image" content={img} />
      <meta property="og:locale" content="en_US" />
      <meta name="twitter:card" content="summary_large_image" />
      <meta name="twitter:title" content={seo.title} />
      <meta name="twitter:description" content={seo.description} />
      <meta name="twitter:image" content={img} />
      <script type="application/ld+json">{JSON.stringify(jsonLd)}</script>
    </Head>
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
    path: '/services', title: 'Automotive Engineering Services | AUTO-CAN Solutions',
    description: 'End-to-end automotive embedded services: embedded SW stacks (BSW, CAN, LIN, UDS), engineering tools, test automation, HiL & V&V, and embedded hardware design.',
    keywords: 'automotive software services, embedded software stacks, test automation framework, HiL V&V, bootloader flashing tool, calibration tool',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Services', path: '/services' }],
  },
  expertise: {
    path: '/expertise', title: 'Domain Expertise & Standards | AUTO-CAN Solutions',
    description: 'Foundational and next-generation automotive expertise: MISRA C, Embedded Linux, CAN, FlexRay, AUTOSAR, ISO 26262, OTA, ADAS, Automotive Ethernet, cybersecurity and V2X.',
    keywords: 'AUTOSAR, ISO 26262, automotive ethernet, MISRA C, FlexRay, ADAS, OTA updates, V2X, automotive cybersecurity',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Expertise', path: '/expertise' }],
  },
  about: {
    path: '/about', title: 'About AUTO-CAN Solutions | A Decade of Automotive Engineering',
    description: 'Founded in 2013 in Jaipur, AUTO-CAN Solutions grew from HiL testing into a full-stack automotive embedded engineering partner. Learn our story, timeline and differentiators.',
    keywords: 'AUTO-CAN Solutions about, automotive engineering company India, HiL testing company, embedded software company Jaipur',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'About', path: '/about' }],
  },
  careers: {
    path: '/careers', title: 'Careers, Engagement Models & Campus Connect | AUTO-CAN Solutions',
    description: 'ODC and Deputation engagement models, structured Learning & Development, and Campus Connect partnerships that turn fresh talent into automotive embedded engineers.',
    keywords: 'automotive engineering careers, ODC model, deputation model, campus connect, automotive embedded training, Pune delivery centre',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Careers', path: '/careers' }],
  },
  contact: {
    path: '/contact', title: 'Contact AUTO-CAN Solutions | Automotive Embedded Partner',
    description: 'Talk to AUTO-CAN Solutions about your automotive program. Same-day deployment, flexible engagement models, and regulatory experience across NA, Europe, Japan and APAC.',
    keywords: 'contact AUTO-CAN Solutions, automotive embedded partner, hire automotive engineers, HiL testing services',
    breadcrumb: [{ name: 'Home', path: '/' }, { name: 'Contact', path: '/contact' }],
  },
}
```

## `src/data/site.js`

```js
export const company = { name: 'AUTO-CAN Solutions', tagline: 'Driven by AI. Powered by Innovation.', kicker: 'Automotive Engineering & Embedded Software', hero: 'A decade of engineering trust in the automotive embedded software domain.', founded: '2013', location: 'Jaipur, Rajasthan, India', deliveryCentre: 'Pune, India', email: 'info@auto-can.in' }
export const stats = [
  { value: 10, suffix: '+', label: 'Years in automotive embedded engineering' },
  { value: 6, suffix: '', label: 'Specialized capability verticals' },
  { value: 45, suffix: '%', label: 'Buffer bench strength for rapid scale-up' },
  { value: 3, suffix: '', label: 'Core domains: Testing · Development · R&D' },
]
export const timeline = [
  { year: '2013', title: 'HiL Testing', text: 'Company incepted in Jaipur — automotive Hardware-in-the-Loop testing, the founding capability.' },
  { year: '2015', title: 'Test Tool Development', text: 'Dedicated Development & Testing Tool Development vertical launched.' },
  { year: '2016', title: 'Embedded Hardware', text: 'Embedded Hardware vertical spun off from the V&V practice.' },
  { year: '2017', title: 'Embedded Software', text: 'Embedded Software development vertical took shape — full-stack capability complete.' },
  { year: '2019', title: 'People Solution', text: 'End-to-End Workforce Management, Payroll, and Staffing Solutions.' },
  { year: '2021–24', title: 'AI & Python', text: 'Transforming ideas into intelligent applications using AI, Python, and cutting-edge technologies.' },
]
export const domains = [
  { no: '01', title: 'Testing', points: ['HiL, SiL & MiL testing', 'Integration & system validation', 'Regulatory & proving-ground testing', 'Test automation frameworks'] },
  { no: '02', title: 'Development', points: ['Embedded SW stacks: BSW, CAN, LIN, UDS', 'Bootloader & flashing tools', 'Embedded hardware design', 'Calibration & diagnostic tools'] },
  { no: '03', title: 'R&D', points: ['AUTOSAR & Functional Safety (ISO 26262)', 'ADAS & Automotive Ethernet', 'Cybersecurity & V2X connectivity', 'OTA and next-gen mobility tech'] },
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
  foundational: { title: 'Foundational Expertise', note: 'Established, production-proven technologies that formed the company’s early engineering foundation.', items: ['MISRA C coding standards', 'Embedded Linux', 'CAN protocol & networks', 'FlexRay communication systems'] },
  nextGen: { title: 'Next-Generation Focus', note: 'Actively investing in the technologies shaping the next decade of mobility and connected vehicles.', items: ['AUTOSAR architecture', 'Functional Safety (ISO 26262)', 'Over-the-Air (OTA) updates', 'ADAS — Advanced Driver Assistance', 'Automotive Ethernet', 'Automotive Cybersecurity', 'V2X connectivity'] },
}
export const engagementModels = [
  { tag: 'ODC MODEL', title: 'Offshore / On-site Development Centre', points: ['Dedicated engineering pods operating out of our Pune delivery centres', 'Function as a true extension of the client’s own engineering team', 'Backed by 25–45% buffer bench strength for rapid scale-up', 'Best suited for long-term, program-based engagements'] },
  { tag: 'DEPUTATION MODEL', title: 'On-Site Talent Deployment', points: ['Engineers deployed directly at the client’s site, embedded within their team', 'Talent remains on AUTO-CAN — no direct hiring overhead for the client', 'Ideal for on-demand, project-specific, or short-to-mid term skill augmentation', 'Gives engineers direct OEM / Tier-1 site exposure early in their careers'] },
]
export const differentiators = ['Same-day resource deployment capability', 'Deep bench of qualified subject matter experts', '100% flexibility across customer-specific processes', 'Long-term, trusted industry presence since 2013', 'Regulatory compliance across North America, Europe, Japan, APAC', 'Test-track and proving-ground vehicle testing experience']
export const engagementTerms = ['Time & Material (T&M)', 'Work Package (WP) based delivery', 'Delivery-based fixed-scope projects', 'Risk–reward partnership models']
export const training = [
  { no: '1', title: 'Structured Onboarding', text: 'Every new hire completes a technical induction covering automotive embedded software fundamentals before joining live projects.' },
  { no: '2', title: 'Domain-Aligned Tracks', text: 'Training paths mapped directly to the Testing, Development, and R&D specializations, so learning translates straight into project readiness.' },
  { no: '3', title: 'Mentorship-Led Growth', text: 'Guidance from engineers with 10+ years of automotive domain experience, working alongside trainees on real client programs.' },
  { no: '4', title: 'Hands-On Tooling', text: 'Practical exposure to industry tools — Vehicle Simulator, Diagnostic Test Tool, SW Flashing Tool, Calibration Tool — not just theory.' },
]
export const campus = {
  studentGains: ['Structured training in real automotive embedded software domains — Testing, Development & R&D', 'Hands-on exposure to industry-grade tools: Vehicle Simulator, Diagnostic Test Tool, SW Flashing Tool', 'Mentorship from engineers with 10+ years of automotive domain experience', 'A clear career path from trainee to specialist, via the ODC or Deputation model'],
  waysToPartner: ['Campus hiring drives', 'Structured internship programs', 'Institute training tie-ups'],
  clientValue: ['Fresh talent trained specifically for automotive embedded software from day one', 'Continuous pipeline feeding both ODC teams and client Deputation requests', 'Reduces client ramp-up time — talent arrives pre-trained on domain fundamentals'],
}
export const navLinks = [
  { to: '/', label: 'Home' }, { to: '/services', label: 'Services' }, { to: '/expertise', label: 'Expertise' },
  { to: '/about', label: 'About' }, { to: '/careers', label: 'Careers' }, { to: '/contact', label: 'Contact' },
]
```

## `src/data/faq.js`

```js
// AEO/GEO answer content — concise, factual Q&A used both on-page and in FAQPage schema.
export const faqs = [
  { q: 'What does AUTO-CAN Solutions do?',
    a: 'AUTO-CAN Solutions is an automotive engineering and embedded software company founded in 2013 in Jaipur, India. It delivers Hardware-in-the-Loop (HiL) testing, embedded software stacks (BSW, CAN, LIN, UDS), test automation, embedded hardware, and R&D in AUTOSAR, ADAS, OTA and V2X for OEMs and Tier-1 suppliers.' },
  { q: 'Where is AUTO-CAN Solutions located?',
    a: 'AUTO-CAN Solutions is headquartered in Jaipur, Rajasthan, India, and operates offshore development centres in Pune, India. It serves clients across North America, Europe, Japan and the APAC region.' },
  { q: 'What engagement models does AUTO-CAN offer?',
    a: 'AUTO-CAN offers two models: an ODC (Offshore/On-site Development Centre) model with dedicated engineering pods, and a Deputation model where engineers are embedded directly at the client site. Commercial terms include Time & Material, Work Package, fixed-scope delivery, and risk–reward partnerships.' },
  { q: 'What automotive standards and technologies does AUTO-CAN specialize in?',
    a: 'AUTO-CAN specializes in MISRA C, Embedded Linux, CAN and FlexRay, plus next-generation focus areas including AUTOSAR architecture, ISO 26262 functional safety, Over-the-Air (OTA) updates, ADAS, Automotive Ethernet, automotive cybersecurity and V2X connectivity.' },
  { q: 'How quickly can AUTO-CAN deploy engineers?',
    a: 'AUTO-CAN maintains a 25–45% buffer bench of qualified engineers, enabling same-day resource deployment for on-demand client requirements.' },
  { q: 'Does AUTO-CAN work with colleges for hiring and training?',
    a: 'Yes. Through its Campus Connect program AUTO-CAN partners with colleges and institutes via campus hiring drives, structured internships and training tie-ups, training students in automotive embedded software from day one.' },
]
```

## `src/pages/Home.jsx`

```jsx
import { motion, useMotionValue, useScroll, useSpring, useTransform } from 'framer-motion'
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
import ParticleField from '../components/ParticleField'
import AnimatedHeading from '../components/AnimatedHeading'
import { fadeUp, scaleIn, staggerFast } from '../components/motionPresets'
import { company, stats, domains, services, timeline, differentiators } from '../data/site'
const marqueeItems = ['HiL Testing','AUTOSAR','ISO 26262','CAN · LIN · UDS','ADAS','Automotive Ethernet','OTA Updates','V2X','Cybersecurity','MISRA C']
function Hero3DStage() {
  const ref = useRef(null)
  const rx = useMotionValue(0.5); const ry = useMotionValue(0.5)
  const srx = useSpring(rx, { stiffness: 120, damping: 16 }); const sry = useSpring(ry, { stiffness: 120, damping: 16 })
  const rotateY = useTransform(srx, [0, 1], [-18, 18]); const rotateX = useTransform(sry, [0, 1], [14, -14])
  const onMove = (e) => { const r = ref.current.getBoundingClientRect(); rx.set((e.clientX - r.left) / r.width); ry.set((e.clientY - r.top) / r.height) }
  const reset = () => { rx.set(0.5); ry.set(0.5) }
  return (
    <div className="hero__visual" ref={ref} onMouseMove={onMove} onMouseLeave={reset}>
      <motion.div className="stage" style={{ rotateX, rotateY, transformStyle: 'preserve-3d' }} initial={{ opacity: 0, scale: 0.9 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        <motion.div className="hero__ring" animate={{ rotate: 360 }} transition={{ duration: 44, repeat: Infinity, ease: 'linear' }} style={{ transform: 'translateZ(-40px)' }} />
        <motion.div className="hero__ring r2" animate={{ rotate: -360 }} transition={{ duration: 32, repeat: Infinity, ease: 'linear' }} style={{ transform: 'translateZ(-20px)' }} />
        <motion.div className="stage__card" animate={{ y: [0, -14, 0] }} transition={{ duration: 6, repeat: Infinity, ease: 'easeInOut' }}>
          <img src="/hero-graphic.png" alt="AUTO-CAN — AI-driven automotive engineering" className="stage__img" />
          <span className="stage__shine" />
        </motion.div>
        <motion.div className="chip3d chip3d--1" style={{ transform: 'translateZ(70px)' }} animate={{ y: [0, -10, 0] }} transition={{ duration: 4, repeat: Infinity, ease: 'easeInOut' }}><span className="dot" /> <span><b>Same-day</b> deployment</span></motion.div>
        <motion.div className="chip3d chip3d--2" style={{ transform: 'translateZ(90px)' }} animate={{ y: [0, 12, 0] }} transition={{ duration: 4.6, repeat: Infinity, ease: 'easeInOut' }}><span>🛡️ <b>ISO 26262</b> safety</span></motion.div>
        <motion.div className="chip3d chip3d--3" style={{ transform: 'translateZ(55px)' }} animate={{ y: [0, -8, 0] }} transition={{ duration: 5.2, repeat: Infinity, ease: 'easeInOut' }}><span>⚡ <b>AUTOSAR</b> · ADAS</span></motion.div>
      </motion.div>
    </div>
  )
}
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <Page>
      <SEO seo={pageSeo.home} faqs={faqs} />
      <section className="hero" ref={heroRef}>
        <div className="hero__particles"><ParticleField density={70} /></div>
        <motion.div className="blob blob--blue" style={{ width: 420, height: 420, top: '-8%', left: '-6%' }} animate={{ x: [0, 40, 0], y: [0, 30, 0] }} transition={{ duration: 14, repeat: Infinity, ease: 'easeInOut' }} />
        <motion.div className="blob blob--orange" style={{ width: 360, height: 360, bottom: '-10%', right: '-4%' }} animate={{ x: [0, -30, 0], y: [0, -24, 0] }} transition={{ duration: 16, repeat: Infinity, ease: 'easeInOut' }} />
        <div className="container">
          <motion.div className="hero__inner" style={{ y: yContent, opacity }}>
            <div>
              <motion.span className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>{company.kicker}</motion.span>
              <AnimatedHeading className="hero__h1" segments={[{ text: 'Engineering the' }, { text: 'software', gradient: true }, { text: 'that moves the modern vehicle.' }]} />
              <motion.p className="hero__lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>{company.hero} From Hardware-in-the-Loop testing to AUTOSAR, ADAS and next-gen mobility — AUTO-CAN is the specialist partner behind production-ready embedded systems.</motion.p>
              <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.6 }}>
                <MagneticButton to="/services" className="btn btn-primary">Explore capabilities <span className="arrow">→</span></MagneticButton>
                <MagneticButton to="/contact" className="btn btn-ghost">Work with us</MagneticButton>
              </motion.div>
              <motion.div className="hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.7 }}>
                <div className="hero__meta-item"><div className="k">Since 2013</div><div className="l">Founded in Jaipur, India</div></div>
                <div className="hero__meta-item"><div className="k">10+ yrs</div><div className="l">Automotive embedded depth</div></div>
                <div className="hero__meta-item"><div className="k">Pune</div><div className="l">Delivery centres</div></div>
              </motion.div>
            </div>
            <Hero3DStage />
          </motion.div>
        </div>
        <motion.div className="hero__scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}><span>Scroll</span><span className="line" /></motion.div>
      </section>
      <div className="marquee">
        <motion.div className="marquee__track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>{[...marqueeItems, ...marqueeItems].map((m, i) => (<span className="marquee__item" key={i}>{m}</span>))}</motion.div>
      </div>
      <section className="section-sm"><div className="container">
        <RevealGroup className="grid grid-4 tilt-grid" variants={staggerFast}>{stats.map((s) => (
          <TiltCard className="stat card pulse-ring" intensity={14} key={s.label} variants={scaleIn}><div className="num"><CountUp to={s.value} suffix={s.suffix} /></div><div className="lbl">{s.label}</div></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section"><div className="container">
        <SectionHeader eyebrow="Domain Specialization" title='Specialized across <span class="gradient-text">three core domains</span>' lead="Automotive Testing · Development · R&D — a full-stack capability built one vertical at a time." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 54 }}>{domains.map((d) => (
          <TiltCard className="card icard" key={d.no} variants={fadeUp}><span className="domain-num">{d.no}</span><h3 className="icard__title">{d.title}</h3><ul className="pointlist">{d.points.map((p) => (<li key={p}><span className="badge-check">✓</span>{p}</li>))}</ul></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Core Services" title='End-to-end automotive <span class="gradient-text">embedded engineering</span>' lead="Off-the-shelf software stacks, purpose-built tooling, and validation frameworks that shorten your path to production." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 54 }}>{services.map((s) => (
          <TiltCard className="card icard" key={s.no} variants={fadeUp}><span className="card-num">{s.no}</span><h3 className="icard__title">{s.title}</h3><p className="icard__text">{s.text}</p></TiltCard>
        ))}</RevealGroup>
        <Reveal className="center" style={{ marginTop: 46 }}><MagneticButton to="/services" className="btn btn-ghost">See all services <span className="arrow">→</span></MagneticButton></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">The AUTO-CAN Journey</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>Building capability, <span className="gradient-text">one vertical at a time.</span></h2>
            <p className="section-lead">An organic, capability-led growth model — adding one specialized vertical at a time — became the hallmark of the company’s approach and the foundation for everything that followed.</p>
            <MagneticButton to="/about" className="btn btn-ghost" style={{ marginTop: 26 }}>Read our story <span className="arrow">→</span></MagneticButton>
          </Reveal>
          <Reveal><div className="timeline">{timeline.map((t) => (
            <div className="tl-item" key={t.year}><span className="tl-dot" /><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-text">{t.text}</div></div>
          ))}</div></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Why Clients Choose AUTO-CAN" title='A partner engineered for <span class="gradient-text">speed and trust</span>' />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 48 }}>{differentiators.map((d, i) => (
          <TiltCard className="card" key={d} variants={fadeUp}><span className="card-num">{String(i + 1).padStart(2, '0')}</span><p style={{ marginTop: 12, fontWeight: 500 }}>{d}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <FAQ items={faqs} />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Ready when you are</span>
          <h2 style={{ marginTop: 18 }}>Let’s put a proven engineering bench behind your program.</h2>
          <p>Flexible engagement models, 25–45% buffer capacity, and regulatory experience across North America, Europe, Japan and APAC.</p>
          <MagneticButton to="/contact" className="btn btn-primary" strength={0.5}>Start a conversation <span className="arrow">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
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
export default function Services() {
  return (
    <Page>
      <SEO seo={pageSeo.services} faqs={faqs} />
      <section className="page-hero"><div className="container">
        <Reveal><span className="eyebrow">Core Services</span></Reveal>
        <Reveal><h1>End-to-end automotive <span className="gradient-text">embedded software</span> & engineering.</h1></Reveal>
        <Reveal><p>Six service lines that cover the full lifecycle — from off-the-shelf software stacks and purpose-built tooling to Hardware-in-the-Loop validation and embedded hardware.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <RevealGroup className="grid grid-3 tilt-grid">{services.map((s) => (
          <TiltCard className="card icard" key={s.no} variants={fadeUp}><span className="card-num">{s.no}</span><h3 className="icard__title">{s.title}</h3><p className="icard__text">{s.text}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="How We Specialize" title='Three domains, <span class="gradient-text">one delivery bench</span>' lead="Every service maps to deep, production-proven expertise across testing, development and R&D." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 50 }}>{domains.map((d) => (
          <TiltCard className="card icard" key={d.no} variants={fadeUp}><span className="domain-num">{d.no}</span><h3 className="icard__title">{d.title}</h3><ul className="pointlist">{d.points.map((p) => <li key={p}><span className="badge-check">✓</span>{p}</li>)}</ul></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <FAQ items={faqs} />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Flexible engagement</span>
          <h2 style={{ marginTop: 18 }}>Delivery structured around your program.</h2>
          <div className="taglist" style={{ justifyContent: 'center', marginTop: 8, marginBottom: 30 }}>{engagementTerms.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          <MagneticButton to="/careers" className="btn btn-primary">See engagement models <span className="arrow">→</span></MagneticButton>
        </div></Reveal>
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
        <Reveal><span className="eyebrow">Domain Expertise & Standards</span></Reveal>
        <Reveal><h1>10+ years of <span className="gradient-text">technology depth.</span></h1></Reveal>
        <Reveal><p>From foundational, production-proven technologies to the next-generation systems shaping connected and autonomous mobility.</p></Reveal>
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
            <span className="model-tag" style={{ color: 'var(--orange-400)' }}>NEXT-GENERATION</span>
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

## `src/pages/About.jsx`

```jsx
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
        <Reveal><span className="eyebrow">Where It Began</span></Reveal>
        <Reveal><h1>A decade of engineering trust, <span className="gradient-text">one vertical at a time.</span></h1></Reveal>
        <Reveal><p>Incepted in {company.location.split(',')[0]} in {company.founded} as a specialist provider of Hardware-in-the-Loop (HiL) testing, AUTO-CAN steadily broadened its capabilities across the full automotive software development lifecycle.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 30 }}><div className="container">
        <div className="split tilt-grid">
          <Reveal>
            <h2 className="section-title">Company background</h2>
            <p className="section-lead">AUTO-CAN Solutions was established in {company.founded} with a clear mission: to bring specialized, high-quality engineering support to the automotive embedded systems industry.</p>
            <p className="section-lead" style={{ marginTop: 16 }}>The company started as a niche player in vehicle Hardware-in-the-Loop testing — a discipline critical to validating electronic control units (ECUs) before they reach production vehicles. From this focused beginning, it built deep domain expertise along the way.</p>
          </Reveal>
          <Reveal variants={scaleIn}><TiltCard className="card" intensity={12} style={{ padding: 40, textAlign: 'center' }}>
            <div className="tl-year" style={{ fontSize: '0.9rem' }}>YEAR OF INCEPTION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 800, fontSize: 'clamp(4rem,10vw,7rem)', lineHeight: 1 }} className="gradient-text"><CountUp to={2013} suffix="" duration={1800} /></div>
            <p style={{ color: 'var(--text-dim)', marginTop: 10 }}>{company.location}</p>
          </TiltCard></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <RevealGroup className="grid grid-4 tilt-grid" variants={staggerFast}>{stats.map((s) => (
          <TiltCard className="stat card pulse-ring" intensity={14} key={s.label} variants={scaleIn}><div className="num"><CountUp to={s.value} suffix={s.suffix} /></div><div className="lbl">{s.label}</div></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 20 }}><div className="container">
        <SectionHeader eyebrow="Growth Timeline" title='Building capability, <span class="gradient-text">one vertical at a time</span>' lead="A track record spanning more than a decade in the automotive embedded engineering domain." />
        <Reveal style={{ marginTop: 50, maxWidth: 760 }}><div className="timeline">{timeline.map((t) => (
          <div className="tl-item" key={t.year}><span className="tl-dot" /><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-text">{t.text}</div></div>
        ))}</div></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Business Model & Differentiators" title='Why clients choose <span class="gradient-text">AUTO-CAN</span>' />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 48 }}>{differentiators.map((d, i) => (
          <TiltCard className="card" key={d} variants={fadeUp}><span className="card-num">{String(i + 1).padStart(2, '0')}</span><p style={{ marginTop: 12, fontWeight: 500 }}>{d}</p></TiltCard>
        ))}</RevealGroup>
        <Reveal className="center" style={{ marginTop: 46 }}><MagneticButton to="/contact" className="btn btn-primary">Partner with us <span className="arrow">→</span></MagneticButton></Reveal>
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
import { fadeUp, scaleIn } from '../components/motionPresets'
import { engagementModels, training, campus } from '../data/site'
export default function Careers() {
  return (
    <Page>
      <SEO seo={pageSeo.careers} />
      <section className="page-hero"><div className="container">
        <Reveal><span className="eyebrow">Talent · Engagement · Campus Connect</span></Reveal>
        <Reveal><h1>Building talent, <span className="gradient-text">the AUTO-CAN way.</span></h1></Reveal>
        <Reveal><p>Structured training that turns fresh talent into automotive engineers — and flexible engagement models that put that talent to work on your programs.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <SectionHeader eyebrow="Engagement Models" title='Two ways to work with <span class="gradient-text">our talent</span>' lead="Built around client convenience and talent growth." />
        <div className="split tilt-grid" style={{ marginTop: 50 }}>{engagementModels.map((m) => (
          <Reveal key={m.tag}><TiltCard className="card" intensity={9} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <span className="model-tag">{m.tag}</span><h3 className="model-title">{m.title}</h3>
            <ul className="pointlist">{m.points.map((p) => <li key={p}><span className="badge-check">✓</span>{p}</li>)}</ul>
          </TiltCard></Reveal>
        ))}</div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Learning & Development" title='Structured training, <span class="gradient-text">real project readiness</span>' lead="All training, quality, and HR frameworks operate under AUTO-CAN Solutions — ensuring consistent standards across every engineering team." />
        <RevealGroup className="grid grid-2 tilt-grid" style={{ marginTop: 48 }}>{training.map((t) => (
          <TiltCard className="card icard" key={t.no} variants={fadeUp}><span className="card-num">{t.no.padStart(2, '0')}</span><h3 className="icard__title">{t.title}</h3><p className="icard__text">{t.text}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Campus Connect" title='For colleges & institutes — <span class="gradient-text">real automotive careers</span>' lead="Partner with us to open real automotive engineering careers for your students." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 48 }}>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">What students gain</h3><ul className="pointlist">{campus.studentGains.map((p) => <li key={p}><span className="badge-check">✓</span>{p}</li>)}</ul></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">Ways to partner</h3><ul className="pointlist">{campus.waysToPartner.map((p) => <li key={p}><span className="badge-check">✓</span>{p}</li>)}</ul></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">Why it matters for clients</h3><ul className="pointlist">{campus.clientValue.map((p) => <li key={p}><span className="badge-check">✓</span>{p}</li>)}</ul></TiltCard>
        </RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Industry-ready experts</span>
          <h2 style={{ marginTop: 18 }}>A talent pipeline built for automotive programs.</h2>
          <p>Fresh talent trained specifically for automotive embedded software from day one — with hands-on experience.</p>
          <MagneticButton to="/contact" className="btn btn-primary">Talk to us about talent <span className="arrow">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
```

## `src/pages/Contact.jsx`

```jsx
import { useState } from 'react'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal } from '../components/Section'
import MagneticButton from '../components/MagneticButton'
import { company, engagementTerms } from '../data/site'
export default function Contact() {
  const [sent, setSent] = useState(false)
  const handleSubmit = (e) => { e.preventDefault(); setSent(true) }
  return (
    <Page>
      <SEO seo={pageSeo.contact} />
      <section className="page-hero"><div className="container">
        <Reveal><span className="eyebrow">Let’s Work Together</span></Reveal>
        <Reveal><h1>Put a proven engineering bench <span className="gradient-text">behind your program.</span></h1></Reveal>
        <Reveal><p>Tell us about your automotive program and we’ll get back to you with the right engagement model and team.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 30 }}><div className="container">
        <div className="contact-grid">
          <Reveal className="contact-info">
            <div className="info-row"><span className="ico">✉️</span><div><div className="k">Email</div><div className="v">{company.email}</div></div></div>
            <div className="info-row"><span className="ico">📍</span><div><div className="k">Headquarters</div><div className="v">{company.location}</div></div></div>
            <div className="info-row"><span className="ico">🏭</span><div><div className="k">Delivery Centre</div><div className="v">{company.deliveryCentre}</div></div></div>
            <div className="info-row"><span className="ico">🤝</span><div><div className="k">Engagement models</div><div className="v">{engagementTerms.join(' · ')}</div></div></div>
            <div className="info-row"><span className="ico">🌐</span><div><div className="k">Compliance reach</div><div className="v">North America · Europe · Japan · APAC</div></div></div>
          </Reveal>
          <Reveal>
            <div className="card" style={{ padding: 32 }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="form-success">
                  <strong>Thank you!</strong> Your message has been captured. Our team will be in touch shortly.
                  <div style={{ marginTop: 14 }}><button className="btn btn-ghost" onClick={() => setSent(false)}>Send another</button></div>
                </motion.div>
              ) : (
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="field"><label htmlFor="name">Full name</label><input id="name" type="text" placeholder="Your name" required /></div>
                    <div className="field"><label htmlFor="company">Company</label><input id="company" type="text" placeholder="Organization" /></div>
                  </div>
                  <div className="form-row">
                    <div className="field"><label htmlFor="email">Work email</label><input id="email" type="email" placeholder="you@company.com" required /></div>
                    <div className="field"><label htmlFor="interest">I’m interested in</label>
                      <select id="interest" defaultValue="">
                        <option value="" disabled>Select…</option>
                        <option>Embedded software & tooling</option>
                        <option>HiL / Test automation</option>
                        <option>R&D — AUTOSAR / ADAS / OTA</option>
                        <option>ODC / Deputation talent</option>
                        <option>Campus Connect partnership</option>
                      </select>
                    </div>
                  </div>
                  <div className="field"><label htmlFor="message">Tell us about your program</label><textarea id="message" placeholder="A few lines about your project, scope and timeline…" required /></div>
                  <MagneticButton type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start' }} strength={0.5}>Send message <span className="arrow">→</span></MagneticButton>
                  <p style={{ color: 'var(--text-faint)', fontSize: '0.82rem' }}>This is a demo form — submissions are not sent anywhere. Wire it to your backend or an email service to go live.</p>
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

## `src/pages/NotFound.jsx`

```jsx
import { Link } from 'react-router-dom'
import Page from '../components/Page'
export default function NotFound() {
  return (
    <Page>
      <div className="container nf">
        <div>
          <h1 className="gradient-text">404</h1>
          <p style={{ color: 'var(--text-dim)', fontSize: '1.1rem', marginBottom: 26 }}>This route took a wrong turn off the proving ground.</p>
          <Link to="/" className="btn btn-primary">Back to home <span className="arrow">→</span></Link>
        </div>
      </div>
    </Page>
  )
}
```

## `src/components/Navbar.jsx`

```jsx
import { useEffect, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { navLinks } from '../data/site'
import './Navbar.css'
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })
  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll(); window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])
  useEffect(() => { setOpen(false) }, [location.pathname])
  return (
    <>
      <motion.header className={`nav ${scrolled ? 'nav--scrolled' : ''}`} initial={{ y: -80, opacity: 0 }} animate={{ y: 0, opacity: 1 }} transition={{ duration: 0.6, ease: [0.22, 1, 0.36, 1] }}>
        <div className="container nav__inner">
          <Link to="/" className="nav__brand" aria-label="AUTO-CAN Solutions home">
            <img src="/logo.png" alt="AUTO-CAN Solutions" className="nav__logo" />
            <span className="nav__brandtext">AUTO<span className="nav__dash">-</span>CAN</span>
          </Link>
          <nav className="nav__links">
            {navLinks.map((l) => (<NavLink key={l.to} to={l.to} className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`} end={l.to === '/'}>{l.label}</NavLink>))}
          </nav>
          <Link to="/contact" className="btn btn-primary nav__cta">Work With Us <span className="arrow">→</span></Link>
          <button className={`nav__burger ${open ? 'is-open' : ''}`} onClick={() => setOpen((o) => !o)} aria-label="Toggle menu"><span></span><span></span><span></span></button>
        </div>
        <motion.div className="nav__progress" style={{ scaleX: progress }} />
      </motion.header>
      <AnimatePresence>
        {open && (
          <motion.div className="mobile-menu" initial={{ opacity: 0, y: -12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.28 }}>
            {navLinks.map((l, i) => (<motion.div key={l.to} initial={{ opacity: 0, x: -18 }} animate={{ opacity: 1, x: 0 }} transition={{ delay: 0.05 * i }}><NavLink to={l.to} className="mobile-menu__link" end={l.to === '/'}>{l.label}</NavLink></motion.div>))}
            <Link to="/contact" className="btn btn-primary" style={{ marginTop: 8 }}>Work With Us <span className="arrow">→</span></Link>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  )
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
        <motion.div className="footer__cta" initial={{ opacity: 0, y: 30 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true, amount: 0.4 }} transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}>
          <span className="eyebrow">Let’s build together</span>
          <h2 className="footer__ctatitle">Ready to accelerate your <span className="gradient-text">automotive programs?</span></h2>
          <p className="footer__ctatext">Same-day resource deployment, a deep bench of subject-matter experts, and a decade of proven delivery — from HiL testing to AUTOSAR and next-gen mobility.</p>
          <Link to="/contact" className="btn btn-primary">Start a conversation <span className="arrow">→</span></Link>
        </motion.div>
        <div className="footer__grid">
          <div className="footer__brandcol">
            <div className="footer__brand"><img src="/logo.png" alt="AUTO-CAN Solutions" /><span>AUTO<span style={{ color: 'var(--orange-500)' }}>-</span>CAN</span></div>
            <p className="footer__tagline">{company.tagline}</p>
            <p className="footer__muted">Founded {company.founded} · {company.location}<br />Delivery centre · {company.deliveryCentre}</p>
          </div>
          <div className="footer__col"><h4>Navigate</h4>{navLinks.map((l) => (<Link key={l.to} to={l.to}>{l.label}</Link>))}</div>
          <div className="footer__col"><h4>Capabilities</h4><Link to="/services">Embedded SW Stacks</Link><Link to="/services">Test Automation</Link><Link to="/expertise">HiL &amp; V&amp;V</Link><Link to="/expertise">AUTOSAR &amp; ISO 26262</Link></div>
          <div className="footer__col"><h4>Engage</h4><Link to="/careers">ODC Model</Link><Link to="/careers">Deputation Model</Link><Link to="/careers">Campus Connect</Link><Link to="/contact">Contact</Link></div>
        </div>
        <div className="footer__bottom"><span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span><span className="footer__mono">Driven by AI · Powered by Innovation</span></div>
      </div>
    </footer>
  )
}
```

## `src/components/Section.jsx`

```jsx
import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from './motionPresets'
export function Reveal({ children, className = '', variants = fadeUp, ...rest }) {
  return (<motion.div variants={variants} initial="hidden" whileInView="show" viewport={viewport} className={className} {...rest}>{children}</motion.div>)
}
export function RevealGroup({ children, className = '', variants = stagger, ...rest }) {
  return (<motion.div variants={variants} initial="hidden" whileInView="show" viewport={viewport} className={className} {...rest}>{children}</motion.div>)
}
export function SectionHeader({ eyebrow, title, lead, align = 'left' }) {
  return (
    <Reveal className={`section-head ${align === 'center' ? 'center mx-auto' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      {lead && <p className="section-lead" style={align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>{lead}</p>}
    </Reveal>
  )
}
```

## `src/components/Page.jsx`

```jsx
import { motion } from 'framer-motion'
export default function Page({ children }) {
  return (<motion.div initial={{ opacity: 0, y: 16 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -12 }} transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}>{children}</motion.div>)
}
```

## `src/components/ScrollToTop.jsx`

```jsx
import { useEffect } from 'react'
import { useLocation } from 'react-router-dom'
export default function ScrollToTop() {
  const { pathname } = useLocation()
  useEffect(() => { window.scrollTo({ top: 0, behavior: 'auto' }) }, [pathname])
  return null
}
```

## `src/components/CursorGlow.jsx`

```jsx
import { useEffect } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'
export default function CursorGlow() {
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.5 })
  useEffect(() => {
    if (window.matchMedia('(pointer: coarse)').matches) return
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])
  return (<motion.div aria-hidden style={{ position: 'fixed', left: sx, top: sy, translateX: '-50%', translateY: '-50%', width: 460, height: 460, borderRadius: '50%', pointerEvents: 'none', zIndex: 0, mixBlendMode: 'screen', background: 'radial-gradient(circle, rgba(43,127,255,0.12), rgba(255,122,26,0.06) 40%, transparent 68%)', filter: 'blur(6px)' }} />)
}
```

## `src/components/CountUp.jsx`

```jsx
import { useEffect, useRef, useState } from 'react'
import { useInView } from 'framer-motion'
export default function CountUp({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(0)
  useEffect(() => {
    if (!inView) return
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
  }, [inView, to, duration])
  return (<span ref={ref}>{value}{suffix}</span>)
}
```

## `src/components/TiltCard.jsx`

```jsx
import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'
export default function TiltCard({ children, className = '', intensity = 12, glare = true, style, as: Tag = motion.div, ...rest }) {
  const ref = useRef(null)
  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)
  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })
  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity])
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])
  const glareBg = useTransform([glareX, glareY], ([x, y]) => `radial-gradient(220px circle at ${x} ${y}, rgba(255,255,255,0.16), transparent 60%)`)
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => { px.set(0.5); py.set(0.5) }
  return (
    <Tag ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={handleLeave}
      style={{ rotateX, rotateY, transformStyle: 'preserve-3d', transformPerspective: 900, ...style }}
      whileHover={{ z: 30 }} {...rest}>
      <div style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}>{children}</div>
      {glare && (<motion.span aria-hidden style={{ position: 'absolute', inset: 0, borderRadius: 'inherit', pointerEvents: 'none', background: glareBg }} />)}
    </Tag>
  )
}
```

## `src/components/MagneticButton.jsx`

```jsx
import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'
export default function MagneticButton({ children, to, className = '', strength = 0.4, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })
  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }
  const Comp = to ? motion(Link) : motion.button
  const linkProps = to ? { to } : {}
  return (<Comp ref={ref} className={className} onMouseMove={handleMove} onMouseLeave={reset} style={{ x: sx, y: sy }} {...linkProps} {...rest}>{children}</Comp>)
}
```

## `src/components/ParticleField.jsx`

```jsx
import { useEffect, useRef } from 'react'
export default function ParticleField({ density = 66, className = '', style }) {
  const canvasRef = useRef(null)
  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    let raf, w, h, dpr
    const mouse = { x: -9999, y: -9999 }
    let particles = []
    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width; h = rect.height
      canvas.width = w * dpr; canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      const count = Math.round((w * h) / 16000 * (density / 66))
      particles = Array.from({ length: Math.max(24, Math.min(count, 120)) }, () => ({
        x: Math.random() * w, y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35, vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6, c: Math.random() > 0.5 ? '43,127,255' : '255,122,26',
      }))
    }
    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1
        const dx = mouse.x - p.x, dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140) { p.x += dx * 0.0016 * (1 - dist / 140); p.y += dy * 0.0016 * (1 - dist / 140) }
        ctx.beginPath(); ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},0.9)`; ctx.fill()
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 118) {
            ctx.beginPath(); ctx.moveTo(p.x, p.y); ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(120,150,220,${0.14 * (1 - d / 118)})`; ctx.lineWidth = 1; ctx.stroke()
          }
        }
      }
      raf = requestAnimationFrame(draw)
    }
    const onMove = (e) => { const rect = canvas.getBoundingClientRect(); mouse.x = e.clientX - rect.left; mouse.y = e.clientY - rect.top }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }
    resize(); draw()
    window.addEventListener('resize', resize)
    window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    return () => { cancelAnimationFrame(raf); window.removeEventListener('resize', resize); window.removeEventListener('mousemove', onMove); canvas.removeEventListener('mouseleave', onLeave) }
  }, [density])
  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', display: 'block', ...style }} aria-hidden />
}
```

## `src/components/AnimatedHeading.jsx`

```jsx
import { motion } from 'framer-motion'
const container = { hidden: {}, show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } } }
const word = { hidden: { opacity: 0, y: '0.5em', rotateX: -60 }, show: { opacity: 1, y: '0em', rotateX: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }
export default function AnimatedHeading({ segments, className = '' }) {
  return (
    <motion.h1 className={className} variants={container} initial="hidden" animate="show" style={{ perspective: 800 }}>
      {segments.map((seg, si) => seg.text.split(' ').map((wtext, wi) => (
        <motion.span key={`${si}-${wi}`} variants={word} className={seg.gradient ? 'gradient-text' : undefined} style={{ display: 'inline-block', transformOrigin: 'bottom', marginRight: '0.28em' }}>{wtext}</motion.span>
      )))}
    </motion.h1>
  )
}
```

## `src/components/FAQ.jsx`

```jsx
import { useState } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { Reveal, SectionHeader } from './Section'
import './FAQ.css'
export default function FAQ({ items, eyebrow = 'FAQ', title = 'Frequently asked <span class="gradient-text">questions</span>', lead }) {
  const [open, setOpen] = useState(0)
  return (
    <section className="section" style={{ paddingTop: 0 }}>
      <div className="container">
        <SectionHeader eyebrow={eyebrow} title={title} lead={lead} />
        <Reveal className="faq" style={{ marginTop: 40 }}>
          {items.map((f, i) => (
            <div className={`faq__item ${open === i ? 'is-open' : ''}`} key={i}>
              <button className="faq__q" onClick={() => setOpen(open === i ? -1 : i)} aria-expanded={open === i}>
                <span>{f.q}</span><span className="faq__icon">{open === i ? '−' : '+'}</span>
              </button>
              <AnimatePresence initial={false}>
                {open === i && (
                  <motion.div className="faq__a" initial={{ height: 0, opacity: 0 }} animate={{ height: 'auto', opacity: 1 }} exit={{ height: 0, opacity: 0 }} transition={{ duration: 0.3, ease: [0.22, 1, 0.36, 1] }}>
                    <p>{f.a}</p>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          ))}
        </Reveal>
      </div>
    </section>
  )
}
```

## `src/components/motionPresets.js`

```js
export const fadeUp = { hidden: { opacity: 0, y: 32 }, show: { opacity: 1, y: 0, transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }
export const fadeIn = { hidden: { opacity: 0 }, show: { opacity: 1, transition: { duration: 0.8, ease: 'easeOut' } } }
export const scaleIn = { hidden: { opacity: 0, scale: 0.94 }, show: { opacity: 1, scale: 1, transition: { duration: 0.6, ease: [0.22, 1, 0.36, 1] } } }
export const stagger = { hidden: {}, show: { transition: { staggerChildren: 0.12, delayChildren: 0.05 } } }
export const staggerFast = { hidden: {}, show: { transition: { staggerChildren: 0.07 } } }
export const viewport = { once: true, amount: 0.25 }
```

## `src/components/Navbar.css`

```css
.nav {
  position: fixed;
  top: 0; left: 0; right: 0;
  z-index: 100;
  transition: background 0.35s ease, backdrop-filter 0.35s ease, border-color 0.35s ease;
  border-bottom: 1px solid transparent;
}
.nav--scrolled {
  background: rgba(7, 11, 22, 0.72);
  backdrop-filter: blur(16px) saturate(140%);
  border-bottom-color: var(--border);
}
.nav__inner {
  display: flex;
  align-items: center;
  justify-content: space-between;
  height: 74px;
  gap: 20px;
}
.nav__brand { display: flex; align-items: center; gap: 12px; }
.nav__logo {
  width: 42px; height: 42px;
  border-radius: 10px;
  object-fit: cover;
  box-shadow: 0 6px 18px -6px rgba(43,127,255,0.6);
}
.nav__brandtext {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 1.25rem;
  letter-spacing: 0.02em;
}
.nav__dash { color: var(--orange-500); }

.nav__links { display: flex; align-items: center; gap: 6px; }
.nav__link {
  position: relative;
  font-size: 0.94rem;
  font-weight: 500;
  color: var(--text-dim);
  padding: 9px 15px;
  border-radius: 100px;
  transition: color 0.25s ease, background 0.25s ease;
}
.nav__link:hover { color: var(--text); background: var(--surface); }
.nav__link.is-active { color: var(--text); }
.nav__link.is-active::after {
  content: '';
  position: absolute;
  bottom: 2px; left: 50%; transform: translateX(-50%);
  width: 18px; height: 3px; border-radius: 3px;
  background: var(--grad-brand);
}

.nav__cta { padding: 11px 20px; font-size: 0.9rem; }

.nav__progress {
  position: absolute;
  left: 0; bottom: 0;
  height: 2px;
  width: 100%;
  transform-origin: 0%;
  background: var(--grad-brand);
}

.nav__burger {
  display: none;
  flex-direction: column;
  gap: 5px;
  background: none;
  border: none;
  padding: 8px;
}
.nav__burger span {
  width: 24px; height: 2px; border-radius: 2px;
  background: var(--text);
  transition: transform 0.3s ease, opacity 0.3s ease;
}
.nav__burger.is-open span:nth-child(1) { transform: translateY(7px) rotate(45deg); }
.nav__burger.is-open span:nth-child(2) { opacity: 0; }
.nav__burger.is-open span:nth-child(3) { transform: translateY(-7px) rotate(-45deg); }

.mobile-menu {
  position: fixed;
  top: 74px; left: 0; right: 0;
  z-index: 99;
  display: flex;
  flex-direction: column;
  gap: 6px;
  padding: 20px 24px 28px;
  background: rgba(7, 11, 22, 0.96);
  backdrop-filter: blur(16px);
  border-bottom: 1px solid var(--border);
}
.mobile-menu__link {
  display: block;
  font-family: var(--font-display);
  font-weight: 600;
  font-size: 1.1rem;
  padding: 12px 4px;
  color: var(--text-dim);
  border-bottom: 1px solid var(--border);
}
.mobile-menu__link.is-active { color: var(--blue-400); }

@media (max-width: 900px) {
  .nav__links, .nav__cta { display: none; }
  .nav__burger { display: flex; }
}
```

## `src/components/Footer.css`

```css
.footer {
  position: relative;
  padding: 90px 0 34px;
  border-top: 1px solid var(--border);
  background: linear-gradient(180deg, transparent, rgba(11,17,32,0.7));
  overflow: hidden;
}
.footer__glow {
  position: absolute;
  top: -140px; left: 50%; transform: translateX(-50%);
  width: 720px; height: 320px;
  background: radial-gradient(closest-side, rgba(43,127,255,0.22), transparent);
  filter: blur(20px);
  pointer-events: none;
}

.footer__cta {
  position: relative;
  text-align: center;
  max-width: 720px;
  margin: 0 auto 80px;
}
.footer__ctatitle {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.8rem, 4vw, 2.9rem);
  line-height: 1.08;
  letter-spacing: -0.02em;
  margin: 20px 0 16px;
}
.footer__ctatext { color: var(--text-dim); margin-bottom: 30px; }

.footer__grid {
  display: grid;
  grid-template-columns: 1.6fr 1fr 1fr 1fr;
  gap: 40px;
  padding-bottom: 44px;
  border-bottom: 1px solid var(--border);
}
.footer__brand {
  display: flex; align-items: center; gap: 12px;
  font-family: var(--font-display); font-weight: 800; font-size: 1.3rem;
}
.footer__brand img { width: 40px; height: 40px; border-radius: 9px; }
.footer__tagline {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  letter-spacing: 0.05em;
  color: var(--blue-400);
  margin: 18px 0 14px;
}
.footer__muted { color: var(--text-faint); font-size: 0.9rem; line-height: 1.8; }

.footer__col h4 {
  font-family: var(--font-display);
  font-size: 0.82rem;
  text-transform: uppercase;
  letter-spacing: 0.14em;
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
.footer__col a:hover { color: var(--blue-400); transform: translateX(4px); }

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

@media (max-width: 860px) {
  .footer__grid { grid-template-columns: 1fr 1fr; gap: 30px; }
  .footer__brandcol { grid-column: 1 / -1; }
  .footer__bottom { flex-direction: column; text-align: center; }
}
```

## `src/components/FAQ.css`

```css
.faq { max-width: 820px; margin: 0 auto; display: flex; flex-direction: column; gap: 14px; }
.faq__item { border: 1px solid var(--border); border-radius: var(--radius-sm); background: var(--surface); overflow: hidden; transition: border-color 0.3s ease, background 0.3s ease; }
.faq__item.is-open { border-color: var(--blue-400); background: var(--surface-2); }
.faq__q { width: 100%; display: flex; align-items: center; justify-content: space-between; gap: 16px; padding: 20px 22px; background: none; border: none; color: var(--text); font-family: var(--font-display); font-weight: 600; font-size: 1.05rem; text-align: left; }
.faq__icon { flex: 0 0 auto; font-size: 1.5rem; color: var(--blue-400); line-height: 1; }
.faq__a { overflow: hidden; }
.faq__a p { padding: 0 22px 22px; color: var(--text-dim); margin: 0; }
```

## `src/styles/global.css`

```css
:root {
  --blue-500: #2b7fff; --blue-400: #4d95ff; --blue-600: #1a63e0;
  --orange-500: #ff7a1a; --orange-400: #ff9642; --orange-600: #e5620a;
  --bg: #070b16; --bg-2: #0b1120;
  --surface: rgba(255,255,255,0.03); --surface-2: rgba(255,255,255,0.05);
  --border: rgba(255,255,255,0.09); --border-strong: rgba(255,255,255,0.16);
  --text: #eef2fb; --text-dim: #9aa6bf; --text-faint: #63708c;
  --grad-brand: linear-gradient(100deg, var(--blue-500), var(--orange-500));
  --grad-brand-soft: linear-gradient(100deg, rgba(43,127,255,0.16), rgba(255,122,26,0.16));
  --glow-blue: 0 0 40px rgba(43,127,255,0.35); --glow-orange: 0 0 40px rgba(255,122,26,0.35);
  --shadow-card: 0 24px 60px -24px rgba(0,0,0,0.7);
  --radius: 18px; --radius-sm: 12px; --maxw: 1200px;
  --font-display: 'Sora', system-ui, sans-serif; --font-body: 'Inter', system-ui, sans-serif; --font-mono: 'JetBrains Mono', ui-monospace, monospace;
}
* { box-sizing: border-box; margin: 0; padding: 0; }
html { scroll-behavior: smooth; -webkit-text-size-adjust: 100%; }
body { font-family: var(--font-body); background: var(--bg); color: var(--text); line-height: 1.6; overflow-x: hidden; -webkit-font-smoothing: antialiased; text-rendering: optimizeLegibility; }
body::before { content: ''; position: fixed; inset: 0; z-index: -2; background: radial-gradient(60vw 60vw at 12% -5%, rgba(43,127,255,0.18), transparent 60%), radial-gradient(55vw 55vw at 95% 8%, rgba(255,122,26,0.14), transparent 55%), radial-gradient(45vw 45vw at 50% 110%, rgba(43,127,255,0.10), transparent 60%), var(--bg); }
body::after { content: ''; position: fixed; inset: 0; z-index: -1; background-image: linear-gradient(rgba(255,255,255,0.022) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.022) 1px, transparent 1px); background-size: 64px 64px; mask-image: radial-gradient(ellipse 80% 60% at 50% 0%, #000 40%, transparent 100%); pointer-events: none; }
a { color: inherit; text-decoration: none; }
img { display: block; max-width: 100%; }
button { font-family: inherit; cursor: pointer; }
ul { list-style: none; }
::selection { background: rgba(255,122,26,0.35); color: #fff; }
::-webkit-scrollbar { width: 11px; }
::-webkit-scrollbar-track { background: var(--bg); }
::-webkit-scrollbar-thumb { background: #1c2740; border-radius: 20px; border: 3px solid var(--bg); }
::-webkit-scrollbar-thumb:hover { background: #2a3a5e; }
.container { width: 100%; max-width: var(--maxw); margin: 0 auto; padding: 0 24px; }
.section { padding: 110px 0; position: relative; }
.section-sm { padding: 72px 0; }
.eyebrow { display: inline-flex; align-items: center; gap: 8px; font-family: var(--font-mono); font-size: 12px; letter-spacing: 0.22em; text-transform: uppercase; color: var(--blue-400); padding: 7px 14px; border: 1px solid var(--border); border-radius: 100px; background: var(--surface); backdrop-filter: blur(8px); }
.eyebrow::before { content: ''; width: 6px; height: 6px; border-radius: 50%; background: var(--orange-500); box-shadow: 0 0 10px var(--orange-500); }
.section-title { font-family: var(--font-display); font-weight: 800; font-size: clamp(2rem, 4.4vw, 3.4rem); line-height: 1.05; letter-spacing: -0.02em; margin: 22px 0 0; }
.section-lead { color: var(--text-dim); font-size: clamp(1rem, 1.5vw, 1.18rem); max-width: 640px; margin-top: 18px; }
.gradient-text { background: var(--grad-brand); -webkit-background-clip: text; background-clip: text; color: transparent; }
.btn { display: inline-flex; align-items: center; gap: 10px; font-family: var(--font-display); font-weight: 600; font-size: 0.95rem; padding: 14px 26px; border-radius: 100px; border: 1px solid transparent; transition: transform 0.25s ease, box-shadow 0.25s ease, background 0.25s ease; will-change: transform; }
.btn-primary { background: var(--grad-brand); color: #fff; box-shadow: 0 10px 30px -10px rgba(43,127,255,0.7); }
.btn-primary:hover { transform: translateY(-2px); box-shadow: 0 16px 40px -12px rgba(255,122,26,0.6); }
.btn-ghost { background: var(--surface); border-color: var(--border-strong); color: var(--text); backdrop-filter: blur(8px); }
.btn-ghost:hover { transform: translateY(-2px); border-color: var(--blue-400); background: var(--surface-2); }
.btn .arrow { transition: transform 0.25s ease; }
.btn:hover .arrow { transform: translateX(4px); }
.card { position: relative; background: linear-gradient(180deg, rgba(255,255,255,0.045), rgba(255,255,255,0.015)); border: 1px solid var(--border); border-radius: var(--radius); padding: 30px; transition: border-color 0.3s ease, box-shadow 0.3s ease; will-change: transform; }
.card::before { content: ''; position: absolute; inset: 0; border-radius: inherit; padding: 1px; background: var(--grad-brand); -webkit-mask: linear-gradient(#000 0 0) content-box, linear-gradient(#000 0 0); -webkit-mask-composite: xor; mask-composite: exclude; opacity: 0; transition: opacity 0.35s ease; pointer-events: none; }
.card:hover { box-shadow: var(--shadow-card); }
.card:hover::before { opacity: 1; }
.card-num { font-family: var(--font-mono); font-size: 0.85rem; color: var(--orange-400); letter-spacing: 0.1em; }
.grid { display: grid; gap: 22px; }
.grid-2 { grid-template-columns: repeat(2, 1fr); }
.grid-3 { grid-template-columns: repeat(3, 1fr); }
.grid-4 { grid-template-columns: repeat(4, 1fr); }
@media (max-width: 980px) { .grid-3, .grid-4 { grid-template-columns: repeat(2, 1fr); } }
@media (max-width: 640px) { .grid-2, .grid-3, .grid-4 { grid-template-columns: 1fr; } .section { padding: 78px 0; } }
.center { text-align: center; }
.mx-auto { margin-left: auto; margin-right: auto; }
.badge-check { display: inline-flex; align-items: center; justify-content: center; width: 22px; height: 22px; flex: 0 0 22px; border-radius: 50%; background: var(--grad-brand-soft); border: 1px solid var(--border); color: var(--blue-400); }
```

## `src/styles/pages.css`

```css
/* ============================================================
   Shared page + section styling
   ============================================================ */

/* ---- Page hero (inner pages) ---- */
.page-hero {
  padding: 168px 0 60px;
  position: relative;
}
.page-hero .eyebrow { margin-bottom: 22px; }
.page-hero h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 5.6vw, 4.4rem);
  line-height: 1.02;
  letter-spacing: -0.03em;
  max-width: 15ch;
}
.page-hero p {
  color: var(--text-dim);
  font-size: clamp(1.02rem, 1.6vw, 1.22rem);
  max-width: 640px;
  margin-top: 22px;
}

/* ---- Home hero ---- */
.hero {
  position: relative;
  min-height: 100svh;
  display: flex;
  align-items: center;
  padding: 120px 0 60px;
  overflow: hidden;
}
.hero__inner {
  display: grid;
  grid-template-columns: 1.05fr 0.95fr;
  gap: 40px;
  align-items: center;
  width: 100%;
}
.hero h1 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.6rem, 6vw, 5rem);
  line-height: 1.0;
  letter-spacing: -0.035em;
}
.hero__lead {
  color: var(--text-dim);
  font-size: clamp(1.05rem, 1.7vw, 1.3rem);
  max-width: 540px;
  margin: 26px 0 34px;
}
.hero__actions { display: flex; gap: 14px; flex-wrap: wrap; }
.hero__meta {
  display: flex; gap: 28px; flex-wrap: wrap;
  margin-top: 44px; padding-top: 26px;
  border-top: 1px solid var(--border);
}
.hero__meta-item .k {
  font-family: var(--font-display);
  font-weight: 800; font-size: 1.6rem;
  background: var(--grad-brand);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.hero__meta-item .l { color: var(--text-faint); font-size: 0.82rem; }

.hero__visual { position: relative; display: flex; justify-content: center; align-items: center; }
.hero__ring {
  position: absolute;
  width: 118%; aspect-ratio: 1;
  border-radius: 50%;
  border: 1px dashed rgba(43,127,255,0.25);
}
.hero__ring.r2 { width: 92%; border-color: rgba(255,122,26,0.22); }
.hero__img {
  position: relative;
  width: 100%;
  border-radius: 24px;
  filter: drop-shadow(0 30px 60px rgba(0,0,0,0.55));
}
.hero__badge {
  position: absolute;
  display: flex; align-items: center; gap: 10px;
  padding: 12px 16px;
  background: rgba(11,17,32,0.82);
  border: 1px solid var(--border-strong);
  border-radius: 14px;
  backdrop-filter: blur(10px);
  box-shadow: var(--shadow-card);
  font-size: 0.85rem;
}
.hero__badge .dot { width: 9px; height: 9px; border-radius: 50%; background: #38e08a; box-shadow: 0 0 10px #38e08a; }
.hero__badge b { font-family: var(--font-display); }
.hero__badge--tl { top: 6%; left: -4%; }
.hero__badge--br { bottom: 8%; right: -3%; }

.hero__scroll {
  position: absolute;
  bottom: 26px; left: 50%; transform: translateX(-50%);
  display: flex; flex-direction: column; align-items: center; gap: 8px;
  color: var(--text-faint); font-size: 0.72rem;
  font-family: var(--font-mono); letter-spacing: 0.2em; text-transform: uppercase;
}
.hero__scroll .line { width: 1px; height: 40px; background: linear-gradient(var(--blue-500), transparent); }

/* Marquee logos strip */
.marquee {
  border-top: 1px solid var(--border);
  border-bottom: 1px solid var(--border);
  padding: 22px 0;
  overflow: hidden;
  background: var(--surface);
}
.marquee__track { display: flex; gap: 60px; white-space: nowrap; width: max-content; }
.marquee__item {
  font-family: var(--font-mono);
  font-size: 0.95rem;
  letter-spacing: 0.08em;
  color: var(--text-faint);
  display: inline-flex; align-items: center; gap: 12px;
}
.marquee__item::before { content: '◆'; color: var(--orange-500); font-size: 0.7rem; }

/* ---- Stat band ---- */
.stat {
  text-align: center;
  padding: 30px 20px;
}
.stat .num {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(2.4rem, 5vw, 3.4rem);
  line-height: 1;
  background: var(--grad-brand);
  -webkit-background-clip: text; background-clip: text; color: transparent;
}
.stat .lbl { color: var(--text-dim); font-size: 0.94rem; margin-top: 10px; }

/* ---- Domain / service card content ---- */
.pointlist { margin-top: 18px; display: flex; flex-direction: column; gap: 11px; }
.pointlist li { display: flex; gap: 11px; align-items: flex-start; color: var(--text-dim); font-size: 0.96rem; }

.icard { display: flex; flex-direction: column; height: 100%; }
.icard__title {
  font-family: var(--font-display);
  font-weight: 700;
  font-size: 1.3rem;
  margin-top: 14px;
}
.icard__text { color: var(--text-dim); margin-top: 10px; font-size: 0.97rem; }

.domain-num {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: 2.6rem;
  line-height: 1;
  color: transparent;
  -webkit-text-stroke: 1.4px rgba(255,255,255,0.22);
}

/* ---- Timeline ---- */
.timeline { position: relative; margin-top: 20px; }
.timeline::before {
  content: '';
  position: absolute;
  left: 26px; top: 8px; bottom: 8px;
  width: 2px;
  background: linear-gradient(var(--blue-500), var(--orange-500));
}
.tl-item {
  position: relative;
  padding: 0 0 40px 78px;
}
.tl-item:last-child { padding-bottom: 0; }
.tl-dot {
  position: absolute;
  left: 16px; top: 4px;
  width: 22px; height: 22px;
  border-radius: 50%;
  background: var(--bg-2);
  border: 2px solid var(--blue-400);
  display: grid; place-items: center;
}
.tl-dot::after { content: ''; width: 8px; height: 8px; border-radius: 50%; background: var(--grad-brand); }
.tl-year {
  font-family: var(--font-mono);
  font-size: 0.85rem;
  color: var(--orange-400);
  letter-spacing: 0.08em;
}
.tl-title { font-family: var(--font-display); font-weight: 700; font-size: 1.3rem; margin: 4px 0 6px; }
.tl-text { color: var(--text-dim); font-size: 0.97rem; max-width: 620px; }

/* ---- Split feature ---- */
.split { display: grid; grid-template-columns: 1fr 1fr; gap: 28px; align-items: stretch; }
.expertise-note { color: var(--text-faint); font-size: 0.9rem; margin-top: 18px; font-style: italic; }

.taglist { display: flex; flex-wrap: wrap; gap: 10px; margin-top: 18px; }
.tag {
  font-family: var(--font-mono);
  font-size: 0.82rem;
  padding: 8px 14px;
  border-radius: 100px;
  border: 1px solid var(--border);
  background: var(--surface);
  color: var(--text-dim);
  transition: border-color 0.25s ease, color 0.25s ease, transform 0.25s ease;
}
.tag:hover { border-color: var(--blue-400); color: var(--text); transform: translateY(-2px); }

/* ---- Engagement model cards ---- */
.model-tag {
  font-family: var(--font-mono);
  font-size: 0.78rem;
  letter-spacing: 0.16em;
  color: var(--blue-400);
  padding: 6px 12px;
  border: 1px solid var(--border);
  border-radius: 8px;
  align-self: flex-start;
}
.model-title { font-family: var(--font-display); font-weight: 700; font-size: 1.45rem; margin: 16px 0 4px; }

/* ---- CTA band ---- */
.cta-band {
  position: relative;
  border-radius: 28px;
  padding: 64px 48px;
  text-align: center;
  overflow: hidden;
  border: 1px solid var(--border-strong);
  background:
    radial-gradient(60% 120% at 20% 0%, rgba(43,127,255,0.22), transparent),
    radial-gradient(60% 120% at 90% 100%, rgba(255,122,26,0.20), transparent),
    linear-gradient(180deg, rgba(255,255,255,0.04), rgba(255,255,255,0.01));
}
.cta-band h2 {
  font-family: var(--font-display);
  font-weight: 800;
  font-size: clamp(1.9rem, 4vw, 3rem);
  letter-spacing: -0.02em;
  max-width: 18ch; margin: 0 auto 16px;
}
.cta-band p { color: var(--text-dim); max-width: 560px; margin: 0 auto 30px; }

/* ---- Contact ---- */
.contact-grid { display: grid; grid-template-columns: 1fr 1fr; gap: 40px; align-items: start; }
.contact-info { display: flex; flex-direction: column; gap: 18px; }
.info-row {
  display: flex; gap: 16px; align-items: flex-start;
  padding: 22px; border: 1px solid var(--border); border-radius: var(--radius);
  background: var(--surface);
}
.info-row .ico {
  width: 44px; height: 44px; flex: 0 0 44px; border-radius: 12px;
  display: grid; place-items: center;
  background: var(--grad-brand-soft); border: 1px solid var(--border);
  font-size: 1.2rem;
}
.info-row .k { font-family: var(--font-display); font-weight: 600; }
.info-row .v { color: var(--text-dim); font-size: 0.94rem; }

.form { display: flex; flex-direction: column; gap: 16px; }
.form-row { display: grid; grid-template-columns: 1fr 1fr; gap: 16px; }
.field label {
  display: block;
  font-size: 0.82rem; color: var(--text-dim);
  margin-bottom: 7px; font-weight: 500;
}
.field input, .field select, .field textarea {
  width: 100%;
  padding: 13px 15px;
  background: var(--bg-2);
  border: 1px solid var(--border);
  border-radius: var(--radius-sm);
  color: var(--text);
  font-family: inherit;
  font-size: 0.95rem;
  transition: border-color 0.25s ease, box-shadow 0.25s ease;
}
.field input:focus, .field select:focus, .field textarea:focus {
  outline: none;
  border-color: var(--blue-500);
  box-shadow: 0 0 0 3px rgba(43,127,255,0.18);
}
.field textarea { resize: vertical; min-height: 130px; }
.form-success {
  padding: 16px; border-radius: var(--radius-sm);
  background: rgba(56,224,138,0.12); border: 1px solid rgba(56,224,138,0.4);
  color: #7ff0b3; font-size: 0.94rem;
}

/* ---- 404 ---- */
.nf { min-height: 70vh; display: grid; place-items: center; text-align: center; padding: 120px 0; }
.nf h1 { font-family: var(--font-display); font-weight: 800; font-size: clamp(4rem, 16vw, 10rem); line-height: 1; }

@media (max-width: 900px) {
  .hero__inner { grid-template-columns: 1fr; }
  .hero__visual { order: -1; max-width: 460px; margin: 0 auto; }
  .split, .contact-grid { grid-template-columns: 1fr; }
  .hero__badge--tl { left: 2%; }
  .hero__badge--br { right: 2%; }
}
@media (max-width: 560px) {
  .form-row { grid-template-columns: 1fr; }
  .cta-band { padding: 44px 24px; }
}

/* 3D + advanced motion layer */
.tilt-grid { perspective: 1400px; }
.hero__particles { position: absolute; inset: 0; z-index: 0; pointer-events: none; opacity: 0.9; mask-image: radial-gradient(ellipse 90% 80% at 50% 40%, #000 55%, transparent 100%); }
.hero .container { position: relative; z-index: 2; }
.blob { position: absolute; border-radius: 50%; filter: blur(60px); opacity: 0.55; z-index: 0; pointer-events: none; }
.blob--blue { background: radial-gradient(circle, rgba(43,127,255,0.5), transparent 70%); }
.blob--orange { background: radial-gradient(circle, rgba(255,122,26,0.45), transparent 70%); }
.stage { position: relative; width: 100%; aspect-ratio: 1 / 0.9; transform-style: preserve-3d; perspective: 1200px; }
.stage__card { position: absolute; inset: 8%; border-radius: 26px; transform-style: preserve-3d; border: 1px solid var(--border-strong); background: linear-gradient(160deg, rgba(255,255,255,0.08), rgba(255,255,255,0.02)); box-shadow: 0 40px 90px -30px rgba(0,0,0,0.75), inset 0 1px 0 rgba(255,255,255,0.1); overflow: hidden; backdrop-filter: blur(4px); }
.stage__img { position: absolute; inset: 0; width: 100%; height: 100%; object-fit: contain; padding: 12%; transform: translateZ(50px); }
.stage__shine { position: absolute; inset: 0; background: linear-gradient(115deg, transparent 30%, rgba(255,255,255,0.18) 48%, transparent 66%); transform: translateX(-100%); animation: shine 5.5s ease-in-out infinite; }
@keyframes shine { 0%,100% { transform: translateX(-120%); } 55% { transform: translateX(120%); } }
.chip3d { position: absolute; display: flex; align-items: center; gap: 9px; padding: 11px 15px; border-radius: 14px; background: rgba(9,14,26,0.86); border: 1px solid var(--border-strong); box-shadow: var(--shadow-card); backdrop-filter: blur(10px); font-size: 0.82rem; white-space: nowrap; transform-style: preserve-3d; }
.chip3d b { font-family: var(--font-display); }
.chip3d .dot { width: 9px; height: 9px; border-radius: 50%; background: #38e08a; box-shadow: 0 0 10px #38e08a; }
.chip3d--1 { top: 2%; left: -6%; }
.chip3d--2 { bottom: 6%; right: -8%; }
.chip3d--3 { top: 46%; right: -12%; }
.reveal-3d { transform-style: preserve-3d; }
.pulse-ring { position: relative; }
.pulse-ring::after { content: ''; position: absolute; inset: -1px; border-radius: inherit; background: var(--grad-brand); filter: blur(16px); opacity: 0; z-index: -1; transition: opacity 0.4s ease; }
.pulse-ring:hover::after { opacity: 0.4; }
.marquee { position: relative; }
.marquee::before, .marquee::after { content: ''; position: absolute; top: 0; bottom: 0; width: 120px; z-index: 2; pointer-events: none; }
.marquee::before { left: 0; background: linear-gradient(90deg, var(--bg), transparent); }
.marquee::after { right: 0; background: linear-gradient(270deg, var(--bg), transparent); }
.stat .num { display: inline-block; transform-style: preserve-3d; }
@media (max-width: 900px) { .chip3d--3 { display: none; } .chip3d--1 { left: 0; } .chip3d--2 { right: 0; } }
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

Sitemap: https://www.auto-can.in/sitemap.xml
```

## `public/sitemap.xml`

```xml
<?xml version="1.0" encoding="UTF-8"?>
<urlset xmlns="http://www.sitemaps.org/schemas/sitemap/0.9">
  <url><loc>https://www.auto-can.in/</loc><lastmod>2026-07-11</lastmod><changefreq>weekly</changefreq><priority>1.0</priority></url>
  <url><loc>https://www.auto-can.in/services</loc><lastmod>2026-07-11</lastmod><changefreq>monthly</changefreq><priority>0.9</priority></url>
  <url><loc>https://www.auto-can.in/expertise</loc><lastmod>2026-07-11</lastmod><changefreq>monthly</changefreq><priority>0.8</priority></url>
  <url><loc>https://www.auto-can.in/about</loc><lastmod>2026-07-11</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.auto-can.in/careers</loc><lastmod>2026-07-11</lastmod><changefreq>monthly</changefreq><priority>0.7</priority></url>
  <url><loc>https://www.auto-can.in/contact</loc><lastmod>2026-07-11</lastmod><changefreq>yearly</changefreq><priority>0.6</priority></url>
</urlset>
```

## `public/llms.txt`

```text
# AUTO-CAN Solutions

> Automotive engineering & embedded software company founded in 2013 in Jaipur, India,
> with offshore development centres in Pune. Specializes in Hardware-in-the-Loop (HiL)
> testing, embedded software stacks (BSW, CAN, LIN, UDS), test automation, embedded
> hardware, and R&D across AUTOSAR, ISO 26262, ADAS, Automotive Ethernet, OTA and V2X.
> Serves OEMs and Tier-1 suppliers across North America, Europe, Japan and APAC.

## Key facts
- Founded: 2013 (Jaipur, Rajasthan, India)
- Delivery centres: Pune, India
- Core domains: Automotive Testing, Development, R&D
- Engagement models: ODC (Offshore/On-site Development Centre) and Deputation
- Buffer bench: 25-45% for same-day resource deployment
- Standards: MISRA C, ISO 26262, AUTOSAR; protocols CAN, LIN, UDS, FlexRay, Automotive Ethernet
- Contact: info@auto-can.in

## Pages
- Home: https://www.auto-can.in/
- Services: https://www.auto-can.in/services
- Expertise & standards: https://www.auto-can.in/expertise
- About & history: https://www.auto-can.in/about
- Careers, engagement models & Campus Connect: https://www.auto-can.in/careers
- Contact: https://www.auto-can.in/contact
```

## `public/site.webmanifest`

```json
{
  "name": "AUTO-CAN Solutions",
  "short_name": "AUTO-CAN",
  "description": "Automotive engineering & embedded software since 2013.",
  "start_url": "/",
  "display": "standalone",
  "background_color": "#070b16",
  "theme_color": "#070b16",
  "icons": [
    { "src": "/logo.png", "sizes": "512x512", "type": "image/png" }
  ]
}
```
