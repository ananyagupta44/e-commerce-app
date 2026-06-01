import { useEffect, useState } from "react";
import { Link, useLocation } from "react-router-dom";
import axios from "axios";
import "../css/AdminOrdersPage.css";
import FloatingAIButton from "../components/FloatingAIButton";

const STATUS_CONFIG = {
  Pending: {
    color: "#fb923c",
    bg: "rgba(251,146,60,0.08)",
    border: "rgba(251,146,60,0.2)",
    icon: "◌",
  },
  Paid: {
    color: "#34d399",
    bg: "rgba(52,211,153,0.08)",
    border: "rgba(52,211,153,0.2)",
    icon: "◉",
  },
  Processing: {
    color: "#38bdf8",
    bg: "rgba(56,189,248,0.08)",
    border: "rgba(56,189,248,0.2)",
    icon: "◎",
  },
  Shipped: {
    color: "#a78bfa",
    bg: "rgba(167,139,250,0.08)",
    border: "rgba(167,139,250,0.2)",
    icon: "◈",
  },
  "Out for Delivery": {
    color: "#f472b6",
    bg: "rgba(244,114,182,0.08)",
    border: "rgba(244,114,182,0.2)",
    icon: "⬡",
  },
  Delivered: {
    color: "#4ade80",
    bg: "rgba(74,222,128,0.08)",
    border: "rgba(74,222,128,0.2)",
    icon: "◆",
  },
};

const STATUSES = Object.keys(STATUS_CONFIG);

const AdminOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [expanded, setExpanded] = useState(null);
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

  const updateOrderStatus = async (id, status) => {
    try {
      const userInfo = getUserInfo();
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/orders/${id}`,
        { orderStatus: status },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setOrders(
        orders.map((o) => (o._id === id ? { ...data, user: o.user } : o)),
      );
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const userInfo = getUserInfo();
        const { data } = await axios.get(
          "http://localhost:5000/api/admin/orders",
          {
            headers: { Authorization: `Bearer ${userInfo.token}` },
          },
        );
        setOrders(data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchOrders();
  }, []);

  return (
    <>
      <div className="ao-root">
        {/* TOGGLE */}
        <button className="ao-toggle" onClick={() => setSidebarOpen((o) => !o)}>
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* SIDEBAR */}
        <div
          className="ao-sidebar"
          style={{ width: sidebarOpen ? "260px" : "0px" }}
        >
          <div className="ao-sidebar-inner">
            <div className="ao-brand">
              <span className="ao-brand-name">Admin Panel</span>
            </div>

            <span className="ao-nav-label">Navigation</span>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`ao-nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}

            <div className="ao-sidebar-footer">
              <p>v1.0.0 · ADMIN</p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="ao-main">
          {/* Header */}
          <div className="ao-main-header">
            <div>
              <p className="ao-breadcrumb">Admin · Orders</p>
              <h1 className="ao-page-title">All Orders</h1>
            </div>
            <span className="ao-count-badge">{orders.length} orders</span>
          </div>

          {/* Order list */}
          <div className="ao-order-list">
            {orders.length === 0 ? (
              <div className="ao-empty">NO ORDERS FOUND</div>
            ) : (
              orders.map((order, i) => {
                const cfg =
                  STATUS_CONFIG[order.orderStatus] || STATUS_CONFIG.Pending;
                const isOpen = expanded === order._id;

                return (
                  <div
                    className="ao-order-card"
                    key={order._id}
                    style={{
                      animationDelay: `${i * 0.04}s`,
                      borderColor: isOpen
                        ? "rgba(148,163,184,0.16)"
                        : undefined,
                    }}
                  >
                    {/* Collapsed row */}
                    <div
                      className="ao-order-top"
                      onClick={() => setExpanded(isOpen ? null : order._id)}
                    >
                      <span className="ao-order-index">
                        #{String(i + 1).padStart(2, "0")}
                      </span>

                      <span className="ao-order-id">{order._id}</span>

                      <span className="ao-order-user">
                        {order.user?.name || "Unknown"}
                      </span>

                      <span className="ao-order-price">
                        ₹{order.totalPrice}
                      </span>

                      <span
                        className="ao-status-pill"
                        style={{
                          color: cfg.color,
                          background: cfg.bg,
                          borderColor: cfg.border,
                        }}
                      >
                        <span>{cfg.icon}</span>
                        {order.orderStatus}
                      </span>

                      <span className={`ao-chevron ${isOpen ? "open" : ""}`}>
                        ▼
                      </span>
                    </div>

                    {/* Expanded panel */}
                    {isOpen && (
                      <div className="ao-order-body">
                        <div className="ao-order-meta">
                          <div className="ao-meta-row">
                            <span className="ao-meta-key">Order ID</span>
                            <span
                              className="ao-meta-val"
                              style={{
                                fontFamily: "'DM Mono',monospace",
                                fontSize: 11,
                              }}
                            >
                              {order._id}
                            </span>
                          </div>
                          <div className="ao-meta-row">
                            <span className="ao-meta-key">Customer</span>
                            <span className="ao-meta-val">
                              {order.user?.name || "—"}
                            </span>
                          </div>
                          <div className="ao-meta-row">
                            <span className="ao-meta-key">Email</span>
                            <span className="ao-meta-val">
                              {order.user?.email || "—"}
                            </span>
                          </div>
                          <div className="ao-meta-row">
                            <span className="ao-meta-key">Total</span>
                            <span
                              className="ao-meta-val"
                              style={{
                                color: "#34d399",
                                fontFamily: "'DM Mono',monospace",
                              }}
                            >
                              ₹{order.totalPrice}
                            </span>
                          </div>
                          <div
                            className="ao-meta-row"
                            style={{ alignItems: "flex-start" }}
                          >
                            <span
                              className="ao-meta-key"
                              style={{ paddingTop: 4 }}
                            >
                              Items
                            </span>
                            <div className="ao-items-list">
                              {order.orderItems?.map((item, idx) => (
                                <div className="ao-item-chip" key={idx}>
                                  <span>{item.name || `Item ${idx + 1}`}</span>
                                  <span className="ao-item-qty">
                                    × {item.qty || 1}
                                  </span>
                                </div>
                              ))}
                            </div>
                          </div>
                        </div>

                        {/* Status changer */}
                        <div className="ao-select-wrap">
                          <span className="ao-select-label">Update Status</span>
                          <select
                            className="ao-select"
                            value={order.orderStatus}
                            onChange={(e) =>
                              updateOrderStatus(order._id, e.target.value)
                            }
                            style={{
                              borderColor: cfg.border,
                              color: cfg.color,
                            }}
                          >
                            {STATUSES.map((s) => (
                              <option key={s} value={s}>
                                {s}
                              </option>
                            ))}
                          </select>
                        </div>
                      </div>
                    )}
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

export default AdminOrdersPage;
