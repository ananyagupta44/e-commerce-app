import mongoose from "mongoose";

const productSchema = new mongoose.Schema(
  {
    name: {
      type: String,
      required: true,
    },

    description: {
      type: String,
      required: true,
    },

    price: {
      type: Number,
      required: true,
    },

    category: {
      type: String,
      required: true,
    },

    image: {
      type: String,
      required: true,
    },

    stock: {
      type: Number,
      required: true,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },

    numReviews: {
      type: Number,
      default: 0,
    },

    discount: {
      type: Number,
      default: 0,
    },
    originalPrice: {
      type: Number,
    },
    reviews: [
      {
        user: {
          type: mongoose.Schema.Types.ObjectId,
          ref: "User",
        },

        name: {
          type: String,
          required: true,
        },

        rating: {
          type: Number,
          required: true,
        },

        comment: {
          type: String,
          required: true,
        },
      },
    ],

    numReviews: {
      type: Number,
      default: 0,
    },

    rating: {
      type: Number,
      default: 0,
    },
  },
  {
    timestamps: true,

    toJSON: { virtuals: true },

    toObject: { virtuals: true },
  },
);

productSchema.virtual("finalPrice").get(function () {
  return Number((this.price - (this.price * this.discount) / 100).toFixed(2));
});

const Product = mongoose.model("Product", productSchema);

export default Product;
