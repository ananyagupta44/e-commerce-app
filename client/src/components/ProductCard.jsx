import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProductCard.css";
import getImageUrl from "../utils/getImageUrl";
import API_URL from "@/config/api";

const parseJSON = (value) => {
  try {
    return JSON.parse(value);
  } catch {
    return null;
  }
};

const getStoredUser = () =>
  parseJSON(localStorage.getItem("userInfo")) ??
  parseJSON(sessionStorage.getItem("userInfo"));

const getWishlistKey = (userId) => (userId ? `wishlist_${userId}` : "wishlist");

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [transitioning, setTransitioning] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);
  const timeoutRef = useRef(null);

  const imageCount = product.images?.length ?? 0;
  const nextImage = (currentImage + 1) % Math.max(imageCount, 1);

  const finalPrice =
    product.finalPrice ??
    product.price - (product.price * product.discount) / 100;

  const startImageLoop = () => {
    if (intervalRef.current || imageCount <= 1) return;

    intervalRef.current = window.setInterval(() => {
      setTransitioning(true);

      timeoutRef.current = window.setTimeout(() => {
        setCurrentImage((current) => (current + 1) % imageCount);
        setTransitioning(false);
      }, 600);
    }, 2500);
  };

  const stopImageLoop = () => {
    window.clearInterval(intervalRef.current);
    window.clearTimeout(timeoutRef.current);
    intervalRef.current = null;
    timeoutRef.current = null;
    setTransitioning(false);
    setCurrentImage(0);
  };

  const addToCartHandler = async () => {
    try {
      const userInfo = getStoredUser();
      if (!userInfo) {
        alert("Please login first");
        navigate("/login");
        return;
      }

      await axios.post(
        `${API_URL}/api/cart`,
        {
          product: product._id,
          name: product.name,
          images: product.images?.[0],
          price: finalPrice,
          qty: 1,
          stock: product.stock,
          originalPrice: product.price,
          discount: product.discount,
        },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );

      setAdded(true);
      setTimeout(() => setAdded(false), 1500);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.error("Failed to add to cart:", error);
      alert("Failed to add to cart");
    }
  };

  const toggleWishlist = () => {
    const userId = getStoredUser()?.user?.id;
    const key = getWishlistKey(userId);
    const storedValue = parseJSON(localStorage.getItem(key)) ?? [];
    const wishlist = Array.isArray(storedValue) ? storedValue : [];
    const exists = wishlist.some((item) => item._id === product._id);
    const updatedWishlist = exists
      ? wishlist.filter((item) => item._id !== product._id)
      : [...wishlist, product];

    localStorage.setItem(key, JSON.stringify(updatedWishlist));
    setWished(!exists);
    window.dispatchEvent(new Event("storage"));
  };

  // ✅ Use user-specific key
  useEffect(() => {
    const userId = getStoredUser()?.user?.id;
    const key = getWishlistKey(userId);
    const storedValue = parseJSON(localStorage.getItem(key)) ?? [];
    const wishlist = Array.isArray(storedValue) ? storedValue : [];
    setWished(wishlist.some((item) => item._id === product._id));
  }, [product._id]);

  useEffect(() => {
    return () => {
      window.clearInterval(intervalRef.current);
      window.clearTimeout(timeoutRef.current);
    };
  }, []);

  useEffect(() => {
    product.images?.forEach((img) => {
      const image = new Image();
      image.src = getImageUrl(img);
    });
  }, [product.images]);

  return (
    <div className="pc-card">
      {/* IMAGE */}
      <Link to={`/product/${product._id}`} className="pc-img-wrap">
        <div
          className="pc-image-stack"
          onMouseEnter={() => {
            if (!product.images?.length) return;
            startImageLoop();
          }}
          onMouseLeave={() => {
            stopImageLoop();
          }}
        >
          <img
            src={getImageUrl(product.images?.[currentImage])}
            alt={product.name}
            className={`pc-img current ${transitioning ? "fade-out" : ""}`}
          />

          <img
            src={getImageUrl(product.images?.[nextImage])}
            alt={product.name}
            className={`pc-img next ${transitioning ? "fade-in" : ""}`}
          />
        </div>

        {/* WISHLIST */}
        <button
          className={`pc-wish ${wished ? "active" : ""}`}
          onClick={(e) => {
            e.preventDefault();
            toggleWishlist();
          }}
          aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
        >
          {wished ? "♥" : "♡"}
        </button>
      </Link>

      {/* BODY */}
      <div className="pc-body">
        <h2 className="pc-name">
          <span
            style={{
              "--scroll-distance":
                product.name.length > 20
                  ? `-${Math.min(product.name.length * 2, 65)}%`
                  : "0%",
            }}
          >
            {product.name}
          </span>
        </h2>
        <hr className="pc-divider" />
        <p className="pc-desc">{product.description}</p>

        {/* PRICE */}
        <div className="pc-price-row">
          <div>
            <p className="pc-price">
              <span>₹</span>
              {finalPrice.toFixed(2)}
            </p>
            {product.discount > 0 && (
              <div className="pc-discount-wrap">
                <span className="pc-old-price">
                  ₹{product.price.toFixed(2)}
                </span>
                <span className="pc-discount-badge">
                  {product.discount}% OFF
                </span>
              </div>
            )}
          </div>
          <Link to={`/product/${product._id}`} className="pc-view-link">
            View details →
          </Link>
        </div>

        {/* BUTTON */}
        <button
          className={`pc-btn ${added ? "added" : ""}`}
          onClick={addToCartHandler}
        >
          {added ? "✓ Added to cart" : "Add to cart"}
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
