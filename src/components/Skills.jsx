import { useReveal } from '../hooks/useReveal'
import { IconCode, IconServer, IconDatabase, IconTerminal, IconShield, IconCpu } from './Icons'
import './Skills.css'

const categories = [
  { Icon: IconCode,     title: 'Frontend Development', skills: ['HTML5','CSS3','JavaScript','React','Next.js','Responsive Design','Figma'],             accent: '#5B8FFF' },
  { Icon: IconServer,   title: 'Backend Development',  skills: ['Python','Java','PHP','Node.js','REST APIs','OOP'],                                       accent: '#9B78FF' },
  { Icon: IconDatabase, title: 'Databases & Data',     skills: ['SQL','MySQL','Database Design','Data Structures','Algorithms'],                           accent: '#38D4F7' },
  { Icon: IconTerminal, title: 'Systems & DevOps',     skills: ['Linux','Ubuntu','Bash','Git','GitHub','Networking','DevOps Basics'],                      accent: '#34D399' },
  { Icon: IconShield,   title: 'Cyber Security',       skills: ['Wireshark','Network Analysis','IAM','Cloud Security','JWT / Auth','OWASP'],               accent: '#F97316' },
  { Icon: IconCpu,      title: 'Hardware & Other',     skills: ['Arduino','Raspberry Pi','Agile','Problem Solving','Team Leadership'],                     accent: '#EC4899' },
]

export default function Skills() {
  const ref = useReveal(0.08)

  return (
    <section id="skills" className="section skills" ref={ref}>
      <div className="skills__bg" aria-hidden="true" />
      <div className="container">
        <div className="skills__header reveal">
          <span className="section-eyebrow">Skills</span>
          <h2 className="section-heading">What I work with.</h2>
          <p className="section-subtext">
            A mix of frontend, backend, systems knowledge, and the tooling that ties it all together.
          </p>
        </div>

        <div className="skills__grid">
          {categories.map((cat, i) => (
            <div
              key={cat.title}
              className={`skills__card glass-card reveal reveal-delay-${Math.min(i+1,6)}`}
              style={{ '--card-accent': cat.accent }}
            >
              <div className="skills__card-header">
                <div className="skills__icon-wrap">
                  <cat.Icon size={18} />
                </div>
                <h3 className="skills__title">{cat.title}</h3>
              </div>
              <div className="skills__tags">
                {cat.skills.map(s => <span key={s} className="tag">{s}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
