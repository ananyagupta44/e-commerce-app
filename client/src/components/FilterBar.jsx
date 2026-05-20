import { useState, useEffect, useRef } from "react";

const CATEGORIES = [
  { value: "", label: "All Categories" },
  { value: "Electronics", label: "Electronics" },
  { value: "Fashion", label: "Fashion" },
  { value: "Furniture", label: "Furniture" },
  { value: "Accessories", label: "Accessories" },
];

const SORT_OPTIONS = [
  { value: "", label: "Sort By" },
  { value: "lowToHigh", label: "Price: Low to High" },
  { value: "highToLow", label: "Price: High to Low" },
  { value: "name", label: "Name A-Z" },
];

function Dropdown({ options, value, onChange }) {
  const [open, setOpen] = useState(false);
  const ref = useRef(null);
  const selected = options.find((o) => o.value === value) || options[0];

  useEffect(() => {
    const handler = (e) => {
      if (ref.current && !ref.current.contains(e.target)) setOpen(false);
    };
    document.addEventListener("mousedown", handler);
    return () => document.removeEventListener("mousedown", handler);
  }, []);

  return (
    <div ref={ref} style={{ position: "relative", margin: "5px" }}>
      <button
        onClick={() => setOpen((o) => !o)}
        style={{
          display: "flex",
          alignItems: "center",
          gap: "10px",
          padding: "8px 14px",
          background: "#1e293b",
          border: "3px solid #334155",
          borderRadius: "12px",
          cursor: "pointer",
          fontSize: "15px",
          color: "white",
          whiteSpace: "nowrap",
          minWidth: "170px",
          justifyContent: "space-between",
          fontFamily: "inherit",
          outline: "none",
          transition: "border-color 0.15s",
        }}
        onMouseEnter={(e) => (e.currentTarget.style.borderColor = "#475569")}
        onMouseLeave={(e) =>
          (e.currentTarget.style.borderColor = open ? "#475569" : "#334155")
        }
      >
        <span style={{ color: value === "" ? "#94a3b8" : "white" }}>
          {selected.label}
        </span>
        <span
          style={{
            fontSize: "11px",
            color: "#64748b",
            display: "inline-block",
            transform: open ? "rotate(180deg)" : "rotate(0)",
            transition: "transform 0.2s",
          }}
        >
          ▾
        </span>
      </button>

      {open && (
        <div
          style={{
            position: "absolute",
            top: "calc(100% + 6px)",
            left: 0,
            minWidth: "100%",
            background: "#1e293b",
            border: "2px solid #334155",
            borderRadius: "12px",
            overflow: "hidden",
            zIndex: 100,
            padding: "4px",
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
                padding: "9px 12px",
                fontSize: "14px",
                color: opt.value === value ? "white" : "#94a3b8",
                background: opt.value === value ? "#334155" : "transparent",
                cursor: "pointer",
                borderRadius: "8px",
                display: "flex",
                justifyContent: "space-between",
                alignItems: "center",
                transition: "background 0.12s, color 0.12s",
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.background = "#334155";
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
                <span style={{ color: "#64748b", fontSize: "11px" }}>✓</span>
              )}
            </div>
          ))}
        </div>
      )}
    </div>
  );
}

// Drop-in replacement — keep your existing state: activeCategory, setActiveCategory, sort, setSort
const FilterBar = ({ activeCategory, setActiveCategory, sort, setSort }) => {
  return (
    <div style={{ display: "flex", flexWrap: "wrap", alignItems: "center" }}>
      <Dropdown
        options={CATEGORIES}
        value={activeCategory}
        onChange={setActiveCategory}
      />
      <Dropdown options={SORT_OPTIONS} value={sort} onChange={setSort} />
    </div>
  );
};

export default FilterBar;
