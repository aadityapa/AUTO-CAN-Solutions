import { motion, useScroll, useTransform } from 'framer-motion'
import { useRef } from 'react'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { faqs } from '../data/faq'
import FAQ from '../components/FAQ'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import CountUp from '../components/CountUp'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import AnimatedHeading from '../components/AnimatedHeading'
import { fadeUp, scaleIn, staggerFast } from '../components/motionPresets'
import { HeroVisual, BootConsole } from '../components/HeroKit'
import DataRiver from '../components/DataRiver'
import { Manifesto, VModel, TwinSync } from '../components/XpSections'
import { company, stats, domains, services, timeline, differentiators } from '../data/site'
const marqueeItems = ['HiL Testing','AUTOSAR','ISO 26262','CAN · LIN · UDS','ADAS','Automotive Ethernet','OTA Updates','V2X','Cybersecurity','MISRA C']
export default function Home() {
  const heroRef = useRef(null)
  const { scrollYProgress } = useScroll({ target: heroRef, offset: ['start start', 'end start'] })
  const yContent = useTransform(scrollYProgress, [0, 1], [0, 120])
  const opacity = useTransform(scrollYProgress, [0, 0.8], [1, 0])
  return (
    <Page>
      <SEO seo={pageSeo.home} faqs={faqs} />
      <section className="hero" ref={heroRef}>
        <div className="container">
          <motion.div className="hero__inner" style={{ y: yContent, opacity }}>
            <div>
              <motion.span className="eyebrow" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.6 }}>{company.kicker}</motion.span>
              <AnimatedHeading className="hero__h1" segments={[{ text: 'Engineering the' }, { text: 'software', gradient: true }, { text: 'that moves the modern vehicle.' }]} />
              <motion.p className="hero__lead" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 0.9, duration: 0.8 }}>{company.hero} From Hardware-in-the-Loop testing to AUTOSAR, ADAS and next-gen mobility — AUTO-CAN is the specialist partner behind production-ready embedded systems.</motion.p>
              <BootConsole />
              <motion.div className="hero__actions" initial={{ opacity: 0, y: 20 }} animate={{ opacity: 1, y: 0 }} transition={{ delay: 1.05, duration: 0.6 }}>
                <MagneticButton to="/services" className="btn btn-primary">Explore capabilities <span className="arrow">→</span></MagneticButton>
                <MagneticButton to="/contact" className="btn btn-ghost">Work with us</MagneticButton>
              </motion.div>
              <motion.div className="hero__meta" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.2, duration: 0.7 }}>
                <div className="hero__meta-item"><div className="k">Since 2013</div><div className="l">Founded in Jaipur, India</div></div>
                <div className="hero__meta-item"><div className="k">10+ yrs</div><div className="l">Automotive embedded depth</div></div>
                <div className="hero__meta-item"><div className="k">2 Cities</div><div className="l">Jaipur · Pune</div></div>
              </motion.div>
            </div>
            <HeroVisual />
          </motion.div>
        </div>
        <motion.div className="hero__scroll" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.5 }}><span>Scroll</span><span className="line" /></motion.div>
      </section>
      <div className="marquee">
        <motion.div className="marquee__track" animate={{ x: ['0%', '-50%'] }} transition={{ duration: 22, repeat: Infinity, ease: 'linear' }}>{[...marqueeItems, ...marqueeItems].map((m, i) => (<span className="marquee__item" key={i}>{m}</span>))}</motion.div>
      </div>
      <section className="section-sm"><div className="container">
        <RevealGroup className="stat-strip" variants={staggerFast}>{stats.map((s) => (
          <motion.div className="stat" key={s.label} variants={fadeUp}><div className="num"><CountUp to={s.value} suffix={s.suffix} /></div><div className="lbl">{s.label}</div></motion.div>
        ))}</RevealGroup>
      </div></section>
      <Manifesto />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Domain Specialization" title='Specialized across <span class="gradient-text">three core domains</span>' lead="Automotive Testing · Development · R&D — a full-stack capability built one vertical at a time." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 54 }}>{domains.map((d) => (
          <TiltCard className="card icard" key={d.no} variants={fadeUp}><span className="domain-num">{d.no}</span><h3 className="icard__title">{d.title}</h3><ul className="pointlist">{d.points.map((p) => (<li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>))}</ul></TiltCard>
        ))}</RevealGroup>
      </div></section>
      <VModel />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Core Services" title='End-to-end automotive <span class="gradient-text">embedded engineering</span>' lead="Off-the-shelf software stacks, purpose-built tooling, and validation frameworks that shorten your path to production." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 54 }}>{services.map((s) => (
          <TiltCard className="card icard" key={s.no} variants={fadeUp}><span className="card-num">{s.no}</span><h3 className="icard__title">{s.title}</h3><p className="icard__text">{s.text}</p></TiltCard>
        ))}</RevealGroup>
        <Reveal className="center" style={{ marginTop: 46 }}><MagneticButton to="/services" className="btn btn-ghost">See all services <span className="arrow">→</span></MagneticButton></Reveal>
      </div></section>
      <TwinSync />
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">The AUTO-CAN Journey</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>Building capability, <span className="gradient-text">one vertical at a time.</span></h2>
            <p className="section-lead">An organic, capability-led growth model — adding one specialized vertical at a time — became the hallmark of the company’s approach and the foundation for everything that followed.</p>
            <MagneticButton to="/about" className="btn btn-ghost" style={{ marginTop: 26 }}>Read our story <span className="arrow">→</span></MagneticButton>
          </Reveal>
          <Reveal><div className="timeline">{timeline.map((t) => (
            <div className="tl-item" key={t.year}><span className="tl-dot" /><div className="tl-year">{t.year}</div><div className="tl-title">{t.title}</div><div className="tl-text">{t.text}</div></div>
          ))}</div></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Why Clients Choose AUTO-CAN" title='A partner engineered for <span class="gradient-text">speed and trust</span>' />
        <RevealGroup className="why-list" style={{ marginTop: 30 }}>{differentiators.map((d, i) => (
          <motion.div className="why-item" key={d} variants={fadeUp}><span className="no">{String(i + 1).padStart(2, '0')}</span><p>{d}</p></motion.div>
        ))}</RevealGroup>
      </div></section>
      <FAQ items={faqs} />
      <DataRiver />
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Ready when you are</span>
          <h2 style={{ marginTop: 18 }}>Let’s put a proven engineering bench behind your program.</h2>
          <p>Flexible engagement models, 25–45% buffer capacity, and a decade of proven automotive embedded delivery.</p>
          <MagneticButton to="/contact" className="btn btn-primary" strength={0.5}>Start a conversation <span className="arrow">→</span></MagneticButton>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
