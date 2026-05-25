import styles from "./BenchCard.module.css";
import RoleBadge from "../RoleBadge/RoleBadge";

export default function BenchCard({
  bench,
  selectedPlayerId,
  onSelectPlayer,
  isEditMode = false,
  onPlayerDrop = null,
}) {
  if (!bench || bench.length === 0) return null;

  return (
    <div className={styles.card}>
      <div className={styles.header}>
        <span className={styles.title}>BENCH</span>
        <span className={styles.count}>
          {bench.length} player{bench.length !== 1 ? "s" : ""}
        </span>
        n
      </div>
      <div className={styles.list}>
        {bench.map((p) => (
          <div
            key={p.id}
            draggable={isEditMode}
            className={`${styles.row} ${selectedPlayerId === p.id ? styles.selected : ""}`}
            onClick={() => onSelectPlayer(selectedPlayerId === p.id ? null : p)}
            onDragStart={(e) => {
              if (!isEditMode) return;
              e.dataTransfer.setData(
                "application/json",
                JSON.stringify({ player: p, fromTeamId: "bench" }),
              );
              e.dataTransfer.effectAllowed = "move";
              e.currentTarget.classList.add(styles.dragging);
            }}
            onDragEnd={(e) => e.currentTarget.classList.remove(styles.dragging)}
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
                  onPlayerDrop(drag, { player: p, fromTeamId: "bench" });
                }
              } catch (err) {
                console.error("bench drop parse", err);
              }
            }}
            style={{ cursor: "pointer" }}
            title={
              selectedPlayerId === p.id
                ? "Click to deselect"
                : "Click to select for swap"
            }
          >
            <RoleBadge role={p.role} short />
            <span className={styles.name}>{p.name}</span>
          </div>
        ))}
      </div>
    </div>
  );
}
