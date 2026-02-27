const pool = require("../config/db");
const razorpay = require("../config/razorpay");

// Create Razorpay Order
const createRazorpayOrder = async (user_id) => {
  const cartItems = await pool.query(
    `SELECT c.*, p.price
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     WHERE c.user_id = $1`,
    [user_id]
  );

  if (cartItems.rows.length === 0) {
    throw new Error("Cart is empty");
  }

  let total = 0;
  cartItems.rows.forEach(item => {
    total += item.price * item.quantity;
  });

  const razorpayOrder = await razorpay.orders.create({
    amount: total * 100,
    currency: "INR",
    receipt: `receipt_${Date.now()}`,
  });

  return {
    razorpayOrder,
    total,
  };
};

module.exports = {
  createRazorpayOrder,
};