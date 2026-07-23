import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { motion } from 'framer-motion'
import { fadeUp, scaleIn } from '../components/motionPresets'
import { engagementModels, training, campus, peoplePayroll } from '../data/site'
export default function Careers() {
  return (
    <Page>
      <SEO seo={pageSeo.careers} />
      <section className="page-hero"><div className="container">
        <Reveal><span className="eyebrow">Talent · Engagement · Campus Connect</span></Reveal>
        <Reveal><h1>Building talent, <span className="gradient-text">the AUTO-CAN way.</span></h1></Reveal>
        <Reveal><p>Open roles across Testing, Development, and R&D — for freshers and experienced engineers alike. Structured training turns fresh talent into automotive engineers, and flexible engagement models put that talent to work on your programs.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <SectionHeader eyebrow="Engagement Models" title='Two ways to work with <span class="gradient-text">our talent</span>' lead="Built around client convenience and talent growth." />
        <div className="split tilt-grid" style={{ marginTop: 50 }}>{engagementModels.map((m) => (
          <Reveal key={m.tag}><TiltCard className="card" intensity={9} style={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
            <span className="model-tag">{m.tag}</span><h3 className="model-title">{m.title}</h3>
            <ul className="pointlist">{m.points.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul>
          </TiltCard></Reveal>
        ))}</div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Learning & Development" title='Structured training, <span class="gradient-text">real project readiness</span>' lead="All training, quality, and HR frameworks operate under AUTO-CAN Solutions — ensuring consistent standards across every engineering team." />
        <RevealGroup className="grid grid-2 tilt-grid" style={{ marginTop: 48 }}>{training.map((t) => (
          <TiltCard className="card icard" key={t.no} variants={fadeUp}><span className="card-num">{t.no.padStart(2, '0')}</span><h3 className="icard__title">{t.title}</h3><p className="icard__text">{t.text}</p></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <section className="section pp-section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow={peoplePayroll.eyebrow} title='Built to support <span class="gradient-text">our people</span>, not just our projects' lead={peoplePayroll.lead} />
        <div className="pp-grid" style={{ marginTop: 50 }}>
          <motion.span
            className="pp-rail"
            aria-hidden="true"
            initial={{ scaleX: 0 }}
            whileInView={{ scaleX: 1 }}
            viewport={{ once: true, amount: 0.4 }}
            transition={{ duration: 1.1, ease: [0.22, 1, 0.36, 1] }}
          />
          {peoplePayroll.items.map((p, i) => (
            <motion.div
              className="pp-card"
              key={p.no}
              initial={{ opacity: 0, y: 44, rotateX: -8 }}
              whileInView={{ opacity: 1, y: 0, rotateX: 0 }}
              viewport={{ once: true, amount: 0.35 }}
              transition={{ delay: i * 0.14, duration: 0.65, ease: [0.22, 1, 0.36, 1] }}
            >
              <motion.span
                className="pp-card__dot"
                initial={{ scale: 0 }}
                whileInView={{ scale: 1 }}
                viewport={{ once: true }}
                transition={{ delay: 0.3 + i * 0.14, type: 'spring', stiffness: 260, damping: 14 }}
              >{p.no}</motion.span>
              <h3 className="icard__title" style={{ marginTop: 18 }}>{p.title}</h3>
              <p className="icard__text">{p.text}</p>
            </motion.div>
          ))}
        </div>
        <Reveal><p className="pp-closing">{peoplePayroll.closing}</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Campus Connect" title='For colleges & institutes — <span class="gradient-text">real automotive careers</span>' lead="Partner with us to open real automotive engineering careers for your students." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 48 }}>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">What students gain</h3><ul className="pointlist">{campus.studentGains.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">Ways to partner</h3><ul className="pointlist">{campus.waysToPartner.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp} style={{ height: '100%' }}><h3 className="icard__title">Why it matters for clients</h3><ul className="pointlist">{campus.clientValue.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}</ul></TiltCard>
        </RevealGroup>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Industry-ready experts</span>
          <h2 style={{ marginTop: 18 }}>A talent pipeline built for automotive programs.</h2>
          <p>Fresh talent trained specifically for automotive embedded software from day one — with hands-on experience.</p>
          <MagneticButton to="/contact" className="btn btn-primary">Talk to us about talent <span className="arrow">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
