import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'
import { useConfirm } from '../hooks/useConfirm'

const ICONS = ['IconLock','IconUserX','IconCloud','IconTerminal','IconKey','IconActivity','IconSearch','IconCode','IconWifi','IconShield']
const EMPTY = { title: '', issuer: '', date: '', body: '', icon_name: 'IconLock', sort_order: 0 }

export default function Certificates() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null)
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')
  const [confirmEl, confirm]  = useConfirm()

  const fetch = async () => {
    const { data } = await supabase.from('certificates').select('*').order('sort_order')
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
    const res = id
      ? await supabase.from('certificates').update(rest).eq('id', id)
      : await supabase.from('certificates').insert(rest)
    if (res.error) { setError(res.error.message); setSaving(false); return }
    await fetch(); closeForm(); setSaving(false)
  }

  const del = async id => {
    const ok = await confirm('Delete this certificate?')
    if (!ok) return
    await supabase.from('certificates').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      {confirmEl}
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Certificates</h1>
          <p className="admin-page__sub">{rows.length} certificates</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Add certificate</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Issuer</th><th>Date</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><strong>{r.title}</strong></td>
                <td>{r.issuer}</td>
                <td>{r.date}</td>
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
              <h2>{form.id ? 'Edit Certificate' : 'Add Certificate'}</h2>
              <button className="admin-modal__close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={save} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Title *</label>
                <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Issuer *</label>
                  <input className="admin-input" value={form.issuer} onChange={e => setForm(f => ({ ...f, issuer: e.target.value }))} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Date *</label>
                  <input className="admin-input" placeholder="e.g. Mar 2026" value={form.date} onChange={e => setForm(f => ({ ...f, date: e.target.value }))} required />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-input admin-textarea" rows={3} value={form.body} onChange={e => setForm(f => ({ ...f, body: e.target.value }))} />
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Icon</label>
                  <select className="admin-input" value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))}>
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Sort order</label>
                  <input className="admin-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
                </div>
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
