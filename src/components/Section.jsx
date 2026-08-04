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

/**
 * Section header: eyebrow + heading + optional lead.
 *
 * `title` accepts a small, author-controlled subset of markup so a phrase can
 * carry the brand gradient. It is never derived from user input or a network
 * response, so there is no injection surface — but it is still normalised to
 * <span>/<em>/<br> only, so a future content edit cannot introduce script.
 */
const ALLOWED_MARKUP = /<(?!\/?(?:span|em|br)\b)[^>]*>/gi
const sanitizeTitle = (html) =>
  String(html)
    .replace(ALLOWED_MARKUP, '')
    .replace(/\son\w+\s*=\s*(?:"[^"]*"|'[^']*'|[^\s>]+)/gi, '')

export function SectionHeader({ eyebrow, title, lead, align = 'left', headingId, as: Heading = 'h2' }) {
  return (
    <Reveal className={`section-head ${align === 'center' ? 'center mx-auto' : ''}`}>
      {eyebrow && <span className="eyebrow">{eyebrow}</span>}
      <Heading
        id={headingId}
        className="section-title"
        dangerouslySetInnerHTML={{ __html: sanitizeTitle(title) }}
      />
      {lead && (
        <p
          className="section-lead"
          style={align === 'center' ? { marginLeft: 'auto', marginRight: 'auto' } : undefined}
        >
          {lead}
        </p>
      )}
    </Reveal>
  )
}
