import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../css/WishlistPage.css";

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // LOAD WISHLIST

  useEffect(() => {
    const items = JSON.parse(localStorage.getItem("wishlist")) || [];

    setWishlistItems(items);
  }, []);

  // REMOVE ITEM

  const removeWishlistItem = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item._id !== id);

    setWishlistItems(updatedWishlist);

    localStorage.setItem(
      "wishlist",

      JSON.stringify(updatedWishlist),
    );

    window.dispatchEvent(new Event("storage"));
  };

  return (
    <div className="wishlist-page">
      {/* TOP */}

      <div className="wishlist-top">
        <Link to="/products" className="wishlist-back">
          ← Continue Shopping
        </Link>

        <div className="wishlist-header">
          <div>
            <h1 className="wishlist-title">My Wishlist</h1>

            <p className="wishlist-subtitle">
              Save products you love and revisit them anytime. Curate your
              personal collection of premium picks.
            </p>
          </div>

          <div className="wishlist-count">
            {wishlistItems.length} Saved Items
          </div>
        </div>
      </div>

      {/* EMPTY */}

      {wishlistItems.length === 0 ? (
        <div className="empty-wishlist">
          <div className="empty-box">
            <div className="empty-icon">❤️</div>

            <h2 className="empty-title">Your wishlist is empty</h2>

            <p className="empty-text">
              Discover premium products and save your favorites here for quick
              access later.
            </p>

            <Link to="/products" className="empty-btn">
              Explore Products →
            </Link>
          </div>
        </div>
      ) : (
        <div className="wishlist-grid">
          {wishlistItems.map((item) => (
            <div key={item._id} className="wishlist-card-wrapper">
              {/* REMOVE */}

              <button
                onClick={() => removeWishlistItem(item._id)}
                className="remove-wishlist-btn"
              >
                ✕
              </button>

              {/* PRODUCT CARD */}

              <ProductCard product={item} />
            </div>
          ))}
        </div>
      )}
    </div>
  );
};

export default WishlistPage;
