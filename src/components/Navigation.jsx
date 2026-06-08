import { useState, useEffect } from 'react'
import './Navigation.css'

const links = [
  { label: 'Home', href: '#home' },
  { label: 'About', href: '#about' },
  { label: 'Skills', href: '#skills' },
  { label: 'Projects', href: '#projects' },
  { label: 'Education', href: '#education' },
  { label: 'Experience', href: '#experience' },
  { label: 'Certificates', href: '#certificates' },
  { label: 'Contact', href: '#contact' },
]

export default function Navigation() {
  const [scrolled, setScrolled] = useState(false)
  const [menuOpen, setMenuOpen] = useState(false)
  const [active, setActive] = useState('home')

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24)
    window.addEventListener('scroll', onScroll, { passive: true })
    return () => window.removeEventListener('scroll', onScroll)
  }, [])

  useEffect(() => {
    const sections = links.map(l => l.href.replace('#', ''))
    const observer = new IntersectionObserver(
      (entries) => {
        entries.forEach(entry => {
          if (entry.isIntersecting) setActive(entry.target.id)
        })
      },
      { rootMargin: '-40% 0px -50% 0px' }
    )
    sections.forEach(id => {
      const el = document.getElementById(id)
      if (el) observer.observe(el)
    })
    return () => observer.disconnect()
  }, [])

  const handleLink = (e, href) => {
    e.preventDefault()
    setMenuOpen(false)
    const el = document.querySelector(href)
    if (el) el.scrollIntoView({ behavior: 'smooth' })
  }

  return (
    <nav className={`nav ${scrolled ? 'nav--scrolled' : ''} ${menuOpen ? 'nav--menu-open' : ''}`}>
      <div className="nav__inner container">
        <a className="nav__logo" href="#home" onClick={e => handleLink(e, '#home')}>
          <span className="nav__logo-mark">Y</span>
          <span className="nav__logo-name">Yasamin</span>
        </a>

        <ul className="nav__links">
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav__link ${active === link.href.replace('#', '') ? 'nav__link--active' : ''}`}
                onClick={e => handleLink(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>

        <button
          className={`nav__burger ${menuOpen ? 'nav__burger--open' : ''}`}
          onClick={() => setMenuOpen(v => !v)}
          aria-label="Toggle menu"
        >
          <span /><span /><span />
        </button>
      </div>

      <div className={`nav__mobile ${menuOpen ? 'nav__mobile--open' : ''}`}>
        <ul>
          {links.map(link => (
            <li key={link.href}>
              <a
                href={link.href}
                className={`nav__mobile-link ${active === link.href.replace('#', '') ? 'active' : ''}`}
                onClick={e => handleLink(e, link.href)}
              >
                {link.label}
              </a>
            </li>
          ))}
        </ul>
      </div>
    </nav>
  )
}
