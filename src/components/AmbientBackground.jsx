import { useEffect, useRef } from 'react'

/**
 * "Liquid mixing" ambient layer — replaces the old moonlight/aurora system.
 * Drifting ink-in-water colour pools (indigo · cyan · teal) swirl and blend
 * additively like fluids mixing, with a few slow rising bubbles.
 * Canvas 2D, GPU-friendly (large soft radial gradients), throttled DPR,
 * paused when the tab is hidden. Static frame under prefers-reduced-motion.
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let raf, w, h, dpr
    let bubbles = []

    // fluid colour pools — curved lissajous drift so they fold into each other
    const pools = [
      { rgb: [56, 189, 248],  r: 0.5,  sx: 0.22, sy: 0.2,  ax: 0.2,  ay: 0.13, fx: 0.9,  fy: 1.3, ph: 0.0, a: 0.1 },
      { rgb: [99, 102, 241],  r: 0.55, sx: 0.78, sy: 0.3,  ax: 0.17, ay: 0.16, fx: 1.2,  fy: 0.8, ph: 2.0, a: 0.09 },
      { rgb: [45, 212, 191],  r: 0.45, sx: 0.5,  sy: 0.78, ax: 0.22, ay: 0.12, fx: 0.7,  fy: 1.1, ph: 4.1, a: 0.09 },
      { rgb: [34, 211, 238],  r: 0.34, sx: 0.35, sy: 0.5,  ax: 0.14, ay: 0.18, fx: 1.4,  fy: 0.6, ph: 1.1, a: 0.07 },
      { rgb: [129, 140, 248], r: 0.3,  sx: 0.66, sy: 0.62, ax: 0.16, ay: 0.14, fx: 0.8,  fy: 1.5, ph: 3.2, a: 0.06 },
    ]

    const buildBubbles = () => {
      bubbles = []
      const count = coarse ? 14 : 26
      for (let i = 0; i < count; i++) {
        bubbles.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.8 + Math.random() * 2.2,
          v: 6 + Math.random() * 14,          // px per second upward
          drift: (Math.random() - 0.5) * 8,
          a: 0.06 + Math.random() * 0.16,
        })
      }
    }

    const drawPools = (time) => {
      ctx.globalCompositeOperation = 'lighter'    // colours mix like inks
      const T = time * 0.00006
      for (const p of pools) {
        const cx = (p.sx + Math.sin(T * 1000 * p.fx + p.ph) * p.ax) * w
        const cy = (p.sy + Math.cos(T * 820 * p.fy + p.ph * 1.7) * p.ay) * h
        const rad = p.r * Math.max(w, h)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const [r, gc, b] = p.rgb
        g.addColorStop(0, `rgba(${r},${gc},${b},${p.a})`)
        g.addColorStop(0.55, `rgba(${r},${gc},${b},${p.a * 0.4})`)
        g.addColorStop(1, `rgba(${r},${gc},${b},0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2)
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const drawBubbles = (dt) => {
      for (const b of bubbles) {
        b.y -= b.v * dt
        b.x += b.drift * dt
        if (b.y < -6) { b.y = h + 6; b.x = Math.random() * w }
        ctx.beginPath()
        ctx.arc(b.x, b.y, b.r, 0, Math.PI * 2)
        ctx.strokeStyle = `rgba(190,235,255,${b.a})`
        ctx.lineWidth = 1
        ctx.stroke()
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, coarse ? 1.25 : 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildBubbles()
      if (reduced) {
        ctx.clearRect(0, 0, w, h)
        drawPools(0)
      }
    }

    let prev = 0
    const frame = (time) => {
      const dt = Math.min((time - prev) / 1000, 0.05) || 0.016
      prev = time
      ctx.clearRect(0, 0, w, h)
      drawPools(time)
      drawBubbles(dt)
      raf = requestAnimationFrame(frame)
    }

    resize()
    window.addEventListener('resize', resize)
    if (!reduced) raf = requestAnimationFrame(frame)

    const onVis = () => {
      if (reduced) return
      if (document.hidden) cancelAnimationFrame(raf)
      else { prev = performance.now(); raf = requestAnimationFrame(frame) }
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
