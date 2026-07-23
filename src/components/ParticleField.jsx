import { useEffect, useRef } from 'react'

/**
 * Lightweight animated constellation — floating nodes connected by lines,
 * with a subtle parallax pull toward the cursor. Pure canvas, no deps.
 * Renders a single static frame for reduced-motion users and pauses
 * the animation loop while the canvas is scrolled out of view.
 */
export default function ParticleField({ density = 66, className = '', style }) {
  const canvasRef = useRef(null)

  useEffect(() => {
    const canvas = canvasRef.current
    const ctx = canvas.getContext('2d')
    const reducedMotion = window.matchMedia('(prefers-reduced-motion: reduce)').matches
    const isCoarse = window.matchMedia('(pointer: coarse)').matches
    let raf
    let visible = true
    let w, h, dpr
    const mouse = { x: -9999, y: -9999 }
    let particles = []

    const resize = () => {
      dpr = Math.min(window.devicePixelRatio || 1, 2)
      const rect = canvas.getBoundingClientRect()
      w = rect.width
      h = rect.height
      canvas.width = w * dpr
      canvas.height = h * dpr
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0)
      // fewer particles on mobile — the O(n²) line pass is the hot loop
      const budget = isCoarse ? 60 : 120
      const count = Math.round((w * h) / 16000 * (density / 66))
      particles = Array.from({ length: Math.max(24, Math.min(count, budget)) }, () => ({
        x: Math.random() * w,
        y: Math.random() * h,
        vx: (Math.random() - 0.5) * 0.35,
        vy: (Math.random() - 0.5) * 0.35,
        r: Math.random() * 1.8 + 0.6,
        c: Math.random() > 0.5 ? '129,140,248' : '34,211,238',
      }))
    }

    const draw = () => {
      ctx.clearRect(0, 0, w, h)
      for (let i = 0; i < particles.length; i++) {
        const p = particles[i]
        p.x += p.vx
        p.y += p.vy
        if (p.x < 0 || p.x > w) p.vx *= -1
        if (p.y < 0 || p.y > h) p.vy *= -1

        // gentle cursor attraction
        const dx = mouse.x - p.x
        const dy = mouse.y - p.y
        const dist = Math.hypot(dx, dy)
        if (dist < 140) {
          p.x += dx * 0.0016 * (1 - dist / 140)
          p.y += dy * 0.0016 * (1 - dist / 140)
        }

        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(${p.c},0.9)`
        ctx.fill()

        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const d = Math.hypot(p.x - q.x, p.y - q.y)
          if (d < 118) {
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.strokeStyle = `rgba(120,150,220,${0.14 * (1 - d / 118)})`
            ctx.lineWidth = 1
            ctx.stroke()
          }
        }
      }
      if (visible) raf = requestAnimationFrame(draw)
    }

    const onMove = (e) => {
      const rect = canvas.getBoundingClientRect()
      mouse.x = e.clientX - rect.left
      mouse.y = e.clientY - rect.top
    }
    const onLeave = () => { mouse.x = -9999; mouse.y = -9999 }

    resize()

    if (reducedMotion) {
      // Static constellation: draw a single frame, no animation loop
      visible = false
      draw()
    } else {
      draw()
    }

    // Pause the loop when the canvas scrolls out of view
    const io = new IntersectionObserver(([entry]) => {
      if (reducedMotion) return
      const nowVisible = entry.isIntersecting
      if (nowVisible && !visible) { visible = true; raf = requestAnimationFrame(draw) }
      else if (!nowVisible) { visible = false; cancelAnimationFrame(raf) }
    })
    io.observe(canvas)

    window.addEventListener('resize', resize)
    if (!isCoarse) window.addEventListener('mousemove', onMove)
    canvas.addEventListener('mouseleave', onLeave)
    return () => {
      cancelAnimationFrame(raf)
      io.disconnect()
      window.removeEventListener('resize', resize)
      window.removeEventListener('mousemove', onMove)
      canvas.removeEventListener('mouseleave', onLeave)
    }
  }, [density])

  return <canvas ref={canvasRef} className={className} style={{ width: '100%', height: '100%', display: 'block', ...style }} aria-hidden />
}
