import styles from './CourtMatchCard.module.css'

export default function CourtMatchCard({ match, matchNumber, round }) {
  return (
    <div
      className={styles.card}
      style={{ '--left-color': match.teamA.color.border, '--right-color': match.teamB?.color?.border }}
    >
      {round && <span className={styles.round}>{round}</span>}
      <div className={styles.matchNum}>#{matchNumber}</div>
      <div className={styles.teams}>
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
  )
}
