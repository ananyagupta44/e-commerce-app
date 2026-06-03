import axios from "axios";
import { useParams } from "react-router-dom";
import { useState } from "react";
import { Lock } from "lucide-react";
import API_URL from "@/config/api";
import "../css/AuthPages.css";

function ResetPassword() {
  const { token } = useParams();

  const [password, setPassword] = useState("");

  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    try {
      setLoading(true);

      await axios.put(`${API_URL}/api/users/reset-password/${token}`, {
        password,
      });

      alert("Password changed successfully");
    } catch (error) {
      alert(error.response?.data?.message || "Password reset failed");
    } finally {
      setLoading(false);
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

            <input
              type="password"
              placeholder="New Password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
            />
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
