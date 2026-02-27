const express = require("express");
const {
  fetchAllUsers,
  removeUser,
} = require("../controllers/userController");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin only
router.get("/", protect, authorizeRoles("admin"), fetchAllUsers);
router.delete("/:id", protect, authorizeRoles("admin"), removeUser);

module.exports = router;