import { useRef } from 'react'
import { motion, useMotionValue, useSpring, useTransform } from 'framer-motion'

/**
 * 3D pointer-tracking tilt card with a moving light glare.
 * Drop-in replacement for a `.card` div. Pass `intensity` to tune the tilt.
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

  const px = useMotionValue(0.5)
  const py = useMotionValue(0.5)

  const sx = useSpring(px, { stiffness: 180, damping: 18 })
  const sy = useSpring(py, { stiffness: 180, damping: 18 })

  const rotateY = useTransform(sx, [0, 1], [-intensity, intensity])
  const rotateX = useTransform(sy, [0, 1], [intensity, -intensity])
  const glareX = useTransform(sx, [0, 1], ['0%', '100%'])
  const glareY = useTransform(sy, [0, 1], ['0%', '100%'])

  const handleMove = (e) => {
    const rect = ref.current.getBoundingClientRect()
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
      whileHover={{ z: 30 }}
      {...rest}
    >
      <div style={{ transform: 'translateZ(28px)', transformStyle: 'preserve-3d' }}>
        {children}
      </div>
      {glare && (
        <motion.span
          aria-hidden
          style={{
            position: 'absolute',
            inset: 0,
            borderRadius: 'inherit',
            pointerEvents: 'none',
            background: useTransform(
              [glareX, glareY],
              ([x, y]) =>
                `radial-gradient(220px circle at ${x} ${y}, rgba(255,255,255,0.16), transparent 60%)`
            ),
          }}
        />
      )}
    </Tag>
  )
}
