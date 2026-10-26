const request = require("supertest");

jest.mock("../models/Service");
jest.mock("../models/Booking");

const Service = require("../models/Service");
const Booking = require("../models/Booking");
const app = require("../app");

describe("Spice Route Booking API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  test("GET /services returns the list of services", async () => {
    const sampleServices = [
      {
        _id: "6adb1a9a65a837afb7bba721",
        name: "Dinner Reservation",
        duration: 120,
        price: 2500,
        availableSlots: ["18:00", "18:30", "19:00"],
      },
    ];

    Service.find.mockReturnValue({
      sort: jest.fn().mockResolvedValue(sampleServices),
    });

    const response = await request(app).get("/services");

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.services[0].name).toBe("Dinner Reservation");
  });

  test("POST /bookings creates a booking successfully", async () => {
    const serviceId = "6adb1a9a65a837afb7bba721";

    Service.findById.mockResolvedValue({
      _id: serviceId,
      name: "Dinner Reservation",
      availableSlots: ["18:00", "18:30", "19:00"],
    });

    const bookingData = {
      service: serviceId,
      date: "2026-11-15",
      slot: "18:00",
      customerName: "Ayesha Khan",
      customerEmail: "ayesha@example.com",
      customerPhone: "03001234567",
    };

    Booking.create.mockResolvedValue({
      _id: "6adb1a9a65a837afb7bba722",
      ...bookingData,
    });

    const response = await request(app)
      .post("/bookings")
      .send(bookingData);

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(Booking.create).toHaveBeenCalledTimes(1);

const createdBooking = Booking.create.mock.calls[0][0];

expect(createdBooking).toMatchObject({
  service: bookingData.service,
  slot: bookingData.slot,
  customerName: bookingData.customerName,
  customerEmail: bookingData.customerEmail,
  customerPhone: bookingData.customerPhone,
});

expect(createdBooking.date).toEqual(
  new Date("2026-11-15T00:00:00.000Z")
);
  });

  test("POST /bookings rejects missing required fields", async () => {
    const response = await request(app)
      .post("/bookings")
      .send({
        service: "6adb1a9a65a837afb7bba721",
        date: "2026-11-15",
        slot: "18:00",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.create).not.toHaveBeenCalled();
  });

  test("POST /bookings rejects an unavailable time slot", async () => {
    Service.findById.mockResolvedValue({
      _id: "6adb1a9a65a837afb7bba721",
      name: "Dinner Reservation",
      availableSlots: ["18:00", "18:30", "19:00"],
    });

    const response = await request(app)
      .post("/bookings")
      .send({
        service: "6adb1a9a65a837afb7bba721",
        date: "2026-11-15",
        slot: "21:00",
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "03001234567",
      });

    expect(response.status).toBe(400);
    expect(Booking.create).not.toHaveBeenCalled();
  });

  test("POST /bookings returns 409 for a duplicate booking", async () => {
    Service.findById.mockResolvedValue({
      _id: "6adb1a9a65a837afb7bba721",
      name: "Dinner Reservation",
      availableSlots: ["18:00", "18:30", "19:00"],
    });

    const duplicateError = new Error("Duplicate booking");
    duplicateError.code = 11000;
    Booking.create.mockRejectedValue(duplicateError);

    const response = await request(app)
      .post("/bookings")
      .send({
        service: "6adb1a9a65a837afb7bba721",
        date: "2026-11-15",
        slot: "18:00",
        customerName: "Test Customer",
        customerEmail: "test@example.com",
        customerPhone: "03001234567",
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(response.body.message).toBe(
      "This service is already booked for that date and slot."
    );
  });
});
