import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const LoginPage = () => {
  const navigate = useNavigate();

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // LOGIN SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    try {
      setLoading(true);

      const { data } = await axios.post(
        "http://localhost:5000/api/auth/login",

        {
          email,
          password,
        },
      );

      // SAVE USER DATA
      localStorage.setItem("userInfo", JSON.stringify(data));

      // REDIRECT
      navigate("/");
    } catch (error) {
      setError(error.response?.data?.message || "Login failed");
    } finally {
      setLoading(false);
    }
  };

  return (
    <div
      style={{
        minHeight: "100vh",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        background: "linear-gradient(to bottom,#020617,#0f172a)",
        padding: 20,
      }}
    >
      <div
        style={{
          width: "100%",
          maxWidth: 450,
          background: "#0f172a",
          border: "1px solid #1e293b",
          borderRadius: 20,
          padding: 40,
          color: "white",
        }}
      >
        {/* TITLE */}

        <h1
          style={{
            textAlign: "center",
            fontSize: 36,
            fontWeight: 800,
            marginBottom: 10,
          }}
        >
          Welcome Back
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: 30,
          }}
        >
          Login to continue shopping
        </p>

        {/* ERROR */}

        {error && (
          <div
            style={{
              background: "rgba(248,113,113,0.1)",
              border: "1px solid rgba(248,113,113,0.2)",
              padding: 12,
              borderRadius: 10,
              marginBottom: 20,
              color: "#f87171",
            }}
          >
            {error}
          </div>
        )}

        {/* FORM */}

        <form onSubmit={handleSubmit}>
          {/* EMAIL */}

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#cbd5e1",
              }}
            >
              Email
            </label>

            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              required
              placeholder="Enter email"
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          {/* PASSWORD */}

          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#cbd5e1",
              }}
            >
              Password
            </label>

            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              required
              placeholder="Enter password"
              style={{
                width: "100%",
                padding: 14,
                borderRadius: 10,
                border: "1px solid #334155",
                background: "#020617",
                color: "white",
                outline: "none",
              }}
            />
          </div>

          {/* BUTTON */}

          {/* BUTTON */}
          {/* BUTTON */}
          <style>{`
  .custom-btn {
    width: 100%;
    padding: 14px;
    border-radius: 12px;
    border: none;
    background: linear-gradient(135deg, #6366f1, #8b5cf6);
    color: white;
    font-size: 16px;
    font-weight: 700;
    cursor: pointer;
    transition: background 0.3s, opacity 0.3s;
  }
  
  .custom-btn:hover:not(:disabled) {
    background: linear-gradient(135deg, #4f46e5, #7c3aed);

  }

  .custom-btn:disabled {
    opacity: 0.7;
    cursor: not-allowed;
  }
`}</style>

          <button type="submit" className="custom-btn" disabled={loading}>
            {loading ? "Logging in..." : "Login"}
          </button>
        </form>

        {/* REGISTER LINK */}

        <p
          style={{
            textAlign: "center",
            marginTop: 25,
            color: "#94a3b8",
          }}
        >
          Don't have an account?{" "}
          <Link
            to="/register"
            style={{
              color: "#a5b4fc",
              textDecoration: "none",
              fontWeight: 700,
            }}
          >
            Register
          </Link>
        </p>
      </div>
    </div>
  );
};

export default LoginPage;
