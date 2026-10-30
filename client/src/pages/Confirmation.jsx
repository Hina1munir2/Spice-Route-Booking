
import { Link, useLocation } from "react-router-dom";

function Confirmation() {
  const location = useLocation();

  const booking = location.state?.booking;
  const service = location.state?.service;

  if (!booking) {
    return (
      <main className="confirmation-page">
        <h1>No booking details found</h1>
        <p>Please make a reservation first.</p>
        <Link to="/booking" className="primary-button">
          Make a Reservation
        </Link>
      </main>
    );
  }

  const formattedDate = new Date(
    `${booking.date.slice(0, 10)}T00:00:00`
  ).toLocaleDateString("en-PK", {
    day: "numeric",
    month: "long",
    year: "numeric",
  });

  return (
    <main className="confirmation-page">
      <div className="confirmation-card">
        <div className="success-icon">✓</div>

        <span className="section-label">SPICE ROUTE RESTAURANT</span>
        <h1>Your Table is Reserved!</h1>

        <p>
          Thank you, {booking.customerName}. We look forward
          to welcoming you and your guests.
        </p>

        <div className="confirmation-details">
          <div>
            <span>Reservation Type</span>
            <strong>{service?.name || "Restaurant Reservation"}</strong>
          </div>

          <div>
            <span>Date</span>
            <strong>{formattedDate}</strong>
          </div>

          <div>
            <span>Time</span>
            <strong>{booking.slot}</strong>
          </div>

          <div>
            <span>Customer</span>
            <strong>{booking.customerName}</strong>
          </div>

          <div>
            <span>Email</span>
            <strong>{booking.customerEmail}</strong>
          </div>
        </div>

        <p className="confirmation-note">
          Your reservation has been successfully recorded.
        </p>

        <Link to="/" className="primary-button">
          Back to Home
        </Link>
      </div>
    </main>
  );
}

export default Confirmation;
