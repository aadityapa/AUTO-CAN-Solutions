import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal, RevealGroup, SectionHeader } from '../components/Section'
import TiltCard from '../components/TiltCard'
import MagneticButton from '../components/MagneticButton'
import { fadeUp, scaleIn } from '../components/motionPresets'
import {
  trainingIntro, trainingDomains, learningStages, gatingRule,
  automotive, linux, android, ivi, ai,
  evaluationGates, hardwareMap, toolMap, roadmaps,
} from '../data/training'

const JUMP_LINKS = [
  { href: '#structure', label: 'Program structure' },
  { href: '#automotive', label: 'Automotive Embedded' },
  { href: '#software', label: 'Linux & Android' },
  { href: '#ai', label: 'Artificial Intelligence' },
  { href: '#evaluation', label: 'Evaluation' },
  { href: '#roadmap', label: 'Roadmap' },
]

/* ── Small building blocks ─────────────────────────────────────────── */

/** An ordered sequence drawn as connected steps. Wraps on narrow screens. */
function Flow({ steps, optional = [], label, numbered = false }) {
  return (
    <ol className={`tr-flow${numbered ? ' tr-flow--numbered' : ''}`} aria-label={label}>
      {steps.map((s, i) => (
        <li key={s} className={`tr-flow__step${optional.includes(s) ? ' is-optional' : ''}`}>
          {numbered && <span className="tr-flow__n">{String(i + 1).padStart(2, '0')}</span>}
          <span>{s}{optional.includes(s) && <span className="tr-opt"> (optional)</span>}</span>
        </li>
      ))}
    </ol>
  )
}

/**
 * Semantic table that restacks into labelled rows on phones, so wide
 * curricula stay readable without sideways scrolling.
 */
