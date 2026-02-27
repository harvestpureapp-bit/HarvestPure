const express = require("express");
const {
  placeOrder,
  fetchFarmerOrders,
  changeOrderStatus,
  fetchAllOrders,
  trackOrder
} = require("../controllers/orderController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// USER places order
router.post("/", protect, placeOrder);
router.get("/track/:trackingId", protect, trackOrder);

// FARMER sees their product orders
router.get("/farmer", protect, authorizeRoles("farmer"), fetchFarmerOrders);

// ADMIN updates order status
router.put("/:id/status", protect, authorizeRoles("admin"), changeOrderStatus);
router.get("/", protect, authorizeRoles("admin"), fetchAllOrders);

module.exports = router;
