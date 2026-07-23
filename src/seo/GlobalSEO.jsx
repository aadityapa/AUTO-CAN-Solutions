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
