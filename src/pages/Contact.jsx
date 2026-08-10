import { useCallback, useRef, useState } from 'react'
import { motion } from 'framer-motion'
import Page from '../components/Page'
import SEO from '../seo/SEO'
import { pageSeo } from '../seo/pages.seo'
import { Reveal } from '../components/Section'
import MagneticButton from '../components/MagneticButton'
import { company, engagementTerms } from '../data/site'
import { formEndpoint } from '../seo/site.config'
import { MailIcon, PinIcon, FactoryIcon, HandshakeIcon } from '../components/Icons'

const INTERESTS = [
  'Embedded software & tooling',
  'HiL / Test automation',
  'R&D — AUTOSAR / ADAS / OTA',
  'ODC / Deputation talent',
  'Campus Connect partnership',
]

const LIMITS = { name: 80, company: 120, email: 254, message: 4000 }
const EMAIL_RE = /^[^\s@]+@[^\s@]+\.[a-z]{2,}$/i

/** Pure, synchronous field validation — same rules on blur and on submit. */
function validate(values) {
  const errors = {}
  const name = values.name?.trim() ?? ''
  const email = values.email?.trim() ?? ''
  const message = values.message?.trim() ?? ''

  if (!name) errors.name = 'Please tell us your name.'
  else if (name.length < 2) errors.name = 'That name looks a little short.'
  else if (name.length > LIMITS.name) errors.name = `Please keep this under ${LIMITS.name} characters.`

  if (!email) errors.email = 'We need an email address to reply to.'
  else if (!EMAIL_RE.test(email)) errors.email = 'That doesn’t look like a valid email address.'

  if (!values.interest) errors.interest = 'Choose the area you’d like to discuss.'

  if (!message) errors.message = 'A sentence or two about your program helps us route your enquiry.'
  else if (message.length < 12) errors.message = 'Could you add a little more detail?'
  else if (message.length > LIMITS.message) errors.message = `Please keep this under ${LIMITS.message} characters.`

  if ((values.company ?? '').length > LIMITS.company) {
    errors.company = `Please keep this under ${LIMITS.company} characters.`
  }
  return errors
}

