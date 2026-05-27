import axios from "axios";
import { useEffect, useState } from "react";
import { Link } from "react-router-dom";

import "../css/MyOrdersPage.css";

const MyOrdersPage = () => {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  const userInfo =
    JSON.parse(
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
    ) || null;

  useEffect(() => {
    const fetchOrders = async () => {
      try {
        const { data } = await axios.get(
          "http://localhost:5000/api/orders/myorders",
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );
        setOrders(data);
      } catch (error) {
        setError(error.response?.data?.message || "Failed to load orders");
      } finally {
        setLoading(false);
      }
    };

    fetchOrders();
  }, []);

  if (loading) {
    return <div className="orders-loading">Loading orders</div>;
  }

  if (error) {
    return <div className="orders-error">{error}</div>;
  }

  const formatDate = (dateStr) => {
    if (!dateStr) return null;
    return new Date(dateStr).toLocaleDateString("en-US", {
      month: "short",
      day: "numeric",
      year: "numeric",
    });
  };

  return (
    <div className="orders-page">
      {/* ── Header ── */}
      <div className="orders-header">
        <div>
          <p className="orders-eyebrow">Purchase History</p>
          <h1 className="orders-title">My Orders</h1>
          <p className="orders-meta">
            <span>
              {orders.length} order{orders.length !== 1 ? "s" : ""}
            </span>
            <span className="orders-meta-dot" />
            <span>All time</span>
          </p>
        </div>
      </div>

      {/* ── Empty State ── */}
      {orders.length === 0 ? (
        <div className="empty-orders">
          <div className="empty-icon">🛍</div>
          <h2>No orders yet</h2>
          <p>Start exploring our collections and place your first order.</p>
          <Link to="/products" className="shop-btn">
            Explore Products <span>→</span>
          </Link>
        </div>
      ) : (
        <div className="orders-grid">
          {orders.map((order) => (
            <div key={order._id} className="order-card">
              {/* ── Top Row ── */}
              <div className="order-top">
                {/* ID */}
                <div>
                  <p className="order-label">Order ID</p>
                  <p className="order-id">
                    #{order._id.slice(-12).toUpperCase()}
                  </p>
                  {order.createdAt && (
                    <p className="order-date">{formatDate(order.createdAt)}</p>
                  )}
                </div>

                {/* Total */}
                <div>
                  <p className="order-label">Total</p>
                  <p className="order-total">${order.totalPrice.toFixed(2)}</p>
                </div>

                {/* Items count */}
                <div>
                  <p className="order-label">Items</p>
                  <p className="order-date">
                    {order.orderItems.length} item
                    {order.orderItems.length !== 1 ? "s" : ""}
                  </p>
                </div>

                {/* Status */}
                <div>
                  <p className="order-label">Status</p>
                  <div
                    className={`order-status ${
                      order.orderStatus === "Delivered"
                        ? "status-delivered"
                        : "status-processing"
                    }`}
                  >
                    <span className="order-status-dot" />
                    {order.orderStatus}
                  </div>
                </div>
              </div>

              {/* ── Items ── */}
              <div className="order-items">
                {order.orderItems.map((item) => (
                  <div key={item.product} className="order-item">
                    <div className="order-item-img-wrap">
                      <img src={item.image} alt={item.name} />
                    </div>

                    <div className="order-item-content">
                      <h3 className="order-item-name">{item.name}</h3>
                      <p className="order-item-meta">QTY {item.qty}</p>
                    </div>

                    <div className="order-item-price">
                      ${(item.price * item.qty).toFixed(2)}
                    </div>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default MyOrdersPage;
