import { useState } from 'react'
import styles from './ShuffleButton.module.css'

export default function ShuffleButton({ onClick, disabled, disabledReason }) {
  const [animating, setAnimating] = useState(false)

  const handleClick = () => {
    if (disabled || animating) return
    setAnimating(true)
    setTimeout(() => { setAnimating(false); onClick() }, 520)
  }

  return (
    <div className={styles.wrapper}>
      {disabled && disabledReason && (
        <p className={styles.reason}>{disabledReason}</p>
      )}
      <button
        className={`${styles.btn} ${disabled ? styles.disabled : animating ? styles.bounce : styles.ready}`}
        onClick={handleClick}
        disabled={disabled}
      >
        <span className={styles.label}>Shuffle</span>
      </button>
    </div>
  )
}
