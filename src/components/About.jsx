import { useReveal } from '../hooks/useReveal'
import { IconHammer, IconUsers, IconStar, IconTrophy, IconFlask } from './Icons'
import './About.css'

const features = [
  {
    Icon: IconHammer,
    title: 'Builder First',
    body: "I don't just study. I build. From web apps to system tools, I learn best by actually making things and seeing them work.",
    accent: '#5B8FFF',
  },
  {
    Icon: IconUsers,
    title: 'Team Player',
    body: "I've led teams under pressure and contributed to projects that ship. I believe the best results come from people who communicate well and take ownership.",
    accent: '#9B78FF',
  },
  {
    Icon: IconStar,
    title: 'High Standards',
    body: "Whether it's a university project or real client work, I care about quality, clean code, good UX, and results that actually hold up.",
    accent: '#38D4F7',
  },
]

const experiences = [
  {
    Icon: IconFlask,
    org: 'Innovation Labs @ BCU',
    role: 'Software Engineer',
    body: "Worked on real client projects as part of BCU's Innovation Labs programme, contributing to web development, UI design, and the migration of an existing site to React. Gained experience with real workflows, stakeholder requirements, and professional delivery standards.",
    badge: null,
  },
  {
    Icon: IconTrophy,
    org: 'BCU Innovation Fest',
    role: 'Team Lead',
    body: "Led a team project during BCU's Innovation Fest, taking responsibility for both the technical direction and the team's output. We placed 2nd out of all competing teams — a result that came from strong collaboration, clear communication, and everyone delivering under pressure.",
    badge: '🥈 2nd Place · Innovation Fest',
  },
]

export default function About() {
  const ref = useReveal(0.1)

  return (
    <section id="about" className="section about" ref={ref}>
      <div className="container">
        <div className="about__header reveal">
          <span className="section-eyebrow">About Me</span>
          <h2 className="section-heading">Building real things,<br />working with real teams.</h2>
        </div>

        <div className="about__features">
          {features.map((f, i) => (
            <div
              key={f.title}
              className={`about__feature glass-card reveal reveal-delay-${i + 1}`}
              style={{ '--feature-accent': f.accent }}
            >
              <div className="about__feature-icon-wrap">
                <f.Icon size={20} />
              </div>
              <h3 className="about__feature-title">{f.title}</h3>
              <p className="about__feature-body">{f.body}</p>
            </div>
          ))}
        </div>

        <div className="about__content">
          <div className="about__text reveal reveal-delay-1">
            <p>
              I'm a second-year Computer Science student at Birmingham City University,
              and I've been building things with code since my foundation year. What I love
              most is the point where something <em>just works</em>. When the logic clicks, the
              interface feels right, and the problem is actually solved.
            </p>
            <p>
              I have experience across the full stack: frontend interfaces in React and vanilla JS,
              backend logic in Python and Java, database work in SQL, and a solid understanding of
              networking, operating systems, and security fundamentals from my modules. I'm equally
              comfortable working solo or in a team, and I genuinely enjoy the collaborative side
              of development.
            </p>
            <p>
              Outside of code, I'm someone who pays attention to design, takes feedback seriously,
              and is always looking to improve. I want to work on projects that matter and with
              people who care about what they build.
            </p>
          </div>

          <div className="about__experiences reveal reveal-delay-2">
            {experiences.map((exp) => (
              <div key={exp.org} className="about__exp glass-card">
                <div className="about__exp-header">
                  <div className="about__exp-icon-wrap">
                    <exp.Icon size={18} />
                  </div>
                  <div>
                    <div className="about__exp-org">{exp.org}</div>
                    <div className="about__exp-role">{exp.role}</div>
                  </div>
                </div>
                <p className="about__exp-body">{exp.body}</p>
                {exp.badge && (
                  <span className="badge badge-accent about__exp-badge">{exp.badge}</span>
                )}
              </div>
            ))}
          </div>
        </div>
      </div>
    </section>
  )
}
