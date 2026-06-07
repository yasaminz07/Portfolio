import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { IconGradCap } from './Icons'
import './Education.css'

const years = [
  {
    id: 'second', label: '2nd Year', sublabel: 'Current', period: '2025 / 2026', current: true,
    semesters: [
      { label: 'Semester 1', modules: ['Object Oriented Programming','Operating Systems and DevOps','Backend Web-services Development and Database Engineering'] },
      { label: 'Semester 2', modules: ['Cyber Security','Software Design','Computer Mathematics and Declarative Programming'] },
    ],
  },
  {
    id: 'first', label: '1st Year', period: '2024 / 2025',
    semesters: [
      { label: 'Semester 1', modules: ['Computer Programming','Computer Systems','Website Design and Development'] },
      { label: 'Semester 2', modules: ['Innovation Project','Network Fundamentals','Data Structures and Algorithms'] },
    ],
  },
  {
    id: 'foundation', label: 'Foundation', period: '2023 / 2024',
    semesters: [
      { label: 'Semester 1', modules: ['Fundamental Mathematics','Web Application Design','Fundamentals of Digital Technology'] },
      { label: 'Semester 2', modules: ['Independent Practice','Foundations of Programming','Audio / Video Fundamentals'], badge: '🥈 Innovation Fest — 2nd Place' },
    ],
  },
  {
    id: 'third', label: '3rd Year', period: '2026 / 2027', upcoming: true, semesters: [],
  },
]

export default function Education() {
  const [active, setActive] = useState('second')
  const ref = useReveal(0.1)
  const year = years.find(y => y.id === active)

  return (
    <section id="education" className="section education" ref={ref}>
      <div className="container">
        <div className="education__header reveal">
          <span className="section-eyebrow">Education</span>
          <h2 className="section-heading">BSc Computer Science</h2>
          <p className="section-subtext">Birmingham City University</p>
        </div>

        <div className="education__body glass-card reveal reveal-delay-1">
          <div className="education__tabs">
            {years.map(y => (
              <button
                key={y.id}
                className={`education__tab ${active === y.id ? 'education__tab--active' : ''}`}
                onClick={() => setActive(y.id)}
              >
                <span className="education__tab-label">{y.label}</span>
                {y.sublabel && <span className="education__tab-sub">{y.sublabel}</span>}
              </button>
            ))}
          </div>

          <div className="education__content">
            <div className="education__period-row">
              <div className="education__degree">
                <div className="education__degree-icon">
                  <IconGradCap size={22} />
                </div>
                <div>
                  <div className="education__degree-title">BSc Computer Science</div>
                  <div className="education__degree-sub">Birmingham City University · {year.period}</div>
                </div>
              </div>
              {year.current && <span className="badge badge-green">Currently Enrolled</span>}
              {year.upcoming && <span className="badge badge-accent"><span>🔭</span> Coming 2026/2027</span>}
            </div>

            {year.upcoming ? (
              <div className="education__upcoming">
                <p>Third year modules will be listed here once enrolled. Likely to include final year project, advanced systems, and specialisation modules.</p>
              </div>
            ) : (
              <div className="education__semesters">
                {year.semesters.map(sem => (
                  <div key={sem.label} className="education__semester">
                    <div className="education__sem-label">{sem.label}</div>
                    <ul className="education__modules">
                      {sem.modules.map(m => (
                        <li key={m} className="education__module">
                          <span className="education__module-dot"/>
                          <span>{m}</span>
                        </li>
                      ))}
                    </ul>
                    {sem.badge && <span className="badge badge-accent education__sem-badge">{sem.badge}</span>}
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      </div>
    </section>
  )
}
