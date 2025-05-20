const cron = require("node-cron");
const RequestModel = require("../Models/Request");
const UserModel = require("../Models/User");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();

// Configure transporter with proper validation
const transporter = nodemailer.createTransport({
  service: "gmail",
  auth: {
    user: "shivamsaxena562006@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
  secure: true, // Use SSL
  tls: {
    rejectUnauthorized: true, // Important for production
  },
});

// Validate Date creation
function getPastDate(minutesAgo) {
  const date = new Date(Date.now() - minutesAgo * 60 * 1000);
  if (isNaN(date)) throw new Error("Invalid date calculation");
  return date;
}

// Modified cron job with error handling
function scheduleReminders() {
  cron.schedule(
    "*/5 * * * *",
    async () => {
      console.log("Reminder job triggered at", new Date().toISOString());

      try {
        const oneHourAgo = getPastDate(60); // 60 minutes = 1 hour

        const pendingRequests = await RequestModel.find({
          status: "pending",
          createdAt: { $lte: oneHourAgo },
        }).populate("requester");

        console.log("Found", pendingRequests.length, "pending requests");
        if (pendingRequests.length === 0) return;

        const receivers = await UserModel.find({ userType: "Receiver" }); // Fixed spelling
        console.log("Receivers found:", receivers.length);

        for (const receiver of receivers) {
          if (!receiver.email) continue;

          try {
            await transporter.sendMail({
              from: '"ARC Support" <shivamsaxena562006@gmail.com>',
              to: receiver.email,
              subject: "Reminder: Pending Requests",
              text: `There are ${pendingRequests.length} pending requests in ARC that need your attention. Please log in to your dashboard to review them.`,
              html: `<p>There are <strong>${pendingRequests.length}</strong> pending requests in ARC that need your attention.</p>
                   <p>Please log in to your dashboard to review them.</p>`,
            });
            console.log(`Reminder sent to ${receiver.email}`);
          } catch (emailError) {
            console.error(`Failed to send to ${receiver.email}:`, emailError);
          }
        }
      } catch (err) {
        console.error("Reminder job failed:", err);
      }
    },
    {
      scheduled: true,
      timezone: "Asia/Kolkata", // Set appropriate timezone
    }
  );
}

// Start the scheduler with validation
try {
  scheduleReminders();
  console.log("Cron job scheduled successfully");
} catch (cronError) {
  console.error("Failed to schedule cron job:", cronError);
}
