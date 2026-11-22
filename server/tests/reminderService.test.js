
jest.mock("../models/Booking");
jest.mock("../services/emailService");

const Booking = require("../models/Booking");
const { sendBookingReminder } = require("../services/emailService");
const { processDueReminders } = require("../services/reminderService");
const { DateTime } = require("luxon");

describe("Booking Reminder Service", () => {
  const now = DateTime.now().setZone("Asia/Karachi");

  const createBooking = (hoursFromNow, overrides = {}) => {
    const reservation = now.plus({ hours: hoursFromNow });

    return {
      _id: "507f1f77bcf86cd799439011",
      date: new Date(`${reservation.toISODate()}T00:00:00.000Z`),
      slot: reservation.toFormat("HH:mm"),
      customerName: "Ayesha Khan",
      customerEmail: "ayesha@example.com",
      status: "confirmed",
      reminderSent: false,
      ...overrides,
    };
  };

  beforeEach(() => {
    jest.clearAllMocks();
    process.env.RESTAURANT_TIMEZONE = "Asia/Karachi";
    sendBookingReminder.mockResolvedValue({ messageId: "test-message" });
    Booking.updateOne.mockResolvedValue({ modifiedCount: 1 });
  });

test("sends a catch-up reminder when a confirmed booking is less than 24 hours away", async () => {
    const booking = createBooking(12);
    Booking.find.mockResolvedValue([booking]);

    await processDueReminders();

    expect(sendBookingReminder).toHaveBeenCalledWith(booking);
    expect(Booking.updateOne).toHaveBeenCalledWith(
      {
        _id: booking._id,
        reminderSent: false,
      },
      {
        $set: {
          reminderSent: true,
          reminderSentAt: expect.any(Date),
        },
      }
    );
  });

    test("sends a reminder when the 24-hour reminder time has arrived", async () => {
    // The reservation is 23 hours and 45 minutes away.
    const booking = createBooking(23.75);
    Booking.find.mockResolvedValue([booking]);

    await processDueReminders();

    expect(sendBookingReminder).toHaveBeenCalledWith(booking);
    expect(Booking.updateOne).toHaveBeenCalled();
  });
  
  test("does not send a reminder for a booking more than 24 hours away", async () => {
    Booking.find.mockResolvedValue([createBooking(30)]);

    await processDueReminders();

    expect(sendBookingReminder).not.toHaveBeenCalled();
    expect(Booking.updateOne).not.toHaveBeenCalled();
  });

  test("does not send a reminder for a past booking", async () => {
    Booking.find.mockResolvedValue([createBooking(-2)]);

    await processDueReminders();

    expect(sendBookingReminder).not.toHaveBeenCalled();
    expect(Booking.updateOne).not.toHaveBeenCalled();
  });

  test("does not send a reminder for an already reminded booking", async () => {
    // The database query itself excludes bookings with reminderSent=true.
    Booking.find.mockResolvedValue([]);

    await processDueReminders();

    expect(Booking.find).toHaveBeenCalledWith({
      status: "confirmed",
      reminderSent: false,
    });
    expect(sendBookingReminder).not.toHaveBeenCalled();
  });

  test("does not mark a reminder as sent when email delivery fails", async () => {
    const booking = createBooking(12);
    Booking.find.mockResolvedValue([booking]);
    sendBookingReminder.mockRejectedValue(
      new Error("Gmail delivery failed")
    );

    await processDueReminders();

    expect(sendBookingReminder).toHaveBeenCalledWith(booking);
    expect(Booking.updateOne).not.toHaveBeenCalled();
  });

  test("handles database errors without crashing the scheduler", async () => {
    Booking.find.mockRejectedValue(new Error("Database unavailable"));

    await expect(processDueReminders()).resolves.toBeUndefined();

    expect(sendBookingReminder).not.toHaveBeenCalled();
  });
});
