import { useEffect, useRef } from 'react'

/**
 * Cinematic ambient layer — moving aurora ribbons, drifting moonlight
 * orbs and a field of subtle stars. Canvas-based, GPU-friendly
 * (large soft radial gradients + additive blending), throttled DPR,
 * paused when the tab is hidden. Static render for reduced motion.
 */
export default function AmbientBackground() {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reduced = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const coarse = window.matchMedia('(pointer: coarse)').matches
    let raf, w, h, dpr
    let stars = []

    // Aurora ribbons — slow-drifting light pools
    const auroras = [
      { hue: [99, 102, 241], r: 0.52, sx: 0.18, sy: 0.1, ax: 0.16, ay: 0.08, spd: 0.00011, ph: 0, a: 0.1 },
      { hue: [34, 211, 238], r: 0.45, sx: 0.85, sy: 0.2, ax: 0.12, ay: 0.1, spd: 0.00009, ph: 2.1, a: 0.07 },
      { hue: [167, 139, 250], r: 0.5, sx: 0.55, sy: 0.85, ax: 0.18, ay: 0.07, spd: 0.00007, ph: 4.2, a: 0.075 },
      { hue: [199, 210, 254], r: 0.32, sx: 0.32, sy: 0.55, ax: 0.1, ay: 0.12, spd: 0.00013, ph: 1.2, a: 0.05 },
    ]

    const buildStars = () => {
      stars = []
      const count = coarse ? 60 : 110
      for (let i = 0; i < count; i++) {
        stars.push({
          x: Math.random() * w,
          y: Math.random() * h,
          r: 0.4 + Math.random() * 1.1,
          a: 0.12 + Math.random() * 0.4,
        })
      }
    }

    const drawAuroras = (time) => {
      ctx.globalCompositeOperation = 'lighter'
      for (const au of auroras) {
        const cx = (au.sx + Math.sin(time * au.spd * 1000 + au.ph) * au.ax) * w
        const cy = (au.sy + Math.cos(time * au.spd * 820 + au.ph * 1.7) * au.ay) * h
        const rad = au.r * Math.max(w, h)
        const g = ctx.createRadialGradient(cx, cy, 0, cx, cy, rad)
        const [r, gc, b] = au.hue
        g.addColorStop(0, `rgba(${r},${gc},${b},${au.a})`)
        g.addColorStop(1, `rgba(${r},${gc},${b},0)`)
        ctx.fillStyle = g
        ctx.fillRect(cx - rad, cy - rad, rad * 2, rad * 2)
      }
      ctx.globalCompositeOperation = 'source-over'
    }

    const drawStars = () => {
      for (const s of stars) {
        ctx.beginPath()
        ctx.arc(s.x, s.y, s.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(220,230,255,${s.a * 0.7})`
        ctx.fill()
      }
    }

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 1.5)
      w = window.innerWidth
      h = window.innerHeight
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      buildStars()
      if (reduced) {
        ctx.clearRect(0, 0, w, h)
        drawAuroras(0)
        drawStars()
      }
    }

    const frame = (time) => {
      ctx.clearRect(0, 0, w, h)
      drawAuroras(time)
      drawStars()
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
