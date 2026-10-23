
const express = require("express");
const mongoose = require("mongoose");
const Service = require("../models/Service");
const Booking = require("../models/Booking");

const router = express.Router();

// GET /services
router.get("/services", async (req, res, next) => {
  try {
    const services = await Service.find().sort({ name: 1 });

    res.status(200).json({
      success: true,
      count: services.length,
      services,
    });
  } catch (error) {
    next(error);
  }
});

// POST /bookings
router.post("/bookings", async (req, res, next) => {
  try {
    const {
      service,
      date,
      slot,
      customerName,
      customerEmail,
      customerPhone,
    } = req.body;

    if (
      !service ||
      !date ||
      !slot ||
      !customerName ||
      !customerEmail ||
      !customerPhone
    ) {
      return res.status(400).json({
        success: false,
        message:
          "Please provide service, date, slot, customerName, customerEmail, and customerPhone.",
      });
    }

    if (!mongoose.isValidObjectId(service)) {
      return res.status(400).json({
        success: false,
        message: "The service ID is invalid.",
      });
    }

    const bookingDate = new Date(date);

    if (Number.isNaN(bookingDate.getTime())) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid booking date.",
      });
    }

    const selectedService = await Service.findById(service);

    if (!selectedService) {
      return res.status(400).json({
        success: false,
        message: "The selected service does not exist.",
      });
    }

    if (!selectedService.availableSlots.includes(slot)) {
      return res.status(400).json({
        success: false,
        message: "The requested slot is not available for this service.",
      });
    }

    // Normalize to midnight UTC so the same calendar date
    // uses the same indexed date value.
    const normalizedDate = new Date(
      `${bookingDate.toISOString().slice(0, 10)}T00:00:00.000Z`
    );

    const booking = await Booking.create({
      service,
      date: normalizedDate,
      slot,
      customerName,
      customerEmail,
      customerPhone,
    });

    return res.status(201).json({
      success: true,
      message: "Booking created successfully.",
      booking,
    });
  } catch (error) {
    next(error);
  }
});

module.exports = router;
