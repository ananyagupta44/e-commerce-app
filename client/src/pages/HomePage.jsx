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
const HomePage = () => {
  const navigate = useNavigate();
  const [bestDeals, setBestDeals] = useState([]);
  const dealsRef = useRef(null);
  const [categories, setCategories] = useState([]);

  useEffect(() => {
    const fetchBestDeals = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/products/best-deals",
        );

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
        const { data } = await axios.get(
          "http://localhost:5000/api/products/categories",
        );

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

  return (
    <div
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "dark-gray",
        color: "white",
      }}
    >
      {/* HERO SECTION */}

      <section
        style={{
          width: "100%",
          padding: "80px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 60,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE */}

        <div
          style={{
            flex: "1 1 500px",
          }}
        >
          {/* BADGE */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              background: "rgba(99,102,241,0.1)",
              border: "1px solid rgba(99,102,241,0.25)",
              borderRadius: 20,
              padding: "6px 14px",
              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: "#6366f1",
                borderRadius: "50%",
              }}
            />

            <span
              style={{
                fontSize: 12,
                color: "#a5b4fc",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              NEW SEASON ARRIVALS
            </span>
          </div>

          {/* HEADING */}

          <h1
            style={{
              fontFamily: "Syne, sans-serif",
              fontWeight: 800,
              fontSize: "70px",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Discover
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#6366f1,#c4b5fd)",
                WebkitBackgroundClip: "text",
                WebkitTextFillColor: "transparent",
              }}
            >
              Premium
            </span>
            <br />
            Collections
          </h1>

          {/* DESCRIPTION */}

          <p
            style={{
              fontFamily: "DM Mono, monospace",
              color: "#94a3b8",
              fontSize: 18,
              lineHeight: 1.8,
              marginBottom: 36,
              maxWidth: 500,
            }}
          >
            Explore curated products across fashion, electronics, furniture, and
            lifestyle — delivered fast, priced right.
          </p>

          {/* BUTTONS */}

          <div
            style={{
              fontFamily: "DM Mono, monospace",
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            {/* SHOP NOW BUTTON */}
            <>
              <Link
                to="/products"
                style={{
                  textDecoration: "none",
                }}
              >
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
            </>
            {/* VIEW DEALS BUTTON*/}
            <>
              <button
                onClick={() => {
                  dealsRef.current?.scrollIntoView({
                    behavior: "smooth",
                  });
                }}
                className="view-deals-btn"
              >
                View Deals
              </button>
            </>
          </div>

          {/* STATS */}

          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 50,
              flexWrap: "wrap",
            }}
          >
            {[
              ["10K+", "Products"],
              ["4.8★", "Rating"],
              ["Free", "Shipping"],
            ].map(([value, label]) => (
              <div key={label}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 28,
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    marginTop: 5,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 350,
              height: 350,

              borderRadius: "50%",

              background:
                "radial-gradient(circle at 60% 40%, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",

              display: "flex",
              alignItems: "center",
              justifyContent: "center",
              position: "relative",
              fontSize: 140,
            }}
          >
            🛍️
            {/* FLASH SALE */}
            <div
              style={{
                position: "absolute",
                top: 30,
                right: 10,
                background: "#1e293b",
                border: "1px solid #334155",
                borderRadius: 14,
                padding: "10px 16px",
                color: "#a5b4fc",
                fontWeight: 700,
                fontSize: 14,
              }}
            >
              ⚡ Flash Sale
            </div>
          </div>
        </div>
      </section>

      {/* BEST DEALS */}

      <section
        ref={dealsRef}
        style={{
          padding: "40px 60px 80px",
        }}
      >
        {/* SECTION HEADER */}

        <div
          style={{
            fontFamily: "Syne, sans-serif",
            display: "flex",
            justifyContent: "space-between",
            alignItems: "center",
            marginBottom: "30px",
            flexWrap: "wrap",
            gap: "20px",
          }}
        >
          <div>
            <h2
              style={{
                fontSize: "38px",
                fontWeight: "800",
                marginBottom: "10px",
              }}
            >
              🔥 Best Deals
            </h2>

            <p
              style={{
                color: "#94a3b8",
                fontSize: "16px",
              }}
            >
              Top discounted products curated for you
            </p>
          </div>

          <button
            onClick={() => navigate("/products")}
            style={{
              background: "transparent",
              border: "1px solid #334155",
              color: "white",
              padding: "12px 20px",
              borderRadius: "12px",
              cursor: "pointer",
            }}
          >
            View All →
          </button>
        </div>

        {/* PRODUCTS GRID */}

        <div
          style={{
            overflow: "hidden",
            width: "100%",
            position: "relative",
          }}
        >
          <motion.div
            animate={{
              x: ["0%", "-50%"],
            }}
            transition={{
              repeat: Infinity,
              duration: 60,
              ease: "linear",
            }}
            style={{
              display: "flex",
              gap: "24px",
              width: "max-content",
            }}
          >
            {[...bestDeals, ...bestDeals].map((product, index) => (
              <div
                key={`${product._id}-${index}`}
                style={{
                  minWidth: "280px",
                  maxWidth: "280px",

                  flexShrink: 0,
                }}
              >
                <ProductCard product={product} />
              </div>
            ))}
          </motion.div>
        </div>
      </section>
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
              style={{
                backgroundImage: `url(${categoryImages[category]})`,
              }}
            >
              <div className="category-overlay" />

              <div className="category-content">
                <h3 className="category-name">
                  {category
                    .split(" ")
                    .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                    .join(" ")}
                </h3>

                <p className="category-link">Explore Collection →</p>
              </div>
            </div>
          ))}
        </div>
      </section>
    </div>
  );
};

export default HomePage;
