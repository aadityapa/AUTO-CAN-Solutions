import { useEffect, useState } from 'react'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/** Soft brand-colored light that trails the cursor across the whole page.
 *  Skipped entirely on touch devices and for reduced-motion users. */
export default function CursorGlow() {
  const [enabled, setEnabled] = useState(false)
  const x = useMotionValue(-500)
  const y = useMotionValue(-500)
  const sx = useSpring(x, { stiffness: 90, damping: 20, mass: 0.5 })
  const sy = useSpring(y, { stiffness: 90, damping: 20, mass: 0.5 })

  useEffect(() => {
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    if (isCoarse || reducedMotion) return
    setEnabled(true)
    const move = (e) => { x.set(e.clientX); y.set(e.clientY) }
    window.addEventListener('mousemove', move)
    return () => window.removeEventListener('mousemove', move)
  }, [x, y])

  if (!enabled) return null

  return (
    <motion.div
      aria-hidden
      style={{
        position: 'fixed',
        left: sx,
        top: sy,
        translateX: '-50%',
        translateY: '-50%',
        width: 460,
        height: 460,
        borderRadius: '50%',
        pointerEvents: 'none',
        zIndex: 0,
        mixBlendMode: 'screen',
        background:
          'radial-gradient(circle, rgba(129,140,248,0.12), rgba(34,211,238,0.06) 40%, transparent 68%)',
        filter: 'blur(6px)',
      }}
    />
  )
}
