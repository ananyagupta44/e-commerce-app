import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import { useLocation } from "react-router";
import CheckoutSteps from "../components/CheckoutSteps";
import axios from "axios";
import "../css/PaymentPage.css";
import API_URL from "@/config/api";

const loadRazorpayScript = () => {
  return new Promise((resolve) => {
    const script = document.createElement("script");
    script.src = "https://checkout.razorpay.com/v1/checkout.js";
    script.onload = () => resolve(true);
    script.onerror = () => resolve(false);
    document.body.appendChild(script);
  });
};

const PaymentPage = () => {
  const navigate = useNavigate();
  const [paymentMethod, setPaymentMethod] = useState("COD");
  const [loading, setLoading] = useState(false);

  const submitHandler = async (e) => {
    e.preventDefault();

    // ✅ Read these once at the top, shared by both COD and Razorpay
    const userInfo = JSON.parse(localStorage.getItem("userInfo") ||
sessionStorage.getItem("userInfo"));
    const orderData = JSON.parse(localStorage.getItem("pendingOrder"));

    if (!orderData) {
      alert("Order data missing. Please go back and try again.");
      navigate("/placeorder");
      return;
    }

    if (paymentMethod === "COD") {
      try {
        setLoading(true);

        const { data } = await axios.post(
          `${API_URL}/api/orders`,
          { ...orderData, paymentMethod: "COD" },
          { headers: { Authorization: `Bearer ${userInfo.token}` } },
        );
        localStorage.removeItem("pendingOrder");
        localStorage.removeItem("shipping");
        window.dispatchEvent(new Event("storage"));
        navigate(`/success/${data._id}`);
      } catch (error) {
        console.error(error);
        alert("Order failed. Please try again.");
      } finally {
        setLoading(false);
      }
      return;
    }

    if (paymentMethod === "Credit Card" || paymentMethod === "UPI") {
      try {
        setLoading(true);
        const loaded = await loadRazorpayScript();
        if (!loaded) {
          alert("Razorpay SDK failed to load");
          return;
        }

        const token = userInfo?.token;

        const { data: cartData } = await axios.get(`${API_URL}/api/cart`, {
          headers: { Authorization: `Bearer ${token}` },
        });

        const cartItems =
          cartData.cartItems || cartData.items || cartData || [];
        const totalAmount = cartItems.reduce((acc, item) => {
          const price = Number(item.finalPrice || item.price) || 0;
          const qty = Number(item.qty || item.quantity) || 1;
          return acc + price * qty;
        }, 0);

        if (totalAmount <= 0) {
          alert("Cart total invalid");
          return;
        }

        const { data } = await axios.post(
          `${API_URL}/api/payments/create-order`,
          { amount: totalAmount },
        );

        const options = {
          key: import.meta.env.VITE_RAZORPAY_KEY_ID,
          amount: data.amount,
          currency: data.currency,
          name: "NovaStore",
          description: "Test Transaction",
          order_id: data.id,
          prefill: {
            name: userInfo?.user?.name || "Test User",
            email: userInfo?.user?.email || "test@example.com",
            contact: "9999999999",
          },
          modal: { ondismiss: () => setLoading(false) },
          handler: async (response) => {
            try {
              const { data: order } = await axios.post(
                `${API_URL}/api/orders`,
                {
                  ...orderData,
                  paymentMethod: paymentMethod,
                  razorpayPaymentId: response.razorpay_payment_id,
                  isPaid: true, // ✅
                },
                { headers: { Authorization: `Bearer ${token}` } },
              );
              localStorage.removeItem("pendingOrder");
              localStorage.removeItem("shipping");
              window.dispatchEvent(new Event("storage"));
              navigate(`/success/${order._id}`);
            } catch (error) {
              console.error(error);
              alert("Order saving failed after payment.");
            }
          },
          theme: { color: "#6366f1" },
        };

        const paymentObject = new window.Razorpay(options);
        paymentObject.open();
      } catch (error) {
        console.error(error);
        alert("Payment failed");
      } finally {
        setLoading(false);
      }
    }
  };
  useEffect(() => {
    const shipping = JSON.parse(localStorage.getItem("shipping"));
    if (!shipping) navigate("/shipping");
  }, [navigate]);

  const methods = [
    {
      value: "Credit Card",
      label: "Credit / Debit Card",
      sub: "Visa, Mastercard, Amex",
      icon: "💳",
    },
    {
      value: "UPI",
      label: "UPI",
      sub: "PhonePe, GPay, Paytm",
      icon: "📱",
    },
    {
      value: "COD",
      label: "Cash on Delivery",
      sub: "Pay when you receive",
      icon: "🚚",
    },
  ];

  return (
    <>
      <div className="pay-root">
        <CheckoutSteps
          step1
          step2
          step3
          step4
          containerStyle={{ marginTop: 0 }}
        />

        <div className="pay-card">
          <div className="badge-test">
            <span className="badge-dot" />
            Test mode
          </div>

          <h1 className="pay-title">Payment</h1>
          <p className="pay-subtitle">
            Choose how you'd like to pay for your order
          </p>

          <form onSubmit={submitHandler}>
            {methods.map((m) => (
              <div
                key={m.value}
                className={`method-option ${paymentMethod === m.value ? "selected" : ""}`}
                onClick={() => setPaymentMethod(m.value)}
              >
                <div className="method-icon">{m.icon}</div>
                <div className="method-text">
                  <div className="method-label">{m.label}</div>
                  <div className="method-sub">{m.sub}</div>
                </div>
                <div
                  className={`method-radio ${paymentMethod === m.value ? "checked" : ""}`}
                >
                  <div
                    className={`method-radio-dot ${paymentMethod === m.value ? "visible" : ""}`}
                  />
                </div>
              </div>
            ))}

            {(paymentMethod === "Credit Card" || paymentMethod === "UPI") && (
              <div className="test-box">
                <div className="test-box-title">Test credentials</div>
                <div className="test-row">
                  <span className="test-key">UPI ID</span>
                  <span className="test-val">success@razorpay</span>
                </div>
                <div className="test-row">
                  <span className="test-key">Card number</span>
                  <span className="test-val">5267 3181 8797 5449</span>
                </div>
                <div className="test-row">
                  <span className="test-key">Expiry / CVV</span>
                  <span className="test-val">Any future / Any 3 digits</span>
                </div>
              </div>
            )}

            <button type="submit" className="pay-btn" disabled={loading}>
              {loading ? (
                <>
                  <span className="spinner" />
                  Processing…
                </>
              ) : paymentMethod === "COD" ? (
                "Continue to review →"
              ) : (
                "Pay with Razorpay →"
              )}
            </button>
          </form>
        </div>
      </div>
    </>
  );
};

export default PaymentPage;
