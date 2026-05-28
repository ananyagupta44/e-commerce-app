import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../css/AdminDashboard.css";
import FloatingAIButton from "../components/FloatingAIButton";

const AdminDashboard = () => {
  const [stats, setStats] = useState({
    totalUsers: 0,
    totalProducts: 0,
    totalOrders: 0,
    totalRevenue: 0,
  });
  const [loading, setLoading] = useState(true);
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "⬡" },
    { to: "/admin/products", label: "Products", icon: "◈" },
    { to: "/admin/orders", label: "Orders", icon: "◎" },
    { to: "/admin/users", label: "Users", icon: "◉" },
  ];

  const statCards = [
    {
      label: "Total Users",
      key: "totalUsers",
      icon: "◉",
      color: "#38bdf8",
      prefix: "",
    },
    {
      label: "Total Products",
      key: "totalProducts",
      icon: "◈",
      color: "#a78bfa",
      prefix: "",
    },
    {
      label: "Total Orders",
      key: "totalOrders",
      icon: "◎",
      color: "#34d399",
      prefix: "",
    },
    {
      label: "Total Revenue",
      key: "totalRevenue",
      icon: "⬡",
      color: "#fb923c",
      prefix: "$",
    },
  ];

  useEffect(() => {
    const fetchStats = async () => {
      try {
        const raw =
          localStorage.getItem("userInfo") ||
          sessionStorage.getItem("userInfo");
        const userInfo = JSON.parse(raw);
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/stats",
          { headers: { Authorization: `Bearer ${userInfo.token}` } },
        );
        setStats(data);
      } catch (error) {
        console.error(error);
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

  return (
    <>
      {loading ? (
        <div className="loading-screen">
          <div className="loader-ring" />
          <span>LOADING DASHBOARD</span>
        </div>
      ) : (
        <div className="dash-root">
          {/* TOGGLE */}
          <button
            className="toggle-btn"
            onClick={() => setSidebarOpen((o) => !o)}
            title="Toggle sidebar"
          >
            {sidebarOpen ? "✕" : "☰"}
          </button>

          {/* SIDEBAR */}
          <div
            className="sidebar"
            style={{ width: sidebarOpen ? "260px" : "0px" }}
          >
            <div className="sidebar-inner">
              {/* Brand */}
              <div className="sidebar-brand">
                <span className="brand-name">Admin Panel</span>
              </div>

              <span className="nav-section-label">Navigation</span>

              {navLinks.map((link) => (
                <Link
                  key={link.to}
                  to={link.to}
                  className={`nav-link ${location.pathname === link.to ? "active" : ""}`}
                >
                  <span className="nav-icon">{link.icon}</span>
                  {link.label}
                </Link>
              ))}

              <div className="sidebar-footer">
                <p className="sidebar-footer-text">v1.0.0 · ADMIN</p>
              </div>
            </div>
          </div>

          {/* MAIN */}
          <div className="main">
            {/* Header */}
            <div className="main-header">
              <div>
                <p className="main-subtitle">Overview · May 2026</p>
                <h1 className="main-title">Dashboard</h1>
              </div>
              <div className="live-badge">
                <span className="live-dot" />
                LIVE
              </div>
            </div>

            {/* Stats */}
            <div className="stats-grid">
              {statCards.map((card, i) => (
                <div
                  key={card.key}
                  className="stat-card"
                  style={{
                    "--card-color": card.color,
                    animationDelay: `${i * 0.08}s`,
                  }}
                >
                  <div className="stat-card-top">
                    <span className="stat-label">{card.label}</span>
                    <div className="stat-icon-wrap">{card.icon}</div>
                  </div>
                  <p className="stat-value">
                    {card.prefix}
                    {stats[card.key].toLocaleString()}
                  </p>
                  <div className="stat-bar">
                    <div className="stat-bar-fill" />
                  </div>
                </div>
              ))}
            </div>
          </div>
          <FloatingAIButton />
        </div>
      )}
    </>
  );
};

export default AdminDashboard;
