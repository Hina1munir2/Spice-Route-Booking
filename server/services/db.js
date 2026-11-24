
const mongoose = require("mongoose");

let cachedConnection = null;

const connectDB = async () => {
  if (cachedConnection && mongoose.connection.readyState === 1) {
    return cachedConnection;
  }

  if (!process.env.MONGODB_URI) {
    throw new Error("MONGODB_URI is not configured.");
  }

  if (!cachedConnection) {
    cachedConnection = mongoose.connect(process.env.MONGODB_URI, {
      serverSelectionTimeoutMS: 10000,
    });
  }

  try {
    await cachedConnection;
    console.log("MongoDB connected successfully.");
    return cachedConnection;
  } catch (error) {
    cachedConnection = null;
    throw error;
  }
};

module.exports = connectDB;
