import { useEffect, useState } from "react";
import axios from "axios";
import { Link, useLocation } from "react-router-dom";
import "../css/AdminProductsPage.css";

const AdminProductsPage = () => {
  const [products, setProducts] = useState([]);
  const [showModal, setShowModal] = useState(false);
  const [categories, setCategories] = useState([]);
  const [customCategory, setCustomCategory] = useState("");
  const [sidebarOpen, setSidebarOpen] = useState(true);
  const [newProduct, setNewProduct] = useState({
    name: "",
    image: "",
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
      const { data } = await axios.post(
        "http://localhost:5000/api/admin/products",
        newProduct,
        { headers: { Authorization: `Bearer ${userInfo.token}` } },
      );
      setProducts([data, ...products]);
      setShowModal(false);
      setNewProduct({
        name: "",
        image: "",
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

  const updateStock = async (product, amount) => {
    try {
      const userInfo = getUserInfo();
      const updatedStock = Math.max(0, product.stock + amount);
      const { data } = await axios.put(
        `http://localhost:5000/api/admin/products/${product._id}`,
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
      await axios.delete(`http://localhost:5000/api/admin/products/${id}`, {
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
          axios.get("http://localhost:5000/api/admin/products", { headers }),
          axios.get("http://localhost:5000/api/admin/categories", { headers }),
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
              products.map((product, i) => (
                <div
                  className="ap-product-card"
                  key={product._id}
                  style={{ animationDelay: `${i * 0.05}s` }}
                >
                  {product.image ? (
                    <img
                      src={product.image}
                      alt={product.name}
                      className="ap-product-img"
                    />
                  ) : (
                    <div className="ap-product-img-placeholder">◈</div>
                  )}

                  <div className="ap-product-info">
                    <p className="ap-product-name">{product.name}</p>
                    <div className="ap-product-meta">
                      <span className="ap-product-price">${product.price}</span>
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
              ))
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
                <div className="ap-input-wrap">
                  <label className="ap-input-label">Product Name</label>
                  <input
                    className="ap-input"
                    placeholder="e.g. Wireless Headphones"
                    value={newProduct.name}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, name: e.target.value })
                    }
                  />
                </div>

                <div className="ap-input-wrap">
                  <label className="ap-input-label">Image URL</label>
                  <input
                    className="ap-input"
                    placeholder="https://..."
                    value={newProduct.image}
                    onChange={(e) =>
                      setNewProduct({ ...newProduct, image: e.target.value })
                    }
                  />
                </div>

                <div className="ap-input-row">
                  <div className="ap-input-wrap">
                    <label className="ap-input-label">Price ($)</label>
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
      </div>
    </>
  );
};

export default AdminProductsPage;
