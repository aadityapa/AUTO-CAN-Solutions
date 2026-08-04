import { useEffect, useRef } from 'react'

/**
 * setInterval that pauses while the tab is hidden and respects
 * prefers-reduced-motion. Ambient UI (cycling chips, clocks, HUD readouts)
 * should never keep the main thread — or a laptop battery — busy in a
 * background tab.
 *
 * Pass `delay = null` to disable.
 */
export default function useVisibleInterval(callback, delay, { pauseOnReducedMotion = false } = {}) {
  const saved = useRef(callback)
  useEffect(() => { saved.current = callback }, [callback])

  useEffect(() => {
    if (delay == null) return
    if (pauseOnReducedMotion && window.matchMedia('(prefers-reduced-motion: reduce)').matches) return

    let id = null
    const start = () => { if (id == null) id = setInterval(() => saved.current(), delay) }
    const stop = () => { if (id != null) { clearInterval(id); id = null } }
    const onVis = () => (document.hidden ? stop() : start())

    if (!document.hidden) start()
    document.addEventListener('visibilitychange', onVis)
    return () => { stop(); document.removeEventListener('visibilitychange', onVis) }
  }, [delay, pauseOnReducedMotion])
}
