import { useEffect, useRef, useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { IconMail, IconLinkedIn, IconGitHub, IconMapPin, IconArrowRight } from './Icons'
import { supabase } from '../lib/supabase'
import './Contact.css'

const contactLinks = [
  { Icon: IconMail,     label: 'Email',    value: 'yasminzd02@gmail.com',           href: 'mailto:yasminzd02@gmail.com' },
  { Icon: IconLinkedIn, label: 'LinkedIn', value: 'linkedin.com/in/yasaminzaid',     href: 'https://www.linkedin.com/in/yasaminzaid' },
  { Icon: IconGitHub,   label: 'GitHub',   value: 'github.com/yasaminz07',           href: 'https://github.com/yasaminz07' },
  { Icon: IconMapPin,   label: 'Location', value: 'Birmingham, UK',                  href: null },
]

const subjectOptions = [
  { value: '',              label: "What's this about?" },
  { value: 'internship',   label: 'Internship / Placement Opportunity' },
  { value: 'part-time',    label: 'Part-time / Graduate Role' },
  { value: 'collaboration',label: 'Collaboration' },
  { value: 'other',        label: 'Something else' },
]

export default function Contact() {
  const ref = useReveal(0.1)
  const subjectRef = useRef(null)
  const [form,   setForm]   = useState({ name:'', email:'', subject:'', message:'' })
  const [status, setStatus] = useState('idle')
  const [subjectOpen, setSubjectOpen] = useState(false)

  const handleChange = (e) => setForm(p => ({ ...p, [e.target.name]: e.target.value }))

  useEffect(() => {
    const closeDropdown = event => {
      if (!subjectRef.current?.contains(event.target)) setSubjectOpen(false)
    }
    document.addEventListener('pointerdown', closeDropdown)
    return () => document.removeEventListener('pointerdown', closeDropdown)
  }, [])

  const handleSubmit = async (e) => {
    e.preventDefault()
    if (!form.subject) { setSubjectOpen(true); return }
    setStatus('sending')
    const { error } = await supabase.from('messages').insert({
      name: form.name,
      email: form.email,
      subject: form.subject,
      message: form.message,
    })
    setStatus(error ? 'error' : 'sent')
  }

  return (
    <section id="contact" className="section contact" ref={ref}>
      <div className="contact__bg" aria-hidden="true" />
      <div className="container">
        <div className="contact__grid">

          {/* Left */}
          <div className="contact__left reveal">
            <span className="section-eyebrow">Contact</span>
            <h2 className="section-heading">Let's connect.</h2>
            <h3 className="contact__sub-heading">Open to opportunities.</h3>
            <p className="contact__body">
              Whether you're a recruiter, a potential collaborator, or just want to say hi,
              I'd love to hear from you. I'm currently looking for placements, internships,
              and part-time roles where I can contribute and keep growing.
            </p>

            <div className="contact__links">
              {contactLinks.map(link => {
                const inner = (
                  <>
                    <div className="contact__link-icon"><link.Icon size={19} /></div>
                    <div>
                      <div className="contact__link-label">{link.label}</div>
                      <div className="contact__link-value">{link.value}</div>
                    </div>
                    {link.href && (
                      <svg className="contact__link-arrow" width="16" height="16" viewBox="0 0 16 16" fill="none">
                        <path d="M3 8h10M9 4l4 4-4 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                    )}
                  </>
                )
                return link.href ? (
                  <a
                    key={link.label}
                    href={link.href}
                    target={link.href.startsWith('http') ? '_blank' : undefined}
                    rel="noopener noreferrer"
                    className="contact__link-item"
                  >{inner}</a>
                ) : (
                  <div key={link.label} className="contact__link-item">{inner}</div>
                )
              })}
            </div>
          </div>

          {/* Right */}
          <div className="contact__right reveal reveal-delay-2">
            <div className="contact__form-card glass-card">
              <h3 className="contact__form-title">Send me a message</h3>

              {status === 'error' ? (
                <div className="contact__success">
                  <p style={{ color: '#e53e3e' }}>Something went wrong. Please try again or email me directly.</p>
                </div>
              ) : status === 'sent' ? (
                <div className="contact__success">
                  <div className="contact__success-icon">
                    <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="#34D399" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                      <circle cx="12" cy="12" r="10"/>
                      <polyline points="9 12 11 14 15 10"/>
                    </svg>
                  </div>
                  <p>Message sent! I'll get back to you soon.</p>
                </div>
              ) : (
                <form className="contact__form" onSubmit={handleSubmit}>
                  <div className="contact__form-row">
                    <div className="contact__field">
                      <label className="contact__label" htmlFor="name">Your Name</label>
                      <input id="name" name="name" type="text" className="contact__input"
                        placeholder="Full name" value={form.name} onChange={handleChange} required />
                    </div>
                    <div className="contact__field">
                      <label className="contact__label" htmlFor="email">Email</label>
                      <input id="email" name="email" type="email" className="contact__input"
                        aria-label="Email address" placeholder="Email address" value={form.email} onChange={handleChange} required />
                    </div>
                  </div>

                  <div className="contact__field">
                    <label className="contact__label" htmlFor="subject">Subject</label>
                    <div className={`contact__select-wrap ${subjectOpen ? 'contact__select-wrap--open' : ''}`} ref={subjectRef}>
                      <button
                        id="subject"
                        type="button"
                        className={`contact__select ${!form.subject ? 'contact__select--placeholder' : ''}`}
                        aria-haspopup="listbox"
                        aria-expanded={subjectOpen}
                        onClick={() => setSubjectOpen(open => !open)}
                        onKeyDown={event => { if (event.key === 'Escape') setSubjectOpen(false) }}
                      >
                        {subjectOptions.find(option => option.value === form.subject)?.label || subjectOptions[0].label}
                      </button>
                      <svg className="contact__select-arrow" width="14" height="14" viewBox="0 0 14 14" fill="none">
                        <path d="M3 5l4 4 4-4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round"/>
                      </svg>
                      {subjectOpen && (
                        <div className="contact__select-menu" role="listbox" aria-labelledby="subject">
                          {subjectOptions.filter(option => option.value).map(option => (
                            <button
                              type="button"
                              role="option"
                              aria-selected={form.subject === option.value}
                              className={`contact__select-option ${form.subject === option.value ? 'contact__select-option--selected' : ''}`}
                              key={option.value}
                              onClick={() => {
                                setForm(current => ({ ...current, subject: option.value }))
                                setSubjectOpen(false)
                              }}
                            >
                              <span>{option.label}</span>
                              {form.subject === option.value && <span className="contact__select-check">✓</span>}
                            </button>
                          ))}
                        </div>
                      )}
                    </div>
                  </div>

                  <div className="contact__field">
                    <label className="contact__label" htmlFor="message">Message</label>
                    <textarea id="message" name="message" className="contact__textarea"
                      placeholder="Tell me about the opportunity or what you'd like to work on…"
                      rows={5} value={form.message} onChange={handleChange} required />
                  </div>

                  <button type="submit" className="btn btn-primary contact__submit" disabled={status === 'sending'}>
                    {status === 'sending' ? (
                      <><span className="contact__spinner" /> Sending…</>
                    ) : (
                      <>Send Message <IconArrowRight size={16} /></>
                    )}
                  </button>
                </form>
              )}
            </div>
          </div>
        </div>
      </div>
    </section>
  )
}