export default function Contact() {
  const [status, setStatus] = useState('idle') // idle | sending | sent | error
  const [errors, setErrors] = useState({})
  const [touched, setTouched] = useState({})
  const formRef = useRef(null)
  const successRef = useRef(null)

  const readValues = () => {
    const fd = new FormData(formRef.current)
    return Object.fromEntries(fd.entries())
  }

  const handleBlur = useCallback((e) => {
    const field = e.target.name
    if (!field) return
    setTouched((t) => ({ ...t, [field]: true }))
    setErrors(validate(readValues()))
  }, [])

  const handleChange = useCallback((e) => {
    const field = e.target.name
    // Only clear errors as the user corrects them — never introduce new ones mid-typing.
    setErrors((prev) => {
      if (!prev[field]) return prev
      const next = validate(readValues())
      return next[field] ? prev : { ...prev, [field]: undefined }
    })
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    const data = readValues()

    // Honeypot: real users never fill a visually hidden, aria-hidden field.
    if (data._honey) { setStatus('sent'); return }

    const found = validate(data)
    setErrors(found)
    setTouched({ name: true, company: true, email: true, interest: true, message: true })

    const firstBad = ['name', 'email', 'interest', 'message'].find((k) => found[k])
    if (firstBad) {
      formRef.current.querySelector(`[name="${firstBad}"]`)?.focus()
      return
    }

    setStatus('sending')
    delete data._honey

    try {
      const res = await fetch(formEndpoint(), {
        method: 'POST',
        headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
        body: JSON.stringify({
          ...data,
          _subject: `Website enquiry — ${data.name}${data.company ? ` (${data.company})` : ''}`,
          _template: 'table',
          _captcha: 'false',
        }),
      })
      if (!res.ok) throw new Error(`send failed: ${res.status}`)
      setStatus('sent')
      // Move focus to the confirmation so screen-reader users land on the result.
      requestAnimationFrame(() => successRef.current?.focus())
    } catch {
      setStatus('error')
      const body = encodeURIComponent(
        `Name: ${data.name}\nCompany: ${data.company || '-'}\nEmail: ${data.email}\nInterested in: ${data.interest}\n\n${data.message}`
      )
      window.location.href =
        `mailto:${company.email}?subject=${encodeURIComponent('Website enquiry — ' + data.name)}&body=${body}`
    }
  }

  const fieldProps = (name) => ({
    name,
    id: name,
    onBlur: handleBlur,
    onChange: handleChange,
    'aria-invalid': touched[name] && errors[name] ? 'true' : undefined,
    'aria-describedby': touched[name] && errors[name] ? `${name}-error` : undefined,
  })

  const FieldError = ({ name }) =>
    touched[name] && errors[name] ? (
      <span className="field__error" id={`${name}-error`}>
        <svg viewBox="0 0 16 16" aria-hidden="true" width="14" height="14">
          <circle cx="8" cy="8" r="7" fill="none" stroke="currentColor" strokeWidth="1.5" />
          <path d="M8 4.6v4.2M8 11.2v.6" stroke="currentColor" strokeWidth="1.6" strokeLinecap="round" />
        </svg>
        {errors[name]}
      </span>
    ) : null

  const sending = status === 'sending'

  return (
    <Page>
      <SEO seo={pageSeo.contact} />
      <section className="page-hero"><div className="container">
        <div className="hero-in" style={{ animationDelay: '0.02s' }}><span className="eyebrow">Let’s Work Together</span></div>
        <div className="hero-in" style={{ animationDelay: '0.1s' }}><h1>Put a proven engineering bench <span className="gradient-text">behind your program.</span></h1></div>
        <div className="hero-in" style={{ animationDelay: '0.28s' }}><p>Tell us about your automotive program and we’ll get back to you with the right engagement model and team.</p></div>
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
            <div className="card contact-card">
              {status === 'sent' ? (
                <motion.div
                  ref={successRef}
                  tabIndex={-1}
                  initial={{ opacity: 0, scale: 0.96 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="form-success"
                  role="status"
                >
                  <span className="form-success__mark" aria-hidden="true">
                    <svg viewBox="0 0 24 24" width="22" height="22" fill="none" stroke="currentColor" strokeWidth="2.4" strokeLinecap="round" strokeLinejoin="round"><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
                  </span>
                  <strong>Thank you — your message is on its way.</strong>
                  <p>Our team reviews every enquiry personally and will be in touch shortly.</p>
                  <div style={{ marginTop: 16 }}>
                    <button type="button" className="btn btn-ghost" onClick={() => { setStatus('idle'); setErrors({}); setTouched({}) }}>
                      Send another
                    </button>
                  </div>
                </motion.div>
              ) : (
                <form className="form" ref={formRef} onSubmit={handleSubmit} noValidate aria-busy={sending}>
                  {/* Spam trap — hidden from sighted users and assistive tech alike */}
                  <div className="hp" aria-hidden="true">
                    <label htmlFor="_honey">Leave this field empty</label>
                    <input id="_honey" name="_honey" type="text" tabIndex={-1} autoComplete="off" />
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="name">Full name <span className="field__req" aria-hidden="true">*</span></label>
                      <input {...fieldProps('name')} type="text" placeholder="Your name" autoComplete="name" maxLength={LIMITS.name} required />
                      <FieldError name="name" />
                    </div>
                    <div className="field">
                      <label htmlFor="company">Company <span className="field__opt">optional</span></label>
                      <input {...fieldProps('company')} type="text" placeholder="Organization" autoComplete="organization" maxLength={LIMITS.company} />
                      <FieldError name="company" />
                    </div>
                  </div>

                  <div className="form-row">
                    <div className="field">
                      <label htmlFor="email">Work email <span className="field__req" aria-hidden="true">*</span></label>
                      <input {...fieldProps('email')} type="email" placeholder="you@company.com" autoComplete="email" inputMode="email" maxLength={LIMITS.email} required />
                      <FieldError name="email" />
                    </div>
                    <div className="field">
                      <label htmlFor="interest">I’m interested in <span className="field__req" aria-hidden="true">*</span></label>
                      <select {...fieldProps('interest')} defaultValue="" required>
                        <option value="" disabled>Select…</option>
                        {INTERESTS.map((i) => <option key={i} value={i}>{i}</option>)}
                      </select>
                      <FieldError name="interest" />
                    </div>
                  </div>

                  <div className="field">
                    <label htmlFor="message">Tell us about your program <span className="field__req" aria-hidden="true">*</span></label>
                    <textarea {...fieldProps('message')} rows={5} placeholder="A few lines about your project, scope and timeline…" maxLength={LIMITS.message} required />
                    <FieldError name="message" />
                  </div>

                  <MagneticButton
                    type="submit"
                    className="btn btn-primary form__submit"
                    disabled={sending}
                    strength={0.5}
                  >
                    {sending ? 'Sending…' : 'Send message'}
                    <span className="arrow" aria-hidden="true">→</span>
                  </MagneticButton>

                  <p className="form__note">
                    We reply from a real inbox — no automated sequences. See our{' '}
                    <a href="/privacy-policy">privacy policy</a>.
                  </p>

                  {/* Single live region announces every state change once */}
                  <div className="form__status" role="status" aria-live="polite">
                    {sending && <span>Sending your message…</span>}
                    {status === 'error' && (
                      <span className="form__status--error" role="alert">
                        We couldn’t reach the form service, so we’ve opened your email client instead.
                        You can also write to us directly at {company.email}.
                      </span>
                    )}
                  </div>
                </form>
              )}
            </div>
          </Reveal>
        </div>
      </div></section>
    </Page>
  )
}
