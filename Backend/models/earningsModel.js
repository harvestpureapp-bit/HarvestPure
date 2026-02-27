// models/earningsModel.js
const pool = require("../config/db");

// Admin - get all earnings
const getAllEarnings = async () => {
  const result = await pool.query(
    `SELECT 
        ge.id,
        ge.order_id,
        g.name AS grower_name,
        ge.gross_amount,
        ge.platform_commission,
        ge.net_amount,
        ge.created_at
     FROM grower_earnings ge
     JOIN growers g ON ge.grower_id = g.id 
     ORDER BY ge.created_at DESC`,
  );

  return result.rows;
};

// Admin - total platform revenue
const getPlatformRevenue = async () => {
  const result = await pool.query(
    `SELECT SUM(platform_commission) AS total_revenue
     FROM grower_earnings`,
  );

  return result.rows[0];
};

// Grower - see own earnings
const getGrowerEarnings = async (user_id) => {
  const result = await pool.query(
    `SELECT 
        ge.order_id,
        ge.gross_amount,
        ge.platform_commission,
        ge.net_amount,
        ge.created_at
     FROM grower_earnings ge
     JOIN growers g ON ge.grower_id = g.id
     WHERE g.user_id = $1
     ORDER BY ge.created_at DESC`,
    [user_id],
  );

  return result.rows;
};

// Grower - total earnings
const getGrowerTotal = async (user_id) => {
  const result = await pool.query(
    `SELECT SUM(ge.net_amount) AS total_earned
     FROM grower_earnings ge
     JOIN growers g ON ge.grower_id = g.id
     WHERE g.user_id = $1`,
    [user_id],
  );

  return result.rows[0];
};

module.exports = {
  getAllEarnings,
  getPlatformRevenue,
  getGrowerEarnings,
  getGrowerTotal,
};
