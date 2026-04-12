import { ROLE_META, ROLE_ORDER } from "../../constants";
import RoleBadge from "../RoleBadge/RoleBadge";
import styles from "./TeamCard.module.css";

export default function TeamCard({
  team,
  animationDelay = 0,
  selectedBenchPlayer = null,
  teamIndex,
  onSwap,
}) {
  const sorted = [...team.players].sort(
    (a, b) =>
      ROLE_ORDER.indexOf(a.assignedRole) - ROLE_ORDER.indexOf(b.assignedRole),
  );

  const handlePlayerClick = (playerIndex) => {
    if (selectedBenchPlayer && onSwap) {
      onSwap(teamIndex, playerIndex);
    }
  };

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
          <h3 className={styles.teamName} style={{ color: team.color.text }}>
            {team.name}
          </h3>
          <span className={styles.playerCount}>{team.players.length}p</span>
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
