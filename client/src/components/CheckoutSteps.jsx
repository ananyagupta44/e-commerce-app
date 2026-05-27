const CheckoutSteps = ({
  step1,
  step2,
  step3,
  step4,
  step5,
  containerStyle = {},
  stepStyle = {},
}) => {
  const steps = [
    {
      label: "Cart",
      active: step1,
    },

    {
      label: "Shipping",
      active: step2,
    },

    {
      label: "Payment",
      active: step3,
    },

    {
      label: "Place Order",
      active: step4,
    },

    {
      label: "Success",
      active: step5,
    },
  ];

  return (
    <div
      style={{
        fontFamily: "monospace",
        width: "100%",
        display: "flex",
        justifyContent: "center",
        alignItems: "center",
        flexWrap: "wrap",
        gap: "10px",
        marginBottom: "50px",

        ...containerStyle,
      }}
    >
      {steps.map((step, index) => (
        <div
          key={index}
          style={{
            display: "flex",
            alignItems: "center",
          }}
        >
          {/* STEP */}

          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: "10px",
            }}
          >
            {/* CIRCLE */}

            <div
              style={{
                width: "42px",
                height: "42px",
                borderRadius: "50%",
                background: step.active
                  ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                  : "#1e293b",
                display: "flex",
                justifyContent: "center",
                alignItems: "center",
                color: "white",
                fontWeight: "700",
                fontSize: "18px",
                border: step.active ? "none" : "1px solid #334155",

                ...stepStyle,
              }}
            >
              {index + 1}
            </div>

            {/* LABEL */}

            <span
              style={{
                color: step.active ? "white" : "#94a3b8",
                fontWeight: step.active ? "700" : "500",
                fontSize: "16px",
              }}
            >
              {step.label}
            </span>
          </div>

          {/* LINE */}

          {index !== steps.length - 1 && (
            <div
              style={{
                width: "60px",
                height: "2px",
                background: steps[index + 1].active ? "#6366f1" : "#334155",
                margin: "0 14px",
              }}
            />
          )}
        </div>
      ))}
    </div>
  );
};

export default CheckoutSteps;
