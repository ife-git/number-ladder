import { EventEmitter } from "node:events";
import { sendEmail } from "../services/resendService.js";

export const appEvents = new EventEmitter();

// ===== LEADERBOARD EVENTS =====
appEvents.on("leaderboard:new-entry", async (entryData) => {
  console.log(`📧 New leaderboard entry from ${entryData.name}`);

  // Send notification email to yourself
  await sendEmail({
    to: "ifeoluwadaramola61@gmail.com", // Your email address
    subject: `🎉 New Leaderboard Entry! - ${entryData.name} scored ${entryData.score}`,
    html: `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto; padding: 20px;">
        <h2 style="color: #4a90e2;">🏆 New Leaderboard Entry! 🏆</h2>
        
        <div style="background-color: #f5f5f5; padding: 20px; border-radius: 10px; margin: 20px 0;">
          <h3 style="margin-top: 0;">📊 Player Stats:</h3>
          <p><strong>👤 Player Name:</strong> ${entryData.name}</p>
          <p><strong>🎯 Score:</strong> ${entryData.score}</p>
          <p><strong>🪜 Rungs Filled:</strong> ${entryData.rungsFilled}/20</p>
          <p><strong>⏱️ Time:</strong> ${entryData.timeInSeconds} seconds</p>
          <p><strong>🔄 Skips Used:</strong> ${entryData.skips}</p>
          <p><strong>📈 Current Position:</strong> #${entryData.position}</p>
        </div>
        
        <p>Check out the full leaderboard here:</p>
        <a href="${process.env.BASE_URL}/leaderboard" style="display: inline-block; background-color: #4a90e2; color: white; padding: 10px 20px; text-decoration: none; border-radius: 5px;">View Leaderboard →</a>
        
        <hr style="margin: 20px 0; border: none; border-top: 1px solid #ddd;" />
        
        <p style="color: #666; font-size: 12px;">This email was sent because someone added their score to the Number Ladder leaderboard.</p>
      </div>
    `,
  });
});
