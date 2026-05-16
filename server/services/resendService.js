import { Resend } from "resend";
import dotenv from "dotenv";

dotenv.config();

// Initialize Resend with your API key
const resend = new Resend(process.env.RESEND_API_KEY);

// Your email address (where all notifications will go)
const YOUR_EMAIL = "ifeoluwadaramola61@gmail.com";

// Verify connection on startup
verifyResendConnection();

async function verifyResendConnection() {
  try {
    const { data, error } = await resend.emails.send({
      from: "Number Ladder <onboarding@resend.dev>",
      to: ["delivered@resend.dev"],
      subject: "Test Connection",
      html: "<p>Testing Resend connection</p>",
    });

    if (error) {
      console.log("❌ Resend connection error:", error.message);
    } else {
      console.log("✅ Resend email service ready");
    }
  } catch (error) {
    console.log("❌ Resend connection error:", error.message);
  }
}

export async function sendEmail({ to, subject, html }) {
  // Always send to your email address (ignore the 'to' parameter)
  const actualRecipient = YOUR_EMAIL;

  try {
    console.log(`📧 Sending email to: ${actualRecipient}`);
    console.log(`   Subject: ${subject}`);

    const { data, error } = await resend.emails.send({
      from: "Number Ladder <onboarding@resend.dev>",
      to: [actualRecipient],
      subject,
      html,
    });

    if (error) {
      console.error("❌ Resend error:", error);
      return { success: false, error: error.message };
    }

    console.log(`✅ Email sent! ID: ${data.id}`);
    return { success: true, messageId: data.id };
  } catch (error) {
    console.error("❌ Email send failed:", error);
    return { success: false, error: error.message };
  }
}
