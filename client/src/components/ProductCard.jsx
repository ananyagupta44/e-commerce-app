import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import { useNavigate } from "react-router-dom";
import axios from "axios";

const ProductCard = ({ product }) => {
  const [wished, setWished] = useState(false);
  const [added, setAdded] = useState(false);
  const navigate = useNavigate();
  const finalPrice =
    product.finalPrice ||
    product.price - (product.price * product.discount) / 100;

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
          image: product.image,
          price: product.finalPrice,
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

  return (
    <>
      <style>{`
        @import url('https://fonts.googleapis.com/css2?family=Playfair+Display:wght@600&family=Jost:wght@300;400;500&display=swap');

        .pc-card {
  background: #0f172a;
  border: 1px solid rgba(255,255,255,0.06);
  overflow: hidden;
  font-family: 'Jost', sans-serif;
  transition: border-color 0.25s ease;
  position: relative;
  height: 100%;
}

        .pc-card:hover {
        
          border-color: #3a3a3a;
        }

        .pc-img-wrap {
          position: relative;
          width: 100%;
          height: 320px;
          overflow: hidden;
          background: #222;
          display: block;
        }

        .pc-img-wrap img {
          width: 100%;
          height: 100%;
          object-fit: cover;
          display: block;
          transition: transform 0.4s ease;
        }

        .pc-card:hover .pc-img-wrap img {
          transform: scale(1.05);
        }

        .pc-wish {
          position: absolute;
          top: 10px;
          right: 10px;
          width: 32px;
          height: 32px;
          border-radius: 50%;
          background: rgba(26,26,26,0.85);
          border: 1px solid #333;
          cursor: pointer;
          font-size: 15px;
          display: flex;
          align-items: center;
          justify-content: center;
          transition: transform 0.2s, color 0.2s;
          color: #666;
          z-index: 2;
        }

        .pc-wish:hover { transform: scale(1.15); }
        .pc-wish.active { color: #e24b4a; }

        .pc-body {
          padding: 1.1rem 1.2rem 1.3rem;
        }

        .pc-name {
          font-family: 'Playfair Display', serif;
          font-size: 17px;
          font-weight: 600;
          color: #f0ece4;
          margin: 0 0 8px;
          line-height: 1.3;
          text-align: center;
        }

        .pc-divider {
          border: none;
          border-top: 1px solid #2a2a2a;
          margin: 0 0 10px;
        }

        .pc-desc {
          font-size: 12.5px;
          font-weight: 300;
          color: #888;
          line-height: 1.7;
          margin: 0 0 14px;
          display: -webkit-box;
          -webkit-line-clamp: 2;
          -webkit-box-orient: vertical;
          overflow: hidden;
        }

        .pc-price-row {
          display: flex;
          align-items: center;
          justify-content: space-between;
          margin-bottom: 13px;
        }

        .pc-price {
          font-size: 20px;
          font-weight: 500;
          color: #f0ece4;
          margin: 0;
          letter-spacing: -0.02em;
        }

        .pc-price span {
          font-size: 13px;
          font-weight: 400;
          color: #666;
          margin-right: 1px;
        }

        .pc-view-link {
          font-size: 11px;
          font-weight: 500;
          letter-spacing: 0.06em;
          text-transform: uppercase;
          color: #888;
          text-decoration: none;
          border-bottom: 1px solid #333;
          padding-bottom: 1px;
          transition: color 0.2s, border-color 0.2s;
        }

        .pc-view-link:hover {
          color: #f0ece4;
          border-color: #f0ece4;
        }

        .pc-btn {
          width: 100%;
          font-family: 'Jost', sans-serif;
          font-size: 11.5px;
          font-weight: 500;
          letter-spacing: 0.08em;
          text-transform: uppercase;
          padding: 11px;
          border-radius: 9px;
          border: 1px solid #3a3a3a;
          background: transparent;
          color: #f0ece4;
          cursor: pointer;
          transition: background 0.2s, border-color 0.2s;
          box-sizing: border-box;
        }

        .pc-btn:hover, .pc-btn.added {
          background: #f0ece4;
          color: #1a1a1a;
          border-color: #f0ece4;
        }
      `}</style>

      <div className="pc-card">
        {/* Image links to product detail page */}
        <Link to={`/product/${product._id}`} className="pc-img-wrap">
          <img src={product.image} alt={product.name} />
          <button
            className={`pc-wish${wished ? " active" : ""}`}
            onClick={(e) => {
              e.preventDefault();
              toggleWishlist();
            }}
            aria-label={wished ? "Remove from wishlist" : "Add to wishlist"}
          >
            {wished ? "♥" : "♡"}
          </button>
        </Link>

        <div className="pc-body">
          <h2 className="pc-name">{product.name}</h2>
          <hr className="pc-divider" />
          <p className="pc-desc">{product.description}</p>

          <div className="pc-price-row">
            <div>
              {/* FINAL PRICE */}
              <p className="pc-price">
                <span>$</span>
                {product.finalPrice.toFixed(2)}
              </p>

              {/* ORIGINAL PRICE + DISCOUNT */}
              {product.discount > 0 && (
                <div
                  style={{
                    display: "flex",
                    alignItems: "center",
                    gap: "8px",
                    marginTop: "4px",
                  }}
                >
                  <span
                    style={{
                      textDecoration: "line-through",
                      color: "#777",
                      fontSize: "13px",
                    }}
                  >
                    ${product.price.toFixed(2)}
                  </span>

                  <span
                    style={{
                      background: "#ef4444",
                      color: "white",
                      fontSize: "11px",
                      padding: "2px 6px",
                      borderRadius: "6px",
                      fontWeight: "600",
                    }}
                  >
                    {product.discount}% OFF
                  </span>
                </div>
              )}
            </div>

            <Link to={`/product/${product._id}`} className="pc-view-link">
              View details →
            </Link>
          </div>

          <button
            className={`pc-btn${added ? " added" : ""}`}
            onClick={addToCartHandler}
          >
            {added ? "✓ Added to cart" : "Add to cart"}
          </button>
        </div>
      </div>
    </>
  );
};

export default ProductCard;
