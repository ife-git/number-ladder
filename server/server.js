import express from "express";
import cors from "cors";
import dotenv from "dotenv";
import dns from "dns"; // ← THIS LINE IS MISSING
import { connectDB } from "./config/db.js";
import scoreRoutes from "./routes/scores.js";

dns.setServers(["8.8.8.8", "8.8.4.4"]);

dotenv.config();

const app = express();
const PORT = process.env.PORT || 8000;

app.use(cors());
app.use(express.json());
app.use("/api", scoreRoutes);

app.get("/api/health", (req, res) => {
  res.status(200).json({ message: "Server is running!" });
});

// Start server
connectDB()
  .then(() => {
    app.listen(PORT, () => {
      console.log(`🚀 Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error("❌ Failed to connect to database:", error);
    process.exit(1);
  });
