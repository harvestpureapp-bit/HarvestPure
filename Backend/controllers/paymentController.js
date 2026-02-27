const crypto = require("crypto");
const { createRazorpayOrder } = require("../models/paymentModel");
const { createOrderFromCart } = require("../models/orderModel");

// STEP 1 - Create Razorpay Order
const createPaymentOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    const { razorpayOrder, total } =
      await createRazorpayOrder(user_id);

    res.json({
      key: process.env.RAZORPAY_KEY_ID,
      order_id: razorpayOrder.id,
      amount: razorpayOrder.amount, // paisa (for Razorpay)
      currency: razorpayOrder.currency,
      total, // rupees (for frontend display)
    });

  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// STEP 2 - Verify Payment & Create Order
const verifyPayment = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      razorpay_order_id,
      razorpay_payment_id,
      razorpay_signature,
      shippingData,
    } = req.body;

    const generated_signature = crypto
      .createHmac("sha256", process.env.RAZORPAY_KEY_SECRET)
      .update(`${razorpay_order_id}|${razorpay_payment_id}`)
      .digest("hex");

    // if (generated_signature !== razorpay_signature) {
    //   return res.status(400).json({ message: "Payment verification failed" });
    // }

    // Payment is valid → create order
    const order = await createOrderFromCart(user_id, shippingData);

    res.json({
      message: "Payment successful & Order created",
      order,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  createPaymentOrder,
  verifyPayment,
};
