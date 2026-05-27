import User from "../models/User.js";

// GET USER CART
export const getCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

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
    const { product, name, image, price, originalPrice, discount, qty, stock } =
      req.body;

    const user = await User.findById(req.user._id);

    const existingItem = user.cart.find(
      (item) => item.product.toString() === product,
    );

    // UPDATE QTY
    if (existingItem) {
      existingItem.qty = qty;

      existingItem.price = price;

      existingItem.originalPrice = originalPrice;

      existingItem.discount = discount;
    } else {
      user.cart.push({
        product,
        name,
        image,
        price,
        originalPrice,
        discount,
        qty,
        stock,
      });
    }

    await user.save();

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REMOVE FROM CART
export const removeFromCart = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    user.cart = user.cart.filter(
      (item) => item.product.toString() !== req.params.id,
    );

    await user.save();

    res.json(user.cart);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
