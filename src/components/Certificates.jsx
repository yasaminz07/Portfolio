import { useReveal } from '../hooks/useReveal'
import {
  IconLock, IconUserX, IconCloud, IconTerminal, IconKey,
  IconActivity, IconSearch, IconCode, IconWifi, IconShield,
} from './Icons'
import './Certificates.css'

const certs = [
  { Icon: IconLock,     title: 'OAuth 2.0 & Token Security',                    issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Mar 2026', body: 'Covered authentication, token-based security, and modern access control concepts used in secure systems.' },
  { Icon: IconUserX,    title: 'RBAC & Access Control Bypass',                   issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Mar 2026', body: 'Focused on role-based access control, security weaknesses, and how broken access rules can lead to vulnerabilities.' },
  { Icon: IconCloud,    title: 'Cloud Security Misconfigurations',                issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Mar 2026', body: 'Explored common cloud security mistakes, misconfigurations, and how they can expose systems and sensitive data.' },
  { Icon: IconTerminal, title: 'Terminal Mastery: Linux Command-Line Kung Fu',    issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Feb 2026', body: 'Strengthened Linux command-line skills, file system navigation, and practical terminal usage for technical work.' },
  { Icon: IconKey,      title: 'Welcome to Kali Linux: Your Hacking Arsenal',    issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Feb 2026', body: 'Introduced Kali Linux tools and practical security workflows used in network and system testing.' },
  { Icon: IconActivity, title: 'Network Traffic Analysis: Wireshark',            issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Feb 2026', body: 'Covered packet capture, protocol inspection, and network traffic analysis using Wireshark.' },
  { Icon: IconSearch,   title: 'Port Scanning Fundamentals: Nmap',               issuer: 'SecSim & BCU – MSc Cybersecurity', date: 'Feb 2026', body: 'Focused on reconnaissance, service discovery, and practical port scanning techniques using Nmap.' },
  { Icon: IconCode,     title: 'Python Course',                                   issuer: 'Santander Open Academy',           date: 'Aug 2025', body: 'Improved Python programming and problem-solving skills through structured practical learning.' },
  { Icon: IconWifi,     title: 'Introduction to IoT',                            issuer: 'Cisco',                            date: 'Dec 2023', body: 'Covered core Internet of Things concepts, connected devices, and the basics of smart systems and networking.' },
]

export default function Certificates() {
  const ref = useReveal(0.06)

  return (
    <section id="certificates" className="section certificates" ref={ref}>
      <div className="container">
        <div className="certs__header reveal">
          <span className="section-eyebrow">Certificates</span>
          <h2 className="section-heading">Courses &amp; certifications.</h2>
          <p className="section-subtext">
            A selection of certifications and technical courses that have helped me strengthen
            my skills in cyber security, networking, Linux, and Python.
          </p>
        </div>

        <div className="certs__grid">
          {certs.map((cert, i) => (
            <div
              key={cert.title}
              className={`certs__card glass-card reveal reveal-delay-${Math.min((i % 6) + 1, 6)}`}
            >
              <div className="certs__card-top">
                <div className="certs__icon-wrap">
                  <cert.Icon size={18} />
                </div>
                <div className="certs__meta">
                  <span className="certs__date">{cert.date}</span>
                  <span className="certs__issuer">{cert.issuer}</span>
                </div>
              </div>
              <h3 className="certs__title">{cert.title}</h3>
              <p className="certs__body">{cert.body}</p>
            </div>
          ))}
        </div>
      </div>
    </section>
  )
}
