import styles from './BenchCard.module.css'
import RoleBadge from '../RoleBadge/RoleBadge'

export default function BenchCard({ bench }) {
  if (!bench || bench.length === 0) return null

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>BENCH</span>
        <span className={styles.count}>{bench.length} player{bench.length !== 1 ? 's' : ''}</span>
      </div>
      <div className={styles.list}>
        {bench.map(p => (
          <div key={p.id} className={styles.row}>
            <RoleBadge role={p.role} short />
            <span className={styles.name}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  )
}
