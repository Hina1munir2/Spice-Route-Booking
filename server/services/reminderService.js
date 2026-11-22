
const cron = require("node-cron");
const { DateTime } = require("luxon");
const Booking = require("../models/Booking");
const { sendBookingReminder } = require("./emailService");

const TIMEZONE = process.env.RESTAURANT_TIMEZONE || "Asia/Karachi";

let isRunning = false;

const processDueReminders = async () => {
  // Prevent overlapping reminder checks in this server process.
  if (isRunning) {
    return;
  }

  isRunning = true;

  try {
    const now = DateTime.now().setZone(TIMEZONE);

    const bookings = await Booking.find({
      status: "confirmed",
      reminderSent: false,
    });

    for (const booking of bookings) {
      // The booking date is stored as UTC midnight.
      const dateString = DateTime.fromJSDate(booking.date, {
        zone: "utc",
      }).toISODate();

      // Combine the stored date and local reservation time.
      const reservationTime = DateTime.fromISO(
        `${dateString}T${booking.slot}`,
        { zone: TIMEZONE }
      );

      if (!reservationTime.isValid) {
        console.error(
          `Invalid reservation date/time for booking ${booking._id}`
        );
        continue;
      }

      // Send only for future reservations within the next 24 hours.
      // Calculate the exact reminder time: 24 hours before the reservation.
const reminderTime = reservationTime.minus({ hours: 24 });

// Skip reminders that are not due yet or reservations that have passed.
if (reminderTime > now || reservationTime <= now) {
  continue;
}

      try {
        await sendBookingReminder(booking);

        // Mark as sent only after Gmail accepts the email.
        await Booking.updateOne(
          {
            _id: booking._id,
            reminderSent: false,
          },
          {
            $set: {
              reminderSent: true,
              reminderSentAt: new Date(),
            },
          }
        );

        console.log(`Reminder sent for booking ${booking._id}`);
      } catch (error) {
        console.error(
          `Failed to send reminder for booking ${booking._id}:`,
          error.message
        );
      }
    }
  } catch (error) {
    console.error("Reminder scheduler error:", error.message);
  } finally {
    isRunning = false;
  }
};

const startReminderScheduler = () => {
  // Check every 15 minutes.
  cron.schedule("*/15 * * * *", processDueReminders, {
    timezone: TIMEZONE,
  });

  console.log(`Reminder scheduler started (${TIMEZONE}).`);

  // Check immediately on server startup.
  processDueReminders();
};

module.exports = {
  startReminderScheduler,
  processDueReminders,
};
