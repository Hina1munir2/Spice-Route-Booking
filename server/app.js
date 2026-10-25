
const express = require("express");
const cors = require("cors");
const mongoose = require("mongoose");

const app = express();
const routes = require("./routes");

// Do not disclose Express through the X-Powered-By header.
app.disable("x-powered-by");

// Allow only the configured frontend origin.
const allowedOrigin =
  process.env.CLIENT_URL || "http://localhost:3000";

app.use(
  cors({
    origin: allowedOrigin,
    methods: ["GET", "POST", "OPTIONS"],
    allowedHeaders: ["Content-Type", "Authorization"],
  })
);

app.use(express.json({ limit: "10kb" }));
app.use("/", routes);

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
