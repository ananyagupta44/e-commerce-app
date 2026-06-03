import "../css/checkoutSteps.css";

const CheckoutSteps = ({ step1, step2, step3, step4, step5 }) => {
  const steps = [
    { label: "Cart", active: step1 },
    { label: "Shipping", active: step2 },
    { label: "Place Order", active: step3 },
    { label: "Payment", active: step4 },
    { label: "Success", active: step5 },
  ];

  return (
    <div className="checkout-steps">
      {steps.map((step, index) => (
        <div key={index} className="checkout-step-wrapper">
          <div className="checkout-step">
            <div className={`checkout-circle ${step.active ? "active" : ""}`}>
              {index + 1}
            </div>

            <span className={`checkout-label ${step.active ? "active" : ""}`}>
              {step.label}
            </span>
          </div>

          {index !== steps.length - 1 && (
            <div
              className={`checkout-line ${
                steps[index + 1].active ? "active" : ""
              }`}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
