import { useEffect } from 'react'
import Lenis from 'lenis'

/**
 * Buttery inertial scrolling via Lenis. Uses native scroll position under
 * the hood, so framer-motion's useScroll / scroll-linked effects stay in
 * perfect sync. Disabled for reduced-motion users. The instance is exposed
 * on window.__lenis so ScrollToTop can jump instantly on route change.
 */
export default function SmoothScroll() {
  useEffect(() => {
    if (window.matchMedia('(prefers-reduced-motion: reduce)').matches) return
    const lenis = new Lenis({
      lerp: 0.09,
      smoothWheel: true,
      wheelMultiplier: 1,
      touchMultiplier: 1.4,
    })
    window.__lenis = lenis
    let raf
    const loop = (time) => { lenis.raf(time); raf = requestAnimationFrame(loop) }
    raf = requestAnimationFrame(loop)
    return () => {
      cancelAnimationFrame(raf)
      lenis.destroy()
      window.__lenis = null
    }
  }, [])
  return null
}
