import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { useLocation } from "react-router-dom";
import logoImage from "../assets/logo.png";

const getStoredUser = () => {
  try {
    return (
      JSON.parse(localStorage.getItem("userInfo")) ||
      JSON.parse(sessionStorage.getItem("userInfo"))
    );
  } catch {
    return null;
  }
};

const Navbar = () => {
  const navigate = useNavigate();

  const [searchQuery, setSearchQuery] = useState("");
  const [showDropdown, setShowDropdown] = useState(false);
  const [searchFocused, setSearchFocused] = useState(false);
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showCategories, setShowCategories] = useState(false);
  const [userInfo, setUserInfo] = useState(() => getStoredUser());
  const [products, setProducts] = useState([]);
  const [categories, setCategories] = useState([]);
  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const category = queryParams.get("category");
  // user dropdown ref
  const dropdownRef = useRef();
  // categories dropdown ref
  const categoryRef = useRef();

  // ─── FETCH CART COUNT ─────────────────────────────────────────────
  const fetchCartCount = async () => {
    try {
      const storedUser = getStoredUser();
      if (!storedUser) {
        setCartCount(0);
        return;
      }

      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: { Authorization: `Bearer ${storedUser.token}` },
      });
      const totalItems = data.reduce((acc, item) => acc + item.qty, 0);
      setCartCount(totalItems);
    } catch (error) {
      console.log(error);
      setCartCount(0);
    }
  };

  // ─── WISHLIST COUNT ───────────────────────────────────────────────
  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    setWishlistCount(wishlist.length);
  };

  // FETCH PRODUCTS
  const fetchProducts = async () => {
    try {
      const res = await fetch("http://localhost:5000/api/products");

      const data = await res.json();

      setProducts(data);
    } catch (error) {
      console.log(error);
    }
  };

  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(
        "http://localhost:5000/api/products/categories",
      );

      setCategories(data);
    } catch (error) {
      console.log(error);
    }
  };

  // HANDLE CATEGORY
  const handleCategory = (category) => {
    navigate(`/products?category=${category}`);
  };

  // USE EFFECT
  useEffect(() => {
    fetchProducts();
    fetchCategories();
    fetchCartCount();
    updateWishlistCount();

    const syncAuth = () => setUserInfo(getStoredUser());

    window.addEventListener("storage", syncAuth);
    window.addEventListener("storage", fetchCartCount);
    window.addEventListener("storage", updateWishlistCount);
    window.addEventListener("cartUpdated", fetchCartCount);

    return () => {
      window.removeEventListener("storage", syncAuth);
      window.removeEventListener("storage", fetchCartCount);
      window.removeEventListener("storage", updateWishlistCount);
      window.removeEventListener("cartUpdated", fetchCartCount);
    };
  }, []);

  useEffect(() => {
    if (category) {
      fetch(`http://localhost:5000/api/products/category/${category}`)
        .then((res) => res.json())
        .then((data) => setProducts(data));
    } else {
      fetch(`http://localhost:5000/api/products`)
        .then((res) => res.json())
        .then((data) => setProducts(data));
    }
  }, [category]);

  // ─── CLOSE DROPDOWN ON OUTSIDE CLICK ─────────────────────────────

  useEffect(() => {
    const handleClickOutside = (e) => {
      // USER DROPDOWN
      if (dropdownRef.current && !dropdownRef.current.contains(e.target)) {
        setShowDropdown(false);
      }
      // CATEGORY DROPDOWN
      if (categoryRef.current && !categoryRef.current.contains(e.target)) {
        setShowCategories(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => {
      document.removeEventListener("mousedown", handleClickOutside);
    };
  }, []);

  // ─── LOGOUT ───────────────────────────────────────────────────────
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");
    sessionStorage.removeItem("userInfo");
    setUserInfo(null);
    setCartCount(0);
    navigate("/login");
  };

  // ─── SEARCH ───────────────────────────────────────────────────────
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      // FIND CATEGORY MATCH
      const matchedCategory = categories.find((cat) =>
        query.includes(cat.toLowerCase()),
      );

      // CATEGORY SEARCH
      if (matchedCategory) {
        navigate(`/products?category=${matchedCategory}`);
      }

      // NORMAL SEARCH
      else {
        navigate(`/products?keyword=${query}`);
      }
    }
  };

  const dropdownLink = {
    display: "block",
    textDecoration: "none",
    color: "white",
    padding: "10px 0",
    fontWeight: "500",
  };

  return (
    <header
      style={{
        fontFamily: "DM Mono, monospace",
        position: "sticky",
        top: 0,
        zIndex: 100,
        background: "rgba(5,5,16,0.85)",
        backdropFilter: "blur(20px)",
        borderBottom: "1px solid #1e293b",
      }}
    >
      <div
        className="flex justify-between items-center"
        style={{
          width: "100%",
          padding: "0 40px",
          height: 64,
          gap: 24,
        }}
      >
        {/* NAV LINKS */}
        <nav style={{ display: "flex", gap: 20, marginLeft: 20 }}>
          <Link to="/" style={{ color: "#fff", textDecoration: "none" }}>
            Home
          </Link>
          <Link
            to="/products"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            Products
          </Link>

          <div ref={categoryRef} style={{ position: "relative" }}>
            {/* DROPDOWN BUTTON */}
            <button
              onClick={() => setShowCategories((prev) => !prev)}
              style={{
                background: "transparent",
                border: "none",
                color: "#fff",
                cursor: "pointer",
                fontSize: "15px",
                fontWeight: "500",
              }}
            >
              Categories ▼
            </button>

            {/* DROPDOWN MENU */}
            {showCategories && (
              <div
                style={{
                  position: "absolute",
                  top: "120%",
                  left: 0,
                  background: "#0f172a",
                  border: "1px solid #1e293b",
                  borderRadius: "12px",
                  padding: "10px",
                  minWidth: "180px",
                  zIndex: 999,
                  boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                }}
              >
                {categories.map((cat) => (
                  <button
                    key={cat.charAt(0).toUpperCase() + cat.slice(1)}
                    onClick={() => {
                      handleCategory(cat);
                      setShowCategories(false);
                    }}
                    style={{
                      display: "block",
                      width: "100%",
                      textAlign: "left",
                      padding: "10px 12px",
                      background: "transparent",
                      border: "none",
                      color: "white",
                      cursor: "pointer",
                      borderRadius: "8px",
                      fontSize: "14px",
                    }}
                    onMouseEnter={(e) => {
                      e.target.style.background = "#1e293b";
                    }}
                    onMouseLeave={(e) => {
                      e.target.style.background = "transparent";
                    }}
                  >
                    {cat.charAt(0).toUpperCase() + cat.slice(1)}
                  </button>
                ))}
              </div>
            )}
          </div>
        </nav>

        {/* LOGO */}
        <Link
          className="absolute left-1/2 -translate-x-1/2"
          to="/"
          style={{ textDecoration: "none" }}
        >
          {" "}
          <div>
            <img
              src={logoImage}
              alt="Logo"
              style={{
                width: "60px",
                height: "60px",
                objectFit: "cover",
              }}
            />{" "}
          </div>
        </Link>

        {/* RIGHT SIDE */}
        <div style={{ display: "flex", alignItems: "center", gap: 15 }}>
          {/* SEARCH */}
          <div
            style={{
              width: 280,
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
          {/* WISHLIST */}
          <Link
            to="/wishlist"
            style={{ color: "#fff", textDecoration: "none" }}
          >
            ❤️ {wishlistCount}
          </Link>

          {/* CART */}
          <Link to="/cart" style={{ color: "#fff", textDecoration: "none" }}>
            🛒 {cartCount}
          </Link>

          {/* USER DROPDOWN or LOGIN/REGISTER */}
          {userInfo ? (
            <div ref={dropdownRef} style={{ position: "relative" }}>
              <button
                onClick={() => setShowDropdown((prev) => !prev)}
                style={{
                  padding: "10px 16px",
                  borderRadius: "10px",
                  border: "1px solid #334155",
                  background: "rgba(255,255,255,0.05)",
                  color: "white",
                  cursor: "pointer",
                  fontWeight: "600",
                }}
              >
                {/* ✅ safely access name with fallback */}
                {userInfo.user?.name || userInfo.user?.email || "Account"} ▼
              </button>

              {showDropdown && (
                <div
                  style={{
                    position: "absolute",
                    top: "120%",
                    right: 0,
                    width: "260px",
                    background: "#0f172a",
                    border: "1px solid #1e293b",
                    borderRadius: "16px",
                    padding: "20px",
                    zIndex: 999,
                    boxShadow: "0 10px 30px rgba(0,0,0,0.4)",
                  }}
                >
                  {/* USER INFO */}
                  <div style={{ marginBottom: "16px" }}>
                    <h3
                      style={{
                        margin: "0 0 6px",
                        fontSize: "20px",
                        color: "white",
                        fontWeight: "bold",
                      }}
                    >
                      {/* ✅ fallback chain so something always shows */}
                      {userInfo.user?.name || "User"}
                    </h3>
                    {userInfo?.user?.role === "admin" && (
                      <Link to="/admin" style={dropdownLink}>
                        Admin Dashboard
                      </Link>
                    )}
                    <p
                      style={{ margin: 0, color: "#94a3b8", fontSize: "14px" }}
                    >
                      {userInfo.user?.email || ""}
                    </p>
                  </div>

                  <hr
                    style={{
                      border: "1px solid #1e293b",
                      marginBottom: "14px",
                    }}
                  />

                  <Link to="/myorders" style={dropdownLink}>
                    My Orders
                  </Link>
                  <Link to="/profile" style={dropdownLink}>
                    Profile
                  </Link>

                  <button
                    onClick={logoutHandler}
                    style={{
                      width: "100%",
                      marginTop: "14px",
                      background: "#ef4444",
                      border: "none",
                      color: "white",
                      padding: "12px",
                      borderRadius: "10px",
                      cursor: "pointer",
                      fontWeight: "700",
                    }}
                  >
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <>
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
            </>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
