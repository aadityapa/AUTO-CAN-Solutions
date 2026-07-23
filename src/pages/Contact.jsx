import { useState } from 'react'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal } from '../components/Section'
import MagneticButton from '../components/MagneticButton'
import { company, engagementTerms } from '../data/site'
import { MailIcon, PinIcon, FactoryIcon, HandshakeIcon } from '../components/Icons'
export default function Contact() {
  const [sent, setSent] = useState(false)
  const [sending, setSending] = useState(false)
  const [error, setError] = useState(false)
  const handleSubmit = async (e) => {
    e.preventDefault()
    setSending(true); setError(false)
    const form = e.target
    const data = Object.fromEntries(new FormData(form).entries())
    try {
      const res = await fetch(`https://formsubmit.co/ajax/${company.email}`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Website enquiry — ${data.name}${data.company ? ` (${data.company})` : ''}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error('send failed')
      setSent(true)
    } catch {
      setError(true)
      // Fallback: open the visitor's email client pre-filled
      const body = encodeURIComponent(`Name: ${data.name}\nCompany: ${data.company || '-'}\nEmail: ${data.email}\nInterested in: ${data.interest}\n\n${data.message}`)
      window.location.href = `mailto:${company.email}?subject=${encodeURIComponent('Website enquiry — ' + data.name)}&body=${body}`
    } finally {
      setSending(false)
    }
  }
  return (
    <Page>
      <SEO seo={pageSeo.contact} />
      <section className="page-hero"><div className="container">
        <Reveal><span className="eyebrow">Let’s Work Together</span></Reveal>
        <Reveal><h1>Put a proven engineering bench <span className="gradient-text">behind your program.</span></h1></Reveal>
        <Reveal><p>Tell us about your automotive program and we’ll get back to you with the right engagement model and team.</p></Reveal>
      </div></section>
      <section className="section" style={{ paddingTop: 30 }}><div className="container">
        <div className="contact-grid">
          <Reveal className="contact-info">
            <div className="info-row"><span className="ico"><MailIcon /></span><div><div className="k">Email</div><div className="v"><a href={`mailto:${company.email}`}>{company.email}</a></div></div></div>
            <div className="info-row"><span className="ico"><PinIcon /></span><div><div className="k">Headquarters</div><div className="v">{company.location}</div></div></div>
            <div className="info-row"><span className="ico"><FactoryIcon /></span><div><div className="k">Delivery Centre</div><div className="v">{company.deliveryCentre}</div></div></div>
            <div className="info-row"><span className="ico"><HandshakeIcon /></span><div><div className="k">Engagement models</div><div className="v">{engagementTerms.join(' · ')}</div></div></div>
          </Reveal>
          <Reveal>
            <div className="card" style={{ padding: 32 }}>
              {sent ? (
                <motion.div initial={{ opacity: 0, scale: 0.96 }} animate={{ opacity: 1, scale: 1 }} className="form-success" role="status">
                  <strong>Thank you!</strong> Your message has been captured. Our team will be in touch shortly.
                  <div style={{ marginTop: 14 }}><button className="btn btn-ghost" onClick={() => setSent(false)}>Send another</button></div>
                </motion.div>
              ) : (
                <form className="form" onSubmit={handleSubmit}>
                  <div className="form-row">
                    <div className="field"><label htmlFor="name">Full name</label><input id="name" name="name" type="text" placeholder="Your name" autoComplete="name" required /></div>
                    <div className="field"><label htmlFor="company">Company</label><input id="company" name="company" type="text" placeholder="Organization" autoComplete="organization" /></div>
                  </div>
                  <div className="form-row">
                    <div className="field"><label htmlFor="email">Work email</label><input id="email" name="email" type="email" placeholder="you@company.com" autoComplete="email" required /></div>
                    <div className="field"><label htmlFor="interest">I’m interested in</label>
                      <select id="interest" name="interest" defaultValue="" required>
                        <option value="" disabled>Select…</option>
                        <option>Embedded software & tooling</option>
                        <option>HiL / Test automation</option>
                        <option>R&D — AUTOSAR / ADAS / OTA</option>
                        <option>ODC / Deputation talent</option>
                        <option>Campus Connect partnership</option>
                      </select>
                    </div>
                  </div>
                  <div className="field"><label htmlFor="message">Tell us about your program</label><textarea id="message" name="message" placeholder="A few lines about your project, scope and timeline…" required /></div>
                  <MagneticButton type="submit" className="btn btn-primary" style={{ alignSelf: 'flex-start', opacity: sending ? 0.6 : 1, pointerEvents: sending ? 'none' : 'auto' }} strength={0.5}>{sending ? 'Sending…' : 'Send message'} <span className="arrow">→</span></MagneticButton>
                  {error && <p role="alert" style={{ color: 'var(--violet-300)', fontSize: '0.85rem' }}>Couldn’t reach the form service — we’ve opened your email client instead. You can also write to us directly at {company.email}.</p>}
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div></section>
    </Page>
  )
}
