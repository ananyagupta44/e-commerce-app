import { useState } from "react";

import { Link, useNavigate } from "react-router-dom";

import axios from "axios";

const RegisterPage = () => {
  const navigate = useNavigate();

  const [name, setName] = useState("");

  const [email, setEmail] = useState("");

  const [password, setPassword] = useState("");

  const [confirmPassword, setConfirmPassword] = useState("");

  const [error, setError] = useState("");

  const [loading, setLoading] = useState(false);

  // SUBMIT
  const handleSubmit = async (e) => {
    e.preventDefault();

    setError("");

    // PASSWORD MATCH
    if (password !== confirmPassword) {
      setError("Passwords do not match");

      return;
    }

    try {
      setLoading(true);
      // TRIM VALUES
      const trimmedName = name.trim();
      const trimmedEmail = email.trim();

      // NAME VALIDATION
      if (!trimmedName) {
        alert("Name is required");
        return;
      }

      if (trimmedName.length < 2) {
        alert("Name must be at least 2 characters");
        return;
      }

      // ONLY LETTERS/SPACES
      const nameRegex = /^[A-Za-z ]+$/;

      if (!nameRegex.test(trimmedName)) {
        alert("Name can contain only letters");
        return;
      }

      // EMAIL VALIDATION
      const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

      if (!emailRegex.test(trimmedEmail)) {
        alert("Invalid email format");
        return;
      }

      // PASSWORD VALIDATION
      const passwordRegex =
        /^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&]).{8,}$/;

      if (!passwordRegex.test(password)) {
        alert(
          "Password must contain:\n\n" +
            "• 8+ characters\n" +
            "• uppercase letter\n" +
            "• lowercase letter\n" +
            "• number\n" +
            "• special character",
        );

        return;
      }

      await axios.post(
        "http://localhost:5000/api/auth/register",

        {
          name: trimmedName,
          email: trimmedEmail,
          password: password,
        },
      );

      // REDIRECT TO LOGIN
      navigate("/login");

      window.dispatchEvent(new Event("storage"));
    } catch (error) {
      setError(error.response?.data?.message || "Registration failed");
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
          Create Account
        </h1>

        <p
          style={{
            textAlign: "center",
            color: "#94a3b8",
            marginBottom: 30,
          }}
        >
          Register to continue shopping
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
          {/* NAME */}

          <div style={{ marginBottom: 20 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#cbd5e1",
              }}
            >
              Full Name
            </label>

            <input
              type="text"
              value={name}
              onChange={(e) => setName(e.target.value)}
              required
              placeholder="Enter your name"
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

          <div style={{ marginBottom: 20 }}>
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

          {/* CONFIRM PASSWORD */}

          <div style={{ marginBottom: 30 }}>
            <label
              style={{
                display: "block",
                marginBottom: 8,
                color: "#cbd5e1",
              }}
            >
              Confirm Password
            </label>

            <input
              type="password"
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              required
              placeholder="Confirm password"
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

          <button
            type="submit"
            disabled={loading}
            style={{
              width: "100%",

              padding: 14,

              borderRadius: 12,

              border: "none",

              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",

              color: "white",

              fontSize: 16,

              fontWeight: 700,

              cursor: "pointer",

              opacity: loading ? 0.7 : 1,
            }}
          >
            {loading ? "Creating Account..." : "Register"}
          </button>
        </form>

        {/* LOGIN LINK */}

        <p
          style={{
            textAlign: "center",

            marginTop: 25,

            color: "#94a3b8",
          }}
        >
          Already have an account?{" "}
          <Link
            to="/login"
            style={{
              color: "#a5b4fc",

              textDecoration: "none",

              fontWeight: 700,
            }}
          >
            Login
          </Link>
        </p>
      </div>
    </div>
  );
};

export default RegisterPage;
