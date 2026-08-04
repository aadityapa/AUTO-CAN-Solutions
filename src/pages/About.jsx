import { motion } from 'framer-motion'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import CountUp from '../components/CountUp'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { fadeUp, scaleIn, staggerFast } from '../components/motionPresets'
import { company, timeline, stats, differentiators } from '../data/site'
export default function About() {
  return (
    <Page>
      <SEO seo={pageSeo.about} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Where It Began</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>A decade of engineering trust, <span className="gradient-text">one vertical at a time.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Incepted in {company.location.split(',')[0]} in {company.founded} as a specialist provider of Hardware-in-the-Loop (HiL) testing, AUTO-CAN steadily broadened its capabilities across the full automotive software development lifecycle.</p></div>
      </div></section>
      <section className="section" style={{ paddingTop: 30 }}><div className="container">
        <div className="split tilt-grid">
          <div className="hero-in" style={{ animationDelay: '0.34s' }}>
            <h2 className="section-title">Company background</h2>
            <p className="section-lead">{company.intro}</p>
            <p className="section-lead" style={{ marginTop: 16 }}>The company started as a niche player in vehicle Hardware-in-the-Loop testing — a discipline critical to validating electronic control units (ECUs) before they reach production vehicles. From this focused beginning, it built deep domain expertise along the way.</p>
          </div>
          <Reveal variants={scaleIn}><TiltCard className="card" intensity={12} style={{ padding: 40, textAlign: 'center' }}>
            <div className="tl-year" style={{ fontSize: '0.9rem' }}>YEAR OF INCEPTION</div>
            <div style={{ fontFamily: 'var(--font-display)', fontWeight: 700, fontSize: 'clamp(4rem,10vw,7rem)', lineHeight: 1 }} className="gradient-text"><CountUp to={2013} suffix="" duration={1800} /></div>
            <p style={{ color: 'var(--text-dim)', marginTop: 10 }}>{company.location}</p>
          </TiltCard></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <RevealGroup className="stat-strip" variants={staggerFast}>{stats.map((s) => (
          <motion.div className="stat" key={s.label} variants={fadeUp}><div className="num"><CountUp to={s.value} suffix={s.suffix} /></div><div className="lbl">{s.label}</div></motion.div>
        ))}</RevealGroup>
      </div></section>
      <section className="mission-band" aria-label="Mission">
        <div className="container center">
          <motion.span
            className="eyebrow"
            initial={{ opacity: 0 }}
            whileInView={{ opacity: 1 }}
            viewport={{ once: true, amount: 0.6 }}
          >Our Mission</motion.span>
          <motion.blockquote
            className="mission-quote"
            initial="hidden"
            whileInView="show"
            viewport={{ once: true, amount: 0.5 }}
            variants={{ hidden: {}, show: { transition: { staggerChildren: 0.045 } } }}
          >
            {company.mission.split(' ').map((w, i) => (
              <motion.span
                key={i}
                variants={{ hidden: { opacity: 0.12, filter: 'blur(4px)' }, show: { opacity: 1, filter: 'blur(0px)', transition: { duration: 0.5 } } }}
                className={/wrong/.test(w) ? 'gradient-text' : undefined}
              >{w} </motion.span>
            ))}
          </motion.blockquote>
        </div>
      </section>
      <section className="section" style={{ paddingTop: 20 }}><div className="container">
        <SectionHeader eyebrow="Growth Timeline" title='Building capability, <span class="gradient-text">one vertical at a time</span>' lead="A track record spanning more than a decade in the automotive embedded engineering domain." />
        <Reveal style={{ marginTop: 50, maxWidth: 760 }}><div className="timeline">{timeline.map((t) => (
          <div className="tl-item" key={t.year}><span className="tl-dot" /><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-text">{t.text}</div></div>
        ))}</div></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Business Model & Differentiators" title='Why clients choose <span class="gradient-text">AUTO-CAN</span>' />
        <RevealGroup className="why-list" style={{ marginTop: 30 }}>{differentiators.map((d, i) => (
          <motion.div className="why-item" key={d} variants={fadeUp}><span className="no">{String(i + 1).padStart(2, '0')}</span><p>{d}</p></motion.div>
        ))}</RevealGroup>
        <Reveal className="center" style={{ marginTop: 46 }}><MagneticButton to="/contact" className="btn btn-primary">Partner with us <span className="arrow" aria-hidden="true">→</span></MagneticButton></Reveal>
      </div></section>
    </Page>
  )
}
