require("dotenv").config();

const dns = require("node:dns");

// Use Google DNS to resolve MongoDB Atlas SRV records.
dns.setServers(["8.8.8.8", "8.8.4.4"]);

const mongoose = require("mongoose");
const User = require("../models/User");

const createStaff = async () => {
  try {
    const { STAFF_NAME, STAFF_EMAIL, STAFF_PASSWORD, MONGODB_URI } =
      process.env;

    if (!MONGODB_URI || !STAFF_NAME || !STAFF_EMAIL || !STAFF_PASSWORD) {
      throw new Error(
        "Please configure MONGODB_URI, STAFF_NAME, STAFF_EMAIL, and STAFF_PASSWORD in .env."
      );
    }

    if (STAFF_PASSWORD.length < 8) {
      throw new Error("Staff password must contain at least 8 characters.");
    }

    await mongoose.connect(MONGODB_URI);

    const email = STAFF_EMAIL.trim().toLowerCase();

    const existingStaff = await User.findOne({ email });

    if (existingStaff) {
      throw new Error("An account with this email already exists.");
    }

    const staff = await User.create({
      name: STAFF_NAME,
      email,
      password: STAFF_PASSWORD,
      role: "staff",
    });

    console.log(`Staff account created successfully: ${staff.email}`);
  } catch (error) {
    console.error("Staff account creation failed:", error.message);
    process.exitCode = 1;
  } finally {
    await mongoose.disconnect();
  }
};

createStaff();
