import { motion } from 'framer-motion'

const container = {
  hidden: {},
  show: { transition: { staggerChildren: 0.09, delayChildren: 0.1 } },
}
const word = {
  hidden: { opacity: 0, y: '0.5em', rotateX: -60 },
  show: {
    opacity: 1,
    y: '0em',
    rotateX: 0,
    transition: { duration: 0.7, ease: [0.22, 1, 0.36, 1] },
  },
}

/**
 * Animates a heading word-by-word with a 3D flip-up.
 * `segments` = array of { text, gradient?:bool }.
 */
export default function AnimatedHeading({ segments, className = '' }) {
  return (
    <motion.h1
      className={className}
      variants={container}
      initial="hidden"
      animate="show"
      style={{ perspective: 800 }}
    >
      {segments.map((seg, si) =>
        seg.text.split(' ').map((wtext, wi) => (
          <motion.span
            key={`${si}-${wi}`}
            variants={word}
            className={seg.gradient ? 'gradient-text' : undefined}
            style={{ display: 'inline-block', transformOrigin: 'bottom', marginRight: '0.28em' }}
          >
            {wtext}
          </motion.span>
        ))
      )}
    </motion.h1>
  )
}
