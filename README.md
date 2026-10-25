TASK 1
# Spice Route Restaurant Booking API

A REST API built with Node.js, Express.js, MongoDB, and Mongoose for managing restaurant services and customer bookings at Spice Route Restaurant.

This project is the foundation for an online booking platform designed for a family restaurant. It provides service listings, booking creation, input validation, and protection against duplicate reservations.

## Requirements

- Node.js
- npm
- MongoDB Atlas or a local MongoDB server
- Postman (optional, for manual API testing)

## Project Structure
text
Spice-Route-Booking/
├── README.md
└── server/
    ├── app.js
    ├── server.js
    ├── models/
    │   ├── Service.js
    │   └── Booking.js
    ├── routes/
    │   └── index.js
    ├── tests/
    │   └── api.test.js
    ├── .env
    ├── .gitignore
    ├── package.json
    └── package-lock.json


## Setup and Installation

### 1. Clone the repository
git clone YOUR_GITHUB_REPOSITORY_URL
cd Spice-Route-Booking
Replace `YOUR_GITHUB_REPOSITORY_URL` with your actual GitHub repository URL.

### 2. Install dependencies
Open a terminal in the `server` directory:
cd server
npm install

### 3. Configure environment variables

Create a file named `.env` inside the `server` directory:
PORT=5000
MONGODB_URI=your_mongodb_connection_string
Replace `your_mongodb_connection_string` with your MongoDB Atlas connection string or local MongoDB connection string.

**Security:** Never commit the `.env` file or expose your database credentials. The file is excluded through `.gitignore`.

### 4. Start the development server

From the `server` directory, run:
npm run dev
When the database connection succeeds, the terminal should display messages similar to:
MongoDB connected successfully.
Server running on port 5000

The API is available at:

`http://localhost:5000`

### 5. Verify the server

Open the following URL in your browser or API client:

`GET http://localhost:5000/`

The root endpoint returns the API status and whether the database is connected.

## API Endpoints

### 1. Get all services

**Endpoint:** `GET /services`

Returns the available restaurant services, including their names, durations, prices, and configured time slots.

**Example response:**
{
  "success": true,
  "count": 1,
  "services": [
    {
      "_id": "6adb1a9a65a837afb7bba721",
      "name": "Dinner Reservation",
      "duration": 120,
      "price": 2500,
      "availableSlots": [
        "18:00",
        "18:30",
        "19:00",
        "19:30",
        "20:00"
      ]
    }
  ]
}
```

The service ID above is an example from development data. Use the actual ID returned by your API when creating a booking.

### 2. Create a booking

**Endpoint:** `POST /bookings`

Creates a reservation for an existing service, date, and available time slot.

**Example request body:**

```json
{
  "service": "REPLACE_WITH_ACTUAL_SERVICE_ID",
  "date": "2026-11-01",
  "slot": "18:30",
  "customerName": "Ayesha Khan",
  "customerEmail": "ayesha@example.com",
  "customerPhone": "+923001234567"
}
```

Replace the service ID placeholder with a real service ID returned by `GET /services`.

**Successful response:** `201 Created`

The response contains a success indicator and the created booking.

### Validation and error responses

| HTTP status | Meaning |
|---|---|
| `201 Created` | Booking created successfully |
| `400 Bad Request` | Required fields are missing or input is invalid, or the requested slot is unavailable |
| `404 Not Found` | Requested API endpoint does not exist |
| `409 Conflict` | A booking already exists for the same service, date, and slot |
| `500 Internal Server Error` | Unexpected server error |

The API validates required booking fields, date format, service ID, customer email and phone, and whether the requested slot is configured for the selected service.

A unique compound index on service, date, and slot provides database-level protection against duplicate reservations.

## MongoDB Data Models

### Service

The Service model stores the restaurant services that customers can book.

Fields:

- `name`: service name; required.
- `duration`: service duration in minutes; must be positive.
- `price`: service price; must not be negative.
- `availableSlots`: list of configured booking times in 24-hour `HH:mm` format.
- `timestamps`: automatically records creation and update times.

**Example service:**

```json
{
  "name": "Dinner Reservation",
  "duration": 120,
  "price": 2500,
  "availableSlots": [
    "18:00",
    "18:30",
    "19:00",
    "19:30",
    "20:00"
  ]
}
```

### Booking

The Booking model stores customer reservation details.

Fields:

- `service`: reference to the selected Service document.
- `date`: reservation date.
- `slot`: requested booking time.
- `customerName`: customer's name.
- `customerEmail`: customer's email address, stored in lowercase.
- `customerPhone`: customer's contact number.
- `timestamps`: automatically records creation and update times.

A compound unique index on `{ service, date, slot }` prevents two bookings from using the same slot for the same service and date.

## Sample Data

The development database contains a sample service named **Dinner Reservation**, with a duration of 120 minutes, a price of 2500, and configured evening slots.

The price is stored as a numeric value. Its currency is not currently specified by the API.

Additional services, such as family dinner packages or birthday celebration reservations, can be added as the project develops.

## Automated Testing

The project uses **Jest** and **Supertest** to test the Express API.

From the `server` directory, run:

```bash
npm test
```

The current automated test suite covers:

1. `GET /services` returns the service list.
2. `POST /bookings` rejects requests with missing required fields.
3. `POST /bookings` rejects unavailable time slots.
4. `POST /bookings` returns `409 Conflict` for duplicate bookings.

**Latest test result:** All 4 tests passed in the local test run.

The automated tests mock the Mongoose models, so they test API behavior without creating or changing real MongoDB bookings. Manual testing against the connected database should also be performed to verify database integration.

## Design Decision and Trade-off

**Decision: Store services and bookings in separate MongoDB collections and reference services from bookings.**

Each booking stores a reference to its selected service instead of duplicating all service information inside the booking document.

**Reason:** Multiple customers can book the same type of service. Keeping service details separate makes them easier to manage and avoids repeating the same information in every booking.

**Trade-off:** Retrieving booking information together with service details may require an additional database query or Mongoose `populate()` operation.

A second important decision is the unique compound index on service, date, and slot. It prevents duplicate reservations at the database level, but the current model does not account for restaurant-wide seating capacity or multiple tables that could share a time slot.

## Current Limitations and Future Improvements

The current API is an initial backend foundation. It does not yet include:

- User authentication and authorization.
- Online payments or payment confirmation.
- Restaurant-wide table and seating capacity management.
- Advanced availability calculations based on existing bookings.
- Booking cancellation and rescheduling endpoints.
- A customer-facing frontend.

These features can be introduced in subsequent project tasks.

## Security Notes

- Keep MongoDB credentials in environment variables.
- Do not commit `.env` or other secret files.
- Validate all incoming booking data.
- Use the unique database index to protect against duplicate reservations.
- Review authentication, authorization, rate limiting, and other production security requirements before deploying the API publicly.

## Author and Project Purpose

This project was developed as Task 1 of the Spice Route Restaurant online booking platform internship project. The objective is to establish a maintainable Express API and MongoDB data model that future tasks can extend.
