const express = require("express");
const upload = require("../middleware/uploadMiddleware");
const {
  addProduct,
  fetchProducts,
  fetchSingleProduct,
  fetchAllProductsAdmin,
  fetchFarmerProducts
} = require("../controllers/productController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

/* ========= PUBLIC ROUTES ========= */

router.get("/", fetchProducts);

/* ========= PROTECTED ROUTES ========= */

router.get(
  "/farmer",
  protect,
  authorizeRoles("farmer"),
  fetchFarmerProducts
);

router.get(
  "/admin",
  protect,
  authorizeRoles("admin"),
  fetchAllProductsAdmin
);

router.post(
  "/",
  protect,
  authorizeRoles("farmer", "admin"),
  upload.array("images", 5),
  addProduct
);

/* ========= SINGLE PRODUCT (MUST BE LAST) ========= */

router.get("/:slug", fetchSingleProduct);

module.exports = router;