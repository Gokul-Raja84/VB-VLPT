import { useState, useCallback } from 'react'

const PIN_KEY = 'vb-vlpt-pin'
const SESSION_KEY = 'vb-vlpt-pin-verified'

export function usePIN() {
  const [pin, setPINState] = useState(() => {
    try { return localStorage.getItem(PIN_KEY) } catch { return null }
  })
  const [verified, setVerified] = useState(() => {
    try { return sessionStorage.getItem(SESSION_KEY) === '1' } catch { return false }
  })

  const isPINSet = Boolean(pin)
  const isPINVerified = verified
  const requiresPIN = isPINSet && !isPINVerified

  const verifyPIN = useCallback((input) => {
    if (input === pin) {
      setVerified(true)
      try { sessionStorage.setItem(SESSION_KEY, '1') } catch (error) {
        console.warn('Unable to save PIN verification state', error)
      }
      return true
    }
    return false
  }, [pin])

  const setPIN = useCallback((newPin) => {
    setPINState(newPin)
    setVerified(true)
    try {
      localStorage.setItem(PIN_KEY, newPin)
      sessionStorage.setItem(SESSION_KEY, '1')
    } catch (error) {
      console.warn('Unable to save PIN', error)
    }
  }, [])

  const resetPIN = useCallback(() => {
    setPINState(null)
    setVerified(false)
    try {
      localStorage.removeItem(PIN_KEY)
      sessionStorage.removeItem(SESSION_KEY)
    } catch (error) {
      console.warn('Unable to reset PIN', error)
    }
  }, [])

  const skipVerification = useCallback(() => {
    setVerified(true)
    try { sessionStorage.setItem(SESSION_KEY, '1') } catch (error) {
      console.warn('Unable to save PIN verification state', error)
    }
  }, [])

  return { isPINSet, isPINVerified, requiresPIN, verifyPIN, setPIN, resetPIN, skipVerification }
}
