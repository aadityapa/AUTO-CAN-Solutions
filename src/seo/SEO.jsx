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
