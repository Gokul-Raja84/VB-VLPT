import { useState } from "react";
import RoleBadge from "../RoleBadge/RoleBadge";
import styles from "./SwapModal.module.css";

export default function SwapModal({
  selectedPlayer,
  allTeams,
  bench,
  onSwap,
  onClose,
}) {
  if (!selectedPlayer) return null;

  const { player: selectedPlayerData, fromTeamId: selectedTeamId } =
    selectedPlayer;
  const selectedRole = selectedPlayerData.role;

  // Find all swap targets (same role, excluding the selected player)
  const teamTargets = {};
  allTeams.forEach((team) => {
    const targets = team.players.filter(
      (p) =>
        p.role === selectedRole &&
        !(p.id === selectedPlayerData.id && team.id === selectedTeamId),
    );
    if (targets.length > 0) {
      teamTargets[team.id] = {
        teamName: team.name,
        players: targets,
      };
    }
  });

  // Bench targets
  const benchTargets = bench.filter((p) => p.role === selectedRole);

  const hasTargets =
    Object.keys(teamTargets).length > 0 || benchTargets.length > 0;

  const handleSwap = (targetPlayerData, fromTeamId) => {
    const normalizedFromTeamId =
      fromTeamId === "bench" ? "bench" : parseInt(fromTeamId, 10);
    onSwap({
      player: targetPlayerData,
      fromTeamId: normalizedFromTeamId,
    });
  };

  return (
    <>
      {/* Backdrop */}
      <div className={styles.backdrop} onClick={onClose} />

      {/* Modal */}
      <div className={styles.modal}>
        {/* Header */}
        <div className={styles.header}>
          <div className={styles.headerContent}>
            <span className={styles.title}>SWAP WITH</span>
            <div className={styles.selectedPlayer}>
              <RoleBadge role={selectedRole} short />
              <span className={styles.selectedName}>
                {selectedPlayerData.name}
              </span>
            </div>
          </div>
          <button
            className={styles.closeBtn}
            onClick={onClose}
            aria-label="Close"
          >
            ✕
          </button>
        </div>

        {/* Drag handle */}
        <div className={styles.dragHandle} />

        {/* Content */}
        <div className={styles.content}>
          {!hasTargets ? (
            <div className={styles.emptyState}>
              <p>No other {selectedRole}s to swap with</p>
            </div>
          ) : (
            <>
              {/* Team sections */}
              {Object.entries(teamTargets).map(
                ([teamId, { teamName, players }]) => (
                  <div key={teamId} className={styles.section}>
                    <div className={styles.sectionHeader}>{teamName}</div>
                    <div className={styles.playerList}>
                      {players.map((p) => (
                        <button
                          key={p.id}
                          className={styles.swapTarget}
                          onClick={() => handleSwap(p, teamId)}
                        >
                          <div className={styles.swapTargetLeft}>
                            <RoleBadge role={p.role} short />
                            <span className={styles.swapTargetName}>
                              {p.name}
                            </span>
                          </div>
                          <span className={styles.swapIndicator}>⟷ SWAP</span>
                        </button>
                      ))}
                    </div>
                  </div>
                ),
              )}

              {/* Bench section */}
              {benchTargets.length > 0 && (
                <div className={styles.section}>
                  <div className={styles.sectionHeader}>BENCH</div>
                  <div className={styles.playerList}>
                    {benchTargets.map((p) => (
                      <button
                        key={p.id}
                        className={styles.swapTarget}
                        onClick={() => handleSwap(p, "bench")}
                      >
                        <div className={styles.swapTargetLeft}>
                          <RoleBadge role={p.role} short />
                          <span className={styles.swapTargetName}>
                            {p.name}
                          </span>
                        </div>
                        <span className={styles.swapIndicator}>⟷ SWAP</span>
                      </button>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </div>
    </>
  );
}
