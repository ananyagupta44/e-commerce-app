import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProfilePage.css";

const ProfilePage = () => {
  const navigate = useNavigate();
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );

  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [addresses, setAddresses] = useState([]);
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);

  const [editName, setEditName] = useState("");
  const [editEmail, setEditEmail] = useState("");
  const [editPassword, setEditPassword] = useState("");
  const [editConfirm, setEditConfirm] = useState("");
  const [editMsg, setEditMsg] = useState({ type: "", text: "" });
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    if (!userInfo) {
      navigate("/login");
      return;
    }
    const fetchAll = async () => {
      try {
        const headers = { Authorization: `Bearer ${userInfo.token}` };
        const [profileRes, ordersRes, addrRes] = await Promise.all([
          axios.get("http://localhost:5000/api/users/profile", { headers }),
          axios.get("http://localhost:5000/api/orders/myorders", { headers }),
          axios.get("http://localhost:5000/api/users/addresses", { headers }),
        ]);
        setProfile(profileRes.data);
        setEditName(profileRes.data.name || "");
        setEditEmail(profileRes.data.email || "");
        setOrders(ordersRes.data);
        setAddresses(addrRes.data);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };
    fetchAll();
  }, []);

  const saveProfile = async () => {
    if (editPassword && editPassword !== editConfirm) {
      setEditMsg({ type: "error", text: "Passwords do not match" });
      return;
    }
    try {
      setSaving(true);
      const headers = { Authorization: `Bearer ${userInfo.token}` };
      const payload = { name: editName, email: editEmail };
      if (editPassword) payload.password = editPassword;
      const { data } = await axios.put(
        "http://localhost:5000/api/users/profile",
        payload,
        { headers },
      );
      setProfile(data);
      setEditMsg({ type: "success", text: "Profile updated successfully" });
      setEditPassword("");
      setEditConfirm("");
      const updated = {
        ...userInfo,
        user: { ...userInfo.user, name: data.name, email: data.email },
      };
      localStorage.setItem("userInfo", JSON.stringify(updated));
    } catch (err) {
      setEditMsg({
        type: "error",
        text: err.response?.data?.message || "Update failed",
      });
    } finally {
      setSaving(false);
    }
  };

  const getInitials = (name) =>
    name
      ? name
          .split(" ")
          .map((w) => w[0])
          .join("")
          .toUpperCase()
          .slice(0, 2)
      : "U";

  const statusColor = (s) =>
    ({
      Pending: "#f59e0b",
      Processing: "#818cf8",
      Shipped: "#06b6d4",
      Delivered: "#22c55e",
      Cancelled: "#ef4444",
    })[s] || "#94a3b8";

  if (loading)
    return (
      <div
        style={{
          minHeight: "100vh",
          display: "flex",
          alignItems: "center",
          justifyContent: "center",
        }}
      >
        <div
          style={{
            color: "#818cf8",
            fontFamily: "DM Mono, monospace",
            letterSpacing: 2,
            fontSize: 13,
          }}
        >
          LOADING PROFILE…
        </div>
      </div>
    );

  const tabs = [
    { id: "overview", label: "Overview", icon: "◈" },
    { id: "orders", label: "Orders", icon: "◎" },
    { id: "addresses", label: "Addresses", icon: "◉" },
    { id: "edit", label: "Edit", icon: "✎" },
  ];

  const totalSpent = orders.reduce((acc, o) => acc + (o.totalPrice || 0), 0);

  return (
    <>
      <div className="prof-root">
        {/* ── BANNER ── */}
        <div className="prof-banner">
          <div className="prof-banner-grid" />
          <div className="prof-banner-orb1" />
          <div className="prof-banner-orb2" />
          <span className="prof-banner-text">NovaStore · Member Profile</span>
        </div>

        {/* ── AVATAR ROW ── */}
        <div className="prof-avatar-row">
          <div className="prof-avatar">
            {getInitials(profile?.name || userInfo?.user?.name)}
          </div>
          <div className="prof-identity">
            <h1 className="prof-name">
              {profile?.name || userInfo?.user?.name}
            </h1>
            <p className="prof-email">
              {profile?.email || userInfo?.user?.email}
            </p>
          </div>
          <div style={{ paddingBottom: 10 }}>
            <span
              className={`role-pill ${profile?.role === "admin" ? "admin" : "user"}`}
            >
              {profile?.role || "user"}
            </span>
          </div>
        </div>

        {/* ── STATS ── */}
        <div className="prof-stats">
          {[
            { val: orders.length, label: "Total Orders" },
            {
              val: orders.filter((o) => o.isDelivered).length,
              label: "Delivered",
            },
            { val: addresses.length, label: "Addresses" },
            {
              val: `₹${totalSpent >= 1000 ? (totalSpent / 1000).toFixed(1) + "k" : totalSpent.toFixed(0)}`,
              label: "Total Spent",
            },
          ].map(({ val, label }) => (
            <div className="prof-stat-card" key={label}>
              <div className="prof-stat-val">{val}</div>
              <div className="prof-stat-label">{label}</div>
            </div>
          ))}
        </div>

        {/* ── TABS ── */}
        <div className="prof-tabs">
          {tabs.map((tab) => (
            <button
              key={tab.id}
              className={`prof-tab ${activeTab === tab.id ? "active" : ""}`}
              onClick={() => setActiveTab(tab.id)}
            >
              <span style={{ fontSize: 13 }}>{tab.icon}</span>
              {tab.label}
            </button>
          ))}
        </div>

        {/* ── OVERVIEW ── */}
        {activeTab === "overview" && (
          <div className="prof-panel">
            <div className="overview-grid">
              <div className="section-card">
                <p className="section-card-title">Account Info</p>
                {[
                  ["Name", profile?.name],
                  ["Email", profile?.email],
                  ["Role", profile?.role],
                  [
                    "Member Since",
                    profile?.createdAt
                      ? new Date(profile.createdAt).toLocaleDateString(
                          "en-IN",
                          { month: "long", year: "numeric" },
                        )
                      : "—",
                  ],
                ].map(([k, v]) => (
                  <div className="overview-row" key={k}>
                    <span className="overview-key">{k}</span>
                    <span className="overview-val">{v}</span>
                  </div>
                ))}
              </div>
              <div className="section-card">
                <p className="section-card-title">Order Breakdown</p>
                {[
                  [
                    "Pending",
                    orders.filter((o) => o.orderStatus === "Pending").length,
                  ],
                  [
                    "Processing",
                    orders.filter((o) => o.orderStatus === "Processing").length,
                  ],
                  [
                    "Shipped",
                    orders.filter((o) => o.orderStatus === "Shipped").length,
                  ],
                  ["Delivered", orders.filter((o) => o.isDelivered).length],
                  ["Total Spent", `₹${totalSpent.toFixed(2)}`],
                ].map(([k, v]) => (
                  <div className="overview-row" key={k}>
                    <span className="overview-key">{k}</span>
                    <span className="overview-val">{v}</span>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ── ORDERS ── */}
        {activeTab === "orders" && (
          <div className="prof-panel">
            {orders.length === 0 ? (
              <div className="empty-state">NO ORDERS YET</div>
            ) : (
              orders.map((order) => (
                <div
                  key={order._id}
                  className="order-card"
                  onClick={() => navigate(`/success/${order._id}`)}
                >
                  <div className="order-top">
                    <span className="order-id">
                      # {order._id.slice(-10).toUpperCase()}
                    </span>
                    <span
                      className="order-status"
                      style={{
                        color: statusColor(order.orderStatus),
                        background: `${statusColor(order.orderStatus)}18`,
                        border: `1px solid ${statusColor(order.orderStatus)}35`,
                      }}
                    >
                      {order.orderStatus || "Pending"}
                    </span>
                  </div>
                  <div className="order-meta">
                    {[
                      [
                        "Date",
                        new Date(order.createdAt).toLocaleDateString("en-IN", {
                          day: "numeric",
                          month: "short",
                          year: "numeric",
                        }),
                      ],
                      ["Total", `₹${order.totalPrice?.toFixed(2)}`],
                      ["Items", order.orderItems?.length || 0],
                      ["Payment", order.paymentMethod],
                      ["Paid", order.isPaid ? "✓ Yes" : "✗ No"],
                    ].map(([label, val]) => (
                      <div key={label}>
                        <div className="order-meta-label">{label}</div>
                        <div
                          className="order-meta-val"
                          style={
                            label === "Paid"
                              ? { color: order.isPaid ? "#4ade80" : "#f87171" }
                              : {}
                          }
                        >
                          {val}
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── ADDRESSES ── */}
        {activeTab === "addresses" && (
          <div className="prof-panel">
            {addresses.length === 0 ? (
              <div className="empty-state">NO SAVED ADDRESSES</div>
            ) : (
              addresses.map((addr, i) => (
                <div key={i} className="addr-card">
                  <div className="addr-icon">⌖</div>
                  <div>
                    <p className="addr-name">{addr.fullName}</p>
                    <p className="addr-detail">
                      {addr.address}
                      <br />
                      {addr.city}, {addr.postalCode}
                      <br />
                      {addr.country}
                    </p>
                  </div>
                </div>
              ))
            )}
          </div>
        )}

        {/* ── EDIT ── */}
        {activeTab === "edit" && (
          <div className="prof-panel">
            <div className="section-card">
              {editMsg.text && (
                <div className={`edit-msg ${editMsg.type}`}>{editMsg.text}</div>
              )}

              <p className="edit-section-title">Personal Information</p>
              <div className="edit-row">
                <div className="edit-field">
                  <label className="edit-label">Full Name</label>
                  <input
                    className="edit-input"
                    value={editName}
                    onChange={(e) => {
                      setEditName(e.target.value);
                      setEditMsg({ type: "", text: "" });
                    }}
                    placeholder="Your name"
                  />
                </div>
                <div className="edit-field">
                  <label className="edit-label">Email Address</label>
                  <input
                    className="edit-input"
                    type="email"
                    value={editEmail}
                    onChange={(e) => {
                      setEditEmail(e.target.value);
                      setEditMsg({ type: "", text: "" });
                    }}
                    placeholder="your@email.com"
                  />
                </div>
              </div>

              <hr className="edit-divider" />

              <p className="edit-section-title">Change Password</p>
              <p
                style={{
                  fontSize: 13,
                  color: "#334155",
                  marginBottom: 18,
                  fontWeight: 300,
                  fontFamily: "DM Mono, monospace",
                }}
              >
                Leave blank to keep current password
              </p>
              <div className="edit-row">
                <div className="edit-field">
                  <label className="edit-label">New Password</label>
                  <input
                    className="edit-input"
                    type="password"
                    value={editPassword}
                    onChange={(e) => {
                      setEditPassword(e.target.value);
                      setEditMsg({ type: "", text: "" });
                    }}
                    placeholder="••••••••"
                  />
                </div>
                <div className="edit-field">
                  <label className="edit-label">Confirm Password</label>
                  <input
                    className="edit-input"
                    type="password"
                    value={editConfirm}
                    onChange={(e) => {
                      setEditConfirm(e.target.value);
                      setEditMsg({ type: "", text: "" });
                    }}
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                className="edit-save-btn"
                onClick={saveProfile}
                disabled={saving}
              >
                {saving ? "Saving…" : "Save Changes →"}
              </button>
            </div>
          </div>
        )}
      </div>
    </>
  );
};

export default ProfilePage;
