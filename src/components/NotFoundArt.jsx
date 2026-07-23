import { useState, useRef } from 'react'

/**
 * "Signal lost" — animated network diagram for the 404 page.
 * A cool data pulse travels the bus, breaks at the missing node
 * (brief warm spark + water ripple), then the loop resets.
 * Clicking / tapping the broken node plays a one-shot "reconnect"
 * attempt. Pure SVG + CSS; stills completely under reduced motion.
 */
export default function NotFoundArt() {
  const [reconnecting, setReconnecting] = useState(false)
  const timer = useRef(null)
  const tryReconnect = () => {
    if (reconnecting) return
    setReconnecting(true)
    clearTimeout(timer.current)
    timer.current = setTimeout(() => setReconnecting(false), 1600)
  }
  return (
    <div className={`nf-art ${reconnecting ? 'is-reconnecting' : ''}`}>
      <svg viewBox="0 0 640 300" className="nf-art__svg" role="img"
        aria-label="Diagram of a data signal failing to reach a missing network node — page not found">
        {/* big 404 woven into the diagram */}
        <text x="320" y="120" textAnchor="middle" className="nf-404">4<tspan className="nf-404__zero">0</tspan>4</text>

        {/* network bus */}
        <line x1="40" y1="210" x2="270" y2="210" className="sdg-ln" />
        <line x1="370" y1="210" x2="600" y2="210" className="sdg-ln nf-art__dead" />
        {/* break marks */}
        <path d="M306 196 l28 28 M334 196 l-28 28" className="nf-break" />

        {/* nodes */}
        <circle cx="40" cy="210" r="10" className="sdg-node" />
        <circle cx="40" cy="210" r="3.5" className="sdg-core" />
        <text x="40" y="242" textAnchor="middle" className="sdg-lbl">SOURCE</text>

        <g className="nf-broken" onClick={tryReconnect} role="button" tabIndex="0" aria-label="Attempt to reconnect the broken node"
          onKeyDown={(e) => { if (e.key === 'Enter' || e.key === ' ') { e.preventDefault(); tryReconnect() } }}>
          <circle cx="320" cy="210" r="13" className="nf-broken__node" />
          <text x="320" y="245" textAnchor="middle" className="sdg-lbl">ROUTE NOT FOUND</text>
          {/* ripple + spark live at the break */}
          <circle cx="320" cy="210" r="14" className="nf-ripple" />
          <circle cx="320" cy="210" r="14" className="nf-ripple nf-ripple--2" />
          <g className="nf-spark">
            <path d="M320 196 v-9 M330 200 l6 -7 M310 200 l-6 -7" />
          </g>
          {/* reconnect arc, shown on click */}
          <path d="M280 210 C 300 178, 340 178, 360 210" className="nf-arc" />
        </g>

        <circle cx="600" cy="210" r="10" className="sdg-node nf-art__dim" />
        <circle cx="600" cy="210" r="3.5" className="sdg-core nf-art__dim" />
        <text x="600" y="242" textAnchor="middle" className="sdg-lbl">DESTINATION</text>

        {/* travelling pulse (stops at the break) */}
        <circle className="nf-pulse" r="4" />
      </svg>
    </div>
  )
}
