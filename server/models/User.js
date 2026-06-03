import mongoose from "mongoose";

import bcrypt from "bcryptjs";

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
    shippingAddresses: [
      {
        fullName: String,
        address: String,
        city: String,
        postalCode: String,
        country: String,
      },
    ],
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

        images: [String],
      },
    ],
    resetPasswordToken: {
      type: String,
    },

    resetPasswordExpire: {
      type: Date,
    },
  },
  {
    timestamps: true,
  },
);

userSchema.pre("save", async function (next) {
  if (!this.isModified("password")) {
    return next();
  }

  const salt = await bcrypt.genSalt(10);

  this.password = await bcrypt.hash(this.password, salt);

  next();
});

userSchema.methods.matchPassword = async function (enteredPassword) {
  return await bcrypt.compare(enteredPassword, this.password);
};

const User = mongoose.model("User", userSchema);

export default User;
