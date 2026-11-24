
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");
const connectDB = require("./services/db");
const {
  processDueReminders,
} = require("./services/reminderService");

const app = express();
const routes = require("./routes");
const authRoutes = require("./routes/auth");

// Do not disclose Express through the X-Powered-By header.
app.disable("x-powered-by");

// Allow requests only from the configured frontend origin.
const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:5173";

app.use(
  cors({
    origin: allowedOrigin,
   methods: ["GET", "POST", "PATCH", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

// Ensure MongoDB is connected before handling API requests.
app.use(async (req, res, next) => {
  if (process.env.VERCEL !== "1") {
  return next();
}
  try {
    await connectDB();
    next();
  } catch (error) {
    console.error("Database connection failed:", error.message);

    res.status(503).json({
      success: false,
      message: "Database is temporarily unavailable.",
    });
  }
});
app.use(express.json({ limit: "10kb" }));
app.use("/", routes);
app.use("/auth", authRoutes);

app.get("/", (req, res) => {
  res.status(200).json({
    success: true,
    message: "Spice Route Restaurant API is running!",
    database:
      mongoose.connection.readyState === 1
        ? "connected"
        : "disconnected",
  });
});

// Protected endpoint for Vercel Cron reminder checks.
app.get("/api/cron/reminders", async (req, res) => {
  const cronSecret = process.env.CRON_SECRET;

  if (!cronSecret) {
    return res.status(503).json({
      success: false,
      message: "Cron secret is not configured.",
    });
  }

  if (req.get("Authorization") !== `Bearer ${cronSecret}`) {
    return res.status(401).json({
      success: false,
      message: "Unauthorized.",
    });
  }

  await processDueReminders();

  return res.status(200).json({
    success: true,
    message: "Reminder check completed.",
  });
});

// Handle application errors.
app.use((error, req, res, next) => {
  console.error(error.message);

  if (
    error.name === "ValidationError" ||
    error.name === "CastError"
  ) {
    return res.status(400).json({
      success: false,
      message: error.message,
    });
  }

  if (error.code === 11000) {
    return res.status(409).json({
      success: false,
      message: "This service is already booked for that date and slot.",
    });
  }

  return res.status(500).json({
    success: false,
    message: "An unexpected server error occurred.",
  });
});

// Handle unknown endpoints.
app.use((req, res) => {
  res.status(404).json({
    success: false,
    message: "API endpoint not found.",
  });
});

module.exports = app;
