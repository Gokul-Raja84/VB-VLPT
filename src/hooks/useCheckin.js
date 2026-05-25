import { useState, useCallback, useMemo, useEffect } from 'react'

const KEY = 'vb-vlpt-checkin'

function load() {
  try { return new Set(JSON.parse(sessionStorage.getItem(KEY)) || []) } catch { return new Set() }
}
function save(s) {
  try { sessionStorage.setItem(KEY, JSON.stringify([...s])) } catch (error) {
    console.warn('Unable to save check-in state', error)
  }
}

export function useCheckin(players) {
  const [checkedIn, setCheckedIn] = useState(load)
  const playerIds = useMemo(() => new Set(players.map(p => p.id)), [players])
  const activeCheckedIn = useMemo(
    () => new Set([...checkedIn].filter(id => playerIds.has(id))),
    [checkedIn, playerIds]
  )

  // Keep persisted check-ins pruned when roster entries are deleted.
  useEffect(() => {
    if (activeCheckedIn.size !== checkedIn.size) save(activeCheckedIn)
  }, [activeCheckedIn, checkedIn])

  const toggle = useCallback((id) => {
    setCheckedIn(prev => {
      const next = new Set([...prev].filter(playerId => playerIds.has(playerId)))
      next.has(id) ? next.delete(id) : next.add(id)
      save(next)
      return next
    })
  }, [playerIds])

  const isCheckedIn = useCallback((id) => activeCheckedIn.has(id), [activeCheckedIn])

  const checkedInPlayers = useMemo(
    () => players.filter(p => activeCheckedIn.has(p.id)),
    [players, activeCheckedIn]
  )

  const clearAll = useCallback(() => { setCheckedIn(new Set()); save(new Set()) }, [])

  return { checkedIn: activeCheckedIn, toggle, isCheckedIn, checkedInPlayers, clearAll, count: activeCheckedIn.size }
}
