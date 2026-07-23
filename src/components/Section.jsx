import { motion } from 'framer-motion'
import { fadeUp, stagger, viewport } from './motionPresets'

// Wraps content in a scroll-reveal container.
export function Reveal({ children, className = '', variants = fadeUp, ...rest }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// Staggered group — children should use `fadeUp` (or the shared item variant).
export function RevealGroup({ children, className = '', variants = stagger, ...rest }) {
  return (
    <motion.div
      variants={variants}
      initial="hidden"
      whileInView="show"
      viewport={viewport}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  )
}

// Section header block: eyebrow + title + optional lead.
export function SectionHeader({ eyebrow, title, lead, align = 'left' }) {
  return (
    <Reveal className={`section-head ${align === 'center' ? 'center mx-auto' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <h2 className="section-title" dangerouslySetInnerHTML={{ __html: title }} />
      {lead && <p className="section-lead" style={align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}>{lead}</p>}
    </Reveal>
  )
}
