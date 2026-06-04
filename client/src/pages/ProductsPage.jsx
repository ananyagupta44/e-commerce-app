import axios from "axios";
import { useEffect, useState } from "react";
import { useLocation, useSearchParams, Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import FilterBar from "../components/FilterBar";
import "../css/productsPage.css";
import API_URL from "@/config/api";
import ParticleBackground from "@/components/ParticleBackground";

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

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        let url = `${API_URL}/api/products?pageNumber=${page}&sort=${sort}`;

        if (category) {
          url = `${API_URL}/api/products/category/${category}?pageNumber=${page}&sort=${sort}`;
        } else if (keyword) {
          url = `${API_URL}/api/products/search/${keyword}?pageNumber=${page}&sort=${sort}`;
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
    <main className="products-page">
      <ParticleBackground />
      {/* BACKGROUND GLOW */}
      <div className="products-glow" />

      {/* BACK LINK */}
      <Link to="/" className="products-back-link">
        ← Back to Home
      </Link>

      {/* HEADER */}
      <div className="products-header">
        <div>
          <p className="products-tag">PREMIUM COLLECTIONS</p>

          <h1 className="products-title">
            {category
              ? category
                  .split(" ")
                  .map((word) => word.charAt(0).toUpperCase() + word.slice(1))
                  .join(" ") + " Products"
              : keyword
                ? `Results for "${keyword}"`
                : "All Products"}
          </h1>

          <p className="products-count">{products.length} items found</p>
        </div>

        {/* INFO CARD */}
        <div className="products-info-card">
          <p className="products-info-label">SHOPPING EXPERIENCE</p>

          <h3 className="products-info-title">Nova Store ✨</h3>
        </div>
      </div>

      {/* FILTER BAR */}
      <div className="products-filter-wrap">
        <FilterBar
          activeCategory={activeCategory}
          setActiveCategory={setActiveCategory}
          sort={sort}
          setSort={setSort}
        />
      </div>

      {/* EMPTY STATE */}
      {products.length === 0 ? (
        <div className="products-empty">
          <div className="products-empty-icon">😔</div>

          <h2 className="products-empty-title">No Products Found</h2>

          <p className="products-empty-text">
            Try searching with another keyword or browse different categories.
          </p>
        </div>
      ) : (
        <>
          {/* PRODUCTS GRID */}
          <div className="products-grid">
            {products.map((product) => (
              <div key={product._id} className="products-page-card">
                <ProductCard product={product} />
              </div>
            ))}
          </div>

          {/* PAGINATION */}
          <div className="products-pagination">
            {[...Array(pages).keys()].map((x) => (
              <button
                key={x + 1}
                onClick={() => setPage(x + 1)}
                className={`products-page-btn ${
                  page === x + 1 ? "active" : ""
                }`}
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
