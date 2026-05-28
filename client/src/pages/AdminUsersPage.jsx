import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/AdminUsersPage.css";
import FloatingAIButton from "../components/FloatingAIButton";

const ROLE_CONFIG = {
  admin: {
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    icon: "◆",
  },
  user: {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    icon: "◉",
  },
};

const getInitials = (name = "") =>
  name
    .split(" ")
    .map((w) => w[0])
    .slice(0, 2)
    .join("")
    .toUpperCase();

const AVATAR_COLORS = [
  "#38bdf8",
  "#a78bfa",
  "#34d399",
  "#fb923c",
  "#f472b6",
  "#4ade80",
  "#818cf8",
];
const avatarColor = (name = "") =>
  AVATAR_COLORS[name.charCodeAt(0) % AVATAR_COLORS.length];

const AdminUsersPage = () => {
  const [users, setUsers] = useState([]);
  const [search, setSearch] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const location = useLocation();

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "⬡" },
    { to: "/admin/products", label: "Products", icon: "◈" },
    { to: "/admin/orders", label: "Orders", icon: "◎" },
    { to: "/admin/users", label: "Users", icon: "◉" },
  ];

  const getUserInfo = () =>
    JSON.parse(
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
    );

  useEffect(() => {
    const fetchUsers = async () => {
      try {
        const userInfo = getUserInfo();
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/users",
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
        setUsers(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchUsers();
  }, []);

  const filtered = users.filter(
    (u) =>
      u.name?.toLowerCase().includes(search.toLowerCase()) ||
      u.email?.toLowerCase().includes(search.toLowerCase()),
  );

  return (
    <>
      <div className="au-root">
        {/* TOGGLE */}
        <button className="au-toggle" onClick={() => setSidebarOpen((o) => !o)}>
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* SIDEBAR */}
        <div
          className="au-sidebar"
          style={{ width: sidebarOpen ? "260px" : "0px" }}
        >
          <div className="au-sidebar-inner">
            <div className="au-brand">
              <span className="au-brand-name">Admin Panel</span>
            </div>

            <span className="au-nav-label">Navigation</span>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`au-nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}

            <div className="au-sidebar-footer">
              <p>v1.0.0 · ADMIN</p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="au-main">
          {/* Header */}
          <div className="au-main-header">
            <div>
              <p className="au-breadcrumb">Admin · Users</p>
              <h1 className="au-page-title">Manage Users</h1>
            </div>
            <span className="au-count-badge">{users.length} users</span>
          </div>

          {/* Stats row */}
          <div className="au-stats-row">
            <div className="au-stat-chip">
              <div
                className="au-stat-chip-dot"
                style={{ background: "#38bdf8" }}
              />
              <span className="au-stat-chip-label">Total</span>
              <span className="au-stat-chip-val">{users.length}</span>
            </div>
            <div className="au-stat-chip">
              <div
                className="au-stat-chip-dot"
                style={{ background: "#f472b6" }}
              />
              <span className="au-stat-chip-label">Admins</span>
              <span className="au-stat-chip-val">
                {users.filter((u) => u.role === "admin").length}
              </span>
            </div>
            <div className="au-stat-chip">
              <div
                className="au-stat-chip-dot"
                style={{ background: "#38bdf8" }}
              />
              <span className="au-stat-chip-label">Users</span>
              <span className="au-stat-chip-val">
                {users.filter((u) => u.role !== "admin").length}
              </span>
            </div>
          </div>

          {/* Search */}
          <div className="au-search-wrap">
            <span className="au-search-icon">⌕</span>
            <input
              className="au-search"
              placeholder="Search by name or email..."
              value={search}
              onChange={(e) => setSearch(e.target.value)}
            />
          </div>

          {/* User list */}
          <div className="au-user-list">
            {filtered.length === 0 ? (
              <div className="au-empty">NO USERS FOUND</div>
            ) : (
              filtered.map((user, i) => {
                const cfg = ROLE_CONFIG[user.role] || ROLE_CONFIG.user;
                const color = avatarColor(user.name);
                return (
                  <div
                    className="au-user-card"
                    key={user._id}
                    style={{ animationDelay: `${i * 0.04}s` }}
                  >
                    {/* Avatar */}
                    <div className="au-avatar" style={{ background: color }}>
                      {getInitials(user.name)}
                    </div>

                    {/* Info */}
                    <div className="au-user-info">
                      <p className="au-user-name">{user.name}</p>
                      <p className="au-user-email">{user.email}</p>
                      <p className="au-user-id">{user._id}</p>
                    </div>

                    {/* Role pill */}
                    <span
                      className="au-role-pill"
                      style={{
                        color: cfg.color,
                        background: cfg.bg,
                        borderColor: cfg.border,
                      }}
                    >
                      {cfg.icon} {user.role}
                    </span>
                  </div>
                );
              })
            )}
          </div>
        </div>
        <FloatingAIButton />
      </div>
    </>
  );
};

export default AdminUsersPage;
