import axios from "axios";
import { useEffect, useState } from "react";
import { useNavigate, useParams } from "react-router-dom";
import "../css/ProductDetailsPage.css";

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

  // ADD TO CART

  const addToCartHandler = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
      );

      await axios.post(
        "http://localhost:5000/api/cart",
        {
          product: product._id,
          name: product.name,
          image: product.image,
          price: product.finalPrice,
          qty,
          stock: product.stock,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      window.dispatchEvent(new Event("storage"));

      navigate("/cart");
    } catch (error) {
      console.log(error);

      alert("Failed to add to cart");
    }
  };

  // WISHLIST

  const toggleWishlist = () => {
    let wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

    const existItem = wishlist.find((x) => x._id === product._id);

    if (existItem) {
      wishlist = wishlist.filter((x) => x._id !== product._id);

      setWished(false);
    } else {
      wishlist.push(product);

      setWished(true);
    }

    localStorage.setItem("wishlist", JSON.stringify(wishlist));

    window.dispatchEvent(new Event("storage"));
  };

  // SUBMIT REVIEW

  const submitReview = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
      );

      await axios.post(
        `http://localhost:5000/api/products/${product._id}/reviews`,
        {
          rating,
          comment,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );

      alert("Review submitted");

      window.location.reload();
    } catch (error) {
      alert(error.response?.data?.message);
    }
  };

  // FETCH PRODUCT

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );

        setProduct(data);

        const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];

        const exists = wishlist.find((x) => x._id === data._id);

        setWished(!!exists);
      } catch (error) {
        setError("Failed to load product");
      } finally {
        setLoading(false);
      }
    };

    fetchProduct();
  }, [id]);

  // LOADING

  if (loading) {
    return (
      <div className="product-page">
        <div className="loading-state">Loading...</div>
      </div>
    );
  }

  // ERROR

  if (error) {
    return (
      <div className="product-page">
        <div className="error-state">{error}</div>
      </div>
    );
  }

  return (
    <div className="product-page">
      {/* BACK BUTTON */}

      <button onClick={() => navigate(-1)} className="back-btn">
        ← Go Back
      </button>

      {/* MAIN */}

      <div className="product-main">
        {/* IMAGE */}

        <div className="product-image-wrapper">
          <img
            src={product.image}
            alt={product.name}
            className="product-image"
          />
        </div>

        {/* DETAILS */}

        <div>
          <span className="product-category">{product.category}</span>

          <h1 className="product-title">{product.name}</h1>

          {/* RATINGS */}

          <div className="product-rating-row">
            <div className="product-stars">
              {"★".repeat(Math.round(product.rating || 0))}
            </div>

            <div className="product-review-count">
              {product.numReviews} Reviews
            </div>
          </div>

          {/* PRICE */}

          <div className="product-price">
            <div className="final-price">₹{product.finalPrice.toFixed(2)}</div>

            {product.discount > 0 && (
              <>
                <div className="old-price">₹{product.price.toFixed(2)}</div>

                <div className="discount-badge">{product.discount}% OFF</div>
              </>
            )}
          </div>

          {/* DESCRIPTION */}

          <p className="product-description">{product.description}</p>

          {/* STOCK */}

          <div className="product-stock">
            <span>Status:</span>

            {product.stock > 0 ? (
              <span className="in-stock">In Stock</span>
            ) : (
              <span className="out-stock">Out of Stock</span>
            )}
          </div>

          {/* QUANTITY */}

          {product.stock > 0 && (
            <div className="quantity-box">
              <label>Quantity</label>

              <br />

              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="quantity-select"
              >
                {[...Array(product.stock).keys()].map((x) => (
                  <option key={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          {/* BUTTONS */}

          <div className="product-buttons">
            <button onClick={addToCartHandler} className="cart-btn">
              Add to Cart
            </button>

            <button onClick={toggleWishlist} className="wishlist-btn">
              {wished ? "❤️ Added to Wishlist" : "🤍 Add to Wishlist"}
            </button>
          </div>
        </div>
      </div>

      {/* REVIEWS */}

      <div className="reviews-section">
        <div className="reviews-header">
          <div>
            <h2 className="reviews-title">Customer Reviews</h2>

            <p className="summary-text">Real reviews from verified buyers</p>
          </div>

          <div className="reviews-summary">
            <div className="summary-rating">
              {product.rating?.toFixed(1) || "0.0"}
            </div>

            <div>
              <div className="summary-stars">
                {"★".repeat(Math.round(product.rating || 0))}
              </div>

              <div className="summary-text">{product.numReviews} Reviews</div>
            </div>
          </div>
        </div>

        {/* REVIEW LIST */}

        {product.reviews.length === 0 ? (
          <p className="summary-text">No reviews yet</p>
        ) : (
          <div className="review-grid">
            {product.reviews.map((review) => (
              <div key={review._id} className="review-card">
                <div className="review-top">
                  <div className="review-user">
                    <div className="review-avatar">{review.name[0]}</div>

                    <div>
                      <div className="review-name">{review.name}</div>

                      <div className="review-stars">
                        {"★".repeat(review.rating)}
                      </div>
                    </div>
                  </div>
                </div>

                <p className="review-comment">{review.comment}</p>
              </div>
            ))}
          </div>
        )}

        {/* REVIEW FORM */}

        <div className="review-form">
          <h3 className="review-form-title">Write a Review</h3>

          <div className="review-form-grid">
            <select value={rating} onChange={(e) => setRating(e.target.value)}>
              <option value="">Select Rating</option>

              <option value="1">★ 1</option>

              <option value="2">★★ 2</option>

              <option value="3">★★★ 3</option>

              <option value="4">★★★★ 4</option>

              <option value="5">★★★★★ 5</option>
            </select>

            <textarea
              value={comment}
              onChange={(e) => setComment(e.target.value)}
              placeholder="Share your experience with this product..."
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
