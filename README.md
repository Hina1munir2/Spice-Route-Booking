
# Spice Route Restaurant Booking API

A REST API built with Express.js and MongoDB using Mongoose.

## Requirements

- Node.js
- MongoDB Atlas or a local MongoDB server
- npm

## Setup

1. Open a terminal in the `server` directory.
2. Install dependencies:

   ```bash
   npm install
   ```

3. Create a `server/.env` file:

   ```env
   PORT=5000
   MONGODB_URI=your_mongodb_connection_string
   ```

   Replace the placeholder with your connection string. Do not commit `.env`.

4. Start the development server:

   ```bash
   npm run dev
   ```

## Endpoints

### GET /services

Returns all services.

### POST /bookings

Creates a booking. Example JSON body:

```json
{
  "service": "REPLACE_WITH_SERVICE_ID",
  "date": "2026-11-01",
  "slot": "18:30",
  "customerName": "Ayesha Khan",
  "customerEmail": "ayesha@example.com",
  "customerPhone": "+923001234567"
}
```

The service ID must refer to an existing service, and the slot must be listed in that service's `availableSlots`.

A successful request returns `201 Created`. Invalid input returns `400 Bad Request`. A duplicate service/date/slot booking returns `409 Conflict`.

## Data models

- **Service:** name, duration, price, availableSlots
- **Booking:** service reference, date, slot, customer details

Bookings have a unique compound index on service, date, and slot to prevent duplicate reservations.

## Notes

The API currently checks whether a slot is configured for a service. It does not yet implement authentication, payment processing, or broader restaurant-wide capacity management.
