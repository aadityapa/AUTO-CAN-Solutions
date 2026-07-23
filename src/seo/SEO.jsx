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
