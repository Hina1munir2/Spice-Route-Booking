
const mongoose = require("mongoose");

const serviceSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: [true, "Service name is required."],
      trim: true,
      maxlength: [100, "Service name cannot exceed 100 characters."],
    },
    duration: {
      type: Number,
      required: [true, "Service duration is required."],
      min: [1, "Duration must be greater than zero."],
    },
    price: {
      type: Number,
      required: [true, "Service price is required."],
      min: [0, "Price cannot be negative."],
    },
    availableSlots: {
      type: [String],
      required: true,
      validate: {
        validator: (slots) =>
          slots.length > 0 &&
          slots.every((slot) =>
            /^([01]\d|2[0-3]):[0-5]\d$/.test(slot)
          ),
        message: "Provide at least one valid time slot in HH:mm format.",
      },
    },
  },
  { timestamps: true }
);

module.exports = mongoose.model("Service", serviceSchema);
