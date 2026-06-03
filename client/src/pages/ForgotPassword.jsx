import { useState } from "react";
import axios from "axios";
import { Mail, ArrowLeft } from "lucide-react";
import { Link } from "react-router-dom";
import API_URL from "@/config/api";
import "../css/AuthPages.css";

function ForgotPassword() {
  const [email, setEmail] = useState("");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.post(`${API_URL}/api/users/forgot-password`, { email });

      alert("Reset email sent successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Something went wrong");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <Link to="/login" className="back-link">
          <ArrowLeft size={18} />
          Back to Login
        </Link>

        <div className="auth-header">
          <h1>Forgot Password?</h1>

          <p>
            Enter your email address and we'll send you a password reset link.
          </p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <Mail size={18} />
            <input
              type="email"
              placeholder="Email Address"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
            />
          </div>

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Sending..." : "Send Reset Link"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ForgotPassword;
