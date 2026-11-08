
import { Link } from "react-router-dom";

function AuthLayout({
  pageTitle,
  subtitle,
  formTitle,
  children,
  footerText,
  footerLink,
  footerLinkText,
}) {
  return (
    <main className="auth-screen">
      <div className="auth-background-overlay">
        <header className="auth-heading">
          <h1>{pageTitle}</h1>
          <p>{subtitle}</p>
        </header>

        <div className="auth-layout">
          <section className="auth-welcome-panel">
            <h2>Welcome back</h2>

            <div className="auth-brand">
              <span>♨</span>
              <strong>Spice Route</strong>
            </div>

            <p>Good to see you again.</p>

            <ul>
              <li>Reserve your favourite table instantly</li>
              <li>Access your past reservations</li>
              <li>Discover our delicious menu and special offers</li>
            </ul>

            <p className="auth-tagline">
              Warm flavours, timeless hospitality.
            </p>
          </section>

          <section className="auth-form-panel">
            <h2>{formTitle}</h2>

            {children}

            {footerText && (
              <p className="auth-footer">
                {footerText}{" "}
                <Link to={footerLink}>{footerLinkText}</Link>
              </p>
            )}
          </section>
        </div>
      </div>
    </main>
  );
}

export default AuthLayout;
