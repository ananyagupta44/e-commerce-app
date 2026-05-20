import axios from "axios";

import { useEffect, useState } from "react";

import { useNavigate, useParams } from "react-router-dom";

const ProductDetailsPage = () => {
  const { id } = useParams();

  const navigate = useNavigate();

  const [product, setProduct] = useState(null);

  const [loading, setLoading] = useState(true);

  const [error, setError] = useState("");

  const [qty, setQty] = useState(1);

  // FETCH PRODUCT
  useEffect(() => {
    const fetchProduct = async () => {
      try {
        const { data } = await axios.get(
          `http://localhost:5000/api/products/${id}`,
        );

        setProduct(data);
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
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-950
          text-white
          text-2xl
        "
      >
        Loading...
      </div>
    );
  }

  // ERROR
  if (error) {
    return (
      <div
        className="
          min-h-screen
          flex
          items-center
          justify-center
          bg-slate-950
          text-red-500
          text-2xl
        "
      >
        {error}
      </div>
    );
  }

  return (
    <div
      className="
        min-h-screen
        bg-gradient-to-b
        from-slate-950
        to-slate-900
        text-white
        px-6
        md:px-16
        py-12
      "
    >
      {/* BACK BUTTON */}

      <button
        onClick={() => navigate(-1)}
        className="
          mb-10
          px-5
          py-2
          rounded-lg
          bg-slate-800
          hover:bg-slate-700
          transition
        "
      >
        ← Go Back
      </button>

      {/* MAIN SECTION */}

      <div
        className="
          grid
          grid-cols-1
          lg:grid-cols-2
          gap-16
          items-center
        "
      >
        {/* IMAGE */}

        <div
          className="
            bg-slate-900
            border
            border-slate-800
            rounded-3xl
            p-8
            flex
            justify-center
            items-center
          "
        >
          <img
            src={product.image}
            alt={product.name}
            className="
              w-full
              max-w-[500px]
              h-[500px]
              object-cover
              rounded-2xl
            "
          />
        </div>

        {/* DETAILS */}

        <div>
          {/* CATEGORY */}

          <span
            className="
              inline-block
              bg-indigo-500/20
              text-indigo-300
              px-4
              py-2
              rounded-full
              text-sm
              font-semibold
              mb-6
            "
          >
            {product.category}
          </span>

          {/* NAME */}

          <h1
            className="
              text-4xl
              md:text-5xl
              font-extrabold
              mb-6
            "
          >
            {product.name}
          </h1>

          {/* PRICE */}

          <h2
            className="
              text-3xl
              font-bold
              text-indigo-400
              mb-6
            "
          >
            ${product.price}
          </h2>

          {/* DESCRIPTION */}

          <p
            className="
              text-slate-400
              text-lg
              leading-8
              mb-8
            "
          >
            {product.description}
          </p>

          {/* STOCK */}

          <div
            className="
              flex
              items-center
              gap-3
              mb-8
            "
          >
            <span className="font-semibold">Status:</span>

            {product.stock > 0 ? (
              <span
                className="
                  text-green-400
                  font-bold
                "
              >
                In Stock
              </span>
            ) : (
              <span
                className="
                  text-red-400
                  font-bold
                "
              >
                Out of Stock
              </span>
            )}
          </div>

          {/* QUANTITY */}

          {product.stock > 0 && (
            <div className="mb-8">
              <label
                className="
                  block
                  mb-3
                  font-semibold
                "
              >
                Quantity
              </label>

              <select
                value={qty}
                onChange={(e) => setQty(Number(e.target.value))}
                className="
                  bg-slate-800
                  border
                  border-slate-700
                  px-4
                  py-3
                  rounded-xl
                  outline-none
                "
              >
                {[...Array(product.stock).keys()].map((x) => (
                  <option key={x + 1}>{x + 1}</option>
                ))}
              </select>
            </div>
          )}

          {/* BUTTONS */}

          <div
            className="
              flex
              flex-wrap
              gap-4
            "
          >
            <button
              className="
                bg-gradient-to-r
                from-indigo-500
                to-purple-500
                px-8
                py-4
                rounded-xl
                font-bold
                text-lg
                hover:opacity-90
                transition
              "
            >
              Add to Cart
            </button>

            <button
              className="
                border
                border-slate-700
                px-8
                py-4
                rounded-xl
                font-semibold
                hover:bg-slate-800
                transition
              "
            >
              ❤️ Wishlist
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetailsPage;
