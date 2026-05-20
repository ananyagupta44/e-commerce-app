import axios from "axios";

import { useEffect, useState } from "react";

import { useSearchParams } from "react-router-dom";

import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";

const ProductsPage = () => {
  const [products, setProducts] = useState([]);

  const [sort, setSort] = useState("");

  const [pages, setPages] = useState(1);

  const [page, setPage] = useState(1);

  const [activeCategory, setActiveCategory] = useState("");

  const [searchParams] = useSearchParams();

  // SEARCH QUERY FROM URL
  const keyword = searchParams.get("keyword") || "";

  // CATEGORIES
  const categories = ["", "Electronics", "Fashion", "Furniture", "Accessories"];

  // FETCH PRODUCTS
  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `http://localhost:5000/api/products?pageNumber=${page}`;

        // SEARCH
        if (keyword) {
          url += `&keyword=${keyword}`;
        }

        // CATEGORY
        if (activeCategory) {
          url += `&category=${activeCategory}`;
        }

        if (sort) {
          url += `&sort=${sort}`;
        }

        const { data } = await axios.get(url);

        setProducts(data.products);

        setPages(data.pages);
      } catch (error) {
        console.log(error);
      }
    };

    fetchProducts();
  }, [page, keyword, activeCategory, sort]);

  return (
    <main
      style={{
        width: "100%",
        minHeight: "100vh",
        padding: "40px 40px 80px",
        background: "#0f172a",
      }}
    >
      {/* HEADER */}

      <div
        style={{
          display: "flex",
          justifyContent: "space-between",
          alignItems: "center",
          marginBottom: 28,
          flexWrap: "wrap",
          gap: 16,
        }}
      >
        <div>
          <h2
            style={{
              fontWeight: 800,
              fontSize: 32,
              color: "#e2e8f0",
            }}
          >
            {keyword ? `Results for "${keyword}"` : "All Products"}
          </h2>

          <p
            style={{
              color: "#64748b",
              marginTop: 5,
            }}
          >
            {products.length} items found
          </p>
        </div>
      </div>

      <div
        className="
    flex
    flex-wrap
    gap-4
    items-center
    justify-between
    mb-8
  "
      >
        {/* CATEGORY FILTER */}

        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* NO PRODUCTS */}

      {products.length === 0 ? (
        <div
          style={{
            textAlign: "center",
            padding: "100px 20px",
            color: "#94a3b8",
          }}
        >
          <h2>No Products Found</h2>
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}

          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(auto-fit,minmax(280px,280px))",
              justifyContent: "center",
              marginTop: "10px",
              gap: 24,
            }}
          >
            {products.map((product) => (
              <ProductCard key={product._id} product={product} />
            ))}
          </div>

          {/* PAGINATION */}

          <div
            style={{
              display: "flex",
              justifyContent: "center",
              marginTop: 50,
              gap: 10,
              width: "100%",
            }}
          >
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                style={{
                  width: 40,
                  height: 40,
                  borderRadius: 10,
                  border: "none",
                  cursor: "pointer",
                  background: page === x + 1 ? "#6366f1" : "#1e293b",
                  color: "white",
                  fontWeight: 700,
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
