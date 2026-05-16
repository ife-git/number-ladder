import Score from "../models/Score.js";
import { appEvents } from "../events/eventEmitter.js";

// Save a new score
export async function saveScore(req, res) {
  try {
    const { playerName, rungsFilled, timeInSeconds, skips, score } = req.body;

    // Validation
    if (!playerName || playerName.length < 3 || playerName.length > 20) {
      return res.status(400).json({
        error: "Username must be between 3 and 20 characters",
      });
    }

    if (rungsFilled < 0 || rungsFilled > 20) {
      return res.status(400).json({
        error: "Rungs filled must be between 0 and 20",
      });
    }

    // Create and save score
    const newScore = new Score({
      playerName: playerName.trim(),
      rungsFilled,
      timeInSeconds,
      skips,
      score,
    });

    await newScore.save();

    // Get current rank/position
    const higherScores = await Score.countDocuments({ score: { $gt: score } });
    const position = higherScores + 1;

    // Emit event for new leaderboard entry (sends to your email)
    appEvents.emit("leaderboard:new-entry", {
      name: playerName.trim(),
      position: position,
      score: score,
      rungsFilled: rungsFilled,
      timeInSeconds: timeInSeconds,
      skips: skips,
    });

    res.status(201).json({
      message: "Score saved successfully!",
      score: newScore,
    });
  } catch (error) {
    console.error("Error saving score:", error);
    res.status(500).json({ error: "Failed to save score" });
  }
}

// Get all scores (for leaderboard)
export async function getLeaderboard(req, res) {
  try {
    const { limit = 50, sortBy = "score" } = req.query;

    let sortOption = {};
    if (sortBy === "score") sortOption = { score: -1 };
    else if (sortBy === "time") sortOption = { timeInSeconds: 1 };
    else if (sortBy === "rungs") sortOption = { rungsFilled: -1 };
    else if (sortBy === "skips") sortOption = { skips: 1 };
    else sortOption = { score: -1 };

    const scores = await Score.find().sort(sortOption).limit(parseInt(limit));

    res.status(200).json(scores);
  } catch (error) {
    console.error("Error fetching leaderboard:", error);
    res.status(500).json({ error: "Failed to fetch leaderboard" });
  }
}

// Get top 20 scores (for leaderboard display)
export async function getTopScores(req, res) {
  try {
    const topScores = await Score.find().sort({ score: -1 }).limit(50);

    res.status(200).json(topScores);
  } catch (error) {
    console.error("Error fetching top scores:", error);
    res.status(500).json({ error: "Failed to fetch top scores" });
  }
}
