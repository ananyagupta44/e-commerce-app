import jwt from "jsonwebtoken";
import User from "../models/User.js";

export const admin = (req, res, next) => {
  if (req.user && req.user.role === "admin") {
    next();
  } else {
    res.status(401).json({
      message: "Admin access only",
    });
  }
};

export const protect = async (req, res, next) => {
  let token;

  try {
    // CHECK TOKEN EXISTS
    if (
      req.headers.authorization &&
      req.headers.authorization.startsWith("Bearer")
    ) {
      token = req.headers.authorization.split(" ")[1];

      // VERIFY TOKEN
      const decoded = jwt.verify(token, process.env.JWT_SECRET);

      // GET USER
      const user = await User.findById(decoded.id).select("-password");

      if (!user) {
        return res.status(401).json({
          message: "User not found",
        });
      }

      if (
        user.passwordChangedAt &&
        decoded.iat * 1000 < user.passwordChangedAt.getTime()
      ) {
        return res.status(401).json({
          message: "Password was changed. Please login again.",
        });
      }

      req.user = user;

      next();
    } else {
      return res.status(401).json({
        message: "Not authorized, no token",
      });
    }
  } catch (error) {
    return res.status(401).json({
      message: "Token failed",
    });
  }
};
