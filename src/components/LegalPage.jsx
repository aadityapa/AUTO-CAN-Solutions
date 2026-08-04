import Page from './Page'
import SEO from '../seo/SEO'
import { legalMeta } from '../data/legal'

/**
 * Shared layout for Privacy Policy / Terms & Conditions.
 * Reading-first: quiet background, sticky section navigation,
 * editorial typography, minimal animation.
 */
export default function LegalPage({ seo, eyebrow, title, sections }) {
  return (
    <Page>
      <SEO seo={seo} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">{eyebrow}</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>{title}</h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p className="legal__updated">Last updated · {legalMeta.updated}</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 20 }}><div className="container">
        <div className="legal">
          <nav className="legal__toc" aria-label={`${title} sections`}>
            {sections.map((s) => (
              <a key={s.id} href={`#${s.id}`}>{s.title}</a>
            ))}
          </nav>
          <div className="legal__body">
            <p className="legal__note">{legalMeta.reviewNote}</p>
            {sections.map((s) => (
              <section className="legal__section" id={s.id} key={s.id}>
                <h2>{s.title}</h2>
                {s.body?.map((p, i) => <p key={i}>{p}</p>)}
                {s.list && <ul>{s.list.map((li) => <li key={li}>{li}</li>)}</ul>}
                {s.after?.map((p, i) => <p key={i}>{p}</p>)}
              </section>
            ))}
          </div>
        </div>
      </div></section>
    </Page>
  )
}
