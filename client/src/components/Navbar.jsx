import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import { useState, useEffect, useRef } from "react";
import { Menu, X } from "lucide-react";

import "../css/Navbar.css";
import logoImage from "../assets/logo.png";
import API_URL from "@/config/api";
import getImageUrl from "@/utils/getImageUrl";

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredUser = () =>
  parseJSON(localStorage.getItem("userInfo")) ??
  parseJSON(sessionStorage.getItem("userInfo"));

const getWishlistKey = (userId) => (userId ? `wishlist_${userId}` : "wishlist");

const Navbar = () => {
  const navigate = useNavigate();

  const [mobileMenu, setMobileMenu] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [cartCount, setCartCount] = useState(0);
  const [wishlistCount, setWishlistCount] = useState(0);
  const [showDropdown, setShowDropdown] = useState(false);
  const [showCategories, setShowCategories] = useState(false);
  const [userInfo, setUserInfo] = useState(() => getStoredUser());
  const [categories, setCategories] = useState([]);
  const [suggestions, setSuggestions] = useState([]);
  const [showSuggestions, setShowSuggestions] = useState(false);
  const [loadingSuggestions, setLoadingSuggestions] = useState(false);
  const desktopSearchRef = useRef(null);
  const mobileSearchRef = useRef(null);
  const dropdownRef = useRef(null);
  const categoryRef = useRef(null);

  const userId = userInfo?.user?.id;
  const userLabel = userInfo?.user?.name || userInfo?.user?.email || "Account";

  // FETCH CART
  const fetchCartCount = async () => {
    try {
      const currentUser = getStoredUser();

      if (!currentUser?.token) {
        setCartCount(0);
        return;
      }

      const { data } = await axios.get(`${API_URL}/api/cart`, {
        headers: {
          Authorization: `Bearer ${currentUser.token}`,
        },
      });

      const totalItems = Array.isArray(data)
        ? data.reduce((acc, item) => acc + (item.qty || 0), 0)
        : 0;

      setCartCount(totalItems);
    } catch (error) {
      console.error("Failed to fetch cart count:", error);
    }
  };

  const updateWishlistCount = () => {
    const wishlist =
      parseJSON(localStorage.getItem(getWishlistKey(userId))) ?? [];

    setWishlistCount(Array.isArray(wishlist) ? wishlist.length : 0);
  };
  // FETCH CATEGORIES
  const fetchCategories = async () => {
    try {
      const { data } = await axios.get(`${API_URL}/api/products/categories`);
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
    window.addEventListener("cartUpdated", () => {
      console.log("cartUpdated received");
      fetchCartCount();
    });

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
      //SEARCH DROPDOWN
      const clickedDesktop = desktopSearchRef.current?.contains(e.target);

      const clickedMobile = mobileSearchRef.current?.contains(e.target);

      if (!clickedDesktop && !clickedMobile) {
        setShowSuggestions(false);
      }
    };
    document.addEventListener("click", handleClickOutside);
    return () => {
      document.removeEventListener("click", handleClickOutside);
    };
  }, []);

  useEffect(() => {
    const timer = setTimeout(async () => {
      if (searchQuery.trim().length < 2) {
        setSuggestions([]);
        return;
      }

      try {
        setLoadingSuggestions(true);

        const { data } = await axios.get(
          `${API_URL}/api/products/search-suggestions?q=${searchQuery}`,
        );

        setSuggestions(data);
        setShowSuggestions(true);
      } catch (err) {
        console.log(err);
      } finally {
        setLoadingSuggestions(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [searchQuery]);

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
    setWishlistCount(0);
    navigate("/login");
  };

  return (
    <>
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
                        {cat.charAt(0).toUpperCase() + cat.slice(1)}
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
            <div className="navbar-search" ref={desktopSearchRef}>
              <input
                type="text"
                placeholder="Search products..."
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                onKeyDown={handleSearch}
                onFocus={() => suggestions.length && setShowSuggestions(true)}
              />

              {showSuggestions && (
                <div className="search-suggestions">
                  {loadingSuggestions && (
                    <div className="suggestion-item">Searching...</div>
                  )}

                  {!loadingSuggestions &&
                    suggestions.map((item) => (
                      <div
                        key={item._id}
                        className="suggestion-item"
                        onClick={() => {
                          navigate(`/product/${item._id}`);
                          setShowSuggestions(false);
                        }}
                      >
                        <img
                          src={getImageUrl(item.images?.[0] || item.image)}
                          alt={item.name}
                        />

                        <div>
                          <div>{item.name}</div>
                          <small>{item.category}</small>
                        </div>
                      </div>
                    ))}
                </div>
              )}
            </div>

            <Link to="/wishlist" className="navbar-icon">
              ❤️
              {wishlistCount > 0 && <span>{wishlistCount}</span>}
            </Link>

            <Link to="/cart" className="navbar-icon">
              🛒
              {cartCount > 0 && <span>{cartCount}</span>}
            </Link>

            {/* USER */}
            {userInfo ? (
              <div className="user-dropdown" ref={dropdownRef}>
                <button
                  className="user-btn"
                  onClick={() => setShowDropdown((prev) => !prev)}
                >
                  {userLabel} ▼
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

      <div className="mobile-search" ref={mobileSearchRef}>
        <div className="mobile-search-wrapper">
          <input
            type="text"
            placeholder="Search products..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            onKeyDown={handleSearch}
            onFocus={() => suggestions.length && setShowSuggestions(true)}
          />

          {showSuggestions && (
            <div className="mobile-search-suggestions">
              {loadingSuggestions && (
                <div className="suggestion-item">Searching...</div>
              )}

              {!loadingSuggestions &&
                suggestions.map((item) => (
                  <div
                    key={item._id}
                    className="suggestion-item"
                    onClick={() => {
                      navigate(`/product/${item._id}`);
                      setShowSuggestions(false);
                    }}
                  >
                    <div>
                      <div>{item.name}</div>
                      <small>{item.category}</small>
                    </div>
                  </div>
                ))}
            </div>
          )}
        </div>
      </div>
    </>
  );
};

export default Navbar;
