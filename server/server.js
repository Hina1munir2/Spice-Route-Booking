
const dns = require("node:dns");
dns.setServers(["8.8.8.8", "8.8.4.4"]);

require("dotenv").config();

const mongoose = require("mongoose");
const app = require("./app");
const {
  verifyEmailConnection,
} = require("./services/emailService");
const {
  startReminderScheduler,
} = require("./services/reminderService");

const PORT = process.env.PORT || 5000;

async function startServer() {
  try {
    if (!process.env.MONGODB_URI) {
      throw new Error("MONGODB_URI is missing from the .env file.");
    }

    await mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });

    console.log("MongoDB connected successfully.");

    // Check Gmail connection without preventing the API from starting.
    await verifyEmailConnection();

    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);

  startReminderScheduler();
    });
  } catch (error) {
    console.error("Failed to start server:", error.message);
    process.exitCode = 1;
  }
}

startServer();
