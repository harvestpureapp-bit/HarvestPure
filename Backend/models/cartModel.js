const pool = require("../config/db");

const addToCart = async (user_id, product_id, quantity) => {
  const existing = await pool.query(
    `SELECT * FROM cart_items 
     WHERE user_id = $1 AND product_id = $2`,
    [user_id, product_id],
  );

  if (existing.rows.length > 0) {
    const updated = await pool.query(
      `UPDATE cart_items 
       SET quantity = quantity + $1
       WHERE user_id = $2 AND product_id = $3
       RETURNING *`,
      [quantity, user_id, product_id],
    );
    return updated.rows[0];
  }

  const result = await pool.query(
    `INSERT INTO cart_items (user_id, product_id, quantity)
     VALUES ($1,$2,$3)
     RETURNING *`,
    [user_id, product_id, quantity],
  );

  return result.rows[0];
};

const getCartItems = async (user_id) => {
  const result = await pool.query(
    `SELECT 
        c.id,
        c.quantity,
        p.title,
        p.price,
        p.primary_image,
        u.username AS farmer_name
     FROM cart_items c
     JOIN products p ON c.product_id = p.id
     JOIN users u ON p.farmer_id = u.id
     WHERE c.user_id = $1`,
    [user_id],
  );

  return result.rows;
};
const removeFromCart = async (user_id, cart_id) => {
  const result = await pool.query(
    `DELETE FROM cart_items
     WHERE id = $1 AND user_id = $2
     RETURNING *`,
    [cart_id, user_id],
  );

  return result.rows[0];
};

const updateCartQuantity = async (user_id, cart_id, quantity) => {
  const result = await pool.query(
    `UPDATE cart_items
     SET quantity = $1
     WHERE id = $2 AND user_id = $3
     RETURNING *`,
    [quantity, cart_id, user_id],
  );

  return result.rows[0];
};

module.exports = {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
};
