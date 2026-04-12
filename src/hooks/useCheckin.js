import { useState, useCallback, useMemo, useEffect } from 'react'

const KEY = 'vb-vlpt-checkin'

function load() {
  try { return new Set(JSON.parse(sessionStorage.getItem(KEY)) || []) } catch { return new Set() }
}
function save(s) {
  try { sessionStorage.setItem(KEY, JSON.stringify([...s])) } catch {}
}

export function useCheckin(players) {
  const [checkedIn, setCheckedIn] = useState(load)

  // Auto-remove deleted players
  useEffect(() => {
    const ids = new Set(players.map(p => p.id))
    setCheckedIn(prev => {
      const next = new Set([...prev].filter(id => ids.has(id)))
      if (next.size !== prev.size) { save(next); return next }
      return prev
    })
  }, [players])

  const toggle = useCallback((id) => {
    setCheckedIn(prev => {
      const next = new Set(prev)
      next.has(id) ? next.delete(id) : next.add(id)
      save(next)
      return next
    })
  }, [])

  const isCheckedIn = useCallback((id) => checkedIn.has(id), [checkedIn])

  const checkedInPlayers = useMemo(
    () => players.filter(p => checkedIn.has(p.id)),
    [players, checkedIn]
  )

  const clearAll = useCallback(() => { setCheckedIn(new Set()); save(new Set()) }, [])

  return { checkedIn, toggle, isCheckedIn, checkedInPlayers, clearAll, count: checkedIn.size }
}
