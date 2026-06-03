import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../css/AdminProductsPage.css";
import FloatingAIButton from "../components/FloatingAIButton";
import API_URL from "@/config/api";
import getImageUrl from "@/utils/getImageUrl";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    images: [],
    description: "",
    price: "",
    discount: "",
    category: "",
    stock: "",
  });
  const location = useLocation();

  const navLinks = [
    { to: "/admin", label: "Dashboard", icon: "⬡" },
    { to: "/admin/products", label: "Products", icon: "◈" },
    { to: "/admin/orders", label: "Orders", icon: "◎" },
    { to: "/admin/users", label: "Users", icon: "◉" },
  ];

  const getUserInfo = () =>
    JSON.parse(
      localStorage.getItem("userInfo") || sessionStorage.getItem("userInfo"),
    );

  const addProductHandler = async () => {
    try {
      const userInfo = getUserInfo();
      console.log(newProduct);
      const { data } = await axios.post(
        `${API_URL}/api/admin/products`,
        newProduct,
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setProducts([data, ...products]);
      setShowModal(false);
      setNewProduct({
        name: "",
        images: [],
        description: "",
        price: "",
        discount: "",
        category: "",
        stock: "",
      });
    } catch (error) {
      console.error(error);
    }
  };

  const uploadFileHandler = async (e) => {
    try {
      const files = Array.from(e.target.files);

      const userInfo = getUserInfo();

      const uploadedImages = [];

      for (const file of files) {
        const formData = new FormData();

        formData.append("image", file);

        const { data } = await axios.post(
          `${API_URL}/api/admin/upload`,
          formData,
          {
            headers: {
              Authorization: `Bearer ${userInfo.token}`,
            },
          },
        );

        uploadedImages.push(data.image);
      }

      setNewProduct((prev) => ({
        ...prev,
        images: [...prev.images, ...uploadedImages],
      }));
    } catch (error) {
      console.log(error);
      alert("Image upload failed");
    }
  };

  const updateStock = async (product, amount) => {
    try {
      const userInfo = getUserInfo();
      const updatedStock = Math.max(0, product.stock + amount);
      const { data } = await axios.put(
        `${API_URL}/api/admin/products/${product._id}`,
        { stock: updatedStock },
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setProducts(products.map((p) => (p._id === product._id ? data : p)));
    } catch (error) {
      console.error(error);
    }
  };

  const deleteHandler = async (id) => {
    if (!window.confirm("Delete this product?")) return;
    try {
      const userInfo = getUserInfo();
      await axios.delete(`${API_URL}/api/admin/products/${id}`, {
        headers: { Authorization: `Bearer ${userInfo.token}` },
      });
      setProducts((prev) => prev.filter((p) => p._id !== id));
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    const fetchData = async () => {
      try {
        const userInfo = getUserInfo();
        const headers = { Authorization: `Bearer ${userInfo.token}` };
        const [prodRes, catRes] = await Promise.all([
          axios.get(`${API_URL}/api/admin/products`, { headers }),
          axios.get(`${API_URL}/api/admin/categories`, { headers }),
        ]);
        setProducts(prodRes.data);
        setCategories(catRes.data);
      } catch (error) {
        console.error(error);
      }
    };
    fetchData();
  }, []);

  return (
    <>
      <div className="ap-root">
        {/* TOGGLE */}
        <button className="ap-toggle" onClick={() => setSidebarOpen((o) => !o)}>
          {sidebarOpen ? "✕" : "☰"}
        </button>

        {/* SIDEBAR */}
        <div
          className="ap-sidebar"
          style={{ width: sidebarOpen ? "260px" : "0px" }}
        >
          <div className="ap-sidebar-inner">
            <div className="ap-brand">
              <span className="ap-brand-name">Admin Panel</span>
            </div>

            <span className="ap-nav-label">Navigation</span>

            {navLinks.map((link) => (
              <Link
                key={link.to}
                to={link.to}
                className={`ap-nav-link ${location.pathname === link.to ? "active" : ""}`}
              >
                <span style={{ fontSize: 16, width: 20, textAlign: "center" }}>
                  {link.icon}
                </span>
                {link.label}
              </Link>
            ))}

            <div className="ap-sidebar-footer">
              <p>v1.0.0 · ADMIN</p>
            </div>
          </div>
        </div>

        {/* MAIN */}
        <div className="ap-main">
          {/* Header */}
          <div className="ap-main-header">
            <div>
              <p className="ap-breadcrumb">Admin · Products</p>
              <h1 className="ap-page-title">Manage Products</h1>
            </div>
            <span className="ap-count-badge">{products.length} items</span>
          </div>

          {/* Add Button */}
          <button className="ap-add-btn" onClick={() => setShowModal(true)}>
            <span style={{ fontSize: 18, lineHeight: 1 }}>+</span> Add Product
          </button>

          {/* Product List */}
          <div className="ap-product-list">
            {products.length === 0 ? (
              <div className="ap-empty">NO PRODUCTS FOUND</div>
            ) : (
              products.map(
                (product, i) => (
                  console.log(product.images),
                  (
                    <div
                      className="ap-product-card"
                      key={product._id}
                      style={{ animationDelay: `${i * 0.05}s` }}
                    >
                      {product.images?.[0] ? (
                        <img
                          src={getImageUrl(product.images[0])}
                          alt={product.name}
                          className="ap-product-img"
                        />
                      ) : (
                        <div className="ap-product-img-placeholder">◈</div>
                      )}

                      <div className="ap-product-info">
                        <p className="ap-product-name">{product.name}</p>
                        <div className="ap-product-meta">
                          <span className="ap-product-price">
                            ₹{product.price}
                          </span>
                          {product.category && (
                            <span className="ap-product-cat">
                              {product.category}
                            </span>
                          )}
                          {product.discount > 0 && (
                            <span
                              style={{
                                fontFamily: "'DM Mono',monospace",
                                fontSize: 10,
                                color: "#fb923c",
                              }}
                            >
                              -{product.discount}% OFF
                            </span>
                          )}
                        </div>
                      </div>

                      {/* Stock Control */}
                      <div className="ap-stock-control">
                        <button
                          className="ap-stock-btn"
                          onClick={() => updateStock(product, -1)}
                        >
                          −
                        </button>
                        <span className="ap-stock-val">{product.stock}</span>
                        <button
                          className="ap-stock-btn"
                          onClick={() => updateStock(product, 1)}
                        >
                          +
                        </button>
                      </div>

                      <button
                        className="ap-delete-btn"
                        onClick={() => deleteHandler(product._id)}
                      >
                        Delete
                      </button>
                    </div>
                  )
                ),
              )
            )}
          </div>
        </div>

        {/* MODAL */}
        {showModal && (
          <div
            className="ap-modal-overlay"
            onClick={(e) => e.target === e.currentTarget && setShowModal(false)}
          >
            <div className="ap-modal">
              <div className="ap-modal-header">
                <h2 className="ap-modal-title">Add Product</h2>
                <button
                  className="ap-modal-close"
                  onClick={() => setShowModal(false)}
                >
                  ✕
                </button>
              </div>

              <div className="ap-form">
                {/* PRODUCT NAME */}
                <div className="ap-input-wrap">
                  <label className="ap-input-label">Product Name</label>

                  <input
                    className="ap-input"
                    placeholder="e.g. Wireless Headphones"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        name: e.target.value,
                      })
                    }
                  />
                </div>
                {/* PRODUCT IMAGES */}
                <div className="ap-input-wrap">
                  <label className="ap-input-label">Product Images</label>

                  {/* FILE INPUT */}
                  <div className="ap-upload-wrapper">
                    <label htmlFor="product-images" className="ap-upload-box">
                      <div className="ap-upload-icon">📷</div>
                      <div className="ap-upload-text">
                        <strong>Upload Product Images</strong>
                        <span>Click or drag images here</span>
                      </div>
                    </label>

                    <input
                      id="product-images"
                      type="file"
                      accept="image/*"
                      multiple
                      onChange={uploadFileHandler}
                      className="ap-upload-input"
                    />
                  </div>

                  {/* IMAGE PREVIEWS */}
                  <div
                    style={{
                      display: "flex",
                      gap: "12px",
                      flexWrap: "wrap",
                      marginTop: "18px",
                    }}
                  >
                    {newProduct.images.map((img, index) => (
                      <div
                        key={index}
                        style={{
                          position: "relative",
                        }}
                      >
                        <img
                          src={`${API_URL}${img}`}
                          alt=""
                          style={{
                            width: "90px",
                            height: "90px",
                            objectFit: "cover",
                            borderRadius: "14px",
                            border: "1px solid rgba(255,255,255,0.08)",
                          }}
                        />

                        {/* REMOVE IMAGE */}
                        <button
                          type="button"
                          onClick={() => {
                            setNewProduct({
                              ...newProduct,
                              images: newProduct.images.filter(
                                (_, i) => i !== index,
                              ),
                            });
                          }}
                          style={{
                            position: "absolute",
                            top: "-8px",
                            right: "-8px",
                            width: "24px",
                            height: "24px",
                            borderRadius: "50%",
                            border: "none",
                            background: "#ef4444",
                            color: "white",
                            cursor: "pointer",
                            fontSize: "12px",
                          }}
                        >
                          ✕
                        </button>
                      </div>
                    ))}
                  </div>
                </div>

                <div className="ap-input-row">
                  <div className="ap-input-wrap">
                    <label className="ap-input-label">Price (₹)</label>
                    <input
                      className="ap-input"
                      type="number"
                      placeholder="0.00"
                      value={newProduct.price}
                      onChange={(e) =>
                        setNewProduct({ ...newProduct, price: e.target.value })
                      }
                    />
                  </div>
                  <div className="ap-input-wrap">
                    <label className="ap-input-label">Discount (%)</label>
                    <input
                      className="ap-input"
                      type="number"
                      placeholder="0"
                      value={newProduct.discount}
                      onChange={(e) =>
                        setNewProduct({
                          ...newProduct,
                          discount: e.target.value,
                        })
                      }
                    />
                  </div>
                </div>
                <div className="ap-input-wrap">
                  <label className="ap-input-label">Category</label>
                  <select
                    className="ap-input"
                    value={newProduct.category}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        category: e.target.value.trim().toLowerCase(),
                      })
                    }
                  >
                    <option value="">Select Category</option>
                    {categories.map((cat) => (
                      <option key={cat} value={cat}>
                        {cat}
                      </option>
                    ))}
                    <option value="custom">+ Add New Category</option>
                  </select>
                </div>
                {newProduct.category === "custom" && (
                  <div className="ap-input-wrap">
                    <label className="ap-input-label">New Category Name</label>
                    <div className="ap-cat-row">
                      <input
                        className="ap-input"
                        placeholder="e.g. Electronics"
                        value={customCategory}
                        onChange={(e) => setCustomCategory(e.target.value)}
                      />
                      <button
                        className="ap-cat-add-btn"
                        onClick={() => {
                          if (!customCategory.trim()) return;
                          setCategories([...categories, customCategory]);
                          setNewProduct({
                            ...newProduct,
                            category: customCategory,
                          });
                          setCustomCategory("");
                        }}
                      >
                        Add
                      </button>
                    </div>
                  </div>
                )}
                <div className="ap-input-wrap">
                  <label className="ap-input-label">Stock</label>
                  <input
                    className="ap-input"
                    type="number"
                    placeholder="0"
                    value={newProduct.stock}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, stock: e.target.value })
                    }
                  />
                </div>
                <div className="ap-input-wrap">
                  <label className="ap-input-label">Description</label>
                  <textarea
                    className="ap-input"
                    placeholder="Product description..."
                    value={newProduct.description}
                    onChange={(e) =>
                      setNewProduct({
                        ...newProduct,
                        description: e.target.value,
                      })
                    }
                    style={{ minHeight: 100, resize: "none" }}
                  />
                </div>
                <button className="ap-submit-btn" onClick={addProductHandler}>
                  Add Product
                </button>
              </div>
            </div>
          </div>
        )}
        <FloatingAIButton />
      </div>
    </>
  );
};

export default AdminProductsPage;
