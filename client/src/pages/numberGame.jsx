import { Link } from "react-router-dom";
import React from "react";
import Rung from "./rung";
import { nanoid } from "nanoid";
import Confetti from "react-confetti";
import LeaderBoardModal from "./leaderBoardModal";
export default function NumberGame() {
  const [rungs, setRungs] = React.useState(() => generateNewRungs());
  const [randomNumber, setRandomNumber] = React.useState(
    () => Math.floor(Math.random() * 1000) + 1,
  );
  const [gameWon, setGameWon] = React.useState(false);
  const [gameLost, setGameLost] = React.useState(false);
  const [score, setScore] = React.useState(0);
  const [startTime, setStartTime] = React.useState(null);
  const [timer, setTimer] = React.useState(0);
  const [skipCount, setSkipCount] = React.useState(0);
  const [gameStarted, setGameStarted] = React.useState(false); // Track if game has started
  const [showModal, setShowModal] = React.useState(false);
  const [gameEndStats, setGameEndStats] = React.useState(null);

  const saveScoreToLeaderboard = async (playerName) => {
    try {
      const response = await fetch("http://localhost:8000/api/scores", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          playerName: playerName,
          rungsFilled: gameEndStats.rungsFilled,
          timeInSeconds: gameEndStats.timeInSeconds,
          skips: gameEndStats.skips,
          score: gameEndStats.score,
        }),
      });

      if (response.ok) {
        console.log("Score saved successfully!");
        return true;
      } else {
        const error = await response.json();
        console.error("Failed to save:", error);
        return false;
      }
    } catch (error) {
      console.error("Error saving score:", error);
      return false;
    }
  };

  // Timer effect - only runs when game has started
  React.useEffect(() => {
    if (gameStarted && startTime && !gameWon && !gameLost) {
      const interval = setInterval(() => {
        setTimer(Math.floor((Date.now() - startTime) / 1000));
      }, 1000);
      return () => clearInterval(interval);
    }
  }, [gameStarted, startTime, gameWon, gameLost]);

  // Update score in real-time whenever rungs, timer, or skips change
  React.useEffect(() => {
    if (!gameWon && !gameLost) {
      const currentRungsFilled = rungs.filter((r) => r.isFilled).length;
      const currentScore = calculateScore(currentRungsFilled, timer, skipCount);
      setScore(currentScore);
    }
  }, [rungs, timer, skipCount, gameWon, gameLost]);

  // Auto-scroll to game message when game ends
  // Auto-scroll to game message when game ends
  React.useEffect(() => {
    if (gameWon || gameLost) {
      setTimeout(() => {
        const gameMessage = document.querySelector(".game-message");
        if (gameMessage) {
          gameMessage.scrollIntoView({ behavior: "smooth", block: "center" });
        }
      }, 100);
    }
  }, [gameWon, gameLost]);

  // Show modal when game ends
  React.useEffect(() => {
    if (gameWon || gameLost) {
      const rungsFilled = rungs.filter((r) => r.isFilled).length;
      if (rungsFilled > 0) {
        setGameEndStats({
          rungsFilled: rungsFilled,
          timeInSeconds: timer,
          skips: skipCount,
          score: score,
        });
        setShowModal(true);
      }
    }
  }, [gameWon, gameLost]);

  function generateNewRungs() {
    const newRungs = [];
    for (let i = 0; i < 20; i++) {
      newRungs.push({
        value: null,
        isFilled: false,
        id: nanoid(),
        position: i,
        rungNumber: i + 1,
      });
    }
    return newRungs;
  }

  function startGame() {
    if (!gameStarted && !gameWon && !gameLost) {
      setGameStarted(true);
      setStartTime(Date.now());
    }
  }

  function handleSkip() {
    if (gameWon || gameLost) return;
    startGame(); // Start timer on first action
    setRandomNumber(Math.floor(Math.random() * 1000) + 1);
    setSkipCount((prev) => prev + 1);
  }

  function calculateScore(rungsFilled, timeInSeconds, skips) {
    // If game hasn't started, score is 0
    if (!gameStarted) {
      return 0;
    }

    // Base points: 25 points per filled rung
    const basePoints = rungsFilled * 25;

    // Bonus points: every 5 rungs filled gives 10 bonus points
    const bonusPoints = Math.floor(rungsFilled / 5) * 10;

    // Time bonus: faster is better (max 500 points, min 0)
    const timeBonus = Math.min(500, Math.floor(500 / (timeInSeconds + 1)));

    // Skip penalty: 3 points deducted per skip
    const skipPenalty = skips * 3;

    // Final score calculation
    let finalScore = basePoints + bonusPoints + timeBonus - skipPenalty;

    // Ensure score doesn't go negative
    finalScore = Math.max(0, finalScore);

    return finalScore;
  }

  function checkWinCondition(currentRungs) {
    const allFilled = currentRungs.every((rung) => rung.isFilled === true);

    if (allFilled) {
      setGameWon(true);
      return true;
    }
    return false;
  }

  function checkLossCondition(currentRungs, clickedPosition, numberToPlace) {
    // Check left side - any larger number to the left?
    for (let i = 0; i < clickedPosition; i++) {
      if (currentRungs[i].isFilled && currentRungs[i].value > numberToPlace) {
        return true;
      }
    }

    // Check right side - any smaller number to the right?
    for (let i = clickedPosition + 1; i < currentRungs.length; i++) {
      if (currentRungs[i].isFilled && currentRungs[i].value < numberToPlace) {
        return true;
      }
    }

    return false;
  }

  function handleRungClick(id, position) {
    if (gameWon || gameLost) return;
    if (rungs[position].isFilled) return;

    startGame(); // Start timer on first action

    if (checkLossCondition(rungs, position, randomNumber)) {
      setGameLost(true);
      return;
    }

    setRungs((prevRungs) => {
      const newRungs = [...prevRungs];
      newRungs[position] = {
        ...newRungs[position],
        value: randomNumber,
        isFilled: true,
      };
      setTimeout(() => checkWinCondition(newRungs), 0);
      return newRungs;
    });

    // Generate new number after placing
    setRandomNumber(Math.floor(Math.random() * 1000) + 1);
  }

  function newGame() {
    setRungs(generateNewRungs());
    setRandomNumber(Math.floor(Math.random() * 1000) + 1);
    setGameWon(false);
    setGameLost(false);
    setGameStarted(false); // Reset game started flag
    setScore(0);
    setTimer(0);
    setSkipCount(0);
    setStartTime(null);
  }

  // Organize rungs into 4 columns for display
  const getColumnRungs = () => {
    const columns = [[], [], [], []];
    rungs.forEach((rung, index) => {
      const columnIndex = Math.floor(index / 5);
      columns[columnIndex].push(rung);
    });
    return columns;
  };

  const columns = getColumnRungs();
  const rungsFilled = rungs.filter((r) => r.isFilled).length;

  return (
    <>
      {gameWon && <Confetti recycle={false} numberOfPieces={200} />}
      <div className="game-container">
        <div className="game-content">
          <h1 className="title">Number Ladder 🪜🎮</h1>
          {!gameStarted && (
            <p className="instructions">
              📏 THE LADDER RULE: Think of it like a staircase — each step UP
              must have a <strong>BIGGER number</strong>. Place a number that
              breaks this order...
              <strong className="loss-text"> GAME OVER!</strong>
              <br />
              <br />
              💡 Your score is based on:
              <strong> rungs filled</strong> , <strong>speed bonus</strong> and
              <strong> skip penalties</strong>. Fill all 20 rungs in ascending
              order to win! Each skip costs
              <strong> 3 points</strong>. Good luck! 🍀
            </p>
          )}
          {/* Rest of your game content */}

          {/* Stats Row */}
          <div className="stats-row">
            <div className="stat-card score-stat">
              <span className="stat-label">🏆 SCORE</span>
              <span className="stat-value">{score}</span>
            </div>
            <div className="stat-card timer-stat">
              <span className="stat-label">⏱️ TIME</span>
              <span className="stat-value">
                {gameStarted ? `${timer}s` : "0s"}
              </span>
            </div>
            <div className="stat-card skips-stat">
              <span className="stat-label">🔄 SKIPS</span>
              <span className="stat-value">{skipCount}</span>
            </div>
          </div>

          {/* Progress bar */}
          <div className="progress-bar-container compact">
            <div className="progress-bar-label">
              Progress: {rungsFilled}/20 rungs filled
            </div>
            <div className="progress-bar">
              <div
                className="progress-bar-fill"
                style={{ width: `${(rungsFilled / 20) * 100}%` }}
              />
            </div>
          </div>

          {/* Current Number Card */}
          <div className="current-number-card compact">
            <div className="current-number-label">Current Number</div>
            <div className="current-number">{randomNumber}</div>
            <button
              className="skip-number-btn compact"
              onClick={handleSkip}
              disabled={gameWon || gameLost}
            >
              🔄 Skip (-3 pts)
            </button>
          </div>

          <div className="ladder-container">
            <div className="ladder-columns">
              {columns.map((column, colIndex) => (
                <div key={colIndex} className="ladder-column">
                  {column.map((rung) => (
                    <Rung
                      key={rung.id}
                      value={rung.value}
                      isFilled={rung.isFilled}
                      rungNumber={rung.rungNumber}
                      clickRung={() => handleRungClick(rung.id, rung.position)}
                    />
                  ))}
                </div>
              ))}
            </div>
          </div>

          {/* Start prompt - show only if game hasn't started */}
          {!gameStarted && !gameWon && !gameLost && (
            <div className="start-prompt">
              <div className="start-prompt-icon">🎮</div>
              <div className="start-prompt-text">
                Click any rung or skip to start!
              </div>
            </div>
          )}

          {(gameWon || gameLost) && (
            <div className={`game-message ${gameWon ? "win" : "loss"}`}>
              <div className="game-message-icon">
                {gameWon ? "🎉🏆🎉" : "💀😢💀"}
              </div>
              <div className="game-message-title">
                {gameWon ? "PERFECT LADDER!" : "GAME OVER!"}
              </div>
              <div className="game-message-stats">
                <div>📊 Final Stats:</div>
                <div>Rungs Filled: {rungsFilled}/20</div>
                <div>⏱️ Time: {timer} seconds</div>
                <div>🔄 Skips Used: {skipCount}</div>
                <div>🏆 Final Score: {score}</div>
              </div>
              <button className="new-game-btn" onClick={newGame}>
                Play Again?
              </button>
            </div>
          )}

          <div className="button-container">
            <Link to="/home" className="home-btn">
              ← Home
            </Link>
          </div>
        </div>
        {showModal && gameEndStats && (
          <LeaderBoardModal
            stats={gameEndStats}
            onClose={() => setShowModal(false)}
            onSave={saveScoreToLeaderboard}
          />
        )}
      </div>
    </>
  );
}
