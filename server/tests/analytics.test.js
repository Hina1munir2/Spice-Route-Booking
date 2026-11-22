
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

const staff = {
  _id: staffId,
  name: "Restaurant Staff",
  email: "staff@example.com",
  role: "staff",
};

const createToken = () =>
  jwt.sign({ id: staffId }, process.env.JWT_SECRET, {
    expiresIn: "1h",
  });

const staffToken = createToken();

const createBooking = (date, status, serviceName) => ({
  date: new Date(`${date}T00:00:00.000Z`),
  status,
  service: { name: serviceName },
});

describe("Staff Booking Analytics API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
    User.findById.mockResolvedValue(staff);
  });

  test("returns booking totals, status counts, trends, and popular services", async () => {
    const bookings = [
      createBooking("2026-11-20", "confirmed", "Dinner Reservation"),
      createBooking("2026-11-20", "pending", "Lunch Reservation"),
      createBooking("2026-11-21", "confirmed", "Dinner Reservation"),
      createBooking("2026-11-21", "completed", "Lunch Reservation"),
      createBooking("2026-11-22", "cancelled", "Dinner Reservation"),
    ];

    Booking.find.mockReturnValue({
      setOptions: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue(bookings),
    });

    const response = await request(app)
      .get("/staff/analytics")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.totalBookings).toBe(5);

    expect(response.body.statusCounts).toEqual({
      pending: 1,
      confirmed: 2,
      completed: 1,
      cancelled: 1,
    });

    expect(response.body.dailyTrend).toHaveLength(3);
    expect(response.body.monthlyTrend).toEqual([
      { month: "2026-11", count: 5 },
    ]);

    expect(response.body.popularServices).toEqual([
      { service: "Dinner Reservation", count: 3 },
      { service: "Lunch Reservation", count: 2 },
    ]);
  });

  test("filters analytics by a valid date range", async () => {
    Booking.find.mockReturnValue({
      setOptions: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    });

    const response = await request(app)
      .get("/staff/analytics?startDate=2026-11-01&endDate=2026-11-30")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);

   expect(Booking.find).toHaveBeenCalledWith(
  {
    date: {
      $gte: new Date("2026-11-01T00:00:00.000Z"),
      $lte: new Date("2026-11-30T00:00:00.000Z"),
    },
  },
  null,
  { sanitizeFilter: false }
);
  });

  test("rejects an invalid start date format", async () => {
    const response = await request(app)
      .get("/staff/analytics?startDate=20-11-2026")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.find).not.toHaveBeenCalled();
  });

  test("rejects an invalid calendar date", async () => {
    const response = await request(app)
      .get("/staff/analytics?startDate=2026-02-30")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.find).not.toHaveBeenCalled();
  });

  test("rejects a start date later than the end date", async () => {
    const response = await request(app)
      .get("/staff/analytics?startDate=2026-11-30&endDate=2026-11-01")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(Booking.find).not.toHaveBeenCalled();
  });

  test("returns empty analytics when no bookings exist", async () => {
    Booking.find.mockReturnValue({
      setOptions: jest.fn().mockReturnThis(),
      populate: jest.fn().mockResolvedValue([]),
    });

    const response = await request(app)
      .get("/staff/analytics")
      .set("Authorization", `Bearer ${staffToken}`);

    expect(response.status).toBe(200);
    expect(response.body.totalBookings).toBe(0);

    expect(response.body.statusCounts).toEqual({
      pending: 0,
      confirmed: 0,
      completed: 0,
      cancelled: 0,
    });

    expect(response.body.dailyTrend).toEqual([]);
    expect(response.body.monthlyTrend).toEqual([]);
    expect(response.body.popularServices).toEqual([]);
  });

  test("rejects requests without an authentication token", async () => {
    const response = await request(app).get("/staff/analytics");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
    expect(Booking.find).not.toHaveBeenCalled();
  });
});
