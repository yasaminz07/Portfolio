import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const EMPTY = { label: '', sublabel: '', period: '', current: false, upcoming: false, semesters: [], sort_order: 0 }

export default function Education() {
  const [rows, setRows]           = useState([])
  const [loading, setLoading]     = useState(true)
  const [form, setForm]           = useState(null)
  const [semText, setSemText]     = useState('[]')
  const [semError, setSemError]   = useState('')
  const [saving, setSaving]       = useState(false)
  const [error, setError]         = useState('')

  const fetch = async () => {
    const { data } = await supabase.from('education').select('*').order('sort_order')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setSemText('[]'); setSemError(''); setError('') }
  const openEdit = row => {
    setForm({ ...row })
    setSemText(JSON.stringify(row.semesters || [], null, 2))
    setSemError(''); setError('')
  }
  const closeForm = () => setForm(null)

  const save = async e => {
    e.preventDefault()
    let semesters
    try { semesters = JSON.parse(semText) } catch { setSemError('Invalid JSON'); return }
    setSemError('')
    setSaving(true); setError('')
    const { id, ...rest } = { ...form, semesters }
    const res = id
      ? await supabase.from('education').update(rest).eq('id', id)
      : await supabase.from('education').insert(rest)
    if (res.error) { setError(res.error.message); setSaving(false); return }
    await fetch(); closeForm(); setSaving(false)
  }

  const del = async id => {
    if (!confirm('Delete this year entry?')) return
    await supabase.from('education').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Education</h1>
          <p className="admin-page__sub">{rows.length} year entries</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Add year</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Year</th><th>Period</th><th>Status</th><th>Semesters</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><strong>{r.label}</strong>{r.sublabel && <span className="admin-muted"> · {r.sublabel}</span>}</td>
                <td>{r.period}</td>
                <td>
                  {r.current && <span className="admin-badge admin-badge--current">Current</span>}
                  {r.upcoming && <span className="admin-badge admin-badge--upcoming">Upcoming</span>}
                </td>
                <td>{(r.semesters || []).length} semester(s)</td>
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
          <div className="admin-modal admin-modal--wide" onClick={e => e.stopPropagation()}>
            <div className="admin-modal__header">
              <h2>{form.id ? 'Edit Year' : 'Add Year'}</h2>
              <button className="admin-modal__close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={save} className="admin-form">
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Label *</label>
                  <input className="admin-input" placeholder="e.g. 2nd Year" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Sub-label</label>
                  <input className="admin-input" placeholder="e.g. Current" value={form.sublabel || ''} onChange={e => setForm(f => ({ ...f, sublabel: e.target.value }))} />
                </div>
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Period</label>
                  <input className="admin-input" placeholder="e.g. 2025 / 2026" value={form.period || ''} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Sort order</label>
                  <input className="admin-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
                </div>
              </div>
              <div className="admin-form__checks">
                <label className="admin-check"><input type="checkbox" checked={!!form.current} onChange={e => setForm(f => ({ ...f, current: e.target.checked }))} /> Currently enrolled</label>
                <label className="admin-check"><input type="checkbox" checked={!!form.upcoming} onChange={e => setForm(f => ({ ...f, upcoming: e.target.checked }))} /> Upcoming</label>
              </div>
              <div className="admin-field">
                <label className="admin-label">Semesters (JSON)</label>
                <p className="admin-hint">Array of: <code>{`[{"label":"Semester 1","modules":["Module A","Module B"]}]`}</code></p>
                <textarea
                  className={`admin-input admin-textarea admin-code ${semError ? 'admin-input--error' : ''}`}
                  rows={8}
                  value={semText}
                  onChange={e => setSemText(e.target.value)}
                  spellCheck={false}
                />
                {semError && <p className="admin-error">{semError}</p>}
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
