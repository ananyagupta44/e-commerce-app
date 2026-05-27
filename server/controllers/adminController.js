import User from "../models/User.js";
import Order from "../models/Order.js";
import Product from "../models/Product.js";

// ==========================================
// GET ADMIN DASHBOARD STATS
// ==========================================

export const getAdminStats = async (req, res) => {
  try {
    // TOTAL USERS
    const totalUsers = await User.countDocuments();

    // TOTAL PRODUCTS
    const totalProducts = await Product.countDocuments();

    // TOTAL ORDERS
    const totalOrders = await Order.countDocuments();

    // ALL ORDERS
    const orders = await Order.find();

    // TOTAL REVENUE
    const totalRevenue = orders.reduce(
      (acc, order) => acc + Math.round(order.totalPrice),
      0,
    );

    res.json({
      totalUsers,
      totalProducts,
      totalOrders,
      totalRevenue,
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL USERS
// ==========================================

export const getAllUsers = async (req, res) => {
  try {
    const users = await User.find().select("-password");

    res.json(users);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL ORDERS
// ==========================================

export const getAllOrders = async (req, res) => {
  try {
    const orders = await Order.find()

      .populate("user", "name email")

      .sort({
        createdAt: -1,
      });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// GET ALL PRODUCTS
// ==========================================

export const getAllProducts = async (req, res) => {
  try {
    const products = await Product.find().sort({
      createdAt: -1,
    });

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE A NEW PRODUCT

export const createProduct = async (req, res) => {
  try {
    const { name, image, description, discount, price, category, stock } =
      req.body;

    const product = new Product({
      name,
      image,
      description,
      price,
      category,
      stock,
      discount,
    });

    const createdProduct = await product.save();

    res.status(201).json(createdProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// UPDATE A PRODUCT

export const updateProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    product.name = req.body.name || product.name;

    product.image = req.body.image || product.image;

    product.description = req.body.description || product.description;

    product.price = req.body.price || product.price;

    product.category = req.body.category || product.category;

    product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// DELETE PRODUCT
// ==========================================

export const deleteProduct = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (!product) {
      return res.status(404).json({
        message: "Product not found",
      });
    }

    await product.deleteOne();

    res.json({
      message: "Product deleted successfully",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET EXISTING CATEGORIES
export const getCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ==========================================
// UPDATE ORDER STATUS
// ==========================================

export const updateOrderStatus = async (req, res) => {
  try {
    const order = await Order.findById(req.params.id);

    if (!order) {
      return res.status(404).json({
        message: "Order not found",
      });
    }

    order.orderStatus = req.body.orderStatus;

    const updatedOrder = await order.save();

    res.json(updatedOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
