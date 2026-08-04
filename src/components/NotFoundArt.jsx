import { useEffect, useRef, useState } from 'react'

/**
 * "Signal lost" — animated network diagram for the 404 page.
 *
 * A cool data pulse travels the bus, breaks at the missing node (brief warm
 * spark + water ripple), then the loop resets. Pure SVG + CSS; it stills
 * completely under prefers-reduced-motion.
 *
 * Accessibility: the SVG itself is decorative (`aria-hidden`) because it
 * restates the headline. The "reconnect" affordance is a real <button>
 * layered over the broken node — an interactive element nested inside an
 * `role="img"` graphic would be an ARIA violation, and a native button gets
 * keyboard, focus ring and announcement behaviour for free.
 */
export default function NotFoundArt() {
  const [reconnecting, setReconnecting] = useState(false)
  const timer = useRef(null)

  useEffect(() => () => clearTimeout(timer.current), [])

  const tryReconnect = () => {
    if (reconnecting) return
    setReconnecting(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setReconnecting(false), 1600)
  }

  return (
    <div className={`nf-art ${reconnecting ? 'is-reconnecting' : ''}`}>
      <svg viewBox="0 0 640 300" className="nf-art__svg" aria-hidden="true" focusable="false">
        {/* big 404 woven into the diagram */}
        <text x="320" y="120" textAnchor="middle" className="nf-404">4<tspan className="nf-404__zero">0</tspan>4</text>

        {/* network bus */}
        <line x1="40" y1="210" x2="270" y2="210" className="sdg-ln" />
        <line x1="370" y1="210" x2="600" y2="210" className="sdg-ln nf-art__dead" />
        <path d="M306 196 l28 28 M334 196 l-28 28" className="nf-break" />

        {/* nodes */}
        <circle cx="40" cy="210" r="10" className="sdg-node" />
        <circle cx="40" cy="210" r="3.5" className="sdg-core" />
        <text x="40" y="242" textAnchor="middle" className="sdg-lbl">SOURCE</text>

        <g className="nf-broken">
          <circle cx="320" cy="210" r="13" className="nf-broken__node" />
          <text x="320" y="245" textAnchor="middle" className="sdg-lbl">ROUTE NOT FOUND</text>
          <circle cx="320" cy="210" r="14" className="nf-ripple" />
          <circle cx="320" cy="210" r="14" className="nf-ripple nf-ripple--2" />
          <g className="nf-spark">
            <path d="M320 196 v-9 M330 200 l6 -7 M310 200 l-6 -7" />
          </g>
          <path d="M280 210 C 300 178, 340 178, 360 210" className="nf-arc" />
        </g>

        <circle cx="600" cy="210" r="10" className="sdg-node nf-art__dim" />
        <circle cx="600" cy="210" r="3.5" className="sdg-core nf-art__dim" />
        <text x="600" y="242" textAnchor="middle" className="sdg-lbl">DESTINATION</text>

        <circle className="nf-pulse" r="4" />
      </svg>

      {/* Real control, positioned over the broken node in the diagram */}
      <button
        type="button"
        className="nf-art__reconnect"
        onClick={tryReconnect}
        aria-live="polite"
      >
        <span className="sr-only">
          {reconnecting ? 'Attempting to reconnect the broken route…' : 'Attempt to reconnect the broken route'}
        </span>
      </button>
    </div>
  )
}
