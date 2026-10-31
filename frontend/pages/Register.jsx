
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../src/css/Register.css";
import API_URL from "../src/service/api";
export default function Register() {
  const navigate = useNavigate();
  const [form, setForm] = useState({
    name: "",
    email: "",
    password: "",
    confirmPassword: "",
  });
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    if (form.password.length < 6) {
      toast.error("Password must contain at least 6 characters");
      return;
    }

    if (form.password !== form.confirmPassword) {
      toast.error("Passwords do not match");
      return;
    }

    try {
      setLoading(true);

      const response = await fetch(`${API_URL}/api/auth/register`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          name: form.name,
          email: form.email,
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      toast.success("Account created successfully!");
      navigate("/login");
    } catch (error) {
      toast.error(error.message || "Unable to connect to server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="auth-page">
      <section className="auth-visual register-visual">
        <nav className="auth-nav">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">⌂</span>
            Estate<span>Hub</span>
          </Link>
          <Link to="/" className="back-home">← Back to Home</Link>
        </nav>

        <div className="visual-content">
          <span className="visual-tag">YOUR NEXT CHAPTER STARTS HERE</span>
          <h1>Find a place<br />to call <span>home.</span></h1>
          <p>
            Discover exceptional properties, explore new possibilities,
            and find a home that fits your lifestyle.
          </p>

          <div className="visual-benefits">
            <div><span>⌂</span><p><strong>Discover Great Homes</strong><small>Explore properties that fit your needs.</small></p></div>
            <div><span>✓</span><p><strong>Trusted Listings</strong><small>Make informed property decisions.</small></p></div>
            <div><span>♡</span><p><strong>Your Favorites, Together</strong><small>Save homes you love for later.</small></p></div>
          </div>
        </div>

        <p className="visual-footer">Find your place. Build your future.</p>
      </section>

      <section className="auth-form-section">
        <div className="auth-mobile-logo">
          <Link to="/" className="auth-logo">
            <span className="logo-icon">⌂</span>
            Estate<span>Hub</span>
          </Link>
        </div>

        <div className="auth-form-card register-card">
          <div className="auth-heading">
            <span className="auth-eyebrow">GET STARTED — IT'S FREE</span>
            <h2>Create your account</h2>
            <p>Join EstateHub and find a place you'll love.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="auth-field">
              <label htmlFor="name">Full name</label>
              <input
                id="name"
                name="name"
                type="text"
                placeholder="Enter your full name"
                value={form.name}
                onChange={handleChange}
                autoComplete="name"
                required
                minLength={2}
              />
            </div>

            <div className="auth-field">
              <label htmlFor="email">Email address</label>
              <input
                id="email"
                name="email"
                type="email"
                placeholder="you@example.com"
                value={form.email}
                onChange={handleChange}
                autoComplete="email"
                required
              />
            </div>

            <div className="auth-field">
              <label htmlFor="password">Password</label>
              <div className="password-input">
                <input
                  id="password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="At least 6 characters"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="new-password"
                  minLength={6}
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="auth-field">
              <label htmlFor="confirmPassword">Confirm password</label>
              <div className="password-input">
                <input
                  id="confirmPassword"
                  name="confirmPassword"
                  type={showPassword ? "text" : "password"}
                  placeholder="Re-enter your password"
                  value={form.confirmPassword}
                  onChange={handleChange}
                  autoComplete="new-password"
                  required
                />
                <button type="button" onClick={() => setShowPassword(!showPassword)}>
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <button className="auth-submit" type="submit" disabled={loading}>
              {loading ? "Creating account..." : "Create Account"}
              {!loading && <span>→</span>}
            </button>
          </form>

          <div className="auth-divider"><span>YOUR PROPERTY JOURNEY STARTS HERE</span></div>

          <p className="auth-switch">
            Already have an account? <Link to="/login">Sign in</Link>
          </p>

          <p className="auth-terms">
            By creating an account, you agree to use EstateHub responsibly.
          </p>
        </div>

        <p className="auth-copyright">© {new Date().getFullYear()} EstateHub. Find your place.</p>
      </section>
    </main>
  );
}
