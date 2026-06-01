import Order from "../models/Order.js";
import User from "../models/User.js";

// CREATE ORDER
export const addOrderItems = async (req, res) => {
  try {
    const {
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    } = req.body;

    if (orderItems && orderItems.length === 0) {
      return res.status(400).json({
        message: "No order items",
      });
    }

    const order = new Order({
      user: req.user._id,
      orderItems,
      shippingAddress,
      paymentMethod,
      itemsPrice,
      shippingPrice,
      taxPrice,
      totalPrice,
    });

    const createdOrder = await order.save();

    // Clear user's cart after successful order creation
    const user = await User.findById(req.user._id);

    if (user) {
      user.cart = [];
      await user.save();
    }

    res.status(201).json(createdOrder);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET LOGGED IN USER ORDERS
export const getMyOrders = async (req, res) => {
  try {
    const orders = await Order.find({
      user: req.user._id,
    }).sort({
      createdAt: -1,
    });

    res.json(orders);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
