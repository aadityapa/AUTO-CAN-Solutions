import { useEffect, useRef } from 'react'

/**
 * Premium ambient layer — deep, luxurious light pools that drift and blend
 * like ink suspended in still water.
 *
 * Motion is STRICTLY continuous: every position comes from smooth sine/cosine
 * curves with no modulo wrapping, no respawns and no random values, so nothing
 * can ever jump, pop or flash. Opacity is constant per pool — the only change
 * is slow positional drift, which the eye reads as calm, expensive movement.
 *
 * Canvas 2D, GPU-friendly (a handful of large radial gradients), capped DPR,
 * paused when the tab is hidden, and rendered as a single still frame for
 * prefers-reduced-motion users.
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d', { alpha: true })
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let raf, w, h, dpr

    // Rich, restrained palette — deep sapphire, teal and royal indigo.
    // ax/ay = drift amplitude (fraction of viewport), fx/fy = drift speed.
    // Amplitudes are wide but motion is slow: luxurious, never busy.
    const pools = [
      { rgb: [ 56, 152, 224], sx: 0.24, sy: 0.26, ax: 0.13, ay: 0.09, fx: 0.055, fy: 0.041, ph: 0.0, r: 0.62, a: 0.16 },
      { rgb: [ 79,  92, 214], sx: 0.76, sy: 0.30, ax: 0.11, ay: 0.10, fx: 0.043, fy: 0.062, ph: 1.9, r: 0.66, a: 0.15 },
      { rgb: [ 34, 168, 176], sx: 0.52, sy: 0.76, ax: 0.14, ay: 0.08, fx: 0.037, fy: 0.052, ph: 3.6, r: 0.58, a: 0.13 },
      { rgb: [ 24, 190, 214], sx: 0.34, sy: 0.58, ax: 0.10, ay: 0.11, fx: 0.066, fy: 0.033, ph: 5.1, r: 0.44, a: 0.10 },
      { rgb: [122, 132, 236], sx: 0.68, sy: 0.66, ax: 0.12, ay: 0.09, fx: 0.048, fy: 0.058, ph: 2.7, r: 0.40, a: 0.09 },
    ]

    const draw = (timeMs) => {
      const t = timeMs / 1000
      ctx.clearRect(0, 0, w, h)
      ctx.globalCompositeOperation = 'lighter'   // pigments blend, never flicker
      const maxSide = Math.max(w, h)
      for (const p of pools) {
        // Pure continuous curves — bounded, smooth, no wrap-around jumps.
        const cx = (p.sx + Math.sin(t * p.fx * Math.PI * 2 + p.ph) * p.ax) * w
        const cy = (p.sy + Math.cos(t * p.fy * Math.PI * 2 + p.ph * 1.3) * p.ay) * h
        const rad = p.r * maxSide
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const [r, gc, b] = p.rgb
        g.addColorStop(0,    `rgba(${r},${gc},${b},${p.a})`)
        g.addColorStop(0.42, `rgba(${r},${gc},${b},${p.a * 0.55})`)
        g.addColorStop(0.72, `rgba(${r},${gc},${b},${p.a * 0.18})`)
        g.addColorStop(1,    `rgba(${r},${gc},${b},0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2)
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = Math.round(w * dpr)
      canvas.height = Math.round(h * dpr)
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      if (reduced) draw(0)
    }

    const frame = (time) => {
      draw(time)
      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (reduced) return
      if (document.hidden) cancelAnimationFrame(raf)
      else raf = requestAnimationFrame(frame)
    }
    document.addEventListener('visibilitychange', onVis)

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
      document.removeEventListener('visibilitychange', onVis)
    }
  }, [])

  return <canvas ref={canvasRef} className="ambient-bg" aria-hidden="true" />
}
