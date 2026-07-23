/**
 * "Data river" — an abstract liquid stream of information flowing
 * between sections. Three layered bezier currents with drifting
 * dashes and a few carried droplets. Pure CSS animation (stroke
 * dashoffset + transform), pauses under prefers-reduced-motion.
 * Decorative only.
 */
export default function DataRiver() {
  return (
    <div className="river" aria-hidden="true">
      <svg viewBox="0 0 1200 120" preserveAspectRatio="none" className="river__svg" focusable="false">
        <defs>
          <linearGradient id="riverGrad" x1="0" y1="0" x2="1" y2="0">
            <stop offset="0" stopColor="rgba(129,140,248,0)" />
            <stop offset="0.18" stopColor="rgba(129,140,248,0.45)" />
            <stop offset="0.55" stopColor="rgba(103,232,249,0.55)" />
            <stop offset="0.85" stopColor="rgba(129,140,248,0.4)" />
            <stop offset="1" stopColor="rgba(129,140,248,0)" />
          </linearGradient>
        </defs>
        <path className="river__stream river__stream--1"
          d="M-20 70 C 180 30, 340 105, 560 68 S 940 28, 1220 62" />
        <path className="river__stream river__stream--2"
          d="M-20 88 C 220 55, 420 118, 640 82 S 1000 48, 1220 84" />
        <path className="river__stream river__stream--3"
          d="M-20 52 C 160 92, 400 30, 620 55 S 980 95, 1220 44" />
      </svg>
    </div>
  )
}
