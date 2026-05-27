import mongoose from "mongoose";

const userSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    email: {
      type: String,
      required: true,
      unique: true,
    },

    password: {
      type: String,
      required: true,
    },

    role: {
      type: String,
      enum: ["user", "admin"],
      default: "user",
    },
    cart: [
      {
        product: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "Product",
        },

        name: String,

        image: String,

        // DISCOUNTED PRICE
        price: Number,

        // ORIGINAL PRICE
        originalPrice: Number,

        // DISCOUNT %
        discount: {
          type: Number,
          default: 0,
        },

        qty: Number,

        stock: Number,
      },
    ],
  },
  {
    timestamps: true,
  },
);

const User = mongoose.model("User", userSchema);

export default User;
