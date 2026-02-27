const express = require("express");
const {
  addGrower,
  fetchGrowers,
  fetchGrower,
  editGrower,
  removeGrower,
} = require("../controllers/growerController");
const upload = require("../middleware/uploadMiddleware");

const { protect, authorizeRoles } = require("../middleware/authMiddleware");

const router = express.Router();

// Admin only
router.post(
  "/",
  protect,
  authorizeRoles("admin"),
  upload.single("profile_image"), // 👈 important
  addGrower,
);
router.put("/:id", protect, authorizeRoles("admin"), editGrower);
router.delete("/:id", protect, authorizeRoles("admin"), removeGrower);

// Public
router.get("/", fetchGrowers);
router.get("/:id", fetchGrower);

module.exports = router;
