// controllers/earningsController.js

const {
  getAllEarnings,
  getPlatformRevenue,
  getGrowerEarnings,
  getGrowerTotal,
} = require("../models/earningsModel");

// ADMIN - see all earnings
const fetchAllEarnings = async (req, res) => {
  try {
    const earnings = await getAllEarnings();
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// ADMIN - total platform revenue
const fetchPlatformRevenue = async (req, res) => {
  try {
    const revenue = await getPlatformRevenue();
    res.json(revenue);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GROWER - own earnings
const fetchGrowerEarnings = async (req, res) => {
  try {
    const grower_id = req.user.id; // ⚠ depends how you map grower to user
    const earnings = await getGrowerEarnings(grower_id);
    res.json(earnings);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

// GROWER - total earnings
const fetchGrowerTotal = async (req, res) => {
  try {
    const grower_id = req.user.id;
    const total = await getGrowerTotal(grower_id);
    res.json(total);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  fetchAllEarnings,
  fetchPlatformRevenue,
  fetchGrowerEarnings,
  fetchGrowerTotal,
};