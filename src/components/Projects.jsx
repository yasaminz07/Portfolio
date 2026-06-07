import { useState } from 'react'
import { useReveal } from '../hooks/useReveal'
import { IconBuilding, IconGlobe, IconCheckSquare, IconGrid, IconPlay, IconLayers, IconGitHub, IconExternal } from './Icons'
import './Projects.css'

const projects = [
  {
    id: 'innovation-labs',
    featured: true,
    label: 'Real Client Project',
    realClient: true,
    Icon: IconBuilding,
    title: 'Innovation Labs @ BCU Website',
    category: 'Frontend',
    description: "Built as part of the Innovation Labs @ BCU programme — real client, real brief, real deadlines. I developed responsive web pages using HTML, CSS, and JavaScript, designed clean UI layouts for workshops, sessions, and partner pages, and contributed to improving the overall user experience. Currently migrating the site to React for scalability and modern component-based development.",
    tags: ['HTML','CSS','JavaScript','React (WIP)','UI Design','Client Work'],
    links: [
      { label: 'GitHub',   href: 'https://github.com/yasaminz07',          kind: 'github' },
      { label: 'Website',  href: 'https://bcuinnovationlabs.com/',          kind: 'external' },
    ],
  },
  {
    id: 'duolingo-clone',
    Icon: IconGlobe,
    title: 'Duolingo Clone',
    category: 'Full Stack',
    description: "An interactive language learning application built with React and Next.js. I focused on component-based architecture, client-side routing, and state management to create a smooth, engaging experience that actually felt like using the real thing.",
    tags: ['React','Next.js','State Management'],
    links: [],
  },
  {
    id: 'todo-app',
    Icon: IconCheckSquare,
    title: 'To Do List App',
    category: 'Frontend',
    description: "A clean, responsive task management app built with HTML, CSS, and JavaScript. Users can add, delete, and manage tasks with an interface that stays out of the way and just works.",
    tags: ['HTML','CSS','JavaScript'],
    links: [],
  },
  {
    id: 'wordle-clone',
    Icon: IconGrid,
    title: 'Wordle Clone',
    category: 'Frontend',
    description: "A browser-based recreation of Wordle in vanilla HTML, CSS, and JavaScript. I implemented the letter validation logic, colour feedback system, and keyboard interaction from scratch — great for pushing algorithmic thinking.",
    tags: ['HTML','CSS','JavaScript','Algorithms'],
    links: [],
  },
  {
    id: 'netflix-ui',
    Icon: IconPlay,
    title: 'Netflix UI Design',
    category: 'Design',
    description: "A modern, polished Netflix-style interface designed in Figma, focusing on layout, visual hierarchy, and user experience. Explored content-heavy UI patterns, dark-mode design systems, and how streaming platforms balance discovery with simplicity.",
    tags: ['Figma','UI/UX Design','React (WIP)'],
    links: [],
  },
  {
    id: 'sca-app',
    Icon: IconLayers,
    title: 'Untitled App',
    category: 'Full Stack',
    realClient: true,
    inProgress: true,
    label: 'Real Client Project',
    description: "A real client mobile app currently in development, targeting iOS and Android. Details are under wraps for now — more coming soon.",
    tags: ['Flutter','Dart','iOS','Android','Mobile','Real Client'],
    links: [],
  },
]

const filters = ['All','Frontend','Full Stack','Design','Real Client']

export default function Projects() {
  const [activeFilter, setActiveFilter] = useState('All')
  const ref = useReveal(0.08)

  const filtered  = projects.filter(p =>
    activeFilter === 'All' ||
    p.category === activeFilter ||
    (activeFilter === 'Real Client' && p.realClient)
  )
  const featured  = activeFilter === 'All' ? filtered.find(p => p.featured) : null
  const rest      = activeFilter === 'All' ? filtered.filter(p => !p.featured) : filtered

  return (
    <section id="projects" className="section projects" ref={ref}>
      <div className="container">
        <div className="projects__header reveal">
          <span className="section-eyebrow">Projects</span>
          <h2 className="section-heading">Things I've built.</h2>
        </div>

        <div className="projects__filters reveal reveal-delay-1">
          {filters.map(f => (
            <button
              key={f}
              className={`projects__filter ${activeFilter === f ? 'projects__filter--active' : ''}`}
              onClick={() => setActiveFilter(f)}
            >
              {f}
            </button>
          ))}
        </div>

        {featured && (
          <div className="projects__featured glass-card">
            <div className="projects__featured-label badge badge-accent">
              <svg width="12" height="12" viewBox="0 0 12 12" fill="currentColor">
                <path d="M6 1l1.5 3 3.3.5-2.4 2.3.6 3.2L6 8.5 3 10.1l.6-3.3L1.2 4.5l3.3-.5L6 1z"/>
              </svg>
              {featured.label}
            </div>

            <div className="projects__featured-content">
              <div className="projects__featured-info">
                <div className="projects__featured-icon-wrap">
                  <featured.Icon size={28} />
                </div>
                <h3 className="projects__featured-title">{featured.title}</h3>
                <p className="projects__featured-desc">{featured.description}</p>

                <div className="projects__tags">
                  {featured.tags.map(t => <span key={t} className="tag">{t}</span>)}
                </div>

                {featured.links.length > 0 && (
                  <div className="projects__links">
                    {featured.links.map(link => (
                      <a
                        key={link.label}
                        href={link.href}
                        target="_blank"
                        rel="noopener noreferrer"
                        className={`btn ${link.kind === 'github' ? 'btn-secondary' : 'btn-primary'}`}
                      >
                        {link.kind === 'github' ? <IconGitHub size={16} /> : <IconExternal size={14} />}
                        {link.label}
                      </a>
                    ))}
                  </div>
                )}
              </div>

              {/* Browser mockup */}
              <div className="projects__featured-visual">
                <div className="projects__mock">
                  <div className="projects__mock-bar">
                    <span/><span/><span/>
                    <div className="projects__mock-url">bcuinnovationlabs.com</div>
                  </div>
                  <div className="projects__mock-body">
                    <div className="projects__mock-nav">
                      <div className="projects__mock-logo"/>
                      <div className="projects__mock-navlinks"><div/><div/><div/><div/></div>
                    </div>
                    <div className="projects__mock-hero-text">
                      <div className="projects__mock-h1"/>
                      <div className="projects__mock-h1 short"/>
                      <div className="projects__mock-p"/><div className="projects__mock-p"/>
                      <div className="projects__mock-btn"/>
                    </div>
                    <div className="projects__mock-cards"><div/><div/><div/></div>
                  </div>
                </div>
              </div>
            </div>
          </div>
        )}

        <div className="projects__grid">
          {rest.map((p, i) => (
            <div
              key={p.id}
              className="projects__card glass-card"
              style={{ animationDelay: `${i * 0.08}s` }}
            >
              <div className="projects__card-top">
                <div className="projects__card-icon-wrap">
                  <p.Icon size={22} />
                </div>
                {p.inProgress && (
                  <span className="badge badge-accent projects__wip">In Progress</span>
                )}
              </div>
              <h3 className="projects__card-title">{p.title}</h3>
              <p className="projects__card-desc">{p.description}</p>
              <div className="projects__tags" style={{marginTop:'auto',paddingTop:'16px'}}>
                {p.tags.map(t => <span key={t} className="tag">{t}</span>)}
              </div>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
