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

 

# TASK 2 – React Booking Flow with Available Slots

## Project Overview

Task 2 extends the Spice Route Restaurant Booking API developed in Task 1 by adding a React-based customer booking interface.

The frontend allows customers to view restaurant services, select a reservation date, check available time slots, enter their details, and submit a booking. After a successful reservation, customers are redirected to a confirmation page displaying their booking information.

The application uses React for the frontend and the existing Express.js and MongoDB backend for booking management.

## Technologies Used

**Frontend**
- React
- Vite
- React Router DOM
- Axios
- CSS

**Backend**
- Node.js
- Express.js
- MongoDB
- Mongoose

**Testing**
- Jest
- Supertest

## Task 2 Features

### 1. Restaurant Homepage

- Displays Spice Route Restaurant branding and introduction.
- Provides navigation to the Menu, About, Contact, and Booking pages.
- Includes links that allow customers to start the reservation process.

### 2. Menu Page

- Displays restaurant dishes organized into categories.
- Includes dish names, descriptions, prices, and images.
- Provides a reservation link so customers can proceed to booking.

### 3. Booking Page

Customers can:

1. View available restaurant services.
2. Select a service.
3. Choose a reservation date.
4. View available time slots for the selected date.
5. Select an available time.
6. Enter their name, email address, and phone number.
7. Submit their reservation.

The booking form validates required information before submitting the request to the backend.

### 4. Date-Based Slot Availability

The frontend requests available slots from the backend whenever the selected date or service changes.

**API Endpoint:**

`GET /services/:serviceId/availability?date=YYYY-MM-DD`

The backend checks existing bookings and returns the slots that are still available for the selected service and date.

This prevents the frontend from simply displaying a fixed list of slots without considering existing reservations.

### 5. Booking Confirmation

After a successful booking:

- The customer is redirected to the confirmation page.
- The page displays the customer's name, selected service, reservation date, time, and email address.
- A success message confirms that the booking was created.

## Frontend Project Structure
client/
├── public/
│   └── images/
├── src/
│   ├── assets/
│   ├── components/
│   │   └── Navbar.jsx
│   ├── pages/
│   │   ├── Home.jsx
│   │   ├── Menu.jsx
│   │   ├── About.jsx
│   │   ├── Contact.jsx
│   │   ├── Booking.jsx
│   │   └── Confirmation.jsx
│   ├── services/
│   │   └── api.js
│   ├── App.jsx
│   ├── App.css
│   ├── index.css
│   └── main.jsx
├── package.json
└── package-lock.json

## Setup and Running the Application

Task 1 backend setup and MongoDB environment configuration remain the same.

### 1. Start the Backend

Open a terminal in the project directory:
cd server
npm install
npm run dev

The backend runs at:

`http://localhost:5000`

Make sure the MongoDB connection is configured correctly in `server/.env`.

### 2. Start the React Frontend

Open a second terminal in the project directory:
cd client
npm install
npm run dev


Vite normally starts the frontend at:

`http://localhost:5173`

Open this address in your browser to use the application.

Keep both the backend and frontend terminals running while testing.

**Note:** The backend CORS configuration must allow the frontend development origin (`http://localhost:5173`) so that the React application can communicate with the API.

## Booking API Endpoints

Task 2 builds on the existing Task 1 endpoints.

| Method | Endpoint | Purpose |
|---|---|---|
| GET | `/services` | Retrieves restaurant services |
| GET | `/services/:serviceId/availability?date=YYYY-MM-DD` | Retrieves available slots for a selected service and date |
| POST | `/bookings` | Creates a customer reservation |

### Example Availability Request

```http
GET /services/6adb1a9a65a837afb7bba721/availability?date=2026-11-01
```

The response provides the available time slots for that service and date.

### Example Booking Request
{
  "service": "6adb1a9a65a837afb7bba721",
  "date": "2026-11-01",
  "slot": "18:30",
  "customerName": "Ayesha Khan",
  "customerEmail": "ayesha@example.com",
  "customerPhone": "+923001234567"
}
```

The service ID must be replaced with an actual ID returned by the services endpoint. The example date and slot are illustrative; availability must be checked before booking.

## Input Validation and Error Handling

The booking flow handles invalid or incomplete information to prevent unsuccessful submissions.

Examples include:

- Empty required fields are rejected with a clear validation message.
- Invalid email addresses are rejected.
- Invalid dates and service IDs are handled by the backend.
- Slots that are not configured or are already booked cannot be reserved.
- Duplicate reservations are rejected by the backend.
- API errors are handled so that the application can display an appropriate message instead of crashing.

The backend remains responsible for the final validation and booking creation. Frontend validation alone is not relied upon to prevent invalid reservations.

## Testing

### Automated Backend Tests

The backend uses Jest and Supertest.

Run the tests from the `server` directory:

```bash
npm test
```

The current test suite covers the main API operations, including:

1. Retrieving restaurant services.
2. Creating a valid booking.
3. Rejecting bookings with missing required fields.
4. Rejecting unavailable time slots.
5. Preventing duplicate bookings.
6. Retrieving available slots for a valid service and date.
7. Handling invalid dates.
8. Handling an unknown service.

**Latest recorded test result:** 8 backend tests passed in the local test run.

### Manual Frontend Test Plan

| Test scenario | Expected result |
|---|---|
| Open the homepage | Homepage loads successfully |
| Open the booking page | Booking form is displayed |
| Load restaurant services | Available services are displayed |
| Select a date | Available slots are requested for that date |
| Select an available slot and enter valid details | Booking is submitted successfully |
| Complete a successful booking | Confirmation page displays booking details |
| Submit the form with empty required fields | Clear validation messages appear |
| Select a date with a previously booked slot | That slot is not shown as available |
| Select another date | Availability refreshes for the new date |

The manual test plan covers both the successful customer journey and important failure cases.

## Design Decision and Trade-off

**Decision: Retrieve available time slots from the backend based on the selected service and reservation date.**

Instead of maintaining a fixed list of available slots in the React frontend, the application requests availability from the backend whenever the customer changes the selected service or date.

**Reason:**

A restaurant's available slots can change when customers make reservations. Retrieving availability from the backend allows the application to consider existing bookings and display more accurate availability.

**Trade-off:**

This approach requires additional API requests whenever the selected service or date changes. It also depends on the backend being available. However, it keeps the booking information centralized and reduces the risk of displaying already-booked slots.

The backend also validates the requested slot when a booking is submitted, providing another layer of protection against duplicate reservations.

## Task 2 Outcome

Task 2 extends the original backend API into a customer-facing restaurant booking application.

The completed workflow connects the React frontend with the Express and MongoDB backend, allowing customers to view services, check date-based availability, submit reservations, and view booking confirmations.

The project provides a foundation for future improvements such as table capacity management, booking cancellation, customer authentication, and online payments.

