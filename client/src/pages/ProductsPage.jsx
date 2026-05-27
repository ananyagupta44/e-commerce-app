import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import "../css/productsPage.css";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [sort, setSort] = useState("");
  const [pages, setPages] = useState(1);
  const [page, setPage] = useState(1);
  const [activeCategory, setActiveCategory] = useState("");

  const [searchParams] = useSearchParams();

  const location = useLocation();

  const queryParams = new URLSearchParams(location.search);

  const category = queryParams.get("category");

  const keyword = searchParams.get("keyword") || "";

  // FETCH PRODUCTS

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:5000/api/products?pageNumber=${page}&sort=${sort}`;

        if (category) {
          url = `http://localhost:5000/api/products/category/${category}?pageNumber=${page}&sort=${sort}`;
        } else if (keyword) {
          url = `http://localhost:5000/api/products/search/${keyword}?pageNumber=${page}&sort=${sort}`;
        }

        const { data } = await axios.get(url);

        if (data.products) {
          setProducts(data.products);
          setPages(data.pages || 1);
        } else if (Array.isArray(data)) {
          setProducts(data);
          setPages(1);
        } else {
          setProducts([]);
        }
      } catch (error) {
        console.log(error);
        setProducts([]);
      }
    };

    fetchProducts();
  }, [keyword, category, page, sort]);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        background: "linear-gradient(to bottom,#020617,#0f172a)",
        color: "white",
        padding: "40px 50px 90px",
        position: "relative",
        overflow: "hidden",
      }}
    >
      {/* BACKGROUND GLOW */}

      <div
        style={{
          position: "absolute",
          top: "-200px",
          right: "-200px",
          width: "500px",
          height: "500px",
          background:
            "radial-gradient(circle,rgba(99,102,241,0.18),transparent 70%)",
          pointerEvents: "none",
        }}
      />

      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "flex-end",
          flexWrap: "wrap",
          gap: "20px",
          marginBottom: "40px",
          borderBottom: "1px solid rgba(255,255,255,0.08)",
          paddingBottom: "24px",
        }}
      >
        <div>
          <p
            style={{
              color: "#818cf8",
              fontSize: "13px",
              letterSpacing: "2px",
              marginBottom: "10px",
              fontFamily: "DM Mono, monospace",
            }}
          >
            PREMIUM COLLECTIONS
          </p>

          <h1
            style={{
              fontSize: "52px",
              fontWeight: "800",
              lineHeight: "1",
              fontFamily: "Syne, sans-serif",
              marginBottom: "14px",
              background: "linear-gradient(135deg,#ffffff,#94a3b8)",
              WebkitBackgroundClip: "text",
              WebkitTextFillColor: "transparent",
            }}
          >
            {category
              ? category
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") + " Products"
              : keyword
                ? `Results for "${keyword}"`
                : "All Products"}
          </h1>

          <p
            style={{
              color: "#94a3b8",
              fontSize: "16px",
              fontFamily: "DM Mono, monospace",
            }}
          >
            {products.length} items found
          </p>
        </div>

        {/* SMALL INFO CARD */}

        <div
          style={{
            padding: "18px 24px",
            borderRadius: "20px",
            background: "rgba(255,255,255,0.04)",
            border: "1px solid rgba(255,255,255,0.08)",
            backdropFilter: "blur(14px)",
          }}
        >
          <p
            style={{
              color: "#64748b",
              fontSize: "13px",
              marginBottom: "6px",
              fontFamily: "DM Mono, monospace",
            }}
          >
            SHOPPING EXPERIENCE
          </p>

          <h3
            style={{
              fontSize: "24px",
              fontWeight: "700",
            }}
          >
            Nova Store ✨
          </h3>
        </div>
      </div>

      {/* FILTER BAR */}

      <div
        style={{
          width: "100%",
          display: "flex",
          justifyContent: "flex-end",
          marginBottom: "45px",
        }}
      >
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* EMPTY STATE */}

      {products.length === 0 ? (
        <div
          style={{
            width: "100%",
            minHeight: "400px",
            display: "flex",
            flexDirection: "column",
            justifyContent: "center",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          <div
            style={{
              fontSize: "90px",
              marginBottom: "20px",
            }}
          >
            😔
          </div>

          <h2
            style={{
              fontSize: "36px",
              fontWeight: "800",
              marginBottom: "10px",
            }}
          >
            No Products Found
          </h2>

          <p
            style={{
              color: "#94a3b8",
              maxWidth: "500px",
              lineHeight: "1.8",
            }}
          >
            Try searching with another keyword or browse different categories.
          </p>
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fill,minmax(360px,1fr))",
              justifyContent: "center",
              gap: "18px",
            }}
          >
            {products.map((product) => (
              <div key={product._id} className="products-page-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* PAGINATION */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              gap: "14px",
              marginTop: "70px",
              flexWrap: "wrap",
            }}
          >
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                style={{
                  width: "52px",
                  height: "52px",
                  borderRadius: "16px",
                  border:
                    page === x + 1
                      ? "1px solid #818cf8"
                      : "1px solid rgba(255,255,255,0.08)",
                  background:
                    page === x + 1
                      ? "linear-gradient(135deg,#6366f1,#8b5cf6)"
                      : "rgba(255,255,255,0.03)",
                  color: "white",
                  fontWeight: "700",
                  fontSize: "16px",
                  cursor: "pointer",
                  transition: "0.3s",
                  backdropFilter: "blur(10px)",
                  boxShadow:
                    page === x + 1
                      ? "0 10px 30px rgba(99,102,241,0.35)"
                      : "none",
                }}
              >
                {x + 1}
              </button>
            ))}
          </div>
        </>
      )}
    </main>
  );
};

export default ProductsPage;
