import { ROLE_META } from '../../constants'
import RoleBadge from '../RoleBadge/RoleBadge'
import styles from './PlayerCard.module.css'

export default function PlayerCard({
  player,
  mode = 'roster',      // 'roster' | 'checkin'
  checked = false,
  onToggle,
  onEdit,
  onDelete,
}) {
  const meta = ROLE_META[player.role]

  const handleClick = () => {
    if (mode === 'checkin') onToggle?.(player.id)
  }

  const handleKey = (e) => {
    if (mode === 'checkin' && (e.key === 'Enter' || e.key === ' ')) {
      e.preventDefault()
      onToggle?.(player.id)
    }
  }

  return (
    <div
      className={`${styles.card} ${mode === 'checkin' ? styles.checkinCard : styles.rosterCard} ${checked ? styles.checked : ''}`}
      style={{ '--role-color': meta?.color, '--role-bg': meta?.bgColor }}
      onClick={handleClick}
      onKeyDown={handleKey}
      role={mode === 'checkin' ? 'button' : undefined}
      tabIndex={mode === 'checkin' ? 0 : undefined}
      aria-pressed={mode === 'checkin' ? checked : undefined}
    >
      {/* Left accent bar */}
      <div className={styles.accentBar} />

      <div className={styles.body}>
        <div className={styles.left}>
          <span className={styles.name}>{player.name}</span>
          <RoleBadge role={player.role} short glow={checked} />
        </div>

        <div className={styles.right}>
          {mode === 'checkin' ? (
            <div className={`${styles.checkCircle} ${checked ? styles.checkFilled : ''}`}>
              {checked && (
                <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="3" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="20 6 9 17 4 12" />
                </svg>
              )}
            </div>
          ) : (
            <div className={styles.actions}>
              <button
                className={styles.iconBtn}
                onClick={e => { e.stopPropagation(); onEdit?.(player) }}
                aria-label={`Edit ${player.name}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M11 4H4a2 2 0 0 0-2 2v14a2 2 0 0 0 2 2h14a2 2 0 0 0 2-2v-7"/>
                  <path d="M18.5 2.5a2.121 2.121 0 0 1 3 3L12 15l-4 1 1-4 9.5-9.5z"/>
                </svg>
              </button>
              <button
                className={`${styles.iconBtn} ${styles.deleteBtn}`}
                onClick={e => { e.stopPropagation(); onDelete?.(player.id) }}
                aria-label={`Delete ${player.name}`}
              >
                <svg width="15" height="15" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <polyline points="3 6 5 6 21 6"/>
                  <path d="M19 6v14a2 2 0 0 1-2 2H7a2 2 0 0 1-2-2V6m3 0V4a2 2 0 0 1 2-2h4a2 2 0 0 1 2 2v2"/>
                </svg>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
