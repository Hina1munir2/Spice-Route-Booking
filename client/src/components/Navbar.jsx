
import { Link } from "react-router-dom";

function Navbar() {
  return (
    <header className="navbar">
      <Link to="/" className="navbar-logo">
        <span className="logo-icon">♧</span>
        <span>Spice Route</span>
      </Link>

      <nav className="nav-links">
        <Link to="/">Home</Link>
        <Link to="/menu">Menu</Link>
        <a href="/#our-story">Our Story</a>
        <Link to="/booking">Reservations</Link>
        <Link to="/contact">Contact</Link>
      </nav>

      <Link to="/booking" className="nav-button">
        Book a Table
      </Link>
    </header>
  );
}

export default Navbar;
