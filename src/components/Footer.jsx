import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { company, navLinks } from '../data/site'
import './Footer.css'

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer__glow" />
      <div className="container">
        <motion.div
          className="footer__cta"
          initial={{ opacity: 0, y: 30 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.4 }}
          transition={{ duration: 0.7, ease: [0.22, 1, 0.36, 1] }}
        >
          <div className="footer__ctacopy">
            <span className="eyebrow">Let’s build together</span>
            <h2 className="footer__ctatitle">Put a proven automotive bench behind your next program.</h2>
            <p className="footer__ctatext">Same-day deployment · 25–45% buffer bench · a decade of delivery.</p>
          </div>
          <Link to="/contact" className="btn btn-primary footer__ctabtn">
            Start a conversation <span className="arrow">→</span>
          </Link>
        </motion.div>

        <div className="footer__grid">
          <div className="footer__brandcol">
            <div className="footer__brand">
              <img src="/logo.png" alt="" width="40" height="40" loading="lazy" />
              <span>AUTO<span style={{ color: 'var(--cyan-400)' }}>-</span>CAN</span>
            </div>
            <p className="footer__tagline">{company.tagline}</p>
            <p className="footer__muted">
              Founded {company.founded} · {company.location}<br />
              Delivery centre · {company.deliveryCentre}
            </p>
          </div>

          <div className="footer__col">
            <h4>Navigate</h4>
            {navLinks.map((l) => (
              <Link key={l.to} to={l.to}>{l.label}</Link>
            ))}
          </div>

          <div className="footer__col">
            <h4>Capabilities</h4>
            <Link to="/services">Embedded SW Stacks</Link>
            <Link to="/services">Test Automation</Link>
            <Link to="/expertise">HiL &amp; V&amp;V</Link>
            <Link to="/expertise">AUTOSAR &amp; ISO 26262</Link>
          </div>

          <div className="footer__col">
            <h4>Engage</h4>
            <Link to="/careers">ODC Model</Link>
            <Link to="/careers">Deputation Model</Link>
            <Link to="/careers">Campus Connect</Link>
            <Link to="/contact">Contact</Link>
          </div>
        </div>

        <div className="footer__bottom">
          <span>© {new Date().getFullYear()} {company.name}. All rights reserved.</span>
          <nav className="footer__legal" aria-label="Legal">
            <Link to="/privacy-policy">Privacy Policy</Link>
            <Link to="/terms-and-conditions">Terms &amp; Conditions</Link>
          </nav>
          <span className="footer__mono">Driven by AI · Powered by Innovation</span>
        </div>
      </div>
    </footer>
  )
}
