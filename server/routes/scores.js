import express from "express";
import {
  saveScore,
  getLeaderboard,
  getTopScores,
} from "../controller/scoreController.js";

const router = express.Router();

// POST /api/scores - Save a new score
router.post("/scores", saveScore);

// GET /api/leaderboard - Get all scores for leaderboard
router.get("/leaderboard", getLeaderboard);

// GET /api/leaderboard/top - Get top 20 scores
router.get("/leaderboard/top", getTopScores);

export default router;
