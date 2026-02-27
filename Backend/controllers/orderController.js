const {
  createOrderFromCart,
  getFarmerOrders,
  updateOrderStatus,
  getAllOrdersDetailed,
  trackOrderByTrackingId
} = require("../models/orderModel");

// USER PLACE ORDER
const placeOrder = async (req, res) => {
  try {
    const user_id = req.user.id;

    const {
      first_name,
      last_name,
      phone,
      street_address,
      city,
      postal_code,
    } = req.body;

    if (
      !first_name ||
      !last_name ||
      !phone ||
      !street_address ||
      !city ||
      !postal_code
    ) {
      return res.status(400).json({
        message: "All shipping fields are required",
      });
    }

    const order = await createOrderFromCart(user_id, req.body);

    res.status(201).json({
      message: "Order placed successfully",
      order,
    });
  } catch (error) {
    res.status(400).json({ message: error.message });
  }
};

// FARMER GET THEIR ORDERS
const fetchFarmerOrders = async (req, res) => {
  try {
    const farmer_id = req.user.id;
    const orders = await getFarmerOrders(farmer_id);
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN UPDATE STATUS
const changeOrderStatus = async (req, res) => {
  try {
    const { status } = req.body;
    const order_id = req.params.id;

    const allowedStatuses = [
      "pending",
      "accepted",
      "shipped",
      "delivered",
      "cancelled",
    ];

    if (!allowedStatuses.includes(status)) {
      return res.status(400).json({ message: "Invalid status" });
    }

    const updated = await updateOrderStatus(order_id, status);

    if (!updated) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json({
      message: "Order status updated",
      updated,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchAllOrders = async (req, res) => {
  try {
    const orders = await getAllOrdersDetailed();
    res.json(orders);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const trackOrder = async (req, res) => {
  try {
    const { trackingId } = req.params;

    const order = await trackOrderByTrackingId(trackingId);

    if (order.length === 0) {
      return res.status(404).json({ message: "Order not found" });
    }

    res.json(order);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  placeOrder,
  fetchFarmerOrders,
  changeOrderStatus,
  fetchAllOrders,
  trackOrder
};