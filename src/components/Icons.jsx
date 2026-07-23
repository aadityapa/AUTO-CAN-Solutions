/**
 * Crisp inline SVG icon set (replaces emoji for consistent cross-platform
 * rendering). All icons inherit currentColor and are aria-hidden by default.
 */
const base = {
  width: '1em',
  height: '1em',
  viewBox: '0 0 24 24',
  fill: 'none',
  stroke: 'currentColor',
  strokeWidth: 1.8,
  strokeLinecap: 'round',
  strokeLinejoin: 'round',
  'aria-hidden': true,
  focusable: false,
}

export const MailIcon = (p) => (
  <svg {...base} {...p}><rect x="3" y="5" width="18" height="14" rx="2.5" /><path d="m3.5 7 8.5 6 8.5-6" /></svg>
)
export const PinIcon = (p) => (
  <svg {...base} {...p}><path d="M12 21s-7-5.5-7-11a7 7 0 1 1 14 0c0 5.5-7 11-7 11Z" /><circle cx="12" cy="10" r="2.6" /></svg>
)
export const FactoryIcon = (p) => (
  <svg {...base} {...p}><path d="M3 21V9l6 4V9l6 4V4h6v17Z" /><path d="M8 17h.01M12 17h.01M16 17h.01" /></svg>
)
export const HandshakeIcon = (p) => (
  <svg {...base} {...p}><path d="m11 17 2 2a2 2 0 0 0 2.8-2.8l-4.2-4.2m-4.4 4.4L5 14.2a2 2 0 0 1 0-2.8L9.6 6.8a2 2 0 0 1 2.8 0l.4.4m-5.6 7.2 2 2a2 2 0 0 0 2.8 0" /><path d="m18.8 13.8 1.7-1.7a2 2 0 0 0 0-2.8l-4.2-4.2a2 2 0 0 0-2.8 0l-1.1 1.1" /></svg>
)
export const GlobeIcon = (p) => (
  <svg {...base} {...p}><circle cx="12" cy="12" r="9" /><path d="M3 12h18M12 3c2.8 2.6 4 5.8 4 9s-1.2 6.4-4 9c-2.8-2.6-4-5.8-4-9s1.2-6.4 4-9Z" /></svg>
)
export const ShieldIcon = (p) => (
  <svg {...base} {...p}><path d="M12 3 5 6v5c0 4.6 3 8.4 7 10 4-1.6 7-5.4 7-10V6Z" /><path d="m9 12 2 2 4-4" /></svg>
)
export const BoltIcon = (p) => (
  <svg {...base} {...p}><path d="M13 2 4.5 13.5H11L10 22l8.5-11.5H13L13 2Z" /></svg>
)
export const CheckIcon = (p) => (
  <svg {...base} strokeWidth={2.4} {...p}><path d="m5 12.5 4.5 4.5L19 7.5" /></svg>
)
