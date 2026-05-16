import React, { useState } from "react";

export default function LeaderBoardModal({ onClose, stats, onSave }) {
  const [playerName, setPlayerName] = useState("");
  const [saving, setSaving] = useState(false);
  const [error, setError] = useState("");

  const handleSave = async () => {
    if (!playerName.trim()) {
      setError("Please enter a username");
      return;
    }
    if (playerName.length < 3) {
      setError("Username must be at least 3 characters");
      return;
    }
    if (playerName.length > 20) {
      setError("Username must be less than 20 characters");
      return;
    }

    setSaving(true);
    setError("");

    const success = await onSave(playerName.trim());

    setSaving(false);
    if (success) {
      onClose();
    }
  };

  return (
    <div className="modal-backdrop" onClick={onClose}>
      <div className="modal-card" onClick={(e) => e.stopPropagation()}>
        <button className="close-btn" onClick={onClose}>
          ✕
        </button>

        <h2>🏆 Add to Leaderboard? 🏆</h2>

        <div className="modal-stats">
          <div>📊 Your Stats:</div>
          <div>Rungs Filled: {stats.rungsFilled}/20</div>
          <div>⏱️ Time: {stats.timeInSeconds} seconds</div>
          <div>🔄 Skips Used: {stats.skips}</div>
          <div>🏆 Score: {stats.score}</div>
        </div>

        <div className="modal-input-group">
          <label>Enter your name:</label>
          <input
            type="text"
            placeholder="Username (3-20 characters)"
            value={playerName}
            onChange={(e) => setPlayerName(e.target.value)}
            maxLength={20}
            autoFocus
          />
          {error && <div className="modal-error">{error}</div>}
        </div>

        <div className="modal-buttons">
          <button className="modal-cancel-btn" onClick={onClose}>
            Skip
          </button>
          <button
            className="modal-save-btn"
            onClick={handleSave}
            disabled={saving}
          >
            {saving ? "Saving..." : "Save to Leaderboard"}
          </button>
        </div>
      </div>
    </div>
  );
}
