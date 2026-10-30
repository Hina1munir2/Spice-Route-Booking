
import { Link } from "react-router-dom";
import aboutBackground from "../assets/about.png";
import storyImage from "../assets/aboutstory.png";
import heroImage from "../assets/hero.png";

function About() {
  const features = [
    "Hand-Ground Spices",
    "Traditional Tandoor",
    "Time-Honored Recipes",
  ];

  return (
    <main className="about-page">
      {/* ABOUT HERO */}
      <section
        className="about-hero"
        style={{ backgroundImage: `url(${aboutBackground})` }}
      >
        <div className="about-hero-content">
          <span className="section-label">DISCOVER SPICE ROUTE</span>
          <h1>Our Story, Our Passion, Our Flavours</h1>
          <p>
            Celebrating the rich heritage of Pakistani and Mughlai
            cuisine, crafted with tradition, passion, and warmth.
          </p>
        </div>
      </section>

      {/* OUR STORY */}
      <section className="about-story-section">
        <div className="about-story-image">
          <img src={storyImage} alt="Spice Route culinary tradition" />
        </div>

        <div className="about-story-content">
          <span className="section-label">WHO WE ARE</span>
          <h2>Our Story</h2>

          <p>
            Spice Route was born from a love for the flavours that
            travelled along ancient spice trails for centuries.
            What began as a passion for authentic Mughlai recipes
            has grown into a place where tradition meets hospitality.
          </p>

          <p>
            We honour culinary traditions passed down through
            generations, bringing together rich recipes, carefully
            selected spices, and modern culinary creativity.
          </p>

          <p>
            From our kitchen to your table, every dish is prepared
            with patience, authenticity, and care. We want every
            guest to feel welcome and enjoy a memorable dining
            experience.
          </p>
        </div>
      </section>

      {/* OUR PHILOSOPHY */}
      <section className="about-philosophy-section">
        <div className="about-philosophy-content">
          <span className="section-label">WHAT WE BELIEVE</span>
          <h2>Our Philosophy</h2>

          <p>
            At Spice Route, we believe food is more than a meal.
            It is a gathering, a tradition, and a story shared
            around the table.
          </p>

          <p>
            We believe in quality ingredients, freshly ground
            spices, slow cooking, and warm hospitality. Every
            detail matters because every guest deserves a
            memorable experience.
          </p>

          <blockquote>
            “Good food, warm spaces, lasting memories.”
          </blockquote>
        </div>

        <div className="about-philosophy-image">
          <img src={heroImage} alt="Spice Route food and cuisine" />
        </div>
      </section>

      {/* OUR SPECIALTIES */}
      <section className="about-specialties-section">
        <span className="section-label">THE SPICE ROUTE EXPERIENCE</span>
        <h2>Authentic Flavours, Made with Care</h2>

        <p>
          Our cuisine celebrates traditional Pakistani and Mughlai
          flavours, from fragrant biryanis and rich curries to
          delicious tandoori specialties.
        </p>

        <div className="about-feature-list">
          {features.map((feature) => (
            <span className="about-feature" key={feature}>
              {feature}
            </span>
          ))}
        </div>

        <Link to="/booking" className="primary-button about-booking-button">
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

export default About;
