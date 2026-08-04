import { useEffect, useRef, useState } from 'react'
import { motion, useMotionValue, useSpring, useTransform, useReducedMotion } from 'framer-motion'

/** True only where a real hovering pointer exists — i.e. where tilt is usable. */
function useFinePointer() {
  const [fine, setFine] = useState(false)
  useEffect(() => {
    const mq = window.matchMedia('(hover: hover) and (pointer: fine)')
    setFine(mq.matches)
    const onChange = (e) => setFine(e.matches)
    mq.addEventListener('change', onChange)
    return () => mq.removeEventListener('change', onChange)
  }, [])
  return fine
}

/**
 * 3D pointer-tracking tilt card with a moving light glare.
 * Drop-in replacement for a `.card` div. Pass `intensity` to tune the tilt.
 *
 * Every motion hook is declared unconditionally at the top level (rules of
 * hooks); only the glare *element* renders conditionally. The springs are
 * neutralised on touch devices and for reduced-motion users, where the tilt
 * can never fire and the per-frame work would be pure waste.
 */
export default function TiltCard({
  children,
  className = '',
  intensity = 12,
  glare = true,
  style,
  as: Tag = motion.div,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const fine = useFinePointer()
  const active = fine && !reduced
  const amount = active ? intensity : 0

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })

  const rotateY = useTransform(sx, [0, 1], [-amount, amount])
  const rotateX = useTransform(sy, [0, 1], [amount, -amount])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])
  const glareBg = useTransform(
    [glareX, glareY],
    ([x, y]) =>
      `radial-gradient(220px circle at ${x} ${y}, rgba(255,255,255,0.16), transparent 60%)`
  )

  const handleMove = (e) => {
    const el = ref.current
    if (!el || !active) return
    const rect = el.getBoundingClientRect()
    px.set((e.clientX - rect.left) / rect.width)
    py.set((e.clientY - rect.top) / rect.height)
  }
  const handleLeave = () => {
    px.set(0.5)
    py.set(0.5)
  }

  return (
    <Tag
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={handleLeave}
      style={{
        rotateX,
        rotateY,
        transformStyle: 'preserve-3d',
        transformPerspective: 900,
        ...style,
      }}
      whileHover={active ? { z: 30 } : undefined}
      {...rest}
    >
      <div style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
      {glare && active && (
        <motion.span
          aria-hidden="true"
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: glareBg,
          }}
        />
      )}
    </Tag>
  )
}
