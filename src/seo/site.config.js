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
