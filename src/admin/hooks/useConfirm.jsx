import { useState, useCallback } from 'react'

function ConfirmModal({ message, title, onConfirm, onCancel }) {
  return (
    <div className="admin-modal-overlay" onClick={onCancel}>
      <div className="admin-confirm-modal" onClick={e => e.stopPropagation()}>
        <h3 className="admin-confirm-modal__title">{title || 'Delete this?'}</h3>
        <p className="admin-confirm-modal__message">{message}</p>
        <div className="admin-confirm-modal__actions">
          <button className="admin-confirm-modal__cancel" onClick={onCancel}>Cancel</button>
          <button className="admin-confirm-modal__ok" onClick={onConfirm}>Delete</button>
        </div>
      </div>
    </div>
  )
}

export function useConfirm() {
  const [state, setState] = useState(null)

  const confirm = useCallback((message, title) => {
    return new Promise(resolve => {
      setState({ message, title, resolve })
    })
  }, [])

  const handleClose = result => {
    state?.resolve(result)
    setState(null)
  }

  const element = state ? (
    <ConfirmModal
      message={state.message}
      title={state.title}
      onConfirm={() => handleClose(true)}
      onCancel={() => handleClose(false)}
    />
  ) : null

  return [element, confirm]
}
