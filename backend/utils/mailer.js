const nodemailer = require("nodemailer");

let transporter;

async function createTestAccount() {
  try {
    const testAccount = await nodemailer.createTestAccount();
    console.log("\n📧 Test Email Account Created:");
    console.log("   Email:", testAccount.user);
    console.log("   Password:", testAccount.pass);
    console.log("   Preview emails at: https://ethereal.email\n");

    return nodemailer.createTransport({
      host: "smtp.ethereal.email",
      port: 587,
      secure: false,
      auth: {
        user: testAccount.user,
        pass: testAccount.pass,
      },
    });
  } catch (error) {
    console.error("Failed to create test account:", error);
    return null;
  }
}

async function getTransporter() {
  if (transporter) return transporter;

  // If SMTP is configured, use it
  if (process.env.SMTP_HOST && process.env.SMTP_USER) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST,
      port: process.env.SMTP_PORT || 587,
      secure: process.env.SMTP_SECURE === "true",
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log("✅ Using configured SMTP:", process.env.SMTP_HOST);
  } else {
    // Otherwise, create a test account
    console.log("📧 Creating test email account (Ethereal)...");
    transporter = await createTestAccount();
  }

  return transporter;
}

async function sendMail(to, subject, text, html) {
  try {
    const transport = await getTransporter();

    if (!transport) {
      console.log(
        "[mailer] Email service not available - skipping email:",
        to,
        subject
      );
      return;
    }

    const info = await transport.sendMail({
      from: process.env.SMTP_FROM || "One Calendar <noreply@onecalendar.com>",
      to,
      subject,
      text,
      html,
    });

    console.log("✅ Email sent:", info.messageId);

    // If using Ethereal, show preview URL
    if (info.messageId && nodemailer.getTestMessageUrl(info)) {
      console.log("📬 Preview email: " + nodemailer.getTestMessageUrl(info));
    }

    return info;
  } catch (error) {
    console.error("❌ Failed to send email:", error.message);
    throw error;
  }
}

module.exports = { sendMail };
