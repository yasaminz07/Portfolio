import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useConfirm } from '../hooks/useConfirm'

const FILTERS = ['All', 'Starred', 'Unread', 'Responded', 'Ignored']

const statusStyle = {
  new:       { background: 'rgba(0,102,204,0.08)', color: '#0066CC', border: '1px solid rgba(0,102,204,0.18)' },
  responded: { background: 'rgba(26,175,93,0.08)', color: '#157A42', border: '1px solid rgba(26,175,93,0.20)' },
  ignored:   { background: 'rgba(0,0,0,0.05)',     color: '#888',    border: '1px solid rgba(0,0,0,0.10)' },
}

export default function Messages() {
  const [messages, setMessages] = useState([])
  const [loading, setLoading]   = useState(true)
  const [filter, setFilter]     = useState('All')
  const [selected, setSelected] = useState(new Set())
  const [noteOpen, setNoteOpen] = useState({})
  const [noteDraft, setNoteDraft] = useState({})
  const [confirmEl, confirm] = useConfirm()

  const load = async () => {
    const { data } = await supabase.from('messages').select('*').order('created_at', { ascending: false })
    setMessages(data || [])
    setLoading(false)
  }
  useEffect(() => { load() }, [])

  const displayed = messages.filter(m => {
    if (filter === 'Starred')   return m.starred
    if (filter === 'Unread')    return !m.read
    if (filter === 'Responded') return m.status === 'responded'
    if (filter === 'Ignored')   return m.status === 'ignored'
    return true
  })

  const toggleSelect = id =>
    setSelected(prev => { const s = new Set(prev); s.has(id) ? s.delete(id) : s.add(id); return s })

  const toggleAll = () =>
    setSelected(selected.size === displayed.length ? new Set() : new Set(displayed.map(m => m.id)))

  const hasSelection = selected.size > 0

  const bulkUpdate = async patch => {
    if (!hasSelection) return
    const ids = [...selected]
    await supabase.from('messages').update(patch).in('id', ids)
    setMessages(prev => prev.map(m => ids.includes(m.id) ? { ...m, ...patch } : m))
    setSelected(new Set())
  }

  const bulkDelete = async () => {
    if (!hasSelection) return
    const ok = await confirm(`Delete ${selected.size} message${selected.size > 1 ? 's' : ''}?`)
    if (!ok) return
    const ids = [...selected]
    await supabase.from('messages').delete().in('id', ids)
    setMessages(prev => prev.filter(m => !ids.includes(m.id)))
    setSelected(new Set())
  }

  const toggleStar = async (id, starred) => {
    await supabase.from('messages').update({ starred }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, starred } : m))
  }

  const openNote = (id, existing) => {
    setNoteOpen(prev => ({ ...prev, [id]: true }))
    setNoteDraft(prev => ({ ...prev, [id]: existing || '' }))
  }

  const saveNote = async (id) => {
    const notes = noteDraft[id] ?? ''
    await supabase.from('messages').update({ notes }).eq('id', id)
    setMessages(prev => prev.map(m => m.id === id ? { ...m, notes } : m))
    setNoteOpen(prev => ({ ...prev, [id]: false }))
  }

  const unreadCount  = messages.filter(m => !m.read).length
  const starredCount = messages.filter(m => m.starred).length

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      {confirmEl}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Messages</h1>
          <p className="admin-page__sub">{messages.length} total · {unreadCount} unread · {starredCount} starred</p>
        </div>
        <div className="admin-filter-group">
          {FILTERS.map(f => (
            <button key={f} className={`admin-filter-btn ${filter === f ? 'active' : ''}`}
              onClick={() => { setFilter(f); setSelected(new Set()) }}>
              {f}
            </button>
          ))}
        </div>
      </div>

      {/* Always-visible action toolbar */}
      <div className="admin-bulk-bar">
        <label className="admin-msg-checkbox" style={{ marginRight: 8 }}>
          <input
            type="checkbox"
            checked={hasSelection && selected.size === displayed.length}
            onChange={toggleAll}
          />
        </label>
        {hasSelection
          ? <span className="admin-bulk-bar__count">{selected.size} selected</span>
          : <span className="admin-bulk-bar__hint">Select All</span>
        }
        <div className="admin-bulk-bar__actions">
          <button className="admin-btn admin-btn--xs" disabled={!hasSelection} onClick={() => bulkUpdate({ read: true })}>Mark Read</button>
          <button className="admin-btn admin-btn--xs" disabled={!hasSelection} onClick={() => bulkUpdate({ status: 'responded', read: true })}>Responded</button>
          <button className="admin-btn admin-btn--xs" disabled={!hasSelection} onClick={() => bulkUpdate({ status: 'ignored', read: true })}>Ignored</button>
          <button className="admin-btn admin-btn--xs" disabled={!hasSelection} onClick={() => bulkUpdate({ starred: true })}>
            <svg width="12" height="12" viewBox="0 0 24 24" fill="currentColor" stroke="currentColor" strokeWidth="2"><polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/></svg>
            Star
          </button>
          <button className="admin-btn admin-btn--xs" disabled={!hasSelection} onClick={() => bulkUpdate({ starred: false })}>Unstar</button>
          <button className="admin-btn admin-btn--xs admin-btn--danger" disabled={!hasSelection} onClick={bulkDelete}>Delete</button>
        </div>
        {hasSelection && (
          <button className="admin-bulk-bar__cancel" onClick={() => setSelected(new Set())}>✕</button>
        )}
      </div>

      {displayed.length === 0 ? (
        <div className="admin-empty">
          {filter === 'All' ? 'No messages yet.' : `No ${filter.toLowerCase()} messages.`}
        </div>
      ) : (
        <div className="admin-message-list">
          {displayed.map(m => (
            <div key={m.id}
              className={`admin-message-card ${!m.read ? 'admin-message-card--unread' : ''} ${selected.has(m.id) ? 'admin-message-card--selected' : ''}`}
            >
              <div className="admin-msg-card-left">
                <input type="checkbox" className="admin-msg-check" checked={selected.has(m.id)} onChange={() => toggleSelect(m.id)} />
                <button className="admin-msg-star" onClick={() => toggleStar(m.id, !m.starred)}
                  style={{ color: m.starred ? '#E07B00' : 'rgba(0,0,0,0.2)' }}>
                  <svg width="15" height="15" viewBox="0 0 24 24" fill={m.starred ? 'currentColor' : 'none'} stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <polygon points="12 2 15.09 8.26 22 9.27 17 14.14 18.18 21.02 12 17.77 5.82 21.02 7 14.14 2 9.27 8.91 8.26 12 2"/>
                  </svg>
                </button>
              </div>

              <div className="admin-msg-card-body">
                <div className="admin-message-card__top">
                  <div>
                    <span className="admin-message-card__name">{m.name}</span>
                    <a href={`mailto:${m.email}`} className="admin-message-card__email">{m.email}</a>
                  </div>
                  <div className="admin-message-card__meta">
                    <span className="admin-msg-status-badge" style={statusStyle[m.status || 'new']}>
                      {m.status ? m.status.charAt(0).toUpperCase() + m.status.slice(1) : 'New'}
                    </span>
                    <span className="admin-message-card__date">
                      {new Date(m.created_at).toLocaleDateString('en-GB', { day: 'numeric', month: 'short', year: 'numeric', hour: '2-digit', minute: '2-digit' })}
                    </span>
                  </div>
                </div>

                {m.subject && <p className="admin-message-card__subject">Re: {m.subject}</p>}
                <p className="admin-message-card__body">{m.message}</p>

                <div className="admin-msg-actions">
                  <button
                    className={`admin-msg-action-btn admin-msg-action-btn--responded ${m.status === 'responded' ? 'active' : ''}`}
                    onClick={() => {
                      const next = m.status === 'responded' ? 'new' : 'responded'
                      supabase.from('messages').update({ status: next, read: true }).eq('id', m.id)
                      setMessages(prev => prev.map(x => x.id === m.id ? { ...x, status: next, read: true } : x))
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <polyline points="20 6 9 17 4 12"/>
                    </svg>
                    {m.status === 'responded' ? 'Responded' : 'Mark Responded'}
                  </button>

                  <span className="admin-msg-actions__sep" />

                  <button
                    className={`admin-msg-action-btn admin-msg-action-btn--ignored ${m.status === 'ignored' ? 'active' : ''}`}
                    onClick={() => {
                      const next = m.status === 'ignored' ? 'new' : 'ignored'
                      supabase.from('messages').update({ status: next, read: true }).eq('id', m.id)
                      setMessages(prev => prev.map(x => x.id === m.id ? { ...x, status: next, read: true } : x))
                    }}
                  >
                    <svg width="12" height="12" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                      <line x1="18" y1="6" x2="6" y2="18"/><line x1="6" y1="6" x2="18" y2="18"/>
                    </svg>
                    {m.status === 'ignored' ? 'Ignored' : 'Ignore'}
                  </button>
                </div>

                {/* Notes section */}
                <div className="admin-msg-note">
                  {noteOpen[m.id] ? (
                    <div className="admin-msg-note__editor">
                      <textarea
                        className="admin-input admin-textarea admin-msg-note__input"
                        rows={3}
                        placeholder="Add a private note…"
                        value={noteDraft[m.id] ?? ''}
                        onChange={e => setNoteDraft(prev => ({ ...prev, [m.id]: e.target.value }))}
                        autoFocus
                      />
                      <div className="admin-msg-note__footer">
                        <button className="admin-btn admin-btn--xs admin-btn--primary" onClick={() => saveNote(m.id)}>Save note</button>
                        <button className="admin-btn admin-btn--ghost" style={{ fontSize: 12 }} onClick={() => setNoteOpen(prev => ({ ...prev, [m.id]: false }))}>Cancel</button>
                      </div>
                    </div>
                  ) : (
                    <button className="admin-msg-note__toggle" onClick={() => openNote(m.id, m.notes)}>
                      {m.notes
                        ? <><span className="admin-msg-note__dot" />Note: {m.notes}</>
                        : '+ Add note'
                      }
                    </button>
                  )}
                </div>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
