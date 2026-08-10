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
