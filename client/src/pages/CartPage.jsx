import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import getImageUrl from "../utils/getImageUrl";

import "../css/CartPage.css";

const CartPage = () => {
  const [cartItems, setCartItems] = useState([]);
  const [showBreakdown, setShowBreakdown] = useState(false);

  const navigate = useNavigate();

  const getUserInfo = () =>
    JSON.parse(
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
    );

  // ── Load Cart ──
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const userInfo = getUserInfo();
        const { data } = await axios.get("http://localhost:5000/api/cart", {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCartItems(data);
      } catch (error) {
        console.log(error);
      }
    };
    fetchCart();
  }, []);

  // ── Remove Item ──
  const removeFromCart = async (id) => {
    try {
      const userInfo = getUserInfo();
      const { data } = await axios.delete(
        `http://localhost:5000/api/cart/${id}`,
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setCartItems(data);
      window.dispatchEvent(new Event("storage"));
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  // ── Update Quantity ──
  const updateQty = async (item, qty) => {
    try {
      const userInfo = getUserInfo();
      const { data } = await axios.post(
        "http://localhost:5000/api/cart",
        {
          product: item.product,
          name: item.name,
          images: item.images,
          price: item.price,
          qty,
          stock: item.stock,
          originalPrice: item.originalPrice,
          discount: item.discount,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setCartItems(data);
      window.dispatchEvent(new Event("cartUpdated"));
    } catch (error) {
      console.log(error);
    }
  };

  // ── Totals ──
  const originalTotal = cartItems.reduce(
    (acc, item) => acc + (item.originalPrice || item.price) * item.qty,
    0,
  );
  const discountedTotal = cartItems.reduce(
    (acc, item) => acc + item.price * item.qty,
    0,
  );
  const totalSavings = originalTotal - discountedTotal;
  const totalQty = cartItems.reduce((acc, item) => acc + item.qty, 0);

  return (
    <div className="cart-page">
      <CheckoutSteps step1 />

      {/* ── Back Link ── */}
      <Link to="/products" className="cart-back-link">
        ← Back to Shopping
      </Link>

      {/* ── Header ── */}
      <div className="cart-header">
        <div>
          <p className="cart-eyebrow">Your Bag</p>
          <h1 className="cart-title">Shopping Cart</h1>
        </div>
        <p className="cart-count">
          {totalQty} item{totalQty !== 1 ? "s" : ""}
        </p>
      </div>

      {/* ── Empty ── */}
      {cartItems.length === 0 ? (
        <div className="cart-empty">
          <div className="cart-empty-icon">🛒</div>
          <h2>Your cart is empty</h2>
          <p>Add some items to get started.</p>
          <Link to="/products" className="cart-shop-btn">
            Explore Products →
          </Link>
        </div>
      ) : (
        <div className="cart-layout">
          {/* ── Left: Items ── */}
          <div className="cart-items-list">
            {cartItems.map((item) => (
              <div key={item.product} className="cart-item">
                <img
                  src={getImageUrl(item.images?.[0] || item.image)}
                  alt={item.name}
                  className="cart-item-img"
                />

                <div className="cart-item-body">
                  <h2 className="cart-item-name">{item.name}</h2>

                  {/* Price row */}
                  <div className="cart-item-price-row">
                    <span className="cart-item-price">
                      ${item.price.toFixed(2)}
                    </span>
                    {item.discount > 0 && (
                      <>
                        <span className="cart-item-original">
                          ${(item.originalPrice || item.price).toFixed(2)}
                        </span>

                        <span className="cart-item-badge">
                          {item.discount}% OFF
                        </span>
                      </>
                    )}
                  </div>

                  {/* Qty controls */}
                  <div className="qty-controls">
                    <button
                      className="qty-btn"
                      disabled={item.qty <= 1}
                      onClick={() => updateQty(item, item.qty - 1)}
                      aria-label="Decrease quantity"
                    >
                      −
                    </button>
                    <div className="qty-divider" />
                    <span className="qty-value">{item.qty}</span>
                    <div className="qty-divider" />
                    <button
                      className="qty-btn"
                      disabled={item.qty >= item.stock}
                      onClick={() => updateQty(item, item.qty + 1)}
                      aria-label="Increase quantity"
                    >
                      +
                    </button>
                  </div>
                </div>

                {/* Remove + subtotal */}
                <div className="cart-item-remove">
                  <button
                    className="remove-btn"
                    onClick={() => removeFromCart(item.product)}
                    aria-label="Remove item"
                    title="Remove"
                  >
                    ✕
                  </button>
                  <div className="cart-item-subtotal">
                    SUBTOTAL
                    <span>${(item.price * item.qty).toFixed(2)}</span>
                  </div>
                </div>
              </div>
            ))}
          </div>

          {/* ── Right: Summary ── */}
          <div className="cart-summary">
            <h2 className="summary-title">Order Summary</h2>

            <div className="summary-row">
              <span className="summary-label">Items</span>
              <span className="summary-value">{totalQty}</span>
            </div>

            <div className="summary-row">
              <span className="summary-label">Original Total</span>
              <span className="summary-value">${originalTotal.toFixed(2)}</span>
            </div>

            <hr className="summary-divider" />

            <div className="summary-row">
              <span className="summary-total-label">Total</span>
              <span className="summary-total-value">
                ${discountedTotal.toFixed(2)}
              </span>
            </div>

            {/* Savings badge */}
            {totalSavings > 0 && (
              <div className="savings-badge">
                <span className="savings-badge-label">You Save</span>
                <span className="savings-badge-value">
                  −${totalSavings.toFixed(2)}
                </span>
              </div>
            )}

            {/* Breakdown toggle */}
            <button
              className="breakdown-toggle"
              onClick={() => setShowBreakdown((p) => !p)}
            >
              Price Breakdown
              <span
                className={`breakdown-toggle-arrow ${showBreakdown ? "open" : ""}`}
              >
                ▾
              </span>
            </button>

            {/* Breakdown panel */}
            {showBreakdown && (
              <div className="breakdown-panel">
                {cartItems.map((item) => {
                  const origPrice = item.originalPrice || item.price;
                  const origTotal = origPrice * item.qty;
                  const finalTotal = item.price * item.qty;
                  const saved = origTotal - finalTotal;

                  return (
                    <div key={item.product} className="breakdown-item">
                      <p className="breakdown-item-name">{item.name}</p>

                      <div className="breakdown-row">
                        <span className="breakdown-row-label">
                          Original ({item.qty} × ${origPrice.toFixed(2)})
                        </span>
                        <span className="breakdown-row-value">
                          ${origTotal.toFixed(2)}
                        </span>
                      </div>

                      {item.discount > 0 && (
                        <div className="breakdown-row">
                          <span className="breakdown-row-label">
                            Discount ({item.discount}% off)
                          </span>
                          <span className="breakdown-row-value savings">
                            −${saved.toFixed(2)}
                          </span>
                        </div>
                      )}

                      <div className="breakdown-row">
                        <span className="breakdown-row-label">
                          Final ({item.qty} × ${item.price.toFixed(2)})
                        </span>
                        <span className="breakdown-row-value final">
                          ${finalTotal.toFixed(2)}
                        </span>
                      </div>
                    </div>
                  );
                })}

                {/* Totals summary */}
                <div className="breakdown-totals">
                  <div className="breakdown-row">
                    <span className="breakdown-row-label">Original Total</span>
                    <span className="breakdown-row-value">
                      ${originalTotal.toFixed(2)}
                    </span>
                  </div>
                  {totalSavings > 0 && (
                    <div className="breakdown-row">
                      <span className="breakdown-row-label">Total Savings</span>
                      <span className="breakdown-row-value savings">
                        −${totalSavings.toFixed(2)}
                      </span>
                    </div>
                  )}
                  <hr
                    className="summary-divider"
                    style={{ margin: "12px 0" }}
                  />
                  <div className="breakdown-row">
                    <span className="breakdown-grand-label">Final Total</span>
                    <span className="breakdown-grand-value">
                      ${discountedTotal.toFixed(2)}
                    </span>
                  </div>
                </div>
              </div>
            )}

            {/* Checkout */}
            <button
              className="checkout-btn"
              onClick={() => navigate("/shipping")}
            >
              Proceed to Checkout
              <span className="checkout-btn-arrow">→</span>
            </button>

            <p className="secure-notice">🔒 Secure checkout</p>
          </div>
        </div>
      )}
    </div>
  );
};

export default CartPage;
