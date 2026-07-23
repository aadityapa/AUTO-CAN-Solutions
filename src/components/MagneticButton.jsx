import { useRef } from 'react'
import { Link } from 'react-router-dom'
import { motion, useMotionValue, useSpring } from 'framer-motion'

/**
 * Button/link that is magnetically pulled toward the cursor.
 * Use `to` to render a react-router Link, otherwise a <button>.
 */
export default function MagneticButton({ children, to, className = '', strength = 0.4, ...rest }) {
  const ref = useRef(null)
  const x = useMotionValue(0)
  const y = useMotionValue(0)
  const sx = useSpring(x, { stiffness: 220, damping: 14 })
  const sy = useSpring(y, { stiffness: 220, damping: 14 })

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
    const mx = e.clientX - (rect.left + rect.width / 2)
    const my = e.clientY - (rect.top + rect.height / 2)
    x.set(mx * strength)
    y.set(my * strength)
  }
  const reset = () => { x.set(0); y.set(0) }

  const Comp = to ? motion(Link) : motion.button
  const linkProps = to ? { to } : {}

  return (
    <Comp
      ref={ref}
      className={className}
      onMouseMove={handleMove}
      onMouseLeave={reset}
      style={{ x: sx, y: sy }}
      {...linkProps}
      {...rest}
    >
      {children}
    </Comp>
  )
}
