import { useState, useEffect, useRef } from 'react'
import { ROLE_META, ROLE_ORDER } from '../../constants'
import styles from './AddPlayerModal.module.css'

export default function AddPlayerModal({ open, onClose, onSave, editPlayer, existingNames = [] }) {
  if (!open) return null

  return (
    <AddPlayerForm
      key={editPlayer?.id ?? 'new-player'}
      onClose={onClose}
      onSave={onSave}
      editPlayer={editPlayer}
      existingNames={existingNames}
    />
  )
}

function AddPlayerForm({ onClose, onSave, editPlayer, existingNames }) {
  const [name, setName] = useState(editPlayer?.name ?? '')
  const [role, setRole] = useState(editPlayer?.role ?? '')
  const [error, setError] = useState('')
  const inputRef = useRef(null)

  useEffect(() => {
    const focusTimer = setTimeout(() => inputRef.current?.focus(), 80)
    return () => clearTimeout(focusTimer)
  }, [])

  const handleSave = () => {
    const trimmed = name.trim()
    if (!trimmed) { setError('Name cannot be empty'); return }
    if (!role) { setError('Please select a role'); return }
    const isDupe = existingNames.some(
      n => n.toLowerCase() === trimmed.toLowerCase() &&
      (!editPlayer || editPlayer.name.toLowerCase() !== trimmed.toLowerCase())
    )
    if (isDupe) { setError('A player with this name already exists'); return }
    onSave(trimmed, role)
    onClose()
  }

  return (
    <div className={styles.overlay} onClick={onClose} role="dialog" aria-modal="true">
      <div className={styles.sheet} onClick={e => e.stopPropagation()}>
        <div className={styles.handle} />
        <h2 className={styles.title}>{editPlayer ? 'Edit Player' : 'Add Player'}</h2>

        <div className={styles.field}>
          <input
            ref={inputRef}
            id="player-name"
            className={styles.input}
            type="text"
            value={name}
            onChange={e => { setName(e.target.value); setError('') }}
            placeholder="Player name"
            onKeyDown={e => { if (e.key === 'Enter') handleSave(); if (e.key === 'Escape') onClose() }}
          />
        </div>

        <div className={styles.roleSection}>
          <p className={styles.roleLabel}>Select Role</p>
          <div className={styles.roleGrid}>
            {ROLE_ORDER.map(r => {
              const meta = ROLE_META[r]
              const active = role === r
              return (
                <button
                  key={r}
                  className={`${styles.rolePill} ${active ? styles.roleActive : ''}`}
                  style={{
                    '--rc': meta.color,
                    '--rcbg': meta.bgColor,
                    ...(active ? { background: meta.color, color: '#fff', borderColor: meta.color } : {})
                  }}
                  onClick={() => { setRole(r); setError('') }}
                  type="button"
                >
                  {meta.label}
                </button>
              )
            })}
          </div>
        </div>

        {error && <p className={styles.error}>{error}</p>}

        <div className={styles.actions}>
          <button className={styles.cancelBtn} onClick={onClose} type="button">Cancel</button>
          <button className={styles.saveBtn} onClick={handleSave} type="button">
            {editPlayer ? 'Update' : 'Add Player'}
          </button>
        </div>
      </div>
    </div>
  )
}
