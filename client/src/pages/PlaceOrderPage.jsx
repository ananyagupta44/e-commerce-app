import axios from "axios";
import { useMemo, useState, useEffect } from "react";
import { Link, useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";
import getImageUrl from "../utils/getImageUrl";

import "../css/PlaceOrderPage.css";
import API_URL from "@/config/api";
import ParticleBackground from "@/components/ParticleBackground";

const PlaceOrderPage = () => {
  const navigate = useNavigate();

  const [cartItems, setCartItems] = useState([]);
  const [cartLoading, setCartLoading] = useState(true);
  const [loading, setLoading] = useState(false);
  const [orderPlaced, setOrderPlaced] = useState(false);

  const [shippingAddress] = useState(
    JSON.parse(localStorage.getItem("shipping")) || {},
  );
  const [paymentMethod] = useState(
    localStorage.getItem("paymentMethod") || "COD",
  );

  const userInfo =
    JSON.parse(
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
    ) || null;

  // ── Route protection ──
  useEffect(() => {
    if (!paymentMethod && !orderPlaced)
      navigate("/payment", { state: { orderId: data._id } });
    if (!cartLoading && cartItems.length === 0 && !orderPlaced)
      navigate("/cart");
  }, [navigate, cartItems, orderPlaced, paymentMethod, cartLoading]);

  // ── Fetch cart ──
  useEffect(() => {
    const fetchCart = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${userInfo.token}` },
        });
        setCartItems(data);
      } catch (error) {
        console.log(error);
      } finally {
        setCartLoading(false);
      }
    };
    fetchCart();
  }, []);

  // ── Price calculations ──
  const itemsPrice = useMemo(
    () => cartItems.reduce((acc, item) => acc + item.price * item.qty, 0),
    [cartItems],
  );
  const shippingPrice = itemsPrice > 1000 ? 0 : 100;
  const taxPrice = Number((itemsPrice * 0.18).toFixed(2));
  const totalPrice = itemsPrice + shippingPrice + taxPrice;

  // ── Place order ──
  const placeOrderHandler = async () => {
    try {
      setLoading(true);

      // ✅ Don't hit the DB here — just save order data and move to payment
      const orderData = {
        orderItems: cartItems,
        shippingAddress,
        itemsPrice,
        shippingPrice,
        taxPrice,
        totalPrice,
      };

      localStorage.setItem("pendingOrder", JSON.stringify(orderData));
      navigate("/payment");
    } catch (error) {
      console.log(error);
    } finally {
      setLoading(false);
    }
  };

  return (
    <>
      <ParticleBackground />
      <div className="placeorder-page">
        <CheckoutSteps step1 step2 step3 />

        {/* ── Header ── */}
        <div className="placeorder-header">
          <p className="placeorder-eyebrow">Final Step</p>
          <h1 className="placeorder-title">Place Order</h1>
        </div>

        <div className="placeorder-layout">
          {/* ── Left Column ── */}
          <div className="placeorder-left">
            {/* Shipping */}
            <div className="po-section">
              <p className="po-section-label">Shipping</p>
              <div className="po-info-row">
                <span className="po-info-key">Name</span>
                <span className="po-info-value">
                  {shippingAddress.fullName}
                </span>
              </div>
              <div className="po-info-row">
                <span className="po-info-key">Address</span>
                <span className="po-info-value">
                  {shippingAddress.address}, {shippingAddress.city},{" "}
                  {shippingAddress.postalCode}, {shippingAddress.country}
                </span>
              </div>
            </div>

            {/* Payment */}
            <div className="po-section">
              <p className="po-section-label">Payment</p>
              <div className="po-info-row">
                <span className="po-info-key">Method</span>
                <span className="po-info-value">
                  <span className="payment-badge">Select in next step</span>
                </span>
              </div>
            </div>

            {/* Order Items */}
            <div className="po-section">
              <p className="po-section-label">
                Order Items ({cartItems.length})
              </p>

              {cartItems.length === 0 ? (
                <p
                  style={{
                    color: "#71717a",
                    fontFamily: "'DM Mono',monospace",
                    fontSize: "13px",
                  }}
                >
                  Cart is empty
                </p>
              ) : (
                <div className="po-items-list">
                  {cartItems.map((item) => (
                    <div key={item.product} className="po-item">
                      <img
                        src={getImageUrl(item.images?.[0] || item.image)}
                        alt={item.name}
                        className="po-item-img"
                      />
                      <Link
                        to={`/product/${item.product}`}
                        className="po-item-name"
                      >
                        {item.name}
                      </Link>
                      <div className="po-item-calc">
                        ( {item.qty} × ₹{item.price.toFixed(2)} = ₹
                        {(item.qty * item.price).toFixed(2)} )
                      </div>
                    </div>
                  ))}
                </div>
              )}
            </div>
          </div>

          {/* ── Right: Summary ── */}
          <div className="po-summary">
            <h2 className="po-summary-title">Order Summary</h2>

            <div className="po-summary-row">
              <span className="po-summary-label">Items</span>
              <span className="po-summary-value">₹{itemsPrice.toFixed(2)}</span>
            </div>

            <div className="po-summary-row">
              <span className="po-summary-label">Shipping</span>
              {shippingPrice === 0 ? (
                <span className="po-summary-free">Free</span>
              ) : (
                <span className="po-summary-value">
                  ₹{shippingPrice.toFixed(2)}
                </span>
              )}
            </div>

            <div className="po-summary-row">
              <span className="po-summary-label">Tax (18%)</span>
              <span className="po-summary-value">₹{taxPrice.toFixed(2)}</span>
            </div>

            <hr className="po-summary-divider" />

            <div className="po-summary-row total">
              <span className="po-summary-label">Total</span>
              <span className="po-summary-value">₹{totalPrice.toFixed(2)}</span>
            </div>

            {shippingPrice === 0 && (
              <p className="free-shipping-note">✓ Free shipping applied</p>
            )}

            <button
              className="place-order-btn"
              onClick={placeOrderHandler}
              disabled={cartItems.length === 0 || loading}
            >
              {loading ? (
                <>
                  <span className="btn-spinner" />
                  Placing Order...
                </>
              ) : (
                <>
                  Place Order
                  <span className="place-order-btn-arrow">→</span>
                </>
              )}
            </button>
          </div>
        </div>
      </div>
    </>
  );
};

export default PlaceOrderPage;
