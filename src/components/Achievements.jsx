import { useReveal } from '../hooks/useReveal'
import { IconTrophy, IconFlask, IconLayers, IconShieldCheck } from './Icons'
import './Achievements.css'

const items = [
  {
    Icon: IconTrophy,
    title: 'Innovation Fest — 2nd Place',
    body: "Led a team to 2nd place in BCU's Innovation Fest competition, combining technical delivery with strong team coordination and presenting our project to a panel of judges.",
    accent: '#5B8FFF',
  },
  {
    Icon: IconFlask,
    title: 'Innovation Labs @ BCU',
    body: "Contributed to real client projects as a Software Engineer at BCU's Innovation Labs, working to professional standards on live web development work.",
    accent: '#34D399',
  },
  {
    Icon: IconLayers,
    title: 'Full Stack Development',
    body: 'Built and deployed full stack applications across multiple modules and personal projects, demonstrating both frontend and backend capabilities with real outcomes.',
    accent: '#9B78FF',
  },
  {
    Icon: IconShieldCheck,
    title: 'Security Practitioner',
    body: 'Completed hands-on labs in network security, IAM vulnerabilities, and cloud misconfigurations as part of the CMP5329 Cyber Security module at BCU.',
    accent: '#38D4F7',
  },
]

export default function Achievements() {
  const ref = useReveal(0.1)

  return (
    <section className="section achievements" ref={ref}>
      <div className="achievements__bg" aria-hidden="true" />
      <div className="container">
        <div className="achievements__header reveal">
          <span className="section-eyebrow">Recognition</span>
          <h2 className="section-heading">Highlights &amp; achievements.</h2>
        </div>

        <div className="achievements__grid">
          {items.map((item, i) => (
            <div
              key={item.title}
              className={`achievements__card glass-card reveal reveal-delay-${i + 1}`}
              style={{ '--card-accent': item.accent }}
            >
              <div className="achievements__icon-wrap">
                <item.Icon size={22} />
              </div>
              <h3 className="achievements__title">{item.title}</h3>
              <p className="achievements__body">{item.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
