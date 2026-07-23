import { motion, useScroll } from 'framer-motion'
import { useRef } from 'react'
import CountUp from './CountUp'
import MagneticButton from './MagneticButton'
import { Reveal } from './Section'

/* ============================================================
   Immersive sections (originally the /v2 concept page),
   now merged into the main site.
   ============================================================ */

export function Manifesto() {
  const words = 'Software is the new horsepower.'.split(' ')
  return (
    <section className="xp-manifesto">
      <div className="container center">
        <motion.p
          className="xp-manifesto__kicker"
          initial={{ opacity: 0 }}
          whileInView={{ opacity: 1 }}
          viewport={{ once: true, amount: 0.6 }}
        >
          THE SOFTWARE-DEFINED VEHICLE ERA
        </motion.p>
        <motion.h2
          initial="hidden"
          whileInView="show"
          viewport={{ once: true, amount: 0.6 }}
          variants={{ hidden: {}, show: { transition: { staggerChildren: 0.14 } } }}
          className="xp-manifesto__h"
        >
          {words.map((w, i) => (
            <motion.span
              key={i}
              variants={{ hidden: { opacity: 0, y: 30, filter: 'blur(8px)' }, show: { opacity: 1, y: 0, filter: 'blur(0px)', transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] } } }}
              className={i >= words.length - 1 ? 'gradient-text' : undefined}
            >
              {w}{' '}
            </motion.span>
          ))}
        </motion.h2>
        <Reveal><p className="xp-manifesto__p">A modern vehicle runs on a hundred million lines of code. We are the engineering bench that writes, integrates, and proves that code — from the first requirement to the proving ground.</p></Reveal>
      </div>
    </section>
  )
}

export function VModel() {
  const ref = useRef(null)
  const { scrollYProgress } = useScroll({ target: ref, offset: ['start 0.85', 'end 0.5'] })
  const left = [
    ['Requirements', 60, 40], ['System Design', 150, 120], ['SW Architecture', 240, 200], ['Implementation', 345, 285],
  ]
  const right = [
    ['Unit Testing', 450, 200], ['Integration & HiL', 545, 120], ['System Validation', 640, 40],
  ]
  return (
    <section className="xp-vmodel" ref={ref}>
      <div className="container">
        <Reveal className="center mx-auto section-head">
          <span className="eyebrow">Engineering Process</span>
          <h2 className="section-title">The V, drawn in <span className="gradient-text">real programs.</span></h2>
          <p className="section-lead mx-auto" style={{ textAlign: 'center' }}>Every AUTO-CAN engagement follows the automotive V-model — requirements on the way down, verification all the way up.</p>
        </Reveal>
        <div className="xp-vmodel__stage">
          <svg viewBox="0 0 700 340" className="xp-vmodel__svg" aria-hidden="true">
            <motion.path
              d="M 60 50 L 345 295 L 640 50"
              fill="none" stroke="url(#vgrad)" strokeWidth="2.5" strokeLinecap="round"
              style={{ pathLength: scrollYProgress }}
            />
            <defs>
              <linearGradient id="vgrad" x1="0%" y1="0%" x2="100%" y2="0%">
                <stop offset="0%" stopColor="#818CF8" />
                <stop offset="50%" stopColor="#22D3EE" />
                <stop offset="100%" stopColor="#818CF8" />
              </linearGradient>
            </defs>
            {[...left, ...right].map(([label, x, y], i) => (
              <motion.g key={label} initial={{ opacity: 0, scale: 0 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ delay: 0.15 * i, duration: 0.4 }}>
                <circle cx={x} cy={y} r="7" fill="#04060B" stroke={i < 4 ? '#818CF8' : '#22D3EE'} strokeWidth="2.5" />
                <text x={x} y={y - 16} textAnchor="middle" className="xp-vmodel__label">{label}</text>
              </motion.g>
            ))}
            <motion.line x1="150" y1="120" x2="545" y2="120" stroke="#818CF8" strokeDasharray="5 7" strokeOpacity="0.3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.2 }} />
            <motion.line x1="240" y1="200" x2="450" y2="200" stroke="#818CF8" strokeDasharray="5 7" strokeOpacity="0.3" initial={{ opacity: 0 }} whileInView={{ opacity: 1 }} viewport={{ once: true }} transition={{ delay: 1.35 }} />
          </svg>
        </div>
      </div>
    </section>
  )
}

function CarWheel({ cx, cy }) {
  const spokes = [0, 1, 2, 3, 4].map((k) => {
    const a = ((-90 + k * 72) * Math.PI) / 180
    return {
      k,
      x1: cx + Math.cos(a) * 3.2,
      y1: cy + Math.sin(a) * 3.2,
      x2: cx + Math.cos(a) * 8.4,
      y2: cy + Math.sin(a) * 8.4,
    }
  })
  return (
    <g>
      <circle cx={cx} cy={cy} r="15.5" fill="#0B0E15" stroke="#20262F" strokeWidth="1.2" />
      <circle cx={cx} cy={cy} r="12.6" fill="none" stroke="#171C24" strokeWidth="2.2" />
      <circle cx={cx} cy={cy} r="9.6" fill="url(#acCarRim)" stroke="#39424F" strokeWidth="0.8" />
      {spokes.map((s) => (
        <line key={s.k} x1={s.x1} y1={s.y1} x2={s.x2} y2={s.y2} stroke="#5E6A79" strokeWidth="1.7" strokeLinecap="round" />
      ))}
      <circle cx={cx} cy={cy} r="2.8" fill="#707D8D" stroke="#39424F" strokeWidth="0.6" />
    </g>
  )
}

