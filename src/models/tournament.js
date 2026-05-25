import { TEAM_PALETTE } from "../utils/shuffle";

export const TOURNAMENT_PLAYERS_PER_TEAM = 6;
export const DEFAULT_TOURNAMENT_TEAM_COUNT = 2;
export const MIN_TOURNAMENT_TEAM_COUNT = 2;
export const MAX_TOURNAMENT_TEAM_COUNT = 12;
export const TOURNAMENT_PLAYER_SLOT_LABELS = [
  "Setter",
  "+ Attacker",
  "- Attacker",
  "Middle Attacker/Blocker",
  "Libero",
  "Libero",
];

/**
 * @typedef {object} TournamentPlayer
 * @property {string} id
 * @property {string} name
 * @property {number} slot
 */

/**
 * @typedef {object} TournamentTeam
 * @property {number} id
 * @property {string} name
 * @property {TournamentPlayer[]} players
 * @property {{ bg: string, border: string, text: string }} color
 */

/**
 * @typedef {object} Tournament
 * @property {string} id
 * @property {string} name
 * @property {number} createdAt
 * @property {TournamentTeam[]} teams
 */

export function clampTournamentTeamCount(value) {
  const parsed = Number.parseInt(value, 10);
  if (Number.isNaN(parsed)) return DEFAULT_TOURNAMENT_TEAM_COUNT;
  return Math.min(
    MAX_TOURNAMENT_TEAM_COUNT,
    Math.max(MIN_TOURNAMENT_TEAM_COUNT, parsed),
  );
}

export function createDraftTeams(teamCount) {
  return Array.from({ length: teamCount }, (_, teamIndex) => ({
    id: teamIndex,
    name: `Team ${teamIndex + 1}`,
    players: Array.from({ length: TOURNAMENT_PLAYERS_PER_TEAM }, () => ""),
  }));
}

export function buildTournament(draftTeams) {
  const teams = draftTeams.map((team, teamIndex) => ({
    id: teamIndex,
    name: team.name.trim(),
    color: TEAM_PALETTE[teamIndex % TEAM_PALETTE.length],
    players: team.players.map((playerName, playerIndex) => ({
      id: `t${teamIndex}-p${playerIndex}`,
      name: playerName.trim(),
      slot: playerIndex + 1,
    })),
  }));

  return {
    id: crypto.randomUUID(),
    name: "Tournament",
    createdAt: Date.now(),
    teams,
  };
}

export function validateTournamentDraft(draftTeams) {
  for (let teamIndex = 0; teamIndex < draftTeams.length; teamIndex += 1) {
    const team = draftTeams[teamIndex];
    if (!team.name.trim()) {
      return `Team ${teamIndex + 1} needs a name`;
    }

    const emptyPlayerIndex = team.players.findIndex(
      (playerName) => !playerName.trim(),
    );
    if (emptyPlayerIndex !== -1) {
      return `${team.name.trim() || `Team ${teamIndex + 1}`} needs player ${emptyPlayerIndex + 1}`;
    }
  }

  return "";
}
