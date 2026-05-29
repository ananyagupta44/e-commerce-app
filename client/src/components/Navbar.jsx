import { Link, useNavigate, useLocation } from "react-router-dom";

import axios from "axios";

import { useState, useEffect, useRef } from "react";

import { Menu, X } from "lucide-react";

import "../css/Navbar.css";

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

  const location = useLocation();

  const [mobileMenu, setMobileMenu] = useState(false);

  const [searchQuery, setSearchQuery] = useState("");

  const [cartCount, setCartCount] = useState(0);

  const [wishlistCount, setWishlistCount] = useState(0);

  const [showDropdown, setShowDropdown] = useState(false);

  const [showCategories, setShowCategories] = useState(false);

  const [userInfo, setUserInfo] = useState(() => getStoredUser());

  const [categories, setCategories] = useState([]);

  const dropdownRef = useRef();

  const categoryRef = useRef();

  const queryParams = new URLSearchParams(location.search);

  const category = queryParams.get("category");

  // FETCH CART
  const fetchCartCount = async () => {
    try {
      const storedUser = getStoredUser();

      if (!storedUser) {
        setCartCount(0);
        return;
      }

      const { data } = await axios.get("http://localhost:5000/api/cart", {
        headers: {
          Authorization: `Bearer ${storedUser.token}`,
        },
      });

      const totalItems = data.reduce((acc, item) => acc + item.qty, 0);

      setCartCount(totalItems);
    } catch (error) {
      console.log(error);
    }
  };

  // WISHLIST
  const updateWishlistCount = () => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlistCount(wishlist.length);
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

  useEffect(() => {
    fetchCartCount();
    updateWishlistCount();
    fetchCategories();
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

  // SEARCH
  const handleSearch = (e) => {
    if (e.key === "Enter" && searchQuery.trim()) {
      const query = searchQuery.trim().toLowerCase();

      const matchedCategory = categories.find((cat) =>
        query.includes(cat.toLowerCase()),
      );

      if (matchedCategory) {
        navigate(`/products?category=${matchedCategory}`);
      } else {
        navigate(`/products?keyword=${query}`);
      }

      setMobileMenu(false);
    }
  };

  // LOGOUT
  const logoutHandler = () => {
    localStorage.removeItem("userInfo");

    sessionStorage.removeItem("userInfo");

    setUserInfo(null);

    setCartCount(0);

    navigate("/login");
  };

  return (
    <header className="navbar">
      <div className="navbar-container">
        {/* LEFT */}
        <div className="navbar-left">
          {/* MOBILE MENU BTN */}
          <button
            className="mobile-menu-btn"
            onClick={() => setMobileMenu(!mobileMenu)}
          >
            {mobileMenu ? <X size={24} /> : <Menu size={24} />}
          </button>

          {/* LINKS */}
          <nav className={`navbar-links ${mobileMenu ? "active" : ""}`}>
            <Link to="/">Home</Link>

            <Link to="/products">Products</Link>

            {/* CATEGORIES */}
            <div className="category-dropdown" ref={categoryRef}>
              <button
                className="category-btn"
                onClick={() => setShowCategories(!showCategories)}
              >
                Categories ▼
              </button>

              {showCategories && (
                <div className="category-menu">
                  {categories.map((cat) => (
                    <button
                      key={cat}
                      onClick={() => {
                        navigate(`/products?category=${cat}`);

                        setShowCategories(false);

                        setMobileMenu(false);
                      }}
                    >
                      {cat}
                    </button>
                  ))}
                </div>
              )}
            </div>
          </nav>
        </div>

        {/* LOGO */}
        <Link to="/" className="navbar-logo-center">
          <img src={logoImage} alt="Logo" />
        </Link>

        {/* RIGHT */}
        <div className="navbar-right">
          {/* SEARCH */}
          <div className="navbar-search">
            <input
              type="text"
              placeholder="Search products..."
              value={searchQuery}
              onChange={(e) => setSearchQuery(e.target.value)}
              onKeyDown={handleSearch}
            />
          </div>

          {/* WISHLIST */}
          <Link to="/wishlist">❤️ {wishlistCount}</Link>

          {/* CART */}
          <Link to="/cart">🛒 {cartCount}</Link>

          {/* USER */}
          {userInfo ? (
            <div className="user-dropdown" ref={dropdownRef}>
              <button
                className="user-btn"
                onClick={() => setShowDropdown((prev) => !prev)}
              >
                {userInfo.user?.name || userInfo.user?.email || "Account"} ▼
              </button>

              {showDropdown && (
                <div className="dropdown-menu">
                  {/* USER INFO */}
                  <div className="dropdown-user-info">
                    <h3 className="dropdown-user-name">
                      {userInfo.user?.name || "User"}
                    </h3>

                    <p className="dropdown-user-email">
                      {userInfo.user?.email || ""}
                    </p>
                  </div>

                  <hr className="dropdown-divider" />

                  {/* ADMIN */}
                  {userInfo?.user?.role === "admin" && (
                    <Link to="/admin" className="dropdown-link">
                      Admin Dashboard
                    </Link>
                  )}

                  <Link to="/myorders" className="dropdown-link">
                    My Orders
                  </Link>

                  <Link to="/profile" className="dropdown-link">
                    Profile
                  </Link>

                  <button onClick={logoutHandler} className="logout-btn">
                    Logout
                  </button>
                </div>
              )}
            </div>
          ) : (
            <div className="auth-buttons">
              <Link to="/login">
                <button className="login-btn">Login</button>
              </Link>

              <Link to="/register">
                <button className="register-btn">Register</button>
              </Link>
            </div>
          )}
        </div>
      </div>
    </header>
  );
};

export default Navbar;
