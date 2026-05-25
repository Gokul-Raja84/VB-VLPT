import { useMemo, useState } from "react";
import {
  DEFAULT_TOURNAMENT_TEAM_COUNT,
  MAX_TOURNAMENT_TEAM_COUNT,
  MIN_TOURNAMENT_TEAM_COUNT,
  TOURNAMENT_PLAYER_SLOT_LABELS,
  TOURNAMENT_PLAYERS_PER_TEAM,
  buildTournament,
  clampTournamentTeamCount,
  createDraftTeams,
  validateTournamentDraft,
} from "../../models/tournament";
import styles from "./TournamentSetupModal.module.css";

export default function TournamentSetupModal({ open, onClose, onStart }) {
  if (!open) return null;

  return <TournamentSetupForm onClose={onClose} onStart={onStart} />;
}

function TournamentSetupForm({ onClose, onStart }) {
  const [step, setStep] = useState("count");
  const [teamCountInput, setTeamCountInput] = useState(
    String(DEFAULT_TOURNAMENT_TEAM_COUNT),
  );
  const [draftTeams, setDraftTeams] = useState(() =>
    createDraftTeams(DEFAULT_TOURNAMENT_TEAM_COUNT),
  );
  const [activeTeamIndex, setActiveTeamIndex] = useState(0);
  const [error, setError] = useState("");

  const activeTeam = draftTeams[activeTeamIndex];
  const progressText = useMemo(
    () => `${activeTeamIndex + 1} / ${draftTeams.length}`,
    [activeTeamIndex, draftTeams.length],
  );

  const handleContinue = () => {
    const teamCount = clampTournamentTeamCount(teamCountInput);
    setTeamCountInput(String(teamCount));
    setDraftTeams(createDraftTeams(teamCount));
    setActiveTeamIndex(0);
    setError("");
    setStep("teams");
  };

  const updateTeamName = (value) => {
    setError("");
    setDraftTeams((teams) =>
      teams.map((team, index) =>
        index === activeTeamIndex ? { ...team, name: value } : team,
      ),
    );
  };

  const updatePlayerName = (playerIndex, value) => {
    setError("");
    setDraftTeams((teams) =>
      teams.map((team, teamIndex) =>
        teamIndex === activeTeamIndex
          ? {
              ...team,
              players: team.players.map((playerName, index) =>
                index === playerIndex ? value : playerName,
              ),
            }
          : team,
      ),
    );
  };

  const handleStart = () => {
    const validationError = validateTournamentDraft(draftTeams);
    if (validationError) {
      setError(validationError);
      return;
    }

    onStart(buildTournament(draftTeams));
  };

  return (
    <div className={styles.overlay} role="presentation">
      <div className={styles.modal} role="dialog" aria-modal="true">
        <div className={styles.handle} />
        <button
          type="button"
          className={styles.closeBtn}
          onClick={onClose}
          aria-label="Close tournament setup"
        >
          x
        </button>

        {step === "count" ? (
          <>
            <p className={styles.kicker}>Tournament Setup</p>
            <h1 className={styles.title}>How many teams?</h1>
            <div className={styles.countField}>
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() =>
                  setTeamCountInput((value) =>
                    String(
                      Math.max(
                        MIN_TOURNAMENT_TEAM_COUNT,
                        clampTournamentTeamCount(value) - 1,
                      ),
                    ),
                  )
                }
                aria-label="Decrease team count"
              >
                -
              </button>
              <input
                className={styles.countInput}
                type="number"
                inputMode="numeric"
                min={MIN_TOURNAMENT_TEAM_COUNT}
                max={MAX_TOURNAMENT_TEAM_COUNT}
                value={teamCountInput}
                onChange={(event) => setTeamCountInput(event.target.value)}
                aria-label="Number of teams"
              />
              <button
                type="button"
                className={styles.stepperBtn}
                onClick={() =>
                  setTeamCountInput((value) =>
                    String(
                      Math.min(
                        MAX_TOURNAMENT_TEAM_COUNT,
                        clampTournamentTeamCount(value) + 1,
                      ),
                    ),
                  )
                }
                aria-label="Increase team count"
              >
                +
              </button>
            </div>
            <p className={styles.helper}>
              Each team gets {TOURNAMENT_PLAYERS_PER_TEAM} player slots.
            </p>
            <button
              type="button"
              className={styles.primaryBtn}
              onClick={handleContinue}
            >
              Continue
            </button>
          </>
        ) : (
          <>
            <div className={styles.formHeader}>
              <div>
                <p className={styles.kicker}>Team Details</p>
                <h1 className={styles.title}>Team {activeTeamIndex + 1}</h1>
              </div>
              <span className={styles.progress}>{progressText}</span>
            </div>

            <div className={styles.teamTabs}>
              {draftTeams.map((team, index) => (
                <button
                  key={index}
                  type="button"
                  className={`${styles.teamTab} ${
                    index === activeTeamIndex ? styles.teamTabActive : ""
                  }`}
                  onClick={() => {
                    setActiveTeamIndex(index);
                    setError("");
                  }}
                >
                  {index + 1}
                </button>
              ))}
            </div>

            <label className={styles.label} htmlFor="tournament-team-name">
              Team Name
            </label>
            <input
              id="tournament-team-name"
              className={styles.input}
              type="text"
              value={activeTeam.name}
              onChange={(event) => updateTeamName(event.target.value)}
              placeholder={`Team ${activeTeamIndex + 1}`}
            />

            <div className={styles.playersHeader}>
              <span className={styles.label}>Players</span>
              <span className={styles.slotCount}>
                {TOURNAMENT_PLAYERS_PER_TEAM} slots
              </span>
            </div>

            <div className={styles.playerGrid}>
              {activeTeam.players.map((playerName, playerIndex) => (
                <input
                  key={playerIndex}
                  className={styles.playerInput}
                  type="text"
                  value={playerName}
                  onChange={(event) =>
                    updatePlayerName(playerIndex, event.target.value)
                  }
                  placeholder={TOURNAMENT_PLAYER_SLOT_LABELS[playerIndex]}
                />
              ))}
            </div>

            {error && <p className={styles.error}>{error}</p>}

            <div className={styles.actions}>
              <button
                type="button"
                className={styles.secondaryBtn}
                onClick={() =>
                  activeTeamIndex === 0
                    ? setStep("count")
                    : setActiveTeamIndex((index) => index - 1)
                }
              >
                {activeTeamIndex === 0 ? "Teams" : "Previous"}
              </button>
              {activeTeamIndex < draftTeams.length - 1 ? (
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={() => setActiveTeamIndex((index) => index + 1)}
                >
                  Next Team
                </button>
              ) : (
                <button
                  type="button"
                  className={styles.primaryBtn}
                  onClick={handleStart}
                >
                  Start Tournament
                </button>
              )}
            </div>
          </>
        )}
      </div>
    </div>
  );
}
