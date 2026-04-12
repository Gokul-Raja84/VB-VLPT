import { useState, useEffect } from 'react'
import styles from './PINModal.module.css'

const DIGITS = [1, 2, 3, 4, 5, 6, 7, 8, 9, null, 0, 'del']

// mode: 'enter' | 'set' | 'confirm'
export default function PINModal({ mode, onVerify, onSet, onSkip, onReset, wrongCount = 0 }) {
  const [input, setInput] = useState('')
  const [confirmInput, setConfirmInput] = useState('')
  const [phase, setPhase] = useState('set1') // 'set1' | 'set2'
  const [shake, setShake] = useState(false)
  const [firstPin, setFirstPin] = useState('')

  useEffect(() => { setInput(''); setConfirmInput(''); setPhase('set1'); setFirstPin('') }, [mode])

  const triggerShake = () => {
    setShake(true)
    setTimeout(() => setShake(false), 500)
  }

  const handleDigit = (d) => {
    if (d === 'del') {
      setInput(p => p.slice(0, -1))
      return
    }
    const next = input + d
    if (next.length > 4) return
    setInput(next)

    if (next.length === 4) {
      setTimeout(() => {
        if (mode === 'enter') {
          const ok = onVerify(next)
          if (!ok) { triggerShake(); setInput('') }
        } else {
          // set mode
          if (phase === 'set1') {
            setFirstPin(next)
            setInput('')
            setPhase('set2')
          } else {
            if (next === firstPin) {
              onSet(next)
            } else {
              triggerShake()
              setInput('')
              setPhase('set1')
              setFirstPin('')
            }
          }
        }
      }, 80)
    }
  }

  const title = mode === 'enter'
    ? 'Enter PIN'
    : phase === 'set1' ? 'Create PIN' : 'Confirm PIN'

  const subtitle = mode === 'enter'
    ? 'Enter your 4-digit PIN to access the roster'
    : phase === 'set1'
      ? 'Choose a 4-digit PIN to protect your roster'
      : 'Re-enter your PIN to confirm'

  return (
    <div className={styles.overlay}>
      <div className={styles.sheet}>
        <div className={styles.handle} />

        <h2 className={styles.title}>{title}</h2>
        <p className={styles.subtitle}>{subtitle}</p>

        {/* Dots */}
        <div className={`${styles.dots} ${shake ? styles.shake : ''}`}>
          {Array.from({ length: 4 }, (_, i) => (
            <div key={i} className={`${styles.dot} ${i < input.length ? styles.dotFilled : ''}`} />
          ))}
        </div>

        {/* Numpad */}
        <div className={styles.pad}>
          {DIGITS.map((d, i) => (
            d === null ? (
              <div key={i} />
            ) : (
              <button
                key={i}
                className={`${styles.digitBtn} ${d === 'del' ? styles.delBtn : ''}`}
                onClick={() => handleDigit(d)}
                aria-label={d === 'del' ? 'Delete' : String(d)}
              >
                {d === 'del' ? (
                  <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                    <path d="M21 4H8l-7 8 7 8h13a2 2 0 0 0 2-2V6a2 2 0 0 0-2-2z"/>
                    <line x1="18" y1="9" x2="12" y2="15"/>
                    <line x1="12" y1="9" x2="18" y2="15"/>
                  </svg>
                ) : d}
              </button>
            )
          ))}
        </div>

        <div className={styles.links}>
          {mode === 'enter' && (
            <>
              <button className={styles.link} onClick={onReset}>Reset PIN</button>
            </>
          )}
          {mode === 'set' && (
            <button className={styles.link} onClick={onSkip}>Skip for now</button>
          )}
        </div>
      </div>
    </div>
  )
}
