import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { faqs } from '../data/faq'
import FAQ from '../components/FAQ'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { fadeUp, scaleIn } from '../components/motionPresets'
import { services, domains, engagementTerms } from '../data/site'
import { serviceDiagrams } from '../components/ServiceDiagrams'
import { serviceSchema } from '../seo/schema'
export default function Services() {
  return (
    <Page>
      <SEO seo={pageSeo.services} faqs={faqs} extraNodes={[serviceSchema(services)]} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Core Services</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>End-to-end automotive <span className="gradient-text">embedded software</span> & engineering.</h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Six service lines that cover the full lifecycle — from off-the-shelf software stacks and purpose-built tooling to Hardware-in-the-Loop validation and embedded hardware.</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }} aria-labelledby="service-lines"><div className="container">
        <h2 id="service-lines" className="sr-only">Our six service lines</h2>
        <RevealGroup className="grid grid-3 tilt-grid">{services.map((s) => (
          <TiltCard className="card icard" key={s.no} variants={fadeUp}>{serviceDiagrams[s.no]}<span className="card-num">{s.no}</span><h3 className="icard__title">{s.title}</h3><p className="icard__text">{s.text}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="How We Specialize" title='Three domains, <span class="gradient-text">one delivery bench</span>' lead="Every service maps to deep, production-proven expertise across testing, development and R&D." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 50 }}>{domains.map((d) => (
          <TiltCard className="card icard" key={d.no} variants={fadeUp}><span className="domain-num">{d.no}</span><h3 className="icard__title">{d.title}</h3><ul className="pointlist">{d.points.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <FAQ items={faqs} />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Flexible engagement</span>
          <h2 style={{ marginTop: 18 }}>Delivery structured around your program.</h2>
          <div className="taglist" style={{ justifyContent: 'center', marginTop: 8, marginBottom: 30 }}>{engagementTerms.map((t) => <span className="tag" key={t}>{t}</span>)}</div>
          <MagneticButton to="/careers" className="btn btn-primary">See engagement models <span className="arrow" aria-hidden="true">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
