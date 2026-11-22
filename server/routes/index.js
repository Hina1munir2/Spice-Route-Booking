
const express = require("express");
const mongoose = require("mongoose");
const Service = require("../models/Service");
const Booking = require("../models/Booking");
const {
  authenticateToken,
  authorizeRoles,
} = require("../middleware/auth");

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


// GET /services/:serviceId/availability?date=YYYY-MM-DD
router.get("/services/:serviceId/availability", async (req, res, next) => {
  try {
    const { serviceId } = req.params;
    const { date } = req.query;

    if (!mongoose.isValidObjectId(serviceId)) {
      return res.status(400).json({
        success: false,
        message: "The service ID is invalid.",
      });
    }

    if (!date || !/^\d{4}-\d{2}-\d{2}$/.test(date)) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid date in YYYY-MM-DD format.",
      });
    }

    const bookingDate = new Date(`${date}T00:00:00.000Z`);

    if (
      Number.isNaN(bookingDate.getTime()) ||
      bookingDate.toISOString().slice(0, 10) !== date
    ) {
      return res.status(400).json({
        success: false,
        message: "Please provide a valid calendar date.",
      });
    }

    const selectedService = await Service.findById(serviceId);

    if (!selectedService) {
      return res.status(404).json({
        success: false,
        message: "Service not found.",
      });
    }

    const bookings = await Booking.find({
      service: serviceId,
      date: bookingDate,
    }).select("slot -_id");

    const bookedSlots = bookings.map((booking) => booking.slot);
    const availableSlots = selectedService.availableSlots.filter(
      (slot) => !bookedSlots.includes(slot)
    );

    return res.status(200).json({
      success: true,
      date,
      service: selectedService.name,
      availableSlots,
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


// GET /staff/bookings
// Only authenticated staff members can view all bookings.
router.get(
  "/staff/bookings",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res, next) => {
    try {
      const { date, status } = req.query;
      const filter = {};

      // Filter bookings by date.
      if (date) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(date)) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid date in YYYY-MM-DD format.",
          });
        }

        const bookingDate = new Date(`${date}T00:00:00.000Z`);

        if (
          Number.isNaN(bookingDate.getTime()) ||
          bookingDate.toISOString().slice(0, 10) !== date
        ) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid calendar date.",
          });
        }

        filter.date = bookingDate;
      }

      // Filter bookings by status.
      if (status) {
        const validStatuses = [
          "pending",
          "confirmed",
          "completed",
          "cancelled",
        ];

        if (!validStatuses.includes(status)) {
          return res.status(400).json({
            success: false,
            message: "Invalid booking status.",
          });
        }

        filter.status = status;
      }

     const safeFilter = mongoose.sanitizeFilter(filter);

const bookings = await Booking.find(safeFilter)
  .populate("service", "name duration price")
  .sort({ date: 1, slot: 1 });

      return res.status(200).json({
        success: true,
        count: bookings.length,
        bookings,
      });
    } catch (error) {
      next(error);
    }
  }
);

// PATCH /staff/bookings/:bookingId/status
// Only authenticated staff members can update booking status.
router.patch(
  "/staff/bookings/:bookingId/status",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res, next) => {
    try {
      const { bookingId } = req.params;
      const { status } = req.body;

      if (!mongoose.isValidObjectId(bookingId)) {
        return res.status(400).json({
          success: false,
          message: "The booking ID is invalid.",
        });
      }

      const validStatuses = [
        "pending",
        "confirmed",
        "completed",
        "cancelled",
      ];

      if (!status || !validStatuses.includes(status)) {
        return res.status(400).json({
          success: false,
          message:
            "Please provide a valid status: pending, confirmed, completed, or cancelled.",
        });
      }

      const booking = await Booking.findByIdAndUpdate(
        bookingId,
        { status },
        { new: true, runValidators: true }
      ).populate("service", "name duration price");

      if (!booking) {
        return res.status(404).json({
          success: false,
          message: "Booking not found.",
        });
      }

      return res.status(200).json({
        success: true,
        message: "Booking status updated successfully.",
        booking,
      });
    } catch (error) {
      next(error);
    }
  }
);


