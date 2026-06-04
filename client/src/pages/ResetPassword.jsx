import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Lock } from "lucide-react";
import API_URL from "@/config/api";
import "../css/AuthPages.css";
import { useNavigate } from "react-router-dom";
import { FaEye, FaEyeSlash } from "react-icons/fa";

function ResetPassword() {
  const { token } = useParams();
  const [password, setPassword] = useState("");
  const [loading, setLoading] = useState(false);
  const [showPassword, setShowPassword] = useState(false);
  const navigate = useNavigate();

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      await axios.put(`${API_URL}/api/users/reset-password/${token}`, {
        password,
      });

      // Clear old login session
      localStorage.removeItem("userInfo");
      sessionStorage.removeItem("userInfo");

      window.dispatchEvent(new Event("storage"));

      navigate("/login", {
        replace: true,
        state: {
          message: "Password updated successfully. Please login again.",
        },
      });

      localStorage.removeItem("token");
      sessionStorage.removeItem("token");
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    }
  };

  return (
    <div className="auth-page">
      <div className="auth-card">
        <div className="auth-header">
          <h1>Reset Password</h1>

          <p>Create a new secure password for your account.</p>
        </div>

        <form onSubmit={submitHandler}>
          <div className="input-group">
            <Lock size={18} />

            <div className="password-input-wrapper">
              <input
                type={showPassword ? "text" : "password"}
                placeholder="New Password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
                className="auth-input"
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

          <button type="submit" className="auth-btn" disabled={loading}>
            {loading ? "Updating..." : "Update Password"}
          </button>
        </form>
      </div>
    </div>
  );
}

export default ResetPassword;
