import styles from './CourtMatchCard.module.css'

/**
 * @typedef {object} LineupPlayer
 * @property {string | number} [id]
 * @property {string} name
 * @property {string} [role]
 * @property {string} [assignedRole]
 * @property {number} [slot]
 */

/**
 * @typedef {object} LineupTeam
 * @property {string | number} id
 * @property {string} name
 * @property {LineupPlayer[]} players
 * @property {{ bg: string, border: string, text: string }} color
 */

/**
 * @typedef {object} CourtMatch
 * @property {LineupTeam} teamA
 * @property {LineupTeam | null} teamB
 */

export default function CourtMatchCard({ match, matchNumber, round }) {
  return (
    <div
      className={styles.card}
      style={{ '--left-color': match.teamA.color.border, '--right-color': match.teamB?.color?.border }}
    >
      <div className={styles.matchHeader}>
        <div className={styles.matchMeta}>
          {round && <span className={styles.round}>{round}</span>}
          <span className={styles.matchNum}>#{matchNumber}</span>
        </div>

        <div className={styles.scoreline}>
          <span className={styles.teamA} style={{ color: match.teamA.color.text }}>
            {match.teamA.name}
          </span>
          <span className={styles.vs}>VS</span>
          {match.teamB ? (
            <span className={styles.teamB} style={{ color: match.teamB.color.text }}>
              {match.teamB.name}
            </span>
          ) : (
            <span className={styles.bye}>BYE</span>
          )}
        </div>
      </div>

      <div className={styles.lineups}>
        <LineupPanel team={match.teamA} side="left" />
        <div className={styles.centerDivider}>
          <span>VS</span>
        </div>
        {match.teamB ? (
          <LineupPanel team={match.teamB} side="right" />
        ) : (
          <div className={`${styles.lineupPanel} ${styles.byePanel}`}>
            <span className={styles.squadLabel}>Auto Advance</span>
            <span className={styles.byeText}>Bye</span>
          </div>
        )}
      </div>
    </div>
  )
}

function LineupPanel({ team, side }) {
  const players = team.players ?? []

  return (
    <section
      className={`${styles.lineupPanel} ${side === 'right' ? styles.lineupRight : ''}`}
      aria-label={`${team.name} lineup`}
    >
      <div className={styles.lineupTop}>
        <span className={styles.squadLabel}>
          {players.length === 6 ? 'Playing 6' : `Squad ${players.length}`}
        </span>
        <span className={styles.teamMark} style={{ color: team.color.text }}>
          {team.name}
        </span>
      </div>

      <ol className={styles.playerList}>
        {players.map((player, index) => (
          <li key={player.id ?? `${team.id}-${index}`} className={styles.playerRow}>
            <span className={styles.playerNumber}>{index + 1}</span>
            <span className={styles.playerName}>{player.name}</span>
          </li>
        ))}
      </ol>
    </section>
  )
}
