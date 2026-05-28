import { useState } from "react";

import { Link } from "react-router-dom";

import "../css/FloatingAIButton.css";

const FloatingAIButton = () => {
  const [open, setOpen] = useState(false);

  return (
    <>
      {/* FLOATING BUTTON */}

      <button className="floating-ai-btn" onClick={() => setOpen(!open)}>
        ✨
      </button>

      {/* POPUP */}

      <div
        className={`floating-ai-popup ${open ? "floating-ai-popup-open" : ""}`}
      >
        {/* TOP */}

        <div className="floating-ai-top">
          <div>
            <p className="floating-ai-label">NOVA AI</p>

            <h3>E-commerce Assistant</h3>
          </div>

          <button className="floating-ai-close" onClick={() => setOpen(false)}>
            ✕
          </button>
        </div>

        {/* CONTENT */}

        <div className="floating-ai-content">
          <div className="floating-ai-message">
            Hi Admin! Need help with products, sales, inventory, analytics, or
            marketing?
          </div>

          <div className="floating-ai-features">
            <div>Product Insights</div>
            <div>Sales Analytics</div>
            <div>AI Descriptions</div>
            <div>Marketing Ideas</div>
          </div>

          <Link to="/admin/ai" className="floating-ai-open-btn">
            Open AI Assistant →
          </Link>
        </div>
      </div>
    </>
  );
};

export default FloatingAIButton;