function DataTable({ caption, columns, rows }) {
  return (
    <div className="tr-table-wrap">
      <table className="tr-table">
        <caption className="sr-only">{caption}</caption>
        <thead>
          <tr>{columns.map((c) => <th key={c.key} scope="col">{c.label}</th>)}</tr>
        </thead>
        <tbody>
          {rows.map((r, i) => (
            <tr key={i}>
              {columns.map((c, j) => {
                const Cell = j === 0 ? 'th' : 'td'
                return (
                  <Cell key={c.key} scope={j === 0 ? 'row' : undefined} data-label={c.label}>
                    {c.render ? c.render(r) : r[c.key]}
                  </Cell>
                )
              })}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  )
}

function Chips({ items, label }) {
  return (
    <ul className="taglist" aria-label={label}>
      {items.map((t) => <li key={t} className="tag">{t}</li>)}
    </ul>
  )
}

function CheckList({ items }) {
  return (
    <ul className="pointlist">
      {items.map((p) => <li key={p}><span className="badge-check" aria-hidden="true">✓</span>{p}</li>)}
    </ul>
  )
}

function DomainBanner({ no, eyebrow, title, lead }) {
  return (
    <Reveal className="tr-domain-banner">
      <span className="domain-num" aria-hidden="true">{no}</span>
      <div>
        <span className="eyebrow">{eyebrow}</span>
        <h2 className="section-title">{title}</h2>
        <p className="section-lead">{lead}</p>
      </div>
    </Reveal>
  )
}

function SubHead({ children }) {
  return <h3 className="tr-subhead">{children}</h3>
}

/* ── Page ──────────────────────────────────────────────────────────── */

export default function Training() {
  const optionalName = (r) => (
    <>{r.module}{r.optional && <span className="tr-opt"> (optional)</span>}</>
  )

  return (
    <Page>
      <SEO seo={pageSeo.training} />

      {/* Hero */}
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">{trainingIntro.eyebrow}</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>From fundamentals to <span className="gradient-text">project-ready engineers.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>{trainingIntro.lead}</p></div>
        <nav className="hero-in tr-jump" style={{ animationDelay: '0.36s' }} aria-label="On this page">
          {JUMP_LINKS.map((l) => <a key={l.href} href={l.href} className="tag">{l.label}</a>)}
        </nav>
      </div></section>

      {/* Program structure */}
      <section id="structure" className="section tr-anchor" style={{ paddingTop: 40 }}><div className="container">
        <SectionHeader eyebrow="Program Structure" title='Three training <span class="gradient-text">domains</span>' lead="Each domain follows the same structure: foundation modules, then Developer or Tester specialization, then hands-on practicals and evaluation." />
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 48 }}>
          {trainingDomains.map((d) => (
            <TiltCard key={d.id} className="card" intensity={8} variants={fadeUp} style={{ height: '100%' }}>
              <span className="card-num">{d.no}</span>
              <h3 className="icard__title"><a href={`#${d.id}`} className="tr-cardlink">{d.title}</a></h3>
              <Chips items={d.topics} label={`${d.title} topics`} />
            </TiltCard>
          ))}
        </RevealGroup>

        <div style={{ marginTop: 80 }}>
          <SectionHeader eyebrow="Learning Flow" title='One common <span class="gradient-text">training architecture</span>' />
          <Reveal style={{ marginTop: 40 }}>
            <ol className="tr-stages">
              {learningStages.map((s, i) => (
                <li key={s.stage} className="tr-stage">
                  <span className="tr-stage__dot" aria-hidden="true">{i + 1}</span>
                  <span className="model-tag">{s.stage.toUpperCase()}</span>
                  <strong className="tr-stage__title">{s.title}</strong>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal><p className="tr-note"><strong>Gating rule —</strong> {gatingRule}</p></Reveal>
        </div>
      </div></section>

      {/* Domain 01 — Automotive Embedded */}
      <section id="automotive" className="section tr-anchor" style={{ paddingTop: 0 }}><div className="container">
        <DomainBanner no="01" eyebrow="Domain 01" title={<>Automotive <span className="gradient-text">Embedded</span></>} lead="Foundation modules, a Developer track, a Tester track and practical training on evaluation boards." />

        <SubHead>Foundation modules — common to both tracks</SubHead>
        <p className="tr-muted">Mandatory before specialization.</p>
        <Reveal>
          <DataTable
            caption="Automotive Embedded foundation modules"
            columns={[
              { key: 'module', label: 'Module', render: optionalName },
              { key: 'purpose', label: 'Purpose' },
              { key: 'used', label: 'Where used' },
            ]}
            rows={automotive.foundation}
          />
        </Reveal>
        <Reveal className="tr-pattern">
          <span className="tr-muted">Every module is taught as</span>
          <Flow steps={automotive.teachingPattern} label="How each automotive module is taught" />
        </Reveal>

        <SubHead>Developer track vs Tester track</SubHead>
        <p className="tr-muted">Both tracks share the same foundation modules and the same evaluation gate before specialization.</p>
        <div className="split tr-tracks">
          <Reveal className="card tr-track">
            <span className="model-tag">DEVELOPER TRACK</span>
            <h4 className="model-title">Embedded C → AUTOSAR → Drivers</h4>
            <CheckList items={automotive.developer.summary} />
            <h5 className="tr-minihead">Learning sequence</h5>
            <Flow steps={automotive.developer.sequence} numbered label="Developer learning sequence" />
            <h5 className="tr-minihead">Peripheral drivers implemented on evaluation boards</h5>
            <Chips items={automotive.developer.peripherals} label="Peripheral drivers" />
          </Reveal>
          <Reveal className="card tr-track">
            <span className="model-tag">TESTER TRACK</span>
            <h4 className="model-title">Modular progression · per-module gate</h4>
            <CheckList items={automotive.tester.summary} />
            <h5 className="tr-minihead">Testing lifecycle</h5>
            <Flow steps={automotive.tester.lifecycle} numbered label="Testing lifecycle" />
          </Reveal>
        </div>

        <div className="split tr-tracks">
          <Reveal>
            <h5 className="tr-minihead">Developer workflow</h5>
            <DataTable
              caption="Automotive developer workflow"
              columns={[{ key: 'stage', label: 'Workflow stage' }, { key: 'activity', label: 'Activity' }]}
              rows={automotive.developer.workflow}
            />
          </Reveal>
          <Reveal>
            <h5 className="tr-minihead">Tester focus areas</h5>
            <DataTable
              caption="Automotive tester focus areas"
              columns={[{ key: 'area', label: 'Focus area' }, { key: 'text', label: 'Description' }]}
              rows={automotive.tester.focus}
            />
            <p className="tr-note"><strong>Gate —</strong> {automotive.tester.gate}</p>
          </Reveal>
        </div>

        <SubHead>Hands-on practical training</SubHead>
        <RevealGroup className="grid grid-3 tilt-grid" style={{ marginTop: 24 }}>
          {automotive.practicals.map((p, i) => (
            <TiltCard key={p.title} className="card icard" intensity={8} variants={fadeUp} style={{ height: '100%' }}>
              <span className="card-num">{String(i + 1).padStart(2, '0')}</span>
              <h4 className="icard__title">{p.title}</h4>
              <p className="icard__text">{p.text}</p>
            </TiltCard>
          ))}
        </RevealGroup>
      </div></section>

      {/* Domain 02 — Software */}
      <section id="software" className="section tr-anchor" style={{ paddingTop: 0 }}><div className="container">
        <DomainBanner no="02" eyebrow="Domain 02" title={<>Software — <span className="gradient-text">Linux &amp; Android</span></>} lead="Linux and Android, each with its own Developer and Tester track, plus a cross-platform infotainment (IVI) module." />

        <SubHead>Linux — foundation & developer track</SubHead>
        <p className="tr-muted">Theory → Raspberry Pi → Drivers → Middleware</p>
        <Reveal className="tr-pattern tr-pattern--before">
          <Flow steps={linux.sequence} numbered label="Linux foundation to development sequence" />
        </Reveal>
        <Reveal>
          <DataTable
            caption="Linux developer training areas"
            columns={[{ key: 'area', label: 'Training area' }, { key: 'text', label: 'Coverage' }]}
            rows={linux.developer}
          />
          <p className="tr-hw"><span className="model-tag">HARDWARE</span> {linux.hardware}</p>
        </Reveal>

        <SubHead>Linux — tester track</SubHead>
        <p className="tr-muted">Automation · Debugging · Root cause analysis</p>
        <div className="split tr-tracks tr-tracks--top" style={{ marginTop: 20 }}>
          <Reveal className="card tr-track">
            <h5 className="tr-minihead" style={{ marginTop: 0 }}>Focus areas</h5>
            <Chips items={linux.tester.focus} label="Linux tester focus areas" />
            <h5 className="tr-minihead">Linux debugging tools</h5>
            <Chips items={linux.tester.tools} label="Linux debugging tools" />
          </Reveal>
          <Reveal>
            <DataTable
              caption="Linux tester responsibilities"
              columns={[{ key: 'area', label: 'Responsibility' }, { key: 'text', label: 'Description' }]}
              rows={linux.tester.duties}
            />
          </Reveal>
        </div>

        <SubHead>Embedded Android</SubHead>
        <div className="split tr-tracks" style={{ marginTop: 20 }}>
          <Reveal className="card tr-track">
            <span className="model-tag">ANDROID ARCHITECTURE STACK</span>
            <ol className="tr-stack" aria-label="Android architecture stack, top to bottom">
              {android.stack.map((l) => (
                <li key={l.layer} className="tr-stack__layer">
                  <strong>{l.layer}</strong>
                  <span>{l.text}</span>
                </li>
              ))}
            </ol>
          </Reveal>
          <Reveal className="card tr-track">
            <span className="model-tag">DEVELOPER TRAINING PATH</span>
            <Flow steps={android.path} numbered label="Android developer training path" />
            <h5 className="tr-minihead">Core concepts</h5>
            <Chips items={android.concepts} label="Android concepts" />
            <p className="tr-hw"><span className="model-tag">HARDWARE</span> {android.hardware}</p>
          </Reveal>
        </div>

        <SubHead>Android — tester track</SubHead>
        <p className="tr-muted">ADB · Logcat · Automation — includes infotainment (IVI) validation.</p>
        <div className="split tr-tracks tr-tracks--top" style={{ marginTop: 20 }}>
          <Reveal className="card tr-track">
            <h5 className="tr-minihead" style={{ marginTop: 0 }}>Focus areas</h5>
            <Chips items={android.tester.focus} label="Android tester focus areas" />
            <p className="tr-hw"><span className="model-tag">HARDWARE</span> {android.hardware}</p>
          </Reveal>
          <Reveal>
            <DataTable
              caption="Android tester activities"
              columns={[{ key: 'area', label: 'Activity' }, { key: 'text', label: 'Description' }]}
              rows={android.tester.duties}
            />
          </Reveal>
        </div>

        <SubHead>Infotainment (IVI) — cross-platform module</SubHead>
        <p className="tr-muted">Delivered within both the Linux and the Android tracks.</p>
        <RevealGroup className="grid grid-2 tilt-grid" style={{ marginTop: 24 }}>
          <TiltCard className="card" intensity={8} variants={fadeUp} style={{ height: '100%' }}>
            <span className="model-tag">ON LINUX</span>
            <CheckList items={ivi.linux} />
          </TiltCard>
          <TiltCard className="card" intensity={8} variants={fadeUp} style={{ height: '100%' }}>
            <span className="model-tag">ON ANDROID</span>
            <CheckList items={ivi.android} />
          </TiltCard>
        </RevealGroup>
        <p className="tr-hw"><span className="model-tag">HARDWARE</span> i.MX8MP Phyboard Pollux · Raspberry Pi (Linux track)</p>
      </div></section>

      {/* Domain 03 — AI */}
      <section id="ai" className="section tr-anchor" style={{ paddingTop: 0 }}><div className="container">
        <DomainBanner no="03" eyebrow="Domain 03" title={<>Artificial <span className="gradient-text">Intelligence</span></>} lead="Common AI modules, followed by an AI Developer track or an AI Tester track." />

        <SubHead>AI — common modules</SubHead>
        <p className="tr-muted">Mandatory before specialization.</p>
        <Reveal>
          <DataTable
            caption="Artificial Intelligence common modules"
            columns={[
              { key: 'module', label: 'Module' },
              { key: 'purpose', label: 'Purpose' },
              { key: 'skills', label: 'Concepts / skills acquired' },
            ]}
            rows={ai.foundation}
          />
        </Reveal>
        <Reveal className="tr-pattern">
          <span className="tr-muted">Each module is covered as</span>
          <Flow steps={ai.teachingPattern} label="How each AI module is taught" />
        </Reveal>

        <SubHead>AI Developer & Tester tracks</SubHead>
        <div className="split tr-tracks">
          <Reveal className="card tr-track">
            <span className="model-tag">AI DEVELOPER TRACK</span>
            <CheckList items={ai.developer} />
          </Reveal>
          <Reveal className="card tr-track">
            <span className="model-tag">AI TESTER TRACK</span>
            <CheckList items={ai.tester} />
            <p className="tr-note" style={{ marginTop: 22 }}>{ai.testerNote}</p>
          </Reveal>
        </div>
      </div></section>

      {/* Evaluation */}
      <section id="evaluation" className="section tr-anchor" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Evaluation & Interview Process" title='Progression is <span class="gradient-text">gated at every stage</span>' lead="The same evaluation gates apply across all three domains." />
        <div className="pp-grid" style={{ marginTop: 50 }}>
          {evaluationGates.map((g) => (
            <Reveal key={g.no} className="pp-card">
              <span className="pp-card__dot">{g.no}</span>
              <h3 className="icard__title" style={{ marginTop: 18 }}>{g.title}</h3>
              <p className="icard__text">{g.text}</p>
            </Reveal>
          ))}
        </div>

        <div className="split tr-tracks" style={{ marginTop: 80 }}>
          <Reveal>
            <SubHead>Hardware by domain</SubHead>
            <DataTable
              caption="Hardware platform mapping"
              columns={[
                { key: 'domain', label: 'Domain' },
                { key: 'platform', label: 'Hardware platform' },
                { key: 'use', label: 'Used for' },
              ]}
              rows={hardwareMap}
            />
          </Reveal>
          <Reveal>
            <SubHead>Tools by track</SubHead>
            <DataTable
              caption="Tool mapping by domain and track"
              columns={[{ key: 'track', label: 'Domain / track' }, { key: 'tools', label: 'Tools used' }]}
              rows={toolMap}
            />
          </Reveal>
        </div>
      </div></section>

      {/* Roadmap */}
      <section id="roadmap" className="section tr-anchor" style={{ paddingTop: 0 }}><div className="container">
        <SectionHeader eyebrow="Roadmap" title='Recommended <span class="gradient-text">learning sequence</span>' lead="Each step is gated by a technical interview and a practical evaluation." />
        <RevealGroup className="tr-roadmaps" style={{ marginTop: 40 }}>
          {roadmaps.map((r) => (
            <Reveal key={r.domain} variants={fadeUp} className="tr-roadmap">
              <span className="model-tag">{r.domain.toUpperCase()}</span>
              <Flow steps={r.steps} optional={r.optional} label={`${r.domain} learning sequence`} />
            </Reveal>
          ))}
        </RevealGroup>
      </div></section>

      {/* CTA */}
      <section className="section" style={{ paddingTop: 0 }}><div className="container">
        <Reveal variants={scaleIn}><div className="cta-band">
          <span className="eyebrow">Structured · Modular · Evaluation-gated</span>
          <h2 style={{ marginTop: 18 }}>Engineers trained for your program from day one.</h2>
          <p>Talk to us about Campus Connect, internships, or placing trained engineers on your program.</p>
          <div className="tr-cta-actions">
            <MagneticButton to="/contact" className="btn btn-primary">Talk to us about training <span className="arrow" aria-hidden="true">→</span></MagneticButton>
            <MagneticButton to="/careers" className="btn btn-ghost">Careers & Campus Connect</MagneticButton>
          </div>
        </div></Reveal>
      </div></section>
    </Page>
  )
}
