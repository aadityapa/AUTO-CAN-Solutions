/**
 * Word-by-word 3D flip-up heading.
 *
 * Deliberately CSS-driven rather than JS-driven: this is the LCP element on
 * the home page, and a Framer entrance would hold it at opacity 0 until React
 * hydrates — on a throttled phone that pushed LCP past 6s. A CSS keyframe
 * starts painting on the very first frame the stylesheet lands, so the
 * heading is visible immediately whether or not JS has arrived.
 *
 * `segments` = array of { text, gradient?:bool }.
 */
export default function AnimatedHeading({ segments, className = '', as: Tag = 'h1' }) {
  let index = 0
  return (
    <Tag className={`${className} anim-head`}>
      {segments.map((seg, si) =>
        seg.text.split(' ').map((wtext, wi) => {
          const i = index++
          return (
            <span
              key={`${si}-${wi}`}
              className={`anim-head__w${seg.gradient ? ' gradient-text' : ''}`}
              style={{ animationDelay: `${0.06 + i * 0.045}s` }}
            >
              {wtext}
            </span>
          )
        })
      )}
    </Tag>
  )
}
