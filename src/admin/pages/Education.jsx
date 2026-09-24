import { useEffect, useState } from 'react'
import { supabase } from '../../lib/supabase'
import { useConfirm } from '../hooks/useConfirm'

const EMPTY = { label: '', sublabel: '', period: '', current: false, upcoming: false, semesters: [], sort_order: 0 }

export default function Education() {
  const [rows, setRows] = useState([])
  const [loading, setLoading] = useState(true)
  const [form, setForm] = useState(null)
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState('')
  const [confirmEl, confirm] = useConfirm()

  const fetchRows = async () => {
    const { data } = await supabase.from('education').select('*').order('sort_order')
    setRows(data || []); setLoading(false)
  }
  useEffect(() => { fetchRows() }, [])

  const openAdd = () => { setForm({ ...EMPTY, semesters: [] }); setError('') }
  const openEdit = row => {
    setForm({ ...row, sublabel: '', semesters: (row.semesters || []).map(s => ({ ...s, modules: [...(s.modules || [])] })) })
    setError('')
  }
  const setStatus = status => setForm(f => ({ ...f, current: status === 'current', upcoming: status === 'upcoming', sublabel: '' }))
  const addSemester = () => setForm(f => ({ ...f, semesters: [...f.semesters, { label: `Semester ${f.semesters.length + 1}`, modules: [], badge: '' }] }))
  const updateSemester = (index, patch) => setForm(f => ({ ...f, semesters: f.semesters.map((s, i) => i === index ? { ...s, ...patch } : s) }))
  const removeSemester = index => setForm(f => ({ ...f, semesters: f.semesters.filter((_, i) => i !== index) }))
  const addModule = index => setForm(f => ({ ...f, semesters: f.semesters.map((s, i) => i === index ? { ...s, modules: [...s.modules, ''] } : s) }))
  const updateModule = (si, mi, value) => setForm(f => ({ ...f, semesters: f.semesters.map((s, i) => i === si ? { ...s, modules: s.modules.map((m, j) => j === mi ? value : m) } : s) }))
  const removeModule = (si, mi) => setForm(f => ({ ...f, semesters: f.semesters.map((s, i) => i === si ? { ...s, modules: s.modules.filter((_, j) => j !== mi) } : s) }))

  const save = async e => {
    e.preventDefault(); setSaving(true); setError('')
    const { id, ...values } = {
      ...form,
      sublabel: '',
      semesters: form.semesters.map(s => ({ ...s, label: s.label.trim(), modules: s.modules.map(m => m.trim()).filter(Boolean), badge: s.badge?.trim() || undefined })),
    }
    const result = id
      ? await supabase.from('education').update(values).eq('id', id).select().single()
      : await supabase.from('education').insert(values).select().single()
    if (result.error) { setError(result.error.message); setSaving(false); return }
    if (values.current) {
      const cleared = await supabase.from('education').update({ current: false, sublabel: '' }).neq('id', result.data.id).eq('current', true)
      if (cleared.error) { setError(`Saved, but could not remove the previous Current label: ${cleared.error.message}`); setSaving(false); await fetchRows(); return }
    }
    await fetchRows(); setForm(null); setSaving(false)
  }

  const del = async id => {
    if (!await confirm('Delete this year entry?')) return
    await supabase.from('education').delete().eq('id', id)
    setRows(list => list.filter(row => row.id !== id))
  }

  if (loading) return <div className="admin-page-loading">Loading…</div>

  return <div className="admin-page">
    {confirmEl}
    <div className="admin-page__header">
      <div><h1 className="admin-page__title">Education</h1><p className="admin-page__sub">Manage years, status and modules without editing code.</p></div>
      <button className="admin-btn admin-btn--primary" onClick={openAdd}>+ Add year</button>
    </div>
    <div className="admin-table-wrap"><table className="admin-table">
      <thead><tr><th>Year</th><th>Period</th><th>Status</th><th>Content</th><th></th></tr></thead>
      <tbody>{rows.map(row => <tr key={row.id}>
        <td><strong>{row.label}</strong></td><td>{row.period}</td>
        <td>{row.current ? <span className="admin-badge admin-badge--current">Current</span> : row.upcoming ? <span className="admin-badge admin-badge--upcoming">Upcoming</span> : <span className="admin-badge admin-badge--past">Completed</span>}</td>
        <td>{(row.semesters || []).length} semester{row.semesters?.length === 1 ? '' : 's'}</td>
        <td className="admin-table__actions"><button className="admin-btn admin-btn--xs" onClick={() => openEdit(row)}>Edit</button><button className="admin-btn admin-btn--xs admin-btn--danger" onClick={() => del(row.id)}>Delete</button></td>
      </tr>)}</tbody>
    </table></div>

    {form && <div className="admin-modal-overlay" onClick={() => setForm(null)}>
      <div className="admin-modal admin-modal--wide admin-modal--editor" onClick={e => e.stopPropagation()}>
        <div className="admin-modal__header"><div><h2>{form.id ? 'Edit education year' : 'Add education year'}</h2><p>Changes appear in your public Education section.</p></div><button className="admin-modal__close" onClick={() => setForm(null)} aria-label="Close">×</button></div>
        <form onSubmit={save} className="admin-form">
          <FormSection number="1" title="Year details" description="Name the year and enter the dates shown publicly.">
            <div className="admin-form__row">
              <Field label="Year name *"><input className="admin-input" placeholder="e.g. 3rd Year" value={form.label} onChange={e => setForm(f => ({ ...f, label: e.target.value }))} required /></Field>
              <Field label="Academic period *"><input className="admin-input" placeholder="e.g. 2026 / 2027" value={form.period || ''} onChange={e => setForm(f => ({ ...f, period: e.target.value }))} required /></Field>
            </div>
            <Field label="Display order" compact><input className="admin-input admin-input--short" type="number" value={form.sort_order} onChange={e => setForm(f => ({ ...f, sort_order: +e.target.value }))} /><p className="admin-hint">Lower numbers appear first.</p></Field>
          </FormSection>

          <FormSection number="2" title="Status" description="Only one year can be marked Current.">
            <div className="admin-status-picker" role="radiogroup">{[
              ['completed', 'Completed', 'A previous year'], ['current', 'Current', 'You are studying this now'], ['upcoming', 'Upcoming', 'A future year'],
            ].map(([value, label, help]) => {
              const active = value === 'current' ? form.current : value === 'upcoming' ? form.upcoming : !form.current && !form.upcoming
              return <button key={value} type="button" role="radio" aria-checked={active} className={`admin-status-option ${active ? 'active' : ''}`} onClick={() => setStatus(value)}><span className="admin-status-option__dot"/><span><strong>{label}</strong><small>{help}</small></span></button>
            })}</div>
          </FormSection>

          <section className="admin-form-section">
            <div className="admin-form-section__heading admin-form-section__heading--action"><span className="admin-form-section__number">3</span><div><h3>Semesters and modules</h3><p>Add modules using simple fields—no code required.</p></div><button type="button" className="admin-btn admin-btn--ghost admin-btn--small" onClick={addSemester}>+ Add semester</button></div>
            {!form.semesters.length ? <button type="button" className="admin-empty-editor" onClick={addSemester}><span>＋</span><strong>Add your first semester</strong><small>You can add modules inside it.</small></button> :
              <div className="admin-semester-list">{form.semesters.map((semester, si) => <div className="admin-semester-card" key={si}>
                <div className="admin-semester-card__header"><input className="admin-input admin-semester-card__title" value={semester.label} onChange={e => updateSemester(si, { label: e.target.value })} required/><button type="button" className="admin-icon-btn admin-icon-btn--danger" onClick={() => removeSemester(si)}>×</button></div>
                <div className="admin-module-list">{semester.modules.map((module, mi) => <div className="admin-module-row" key={mi}><span className="admin-module-row__handle">{mi + 1}</span><input className="admin-input" placeholder="Module name" value={module} onChange={e => updateModule(si, mi, e.target.value)} required/><button type="button" className="admin-icon-btn" onClick={() => removeModule(si, mi)}>×</button></div>)}<button type="button" className="admin-add-row" onClick={() => addModule(si)}>+ Add module</button></div>
                <Field label="Achievement (optional)" noMargin><input className="admin-input" placeholder="e.g. Innovation Fest — 2nd Place" value={semester.badge || ''} onChange={e => updateSemester(si, { badge: e.target.value })}/></Field>
              </div>)}</div>}
          </section>
          {error && <p className="admin-error admin-error--panel">{error}</p>}
          <div className="admin-form__footer admin-form__footer--sticky"><button type="button" className="admin-btn admin-btn--ghost" onClick={() => setForm(null)}>Cancel</button><button type="submit" className="admin-btn admin-btn--primary" disabled={saving}>{saving ? 'Saving…' : 'Save changes'}</button></div>
        </form>
      </div>
    </div>}
  </div>
}

function FormSection({ number, title, description, children }) {
  return <section className="admin-form-section"><div className="admin-form-section__heading"><span className="admin-form-section__number">{number}</span><div><h3>{title}</h3><p>{description}</p></div></div>{children}</section>
}

function Field({ label, compact, noMargin, children }) {
  return <div className={`admin-field ${compact ? 'admin-field--compact' : ''} ${noMargin ? 'admin-field--no-margin' : ''}`}><label className="admin-label">{label}</label>{children}</div>
}
