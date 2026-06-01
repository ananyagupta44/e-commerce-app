import axios from "axios";
import { useEffect, useState, useCallback, useRef } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ProductDetailsPage.css";
import getImageUrl from "../utils/getImageUrl";
import ProductCard from "../components/ProductCard";
import API_URL from "@/config/api";

/* ── Helper: render star icons ── */
const Stars = ({ rating, max = 5, size = "sm" }) => {
  const filled = Math.round(rating || 0);
  return (
    <div
      className={`${size === "summary" ? "summary-stars" : "product-stars"}`}
    >
      {[...Array(max)].map((_, i) => (
        <span
          key={i}
          className={
            size === "summary"
              ? `summary-star${i < filled ? " filled" : ""}`
              : `star-icon${i < filled ? " filled" : ""}`
          }
        >
          ★
        </span>
      ))}
    </div>
  );
};

/* ── Interactive star picker ── */
const StarPicker = ({ value, onChange }) => {
  const [hover, setHover] = useState(0);
  return (
    <div className="star-picker">
      <label>Your Rating</label>
      <div className="star-picker-stars">
        {[1, 2, 3, 4, 5].map((s) => (
          <button
            key={s}
            type="button"
            className={`star-pick-btn${(hover || value) >= s ? " selected" : ""}`}
            onMouseEnter={() => setHover(s)}
            onMouseLeave={() => setHover(0)}
            onClick={() => onChange(s)}
            aria-label={`Rate ${s} stars`}
          >
            ★
          </button>
        ))}
      </div>
    </div>
  );
};

/* ── Review card ── */
const ReviewCard = ({ review }) => (
  <div className="review-card">
    <div className="review-top">
      <div className="review-user">
        <div className="review-avatar">{review.name[0].toUpperCase()}</div>
        <div>
          <div className="review-name">{review.name}</div>
          <div className="review-stars">
            {[...Array(5)].map((_, i) => (
              <span
                key={i}
                className={`review-star${i < review.rating ? " filled" : ""}`}
              >
                ★
              </span>
            ))}
          </div>
        </div>
      </div>
    </div>
    <p className="review-comment">{review.comment}</p>
  </div>
);

/* ── Similar Products Section ── */
const SimilarProducts = ({ currentProduct }) => {
  const [similar, setSimilar] = useState([]);
  const [page, setPage] = useState(0);
  const [loading, setLoading] = useState(true);
  const CARDS_PER_PAGE = 5;

  useEffect(() => {
    if (!currentProduct) return;
    const fetchSimilar = async () => {
      try {
        setLoading(true);
        // Fetch by category
        const { data } = await axios.get(
          `${API_URL}/api/products?category=${encodeURIComponent(currentProduct.category)}&limit=20`,
        );
        const products = data.products || data || [];
        // Filter out current product
        const filtered = products.filter((p) => p._id !== currentProduct._id);
        // Sort by keyword match in name/description
        const keywords = currentProduct.name
          .toLowerCase()
          .split(" ")
          .filter((w) => w.length > 3);
        const scored = filtered.map((p) => {
          const text = `${p.name} ${p.description || ""}`.toLowerCase();
          const score = keywords.reduce(
            (acc, kw) => acc + (text.includes(kw) ? 1 : 0),
            0,
          );
          return { ...p, _score: score };
        });
        scored.sort((a, b) => b._score - a._score);
        setSimilar(scored);
        setPage(0);
      } catch (err) {
        console.error("Failed to fetch similar products", err);
      } finally {
        setLoading(false);
      }
    };
    fetchSimilar();
  }, [currentProduct]);

  if (loading)
    return (
      <div className="similar-section">
        <div className="similar-loading">Loading similar products…</div>
      </div>
    );

  if (similar.length === 0) return null;

  const totalPages = Math.ceil(similar.length / CARDS_PER_PAGE);
  const visible = similar.slice(
    page * CARDS_PER_PAGE,
    page * CARDS_PER_PAGE + CARDS_PER_PAGE,
  );

  return (
    <div className="similar-section">
      {/* Header */}
      <div className="similar-header">
        <div>
          <div className="section-label">
            <span>You May Also Like</span>
          </div>
          <h2 className="similar-title">Similar Products</h2>
          <p className="similar-sub">Based on category &amp; keywords</p>
        </div>
        {totalPages > 1 && (
          <div className="similar-nav">
            <button
              className="similar-nav-btn"
              onClick={() => setPage((p) => Math.max(0, p - 1))}
              disabled={page === 0}
              aria-label="Previous"
            >
              ‹
            </button>
            <span className="similar-page-indicator">
              {page + 1} / {totalPages}
            </span>
            <button
              className="similar-nav-btn"
              onClick={() => setPage((p) => Math.min(totalPages - 1, p + 1))}
              disabled={page === totalPages - 1}
              aria-label="Next"
            >
              ›
            </button>
          </div>
        )}
      </div>

      {/* Cards */}
      <div className="similar-grid">
        {visible.map((product) => (
          <ProductCard key={product._id} product={product} />
        ))}
      </div>
    </div>
  );
};

