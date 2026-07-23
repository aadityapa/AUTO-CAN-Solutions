# AUTO-CAN Solutions — Website

A modern, animated, **SEO-optimised** marketing website for **AUTO-CAN Solutions** (Automotive Engineering & Embedded Software), built with **React + Vite + Framer Motion** and **statically prerendered** for search engines and AI answer engines.

## Tech stack

- **React 18** + **Vite 5**
- **vite-react-ssg** — static prerendering: every route ships real HTML (great for Google + AI crawlers that don't run JavaScript)
- **React Router 6** — multi-page routing
- **Framer Motion 11** — 3D tilt cards, magnetic buttons, cursor glow, particle field, scroll reveals, animated counters
- **JSON-LD structured data** + per-page meta via the SSG `Head`

## Getting started

Requires **Node.js 18+**.

```bash
cd autocan-website
npm install      # installs deps incl. vite-react-ssg
npm run dev      # dev server → http://localhost:5173
npm run build    # static prerender → /dist (index.html, services.html, about.html, ...)
npm run preview  # preview the production build
```

Deploy the `dist/` folder to any static host (Netlify, Vercel, Cloudflare Pages, etc.). Because pages are prerendered, crawlers get full HTML immediately.

## SEO / GEO / AEO — what's built in

**Technical SEO**
- Static prerendered HTML for every route (real content, not an empty `<div id="root">`)
- Unique `<title>`, meta description, keywords, and canonical URL per page
- Open Graph + Twitter Card tags for rich social sharing
- `robots.txt`, `sitemap.xml`, `site.webmanifest`, favicons
- Fast, mobile-first, accessible semantic markup

**Structured data (JSON-LD)** — on every page:
- `Organization`, `WebSite`, `ProfessionalService` (site-wide)
- `WebPage` + `BreadcrumbList` (per page)
- `FAQPage` (Home + Services) → eligible for Google FAQ rich results

**AEO — Answer Engine Optimization**
- Concise, factual FAQ Q&A (`src/data/faq.js`) rendered on-page AND in FAQPage schema, so Google, ChatGPT, Perplexity and Gemini can quote direct answers.

**GEO — Generative Engine Optimization**
- `public/llms.txt` — a clean, factual summary of the company for AI crawlers
- `robots.txt` explicitly allows GPTBot, PerplexityBot, Google-Extended, ClaudeBot, Applebot-Extended, etc.
- Entity-rich copy and `knowsAbout` schema so AI engines understand what AUTO-CAN is.

## ⚠️ Before you go live — do these (one-time)

Open **`src/seo/site.config.js`** and set:
1. `SITE_URL` → your real domain (currently `https://www.auto-can.in`). Then update the same domain in `public/robots.txt`, `public/sitemap.xml`, and `public/llms.txt`.
2. `telephone`, `hq.streetAddress`, `hq.postalCode` → your real contact details (unlocks full LocalBusiness rich results).
3. `sameAs` → your real LinkedIn / social profile URLs.

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
├── components/         # TiltCard, MagneticButton, CursorGlow, ParticleField, FAQ, ...
├── data/               # site.js (content), faq.js
├── pages/              # Home, Services, Expertise, About, Careers, Contact, NotFound
└── styles/             # global.css, pages.css
public/                 # logo, hero image, robots.txt, sitemap.xml, llms.txt, site.webmanifest
```

The contact form is a front-end demo — connect it to a backend or email service to receive submissions.
