import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = { company: '', short_name: '', type: '', period: '', duration: '', status: 'current', description: '', sort_order: 0 }

export default function Experience() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null) // null = closed, {} = new, {id,...} = edit
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const fetch = async () => {
    const { data } = await supabase.from('experience').select('*').order('sort_order')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { fetch() }, [])

  const openAdd  = () => { setForm({ ...EMPTY }); setError('') }
  const openEdit = row => { setForm({ ...row }); setError('') }
  const closeForm = () => setForm(null)

  const save = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    const { id, ...rest } = form
    let err
    if (id) {
      const res = await supabase.from('experience').update(rest).eq('id', id)
      err = res.error
    } else {
      const res = await supabase.from('experience').insert(rest)
      err = res.error
    }
    if (err) { setError(err.message); setSaving(false); return }
    await fetch(); closeForm(); setSaving(false)
  }

  const del = async id => {
    if (!confirm('Delete this entry?')) return
    await supabase.from('experience').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Experience</h1>
          <p className="admin-page__sub">{rows.length} entries</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Add entry</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Company</th><th>Role</th><th>Period</th><th>Status</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><strong>{r.company}</strong></td>
                <td>{r.type}</td>
                <td>{r.period}{r.duration ? ` · ${r.duration}` : ''}</td>
                <td><span className={`admin-badge admin-badge--${r.status}`}>{r.status}</span></td>
                <td className="admin-table__actions">
                  <button className="admin-btn admin-btn--xs" onClick={() => openEdit(r)}>Edit</button>
                  <button className="admin-btn admin-btn--xs admin-btn--danger" onClick={() => del(r.id)}>Delete</button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>

      {form && (
        <div className="admin-modal-overlay" onClick={closeForm}>
          <div className="admin-modal" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{form.id ? 'Edit Entry' : 'Add Entry'}</h2>
              <button className="admin-modal__close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={save} className="admin-form">
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Company *</label>
                  <input className="admin-input" value={form.company} onChange={e => setForm(f => ({ ...f, company: e.target.value }))} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Short name (monogram) *</label>
                  <input className="admin-input" maxLength={3} value={form.short_name} onChange={e => setForm(f => ({ ...f, short_name: e.target.value }))} required />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Role / Type *</label>
                <input className="admin-input" value={form.type} onChange={e => setForm(f => ({ ...f, type: e.target.value }))} required />
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Period *</label>
                  <input className="admin-input" placeholder="e.g. Present or Jan 2025" value={form.period} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Duration (optional)</label>
                  <input className="admin-input" placeholder="e.g. 3 weeks" value={form.duration} onChange={e => setForm(f => ({ ...f, duration: e.target.value }))} />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Status</label>
                <select className="admin-input" value={form.status} onChange={e => setForm(f => ({ ...f, status: e.target.value }))}>
                  <option value="current">Current</option>
                  <option value="upcoming">Upcoming</option>
                  <option value="past">Past</option>
                </select>
              </div>
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-input admin-textarea" rows={4} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort order</label>
                <input className="admin-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
              </div>
              {error && <p className="admin-error">{error}</p>}
              <div className="admin-form__footer">
                <button type="button" className="admin-btn admin-btn--ghost" onClick={closeForm}>Cancel</button>
                <button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save'}</button>
              </div>
            </form>
          </div>
        </div>
      )}
    </div>
  )
}
