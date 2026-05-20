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

    const pageSize = 4;
    const page = Number(req.query.pageNumber) || 1;

    const count = await Product.countDocuments({
      ...keyword,
      ...categoryFilter,
    });
    // ADD PRODUCTS
    let sortOption = {};

    if (req.query.sort === "lowToHigh") {
      sortOption = { price: 1 };
    }

    if (req.query.sort === "highToLow") {
      sortOption = { price: -1 };
    }

    if (req.query.sort === "name") {
      sortOption = { name: 1 };
    }

    const products = await Product.find({
      ...keyword,
      ...categoryFilter,
    })
      .sort(sortOption)
      .limit(pageSize)
      .skip(pageSize * (page - 1));

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
    const { name, description, price, category, image, stock } = req.body;

    const product = await Product.create({
      name,
      description,
      price,
      category,
      image,
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

    product.category = req.body.category || product.category;

    product.image = req.body.image || product.image;

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
