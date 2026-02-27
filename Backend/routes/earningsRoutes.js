// routes/earningsRoutes.js

const express = require("express");
const {
  fetchAllEarnings,
  fetchPlatformRevenue,
  fetchGrowerEarnings,
  fetchGrowerTotal,
} = require("../controllers/earningsController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// ADMIN ROUTES
router.get("/admin/all", protect, authorizeRoles("admin"), fetchAllEarnings);
router.get("/admin/revenue", protect, authorizeRoles("admin"), fetchPlatformRevenue);

// GROWER ROUTES
router.get("/grower", protect, authorizeRoles("farmer"), fetchGrowerEarnings);
router.get("/grower/total", protect, authorizeRoles("farmer"), fetchGrowerTotal);

module.exports = router;