import { useMemo } from 'react'
import { useNavigate } from 'react-router-dom'
import { ROLE_ORDER } from '../../constants'
import { validateShuffle } from '../../utils/shuffle'
import PlayerCard from '../../components/PlayerCard/PlayerCard'
import ReadinessBar from '../../components/ReadinessBar/ReadinessBar'
import ThemeToggle from '../../components/ThemeToggle/ThemeToggle'
import styles from './CheckinPage.module.css'

export default function CheckinPage({
  players, toggle, isCheckedIn, checkedInPlayers, clearAll, numTeams, setNumTeams,
  theme, toggleTheme, isDark,
}) {
  const navigate = useNavigate()

  const today = new Date().toLocaleDateString('en-US', { weekday: 'long', day: 'numeric', month: 'short' })

  const sortedPlayers = useMemo(() =>
    [...players].sort((a, b) => {
      const ri = ROLE_ORDER.indexOf(a.role) - ROLE_ORDER.indexOf(b.role)
      return ri !== 0 ? ri : a.name.localeCompare(b.name)
    }), [players])

  const validation = validateShuffle(checkedInPlayers, numTeams)
  const canShuffle = validation.valid

  const disabledReason = !canShuffle && checkedInPlayers.length > 0
    ? `Need more: ${validation.issues.map(i => `${i.required - i.available} ${i.role}`).join(', ')}`
    : null

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className={styles.topBar}>
        <div className={styles.wordmark}>
          <span className={styles.wordmarkAccent}>VB</span>
          <span className={styles.wordmarkText}>VLPT</span>
        </div>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <h1 className={styles.hero}>Who's playing today?</h1>
      <div className={styles.headerRow}>
        <p className={styles.date}>{today}</p>
        <button className={styles.clearBtn} onClick={clearAll}>
          Clear session
        </button>
      </div>

      {players.length === 0 ? (
        <div className={styles.empty}>
          <div className={styles.emptyEmoji}>🏐</div>
          <p className={styles.emptyText}>Your roster is empty.</p>
          <button className={styles.emptyBtn} onClick={() => navigate('/roster')}>
            Add players to your roster →
          </button>
        </div>
      ) : (
        <>
          <div className={styles.playerList}>
            {sortedPlayers.map(p => (
              <PlayerCard
                key={p.id}
                player={p}
                mode="checkin"
                checked={isCheckedIn(p.id)}
                onToggle={toggle}
              />
            ))}
          </div>

          <div className={styles.readiness}>
            <ReadinessBar
              checkedInPlayers={checkedInPlayers}
              numTeams={numTeams}
              onNumTeamsChange={setNumTeams}
            />
          </div>
        </>
      )}

      {/* Sticky bottom strip */}
      {players.length > 0 && (
        <div className={styles.bottomStrip}>
          <div className={styles.counter}>
            <span className={`${styles.counterDot} ${canShuffle ? styles.dotReady : ''}`} />
            <span className={styles.counterNum}>{checkedInPlayers.length}</span>
            <span className={styles.counterLabel}>ready</span>
          </div>
          <button
            className={`${styles.ctaBtn} ${!canShuffle ? styles.ctaDisabled : ''}`}
            disabled={!canShuffle}
            onClick={() => navigate('/shuffle')}
            title={disabledReason || 'Shuffle teams'}
          >
            SHUFFLE →
          </button>
        </div>
      )}
    </div>
  )
}
