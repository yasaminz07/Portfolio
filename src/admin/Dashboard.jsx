import { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { supabase } from '../lib/supabase'
import { IconCode, IconUsers, IconGradCap, IconTrophy, IconCpu, IconMail } from '../components/Icons'

const TABLES = [
  { key: 'projects',     label: 'Projects',      Icon: IconCode,     route: '/admin/projects' },
  { key: 'experience',   label: 'Experience',    Icon: IconUsers,    route: '/admin/experience' },
  { key: 'education',    label: 'Education',     Icon: IconGradCap,  route: '/admin/education' },
  { key: 'certificates', label: 'Certificates',  Icon: IconTrophy,   route: '/admin/certificates' },
  { key: 'skills',       label: 'Skills',        Icon: IconCpu,      route: '/admin/skills' },
]

export default function Dashboard() {
  const navigate = useNavigate()
  const [counts, setCounts]         = useState({})
  const [messages, setMessages]     = useState([])
  const [unread, setUnread]         = useState(0)
  const [loading, setLoading]       = useState(true)

  useEffect(() => {
    const fetchAll = async () => {
      const results = await Promise.all(
        TABLES.map(t =>
          supabase.from(t.key).select('*', { count: 'exact', head: true })
        )
      )
      const c = {}
      TABLES.forEach((t, i) => { c[t.key] = results[i].count || 0 })
      setCounts(c)

      const { data: msgs } = await supabase
        .from('messages')
        .select('*')
        .order('created_at', { ascending: false })
        .limit(5)
      setMessages(msgs || [])
      setUnread((msgs || []).filter(m => !m.read).length)
      setLoading(false)
    }
    fetchAll()
  }, [])

  const markRead = async id => {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
    setUnread(prev => Math.max(0, prev - 1))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <h1 className="admin-page__title">Dashboard</h1>
        <p className="admin-page__sub">Overview of your portfolio content</p>
      </div>

      <div className="admin-stats">
        {TABLES.map(t => (
          <button key={t.key} className="admin-stat-card" onClick={() => navigate(t.route)}>
            <span className="admin-stat-card__icon"><t.Icon size={22} /></span>
            <span className="admin-stat-card__count">{counts[t.key] ?? '—'}</span>
            <span className="admin-stat-card__label">{t.label}</span>
          </button>
        ))}
        <button className="admin-stat-card admin-stat-card--messages" onClick={() => navigate('/admin/messages')}>
          <span className="admin-stat-card__icon"><IconMail size={22} /></span>
          <span className="admin-stat-card__count">{unread}</span>
          <span className="admin-stat-card__label">Unread Messages</span>
        </button>
      </div>

      <div className="admin-section">
        <div className="admin-section__header">
          <h2 className="admin-section__title">Recent Messages</h2>
          <button className="admin-btn admin-btn--ghost" onClick={() => navigate('/admin/messages')}>View all</button>
        </div>
        {messages.length === 0 ? (
          <div className="admin-empty">No messages yet. Your contact form will appear here once set up.</div>
        ) : (
          <div className="admin-message-list">
            {messages.map(m => (
              <div key={m.id} className={`admin-message-card ${!m.read ? 'admin-message-card--unread' : ''}`}>
                <div className="admin-message-card__top">
                  <div>
                    <span className="admin-message-card__name">{m.name}</span>
                    <span className="admin-message-card__email">{m.email}</span>
                  </div>
                  <div className="admin-message-card__meta">
                    <span className="admin-message-card__date">
                      {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric' })}
                    </span>
                    {!m.read && (
                      <button className="admin-btn admin-btn--xs" onClick={() => markRead(m.id)}>Mark read</button>
                    )}
                  </div>
                </div>
                <p className="admin-message-card__body">{m.message}</p>
              </div>
            ))}
          </div>
        )}
      </div>
    </div>
  )
}
