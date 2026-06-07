import { useEffect, useRef } from 'react'

const COUNT = 90

export default function ParticleCanvas() {
  const ref = useRef(null)

  useEffect(() => {
    const canvas = ref.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    const particles = []
    let raf

    function resize() {
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
      particles.length = 0
      for (let i = 0; i < COUNT; i++) particles.push(make())
    }

    function make() {
      return {
        x:  Math.random() * canvas.width,
        y:  Math.random() * canvas.height,
        vx: (Math.random() - 0.5) * 0.18,
        vy: (Math.random() - 0.5) * 0.18,
        r:  Math.random() * 1.4 + 0.6,
        a:  Math.random() * 0.30 + 0.12,
        phase: Math.random() * Math.PI * 2,
        freq:  Math.random() * 0.012 + 0.004,
      }
    }

    resize()
    window.addEventListener('resize', resize)

    const LINE_DIST = 130

    function draw() {
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      /* connecting lines */
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x
          const dy = particles[i].y - particles[j].y
          const d  = Math.sqrt(dx * dx + dy * dy)
          if (d < LINE_DIST) {
            ctx.strokeStyle = `rgba(0,0,0,${0.09 * (1 - d / LINE_DIST)})`
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(particles[i].x, particles[i].y)
            ctx.lineTo(particles[j].x, particles[j].y)
            ctx.stroke()
          }
        }
      }

      /* dots */
      for (const p of particles) {
        p.phase += p.freq
        const alpha = p.a * (0.55 + 0.45 * Math.sin(p.phase))
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2)
        ctx.fillStyle = `rgba(0,0,0,${alpha.toFixed(3)})`
        ctx.fill()

        p.x += p.vx
        p.y += p.vy
        if (p.x < 0) p.x = canvas.width
        if (p.x > canvas.width)  p.x = 0
        if (p.y < 0) p.y = canvas.height
        if (p.y > canvas.height) p.y = 0
      }

      raf = requestAnimationFrame(draw)
    }

    draw()

    return () => {
      cancelAnimationFrame(raf)
      window.removeEventListener('resize', resize)
    }
  }, [])

  return (
    <canvas
      ref={ref}
      style={{
        position: 'absolute',
        inset: 0,
        width: '100%',
        height: '100%',
        pointerEvents: 'none',
        zIndex: 0,
      }}
    />
  )
}
