import User from "../models/User.js";

// GET USER PROFILE
export const getUserProfile = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json({
      _id: user._id,
      name: user.name,
      email: user.email,
      role: user.role,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GET SHIPPING ADDRESSES
export const getShippingAddresses = async (req, res) => {
  try {
    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    res.json(user.shippingAddresses || []);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADD SHIPPING ADDRESS
export const addShippingAddress = async (req, res) => {
  try {
    const { fullName, address, city, postalCode, country } = req.body;

    if (!fullName || !address || !city || !postalCode || !country) {
      return res
        .status(400)
        .json({ message: "All address fields are required" });
    }

    const user = await User.findById(req.user._id);

    if (!user) {
      return res.status(404).json({ message: "User not found" });
    }

    user.shippingAddresses.push({
      fullName,
      address,
      city,
      postalCode,
      country,
    });
    await user.save();

    res.status(201).json(user.shippingAddresses);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

export const updateUserProfile = async (req, res) => {
  const user = await User.findById(req.user._id);
  if (!user) return res.status(404).json({ message: "User not found" });
  user.name = req.body.name || user.name;
  user.email = req.body.email || user.email;
  if (req.body.password)
    user.password = await bcrypt.hash(req.body.password, 10);
  const updated = await user.save();
  res.json({
    _id: updated._id,
    name: updated.name,
    email: updated.email,
    role: updated.role,
  });
};
