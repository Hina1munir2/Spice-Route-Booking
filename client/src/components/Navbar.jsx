
import { Link, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function Navbar() {
  const { user, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate("/");
  };

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

      <div className="nav-auth">
        {user ? (
          <>
           <span className="nav-user">
  Welcome, {user.name}
</span>

{user.role === "staff" && (
  <Link to="/staff/dashboard" className="nav-login">
    Dashboard
  </Link>
)}

            <button
              type="button"
              className="nav-button"
              onClick={handleLogout}
            >
              Logout
            </button>
          </>
        ) : (
          <>
            <Link to="/login" className="nav-login">
              Login
            </Link>

            <Link to="/register" className="nav-button">
              Register
            </Link>
          </>
        )}
      </div>
    </header>
  );
}

export default Navbar;
