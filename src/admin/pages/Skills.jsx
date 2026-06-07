import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const ICONS = ['IconCode','IconServer','IconDatabase','IconTerminal','IconShield','IconCpu']
const ACCENTS = ['#5B8FFF','#9B78FF','#38D4F7','#34D399','#F97316','#EC4899']
const EMPTY = { title: '', items: [], icon_name: 'IconCode', accent: '#5B8FFF', sort_order: 0 }

export default function Skills() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null)
  const [itemsText, setItemsText] = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const fetch = async () => {
    const { data } = await supabase.from('skills').select('*').order('sort_order')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setForm({ ...EMPTY, items: [] }); setItemsText(''); setError('') }
  const openEdit = row => { setForm({ ...row }); setItemsText((row.items || []).join(', ')); setError('') }
  const closeForm = () => setForm(null)

  const save = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    const items = itemsText.split(',').map(s => s.trim()).filter(Boolean)
    const { id, ...rest } = { ...form, items }
    const res = id
      ? await supabase.from('skills').update(rest).eq('id', id)
      : await supabase.from('skills').insert(rest)
    if (res.error) { setError(res.error.message); setSaving(false); return }
    await fetch(); closeForm(); setSaving(false)
  }

  const del = async id => {
    if (!confirm('Delete this skill category?')) return
    await supabase.from('skills').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Skills</h1>
          <p className="admin-page__sub">{rows.length} categories</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Add category</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Category</th><th>Skills</th><th>Accent</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><strong>{r.title}</strong></td>
                <td><span className="admin-tag-preview">{(r.items || []).slice(0, 4).join(', ')}{r.items?.length > 4 ? ` +${r.items.length - 4}` : ''}</span></td>
                <td><span className="admin-color-dot" style={{ background: r.accent }} /> {r.accent}</td>
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
              <h2>{form.id ? 'Edit Category' : 'Add Category'}</h2>
              <button className="admin-modal__close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={save} className="admin-form">
              <div className="admin-field">
                <label className="admin-label">Category title *</label>
                <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
              </div>
              <div className="admin-field">
                <label className="admin-label">Skills (comma separated) *</label>
                <textarea className="admin-input admin-textarea" rows={3} value={itemsText} onChange={e => setItemsText(e.target.value)} placeholder="React, Next.js, TypeScript…" required />
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Icon</label>
                  <select className="admin-input" value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))}>
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Accent colour</label>
                  <div style={{ display: 'flex', gap: 8, alignItems: 'center' }}>
                    <input className="admin-input" value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} />
                    <input type="color" value={form.accent} onChange={e => setForm(f => ({ ...f, accent: e.target.value }))} style={{ width: 36, height: 36, borderRadius: 6, border: 'none', cursor: 'pointer' }} />
                  </div>
                  <div style={{ display: 'flex', gap: 6, marginTop: 6 }}>
                    {ACCENTS.map(a => <button key={a} type="button" className="admin-color-swatch" style={{ background: a, outline: form.accent === a ? '2px solid #0D0D0D' : 'none' }} onClick={() => setForm(f => ({ ...f, accent: a }))} />)}
                  </div>
                </div>
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
