/**
 * Swap two players between teams (or team ↔ bench).
 * Only works if both players have the same role.
 * Preserves assignedRole throughout the swap.
 *
 * @param {object} playerA  - { player, fromTeamId } (the selected player)
 * @param {object} playerB  - { player, fromTeamId } (the swap target; 'bench' if from bench)
 * @param {Team[]} currentTeams  - array of teams with players
 * @param {Player[]} currentBench - array of bench players
 * @returns {{ teams: Team[], bench: Player[] }}
 */
export function executeSwap(playerA, playerB, currentTeams, currentBench) {
  // Validate roles match
  if (playerA.player.role !== playerB.player.role) {
    throw new Error("Cannot swap players of different roles");
  }

  // Deep clone to avoid mutation
  const teams = currentTeams.map((t) => ({
    ...t,
    players: t.players.map((p) => ({ ...p })),
  }));
  const bench = currentBench.map((p) => ({ ...p }));

  // Determine if either player is from bench
  const isAFromBench = playerA.fromTeamId === "bench";
  const isBFromBench = playerB.fromTeamId === "bench";

  if (isAFromBench || isBFromBench) {
    // Team ↔ Bench swap
    const teamPlayer = isAFromBench ? playerB : playerA;
    const benchPlayer = isAFromBench ? playerA : playerB;

    const team = teams.find((t) => t.id === teamPlayer.fromTeamId);
    if (!team) throw new Error("Team not found");

    const pIdx = team.players.findIndex((p) => p.id === teamPlayer.player.id);
    const bIdx = bench.findIndex((p) => p.id === benchPlayer.player.id);

    if (pIdx === -1 || bIdx === -1)
      throw new Error("Player not found in team or bench");

    // Preserve the team player's assigned role
    const teamPlayerAssignedRole = team.players[pIdx].assignedRole;

    // Swap
    const tmp = { ...team.players[pIdx] };
    team.players[pIdx] = {
      ...bench[bIdx],
      assignedRole: teamPlayerAssignedRole,
    };
    bench[bIdx] = { ...tmp };
  } else {
    // Team ↔ Team swap
    const teamA = teams.find((t) => t.id === playerA.fromTeamId);
    const teamB = teams.find((t) => t.id === playerB.fromTeamId);

    if (!teamA || !teamB) throw new Error("One or both teams not found");

    const pAIdx = teamA.players.findIndex((p) => p.id === playerA.player.id);
    const pBIdx = teamB.players.findIndex((p) => p.id === playerB.player.id);

    if (pAIdx === -1 || pBIdx === -1)
      throw new Error("One or both players not found in teams");

    // Preserve assigned roles
    const roleA = teamA.players[pAIdx].assignedRole;
    const roleB = teamB.players[pBIdx].assignedRole;

    // Swap
    const tmp = { ...teamA.players[pAIdx] };
    teamA.players[pAIdx] = {
      ...teamB.players[pBIdx],
      assignedRole: roleA,
    };
    teamB.players[pBIdx] = { ...tmp, assignedRole: roleB };
  }

  return { teams, bench };
}
