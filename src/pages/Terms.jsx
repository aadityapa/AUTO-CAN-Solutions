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
