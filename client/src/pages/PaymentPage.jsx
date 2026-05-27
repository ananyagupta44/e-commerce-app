import { useEffect, useState } from "react";

import { useNavigate } from "react-router-dom";
import CheckoutSteps from "../components/CheckoutSteps";

const PaymentPage = () => {
  const navigate = useNavigate();

  // DEFAULT PAYMENT METHOD
  const [paymentMethod, setPaymentMethod] = useState("COD");

  // SUBMIT
  const submitHandler = (e) => {
    e.preventDefault();

    localStorage.setItem("paymentMethod", paymentMethod);

    navigate("/placeorder");
  };

  useEffect(() => {
    const shipping = JSON.parse(localStorage.getItem("shipping"));

    if (!shipping) {
      navigate("/shipping");
    }
  }, [navigate]);

  return (
    <>
      <CheckoutSteps
        step1
        step2
        step3
        containerStyle={{
          marginTop: "50px",
        }}
      />
      <div
        style={{
          minHeight: "100vh",
          background: "#020617",
          color: "white",
          display: "flex",
          justifyContent: "center",
          alignItems: "center",
          padding: "40px",
        }}
      >
        <form
          onSubmit={submitHandler}
          style={{
            width: "100%",
            maxWidth: "600px",
            background: "#0f172a",
            padding: "40px",
            borderRadius: "24px",
            border: "1px solid #1e293b",
          }}
        >
          {/* TITLE */}

          <h1
            style={{
              fontSize: "42px",
              fontWeight: "800",
              marginBottom: "40px",
              textAlign: "center",
            }}
          >
            Payment Method
          </h1>

          {/* CREDIT CARD */}

          <label style={labelStyle}>
            <input
              type="radio"
              name="payment"
              value="Credit Card"
              checked={paymentMethod === "Credit Card"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <span style={textStyle}>💳 Credit Card</span>
          </label>

          {/* UPI */}

          <label style={labelStyle}>
            <input
              type="radio"
              name="payment"
              value="UPI"
              checked={paymentMethod === "UPI"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <span style={textStyle}>📱 UPI</span>
          </label>

          {/* PAYPAL */}

          <label style={labelStyle}>
            <input
              type="radio"
              name="payment"
              value="PayPal"
              checked={paymentMethod === "PayPal"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <span style={textStyle}>🅿️ PayPal</span>
          </label>

          {/* COD */}

          <label style={labelStyle}>
            <input
              type="radio"
              name="payment"
              value="COD"
              checked={paymentMethod === "COD"}
              onChange={(e) => setPaymentMethod(e.target.value)}
            />

            <span style={textStyle}>🚚 Cash on Delivery</span>
          </label>

          {/* BUTTON */}

          <button
            type="submit"
            style={{
              width: "100%",
              background: "linear-gradient(135deg,#6366f1,#8b5cf6)",
              border: "none",
              color: "white",
              padding: "18px",
              borderRadius: "14px",
              fontSize: "18px",
              fontWeight: "700",
              cursor: "pointer",
              marginTop: "30px",
            }}
          >
            Continue
          </button>
        </form>
      </div>
    </>
  );
};

// LABEL STYLE
const labelStyle = {
  display: "flex",

  alignItems: "center",

  gap: "15px",

  background: "#1e293b",

  padding: "18px",

  borderRadius: "14px",

  marginBottom: "20px",

  cursor: "pointer",
};

// TEXT STYLE
const textStyle = {
  fontSize: "18px",

  fontWeight: "600",
};

export default PaymentPage;
