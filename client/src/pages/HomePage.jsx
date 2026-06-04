import { useNavigate } from "react-router-dom";
import { useState, useEffect, useRef } from "react";
import axios from "axios";
import ProductCard from "../components/ProductCard";
import { motion } from "framer-motion";
import { Link } from "react-router-dom";
import "../App.css";
import "../css/HomePage.css";
import homeImage from "../assets/homeCategory.png";
import electronicsImage from "../assets/electronicsCategory.jpg";
import accessoriesImage from "../assets/accessoriesCategory.png";
import furnitureImage from "../assets/furnitureCategory.png";
import shoesImage from "../assets/shoesCategory.png";
import fashionImage from "../assets/fashionCategory.png";
import kitchenImage from "../assets/kitchenCategory.png";
import HeroImageCarousel from "../components/HeroImageCarousel";
import ParticleBackground from "../components/ParticleBackground";
import API_URL from "@/config/api";

const HomePage = () => {
  const navigate = useNavigate();
  const [bestDeals, setBestDeals] = useState([]);
  const dealsRef = useRef(null);
  const [categories, setCategories] = useState([]);
  const [isMobile, setIsMobile] = useState(window.innerWidth <= 768);

  useEffect(() => {
    const handleResize = () => {
      setIsMobile(window.innerWidth <= 768);
    };

    window.addEventListener("resize", handleResize);

    return () => window.removeEventListener("resize", handleResize);
  }, []);

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/best-deals`);
        setBestDeals(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchBestDeals();
  }, []);

  useEffect(() => {
    const fetchCategories = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/categories`);
        setCategories(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCategories();
  }, []);

  const categoryImages = {
    electronics: electronicsImage,
    clothing: fashionImage,
    furniture: furnitureImage,
    accessories: accessoriesImage,
    kitchen: kitchenImage,
    home: homeImage,
    shoes: shoesImage,
  };
  const mobileDeals = bestDeals.slice(0, 5);

  return (
    <div className="homepage">
      {/* ── PARTICLE BACKGROUND ── */}
      <ParticleBackground />

      {/* All content sits above the canvas */}
      <div className="homepage-content">
        {/* HERO SECTION */}
        <section className="hero-section">
          <div className="hero-left">
            {/* BADGE */}
            <div className="hero-badge">
              <span className="hero-badge-dot" />
              <span className="hero-badge-text">NEW SEASON ARRIVALS</span>
            </div>

            {/* HEADING */}
            <h1 className="hero-heading">
              Discover
              <br />
              <span className="hero-heading-gradient">Premium</span>
              <br />
              Collections
            </h1>

            {/* DESCRIPTION */}
            <p className="hero-description">
              Explore curated products across fashion, electronics, furniture,
              and lifestyle — delivered fast, priced right.
            </p>

            {/* BUTTONS */}
            <div className="hero-actions">
              <Link to="/products" style={{ textDecoration: "none" }}>
                <button className="cssbuttons-io-button">
                  Shop Now
                  <div className="icon">
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      fill="none"
                      viewBox="0 0 24 24"
                      strokeWidth="1.5"
                      stroke="currentColor"
                    >
                      <path
                        strokeLinecap="round"
                        strokeLinejoin="round"
                        d="M13.5 4.5L21 12m0 0l-7.5 7.5M21 12H3"
                      />
                    </svg>
                  </div>
                </button>
              </Link>
              <button
                onClick={() =>
                  dealsRef.current?.scrollIntoView({ behavior: "smooth" })
                }
                className="view-deals-btn"
              >
                View Deals
              </button>
            </div>

            {/* STATS */}
            <div className="hero-stats">
              {[
                ["10K+", "Products"],
                ["4.8★", "Rating"],
                ["Free", "Shipping"],
              ].map(([value, label]) => (
                <div key={label}>
                  <div className="hero-stat-value">{value}</div>
                  <div className="hero-stat-label">{label}</div>
                </div>
              ))}
            </div>
          </div>

          {/* RIGHT SIDE */}
          <HeroImageCarousel />
        </section>

        {/* BEST DEALS */}
        <section ref={dealsRef} className="deals-section">
          <div className="deals-header">
            <div>
              <h2 className="deals-title">🔥 Best Deals</h2>
              <p className="deals-subtitle">
                Top discounted products curated for you
              </p>
            </div>
            <button
              onClick={() => navigate("/products")}
              className="view-all-btn"
            >
              View All →
            </button>
          </div>

          <div className="deals-slider">
            {isMobile ? (
              <div className="mobile-deals-list">
                {mobileDeals.map((product) => (
                  <div key={product._id} className="mobile-deal-item">
                    <div className="homepage-product-wrapper">
                      <ProductCard product={product} />
                    </div>
                  </div>
                ))}

                <div
                  className="view-all-mobile-card"
                  onClick={() => navigate("/products")}
                >
                  <div className="view-all-mobile-arrow">→</div>

                  <span>View All Products</span>
                </div>
              </div>
            ) : (
              <motion.div
                animate={{
                  x: ["0%", "-50%"],
                }}
                transition={{
                  repeat: Infinity,
                  duration: 60,
                  ease: "linear",
                }}
                className="deals-track"
              >
                {[...bestDeals, ...bestDeals].map((product, index) => (
                  <motion.div
                    key={`${product._id}-${index}`}
                    whileHover={{ y: -8 }}
                    transition={{
                      duration: 0.35,
                    }}
                    className="deal-card-wrapper"
                  >
                    <div className="homepage-product-wrapper">
                      <ProductCard product={product} />
                    </div>
                  </motion.div>
                ))}
              </motion.div>
            )}
          </div>
        </section>

        {/* CATEGORIES */}
        <section className="category-section">
          <div className="category-header">
            <div>
              <p className="category-subtitle">EXPLORE</p>
              <h2 className="category-title">Shop by Category</h2>
            </div>
          </div>
          <div className="category-grid">
            {categories.map((category) => (
              <div
                key={category}
                className="category-card"
                onClick={() => navigate(`/products?category=${category}`)}
                style={{ backgroundImage: `url(${categoryImages[category]})` }}
              >
                <div className="category-overlay" />
                <div className="category-content">
                  <h3 className="category-name">
                    {category
                      .split(" ")
                      .map((w) => w.charAt(0).toUpperCase() + w.slice(1))
                      .join(" ")}
                  </h3>
                  <p className="category-link">Explore Collection →</p>
                </div>
              </div>
            ))}
          </div>
        </section>
      </div>
    </div>
  );
};

export default HomePage;
