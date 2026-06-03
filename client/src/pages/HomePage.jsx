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
import API_URL from "@/config/api";

/* ── Particle Canvas Background ── */
const ParticleBackground = () => {
  const canvasRef = useRef(null);

  useEffect(() => {
    const canvas = canvasRef.current;
    const ctx = canvas.getContext("2d");
    let animId;

    const resize = () => {
      canvas.width = window.innerWidth;
      canvas.height = window.innerHeight;
    };
    resize();
    window.addEventListener("resize", resize);

    // Particle config
    const PARTICLE_COUNT = 130;
    const particles = Array.from({ length: PARTICLE_COUNT }, () => ({
      x: Math.random() * canvas.width,
      y: Math.random() * canvas.height,
      r: Math.random() * 2.5 + 0.8,
      dx: (Math.random() - 0.5) * 0.25,
      dy: (Math.random() - 0.5) * 0.25,
      opacity: Math.random() * 0.5 + 0.5,
      // pulse phase offset
      phase: Math.random() * Math.PI * 2,
      // color: mix of purple/indigo/white
      hue:
        Math.random() < 0.5
          ? `rgba(139,92,246,` // violet
          : Math.random() < 0.5
            ? `rgba(99,102,241,` // indigo
            : `rgba(196,181,253,`, // lavender
    }));

    // A few larger "glow" orbs drifting slowly
    const ORBS = [
      {
        x: canvas.width * 0.15,
        y: canvas.height * 0.3,
        r: 180,
        dx: 0.08,
        dy: 0.05,
        color: "99,102,241",
      },
      {
        x: canvas.width * 0.75,
        y: canvas.height * 0.6,
        r: 220,
        dx: -0.06,
        dy: -0.07,
        color: "139,92,246",
      },
      {
        x: canvas.width * 0.5,
        y: canvas.height * 0.85,
        r: 150,
        dx: 0.05,
        dy: -0.04,
        color: "167,139,250",
      },
    ];

    let t = 0;

    const draw = () => {
      ctx.clearRect(0, 0, canvas.width, canvas.height);

      // Background
      ctx.fillStyle = "#0a0f1e";
      ctx.fillRect(0, 0, canvas.width, canvas.height);

      // Draw soft glow orbs
      ORBS.forEach((orb) => {
        orb.x += orb.dx;
        orb.y += orb.dy;
        if (orb.x < -orb.r) orb.x = canvas.width + orb.r;
        if (orb.x > canvas.width + orb.r) orb.x = -orb.r;
        if (orb.y < -orb.r) orb.y = canvas.height + orb.r;
        if (orb.y > canvas.height + orb.r) orb.y = -orb.r;

        const grad = ctx.createRadialGradient(
          orb.x,
          orb.y,
          0,
          orb.x,
          orb.y,
          orb.r,
        );
        grad.addColorStop(0, `rgba(${orb.color},0.18)`);
        grad.addColorStop(1, `rgba(${orb.color},0)`);
        ctx.fillStyle = grad;
        ctx.beginPath();
        ctx.arc(orb.x, orb.y, orb.r, 0, Math.PI * 2);
        ctx.fill();
      });

      // Draw particles
      t += 0.012;
      particles.forEach((p) => {
        p.x += p.dx;
        p.y += p.dy;
        if (p.x < 0) p.x = canvas.width;
        if (p.x > canvas.width) p.x = 0;
        if (p.y < 0) p.y = canvas.height;
        if (p.y > canvas.height) p.y = 0;

        // Pulse opacity
        const pulse = p.opacity * (0.85 + 0.15 * Math.sin(t + p.phase));

        ctx.beginPath();
        ctx.arc(p.x, p.y, p.r, 0, Math.PI * 2);
        ctx.fillStyle = `${p.hue}${pulse})`;
        ctx.fill();
      });

      // Draw connecting lines between close particles
      for (let i = 0; i < particles.length; i++) {
        for (let j = i + 1; j < particles.length; j++) {
          const dx = particles[i].x - particles[j].x;
          const dy = particles[i].y - particles[j].y;
          const dist = Math.sqrt(dx * dx + dy * dy);
          if (dist < 90) {
            ctx.beginPath();
            ctx.moveTo(particles[i].x, particles[i].y);
            ctx.lineTo(particles[j].x, particles[j].y);
            ctx.strokeStyle = `rgba(99,102,241,${0.18 * (1 - dist / 90)})`;
            ctx.lineWidth = 0.5;
            ctx.stroke();
          }
        }
      }

      animId = requestAnimationFrame(draw);
    };

    draw();

    return () => {
      cancelAnimationFrame(animId);
      window.removeEventListener("resize", resize);
    };
  }, []);

  return <canvas ref={canvasRef} className="particle-canvas" />;
};

const HomePage = () => {
  const navigate = useNavigate();
  const [bestDeals, setBestDeals] = useState([]);
  const dealsRef = useRef(null);
  const [categories, setCategories] = useState([]);

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
            <motion.div
              animate={{ x: ["0%", "-50%"] }}
              transition={{ repeat: Infinity, duration: 60, ease: "linear" }}
              className="deals-track"
            >
              {[...bestDeals, ...bestDeals].map((product, index) => (
                <motion.div
                  key={`${product._id}-${index}`}
                  whileHover={{ y: -8 }}
                  transition={{ duration: 0.35 }}
                  className="deal-card-wrapper"
                >
                  <div className="homepage-product-wrapper">
                    <ProductCard product={product} />
                  </div>
                </motion.div>
              ))}
            </motion.div>
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
