import { useState } from "react";
import { ROLE_META, ROLE_ORDER } from "../../constants";
import RoleBadge from "../RoleBadge/RoleBadge";
import styles from "./TeamCard.module.css";

export default function TeamCard({
  team,
  displayName,
  animationDelay = 0,
  selectedBenchPlayer = null,
  teamIndex,
  onSwap,
  isEditing = false,
  onEditStart,
  onEditSave,
  onEditCancel,
  isEditMode = false,
  selectedPlayer = null,
  onPlayerSelect = null,
  onPlayerDrop = null,
}) {
  const [editValue, setEditValue] = useState(displayName || team.name);

  const sorted = [...team.players].sort(
    (a, b) =>
      ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole),
  );

  const handlePlayerClick = (p) => {
    // Edit mode takes priority - when in edit mode, select player for swapping
    if (isEditMode && onPlayerSelect) {
      // Pass the raw player object; ShufflePage will wrap with the team id
      onPlayerSelect(p);
      return;
    }
    // Original swap mode - swap bench player with team player
    if (selectedBenchPlayer && onSwap) {
      // Find the player index in sorted array
      const playerIndex = sorted.findIndex((sp) => sp.id === p.id);
      onSwap(teamIndex, playerIndex);
    }
  };

  const handleSaveEdit = () => {
    onEditSave(editValue);
  };

  const handleCancelEdit = () => {
    setEditValue(displayName || team.name);
    onEditCancel();
  };

  const currentDisplayName = displayName || team.name;

  return (
    <div
      className={styles.card}
      style={{
        "--tc": team.color.border,
        animationDelay: `${animationDelay}ms`,
      }}
    >
      <div className={styles.stripe} />
      <div className={styles.content}>
        <div className={styles.header}>
          {isEditing ? (
            <div className={styles.editContainer}>
              <input
                type="text"
                className={styles.editInput}
                value={editValue}
                onChange={(e) => setEditValue(e.target.value)}
                autoFocus
                onKeyDown={(e) => {
                  if (e.key === "Enter") handleSaveEdit();
                  if (e.key === "Escape") handleCancelEdit();
                }}
              />
              <button
                className={styles.editBtn}
                onClick={handleSaveEdit}
                title="Save"
              >
                ✓
              </button>
              <button
                className={styles.editBtn}
                onClick={handleCancelEdit}
                title="Cancel"
              >
                ✕
              </button>
            </div>
          ) : (
            <>
              <h3
                className={styles.teamName}
                style={{ color: team.color.text }}
              >
                {currentDisplayName}
              </h3>
              <button
                className={styles.editIcon}
                onClick={onEditStart}
                title="Edit team name"
              >
                ✎
              </button>
              <span className={styles.playerCount}>{team.players.length}p</span>
            </>
          )}
        </div>
        <div className={styles.playerList}>
          {sorted.map((p) => {
            const isSelected =
              selectedPlayer?.player?.id === p.id &&
              selectedPlayer?.fromTeamId === team.id;
            const isSwapTarget =
              selectedPlayer &&
              selectedPlayer.player.role === p.role &&
              !isSelected;

            return (
              <div
                key={p.id}
                draggable={isEditMode}
                className={`${styles.playerRow} ${
                  isEditMode
                    ? isSelected
                      ? styles.selected
                      : isSwapTarget
                        ? styles.swapTarget
                        : ""
                    : selectedBenchPlayer && selectedBenchPlayer.role === p.role
                      ? styles.swappable
                      : ""
                }`}
                onClick={() => handlePlayerClick(p)}
                onDragStart={(e) => {
                  if (!isEditMode) return;
                  e.dataTransfer.setData(
                    "application/json",
                    JSON.stringify({ player: p, fromTeamId: team.id }),
                  );
                  e.dataTransfer.effectAllowed = "move";
                  e.currentTarget.classList.add(styles.dragging);
                }}
                onDragEnd={(e) => {
                  e.currentTarget.classList.remove(styles.dragging);
                }}
                onDragOver={(e) => {
                  if (!isEditMode) return;
                  e.preventDefault();
                  const raw = e.dataTransfer.getData("application/json");
                  try {
                    const drag = raw ? JSON.parse(raw) : null;
                    if (drag && drag.player && drag.player.role === p.role) {
                      e.dataTransfer.dropEffect = "move";
                      e.currentTarget.classList.add(styles.dragOver);
                    } else {
                      e.dataTransfer.dropEffect = "none";
                      e.currentTarget.classList.remove(styles.dragOver);
                    }
                  } catch {
                    e.currentTarget.classList.remove(styles.dragOver);
                  }
                }}
                onDragLeave={(e) =>
                  e.currentTarget.classList.remove(styles.dragOver)
                }
                onDrop={(e) => {
                  if (!isEditMode) return;
                  e.preventDefault();
                  e.currentTarget.classList.remove(styles.dragOver);
                  const raw = e.dataTransfer.getData("application/json");
                  if (!raw) return;
                  try {
                    const drag = JSON.parse(raw);
                    if (drag.player.role !== p.role) return;
                    if (onPlayerDrop) {
                      onPlayerDrop(drag, { player: p, fromTeamId: team.id });
                    }
                  } catch (err) {
                    console.error("drop parse error", err);
                  }
                }}
                style={{
                  cursor:
                    isEditMode ||
                    (selectedBenchPlayer && selectedBenchPlayer.role === p.role)
                      ? "pointer"
                      : "default",
                }}
                title={
                  isEditMode
                    ? "Drag to swap with another same-role player"
                    : selectedBenchPlayer && selectedBenchPlayer.role === p.role
                      ? `Click to swap ${selectedBenchPlayer.name} with ${p.name}`
                      : ""
                }
              >
                <RoleBadge role={p.assignedRole} short />
                <span className={styles.playerName}>{p.name}</span>
              </div>
            );
          })}
        </div>
      </div>
    </div>
  );
}
