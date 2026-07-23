/**
 * Original technical SVG illustrations for the six service lines.
 * One shared visual language: thin precision lines, graphite surfaces,
 * moonlight/frost strokes, a travelling cyan data signal, and a brief
 * warm "validated" pulse at the destination (the water × fire moment).
 * All diagrams are decorative (aria-hidden) and animate via CSS only,
 * so prefers-reduced-motion instantly stills them.
 */

const S = { className: 'sdg', viewBox: '0 0 320 150', 'aria-hidden': true, focusable: false }

/* 01 — Embedded SW Stacks: layered AUTOSAR-style architecture */
export function StackDiagram() {
  const layers = [
    ['APPLICATION', 18], ['RTE', 44], ['AUTOSAR / BSW', 70], ['MCAL', 96], ['MCU / HW', 122],
  ]
  return (
    <svg {...S}>
      {layers.map(([label, y], i) => (
        <g key={label}>
          <rect x="78" y={y - 9} width="164" height="20" rx="5" className={`sdg-panel ${i === 4 ? 'sdg-panel--deep' : ''}`} />
          <text x="160" y={y + 4.5} textAnchor="middle" className="sdg-lbl">{label}</text>
        </g>
      ))}
      <line x1="160" y1="9" x2="160" y2="141" className="sdg-rail" />
      <circle className="sdg-sig" style={{ '--sx': '160px', '--sy': '6px', '--ex': '160px', '--ey': '130px' }} r="3" />
      <circle cx="160" cy="132" r="6" className="sdg-ignite" />
    </svg>
  )
}

/* 02 — Engineering Tools: connected toolchain */
export function ToolchainDiagram() {
  const nodes = [
    ['REQ', 34], ['DEV', 97], ['BUILD', 160], ['DEBUG', 223], ['VALIDATE', 286],
  ]
  return (
    <svg {...S}>
      <line x1="34" y1="75" x2="286" y2="75" className="sdg-ln" />
      {nodes.map(([label, x], i) => (
        <g key={label}>
          <circle cx={x} cy="75" r="9" className="sdg-node" />
          <circle cx={x} cy="75" r="3" className="sdg-core" />
          <text x={x} y={i % 2 ? 52 : 102} textAnchor="middle" className="sdg-lbl">{label}</text>
        </g>
      ))}
      <circle className="sdg-sig" style={{ '--sx': '34px', '--sy': '75px', '--ex': '286px', '--ey': '75px' }} r="3" />
      <circle cx="286" cy="75" r="9" className="sdg-ignite" />
    </svg>
  )
}

/* 03 — Test Automation: input → engine → ECU → verdict */
export function PipelineDiagram() {
  return (
    <svg {...S}>
      <line x1="42" y1="75" x2="278" y2="75" className="sdg-ln" />
      <circle cx="30" cy="75" r="9" className="sdg-node" />
      <text x="30" y="102" textAnchor="middle" className="sdg-lbl">INPUT</text>
      <rect x="88" y="53" width="66" height="44" rx="9" className="sdg-panel" />
      <text x="121" y="72" textAnchor="middle" className="sdg-lbl">AUTOMATION</text>
      <text x="121" y="84" textAnchor="middle" className="sdg-lbl">ENGINE</text>
      <rect x="182" y="58" width="50" height="34" rx="7" className="sdg-panel" />
      <text x="207" y="79" textAnchor="middle" className="sdg-lbl">ECU</text>
      <circle cx="278" cy="75" r="10" className="sdg-node" />
      <path d="M273.5 75 l3.2 3.4 l6-6.8" className="sdg-check" />
      <text x="278" y="104" textAnchor="middle" className="sdg-lbl">PASS</text>
      <circle className="sdg-sig" style={{ '--sx': '30px', '--sy': '75px', '--ex': '278px', '--ey': '75px' }} r="3" />
      <circle cx="278" cy="75" r="10" className="sdg-ignite" />
    </svg>
  )
}

