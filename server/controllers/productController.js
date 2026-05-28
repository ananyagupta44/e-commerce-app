import Product from "../models/Product.js";

// GET ALL PRODUCTS
export const getProducts = async (req, res) => {
  try {
    // SEARCH FILTER
    const keyword = req.query.keyword
      ? {
          name: {
            $regex: req.query.keyword,
            $options: "i",
          },
        }
      : {};

    // CATEGORY FILTER
    const categoryFilter = req.query.category
      ? { category: req.query.category }
      : {};

    const pageSize = 9;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Product.countDocuments({
      ...keyword,
      ...categoryFilter,
    });
    // ADD PRODUCTS

    let products = await Product.find({
      ...keyword,
      ...categoryFilter,
    });

    products = products.map((product) => {
      const finalPrice =
        product.price - (product.price * product.discount) / 100;

      return {
        ...product._doc,
        finalPrice,
      };
    });

    // SORTING

    if (req.query.sort === "lowToHigh") {
      products.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    if (req.query.sort === "highToLow") {
      products.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    if (req.query.sort === "discount") {
      products.sort((a, b) => b.discount - a.discount);
    }

    if (req.query.sort === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    // PAGINATION AFTER SORTING

    const start = pageSize * (page - 1);

    const end = start + pageSize;

    products = products.slice(start, end);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// CREATE PRODUCT
export const createProduct = async (req, res) => {
  try {
    const { name, description, price, discount, category, images, stock } =
      req.body;

    const product = await Product.create({
      name,
      description,
      price,
      discount,
      category: category.toLowerCase(),
      images,
      stock,
    });

    res.status(201).json(product);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// GET PRODUCT BY ID
export const getProductById = async (req, res) => {
  try {
    const product = await Product.findById(req.params.id);

    if (product) {
      res.json(product);
    } else {
      res.status(404).json({
        message: "Product not found",
      });
    }
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
    product.description = req.body.description || product.description;

    product.price = req.body.price || product.price;

    product.discount = req.body.discount || product.discount;

    product.category =
      req.body.category?.trim().toLowerCase() || product.category;

    if (req.body.images) {
      product.images = req.body.images;
    }

    product.stock = req.body.stock || product.stock;

    const updatedProduct = await product.save();

    res.json(updatedProduct);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// DELETE A PRODUCT
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
      message: "Product removed",
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getPublicCategories = async (req, res) => {
  try {
    const categories = await Product.distinct("category");

    res.json(categories);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

export const getProductsByCategory = async (req, res) => {
  try {
    const pageSize = 9;

    const page = Number(req.query.pageNumber) || 1;

    const query = {
      category: {
        $regex: req.params.category,
        $options: "i",
      },
    };

    const count = await Product.countDocuments(query);

    let products = await Product.find(query);

    products = products.map((product) => {
      const finalPrice =
        product.price - (product.price * product.discount) / 100;

      return {
        ...product._doc,
        finalPrice,
      };
    });

    // SORTING

    if (req.query.sort === "lowToHigh") {
      products.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    if (req.query.sort === "highToLow") {
      products.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    if (req.query.sort === "discount") {
      products.sort((a, b) => b.discount - a.discount);
    }

    if (req.query.sort === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    // PAGINATION AFTER SORTING

    const start = pageSize * (page - 1);

    const end = start + pageSize;

    products = products.slice(start, end);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
export const searchProducts = async (req, res) => {
  try {
    const pageSize = 9;

    const page = Number(req.query.pageNumber) || 1;

    const query = {
      name: {
        $regex: req.params.keyword,
        $options: "i",
      },
    };

    const count = await Product.countDocuments(query);

    let products = await Product.find(query);

    products = products.map((product) => {
      const finalPrice =
        product.price - (product.price * product.discount) / 100;

      return {
        ...product._doc,
        finalPrice,
      };
    });

    // SORTING

    if (req.query.sort === "lowToHigh") {
      products.sort((a, b) => a.finalPrice - b.finalPrice);
    }

    if (req.query.sort === "highToLow") {
      products.sort((a, b) => b.finalPrice - a.finalPrice);
    }

    if (req.query.sort === "discount") {
      products.sort((a, b) => b.discount - a.discount);
    }

    if (req.query.sort === "name") {
      products.sort((a, b) => a.name.localeCompare(b.name));
    }

    // PAGINATION AFTER SORTING

    const start = pageSize * (page - 1);

    const end = start + pageSize;

    products = products.slice(start, end);

    res.json({
      products,
      page,
      pages: Math.ceil(count / pageSize),
    });
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};
// BEST deals
export const getBestDeals = async (req, res) => {
  try {
    const products = await Product.find().sort({ discount: -1 }).limit(5);

    res.json(products);
  } catch (error) {
    res.status(500).json({
      message: error.message,
    });
  }
};

// REVIEWS
export const createProductReview = async (req, res) => {
  const { rating, comment } = req.body;

  const product = await Product.findById(req.params.id);

  if (product) {
    const alreadyReviewed = product.reviews.find(
      (r) => r.user.toString() === req.user._id.toString(),
    );

    if (alreadyReviewed) {
      res.status(400);

      throw new Error("Product already reviewed");
    }

    const review = {
      name: req.user.name,
      rating: Number(rating),
      comment,
      user: req.user._id,
    };

    product.reviews.push(review);

    product.numReviews = product.reviews.length;

    product.rating =
      product.reviews.reduce((acc, item) => item.rating + acc, 0) /
      product.reviews.length;

    await product.save();

    res.status(201).json({
      message: "Review added",
    });
  } else {
    res.status(404);

    throw new Error("Product not found");
  }
};
