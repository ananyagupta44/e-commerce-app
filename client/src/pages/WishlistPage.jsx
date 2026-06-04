import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import ProductCard from "../components/ProductCard";
import "../css/WishlistPage.css";
import ParticleBackground from "@/components/ParticleBackground";

// ✅ User-specific wishlist key
const getWishlistKey = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );
  return userInfo?.user?.id ? `wishlist_${userInfo.user.id}` : "wishlist";
};

const WishlistPage = () => {
  const [wishlistItems, setWishlistItems] = useState([]);

  // ✅ Load wishlist for current user only
  useEffect(() => {
    const items = JSON.parse(localStorage.getItem(getWishlistKey())) || [];
    setWishlistItems(items);
  }, []);

  // ✅ Listen for storage changes (e.g. from ProductCard wishlist toggle)
  useEffect(() => {
    const handleStorage = () => {
      const items = JSON.parse(localStorage.getItem(getWishlistKey())) || [];
      setWishlistItems(items);
    };
    window.addEventListener("storage", handleStorage);
    return () => window.removeEventListener("storage", handleStorage);
  }, []);

  // ✅ Remove item from user-specific wishlist
  const removeWishlistItem = (id) => {
    const updatedWishlist = wishlistItems.filter((item) => item._id !== id);
    setWishlistItems(updatedWishlist);
    localStorage.setItem(getWishlistKey(), JSON.stringify(updatedWishlist));
    window.dispatchEvent(new Event("storage"));
  };

  return (
    <>
      <ParticleBackground />
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
    </>
  );
};

export default WishlistPage;
