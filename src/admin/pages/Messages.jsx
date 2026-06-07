import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('all')

  const fetch = async () => {
    const q = supabase.from('messages').select('*').order('created_at', { ascending: false })
    const { data } = await q
    setMessages(data || [])
    setLoading(false)
  }

  useEffect(() => { fetch() }, [])

  const markRead = async id => {
    await supabase.from('messages').update({ read: true }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, read: true } : m))
  }

  const deleteMsg = async id => {
    if (!confirm('Delete this message?')) return
    await supabase.from('messages').delete().eq('id', id)
    setMessages(prev => prev.filter(m => m.id !== id))
  }

  const markAllRead = async () => {
    await supabase.from('messages').update({ read: true }).eq('read', false)
    setMessages(prev => prev.map(m => ({ ...m, read: true })))
  }

  const displayed = filter === 'unread' ? messages.filter(m => !m.read) : messages
  const unreadCount = messages.filter(m => !m.read).length

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Messages</h1>
          <p className="admin-page__sub">{messages.length} total · {unreadCount} unread</p>
        </div>
        <div style={{ display: 'flex', gap: 8 }}>
          {unreadCount > 0 && (
            <button className="admin-btn admin-btn--ghost" onClick={markAllRead}>Mark all read</button>
          )}
          <div className="admin-filter-group">
            <button className={`admin-filter-btn ${filter === 'all' ? 'active' : ''}`} onClick={() => setFilter('all')}>All</button>
            <button className={`admin-filter-btn ${filter === 'unread' ? 'active' : ''}`} onClick={() => setFilter('unread')}>Unread {unreadCount > 0 && `(${unreadCount})`}</button>
          </div>
        </div>
      </div>

      {displayed.length === 0 ? (
        <div className="admin-empty">{filter === 'unread' ? 'No unread messages.' : 'No messages yet.'}</div>
      ) : (
        <div className="admin-message-list">
          {displayed.map(m => (
            <div key={m.id} className={`admin-message-card ${!m.read ? 'admin-message-card--unread' : ''}`}>
              <div className="admin-message-card__top">
                <div>
                  <span className="admin-message-card__name">{m.name}</span>
                  <a href={`mailto:${m.email}`} className="admin-message-card__email">{m.email}</a>
                </div>
                <div className="admin-message-card__meta">
                  <span className="admin-message-card__date">
                    {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                  </span>
                  {!m.read && <button className="admin-btn admin-btn--xs" onClick={() => markRead(m.id)}>Mark read</button>}
                  <button className="admin-btn admin-btn--xs admin-btn--danger" onClick={() => deleteMsg(m.id)}>Delete</button>
                </div>
              </div>
              <p className="admin-message-card__body">{m.message}</p>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
