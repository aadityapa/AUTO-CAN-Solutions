# AUTO-CAN Solutions — SEO / GEO / AEO Guide

Honest expectation first: **no one can guarantee the #1 spot on Google.** Rankings depend on competition, your domain's age and authority (backlinks), and Google's algorithm — none of which any code can force. What this site *does* is remove every technical barrier and give search engines and AI answer engines everything they need to rank and quote you. The rest is the off-page work below.

---

## ✅ Already done for you (in the code)

- Static prerendering (real HTML per page) — works for Google **and** AI crawlers
- Unique title, description, canonical, Open Graph & Twitter tags per page
- JSON-LD: Organization, WebSite, ProfessionalService, WebPage, BreadcrumbList, FAQPage, ItemList + Service
- FAQ content for answer engines (AEO)
- `robots.txt` (allows AI bots), `sitemap.xml` (generated at build, with real `lastmod` dates), `llms.txt`, web manifest
- Fast, mobile-first, semantic markup

---

## 🔧 One-time setup (do these first)

1. **Confirm the domain.** `SITE_URL` in `src/seo/site.config.js` is the source of truth and is
   already set to `https://www.auto-can-solution.com`. If it changes, mirror it in
   `public/robots.txt` and `public/llms.txt` — `sitemap.xml` is generated from `SITE_URL` and
   needs no edit (editing it by hand does nothing; it is overwritten on every build).
2. **Activate the contact form.** FormSubmit needs a one-time email confirmation before any
   enquiry is delivered, and the form's mailto fallback means a dead form still looks healthy.
   Send a test enquiry and confirm it arrives.
3. **Add contact details** in `src/seo/site.config.js` (`telephone`, `hq.streetAddress`,
   `hq.postalCode`, `sameAs`). Leave anything unconfirmed blank rather than approximate —
   inaccurate business details work against you.
4. Rebuild: `npm run build` and deploy `dist/`.

## 📈 Off-page checklist (this is what actually moves rankings)

1. **Google Search Console** — verify your domain, submit `sitemap.xml`, request indexing. (search.google.com/search-console)
2. **Bing Webmaster Tools** — same; Bing also feeds ChatGPT search. (bing.com/webmasters)
3. **Google Business Profile** — create/claim it for "Jaipur" + "Pune" (huge for local + map results). (business.google.com)
4. **Backlinks** — the single biggest ranking factor. Get listed in: automotive supplier directories, LinkedIn company page, Clutch/GoodFirms, industry associations, partner/client sites, guest articles.
5. **Consistent NAP** — Name, Address, Phone identical everywhere online.
6. **Content cadence** — publish articles/case studies on HiL testing, AUTOSAR, ISO 26262. Fresh, keyword-focused pages rank for long-tail searches and get quoted by AI engines.
7. **Reviews** — Google/LinkedIn reviews build trust signals.
8. **Core Web Vitals** — already fast; keep images optimised as you add them.

## 🤖 For AI answer engines (ChatGPT, Perplexity, Gemini, Claude)

- They favour **clear, factual, well-structured** content — your FAQ + `llms.txt` + schema deliver this.
- Being cited on **third-party sites** (Wikipedia-style authority, directories, news) makes AI engines mention you.
- Keep facts consistent across the web so models learn your entity confidently.

## 🧪 Verify your setup

- Rich results: search.google.com/test/rich-results (paste your URL → should detect Organization + FAQ)
- Social preview: opengraph.xyz
- Robots/sitemap: yourdomain.com/robots.txt and /sitemap.xml
- AI summary: `yourdomain.com/llms.txt`
