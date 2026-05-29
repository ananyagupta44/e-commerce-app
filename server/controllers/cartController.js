import User from "../models/User.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// ADD TO CART
export const addToCart = async (req, res) => {
  try {
    const {
      product,
      name,
      images,
      price,
      originalPrice,
      discount,
      qty,
      stock,
    } = req.body;

    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    const existingItem = user.cart.find(
      (item) => item.product.toString() === product,
    );

    // UPDATE EXISTING ITEM
    if (existingItem) {
      existingItem.qty = qty;

      existingItem.price = price;

      existingItem.originalPrice = originalPrice;

      existingItem.discount = discount;

      existingItem.images = images;
    } else {
      user.cart.push({
        product,
        name,
        images,
        price,
        originalPrice,
        discount,
        qty,
        stock,
      });
    }

    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user.id);

    if (!user) {
      return res.status(404).json({
        message: "User not found",
      });
    }

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.id,
    );

    await user.save();

    res.status(200).json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
