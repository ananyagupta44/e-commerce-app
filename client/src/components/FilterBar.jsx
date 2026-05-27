import { useState, useEffect, useRef } from "react";

const SORT_OPTIONS = [
  { value: "", label: "Sort By" },

  {
    value: "lowToHigh",
    label: "Price: Low to High",
  },

  {
    value: "highToLow",
    label: "Price: High to Low",
  },

  {
    value: "discount",
    label: "Highest Discount",
  },

  {
    value: "name",
    label: "Name A-Z",
  },
];

function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);

  const ref = useRef(null);

  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) {
        setOpen(false);
      }
    };

    document.addEventListener("mousedown", handler);

    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div
      ref={ref}
      style={{
        position: "relative",
        margin: "5px",
      }}
    >
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "10px 16px",
          background: "rgba(255,255,255,0.04)",

          border: "1px solid rgba(255,255,255,0.08)",

          borderRadius: "14px",

          cursor: "pointer",

          fontSize: "15px",

          color: "white",

          whiteSpace: "nowrap",

          minWidth: "220px",

          justifyContent: "space-between",

          fontFamily: "DM Mono, monospace",

          backdropFilter: "blur(12px)",

          transition: "0.25s",
        }}
      >
        <span
          style={{
            color: value === "" ? "#94a3b8" : "white",
          }}
        >
          {selected.label}
        </span>

        <span
          style={{
            fontSize: "11px",
            color: "#64748b",

            transform: open ? "rotate(180deg)" : "rotate(0deg)",

            transition: "0.25s",
          }}
        >
          ▼
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",

            top: "calc(100% + 8px)",

            left: 0,

            minWidth: "100%",

            background: "#0f172a",

            border: "1px solid rgba(255,255,255,0.08)",

            borderRadius: "16px",

            overflow: "hidden",

            zIndex: 100,

            padding: "6px",

            boxShadow: "0 20px 40px rgba(0,0,0,0.35)",

            backdropFilter: "blur(16px)",
          }}
        >
          {options.map((opt) => (
            <div
              key={opt.value}
              onClick={() => {
                onChange(opt.value);
                setOpen(false);
              }}
              style={{
                padding: "12px 14px",

                fontSize: "14px",

                color: opt.value === value ? "white" : "#94a3b8",

                background:
                  opt.value === value ? "rgba(99,102,241,0.18)" : "transparent",

                cursor: "pointer",

                borderRadius: "10px",

                display: "flex",

                justifyContent: "space-between",

                alignItems: "center",

                transition: "0.2s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "rgba(99,102,241,0.12)";

                e.currentTarget.style.color = "white";
              }}
              onMouseLeave={(e) => {
                if (opt.value !== value) {
                  e.currentTarget.style.background = "transparent";

                  e.currentTarget.style.color = "#94a3b8";
                }
              }}
            >
              {opt.label}

              {opt.value === value && (
                <span
                  style={{
                    color: "#818cf8",
                    fontSize: "11px",
                  }}
                >
                  ✓
                </span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

const FilterBar = ({ sort, setSort }) => {
  return (
    <div
      style={{
        display: "flex",
        alignItems: "center",
        justifyContent: "flex-end",
      }}
    >
      <Dropdown options={SORT_OPTIONS} value={sort} onChange={setSort} />
    </div>
  );
};

export default FilterBar;
