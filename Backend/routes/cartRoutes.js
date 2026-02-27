const express = require("express");
const {
  addProductToCart,
  fetchCart,
  deleteCartItem,
  changeQuantity
} = require("../controllers/cartController");

const { protect } = require("../middleware/authMiddleware");

const router = express.Router();

router.post("/", protect, addProductToCart);
router.get("/", protect, fetchCart);
router.delete("/:id", protect, deleteCartItem);
router.put("/:id", protect, changeQuantity);

module.exports = router;