// GET /staff/analytics
// Only authenticated staff members can view booking analytics.
router.get(
  "/staff/analytics",
  authenticateToken,
  authorizeRoles("staff"),
  async (req, res, next) => {
    try {
      const { startDate, endDate } = req.query;
      const filter = {};

      // Validate and apply the starting date.
      if (startDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(startDate)) {
          return res.status(400).json({
            success: false,
            message: "Please provide startDate in YYYY-MM-DD format.",
          });
        }

        const parsedStartDate = new Date(`${startDate}T00:00:00.000Z`);

        if (
          Number.isNaN(parsedStartDate.getTime()) ||
          parsedStartDate.toISOString().slice(0, 10) !== startDate
        ) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid startDate.",
          });
        }

        filter.date = { $gte: parsedStartDate };
      }

      // Validate and apply the ending date.
      if (endDate) {
        if (!/^\d{4}-\d{2}-\d{2}$/.test(endDate)) {
          return res.status(400).json({
            success: false,
            message: "Please provide endDate in YYYY-MM-DD format.",
          });
        }

        const parsedEndDate = new Date(`${endDate}T00:00:00.000Z`);

        if (
          Number.isNaN(parsedEndDate.getTime()) ||
          parsedEndDate.toISOString().slice(0, 10) !== endDate
        ) {
          return res.status(400).json({
            success: false,
            message: "Please provide a valid endDate.",
          });
        }

        filter.date = {
          ...filter.date,
          $lte: parsedEndDate,
        };
      }

      // Reject a date range where the start is after the end.
      if (
        startDate &&
        endDate &&
        new Date(`${startDate}T00:00:00.000Z`) >
          new Date(`${endDate}T00:00:00.000Z`)
      ) {
        return res.status(400).json({
          success: false,
          message: "startDate cannot be after endDate.",
        });
      }
      
    

     const bookings = await Booking.find(
  filter,
  null,
  { sanitizeFilter: false }
).populate("service", "name");
      const totalBookings = bookings.length;

      const statusCounts = {
        pending: 0,
        confirmed: 0,
        completed: 0,
        cancelled: 0,
      };

      const dailyBookings = {};
      const monthlyBookings = {};
      const serviceCounts = {};

      bookings.forEach((booking) => {
        // Count bookings by status.
        if (statusCounts[booking.status] !== undefined) {
          statusCounts[booking.status]++;
        }

        // Count bookings by date.
        const dateKey = booking.date.toISOString().slice(0, 10);
        dailyBookings[dateKey] = (dailyBookings[dateKey] || 0) + 1;

        // Count bookings by month.
        const monthKey = dateKey.slice(0, 7);
        monthlyBookings[monthKey] =
          (monthlyBookings[monthKey] || 0) + 1;

        // Count bookings by service.
        const serviceName = booking.service?.name || "Unknown service";
        serviceCounts[serviceName] =
          (serviceCounts[serviceName] || 0) + 1;
      });

      const dailyTrend = Object.entries(dailyBookings)
        .map(([date, count]) => ({ date, count }))
        .sort((a, b) => a.date.localeCompare(b.date));

      const monthlyTrend = Object.entries(monthlyBookings)
        .map(([month, count]) => ({ month, count }))
        .sort((a, b) => a.month.localeCompare(b.month));

      const popularServices = Object.entries(serviceCounts)
        .map(([service, count]) => ({ service, count }))
        .sort((a, b) => b.count - a.count);

      return res.status(200).json({
        success: true,
        totalBookings,
        statusCounts,
        dailyTrend,
        monthlyTrend,
        popularServices,
      });
    } catch (error) {
      next(error);
    }
  }
);


module.exports = router;
