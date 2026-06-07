import { useEffect, useState } from 'react'
import ParticleCanvas from './ParticleCanvas'
import { IconArrowRight } from './Icons'
import './Hero.css'

const cycleWords = [
  { text: 'DEVELOPER',  color: '#E07B00', variant: 'filled'   }, // orange fill
  { text: 'ENGINEER',   color: '#0D0D0D', variant: 'outline'  }, // stroke only, no fill
  { text: 'BUILDER',    color: '#A78BFA', variant: 'serif'    }, // vibrant lavender
  { text: 'CREATOR',    color: '#800000', variant: 'outlined'  }, // maroon fill + dark stroke border
  { text: 'INNOVATOR',  color: '#059669', variant: 'wide'     }, // letter-spaced condensed
]

export default function Hero() {
  const [loaded, setLoaded]       = useState(false)
  const [displayIdx, setDisplayIdx] = useState(0)
  const [exiting, setExiting]     = useState(false)

  useEffect(() => {
    const t1 = setTimeout(() => setLoaded(true), 80)
    const interval = setInterval(() => {
      setExiting(true)
      setTimeout(() => {
        setDisplayIdx(i => (i + 1) % cycleWords.length)
        setExiting(false)
      }, 320)
    }, 2800)
    return () => { clearTimeout(t1); clearInterval(interval) }
  }, [])

  const scroll = (href) => {
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  const word = cycleWords[displayIdx]

  return (
    <section id="home" className="hero">
      <ParticleCanvas />
      <div className="hero__orb hero__orb--1" aria-hidden="true" />
      <div className="hero__orb hero__orb--2" aria-hidden="true" />

      <div className={`hero__inner container${loaded ? ' hero--loaded' : ''}`}>

        {/* Eyebrow pill */}
        <div className="hero__eyebrow">
          <span className="hero__dot" />
          Open to Hire &nbsp;·&nbsp; BCU CS Student
        </div>

        {/* Massive centered name — like "CENTAURI" */}
        <h1 className="hero__name">YASAMIN ZAID</h1>

        {/* Role subtitle */}
        <p className="hero__role">
          Vice President of Software Engineering at{' '}
          <a href="https://bcusca.org" target="_blank" rel="noopener noreferrer" className="hero__role-link">SCA</a>
        </p>

        {/* Thin editorial rule */}
        <div className="hero__rule" />

        {/* Cycling statement — each word has its own typographic treatment */}
        <div className="hero__statement" aria-live="polite">
          <span className="hero__stmt-pre">A FULL STACK</span>
          <div className="hero__stmt-word-wrap">
            <span
              key={displayIdx}
              className={`hero__stmt-word hero__stmt-word--${word.variant}${exiting ? ' hero__stmt-word--exit' : ''}`}
              style={{ '--wc': word.color }}
            >
              {word.text}
            </span>
          </div>
          <span className="hero__stmt-suf">READY TO BUILD.</span>
        </div>

        {/* Thin editorial rule */}
        <div className="hero__rule" />

        {/* Bio */}
        <p className="hero__body">
          Second-year Computer Science student at Birmingham City University.
          I build real things — not just assignments. Team-focused,
          problem-driven, and always shipping.
        </p>

        {/* CTAs */}
        <div className="hero__actions">
          <button className="btn btn-primary hero__cta-main" onClick={() => scroll('#contact')}>
            Hire Me <IconArrowRight size={16} />
          </button>
          <button className="btn btn-secondary" onClick={() => scroll('#projects')}>
            View Projects
          </button>
        </div>

        {/* Inline stats strip */}
        <div className="hero__stats">
          <span className="hero__stat-item">
            <strong>2nd</strong> Innovation Fest
          </span>
          <span className="hero__stat-sep" />
          <span className="hero__stat-item">
            <strong>9+</strong> Certificates
          </span>
          <span className="hero__stat-sep" />
          <span className="hero__stat-item">
            <strong>Full Stack</strong> Dev
          </span>
          <span className="hero__stat-sep" />
          <span className="hero__stat-item">
            BCU <strong>Class 2027</strong>
          </span>
        </div>

      </div>

      {/* Marquee tech strip */}
      <div className="hero__marquee" aria-hidden="true">
        <div className="hero__marquee-track">
          {[
            'React','Python','Java','SQL','Linux','Git',
            'Node.js','CSS','HTML','Kali Linux','REST APIs','Figma',
            'React','Python','Java','SQL','Linux','Git',
            'Node.js','CSS','HTML','Kali Linux','REST APIs','Figma',
            'React','Python','Java','SQL','Linux','Git',
            'Node.js','CSS','HTML','Kali Linux','REST APIs','Figma',
          ].map((t, i) => (
            <span key={i} className="hero__marquee-item">
              <span className="hero__marquee-dot" />
              {t}
            </span>
          ))}
        </div>
      </div>

    </section>
  )
}