/* 04 — Test Case Repository: traceability chain */
export function RepoDiagram() {
  const rows = [
    ['REQUIREMENTS', 22], ['TEST CASES', 57], ['EXECUTION', 92], ['RESULTS', 127],
  ]
  return (
    <svg {...S}>
      <line x1="160" y1="22" x2="160" y2="127" className="sdg-ln" />
      {rows.map(([label, y]) => (
        <g key={label}>
          <rect x="96" y={y - 11} width="128" height="22" rx="6" className="sdg-panel" />
          <text x="160" y={y + 4} textAnchor="middle" className="sdg-lbl">{label}</text>
          <line x1="82" y1={y} x2="92" y2={y} className="sdg-tick" />
          <line x1="228" y1={y} x2="238" y2={y} className="sdg-tick" />
        </g>
      ))}
      <circle className="sdg-sig" style={{ '--sx': '160px', '--sy': '20px', '--ex': '160px', '--ey': '124px' }} r="3" />
      <circle cx="160" cy="127" r="6" className="sdg-ignite" />
    </svg>
  )
}

/* 05 — HiL & V&V: closed simulation ↔ ECU loop */
export function HilDiagram() {
  return (
    <svg {...S}>
      <rect x="110" y="10" width="100" height="26" rx="7" className="sdg-panel" />
      <text x="160" y="27" textAnchor="middle" className="sdg-lbl">SIMULATION</text>
      <rect x="122" y="62" width="76" height="26" rx="7" className="sdg-panel sdg-panel--deep" />
      <text x="160" y="79" textAnchor="middle" className="sdg-lbl">HiL / SiL</text>
      <rect x="130" y="114" width="60" height="26" rx="7" className="sdg-panel" />
      <text x="160" y="131" textAnchor="middle" className="sdg-lbl">ECU</text>
      {/* loop rails */}
      <path d="M110 23 H74 V127 h56" className="sdg-ln" />
      <path d="M210 23 h36 V127 h-56" className="sdg-ln" />
      <text x="52" y="79" textAnchor="middle" className="sdg-lbl sdg-lbl--side">SENSORS</text>
      <text x="272" y="79" textAnchor="middle" className="sdg-lbl sdg-lbl--side">ACTUATORS</text>
      <circle className="sdg-sig sdg-sig--loopL" r="3" />
      <circle className="sdg-sig sdg-sig--loopR" r="3" />
      <circle cx="160" cy="75" r="7" className="sdg-ignite" />
    </svg>
  )
}

/* 06 — Embedded Hardware: abstract ECU board */
export function HardwareDiagram() {
  const pads = [
    ['CAN', 30, 40, 96, 40], ['LIN', 30, 75, 96, 75], ['PWR', 30, 110, 96, 110],
    ['I/O', 290, 40, 224, 40], ['MEM', 290, 75, 224, 75], ['SNS', 290, 110, 224, 110],
  ]
  return (
    <svg {...S}>
      <rect x="58" y="16" width="204" height="118" rx="12" className="sdg-board" />
      <rect x="126" y="47" width="68" height="56" rx="8" className="sdg-panel sdg-panel--deep" />
      <text x="160" y="72" textAnchor="middle" className="sdg-lbl">MCU</text>
      <text x="160" y="86" textAnchor="middle" className="sdg-lbl sdg-lbl--side">32-BIT</text>
      {pads.map(([label, tx, ty, px2, py2]) => (
        <g key={label + ty}>
          <line x1={tx < 160 ? 96 : 224} y1={py2} x2={tx < 160 ? 126 : 194} y2={py2 === 40 ? 55 : py2 === 110 ? 95 : 75} className="sdg-ln" />
          <circle cx={tx < 160 ? 96 : 224} cy={py2} r="3.4" className="sdg-node" />
          <text x={tx} y={ty + 4} textAnchor="middle" className="sdg-lbl sdg-lbl--side">{label}</text>
        </g>
      ))}
      <circle className="sdg-sig" style={{ '--sx': '96px', '--sy': '40px', '--ex': '126px', '--ey': '55px' }} r="3" />
      <circle cx="160" cy="75" r="5" className="sdg-ignite" style={{ animationDelay: '2.2s' }} />
    </svg>
  )
}

/* Map by service number used in src/data/site.js */
export const serviceDiagrams = {
  '01': <StackDiagram />,
  '02': <ToolchainDiagram />,
  '03': <PipelineDiagram />,
  '04': <RepoDiagram />,
  '05': <HilDiagram />,
  '06': <HardwareDiagram />,
}