export function TwinSync() {
  return (
    <section className="xp-twin">
      <div className="container">
        <div className="split" style={{ alignItems: 'center' }}>
          <Reveal>
            <span className="eyebrow">Digital Twin</span>
            <h2 className="section-title" style={{ marginTop: 20 }}>Every vehicle exists <span className="gradient-text">twice.</span></h2>
            <p className="section-lead">The physical car on the proving ground — and its digital twin in our validation environment, running the same software against a million simulated kilometres. When they agree, you ship.</p>
            <MagneticButton to="/services" className="btn btn-ghost" style={{ marginTop: 26 }}>Explore validation <span className="arrow">→</span></MagneticButton>
          </Reveal>
          <Reveal>
            <div className="xp-twin__panel">
              <svg viewBox="0 0 300 90" className="xp-twin__car xp-twin__car--real" aria-hidden="true">
                <defs>
                  <linearGradient id="acCarBody" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#F1F5F9" />
                    <stop offset="0.4" stopColor="#B7C2CF" />
                    <stop offset="0.72" stopColor="#7C8A9B" />
                    <stop offset="1" stopColor="#3C4757" />
                  </linearGradient>
                  <linearGradient id="acCarGlass2" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="0" stopColor="#64789A" />
                    <stop offset="0.5" stopColor="#26364B" />
                    <stop offset="1" stopColor="#0C1524" />
                  </linearGradient>
                  <radialGradient id="acCarRim" cx="0.5" cy="0.42" r="0.62">
                    <stop offset="0" stopColor="#EAF0F6" />
                    <stop offset="0.55" stopColor="#9AA7B6" />
                    <stop offset="1" stopColor="#495566" />
                  </radialGradient>
                  <radialGradient id="acCarShadow" cx="0.5" cy="0.5" r="0.5">
                    <stop offset="0" stopColor="rgba(0,0,0,0.5)" />
                    <stop offset="1" stopColor="rgba(0,0,0,0)" />
                  </radialGradient>
                </defs>
                <ellipse cx="152" cy="83" rx="140" ry="6" fill="url(#acCarShadow)" />
                <path d="M16 76 L16 62 Q16 56 24 54 L70 44 L120 41 L205 41 L262 45 Q284 48 286 56 L286 76 L248 76 Q228 50 208 76 L90 76 Q70 50 50 76 Z" fill="url(#acCarBody)" stroke="#2A3342" strokeWidth="0.8" strokeLinejoin="round" />
                <path d="M22 66 L70 60 L206 59 L276 63" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="1.4" strokeLinecap="round" />
                <path d="M118 41 Q124 26 150 24 L196 24 Q207 27 210 41 Z" fill="url(#acCarGlass2)" stroke="#2A3342" strokeWidth="0.8" strokeLinejoin="round" />
                <path d="M128 39 L150 27 L162 27 L140 39 Z" fill="rgba(255,255,255,0.14)" />
                <rect x="161.5" y="25" width="2.6" height="16" fill="rgba(12,17,26,0.85)" />
                <path d="M164 41 L164 74" stroke="rgba(0,0,0,0.35)" strokeWidth="1" />
                <rect x="150" y="46" width="10" height="2.6" rx="1.3" fill="rgba(18,25,37,0.85)" />
                <path d="M119 39 Q110 36 108 41 Q108 43 111 43 L119 42 Z" fill="url(#acCarBody)" stroke="#2A3342" strokeWidth="0.6" />
                <path d="M17 56 Q22 55 25 56 L25 60 Q21 61 17 60 Z" fill="#FFF3D6" />
                <path d="M279 50 L286 52 L286 58 L279 58 Z" fill="#EF4444" />
                <CarWheel cx={70} cy={70} />
                <CarWheel cx={228} cy={70} />
              </svg>
              <div className="xp-twin__stream" aria-hidden="true">
                <span /><span /><span /><span /><span />
              </div>
              <svg viewBox="0 0 300 90" className="xp-twin__car xp-twin__car--twin" aria-hidden="true">
                <path d="M16 76 L16 62 Q16 56 24 54 L70 44 L120 41 L205 41 L262 45 Q284 48 286 56 L286 76 L248 76 Q228 50 208 76 L90 76 Q70 50 50 76 Z" fill="none" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="6 5" strokeLinejoin="round" />
                <path d="M118 41 Q124 26 150 24 L196 24 Q207 27 210 41" fill="none" stroke="#60A5FA" strokeWidth="1.4" strokeDasharray="5 4" />
                <circle cx="70" cy="70" r="14" fill="none" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="4 4" />
                <circle cx="228" cy="70" r="14" fill="none" stroke="#60A5FA" strokeWidth="1.6" strokeDasharray="4 4" />
              </svg>
              <div className="xp-twin__stats">
                <div><div className="k"><CountUp to={99} suffix="%" /></div><div className="l">Signal parity</div></div>
                <div><div className="k"><CountUp to={1248} suffix="" /></div><div className="l">Test cases / cycle</div></div>
                <div><div className="k"><CountUp to={24} suffix="/7" /></div><div className="l">Continuous validation</div></div>
              </div>
            </div>
          </Reveal>
        </div>
      </div>
    </section>
  )
}
