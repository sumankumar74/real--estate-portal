
import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { toast } from "react-toastify";
import "../src/css/Login.css";

export default function Login() {
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [showPassword, setShowPassword] = useState(false);
  const [remember, setRemember] = useState(true);
  const [loading, setLoading] = useState(false);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      const response = await fetch("http://localhost:5000/api/auth/login", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          email: form.email.trim(),
          password: form.password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      const storage = remember ? localStorage : sessionStorage;

      localStorage.removeItem("estatehubToken");
      sessionStorage.removeItem("estatehubToken");
      localStorage.removeItem("estatehubUser");
      sessionStorage.removeItem("estatehubUser");

      storage.setItem("estatehubToken", data.token);
      storage.setItem("estatehubUser", JSON.stringify(data.user));

      toast.success(`Welcome back, ${data.user.name}!`);
      navigate("/");
    } catch (error) {
      toast.error(error.message || "Unable to connect to the server");
    } finally {
      setLoading(false);
    }
  };

  return (
    <main className="login-page">
      <section className="login-showcase">
        <nav className="login-nav">
          <Link to="/" className="login-logo">
            <span className="login-logo-icon">⌂</span>
            Estate<span>Hub</span>
          </Link>
          <Link to="/" className="login-home-link">← Back to Home</Link>
        </nav>

        <div className="login-showcase-content">
          <span className="login-badge">FIND YOUR PLACE IN THE WORLD</span>
          <h1>Every great story starts with a <span>home.</span></h1>
          <p>
            Discover exceptional properties and take the next step
            towards the life you've always imagined.
          </p>

          <div className="login-benefits">
            <div className="login-benefit">
              <span className="benefit-icon">⌂</span>
              <div>
                <strong>Find your perfect space</strong>
                <p>Homes selected for your lifestyle.</p>
              </div>
            </div>
            <div className="login-benefit">
              <span className="benefit-icon">♡</span>
              <div>
                <strong>Keep your favorites close</strong>
                <p>Save properties worth coming back to.</p>
              </div>
            </div>
            <div className="login-benefit">
              <span className="benefit-icon">✓</span>
              <div>
                <strong>Your journey, one place</strong>
                <p>Access your account whenever you need.</p>
              </div>
            </div>
          </div>
        </div>

        <p className="login-showcase-footer">
          Thoughtful spaces. Meaningful living.
        </p>
      </section>

      <section className="login-form-section">
        <div className="login-mobile-logo">
          <Link to="/" className="login-logo">
            <span className="login-logo-icon">⌂</span>
            Estate<span>Hub</span>
          </Link>
        </div>

        <div className="login-card">
          <div className="login-heading">
            <span className="login-eyebrow">WELCOME BACK</span>
            <h2>Good to see you again.</h2>
            <p>Sign in to continue your property journey.</p>
          </div>

          <form onSubmit={handleSubmit}>
            <div className="login-field">
              <label htmlFor="login-email">Email address</label>
              <div className="login-input-wrap">
                <span>✉</span>
                <input
                  id="login-email"
                  name="email"
                  type="email"
                  placeholder="you@example.com"
                  value={form.email}
                  onChange={handleChange}
                  autoComplete="email"
                  required
                />
              </div>
            </div>

            <div className="login-field">
              <label htmlFor="login-password">Password</label>
              <div className="login-input-wrap">
                <span>♙</span>
                <input
                  id="login-password"
                  name="password"
                  type={showPassword ? "text" : "password"}
                  placeholder="Enter your password"
                  value={form.password}
                  onChange={handleChange}
                  autoComplete="current-password"
                  required
                />
                <button
                  type="button"
                  className="login-password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                  aria-label={showPassword ? "Hide password" : "Show password"}
                >
                  {showPassword ? "Hide" : "Show"}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={remember}
                  onChange={(e) => setRemember(e.target.checked)}
                />
                <span>Remember me</span>
              </label>
              <button
                type="button"
                className="login-forgot"
                onClick={() => toast.info("Please contact support to reset your password.")}
              >
                Forgot password?
              </button>
            </div>

            <button className="login-submit" type="submit" disabled={loading}>
              <span>{loading ? "Signing you in..." : "Sign In to EstateHub"}</span>
              {!loading && <span className="login-arrow">→</span>}
            </button>
          </form>

          <div className="login-divider"><span>YOUR NEXT CHAPTER AWAITS</span></div>

          <div className="login-trust">
            <span>✓</span>
            Your property journey starts here
          </div>

          <p className="login-register-link">
            New to EstateHub? <Link to="/register">Create an account →</Link>
          </p>
        </div>

        <p className="login-copyright">
          © {new Date().getFullYear()} EstateHub · Find a place to belong.
        </p>
      </section>
    </main>
  );
}
