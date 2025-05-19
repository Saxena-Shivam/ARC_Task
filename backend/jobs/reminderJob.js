const cron = require("node-cron");
const RequestModel = require("../Models/Request");
const UserModel = require("../Models/User");
const nodemailer = require("nodemailer");
const dotenv = require("dotenv");
dotenv.config();
// Configure your transporter (Ethereal for testing)
const transporter = nodemailer.createTransport({
  service: "gmail",
  port: 465,
  secure: true,
  auth: {
    user: "shivamsaxena562006@gmail.com",
    pass: process.env.GMAIL_PASSWORD,
  },
});

// Run every 5 minute
cron.schedule("*/5 * * * *", async () => {
  console.log("Reminder job triggered at", new Date());

  // change to 60 * 60 * 1000 for 1 hour in production
  const oneMinuteAgo = new Date(Date.now() - 60 * 60 * 1000);
  try {
    // Find pending requests older than 1 minute
    const pendingRequests = await RequestModel.find({
      status: "pending",
      createdAt: { $lte: oneMinuteAgo },
    }).populate("requester");

    console.log("Found", pendingRequests.length, "pending requests");

    if (pendingRequests.length === 0) return;

    // Get all receivers
    const receivers = await UserModel.find({ userType: "Reciever" });
    console.log("Receivers found:", receivers.length);

    for (const receiver of receivers) {
      if (!receiver.email) continue;

      // You can customize the email content as needed
      const emailText = `
        There are pending requests in ARC that need your attention.
        Please log in to your ARC dashboard to accept or reject requests.
      `;

      console.log(`Sending reminder to receiver: ${receiver.email}`);
      await transporter.sendMail({
        from: '"ARC" <jackson.mills@ethereal.email>',
        to: receiver.email,
        subject: "Reminder: Pending Requests",
        text: emailText,
      });

      console.log(`Reminder sent to receiver: ${receiver.email}`);
    }
  } catch (err) {
    console.error("Error sending reminders:", err);
  }
});
