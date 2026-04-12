import { ROLE_META, ROLE_ORDER } from '../../constants'
import RoleBadge from '../RoleBadge/RoleBadge'
import styles from './TeamCard.module.css'

export default function TeamCard({ team, animationDelay = 0 }) {
  const sorted = [...team.players].sort(
    (a, b) => ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole)
  )

  return (
    <div
      className={styles.card}
      style={{ '--tc': team.color.border, animationDelay: `${animationDelay}ms` }}
    >
      <div className={styles.stripe} />
      <div className={styles.content}>
        <div className={styles.header}>
          <h3 className={styles.teamName} style={{ color: team.color.text }}>
            {team.name}
          </h3>
          <span className={styles.playerCount}>{team.players.length}p</span>
        </div>
        <div className={styles.playerList}>
          {sorted.map(p => (
            <div key={p.id} className={styles.playerRow}>
              <RoleBadge role={p.assignedRole} short />
              <span className={styles.playerName}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  )
}
