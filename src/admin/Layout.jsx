import { NavLink, useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { useUnreadCount } from './hooks/useUnreadCount'

const navItems = [
  { to: '/admin/dashboard',    label: 'Dashboard',     icon: '▦' },
  { to: '/admin/messages',     label: 'Messages',      icon: '✉', badge: true },
  { to: '/admin/projects',     label: 'Projects',      icon: '◈' },
  { to: '/admin/experience',   label: 'Experience',    icon: '◉' },
  { to: '/admin/education',    label: 'Education',     icon: '◎' },
  { to: '/admin/certificates', label: 'Certificates',  icon: '◆' },
  { to: '/admin/skills',       label: 'Skills',        icon: '◇' },
]

export default function Layout({ session, children }) {
  const navigate = useNavigate()
  const unread = useUnreadCount()

  const signOut = async () => {
    await supabase.auth.signOut()
    navigate('/admin/login')
  }

  return (
    <div className="admin-root">
      <aside className="admin-sidebar">
        <div className="admin-sidebar__brand">
          <span className="admin-sidebar__mark">Y</span>
          <span className="admin-sidebar__name">Admin</span>
        </div>

        <nav className="admin-nav">
          {navItems.map(item => (
            <NavLink
              key={item.to}
              to={item.to}
              className={({ isActive }) => `admin-nav__link ${isActive ? 'admin-nav__link--active' : ''}`}
            >
              <span className="admin-nav__icon">{item.icon}</span>
              <span>{item.label}</span>
              {item.badge && unread > 0 && (
                <span className="admin-nav__badge">{unread}</span>
              )}
            </NavLink>
          ))}
        </nav>

        <div className="admin-sidebar__footer">
          <div className="admin-sidebar__user">
            <span className="admin-sidebar__email">{session.user.email}</span>
          </div>
          <button className="admin-sidebar__signout" onClick={signOut}>
            Sign out
          </button>
        </div>
      </aside>

      <main className="admin-main">
        {children}
      </main>
    </div>
  )
}
