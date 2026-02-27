const {
  createProduct,
  addProductImages,
  getAllProducts,
  getProductBySlug,
  getAllProductsForAdmin,
  getProductsByFarmerUser,
} = require("../models/productModel");

const pool = require("../config/db");

const addProduct = async (req, res) => {
  try {
    const user_id = req.user.id;

    // 🔥 Get grower_id from growers table
    const growerResult = await pool.query(
      "SELECT id FROM growers WHERE user_id = $1",
      [user_id],
    );

    if (growerResult.rows.length === 0) {
      return res.status(400).json({ message: "Grower profile not found" });
    }

    const grower_id = growerResult.rows[0].id;

    const imagePaths = req.files
      ? req.files.map((file) => file.path) // ✅ Cloudinary URL
      : [];

    const product = await createProduct({
      ...req.body,
      grower_id, // ✅ CORRECT FIELD
      primary_image: imagePaths[0] || null,
    });

    if (imagePaths.length > 0) {
      await addProductImages(product.id, imagePaths);
    }

    res.status(201).json({
      message: "Product created successfully",
      product,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchProducts = async (req, res) => {
  try {
    const products = await getAllProducts();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchSingleProduct = async (req, res) => {
  try {
    const product = await getProductBySlug(req.params.slug);

    if (!product) {
      return res.status(404).json({ message: "Product not found" });
    }

    res.json(product);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchAllProductsAdmin = async (req, res) => {
  try {
    const products = await getAllProductsForAdmin();
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchFarmerProducts = async (req, res) => {
  try {
    const user_id = req.user.id;

    const products = await getProductsByFarmerUser(user_id);
    res.json(products);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProduct,
  fetchProducts,
  fetchSingleProduct,
  fetchAllProductsAdmin,
  fetchFarmerProducts,
};
