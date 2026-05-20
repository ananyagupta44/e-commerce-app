import { Link } from "react-router-dom";

const Footer = () => {
  return (
    <footer
      style={{
        background: "#020617",
        borderTop: "1px solid #1e293b",
        color: "white",
        marginTop: "80px",
      }}
    >
      {/* MAIN SECTION */}

      <div
        style={{
          maxWidth: "1300px",
          margin: "0 auto",
          padding: "60px 40px",

          display: "grid",

          gridTemplateColumns: "repeat(auto-fit,minmax(220px,1fr))",

          gap: "40px",
        }}
      >
        {/* BRAND */}

        <div>
          <h2
            style={{
              fontSize: "32px",
              fontWeight: "800",
              marginBottom: "20px",

              background: "linear-gradient(135deg,#6366f1,#c4b5fd)",

              WebkitBackgroundClip: "text",

              WebkitTextFillColor: "transparent",
            }}
          >
            NOVA
          </h2>

          <p
            style={{
              color: "#94a3b8",
              lineHeight: "1.8",
            }}
          >
            Premium shopping experience for fashion, electronics, furniture, and
            lifestyle products.
          </p>
        </div>

        {/* QUICK LINKS */}

        <div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Quick Links
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
            }}
          >
            <Link
              to="/"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
              }}
            >
              Home
            </Link>

            <Link
              to="/products"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
              }}
            >
              Products
            </Link>

            <Link
              to="/login"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
              }}
            >
              Login
            </Link>

            <Link
              to="/register"
              style={{
                color: "#94a3b8",
                textDecoration: "none",
              }}
            >
              Register
            </Link>
          </div>
        </div>

        {/* CATEGORIES */}

        <div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Categories
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              color: "#94a3b8",
            }}
          >
            <p>Electronics</p>

            <p>Fashion</p>

            <p>Furniture</p>

            <p>Accessories</p>
          </div>
        </div>

        {/* CONTACT */}

        <div>
          <h3
            style={{
              fontSize: "22px",
              fontWeight: "700",
              marginBottom: "20px",
            }}
          >
            Contact
          </h3>

          <div
            style={{
              display: "flex",
              flexDirection: "column",
              gap: "14px",
              color: "#94a3b8",
            }}
          >
            <p>📍 Delhi, India</p>

            <p>📧 support@nova.com</p>

            <p>📞 +91 9876543210</p>
          </div>
        </div>
      </div>

      {/* BOTTOM */}

      <div
        style={{
          borderTop: "1px solid #1e293b",

          padding: "20px",

          textAlign: "center",

          color: "#64748b",

          fontSize: "14px",
        }}
      >
        © 2026 NOVA. All rights reserved.
      </div>
    </footer>
  );
};

export default Footer;
