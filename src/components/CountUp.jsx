import { useEffect, useRef, useState } from 'react'
import { useInView, useReducedMotion } from 'framer-motion'

/**
 * Animated number that counts up when scrolled into view.
 * Assistive tech reads the final value once (via the visually-hidden span)
 * instead of every intermediate frame.
 *
 * The first render is always the final value. That keeps the prerendered HTML
 * identical to the first client render whatever the visitor's motion
 * preference — initialising from useReducedMotion() made the server emit "0"
 * while a reduced-motion client emitted "10", which failed hydration for every
 * counter and pushed the whole page into client-side rendering. It also means
 * crawlers and no-JS readers see the real figure rather than a zero.
 */
export default function CountUp({ to, suffix = '', duration = 1600 }) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const inView = useInView(ref, { once: true, amount: 0.5 })
  const [value, setValue] = useState(to)
  const [armed, setArmed] = useState(false)

  // After hydration, and only when motion is welcome, reset to zero so the
  // count-up has somewhere to start from. This runs before the counter can
  // scroll into view, so the reset is never visible.
  useEffect(() => {
    if (reduced) return
    setValue(0)
    setArmed(true)
  }, [reduced])

  useEffect(() => {
    if (!inView || !armed) return
    let raf
    const start = performance.now()
    const tick = (now) => {
      const p = Math.min((now - start) / duration, 1)
      const eased = 1 - Math.pow(1 - p, 3)
      setValue(Math.round(eased * to))
      if (p < 1) raf = requestAnimationFrame(tick)
    }
    raf = requestAnimationFrame(tick)
    return () => cancelAnimationFrame(raf)
  }, [inView, armed, to, duration])

  return (
    <span ref={ref}>
      <span aria-hidden="true">{value}{suffix}</span>
      <span className="sr-only">{to}{suffix}</span>
    </span>
  )
}
