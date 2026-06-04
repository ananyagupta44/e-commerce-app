import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

import "../css/OrderSuccessPage.css";
import ParticleBackground from "@/components/ParticleBackground";

const OrderSuccessPage = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);

  return (
    <>
      <ParticleBackground />
      <div className="success-page">
        <CheckoutSteps step1 step2 step3 step4 step5 />

        <div className="success-container">
          <div className="success-card">
            <div className="success-icon">
              <span>✓</span>
            </div>

            <p className="success-tag">ORDER CONFIRMED</p>

            <h1 className="success-title">Your Order Has Been Placed</h1>

            <p className="success-subtitle">
              Thank you for shopping with NOVA. Your order is now being
              processed.
            </p>

            <div className="success-info-grid">
              <div className="success-order-id">
                <p className="success-card-label">Order ID</p>
                <span>{id}</span>
              </div>

              <div className="success-delivery-card">
                <div className="delivery-icon">🚚</div>

                <div>
                  <p className="success-card-label">Estimated Delivery</p>

                  <h3>3 - 5 Business Days</h3>
                </div>
              </div>
            </div>

            <div className="success-info">
              You will receive updates about your order status and shipping
              progress through your account.
            </div>

            <div className="success-actions">
              <Link to="/products">
                <button className="success-primary-btn">
                  Continue Shopping
                </button>
              </Link>

              <Link to="/myorders">
                <button className="success-secondary-btn">View Orders</button>
              </Link>
            </div>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
