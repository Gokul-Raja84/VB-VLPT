import { useState } from 'react'
import { ROLE_ORDER, ROLE_META } from '../../constants'
import PlayerCard from '../../components/PlayerCard/PlayerCard'
import AddPlayerModal from '../../components/AddPlayerModal/AddPlayerModal'
import PINModal from '../../components/PINModal/PINModal'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import styles from './RosterPage.module.css'

export default function RosterPage({ players, addPlayer, updatePlayer, deletePlayer, pinHook, toggleTheme, isDark }) {
  const [modalOpen, setModalOpen] = useState(false)
  const [editPlayer, setEditPlayer] = useState(null)
  const [showSetPIN, setShowSetPIN] = useState(false)
  const { isPINSet, requiresPIN, verifyPIN, setPIN, resetPIN, skipVerification } = pinHook

  // Group by role
  const grouped = ROLE_ORDER.reduce((acc, role) => {
    acc[role] = players.filter(p => p.role === role)
    return acc
  }, {})

  const handleSave = (name, role) => {
    if (editPlayer) updatePlayer(editPlayer.id, { name, role })
    else addPlayer(name, role)
    setEditPlayer(null)
  }

  const handleEdit = (player) => { setEditPlayer(player); setModalOpen(true) }

  const handleDelete = (id) => {
    if (window.confirm('Remove this player?')) deletePlayer(id)
  }

  // Determine PIN modal mode
  const pinMode = requiresPIN      ? 'enter'
                : !isPINSet && showSetPIN ? 'set'
                : null

  return (
    <div className="page-wrapper">
      {/* PIN FLOW */}
      {pinMode === 'enter' && (
        <PINModal
          mode="enter"
          onVerify={verifyPIN}
          onReset={() => { resetPIN(); }}
        />
      )}
      {pinMode === 'set' && (
        <PINModal
          mode="set"
          onSet={(pin) => { setPIN(pin); setShowSetPIN(false) }}
          onSkip={() => { skipVerification(); setShowSetPIN(false) }}
        />
      )}

      {/* Header */}
      <div className={styles.topBar}>
        <div className={styles.titleGroup}>
          <h1 className={styles.title}>Roster</h1>
          <span className={styles.badge}>{players.length}p</span>
        </div>
        <div className={styles.topRight}>
          {!isPINSet && (
            <button className={styles.pinSetBtn} onClick={() => setShowSetPIN(true)} title="Set PIN">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
              </svg>
            </button>
          )}
          {isPINSet && (
            <button className={styles.pinSetBtn} onClick={() => { if (window.confirm('Reset PIN?')) resetPIN() }} title="PIN active — click to reset">
              <svg width="16" height="16" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect x="3" y="11" width="18" height="11" rx="2" ry="2"/>
                <path d="M7 11V7a5 5 0 0 1 10 0v4"/>
                <line x1="12" y1="16" x2="12" y2="16.01"/>
              </svg>
            </button>
          )}
          <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
        </div>
      </div>

      {/* Empty state */}
      {players.length === 0 && (
        <div className={styles.empty}>
          <div className={styles.emptyIcon}>📋</div>
          <h2 className={styles.emptyTitle}>Empty roster</h2>
          <p className={styles.emptyText}>Tap the + button to add your first player</p>
        </div>
      )}

      {/* Role sections */}
      <div className={styles.sections}>
        {ROLE_ORDER.map(role => {
          const rolePlayers = grouped[role]
          if (rolePlayers.length === 0) return null
          const meta = ROLE_META[role]
          return (
            <div key={role} className={styles.section}>
              <div className={styles.sectionHeader} style={{ '--rc': meta.color }}>
                <span className={styles.sectionDot} />
                <span className={styles.sectionName}>{meta.label}</span>
                <span className={styles.sectionCount}>{rolePlayers.length}</span>
              </div>
              <div className={styles.playerList}>
                {rolePlayers.map(p => (
                  <PlayerCard
                    key={p.id}
                    player={p}
                    mode="roster"
                    onEdit={handleEdit}
                    onDelete={handleDelete}
                  />
                ))}
              </div>
            </div>
          )
        })}
      </div>

      {/* FAB */}
      <button
        className={styles.fab}
        onClick={() => { setEditPlayer(null); setModalOpen(true) }}
        aria-label="Add player"
      >
        <svg width="28" height="28" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.5" strokeLinecap="round">
          <line x1="12" y1="5" x2="12" y2="19"/>
          <line x1="5" y1="12" x2="19" y2="12"/>
        </svg>
      </button>

      <AddPlayerModal
        open={modalOpen}
        onClose={() => { setModalOpen(false); setEditPlayer(null) }}
        onSave={handleSave}
        editPlayer={editPlayer}
        existingNames={players.map(p => p.name)}
      />
    </div>
  )
}
