import { useNavigate } from "react-router-dom";

const HomePage = () => {
  const navigate = useNavigate();

  return (
    <div className="w-full min-h-screen bg-gradient-to-b from-slate-950 to-slate-900 text-white">
      {/* HERO SECTION */}

      <section
        style={{
          width: "100%",
          padding: "80px 60px",
          display: "flex",
          alignItems: "center",
          justifyContent: "space-between",
          gap: 60,
          flexWrap: "wrap",
        }}
      >
        {/* LEFT SIDE */}

        <div
          style={{
            flex: "1 1 500px",
          }}
        >
          {/* BADGE */}

          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,

              background: "rgba(99,102,241,0.1)",

              border: "1px solid rgba(99,102,241,0.25)",

              borderRadius: 20,

              padding: "6px 14px",

              marginBottom: 24,
            }}
          >
            <span
              style={{
                width: 8,
                height: 8,
                background: "#6366f1",
                borderRadius: "50%",
              }}
            />

            <span
              style={{
                fontSize: 12,
                color: "#a5b4fc",
                fontWeight: 600,
                letterSpacing: 0.5,
              }}
            >
              NEW SEASON ARRIVALS
            </span>
          </div>

          {/* HEADING */}

          <h1
            style={{
              fontWeight: 800,
              fontSize: "clamp(42px,6vw,80px)",
              lineHeight: 1.1,
              marginBottom: 24,
            }}
          >
            Discover
            <br />
            <span
              style={{
                background: "linear-gradient(135deg,#6366f1,#c4b5fd)",

                WebkitBackgroundClip: "text",

                WebkitTextFillColor: "transparent",
              }}
            >
              Premium
            </span>
            <br />
            Collections
          </h1>

          {/* DESCRIPTION */}

          <p
            style={{
              color: "#94a3b8",
              fontSize: 18,
              lineHeight: 1.8,
              marginBottom: 36,
              maxWidth: 500,
            }}
          >
            Explore curated products across fashion, electronics, furniture, and
            lifestyle — delivered fast, priced right.
          </p>

          {/* BUTTONS */}

          <div
            style={{
              display: "flex",
              gap: 16,
              flexWrap: "wrap",
            }}
          >
            <button
              onClick={() => navigate("/products")}
              style={{
                background: "linear-gradient(135deg,#6366f1,#8b5cf6)",

                border: "none",

                color: "white",

                padding: "14px 28px",

                borderRadius: 14,

                fontSize: 16,

                fontWeight: 700,

                cursor: "pointer",
              }}
            >
              Shop Now →
            </button>

            <button
              style={{
                background: "transparent",

                border: "1px solid #334155",

                color: "#cbd5e1",

                padding: "14px 28px",

                borderRadius: 14,

                fontSize: 16,

                fontWeight: 600,

                cursor: "pointer",
              }}
            >
              View Deals
            </button>
          </div>

          {/* STATS */}

          <div
            style={{
              display: "flex",
              gap: 40,
              marginTop: 50,
              flexWrap: "wrap",
            }}
          >
            {[
              ["10K+", "Products"],
              ["4.8★", "Rating"],
              ["Free", "Shipping"],
            ].map(([value, label]) => (
              <div key={label}>
                <div
                  style={{
                    fontWeight: 800,
                    fontSize: 28,
                  }}
                >
                  {value}
                </div>

                <div
                  style={{
                    color: "#64748b",
                    marginTop: 5,
                  }}
                >
                  {label}
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}

        <div
          style={{
            flex: "1 1 400px",
            display: "flex",
            justifyContent: "center",
          }}
        >
          <div
            style={{
              width: 350,
              height: 350,

              borderRadius: "50%",

              background:
                "radial-gradient(circle at 60% 40%, rgba(99,102,241,0.25) 0%, rgba(139,92,246,0.1) 50%, transparent 70%)",

              display: "flex",

              alignItems: "center",

              justifyContent: "center",

              position: "relative",

              fontSize: 140,
            }}
          >
            🛍️
            {/* FLASH SALE */}
            <div
              style={{
                position: "absolute",

                top: 30,

                right: 10,

                background: "#1e293b",

                border: "1px solid #334155",

                borderRadius: 14,

                padding: "10px 16px",

                color: "#a5b4fc",

                fontWeight: 700,

                fontSize: 14,
              }}
            >
              ⚡ Flash Sale
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default HomePage;
