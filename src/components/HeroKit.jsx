import { motion } from 'framer-motion'
import { lazy, Suspense, useEffect, useState } from 'react'
import { ShieldIcon, BoltIcon, GlobeIcon } from './Icons'
const HeroScene3D = lazy(() => import('./HeroScene3D'))

export const SPEC_STACK = [
  ['AUTOSAR Adaptive', 'Classic AUTOSAR', 'SOME/IP', 'CAN FD', 'Ethernet', 'ROS2'],
  ['ISO 26262 ASIL-D', 'Cyber Security', 'ASPICE', 'AI Validation'],
  ['ADAS Level 3', 'OTA', 'Digital Twin', 'CI/CD'],
]
export function CycleCard({ items, interval, className, icon, floatDur }) {
  const [i, setI] = useState(0)
  useEffect(() => {
    const id = setInterval(() => setI((v) => (v + 1) % items.length), interval)
    return () => clearInterval(id)
  }, [items.length, interval])
  return (
    <motion.div className={`chip3d ${className}`} animate={{ y: [0, -10, 0] }} transition={{ duration: floatDur, repeat: Infinity, ease: 'easeInOut' }}>
      {icon}
      <motion.span key={i} className="chip3d__label" initial={{ opacity: 0, y: 7 }} animate={{ opacity: 1, y: 0 }} transition={{ duration: 0.3 }}>
        <b>{items[i]}</b>
      </motion.span>
    </motion.div>
  )
}
export const BOOT_LINES = [
  '> HiL rig · 1,248/1,248 test cases passed ✓',
  '> AUTOSAR RTE generated in 3.2s ✓',
  '> OTA package signed · SHA-256 verified ✓',
  '> CAN FD bus load 42% · timing optimal ✓',
  '> ISO 26262 ASIL-D audit · compliant ✓',
  '> ADAS perception stack · 60 fps validated ✓',
]
export function BootConsole() {
  const [line, setLine] = useState(0)
  const [chars, setChars] = useState(0)
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) { setChars(BOOT_LINES[0].length); return }
    const id = setInterval(() => {
      setChars((c) => {
        if (c < BOOT_LINES[line].length) return c + 1
        return c
      })
    }, 28)
    const hold = setTimeout(() => { setLine((l) => (l + 1) % BOOT_LINES.length); setChars(0) }, BOOT_LINES[line].length * 28 + 2200)
    return () => { clearInterval(id); clearTimeout(hold) }
  }, [line])
  return (
    <motion.div className="boot-console" initial={{ opacity: 0 }} animate={{ opacity: 1 }} transition={{ delay: 1.35 }} aria-hidden="true">
      {BOOT_LINES[line].slice(0, chars)}<span className="boot-console__cursor" />
    </motion.div>
  )
}
export function XRayButton() {
  const [on, setOn] = useState(false)
  const toggle = () => {
    const next = !on
    setOn(next)
    window.dispatchEvent(new CustomEvent('ac-xray', { detail: next }))
  }
  return (
    <button className={`xray-btn ${on ? 'is-on' : ''}`} onClick={toggle} aria-pressed={on}>
      <span className="xray-btn__dot" />
      {on ? 'Exit X-Ray' : 'Digital Twin X-Ray'}
    </button>
  )
}
export function HeroVisual() {
  // Client-only mount: the WebGL scene is skipped during static prerender
  // and lazy-loaded after hydration, so SEO HTML stays instant.
  const [ready, setReady] = useState(false)
  useEffect(() => { setReady(true) }, [])
  return (
    <div className="hero__visual hero__visual--3d">
      <motion.div className="scene3d__frame" initial={{ opacity: 0, scale: 0.94 }} animate={{ opacity: 1, scale: 1 }} transition={{ duration: 1, ease: [0.22, 1, 0.36, 1] }}>
        {ready && (
          <Suspense fallback={<div className="scene3d scene3d--loading" aria-hidden="true" />}>
            <HeroScene3D />
          </Suspense>
        )}
        <CycleCard items={SPEC_STACK[0]} interval={4200} floatDur={4} className="chip3d--1" icon={<span className="chip3d__ico chip3d__ico--orange"><BoltIcon /></span>} />
        <CycleCard items={SPEC_STACK[1]} interval={5300} floatDur={4.6} className="chip3d--2" icon={<span className="chip3d__ico chip3d__ico--blue"><ShieldIcon /></span>} />
        <CycleCard items={SPEC_STACK[2]} interval={6100} floatDur={5.2} className="chip3d--3" icon={<span className="chip3d__ico chip3d__ico--orange"><GlobeIcon /></span>} />
        <XRayButton />
      </motion.div>
    </div>
  )
}
