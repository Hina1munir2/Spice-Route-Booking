
const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("../models/Service");
jest.mock("../models/Booking");

const User = require("../models/User");
const Booking = require("../models/Booking");

process.env.JWT_SECRET = "test-jwt-secret";

const app = require("../app");

const staffId = "507f1f77bcf86cd799439011";
const bookingId = "507f1f77bcf86cd799439012";

const staff = {
  _id: staffId,
  name: "Restaurant Staff",
  email: "staff@example.com",
  role: "staff",
};

const booking = {
  _id: bookingId,
  customerName: "Ayesha Khan",
  customerEmail: "ayesha@example.com",
  slot: "19:00",
  status: "confirmed",
};

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

const staffToken = createToken(staffId);

const mockStaffAuthentication = () => {
  User.findById.mockResolvedValue(staff);
};

describe("Staff Booking Management API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockStaffAuthentication();
  });

  test("GET /staff/bookings returns all bookings", async () => {
    Booking.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([booking]),
      }),
    });

    const response = await request(app)
      .get("/staff/bookings")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(1);
    expect(response.body.bookings[0].customerName).toBe("Ayesha Khan");
    expect(Booking.find).toHaveBeenCalledWith({});
  });

  test("GET /staff/bookings filters bookings by date", async () => {
    Booking.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      }),
    });

    const response = await request(app)
      .get("/staff/bookings?date=2026-11-14")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);
    expect(Booking.find).toHaveBeenCalledWith({
      date: new Date("2026-11-14T00:00:00.000Z"),
    });
  });

  test("GET /staff/bookings filters bookings by status", async () => {
    Booking.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([booking]),
      }),
    });

    const response = await request(app)
      .get("/staff/bookings?status=confirmed")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);
    expect(Booking.find).toHaveBeenCalledWith({
      status: "confirmed",
    });
  });

  test("GET /staff/bookings rejects an invalid status", async () => {
    const response = await request(app)
      .get("/staff/bookings?status=unknown")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.find).not.toHaveBeenCalled();
  });

  test("PATCH /staff/bookings/:bookingId/status updates booking status", async () => {
    Booking.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue({
        ...booking,
        status: "completed",
      }),
    });

    const response = await request(app)
      .patch(`/staff/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "completed" });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.booking.status).toBe("completed");

    expect(Booking.findByIdAndUpdate).toHaveBeenCalledWith(
      bookingId,
      { status: "completed" },
      { new: true, runValidators: true }
    );
  });

  test("PATCH /staff/bookings/:bookingId/status rejects an invalid booking ID", async () => {
    const response = await request(app)
      .patch("/staff/bookings/invalid-id/status")
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "completed" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("PATCH /staff/bookings/:bookingId/status rejects an invalid status", async () => {
    const response = await request(app)
      .patch(`/staff/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "unknown" });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.findByIdAndUpdate).not.toHaveBeenCalled();
  });

  test("PATCH /staff/bookings/:bookingId/status returns 404 for a missing booking", async () => {
    Booking.findByIdAndUpdate.mockReturnValue({
      populate: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .patch(`/staff/bookings/${bookingId}/status`)
      .set("Authorization", `Bearer ${staffToken}`)
      .send({ status: "confirmed" });

    expect(response.status).toBe(404);
    expect(response.body.success).toBe(false);
  });

  test("PATCH /staff/bookings/:bookingId/status rejects requests without a token", async () => {
    const response = await request(app)
      .patch(`/staff/bookings/${bookingId}/status`)
      .send({ status: "confirmed" });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });
});
