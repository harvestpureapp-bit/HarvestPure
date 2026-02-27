const express = require("express");
const cors = require("cors");
require("dotenv").config();

const app = express();

// Middleware
app.use(cors());
app.use(express.json());
app.use("/uploads", express.static("uploads"));

const userRoutes = require("./routes/userRoutes");
const productRoutes = require("./routes/productRoutes");
const cartRoutes = require("./routes/cartRoutes");
const orderRoutes = require("./routes/orderRoutes");
const paymentRoutes = require("./routes/paymentRoutes");
const growerRoutes = require("./routes/growerRoutes");
const adminUserRoutes = require("./routes/adminUserRoutes");
const earningsRoutes = require("./routes/earningsRoutes");

app.use("/auth", userRoutes);
app.use("/products", productRoutes);
app.use("/cart", cartRoutes);
app.use("/orders", orderRoutes);
app.use("/payment", paymentRoutes);
app.use("/growers", growerRoutes);
app.use("/admin/users",adminUserRoutes)
app.use("/earnings", earningsRoutes);
// Test Route
app.get("/", (req, res) => {
  res.send("HarvestPure Backend Running 🚀");
});

// Import DB (important)
require("./config/db");

// Start Server
const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`🚀 Server running on port ${PORT}`);
});
