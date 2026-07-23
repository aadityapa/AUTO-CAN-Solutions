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
