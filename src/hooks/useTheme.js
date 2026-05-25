import { useState, useEffect, useCallback } from 'react'

const KEY = 'vb-vlpt-theme'
const DEFAULT = 'dark'

export function useTheme() {
  const [theme, setTheme] = useState(() => {
    try { return localStorage.getItem(KEY) || DEFAULT } catch { return DEFAULT }
  })

  useEffect(() => {
    document.documentElement.setAttribute('data-theme', theme)
    try { localStorage.setItem(KEY, theme) } catch (error) {
      console.warn('Unable to save theme', error)
    }
  }, [theme])

  const toggleTheme = useCallback(() => {
    setTheme(t => t === 'dark' ? 'light' : 'dark')
  }, [])

  return { theme, toggleTheme, isDark: theme === 'dark' }
}
