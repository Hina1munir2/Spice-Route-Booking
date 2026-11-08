
const request = require("supertest");
const jwt = require("jsonwebtoken");

jest.mock("../models/User");
jest.mock("../models/Service");
jest.mock("../models/Booking");

const User = require("../models/User");
const Booking = require("../models/Booking");

process.env.JWT_SECRET = "test-jwt-secret";

const app = require("../app");

const customer = {
  _id: "customer-123",
  name: "Ayesha Khan",
  email: "ayesha@example.com",
  role: "customer",
};

const staff = {
  _id: "staff-123",
  name: "Restaurant Staff",
  email: "staff@example.com",
  role: "staff",
};

const createToken = (id) =>
  jwt.sign({ id }, process.env.JWT_SECRET, { expiresIn: "1h" });

describe("Spice Route Authentication API", () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  // CUSTOMER REGISTRATION

  test("POST /auth/register creates a customer account", async () => {
    User.findOne.mockResolvedValue(null);
    User.create.mockResolvedValue(customer);

    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Ayesha Khan",
        email: " AYESHA@example.com ",
        password: "Ayesha123!",
        role: "staff",
      });

    expect(response.status).toBe(201);
    expect(response.body.success).toBe(true);
    expect(response.body.user.role).toBe("customer");
    expect(response.body.token).toBeDefined();

    expect(User.create).toHaveBeenCalledWith({
      name: "Ayesha Khan",
      email: "ayesha@example.com",
      password: "Ayesha123!",
      role: "customer",
    });

    const decoded = jwt.verify(
      response.body.token,
      process.env.JWT_SECRET
    );

    expect(decoded.id).toBe(customer._id);
  });

  test("POST /auth/register rejects missing fields", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Ayesha Khan",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(User.create).not.toHaveBeenCalled();
  });

  test("POST /auth/register rejects a short password", async () => {
    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Ayesha Khan",
        email: "ayesha@example.com",
        password: "12345",
      });

    expect(response.status).toBe(400);
    expect(response.body.success).toBe(false);
    expect(User.create).not.toHaveBeenCalled();
  });

  test("POST /auth/register rejects an existing email", async () => {
    User.findOne.mockResolvedValue(customer);

    const response = await request(app)
      .post("/auth/register")
      .send({
        name: "Ayesha Khan",
        email: "ayesha@example.com",
        password: "Ayesha123!",
      });

    expect(response.status).toBe(409);
    expect(response.body.success).toBe(false);
    expect(User.create).not.toHaveBeenCalled();
  });

  // CUSTOMER AND STAFF LOGIN

  test("POST /auth/login logs in a customer successfully", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        ...customer,
        comparePassword: jest.fn().mockResolvedValue(true),
      }),
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: " AYESHA@example.com ",
        password: "Ayesha123!",
      });

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.role).toBe("customer");
    expect(response.body.token).toBeDefined();

    expect(User.findOne).toHaveBeenCalledWith({
      email: "ayesha@example.com",
    });
  });

  test("POST /auth/login logs in a staff member successfully", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        ...staff,
        comparePassword: jest.fn().mockResolvedValue(true),
      }),
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "staff@example.com",
        password: "Staff123!",
      });

    expect(response.status).toBe(200);
    expect(response.body.user.role).toBe("staff");
    expect(response.body.token).toBeDefined();
  });

  test("POST /auth/login rejects incorrect credentials", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue({
        ...customer,
        comparePassword: jest.fn().mockResolvedValue(false),
      }),
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "ayesha@example.com",
        password: "WrongPassword",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("POST /auth/login rejects an unknown email", async () => {
    User.findOne.mockReturnValue({
      select: jest.fn().mockResolvedValue(null),
    });

    const response = await request(app)
      .post("/auth/login")
      .send({
        email: "unknown@example.com",
        password: "Password123!",
      });

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  // PROTECTED PROFILE

  test("GET /auth/me rejects requests without a token", async () => {
    const response = await request(app).get("/auth/me");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("GET /auth/me returns the authenticated user's profile", async () => {
    User.findById.mockResolvedValue(customer);

    const response = await request(app)
      .get("/auth/me")
      .set("Authorization", `Bearer ${createToken(customer._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.user.email).toBe(customer.email);
    expect(response.body.user.role).toBe("customer");
  });

  // STAFF AUTHORIZATION

  test("GET /staff/bookings rejects requests without a token", async () => {
    const response = await request(app).get("/staff/bookings");

    expect(response.status).toBe(401);
    expect(response.body.success).toBe(false);
  });

  test("GET /staff/bookings blocks customer accounts", async () => {
    User.findById.mockResolvedValue(customer);

    const response = await request(app)
      .get("/staff/bookings")
      .set("Authorization", `Bearer ${createToken(customer._id)}`);

    expect(response.status).toBe(403);
    expect(response.body.success).toBe(false);
    expect(Booking.find).not.toHaveBeenCalled();
  });

  test("GET /staff/bookings allows staff accounts", async () => {
    User.findById.mockResolvedValue(staff);

    Booking.find.mockReturnValue({
      populate: jest.fn().mockReturnValue({
        sort: jest.fn().mockResolvedValue([]),
      }),
    });

    const response = await request(app)
      .get("/staff/bookings")
      .set("Authorization", `Bearer ${createToken(staff._id)}`);

    expect(response.status).toBe(200);
    expect(response.body.success).toBe(true);
    expect(response.body.count).toBe(0);
  });
});
