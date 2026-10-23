
const mongoose = require("mongoose");

const bookingSchema = new mongoose.Schema(
  {
    service: {
      type: mongoose.Schema.Types.ObjectId,
      ref: "Service",
      required: [true, "Service is required."],
    },
    date: {
      type: Date,
      required: [true, "Booking date is required."],
      validate: {
        validator: (value) =>
          value instanceof Date && !Number.isNaN(value.getTime()),
        message: "Please provide a valid booking date.",
      },
    },
    slot: {
      type: String,
      required: [true, "Booking slot is required."],
      match: [
        /^([01]\d|2[0-3]):[0-5]\d$/,
        "Slot must use HH:mm format, such as 18:30.",
      ],
    },
    customerName: {
      type: String,
      required: [true, "Customer name is required."],
      trim: true,
      maxlength: [100, "Customer name cannot exceed 100 characters."],
    },
    customerEmail: {
      type: String,
      required: [true, "Customer email is required."],
      trim: true,
      lowercase: true,
      match: [
        /^[^\s@]+@[^\s@]+\.[^\s@]+$/,
        "Please provide a valid customer email.",
      ],
    },
    customerPhone: {
      type: String,
      required: [true, "Customer phone is required."],
      trim: true,
      match: [
        /^\+?[0-9\s()-]{7,20}$/,
        "Please provide a valid customer phone number.",
      ],
    },
  },
  { timestamps: true }
);

// One booking per service, date, and slot.
bookingSchema.index(
  { service: 1, date: 1, slot: 1 },
  { unique: true }
);

module.exports = mongoose.model("Booking", bookingSchema);
