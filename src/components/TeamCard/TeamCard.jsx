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
}) {
  const [editValue, setEditValue] = useState(displayName || team.name);

  const sorted = [...team.players].sort(
    (a, b) =>
      ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole),
  );

  const handlePlayerClick = (playerIndex) => {
    if (selectedBenchPlayer && onSwap) {
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
          {sorted.map((p, idx) => (
            <div
              key={p.id}
              className={`${styles.playerRow} ${
                selectedBenchPlayer && selectedBenchPlayer.role === p.role
                  ? styles.swappable
                  : ""
              }`}
              onClick={() => handlePlayerClick(idx)}
              style={{
                cursor:
                  selectedBenchPlayer && selectedBenchPlayer.role === p.role
                    ? "pointer"
                    : "default",
              }}
              title={
                selectedBenchPlayer && selectedBenchPlayer.role === p.role
                  ? `Click to swap ${selectedBenchPlayer.name} with ${p.name}`
                  : ""
              }
            >
              <RoleBadge role={p.assignedRole} short />
              <span className={styles.playerName}>{p.name}</span>
            </div>
          ))}
        </div>
      </div>
    </div>
  );
}
