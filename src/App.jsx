import { useState } from 'react'
import { Routes, Route } from 'react-router-dom'
import Layout from './components/Layout/Layout'
import CheckinPage from './pages/CheckinPage/CheckinPage'
import RosterPage from './pages/RosterPage/RosterPage'
import ShufflePage from './pages/ShufflePage/ShufflePage'
import CourtOrderPage from './pages/CourtOrderPage/CourtOrderPage'
import TournamentPage from './pages/TournamentPage/TournamentPage'
import { useRoster } from './hooks/useRoster'
import { useCheckin } from './hooks/useCheckin'
import { useTheme } from './hooks/useTheme'
import { usePIN } from './hooks/usePIN'

export default function App() {
  const { players, addPlayer, updatePlayer, deletePlayer } = useRoster()
  const { toggle, isCheckedIn, checkedInPlayers, clearAll } = useCheckin(players)
  const { theme, toggleTheme, isDark } = useTheme()
  const pinHook = usePIN()
  const [numTeams, setNumTeams] = useState(2)

  const sharedThemeProps = { theme, toggleTheme, isDark }

  return (
    <Routes>
      <Route element={<Layout />}>
        <Route
          path="/"
          element={
            <CheckinPage
              players={players}
              toggle={toggle}
              isCheckedIn={isCheckedIn}
              checkedInPlayers={checkedInPlayers}
              clearAll={clearAll}
              numTeams={numTeams}
              setNumTeams={setNumTeams}
              {...sharedThemeProps}
            />
          }
        />
        <Route
          path="/roster"
          element={
            <RosterPage
              players={players}
              addPlayer={addPlayer}
              updatePlayer={updatePlayer}
              deletePlayer={deletePlayer}
              pinHook={pinHook}
              {...sharedThemeProps}
            />
          }
        />
        <Route
          path="/shuffle"
          element={
            <ShufflePage
              checkedInPlayers={checkedInPlayers}
              numTeams={numTeams}
              setNumTeams={setNumTeams}
              {...sharedThemeProps}
            />
          }
        />
        <Route path="/court-order" element={<CourtOrderPage />} />
        <Route
          path="/tournament"
          element={<TournamentPage {...sharedThemeProps} />}
        />
      </Route>
    </Routes>
  )
}
