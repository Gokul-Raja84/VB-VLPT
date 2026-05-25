import { useState, useCallback, useEffect } from 'react'

const KEY = 'vb-vlpt-roster'

export function useRoster() {
  const [players, setPlayers] = useState(() => {
    try { return JSON.parse(localStorage.getItem(KEY)) || [] } catch { return [] }
  })

  useEffect(() => {
    try { localStorage.setItem(KEY, JSON.stringify(players)) } catch (error) {
      console.warn('Unable to save roster', error)
    }
  }, [players])

  const addPlayer = useCallback((name, role) => {
    const p = { id: crypto.randomUUID(), name: name.trim(), role, createdAt: Date.now() }
    setPlayers(prev => [...prev, p])
    return p
  }, [])

  const updatePlayer = useCallback((id, patch) => {
    setPlayers(prev => prev.map(p => p.id === id ? { ...p, ...patch } : p))
  }, [])

  const deletePlayer = useCallback((id) => {
    setPlayers(prev => prev.filter(p => p.id !== id))
  }, [])

  return { players, addPlayer, updatePlayer, deletePlayer }
}
