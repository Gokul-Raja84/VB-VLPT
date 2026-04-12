import { ROLES, ROLE_COUNT_PER_TEAM, ROLE_ORDER, getTeamNames } from '../constants'

// ─── FISHER-YATES IN-PLACE SHUFFLE ────────────────────────────────────────────
function fisherYates(array) {
  const arr = [...array]
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[arr[i], arr[j]] = [arr[j], arr[i]]
  }
  return arr
}

// ─── GROUP PLAYERS BY ROLE ────────────────────────────────────────────────────
function groupByRole(players) {
  return players.reduce((acc, player) => {
    const role = player.role
    if (!acc[role]) acc[role] = []
    acc[role].push(player)
    return acc
  }, {})
}

// ─── VALIDATE: can we form N complete teams? ──────────────────────────────────
/**
 * @param {Player[]} checkedInPlayers
 * @param {number}   numTeams
 * @returns {{ valid: boolean, issues: RoleIssue[] }}
 *
 * RoleIssue: { role, required, available }
 */
export function validateShuffle(checkedInPlayers, numTeams) {
  const grouped = groupByRole(checkedInPlayers)
  const issues = []

  for (const role of ROLE_ORDER) {
    const countPerTeam = ROLE_COUNT_PER_TEAM[role]
    const required     = countPerTeam * numTeams
    const available    = grouped[role]?.length ?? 0

    if (available < required) {
      issues.push({ role, required, available })
    }
  }

  return { valid: issues.length === 0, issues }
}

// ─── MAIN SHUFFLE ─────────────────────────────────────────────────────────────
/**
 * Builds N balanced teams from checked-in players.
 *
 * Strategy:
 *   1. Group players by role.
 *   2. Fisher-Yates shuffle each role bucket.
 *   3. Distribute round-robin: assign 1 setter to team-0, 1 to team-1 ... etc.
 *      For liberos (2 per team) do two passes.
 *   4. Attach randomised fun/alpha team names.
 *
 * @param {Player[]} checkedInPlayers  — players with .role property
 * @param {number}   numTeams
 * @param {boolean}  useFunNames       — true = Spikers/Blockers, false = Team A/B
 * @returns {{ success: true,  teams: Team[] }
 *         | { success: false, issues: RoleIssue[] }}
 */
export function shuffleTeams(checkedInPlayers, numTeams, useFunNames = true) {
  // 1. Validate
  const { valid, issues } = validateShuffle(checkedInPlayers, numTeams)
  if (!valid) return { success: false, issues }

  // 2. Shuffle each role bucket
  const grouped = groupByRole(checkedInPlayers)
  const shuffledBuckets = {}
  for (const role of ROLE_ORDER) {
    shuffledBuckets[role] = fisherYates(grouped[role] ?? [])
  }

  // 3. Build empty teams
  const names = useFunNames ? getTeamNames(numTeams) : teamAlpha(numTeams)
  const teams = Array.from({ length: numTeams }, (_, i) => ({
    id:      i,
    name:    names[i],
    players: [],            // { ...player, assignedRole }
    color:   TEAM_PALETTE[i % TEAM_PALETTE.length],
  }))

  // 4. Distribute — for each role, cycle through teams N times (based on count)
  for (const role of ROLE_ORDER) {
    const countPerTeam = ROLE_COUNT_PER_TEAM[role]
    let playerIndex = 0

    for (let pass = 0; pass < countPerTeam; pass++) {
      for (let t = 0; t < numTeams; t++) {
        teams[t].players.push({
          ...shuffledBuckets[role][playerIndex],
          assignedRole: role,
        })
        playerIndex++
      }
    }
  }

  return { success: true, teams }
}

// ─── HELPERS ──────────────────────────────────────────────────────────────────
function teamAlpha(n) {
  return Array.from({ length: n }, (_, i) => `Team ${String.fromCharCode(65 + i)}`)
}

// Per-team accent colors for the results cards (cycles if > 4 teams)
export const TEAM_PALETTE = [
  { bg: '#EEF2FF', border: '#1A3FD8', text: '#1A3FD8' },  // blue
  { bg: '#FFF8E7', border: '#FFD000', text: '#B45309' },  // yellow
  { bg: '#F3EDFF', border: '#7C3AED', text: '#7C3AED' },  // purple
  { bg: '#ECFDF5', border: '#059669', text: '#059669' },  // green
]

// ─── QUICK ROSTER STATS ───────────────────────────────────────────────────────
/**
 * Given a checked-in player list and desired numTeams,
 * returns per-role availability for the UI readiness indicator.
 *
 * @returns {{ role, available, required, ok }[]}
 */
export function getRoleReadiness(checkedInPlayers, numTeams) {
  const grouped = groupByRole(checkedInPlayers)
  return ROLE_ORDER.map(role => {
    const required  = ROLE_COUNT_PER_TEAM[role] * numTeams
    const available = grouped[role]?.length ?? 0
    return { role, available, required, ok: available >= required }
  })
}
