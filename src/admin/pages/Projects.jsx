import { useState, useEffect } from 'react'
import { supabase } from '../../lib/supabase'

const ICONS = ['IconBuilding','IconGlobe','IconCheckSquare','IconGrid','IconPlay','IconLayers','IconCode']
const CATEGORIES = ['Frontend','Full Stack','Design']
const EMPTY = { title: '', description: '', category: 'Frontend', tags: [], links: [], featured: false, real_client: false, in_progress: false, label: '', icon_name: 'IconCode', sort_order: 0 }

export default function Projects() {
  const [rows, setRows]       = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm]       = useState(null)
  const [tagsText, setTagsText] = useState('')
  const [saving, setSaving]   = useState(false)
  const [error, setError]     = useState('')

  const fetch = async () => {
    const { data } = await supabase.from('projects').select('*').order('sort_order')
    setRows(data || [])
    setLoading(false)
  }
  useEffect(() => { fetch() }, [])

  const openAdd = () => { setForm({ ...EMPTY }); setTagsText(''); setError('') }
  const openEdit = row => { setForm({ ...row }); setTagsText((row.tags || []).join(', ')); setError('') }
  const closeForm = () => setForm(null)

  const save = async e => {
    e.preventDefault()
    setSaving(true); setError('')
    const tags = tagsText.split(',').map(s => s.trim()).filter(Boolean)
    const { id, ...rest } = { ...form, tags }
    const res = id
      ? await supabase.from('projects').update(rest).eq('id', id)
      : await supabase.from('projects').insert(rest)
    if (res.error) { setError(res.error.message); setSaving(false); return }
    await fetch(); closeForm(); setSaving(false)
  }

  const del = async id => {
    if (!confirm('Delete this project?')) return
    await supabase.from('projects').delete().eq('id', id)
    setRows(prev => prev.filter(r => r.id !== id))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return (
    <div className="admin-page">
      <div className="admin-page__header">
        <div>
          <h1 className="admin-page__title">Projects</h1>
          <p className="admin-page__sub">{rows.length} projects</p>
        </div>
        <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Add project</button>
      </div>

      <div className="admin-table-wrap">
        <table className="admin-table">
          <thead><tr><th>Title</th><th>Category</th><th>Tags</th><th>Flags</th><th></th></tr></thead>
          <tbody>
            {rows.map(r => (
              <tr key={r.id}>
                <td><strong>{r.title}</strong></td>
                <td><span className="admin-badge admin-badge--neutral">{r.category}</span></td>
                <td><span className="admin-tag-preview">{(r.tags || []).slice(0, 3).join(', ')}{r.tags?.length > 3 ? ` +${r.tags.length - 3}` : ''}</span></td>
                <td>
                  {r.featured && <span className="admin-badge admin-badge--gold">Featured</span>}
                  {r.real_client && <span className="admin-badge admin-badge--current">Client</span>}
                  {r.in_progress && <span className="admin-badge admin-badge--upcoming">WIP</span>}
                </td>
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
              <h2>{form.id ? 'Edit Project' : 'Add Project'}</h2>
              <button className="admin-modal__close" onClick={closeForm}>✕</button>
            </div>
            <form onSubmit={save} className="admin-form">
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Title *</label>
                  <input className="admin-input" value={form.title} onChange={e => setForm(f => ({ ...f, title: e.target.value }))} required />
                </div>
                <div className="admin-field">
                  <label className="admin-label">Category</label>
                  <select className="admin-input" value={form.category} onChange={e => setForm(f => ({ ...f, category: e.target.value }))}>
                    {CATEGORIES.map(c => <option key={c} value={c}>{c}</option>)}
                  </select>
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Description</label>
                <textarea className="admin-input admin-textarea" rows={3} value={form.description} onChange={e => setForm(f => ({ ...f, description: e.target.value }))} />
              </div>
              <div className="admin-field">
                <label className="admin-label">Tags (comma separated)</label>
                <input className="admin-input" value={tagsText} onChange={e => setTagsText(e.target.value)} placeholder="React, TypeScript, Tailwind…" />
              </div>
              <div className="admin-form__row">
                <div className="admin-field">
                  <label className="admin-label">Icon</label>
                  <select className="admin-input" value={form.icon_name} onChange={e => setForm(f => ({ ...f, icon_name: e.target.value }))}>
                    {ICONS.map(i => <option key={i} value={i}>{i}</option>)}
                  </select>
                </div>
                <div className="admin-field">
                  <label className="admin-label">Label (e.g. "Real Client Project")</label>
                  <input className="admin-input" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} />
                </div>
              </div>
              <div className="admin-field">
                <label className="admin-label">Sort order</label>
                <input className="admin-input" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} />
              </div>
              <div className="admin-form__checks">
                {[['featured','Featured'], ['real_client','Real Client'], ['in_progress','In Progress']].map(([k, l]) => (
                  <label key={k} className="admin-check">
                    <input type="checkbox" checked={!!form[k]} onChange={e => setForm(f => ({ ...f, [k]: e.target.checked }))} />
                    {l}
                  </label>
                ))}
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
