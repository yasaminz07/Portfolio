import { useState } from 'react'
import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUnreadCount } from './hooks/useUnreadCount'
import { IconGrid, IconMail, IconCode, IconBuilding, IconGradCap, IconTrophy, IconZap, IconArrowRight } from '../components/Icons'

const navItems = [
  { to: '/admin/dashboard',    label: 'Dashboard',    Icon: IconGrid },
  { to: '/admin/messages',     label: 'Messages',     Icon: IconMail,     badge: true },
  { to: '/admin/projects',     label: 'Projects',     Icon: IconCode },
  { to: '/admin/experience',   label: 'Experience',   Icon: IconBuilding },
  { to: '/admin/education',    label: 'Education',    Icon: IconGradCap },
  { to: '/admin/certificates', label: 'Certificates', Icon: IconTrophy },
  { to: '/admin/skills',       label: 'Skills',       Icon: IconZap },
]

export default function Layout({ session, children }) {
  const navigate = useNavigate()
  const unread = useUnreadCount()
  const [sidebarOpen, setSidebarOpen] = useState(false)

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  const close = () => setSidebarOpen(false)

  return (
    <div className="admin-root">

      {/* Mobile top bar */}
      <header className="admin-topbar">
        <button className="admin-topbar__burger" onClick={() => setSidebarOpen(v => !v)} aria-label="Open menu">
          <span /><span /><span />
        </button>
        <span className="admin-topbar__brand">
          <span className="admin-sidebar__mark" style={{ width: 26, height: 26, fontSize: 12 }}>Y</span>
          Admin
        </span>
        {unread > 0 && (
          <button className="admin-topbar__msg" onClick={() => { navigate('/admin/messages'); close() }}>
            <IconMail size={18} />
            <span className="admin-nav__badge">{unread}</span>
          </button>
        )}
      </header>

      {/* Sidebar overlay */}
      {sidebarOpen && <div className="admin-sidebar-overlay" onClick={close} />}

      <aside className={`admin-sidebar ${sidebarOpen ? 'admin-sidebar--open' : ''}`}>
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__mark">Y</span>
          <span className="admin-sidebar__name">Admin</span>
          <button className="admin-sidebar__close" onClick={close} aria-label="Close menu">✕</button>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              onClick={close}
              className={({ isActive }) => `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`}
            >
              <span className="admin-nav__icon"><item.Icon size={17} /></span>
              <span>{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="admin-nav__badge">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <a href="/" className="admin-sidebar__back">
            <IconArrowRight size={14} style={{ transform: 'rotate(180deg)' }} />
            Portfolio
          </a>
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__email">{session.user.email}</span>
          </div>
          <button className="admin-sidebar__signout" onClick={signOut}>Sign out</button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
