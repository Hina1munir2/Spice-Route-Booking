
import { useState } from "react";
import { Link } from "react-router-dom";
import contactImage from "../assets/contact.png";

function Contact() {
  const [form, setForm] = useState({
    name: "",
    email: "",
    message: "",
  });

  const [sent, setSent] = useState(false);

  const handleChange = (e) => {
    setForm({
      ...form,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = (e) => {
    e.preventDefault();

    // Frontend demonstration only.
    // Connect this form to a backend endpoint to send real messages.
    setSent(true);
    setForm({ name: "", email: "", message: "" });
  };

  return (
    <main className="contact-page">
      {/* CONTACT HERO */}
      <section
        className="contact-hero"
        style={{ backgroundImage: `url(${contactImage})` }}
      >
        <div className="contact-hero-content">
          <span className="section-label">WE WOULD LOVE TO HEAR FROM YOU</span>
          <h1>Contact Us</h1>
          <p>
            Have a question, planning a visit, or want to know more?
            Get in touch with the Spice Route team.
          </p>
        </div>
      </section>

      {/* CONTACT CONTENT */}
      <section className="contact-content">
        {/* CONTACT INFORMATION */}
        <div className="contact-information">
          <span className="section-label">GET IN TOUCH</span>
          <h2>Let's Connect</h2>

          <p className="contact-intro">
            Whether you have a question about reservations, our food,
            or your dining experience, we would be happy to hear from you.
          </p>

          <div className="contact-info-list">
            <div className="contact-info-card">
              <span className="contact-info-icon">⌖</span>
              <div>
                <h3>Location</h3>
                <p>Rawalpindi, Pakistan</p>
              </div>
            </div>

            <div className="contact-info-card">
              <span className="contact-info-icon">◷</span>
              <div>
                <h3>Opening Hours</h3>
                <p>Daily, 12 PM – 11 PM</p>
              </div>
            </div>

            <div className="contact-info-card">
              <span className="contact-info-icon">✉</span>
              <div>
                <h3>Reservations</h3>
                <p>
                  Use our online booking page to reserve your table.
                </p>
                <Link to="/booking" className="contact-text-link">
                  Book a Table
                </Link>
              </div>
            </div>
          </div>

          <div className="contact-visit-note">
            <h3>We Look Forward to Welcoming You</h3>
            <p>
              Enjoy traditional flavours, warm hospitality, and
              memorable moments at Spice Route.
            </p>
          </div>
        </div>

        {/* CONTACT FORM */}
        <div className="contact-form-card">
          <span className="section-label">SEND US A MESSAGE</span>
          <h2>Get in Touch</h2>

          {sent && (
            <div className="contact-success" role="status">
              Thank you! Your message has been received in this demo.
              No email has been sent.
            </div>
          )}

          <form onSubmit={handleSubmit} className="contact-form">
            <div className="contact-form-group">
              <label htmlFor="contact-name">Your Name</label>
              <input
                id="contact-name"
                type="text"
                name="name"
                value={form.name}
                onChange={handleChange}
                placeholder="Enter your full name"
                required
                maxLength={100}
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-email">Email Address</label>
              <input
                id="contact-email"
                type="email"
                name="email"
                value={form.email}
                onChange={handleChange}
                placeholder="Enter your email address"
                required
              />
            </div>

            <div className="contact-form-group">
              <label htmlFor="contact-message">Your Message</label>
              <textarea
                id="contact-message"
                name="message"
                value={form.message}
                onChange={handleChange}
                placeholder="How can we help you?"
                rows={5}
                required
                maxLength={1000}
              />
            </div>

            <button type="submit" className="contact-submit-button">
              Send Message
            </button>

            <p className="contact-form-note">
              Please complete all fields before submitting.
            </p>
          </form>
        </div>
      </section>

      {/* RESERVATION BANNER */}
      <section className="contact-reservation-banner">
        <h2>Planning a Visit?</h2>
        <p>
          Let us prepare a memorable dining experience for you.
        </p>
        <Link to="/booking" className="primary-button">
          Reserve Your Table
        </Link>
      </section>

      {/* FOOTER */}
      <footer className="home-footer">
        <span>Spice Route</span>
        <span>•</span>
        <span>Rawalpindi, Pakistan</span>
        <span>•</span>
        <span>Open Daily 12pm – 11pm</span>
        <span>•</span>
        <span>Restaurant Reservations</span>
      </footer>
    </main>
  );
}

export default Contact;
