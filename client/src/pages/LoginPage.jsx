import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

import axios from "axios";

import "../css/LoginPage.css";
import API_URL from "@/config/api";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  const [rememberMe, setRememberMe] = useState(false);
  const [showPassword, setShowPassword] = useState(false);

  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const { data } = await axios.post(`${API_URL}/api/auth/login`, {
        email,
        password,
      });

      if (rememberMe) {
        localStorage.setItem("userInfo", JSON.stringify(data));
      } else {
        sessionStorage.setItem("userInfo", JSON.stringify(data));
      }

      window.dispatchEvent(new Event("storage"));

      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="login-page">
      {/* LEFT */}

      <div className="login-left">
        <p className="login-tag">PREMIUM SHOPPING EXPERIENCE</p>

        <h1 className="login-heading">
          Shop smarter.
          <br />
          Live better.
        </h1>

        <p className="login-description">
          Discover premium fashion, electronics, furniture and lifestyle
          collections with seamless shopping experience.
        </p>

        <div className="login-features">
          <div className="login-feature">
            <div className="login-feature-icon">🚚</div>
            Free delivery on premium orders
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">🔒</div>
            100% secure payments & checkout
          </div>

          <div className="login-feature">
            <div className="login-feature-icon">✨</div>
            Curated luxury collections
          </div>
        </div>
      </div>

      {/* RIGHT */}

      <div className="login-right">
        <div className="login-card">
          <h1 className="login-title">Welcome Back</h1>

          <p className="login-subtitle">Login to continue shopping</p>

          {error && <div className="login-error">{error}</div>}

          <form onSubmit={handleSubmit}>
            <div className="login-group">
              <label className="login-label">Email</label>

              <input
                type="email"
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                required
                placeholder="Enter your email"
                className="login-input"
              />
            </div>

            <div className="login-group">
              <label className="login-label">Password</label>

              <div className="password-input-wrapper">
                <input
                  type={showPassword ? "text" : "password"}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                  placeholder="Enter password"
                  className="login-input"
                />

                <button
                  type="button"
                  className="password-toggle"
                  onClick={() => setShowPassword(!showPassword)}
                >
                  {showPassword ? <FaEye /> : <FaEyeSlash />}
                </button>
              </div>
            </div>

            <div className="login-options">
              <label className="login-remember">
                <input
                  type="checkbox"
                  checked={rememberMe}
                  onChange={(e) => setRememberMe(e.target.checked)}
                />
                Remember Me
              </label>

              <Link to="/forgot-password" className="login-forgot">
                Forgot Password?
              </Link>
            </div>

            <button type="submit" disabled={loading} className="login-btn">
              {loading ? "Logging in..." : "Login"}
            </button>
          </form>

          <p className="login-register">
            Don't have an account? <Link to="/register">Register</Link>
          </p>
        </div>
      </div>
    </div>
  );
};

export default LoginPage;
