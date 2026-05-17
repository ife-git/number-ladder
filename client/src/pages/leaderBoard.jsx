import { Link } from "react-router-dom";
import React, { useState, useEffect } from "react";

export default function LeaderBoard() {
  const [scores, setScores] = useState([]);
  const [loading, setLoading] = useState(true);
  const [sortBy, setSortBy] = useState("score");
  const [error, setError] = useState(null);

  // Get API URL from environment variable or use localhost for development
  const API_URL = import.meta.env.VITE_API_URL || "http://localhost:8000";

  // Fetch real data from backend
  useEffect(() => {
    fetchScores();
  }, []);

  const fetchScores = async () => {
    try {
      setLoading(true);
      const response = await fetch(`${API_URL}/api/leaderboard`);
      if (!response.ok) throw new Error("Failed to fetch");
      const data = await response.json();
      setScores(data);
      setError(null);
    } catch (err) {
      console.error("Error fetching scores:", err);
      setError("Failed to load leaderboard");
    } finally {
      setLoading(false);
    }
  };

  const formatTime = (seconds) => {
    const mins = Math.floor(seconds / 60);
    const secs = seconds % 60;
    return `${mins}:${secs.toString().padStart(2, "0")}`;
  };

  const formatDate = (dateString) => {
    const date = new Date(dateString);
    return date.toLocaleDateString();
  };

  const getSortedScores = () => {
    const sorted = [...scores];
    switch (sortBy) {
      case "score":
        return sorted.sort((a, b) => b.score - a.score);
      case "rungs":
        return sorted.sort((a, b) => b.rungsFilled - a.rungsFilled);
      case "time":
        return sorted.sort((a, b) => a.timeInSeconds - b.timeInSeconds);
      case "skips":
        return sorted.sort((a, b) => a.skips - b.skips);
      default:
        return sorted;
    }
  };

  if (loading) {
    return (
      <div className="leaderboard-container">
        <div className="loading-spinner">Loading leaderboard...</div>
        <div className="button-container">
          <Link to="/home" className="home-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="leaderboard-container">
        <div className="error-message">{error}</div>
        <button onClick={fetchScores} className="retry-btn">
          Retry
        </button>
        <div className="button-container">
          <Link to="/home" className="home-btn">
            ← Back to Home
          </Link>
        </div>
      </div>
    );
  }

  return (
    <div className="leaderboard-container">
      <div className="leaderboard-header">
        <h1 className="leaderboard-title">🏆 Leaderboard 🏆</h1>
        <p className="leaderboard-subtitle">
          Top players who've mastered the Number Ladder
        </p>
      </div>

      <div className="sort-controls">
        <label>Sort by: </label>
        <button
          className={`sort-btn ${sortBy === "score" ? "active" : ""}`}
          onClick={() => setSortBy("score")}
        >
          Score ⭐
        </button>
        <button
          className={`sort-btn ${sortBy === "rungs" ? "active" : ""}`}
          onClick={() => setSortBy("rungs")}
        >
          Rungs Filled 🪜
        </button>
        <button
          className={`sort-btn ${sortBy === "time" ? "active" : ""}`}
          onClick={() => setSortBy("time")}
        >
          Fastest Time ⏱️
        </button>
        <button
          className={`sort-btn ${sortBy === "skips" ? "active" : ""}`}
          onClick={() => setSortBy("skips")}
        >
          Fewest Skips 🔄
        </button>
      </div>

      {scores.length === 0 ? (
        <div className="empty-state">
          No scores yet! Be the first to play! 🎮
        </div>
      ) : (
        <div className="table-wrapper">
          <table className="leaderboard-table">
            <thead>
              <tr>
                <th>Rank</th>
                <th>Player</th>
                <th>Score</th>
                <th>Rungs Filled</th>
                <th>Time</th>
                <th>Skips</th>
                <th>Date</th>
              </tr>
            </thead>
            <tbody>
              {getSortedScores().map((entry, index) => (
                <tr key={entry._id} className={index < 3 ? "top-three" : ""}>
                  <td className="rank">
                    {index === 0 && "🥇"}
                    {index === 1 && "🥈"}
                    {index === 2 && "🥉"}
                    {index > 2 && `${index + 1}`}
                  </td>
                  <td className="player-name">{entry.playerName}</td>
                  <td className="score">{entry.score.toLocaleString()}</td>
                  <td className="rungs">
                    <span className="rungs-filled">{entry.rungsFilled}/20</span>
                  </td>
                  <td className="time">{formatTime(entry.timeInSeconds)}</td>
                  <td className="skips">
                    <span
                      className={`skips-badge ${entry.skips === 0 ? "perfect" : entry.skips <= 2 ? "good" : "many"}`}
                    >
                      {entry.skips} {entry.skips === 1 ? "skip" : "skips"}
                    </span>
                  </td>
                  <td className="date">{formatDate(entry.createdAt)}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}

      <div className="button-container">
        <Link to="/home" className="home-btn">
          ← Back to Home
        </Link>
      </div>
    </div>
  );
}