const getWishlistKey = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );
  return userInfo?.user?.id ? `wishlist_${userInfo.user.id}` : "wishlist";
};

/* ── Main component ── */
const ProductDetailsPage = () => {
  const { id } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [qty, setQty] = useState(1);
  const [wished, setWished] = useState(false);
  const [rating, setRating] = useState(0);
  const [comment, setComment] = useState("");
  const [imgIndex, setImgIndex] = useState(0);
  const [slideClass, setSlideClass] = useState("slide-in");
  const [showFullDesc, setShowFullDesc] = useState(false);

  const images = product?.images || [];

  const goTo = useCallback(
    (nextIdx, direction) => {
      if (!product || nextIdx === imgIndex) return;
      const outClass =
        direction === "left" ? "slide-left-out" : "slide-right-out";
      setSlideClass(outClass);
      setTimeout(() => {
        setImgIndex(nextIdx);
        setSlideClass("slide-in");
      }, 360);
    },
    [imgIndex, product],
  );

  const goNext = useCallback(() => {
    goTo((imgIndex + 1) % images.length, "right");
  }, [imgIndex, images.length, goTo]);

  const goPrev = useCallback(() => {
    goTo((imgIndex - 1 + images.length) % images.length, "left");
  }, [imgIndex, images.length, goTo]);

  const switchImage = useCallback(
    (idx) => {
      const dir = idx > imgIndex ? "right" : "left";
      goTo(idx, dir);
    },
    [imgIndex, goTo],
  );

  const addToCartHandler = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
      );
      await axios.post(
        `${API_URL}/api/cart`,
        {
          product: product._id,
          name: product.name,
          image: product.images,
          price: product.finalPrice,
          qty,
          stock: product.stock,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      window.dispatchEvent(new Event("storage"));
      navigate("/cart");
    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    }
  };

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem(getWishlistKey())) || [];
    const existItem = wishlist.find((x) => x._id === product._id);
    if (existItem) {
      wishlist = wishlist.filter((x) => x._id !== product._id);
      setWished(false);
    } else {
      wishlist.push(product);
      setWished(true);
    }
    localStorage.setItem(getWishlistKey(), JSON.stringify(wishlist));
    window.dispatchEvent(new Event("storage"));
  };

  const submitReview = async () => {
    if (!rating) return alert("Please select a rating.");
    if (!comment.trim()) return alert("Please write a comment.");
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
      );

      await axios.post(
        `${API_URL}/api/products/${product._id}/reviews`,
        { productId: product._id, rating, comment },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      // ✅ Build the new review object locally
      const newReview = {
        _id: Date.now().toString(), // temp id until page refresh
        name: userInfo.user?.name || "You",
        rating,
        comment,
      };

      // ✅ Update product state immediately
      setProduct((prev) => ({
        ...prev,
        reviews: [...prev.reviews, newReview],
        numReviews: prev.numReviews + 1,
        // Recalculate rating average
        rating: parseFloat(
          (
            (prev.rating * prev.numReviews + rating) /
            (prev.numReviews + 1)
          ).toFixed(1),
        ),
      }));

      // ✅ Reset form
      setRating(0);
      setComment("");
    } catch (err) {
      alert(err.response?.data?.message || "Failed to submit review.");
    }
  };

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(`${API_URL}/api/products/${id}`);
        setProduct(data);
        setImgIndex(0);
        const wishlist =
          JSON.parse(localStorage.getItem(getWishlistKey())) || [];
        setWished(!!wishlist.find((x) => x._id === data._id));
      } catch {
        setError("Failed to load product.");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  if (loading)
    return (
      <div className="product-page">
        <div className="loading-state">Loading</div>
      </div>
    );
  if (error)
    return (
      <div className="product-page">
        <div className="error-state">{error}</div>
      </div>
    );

  return (
    <div className="product-page">
      <button onClick={() => navigate(-1)} className="back-btn">
        ← Go Back
      </button>

      {/* MAIN */}
      <div className="product-main">
        {/* IMAGE COLUMN */}
        <div className="product-image-section">
          <div className="product-image-wrapper">
            <img
              src={getImageUrl(images[imgIndex])}
              alt={product.name}
              className={`product-image ${slideClass}`}
            />
            {images.length > 1 && (
              <>
                <button
                  className="img-arrow img-arrow-left"
                  onClick={goPrev}
                  aria-label="Previous image"
                >
                  ‹
                </button>
                <button
                  className="img-arrow img-arrow-right"
                  onClick={goNext}
                  aria-label="Next image"
                >
                  ›
                </button>
                <div className="img-dots">
                  {images.map((_, i) => (
                    <button
                      key={i}
                      className={`img-dot${i === imgIndex ? " active" : ""}`}
                      onClick={() => switchImage(i)}
                      aria-label={`Go to image ${i + 1}`}
                    />
                  ))}
                </div>
              </>
            )}
          </div>
          {images.length > 1 && (
            <div className="product-thumbnails">
              {images.map((img, i) => (
                <img
                  key={i}
                  src={getImageUrl(img)}
                  alt=""
                  onClick={() => switchImage(i)}
                  className={`thumbnail-image${i === imgIndex ? " active-thumbnail" : ""}`}
                />
              ))}
            </div>
          )}
        </div>

        {/* DETAILS COLUMN */}
        <div className="product-details-section">
          <span className="product-category">{product.category}</span>
          <h1 className="product-title">{product.name}</h1>
          <div className="product-rating-row">
            <Stars rating={product.rating} />
            <div className="product-review-count">
              {product.reviews.length} Reviews
            </div>
          </div>
          <div className="product-price">
            <div className="final-price">₹{product.finalPrice.toFixed(2)}</div>
            {product.discount > 0 && (
              <>
                <div className="old-price">₹{product.price.toFixed(2)}</div>
                <div className="discount-badge">{product.discount}% OFF</div>
              </>
            )}
          </div>
          <div className="product-description-wrap">
            <p
              className={`product-description ${showFullDesc ? "expanded" : ""}`}
            >
              {product.description}
            </p>
            {product.description?.length > 260 && (
              <button
                className="show-more-btn"
                onClick={() => setShowFullDesc(!showFullDesc)}
              >
                {showFullDesc ? "Show Less" : "Show More"}
              </button>
            )}
          </div>
          <div className="product-stock">
            <span>Status</span>
            {product.stock > 0 ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </div>
          {product.stock > 0 && (
            <div className="quantity-box">
              <label>Quantity</label>
              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="quantity-select"
              >
                {[...Array(product.stock).keys()].map((x) => (
                  <option key={x + 1} value={x + 1}>
                    {x + 1}
                  </option>
                ))}
              </select>
            </div>
          )}
          <div className="product-buttons">
            <button
              onClick={addToCartHandler}
              className="cart-btn"
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
            <button
              onClick={toggleWishlist}
              className={`wishlist-btn${wished ? " wished" : ""}`}
            >
              {wished ? "❤️ Wishlisted" : "🤍 Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* ── SIMILAR PRODUCTS ── */}
      <SimilarProducts currentProduct={product} />

      {/* ── REVIEWS ── */}
      <div className="reviews-section">
        <div className="section-label">
          <span>Customer Reviews</span>
        </div>
        <div className="reviews-header">
          <div>
            <h2 className="reviews-title">What People Say</h2>
            <p className="reviews-subtitle">
              Verified purchases · Honest opinions
            </p>
          </div>
          <div className="reviews-summary">
            <div className="summary-score-big">
              {product.rating?.toFixed(1) || "0.0"}
            </div>
            <div className="summary-right">
              <Stars rating={product.rating} size="summary" />
              <div className="summary-text">{product.numReviews} reviews</div>
            </div>
          </div>
        </div>
        {product.reviews.length === 0 ? (
          <p className="no-reviews">
            No reviews yet — be the first to share your experience.
          </p>
        ) : (
          <div className="review-grid">
            {product.reviews.map((review) => (
              <ReviewCard key={review._id} review={review} />
            ))}
          </div>
        )}
        <div className="review-form">
          <h3 className="review-form-title">Write a Review</h3>
          <p className="review-form-sub">
            Share your honest experience with this product
          </p>
          <div className="review-form-grid">
            <StarPicker value={rating} onChange={setRating} />
            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Tell others what you think — quality, fit, delivery, anything that matters…"
            />
          </div>
          <button onClick={submitReview} className="review-submit-btn">
            Submit Review
          </button>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
