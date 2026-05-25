import { useState } from "react";
import { useNavigate } from "react-router-dom";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import TournamentSetupModal from "../../components/TournamentSetupModal/TournamentSetupModal";
import { TOURNAMENT_PLAYERS_PER_TEAM } from "../../models/tournament";
import styles from "./TournamentPage.module.css";

export default function TournamentPage({ isDark, toggleTheme }) {
  const navigate = useNavigate();
  const [setupOpen, setSetupOpen] = useState(true);
  const [tournament, setTournament] = useState(null);

  const handleStartTournament = (nextTournament) => {
    setTournament(nextTournament);
    setSetupOpen(false);
    navigate("/court-order", {
      state: {
        teams: nextTournament.teams,
        numTeams: nextTournament.teams.length,
        tournament: nextTournament,
      },
    });
  };

  return (
    <div className="page-wrapper">
      <div className={styles.topBar}>
        <div>
          <p className={styles.kicker}>Match Builder</p>
          <h1 className={styles.title}>Tournament</h1>
        </div>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      <section className={styles.panel}>
        <div className={styles.statRow}>
          <div>
            <span className={styles.statValue}>
              {tournament?.teams.length ?? "-"}
            </span>
            <span className={styles.statLabel}>teams</span>
          </div>
          <div>
            <span className={styles.statValue}>
              {tournament
                ? tournament.teams.length * TOURNAMENT_PLAYERS_PER_TEAM
                : "-"}
            </span>
            <span className={styles.statLabel}>players</span>
          </div>
        </div>

        <button
          type="button"
          className={styles.setupBtn}
          onClick={() => setSetupOpen(true)}
        >
          {tournament ? "New Tournament" : "Create Tournament"}
        </button>
      </section>

      {tournament && (
        <div className={styles.teamList}>
          {tournament.teams.map((team, index) => (
            <div
              key={team.id}
              className={styles.teamCard}
              style={{
                "--team-color": team.color.border,
                animationDelay: `${index * 70}ms`,
              }}
            >
              <div>
                <h2 className={styles.teamName}>{team.name}</h2>
                <p className={styles.teamMeta}>
                  {team.players.length} players ready
                </p>
              </div>
              <button
                type="button"
                className={styles.orderBtn}
                onClick={() =>
                  navigate("/court-order", {
                    state: {
                      teams: tournament.teams,
                      numTeams: tournament.teams.length,
                      tournament,
                    },
                  })
                }
              >
                Order
              </button>
            </div>
          ))}
        </div>
      )}

      <TournamentSetupModal
        open={setupOpen}
        onClose={() => setSetupOpen(false)}
        onStart={handleStartTournament}
      />
    </div>
  );
}
