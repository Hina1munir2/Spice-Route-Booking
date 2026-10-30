
import { Link } from "react-router-dom";
import heroImage from "../assets/hero.png";
import spiceBackground from "../assets/herobg.png";
import storyImage from "../assets/story.png";

function Home() {
  return (
    <main className="home-page">
      {/* HERO SECTION */}
     <section
  className="hero-section"
  style={{ backgroundImage: `url(${spiceBackground})` }}
>
        <div className="hero-content">
          <span className="hero-label">
            AUTHENTIC PAKISTANI & MUGHLAI CUISINE
          </span>

          <h1>
            A Culinary Journey Along The Ancient Spice Route
          </h1>

          <p>
            Experience the rich flavours of Mughlai traditions —
            slow-cooked curries, fragrant biryanis, and tandoori
            specialties crafted with hand-ground spices and
            time-honored recipes.
          </p>

          <div className="hero-buttons">
           <Link to="/menu" className="outline-button">
              View Menu
            </Link>
            <Link to="/booking" className="outline-button">
              Reserve Now
            </Link>
          </div>

          <div className="hero-details">
            <span>♧ Hand-Ground Spices</span>
            <span>♨ Tandoor Cooked</span>
            <span>♢ Locally Sourced</span>
          </div>
        </div>

       <div
  className="hero-image"
  style={{ backgroundImage: `url(${heroImage})` }}
></div>
      </section>

      {/* OUR STORY SECTION */}
      <section className="story-section" id="our-story">
        <div
  className="story-image"
  style={{ backgroundImage: `url(${storyImage})` }}
></div>
        <div className="story-content">
          <span className="section-label">OUR STORY</span>

          <h2>Rooted in Tradition, Crafted for Today</h2>

          <p>
            Spice Route was born from a love for the ancient
            spice trails that connected cultures for centuries.
            We bring those flavours to your table — blending
            traditional Mughlai recipes passed down through
            generations with modern culinary finesse.
          </p>

          <p>
            From our tandoor to your plate, every dish is
            prepared with patience, authenticity, and care,
            using spices carefully sourced from across the
            region.
          </p>

        <Link to="/about" className="outline-button story-button">
  Learn More About Us
</Link>
        </div>
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

export default Home;
