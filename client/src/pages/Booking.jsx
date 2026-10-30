
import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import {
  getServices,
  getAvailableSlots,
  createBooking,
} from "../services/api";
import bookingBackground from "../assets/reservation.png";

function Booking() {
  const navigate = useNavigate();

  const [services, setServices] = useState([]);
  const [serviceId, setServiceId] = useState("");
  const [date, setDate] = useState("");
  const [slots, setSlots] = useState([]);
  const [selectedSlot, setSelectedSlot] = useState("");

  const [customerName, setCustomerName] = useState("");
  const [customerEmail, setCustomerEmail] = useState("");
  const [customerPhone, setCustomerPhone] = useState("");

  const [loadingServices, setLoadingServices] = useState(true);
  const [loadingSlots, setLoadingSlots] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  // Load services from the backend
  useEffect(() => {
    const loadServices = async () => {
      try {
        setLoadingServices(true);
        const data = await getServices();

        setServices(data);

        if (data.length > 0) {
          setServiceId(data[0]._id || data[0].id);
        }
      } catch (err) {
        setError("Unable to load restaurant services.");
      } finally {
        setLoadingServices(false);
      }
    };

    loadServices();
  }, []);

  // Load available slots for the selected service and date
  useEffect(() => {
    setSelectedSlot("");
    setSlots([]);

    if (!date || !serviceId) return;

    const loadSlots = async () => {
      try {
        setLoadingSlots(true);
        setError("");

        const data = await getAvailableSlots(serviceId, date);
        setSlots(data);
      } catch (err) {
        setError(
          err?.response?.data?.message ||
            "Unable to load available time slots."
        );
      } finally {
        setLoadingSlots(false);
      }
    };

    loadSlots();
  }, [date, serviceId]);

  // Submit booking to the backend
  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (
      !serviceId ||
      !date ||
      !selectedSlot ||
      !customerName.trim() ||
      !customerEmail.trim() ||
      !customerPhone.trim()
    ) {
      setError("Please complete all required fields.");
      return;
    }

    try {
      setSubmitting(true);

      const response = await createBooking({
        service: serviceId,
        date,
        slot: selectedSlot,
        customerName: customerName.trim(),
        customerEmail: customerEmail.trim(),
        customerPhone: customerPhone.trim(),
      });

      const booking = response.booking || response;

      const selectedService = services.find(
        (service) => (service._id || service.id) === serviceId
      );

      navigate("/confirmation", {
        state: {
          booking,
          service: selectedService,
        },
      });
    } catch (err) {
      setError(
        err?.response?.data?.message ||
          "Your reservation could not be completed. Please try again."
      );
    } finally {
      setSubmitting(false);
    }
  };

  const selectedService = services.find(
    (service) => (service._id || service.id) === serviceId
  );

  return (
    <main
      className="booking-page"
      style={{ backgroundImage: `url(${bookingBackground})` }}
    >
      <div className="booking-overlay"></div>

      <section className="booking-container">
        <div className="booking-content">
          <div className="booking-heading">
            <span className="section-label">A TABLE AWAITS YOU</span>
            <h1>Reserve Your Table</h1>
            <p>
              Book your dining experience at Spice Route — warm flavours,
              timeless hospitality.
            </p>
          </div>

          {error && (
            <div className="booking-error" role="alert">
              {error}
            </div>
          )}

          <form onSubmit={handleSubmit} className="booking-form">
            {/* Reservation Details */}
            <div className="booking-column">
              <div className="booking-panel">
                <h2>Your Reservation</h2>

                <div className="booking-field">
                  <label htmlFor="booking-service">
                    Restaurant Service *
                  </label>

                  <select
                    id="booking-service"
                    value={serviceId}
                    onChange={(e) => setServiceId(e.target.value)}
                    required
                    disabled={loadingServices || services.length === 0}
                  >
                    {loadingServices ? (
                      <option value="">Loading services...</option>
                    ) : services.length === 0 ? (
                      <option value="">No services available</option>
                    ) : (
                      services.map((service) => (
                        <option
                          key={service._id || service.id}
                          value={service._id || service.id}
                        >
                          {service.name}
                        </option>
                      ))
                    )}
                  </select>
                </div>

                {selectedService && (
                  <div className="selected-service-details">
                    <p>
                      <span>Service</span>
                      <strong>{selectedService.name}</strong>
                    </p>
                    <p>
                      <span>Duration</span>
                      <strong>{selectedService.duration} minutes</strong>
                    </p>
                    <p>
                      <span>Price</span>
                      <strong>PKR {selectedService.price}</strong>
                    </p>
                  </div>
                )}

                <div className="booking-field">
                  <label htmlFor="booking-date">Reservation Date *</label>
                  <input
                    id="booking-date"
                    type="date"
                    value={date}
                    min={new Date().toISOString().split("T")[0]}
                    onChange={(e) => setDate(e.target.value)}
                    required
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor="booking-time">Available Time Slot *</label>
                  <select
                    id="booking-time"
                    value={selectedSlot}
                    onChange={(e) => setSelectedSlot(e.target.value)}
                    required
                    disabled={!date || loadingSlots || slots.length === 0}
                  >
                    <option value="">
                      {!date
                        ? "Select a date first"
                        : loadingSlots
                          ? "Loading available slots..."
                          : slots.length === 0
                            ? "No slots available"
                            : "Select a time slot"}
                    </option>

                    {slots.map((slot) => (
                      <option key={slot} value={slot}>
                        {slot}
                      </option>
                    ))}
                  </select>
                </div>
              </div>
            </div>

            {/* Customer Information */}
            <div className="booking-column">
              <div className="booking-panel">
                <h2>Your Information</h2>

                <div className="booking-field">
                  <label htmlFor="customer-name">Full Name *</label>
                  <input
                    id="customer-name"
                    type="text"
                    value={customerName}
                    onChange={(e) => setCustomerName(e.target.value)}
                    placeholder="Enter your full name"
                    required
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor="customer-email">Email Address *</label>
                  <input
                    id="customer-email"
                    type="email"
                    value={customerEmail}
                    onChange={(e) => setCustomerEmail(e.target.value)}
                    placeholder="Enter your email address"
                    required
                  />
                </div>

                <div className="booking-field">
                  <label htmlFor="customer-phone">Phone Number *</label>
                  <input
                    id="customer-phone"
                    type="tel"
                    value={customerPhone}
                    onChange={(e) => setCustomerPhone(e.target.value)}
                    placeholder="Enter your phone number"
                    required
                  />
                </div>
              </div>
            </div>

            {/* Submit Reservation */}
            <div className="booking-submit-section">
              <button
                type="submit"
                className="booking-submit-button"
                disabled={
                  submitting ||
                  loadingServices ||
                  loadingSlots ||
                  !selectedSlot
                }
              >
                {submitting
                  ? "Confirming Reservation..."
                  : "Confirm Reservation"}
              </button>

              <p>
                Opening Hours: 12:00 PM – 11:00 PM
                <span>•</span>
                Rawalpindi, Pakistan
              </p>
            </div>
          </form>
        </div>
      </section>
    </main>
  );
}

export default Booking;
