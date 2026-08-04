import { useCallback, useEffect, useRef, useState } from 'react'
import { Link, NavLink, useLocation } from 'react-router-dom'
import { motion, AnimatePresence, useScroll, useSpring } from 'framer-motion'
import { navLinks } from '../data/site'
import './Navbar.css'

/**
 * Floating glass navigation dock.
 *
 * Accessibility contract for the mobile drawer:
 *  - focus moves into the drawer when it opens and returns to the trigger on close
 *  - Tab is trapped inside the drawer while it is open
 *  - Escape closes it; so does a click on the scrim or a route change
 *  - body scroll (native and Lenis) is locked while it is open
 */
export default function Navbar() {
  const [scrolled, setScrolled] = useState(false)
  const [open, setOpen] = useState(false)
  const location = useLocation()
  const burgerRef = useRef(null)
  const drawerRef = useRef(null)

  const { scrollYProgress } = useScroll()
  const progress = useSpring(scrollYProgress, { stiffness: 120, damping: 30, mass: 0.3 })

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 20)
    onScroll()
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  // Close on navigation
  useEffect(() => { setOpen(false) }, [location.pathname])

  const close = useCallback(() => {
    setOpen(false)
    burgerRef.current?.focus()
  }, [])

  // Scroll lock + focus management + focus trap
  useEffect(() => {
    if (!open) return

    const { body } = document
    const prevOverflow = body.style.overflow
    body.style.overflow = 'hidden'
    window.__lenis?.stop()

    const drawer = drawerRef.current
    const FOCUSABLE = 'a[href], button:not([disabled]), input, select, textarea, [tabindex]:not([tabindex="-1"])'
    const firstLink = drawer?.querySelector(FOCUSABLE)
    firstLink?.focus()

    const onKey = (e) => {
      if (e.key === 'Escape') { e.preventDefault(); close(); return }
      if (e.key !== 'Tab' || !drawer) return
      const nodes = Array.from(drawer.querySelectorAll(FOCUSABLE)).filter((n) => n.offsetParent !== null)
      if (!nodes.length) return
      const first = nodes[0]
      const last = nodes[nodes.length - 1]
      const active = document.activeElement
      if (e.shiftKey && (active === first || !drawer.contains(active))) {
        e.preventDefault(); last.focus()
      } else if (!e.shiftKey && active === last) {
        e.preventDefault(); first.focus()
      }
    }
    window.addEventListener('keydown', onKey)

    return () => {
      body.style.overflow = prevOverflow
      window.__lenis?.start()
      window.removeEventListener('keydown', onKey)
    }
  }, [open, close])

  return (
    <>
      {/* Entrance is a CSS keyframe, not a Framer transition: the brand mark is
          an LCP candidate, and a JS-driven fade kept it at opacity 0 until
          React hydrated. */}
      <header className={`nav nav--enter ${scrolled ? 'nav--scrolled' : ''}`}>
        <div className="nav__inner">
          <Link to="/" className="nav__brand" aria-label="AUTO-CAN Solutions — home">
            <img
              src="/logo.png"
              alt=""
              width="42"
              height="42"
              className="nav__logo"
              decoding="async"
              fetchpriority="high"
            />
            <span className="nav__brandtext">
              AUTO<span className="nav__dash" aria-hidden="true">-</span>CAN
            </span>
          </Link>

          <nav className="nav__links" aria-label="Primary">
            {navLinks.map((l) => (
              <NavLink
                key={l.to}
                to={l.to}
                className={({ isActive }) => `nav__link ${isActive ? 'is-active' : ''}`}
                end={l.to === '/'}
              >
                {l.label}
              </NavLink>
            ))}
          </nav>

          <Link to="/contact" className="btn btn-primary nav__cta">
            Work With Us
            <span className="arrow" aria-hidden="true">→</span>
          </Link>

          <button
            ref={burgerRef}
            type="button"
            className={`nav__burger ${open ? 'is-open' : ''}`}
            onClick={() => (open ? close() : setOpen(true))}
            aria-label={open ? 'Close menu' : 'Open menu'}
            aria-expanded={open}
            aria-controls="mobile-menu"
          >
            <span /><span /><span />
          </button>
        </div>

        <motion.div className="nav__progress" style={{ scaleX: progress }} aria-hidden="true" />
      </header>

      <AnimatePresence>
        {open && (
          <>
            <motion.div
              className="nav__scrim"
              aria-hidden="true"
              onClick={close}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              transition={{ duration: 0.25 }}
            />
            <motion.nav
              id="mobile-menu"
              ref={drawerRef}
              aria-label="Mobile navigation"
              className="mobile-menu"
              initial={{ opacity: 0, y: -12 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -12 }}
              transition={{ duration: 0.28 }}
            >
              {navLinks.map((l, i) => (
                <motion.div
                  key={l.to}
                  initial={{ opacity: 0, x: -18 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: 0.05 * i }}
                >
                  <NavLink to={l.to} className="mobile-menu__link" end={l.to === '/'}>
                    {l.label}
                  </NavLink>
                </motion.div>
              ))}
              <Link to="/contact" className="btn btn-primary" style={{ marginTop: 8 }}>
                Work With Us <span className="arrow" aria-hidden="true">→</span>
              </Link>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
