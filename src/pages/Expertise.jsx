import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import { fadeUp } from '../components/motionPresets'
import { expertise } from '../data/site'
export default function Expertise() {
  return (
    <Page>
      <SEO seo={pageSeo.expertise} />
      <section className="page-hero"><div className="container">
        <Reveal><span className="eyebrow">Domain Expertise & Standards</span></Reveal>
        <Reveal><h1>10+ years of <span className="gradient-text">technology depth.</span></h1></Reveal>
        <Reveal><p>From foundational, production-proven technologies to the next-generation systems shaping connected and autonomous mobility.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 40 }}><div className="container">
        <div className="split tilt-grid">
          <Reveal><TiltCard className="card" intensity={9} style={{ height: '100%' }}>
            <span className="model-tag">FOUNDATIONAL</span>
            <h2 className="model-title">{expertise.foundational.title}</h2>
            <p className="expertise-note">{expertise.foundational.note}</p>
            <div className="taglist">{expertise.foundational.items.map((i) => <span className="tag" key={i}>{i}</span>)}</div>
          </TiltCard></Reveal>
          <Reveal><TiltCard className="card" intensity={9} style={{ height: '100%' }}>
            <span className="model-tag" style={{ color: 'var(--violet-300)' }}>NEXT-GENERATION</span>
            <h2 className="model-title">{expertise.nextGen.title}</h2>
            <p className="expertise-note">{expertise.nextGen.note}</p>
            <div className="taglist">{expertise.nextGen.items.map((i) => <span className="tag" key={i}>{i}</span>)}</div>
          </TiltCard></Reveal>
        </div>
      </div></section>
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Test Case Repository" title='Validation coverage from <span class="gradient-text">classic to connected</span>' lead="A purpose-built test automation framework and repository spanning traditional and modern automotive systems." />
        <RevealGroup className="grid grid-2 tilt-grid" style={{ marginTop: 46 }}>
          <TiltCard className="card" intensity={9} variants={fadeUp}><h3 className="icard__title">Traditional systems</h3><div className="taglist">{['EMS','BCM','Lighting','HVAC','Body Electronics'].map((t) => <span className="tag" key={t}>{t}</span>)}</div></TiltCard>
          <TiltCard className="card" intensity={9} variants={fadeUp}><h3 className="icard__title">Modern systems</h3><div className="taglist">{['BMS','Infotainment','Connectivity','ADAS','Telematics'].map((t) => <span className="tag" key={t}>{t}</span>)}</div></TiltCard>
        </RevealGroup>
      </div></section>
    </Page>
  )
}
