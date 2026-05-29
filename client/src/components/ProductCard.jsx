import { useState, useEffect, useRef } from "react";
import { Link, useNavigate } from "react-router-dom";
import axios from "axios";

import "../css/ProductCard.css";

import getImageUrl from "../utils/getImageUrl";

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

  // IMAGE HOVER CHANGE
  const startImageLoop = () => {
    if (intervalRef.current || product.images.length <= 1) return;
    // FIRST IMAGE CHANGE INSTANTLY
    setFade(true);
    setTimeout(() => {
      setCurrentImage(1);
      setFade(false);
    }, 180);
    // THEN NORMAL LOOP
    intervalRef.current = setInterval(() => {
      setFade(true);
      setTimeout(() => {
        setCurrentImage((prev) => {
          return (prev + 1) % product.images.length;
        });
        setFade(false);
      }, 250);
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

      // LOGIN CHECK
      if (!userInfo) {
        alert("Please login first");
        navigate("/login");
        return;
      }
      await axios.post(
        "http://localhost:5000/api/cart",
        {
          product: product._id,
          name: product.name,
          image: product.images?.[0],
          price: finalPrice,
          qty: 1,
          stock: product.stock,
          originalPrice: product.price,
          discount: product.discount,
        },
        {
          headers: {
            Authorization: `Bearer ${userInfo.token}`,
          },
        },
      );
      setAdded(true);
      setTimeout(() => {
        setAdded(false);
      }, 1500);
      window.dispatchEvent(new Event("cartUpdated"));
      navigate("/cart");
    } catch (error) {
      console.log(error);
      alert("Failed to add to cart");
    }
  };

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

  useEffect(() => {
    const wishlist = JSON.parse(localStorage.getItem("wishlist")) || [];
    const exists = wishlist.find((x) => x._id === product._id);
    setWished(!!exists);
  }, [product._id]);

  useEffect(() => {
    return () => {
      clearInterval(intervalRef.current);
    };
  }, []);

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
              <span>$</span>

              {finalPrice.toFixed(2)}
            </p>

            {/* DISCOUNT */}
            {product.discount > 0 && (
              <div className="pc-discount-wrap">
                <span className="pc-old-price">
                  ${product.price.toFixed(2)}
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
