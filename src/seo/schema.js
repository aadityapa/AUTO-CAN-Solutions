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
