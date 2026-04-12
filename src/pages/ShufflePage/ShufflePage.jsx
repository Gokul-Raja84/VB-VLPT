import { useState, useRef, useEffect, useCallback } from "react";
import { useNavigate } from "react-router-dom";
import { shuffleTeams, validateShuffle } from "../../utils/shuffle";
import ShuffleButton from "../../components/ShuffleButton/ShuffleButton";
import TeamCard from "../../components/TeamCard/TeamCard";
import BenchCard from "../../components/BenchCard/BenchCard";
import ReadinessBar from "../../components/ReadinessBar/ReadinessBar";
import ThemeToggle from "../../components/ThemeToggle/ThemeToggle";
import html2canvas from "html2canvas-pro";
import styles from "./ShufflePage.module.css";

export default function ShufflePage({
  checkedInPlayers,
  numTeams,
  setNumTeams,
  isDark,
  toggleTheme,
}) {
  const navigate = useNavigate();
  const [teams, setTeams] = useState(null);
  const [bench, setBench] = useState([]);
  const [useFunNames, setUseFunNames] = useState(true);
  const [shuffleKey, setShuffleKey] = useState(0);
  const teamsRef = useRef(null);

  // Redirect if no players
  useEffect(() => {
    if (checkedInPlayers.length === 0) navigate("/", { replace: true });
  }, [checkedInPlayers.length, navigate]);

  const validation = validateShuffle(checkedInPlayers, numTeams);
  const canShuffle = validation.valid;
  const disabledReason = !canShuffle
    ? `Need: ${validation.issues.map((i) => `${i.required - i.available} more ${i.role}`).join(", ")}`
    : "";

  const handleShuffle = useCallback(() => {
    const result = shuffleTeams(checkedInPlayers, numTeams, useFunNames);
    if (result.success) {
      // Compute bench: players not in any team
      const assignedIds = new Set(
        result.teams.flatMap((t) => t.players.map((p) => p.id)),
      );
      const benchPlayers = checkedInPlayers.filter(
        (p) => !assignedIds.has(p.id),
      );
      setTeams(result.teams);
      setBench(benchPlayers);
      setShuffleKey((k) => k + 1);
    }
  }, [checkedInPlayers, numTeams, useFunNames]);

  const [isGenerating, setIsGenerating] = useState(false);
  const [selectedBenchPlayer, setSelectedBenchPlayer] = useState(null);

  const handleSwapWithTeam = (teamIndex, playerIndex) => {
    if (!selectedBenchPlayer || !teams) return;

    // Only allow swaps between same role
    if (
      selectedBenchPlayer.role !== teams[teamIndex].players[playerIndex].role
    ) {
      alert(
        `Can only swap ${selectedBenchPlayer.role}s with ${selectedBenchPlayer.role}s`,
      );
      return;
    }

    // Create new teams with the swap
    const newTeams = teams.map((team, ti) => {
      if (ti !== teamIndex) return team;
      return {
        ...team,
        players: team.players.map((p, pi) =>
          pi === playerIndex ? selectedBenchPlayer : p,
        ),
      };
    });

    // Create new bench
    const newBench = bench
      .filter((p) => p.id !== selectedBenchPlayer.id)
      .concat(teams[teamIndex].players[playerIndex]);

    setTeams(newTeams);
    setBench(newBench);
    setSelectedBenchPlayer(null);
  };

  const handleDownload = async () => {
    if (!teamsRef.current || isGenerating) return;
    setIsGenerating(true);
    try {
      await new Promise((r) => setTimeout(r, 200)); // Wait for UI rendering

      const canvas = await html2canvas(teamsRef.current, {
        backgroundColor: isDark ? "#0D1117" : "#FFFFFF",
        scale: 2,
        useCORS: true,
        allowTaint: false,
        logging: false,
        imageTimeout: 10000,
        windowWidth: teamsRef.current.scrollWidth,
        windowHeight: teamsRef.current.scrollHeight,
      });

      canvas.toBlob((blob) => {
        if (blob) {
          const url = URL.createObjectURL(blob);
          const link = document.createElement("a");
          link.href = url;
          link.download = "vb-vlpt-teams.png";
          document.body.appendChild(link);
          link.click();
          document.body.removeChild(link);
          URL.revokeObjectURL(url);
        } else {
          alert("Generation failed. Try once more.");
        }
        setIsGenerating(false);
      }, "image/png");
    } catch (err) {
      console.error("Download error:", err);
      alert(`Generation failed: ${err.message}`);
      setIsGenerating(false);
    }
  };

  if (checkedInPlayers.length === 0) return null;

  return (
    <div className="page-wrapper">
      {/* Header */}
      <div className={styles.topBar}>
        <h1 className={styles.title}>Shuffle</h1>
        <ThemeToggle isDark={isDark} onToggle={toggleTheme} />
      </div>

      {/* Readiness + stepper */}
      <ReadinessBar
        checkedInPlayers={checkedInPlayers}
        numTeams={numTeams}
        onNumTeamsChange={setNumTeams}
      />

      {/* Name mode toggle */}
      <div className={styles.nameToggle}>
        <button
          className={`${styles.togglePill} ${!useFunNames ? styles.toggleOn : ""}`}
          onClick={() => setUseFunNames(false)}
        >
          A / B
        </button>
        <button
          className={`${styles.togglePill} ${useFunNames ? styles.toggleOn : ""}`}
          onClick={() => setUseFunNames(true)}
        >
          Fun Names
        </button>
      </div>

      {/* Shuffle button */}
      <ShuffleButton
        onClick={handleShuffle}
        disabled={!canShuffle}
        disabledReason={disabledReason}
        isDark={isDark}
      />

      {/* Results */}
      {teams && (
        <>
          {/* Hidden container for download - teams side by side, no bench */}
          <div
            ref={teamsRef}
            className={styles.downloadResults}
            key={shuffleKey}
            style={{
              position: "absolute",
              left: "-9999px",
              top: "-9999px",
              width: "auto",
            }}
          >
            {teams.map((team) => (
              <TeamCard
                key={`${shuffleKey}-${team.id}`}
                team={team}
                animationDelay={0}
              />
            ))}
          </div>

          {/* Visible results - teams vertical, with bench */}
          <div className={styles.results} key={shuffleKey}>
            {teams.map((team, i) => (
              <TeamCard
                key={`${shuffleKey}-${team.id}`}
                team={team}
                animationDelay={i * 80}
                selectedBenchPlayer={selectedBenchPlayer}
                teamIndex={i}
                onSwap={handleSwapWithTeam}
              />
            ))}
            <BenchCard
              bench={bench}
              selectedPlayerId={selectedBenchPlayer?.id}
              onSelectPlayer={setSelectedBenchPlayer}
            />
          </div>

          <div className={styles.actionBar}>
            <button className={styles.reshuffleBtn} onClick={handleShuffle}>
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <polyline points="1 4 1 10 7 10" />
                <polyline points="23 20 23 14 17 14" />
                <path d="M20.49 9A9 9 0 0 0 5.64 5.64L1 10m22 4l-4.64 4.36A9 9 0 0 1 3.51 15" />
              </svg>
              Reshuffle
            </button>
            <button
              className={styles.shareBtn}
              onClick={handleDownload}
              disabled={isGenerating}
            >
              <svg
                width="16"
                height="16"
                viewBox="0 0 24 24"
                fill="none"
                stroke="currentColor"
                strokeWidth="2.2"
                strokeLinecap="round"
                strokeLinejoin="round"
              >
                <path d="M21 15v4a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2v-4" />
                <polyline points="7 10 12 15 17 10" />
                <line x1="12" y1="15" x2="12" y2="3" />
              </svg>
              {isGenerating ? "Generating..." : "Download"}
            </button>
            <button
              className={styles.courtBtn}
              onClick={() =>
                navigate("/court-order", { state: { teams, numTeams } })
              }
            >
              🏐 Court Order →
            </button>
          </div>
        </>
      )}
    </div>
  );
}
