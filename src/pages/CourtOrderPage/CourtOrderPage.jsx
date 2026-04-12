import { useState, useEffect } from 'react'
import { useLocation, useNavigate } from 'react-router-dom'
import CourtMatchCard from '../../components/CourtMatchCard/CourtMatchCard'
import styles from './CourtOrderPage.module.css'

// Generate round robin matches
function generateRoundRobin(teams) {
  const matches = []
  for (let i = 0; i < teams.length; i++) {
    for (let j = i + 1; j < teams.length; j++) {
      matches.push({ teamA: teams[i], teamB: teams[j] })
    }
  }
  // Shuffle order
  for (let i = matches.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [matches[i], matches[j]] = [matches[j], matches[i]]
  }
  return matches
}

// Generate knockout bracket
function generateKnockout(teams) {
  const rounds = []
  let current = [...teams]

  // Shuffle seeding
  for (let i = current.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [current[i], current[j]] = [current[j], current[i]]
  }

  let roundNum = 1
  while (current.length > 1) {
    const roundMatches = []
    for (let i = 0; i < current.length - 1; i += 2) {
      roundMatches.push({ teamA: current[i], teamB: current[i + 1] })
    }
    if (current.length % 2 !== 0) {
      roundMatches.push({ teamA: current[current.length - 1], teamB: null }) // Bye
    }
    rounds.push({ label: current.length === 2 ? 'FINAL' : `Round ${roundNum}`, matches: roundMatches })
    current = current.slice(0, Math.ceil(current.length / 2)) // advance winners (placeholder)
    roundNum++
  }
  return rounds
}

// Session storage key for preserving results
const SESSION_KEY = 'vb-vlpt-court-teams'

export default function CourtOrderPage() {
  const location = useLocation()
  const navigate = useNavigate()
  const [format, setFormat] = useState('roundrobin')
  const [matchKey, setMatchKey] = useState(0)

  // Get teams from router state or sessionStorage
  const stateTeams = location.state?.teams
  useEffect(() => {
    if (stateTeams) {
      try { sessionStorage.setItem(SESSION_KEY, JSON.stringify(stateTeams)) } catch {}
    }
  }, [stateTeams])

  const teams = stateTeams || (() => {
    try { return JSON.parse(sessionStorage.getItem(SESSION_KEY)) } catch { return null }
  })()

  if (!teams) {
    navigate('/shuffle', { replace: true })
    return null
  }

  const matches = format === 'roundrobin' ? generateRoundRobin(teams) : null
  const rounds = format === 'knockout' ? generateKnockout(teams) : null

  return (
    <div className="page-wrapper">
      {/* Back */}
      <div className={styles.topBar}>
        <button className={styles.backBtn} onClick={() => navigate(-1)}>
          <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
            <polyline points="15 18 9 12 15 6"/>
          </svg>
          Back
        </button>
        <button className={styles.redrawBtn} onClick={() => setMatchKey(k => k + 1)}>
          🎲 Re-draw
        </button>
      </div>

      <h1 className={styles.title}>Court Order</h1>

      {/* Format toggle */}
      <div className={styles.formatToggle}>
        <button
          className={`${styles.fmtPill} ${format === 'roundrobin' ? styles.fmtOn : ''}`}
          onClick={() => setFormat('roundrobin')}
        >Round Robin</button>
        <button
          className={`${styles.fmtPill} ${format === 'knockout' ? styles.fmtOn : ''}`}
          onClick={() => setFormat('knockout')}
        >Knockout</button>
      </div>

      {/* Subtitle */}
      {format === 'roundrobin' && (
        <p className={styles.subtitle}>All {teams.length} teams play each other once — {teams.length * (teams.length - 1) / 2} matches</p>
      )}
      {format === 'knockout' && (
        <p className={styles.subtitle}>Winners advance automatically · Byes auto-advance</p>
      )}

      {/* Matches */}
      <div className={styles.matchList} key={matchKey}>
        {format === 'roundrobin' && matches?.map((m, i) => (
          <div key={i} className={styles.matchWrap} style={{ animationDelay: `${i * 60}ms` }}>
            <CourtMatchCard match={m} matchNumber={i + 1} />
          </div>
        ))}

        {format === 'knockout' && rounds?.map((round, ri) => (
          <div key={ri} className={styles.roundGroup}>
            <div className={styles.roundLabel}>{round.label}</div>
            {round.matches.map((m, mi) => (
              <div key={mi} className={styles.matchWrap} style={{ animationDelay: `${(ri * 3 + mi) * 60}ms` }}>
                <CourtMatchCard match={m} matchNumber={`${ri + 1}.${mi + 1}`} />
              </div>
            ))}
          </div>
        ))}
      </div>
    </div>
  )
}
