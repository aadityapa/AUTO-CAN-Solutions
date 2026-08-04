import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring, useReducedMotion } from 'framer-motion'

/**
 * Button/link that is magnetically pulled toward the cursor.
 * Renders a react-router <Link> when `to` is given, otherwise a <button>.
 *
 * - Buttons default to `type="button"` so they can never accidentally submit
 *   a surrounding form; pass `type="submit"` explicitly when that is intended.
 * - The magnetic pull is skipped entirely for reduced-motion users.
 * - `disabled` is honoured natively (no pointer-events hacks).
 */
export default function MagneticButton({
  children,
  to,
  className = '',
  strength = 0.4,
  type,
  disabled,
  ...rest
}) {
  const ref = useRef(null)
  const reduced = useReducedMotion()
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })

  const handleMove = (e) => {
    const el = ref.current
    if (!el || reduced || disabled) return
    const rect = el.getBoundingClientRect()
    x.set((e.clientX - (rect.left + rect.width / 2)) * strength)
    y.set((e.clientY - (rect.top + rect.height / 2)) * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  const isLink = Boolean(to)
  const Comp = isLink ? motion(Link) : motion.button
  const extraProps = isLink
    ? { to }
    : { type: type || 'button', disabled }

  return (
    <Comp
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      onBlur={reset}
      style={{ x: sx, y: sy }}
      {...extraProps}
      {...rest}
    >
      {children}
    </Comp>
  )
}
