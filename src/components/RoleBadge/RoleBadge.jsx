import { ROLE_META } from '../../constants'
import styles from './RoleBadge.module.css'

export default function RoleBadge({ role, short = false, glow = false }) {
  const meta = ROLE_META[role]
  if (!meta) return null
  return (
    <span
      className={`${styles.badge} ${glow ? styles.glow : ''}`}
      style={{ '--role-color': meta.color, '--role-bg': meta.bgColor }}
    >
      {short ? meta.shortLabel : meta.label}
    </span>
  )
}
