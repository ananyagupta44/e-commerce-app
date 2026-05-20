import { Link, useNavigate } from "react-router-dom";

import { useState } from "react";

const Navbar = () => {
  const navigate = useNavigate();

  // SEARCH STATE
  const [searchQuery, setSearchQuery] = useState("");

  // SEARCH FOCUS
  const [searchFocused, setSearchFocused] = useState(false);

  // TEMP STATES
  const cartCount = 0;
  const wishlist = [];

  // SEARCH HANDLER
  const handleSearch = (e) => {
    if (e.key === "Enter") {
      navigate(`/products?keyword=${searchQuery}`);
    }
  };

  return (
    <header
      style={{
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(5,5,16,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div
        style={{
          width: "100%",

          padding: "0 40px",
          height: 64,
          display: "flex",
          alignItems: "center",
          gap: 24,
        }}
      >
        {/* LOGO */}

        <Link
          to="/"
          style={{
            textDecoration: "none",
          }}
        >
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 10,
              cursor: "pointer",
              flexShrink: 0,
            }}
          >
            <div
              style={{
                width: 36,
                height: 36,
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                borderRadius: 10,
                display: "flex",
                alignItems: "center",
                justifyContent: "center",
                fontSize: 18,
              }}
            >
              ⚡
            </div>

            <span
              style={{
                fontWeight: 800,
                fontSize: 20,
                color: "#fff",
              }}
            >
              NOVA
            </span>
          </div>
        </Link>

        {/* NAV LINKS */}

        <nav
          style={{
            display: "flex",
            gap: 20,
            marginLeft: 20,
          }}
        >
          <Link
            to="/"
            style={{
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Home
          </Link>

          <Link
            to="/products"
            style={{
              color: "#fff",
              textDecoration: "none",
            }}
          >
            Products
          </Link>

          <Link
            to="/about"
            style={{
              color: "#fff",
              textDecoration: "none",
            }}
          >
            About
          </Link>
        </nav>

        {/* SEARCH */}

        <div
          style={{
            flex: 1,
            maxWidth: 380,
            margin: "0 auto",
            background: searchFocused
              ? "rgba(99,102,241,0.08)"
              : "rgba(255,255,255,0.04)",

            border: `1px solid ${searchFocused ? "#6366f1" : "#1e293b"}`,

            borderRadius: 12,
            display: "flex",
            alignItems: "center",
            padding: "0 14px",
            height: 40,
          }}
        >
          <input
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onFocus={() => setSearchFocused(true)}
            onBlur={() => setSearchFocused(false)}
            onKeyDown={handleSearch}
            style={{
              background: "transparent",
              border: "none",
              outline: "none",
              color: "white",
              width: "100%",
            }}
          />
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            display: "flex",
            alignItems: "center",
            gap: 15,
          }}
        >
          {/* WISHLIST */}

          <span style={{ color: "#fff" }}>❤️ {wishlist.length}</span>

          {/* CART */}

          <Link
            to="/cart"
            style={{
              color: "#fff",
              textDecoration: "none",
            }}
          >
            🛒 {cartCount}
          </Link>

          {/* LOGIN */}

          <Link to="/login">
            <button
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "1px solid #334155",
                background: "transparent",
                color: "#fff",
                cursor: "pointer",
              }}
            >
              Login
            </button>
          </Link>

          {/* REGISTER */}

          <Link to="/register">
            <button
              style={{
                padding: "8px 14px",
                borderRadius: 8,
                border: "none",
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",

                color: "#fff",
                cursor: "pointer",
              }}
            >
              Register
            </button>
          </Link>
        </div>
      </div>
    </header>
  );
};

export default Navbar;
