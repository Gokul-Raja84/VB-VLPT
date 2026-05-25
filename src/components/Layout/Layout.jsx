import { NavLink, Outlet } from 'react-router-dom'
import GlobalNetBackground from '../GlobalNetBackground/GlobalNetBackground'
import styles from './Layout.module.css'

export default function Layout() {
  return (
    <div className={styles.root}>
      <GlobalNetBackground />
      <main className={styles.main}>
        <Outlet />
      </main>

      <nav className={styles.nav} aria-label="Main navigation">
        <div className={styles.tabList}>
          <NavLink to="/" end className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
            {/* Person + check icon */}
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M20 21v-2a4 4 0 0 0-4-4H8a4 4 0 0 0-4 4v2"/>
              <circle cx="12" cy="7" r="4"/>
              <polyline points="17 11 19 13 23 9" />
            </svg>
            <span className={styles.label}>Check-in</span>
          </NavLink>

          <NavLink to="/roster" className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
            {/* Group icon */}
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M17 21v-2a4 4 0 0 0-4-4H5a4 4 0 0 0-4 4v2"/>
              <circle cx="9" cy="7" r="4"/>
              <path d="M23 21v-2a4 4 0 0 0-3-3.87"/>
              <path d="M16 3.13a4 4 0 0 1 0 7.75"/>
            </svg>
            <span className={styles.label}>Roster</span>
          </NavLink>

          <NavLink to="/shuffle" className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
            {/* Shuffle icon */}
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <polyline points="16 3 21 3 21 8"/>
              <line x1="4" y1="20" x2="21" y2="3"/>
              <polyline points="21 16 21 21 16 21"/>
              <line x1="15" y1="15" x2="21" y2="21"/>
              <line x1="4" y1="4" x2="9" y2="9"/>
            </svg>
            <span className={styles.label}>Shuffle</span>
          </NavLink>

          <NavLink to="/tournament" className={({ isActive }) => `${styles.tab} ${isActive ? styles.active : ''}`}>
            {/* Trophy icon */}
            <svg className={styles.icon} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
              <path d="M8 21h8"/>
              <path d="M12 17v4"/>
              <path d="M7 4h10v5a5 5 0 0 1-10 0V4Z"/>
              <path d="M7 7H4a2 2 0 0 0 2 3.46"/>
              <path d="M17 7h3a2 2 0 0 1-2 3.46"/>
            </svg>
            <span className={styles.label}>Tournament</span>
          </NavLink>
        </div>

        <div className={styles.credit}>
          Designed and Developed by Gokul Raja⚡
        </div>
      </nav>
    </div>
  )
}
