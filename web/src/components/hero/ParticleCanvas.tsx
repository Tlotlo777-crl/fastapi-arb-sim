'use client'
import { useEffect, useRef } from 'react'

interface Particle {
  x: number; y: number
  vx: number; vy: number
  radius: number; alpha: number; life: number; maxLife: number
  color: string
}

const COLORS = ['rgba(249,115,22,', 'rgba(251,146,60,', 'rgba(30,64,175,', 'rgba(96,165,250,']

export function ParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null)

  useEffect(() => {
    const canvas = canvasRef.current
    if (!canvas) return
    const ctx = canvas.getContext('2d')
    if (!ctx) return

    let raf: number
    const particles: Particle[] = []

    function resize() {
      if (!canvas) return
      canvas.width  = canvas.offsetWidth
      canvas.height = canvas.offsetHeight
    }
    resize()
    window.addEventListener('resize', resize)

    function spawn(): Particle {
      const c = COLORS[Math.floor(Math.random() * COLORS.length)]
      return {
        x:       Math.random() * (canvas?.width  ?? 1920),
        y:       Math.random() * (canvas?.height ?? 1080),
        vx:      (Math.random() - 0.5) * 0.4,
        vy:      (Math.random() - 0.5) * 0.4,
        radius:  Math.random() * 2 + 0.5,
        alpha:   0,
        life:    0,
        maxLife: Math.random() * 300 + 200,
        color:   c,
      }
    }

    // Seed particles
    for (let i = 0; i < 80; i++) {
      const p = spawn()
      p.life = Math.random() * p.maxLife
      p.alpha = Math.sin((p.life / p.maxLife) * Math.PI) * 0.6
      particles.push(p)
    }

    function draw() {
      if (!ctx || !canvas) return
      ctx.clearRect(0, 0, canvas.width, canvas.height)

      // Spawn new
      if (particles.length < 120) particles.push(spawn())

      for (let i = particles.length - 1; i >= 0; i--) {
        const p = particles[i]
        p.x += p.vx; p.y += p.vy; p.life++

        const ratio = p.life / p.maxLife
        p.alpha = Math.sin(ratio * Math.PI) * 0.55

        if (p.life >= p.maxLife) { particles.splice(i, 1); continue }

        ctx.save()
        ctx.globalAlpha = p.alpha
        ctx.beginPath()
        ctx.arc(p.x, p.y, p.radius, 0, Math.PI * 2)
        ctx.fillStyle = p.color + p.alpha + ')'
        ctx.fill()
        ctx.restore()

        // Connect nearby particles
        for (let j = i + 1; j < particles.length; j++) {
          const q = particles[j]
          const dx = p.x - q.x, dy = p.y - q.y
          const dist = Math.sqrt(dx * dx + dy * dy)
          if (dist < 90) {
            ctx.save()
            ctx.globalAlpha = ((1 - dist / 90) * 0.12) * Math.min(p.alpha, q.alpha)
            ctx.strokeStyle = 'rgba(249,115,22,1)'
            ctx.lineWidth = 0.5
            ctx.beginPath()
            ctx.moveTo(p.x, p.y)
            ctx.lineTo(q.x, q.y)
            ctx.stroke()
            ctx.restore()
          }
        }
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
      ref={canvasRef}
      className="absolute inset-0 w-full h-full pointer-events-none"
      style={{ willChange: 'transform', opacity: 0.7 }}
    />
  )
}
