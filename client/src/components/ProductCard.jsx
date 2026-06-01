import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";
import "../css/ProductCard.css";
import getImageUrl from "../utils/getImageUrl";
import API_URL from "@/config/api";

// ✅ User-specific wishlist key
const getWishlistKey = () => {
  const userInfo = JSON.parse(
    localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
  );
  return userInfo?.user?.id ? `wishlist_${userInfo.user.id}` : "wishlist";
};

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const [currentImage, setCurrentImage] = useState(0);
  const [fade, setFade] = useState(false);
  const navigate = useNavigate();
  const intervalRef = useRef(null);

  const finalPrice =
    product.finalPrice ||
    product.price - (product.price * product.discount) / 100;

  const startImageLoop = () => {
    if (intervalRef.current || product.images.length <= 1) return;
    setFade(true);
    setTimeout(() => {
      setCurrentImage(1);
      setFade(false);
    }, 180);
    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentImage((prev) => (prev + 1) % product.images.length);
        setFade(false);
      }, 350);
    }, 1500);
  };

  const stopImageLoop = () => {
    clearInterval(intervalRef.current);
    intervalRef.current = null;
    setFade(false);
  };

  const addToCartHandler = async () => {
    try {
      const userInfo = JSON.parse(
        localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
      );
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
      console.log(error);
      alert("Failed to add to cart");
    }
  };

  // ✅ Use user-specific key
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

  // ✅ Use user-specific key
  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem(getWishlistKey())) || [];
    const exists = wishlist.find((x) => x._id === product._id);
    setWished(!!exists);
  }, [product._id]);

  useEffect(() => {
    return () => clearInterval(intervalRef.current);
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
        <img
          src={getImageUrl(product.images?.[currentImage])}
          alt={product.name}
          className={`pc-img ${fade ? "fade-out" : "fade-in"}`}
          onMouseEnter={() => {
            if (!product.images?.length) return;
            startImageLoop();
          }}
          onMouseLeave={() => {
            stopImageLoop();
            setFade(false);
            setCurrentImage(0);
          }}
        />

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
