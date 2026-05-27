import CheckoutSteps from "../components/CheckoutSteps";
import { useEffect } from "react";
import { Link, useParams } from "react-router-dom";

const OrderSuccessPage = () => {
  const { id } = useParams();

  useEffect(() => {
    window.scrollTo(0, 0);
  }, []);
  return (
    <>
      <CheckoutSteps
        step1
        step2
        step3
        step4
        step5
        containerStyle={{
          marginTop: "50px",
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: "linear-gradient(to bottom,#020617,#0f172a)",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        {/* CARD */}

        <div
          style={{
            width: "100%",
            maxWidth: "700px",
            background: "#0f172a",
            border: "1px solid #1e293b",
            borderRadius: "30px",
            padding: "60px 40px",
            textAlign: "center",
          }}
        >
          {/* SUCCESS ICON */}

          <div
            style={{
              width: "120px",
              height: "120px",
              margin: "0 auto 30px",
              borderRadius: "50%",
              background: "linear-gradient(135deg,#22c55e,#16a34a)",
              display: "flex",
              justifyContent: "center",
              alignItems: "center",
              fontSize: "60px",
            }}
          >
            ✓
          </div>

          {/* TITLE */}

          <h1
            style={{
              fontSize: "52px",
              fontWeight: "800",
              marginBottom: "20px",
            }}
          >
            Order Placed!
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "18px",
              marginBottom: "30px",
            }}
          >
            Order ID: <strong>{id}</strong>
          </p>

          {/* MESSAGE */}

          <p
            style={{
              fontSize: "20px",
              color: "#94a3b8",
              lineHeight: "1.8",
              marginBottom: "40px",
            }}
          >
            Thank you for shopping with NOVA.
            <br />
            Your order has been placed successfully and is being processed.
          </p>

          {/* INFO BOX */}

          <div
            style={{
              background: "#1e293b",
              borderRadius: "18px",
              padding: "25px",
              marginBottom: "40px",
            }}
          >
            <h3
              style={{
                fontSize: "24px",
                marginBottom: "12px",
              }}
            >
              Estimated Delivery
            </h3>

            <p
              style={{
                color: "#cbd5e1",
                fontSize: "18px",
              }}
            >
              3 - 5 Business Days 🚚
            </p>
          </div>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "20px",
              flexWrap: "wrap",
            }}
          >
            {/* CONTINUE SHOPPING */}

            <Link
              to="/products"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                style={{
                  padding: "18px 32px",
                  borderRadius: "14px",
                  border: "none",
                  background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                Continue Shopping
              </button>
            </Link>

            {/* VIEW ORDERS */}

            <Link
              to="/myorders"
              style={{
                textDecoration: "none",
              }}
            >
              <button
                style={{
                  padding: "18px 32px",
                  borderRadius: "14px",
                  border: "1px solid #334155",
                  background: "transparent",
                  color: "white",
                  fontSize: "18px",
                  fontWeight: "700",
                  cursor: "pointer",
                }}
              >
                View Orders
              </button>
            </Link>
          </div>
        </div>
      </div>
    </>
  );
};

export default OrderSuccessPage;
