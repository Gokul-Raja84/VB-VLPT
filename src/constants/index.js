// ─── ROLES ────────────────────────────────────────────────────────────────────
export const ROLES = {
  SETTER:         'setter',
  LEFT_ATTACKER:  'leftAttacker',
  RIGHT_ATTACKER: 'rightAttacker',
  MIDDLE:         'middle',
  LIBERO:         'libero',
}

// How many of each role is needed PER TEAM
export const ROLE_COUNT_PER_TEAM = {
  [ROLES.SETTER]:         1,
  [ROLES.LEFT_ATTACKER]:  1,
  [ROLES.RIGHT_ATTACKER]: 1,
  [ROLES.MIDDLE]:         1,
  [ROLES.LIBERO]:         2,
}

// Total players per team
export const PLAYERS_PER_TEAM = Object.values(ROLE_COUNT_PER_TEAM).reduce((a, b) => a + b, 0) // 6

export const ROLE_META = {
  [ROLES.SETTER]: {
    label:       'Setter',
    shortLabel:  'S',
    color:       '#1A3FD8',
    bgColor:     '#EEF2FF',
    description: 'Orchestrates the offense',
    position:    'front',
  },
  [ROLES.LEFT_ATTACKER]: {
    label:       'Left Attacker',
    shortLabel:  'LA',
    color:       '#FF5722',
    bgColor:     '#FFF3F0',
    description: 'Outside hitter, left side',
    position:    'front',
  },
  [ROLES.RIGHT_ATTACKER]: {
    label:       'Right Attacker',
    shortLabel:  'RA',
    color:       '#D81B8C',
    bgColor:     '#FDE8F5',
    description: 'Opposite hitter, right side',
    position:    'front',
  },
  [ROLES.MIDDLE]: {
    label:       'Middle',
    shortLabel:  'MB',
    color:       '#7C3AED',
    bgColor:     '#F3EDFF',
    description: 'Middle blocker / All-rounder',
    position:    'front',
  },
  [ROLES.LIBERO]: {
    label:       'Libero',
    shortLabel:  'L',
    color:       '#059669',
    bgColor:     '#ECFDF5',
    description: 'Defensive specialist',
    position:    'back',
  },
}

export const ROLE_ORDER = [
  ROLES.SETTER,
  ROLES.LEFT_ATTACKER,
  ROLES.RIGHT_ATTACKER,
  ROLES.MIDDLE,
  ROLES.LIBERO,
]

// ─── TEAM NAMES ───────────────────────────────────────────────────────────────
// Used when fun-name mode is on. Picked in pairs (or triples for 3 teams), never repeated.
export const TEAM_NAME_POOLS = [
  // IPL style - franchise vibes
  ['Super Kings', 'Titans'],
  ['Knight Riders', 'Royals'],
  ['Capitals', 'Sunrisers'],
  ['Warriors', 'Giants'],
  ['Blazers', 'Chargers'],

  // Football / club vibes - the classics
  ['United', 'City'],
  ['Rovers', 'Athletic'],
  ['Strikers FC', 'Dynamos'],
  ['Red Devils', 'Blue Lions'],
  ['Galacticos', 'Invincibles'],

  // Volleyball aggressive vibes
  ['Sky Smash', 'Net Ninjas'],
  ['Block Party', 'Spike Syndicate'],
  ['Airborne', 'Power Serve'],
  ['Killshot', 'Quickset'],
  ['Roofers', 'Jump Force'],

  // Gen Z / internet culture vibes
  ['No Cap', 'Lowkey'],
  ['Main Character', 'NPC'],
  ['Aura', 'Rizzlers'],
  ['W Squad', 'Delulu'],
  ['Sigma', 'Goated'],

  // Gaming / anime / cool tech vibes
  ['Phantom', 'Vortex'],
  ['Shadow Ops', 'Cybercore'],
  ['Neon Pulse', 'Void'],
  ['Zenith', 'Hypernova'],
  ['Drip Squad', 'Pixel Storm'],

  // Fusion - sports + meme (chef's kiss 🔥)
  ['Knight Riders', 'Sigma'],
  ['Super Kings', 'No Cap'],
  ['United', 'Aura'],
  ['Goated', 'Titans'],
  ['Sky Smash', 'Rizzlers'],
  ['Royals', 'Main Character'],
  ['Strikers FC', 'Neon Pulse'],
  ['Red Devils', 'Phantom'],
]

// For 3+ teams, fallback to Team A / B / C / D
export const ALPHA_NAMES = ['Alpha', 'Beta', 'Gamma', 'Delta', 'Epsilon', 'Zeta']

/**
 * Get team names for N teams.
 * If N === 2, pick a random pair from pool.
 * If N > 2, use ALPHA_NAMES.
 */
export function getTeamNames(numTeams) {
  if (numTeams === 2) {
    const pool = TEAM_NAME_POOLS[Math.floor(Math.random() * TEAM_NAME_POOLS.length)]
    // 50/50 swap so same names don't always go to Team 1
    return Math.random() < 0.5 ? pool : [pool[1], pool[0]]
  }
  return ALPHA_NAMES.slice(0, numTeams)
}

// ─── DESIGN TOKENS (JS mirror of CSS vars — useful for canvas/share card) ─────
export const COLORS = {
  bg:           '#F0F4FF',
  surface:      '#FFFFFF',
  primary:      '#1A3FD8',
  accent:       '#FFD000',
  accentOrange: '#FF5722',
  text:         '#0D1117',
  textMuted:    '#6B7280',
  border:       '#E2E8F0',
  success:      '#22C55E',
  danger:       '#EF4444',
}
