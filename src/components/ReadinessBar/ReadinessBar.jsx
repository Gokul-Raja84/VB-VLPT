import { ROLE_META, ROLE_ORDER } from '../../constants'
import { getRoleReadiness } from '../../utils/shuffle'
import styles from './ReadinessBar.module.css'

export default function ReadinessBar({ checkedInPlayers, numTeams, onNumTeamsChange }) {
  const readiness = getRoleReadiness(checkedInPlayers, numTeams)

  return (
    <div className={styles.container}>
      <div className={styles.header}>
        <span className={styles.sectionLabel}>Role Readiness</span>
        <div className={styles.stepper}>
          <button
            className={styles.stepBtn}
            onClick={() => onNumTeamsChange(Math.max(2, numTeams - 1))}
            disabled={numTeams <= 2}
            aria-label="Fewer teams"
          >—</button>
          <span className={styles.stepValue}>{numTeams} teams</span>
          <button
            className={styles.stepBtn}
            onClick={() => onNumTeamsChange(numTeams + 1)}
            aria-label="More teams"
          >+</button>
        </div>
      </div>

      <div className={styles.tiles}>
        {readiness.map(({ role, available, required, ok }) => {
          const meta = ROLE_META[role]
          return (
            <div
              key={role}
              className={`${styles.tile} ${ok ? styles.tileOk : styles.tileBad}`}
              style={{ '--rc': meta.color }}
            >
              <span className={styles.tileRole}>{meta.shortLabel}</span>
              <span className={`${styles.tileCount} ${ok ? styles.countOk : styles.countBad}`}>
                {available}<span className={styles.tileSlash}>/{required}</span>
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
