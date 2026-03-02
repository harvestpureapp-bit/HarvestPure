const pool = require("../config/db");

// Generate tracking ID
const generateTrackingId = () => {
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HPTRK-${timestamp}-${random}`;
};

// CREATE ORDER FROM CART
const COMMISSION_RATE = 0.1; // 10%

const createOrderFromCart = async (user_id, shippingData) => {
  const client = await pool.connect();

  try {
    await client.query("BEGIN");

    const { first_name, last_name, phone, street_address, city, postal_code } =
      shippingData;

    const cartItems = await client.query(
      `SELECT c.*, p.price, p.stock, p.grower_id
       FROM cart_items c
       JOIN products p ON c.product_id = p.id
       WHERE c.user_id = $1`,
      [user_id],
    );

    if (cartItems.rows.length === 0) {
      throw new Error("Cart is empty");
    }

    let total = 0;

    for (let item of cartItems.rows) {
      if (item.quantity > item.stock) {
        throw new Error(`Insufficient stock for product ID ${item.product_id}`);
      }

      total += item.price * item.quantity;
    }

    const trackingId = generateTrackingId();

    const orderResult = await client.query(
      `INSERT INTO orders
       (user_id, total_amount, tracking_id, order_status)
       VALUES ($1,$2,$3,'pending')
       RETURNING *`,
      [user_id, total, trackingId],
    );

    const order = orderResult.rows[0];

    // Insert shipping
    await client.query(
      `INSERT INTO shipping_addresses
       (order_id, first_name, last_name, phone, street_address, city, postal_code)
       VALUES ($1,$2,$3,$4,$5,$6,$7)`,
      [
        order.id,
        first_name,
        last_name,
        phone,
        street_address,
        city,
        postal_code,
      ],
    );

    // Process each item
    for (let item of cartItems.rows) {
      const itemTotal = item.price * item.quantity;
      const commission = itemTotal * COMMISSION_RATE;
      const netAmount = itemTotal - commission;

      // Insert order item
      await client.query(
        `INSERT INTO order_items
         (order_id, product_id, quantity, price_at_purchase)
         VALUES ($1,$2,$3,$4)`,
        [order.id, item.product_id, item.quantity, item.price],
      );

      // Reduce stock
      await client.query(
        `UPDATE products
         SET stock = stock - $1
         WHERE id = $2`,
        [item.quantity, item.product_id],
      );

      // 🔥 Insert grower earnings
      await client.query(
        `INSERT INTO grower_earnings
         (order_id, grower_id, gross_amount, platform_commission, net_amount)
         VALUES ($1,$2,$3,$4,$5)`,
        [order.id, item.grower_id, itemTotal, commission, netAmount],
      );
    }

    // Clear cart
    await client.query(`DELETE FROM cart_items WHERE user_id = $1`, [user_id]);

    await client.query("COMMIT");

    return order;
  } catch (error) {
    await client.query("ROLLBACK");
    throw error;
  } finally {
    client.release();
  }
};

// GET ORDERS FOR FARMER
const getFarmerOrders = async (user_id) => {
  const result = await pool.query(
    `SELECT 
        o.id AS order_id,
        o.tracking_id,
        o.order_status,
        s.first_name,
        s.last_name,
        s.phone,
        s.street_address,
        s.city,
        s.postal_code,
        p.title,
        oi.quantity,
        oi.price_at_purchase
     FROM order_items oi
     JOIN products p ON oi.product_id = p.id
     JOIN orders o ON oi.order_id = o.id
     JOIN shipping_addresses s ON s.order_id = o.id
     JOIN growers g ON p.grower_id = g.id
     WHERE g.user_id = $1
     ORDER BY o.created_at DESC`,
    [user_id],
  );

  return result.rows;
};
// UPDATE ORDER STATUS (Admin)
const updateOrderStatus = async (order_id, status) => {
  const result = await pool.query(
    `UPDATE orders
     SET order_status = $1
     WHERE id = $2
     RETURNING *`,
    [status, order_id],
  );

  return result.rows[0];
};
// ADMIN - Get full order details
const getAllOrdersDetailed = async () => {
  const result = await pool.query(
    `SELECT 
        o.id AS order_id,
        o.tracking_id,
        o.order_status,
        o.total_amount,
        o.created_at,
        u.username AS buyer_name,
        s.first_name,
        s.last_name,
        s.phone,
        s.street_address,
        s.city,
        s.postal_code,
        p.title AS product_title,
        g.name AS grower_name,
        oi.quantity,
        oi.price_at_purchase
     FROM orders o
     JOIN users u ON o.user_id = u.id
     JOIN shipping_addresses s ON s.order_id = o.id
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     LEFT JOIN growers g ON p.grower_id = g.id
     ORDER BY o.created_at DESC`,
  );

  return result.rows;
};

// TRACK ORDER BY TRACKING ID
const trackOrderByTrackingId = async (tracking_id, user_id) => {
  const result = await pool.query(
    `SELECT 
        o.id AS order_id,
        o.tracking_id,
        o.order_status,
        o.total_amount,
        o.created_at,
        s.first_name,
        s.last_name,
        s.phone,
        s.street_address,
        s.city,
        s.postal_code,
        p.title AS product_title,
        p.primary_image,
        oi.quantity,
        oi.price_at_purchase
     FROM orders o
     JOIN shipping_addresses s ON s.order_id = o.id
     JOIN order_items oi ON oi.order_id = o.id
     JOIN products p ON oi.product_id = p.id
     WHERE o.tracking_id = $1
       AND o.user_id = $2`,
    [tracking_id, user_id],
  );

  if (result.rows.length === 0) return null;

  const orderInfo = result.rows[0];

  const order = {
    order_id: orderInfo.order_id,
    tracking_id: orderInfo.tracking_id,
    order_status: orderInfo.order_status,
    total_amount: orderInfo.total_amount,
    created_at: orderInfo.created_at,
    shipping: {
      first_name: orderInfo.first_name,
      last_name: orderInfo.last_name,
      phone: orderInfo.phone,
      street_address: orderInfo.street_address,
      city: orderInfo.city,
      postal_code: orderInfo.postal_code,
    },
  };

  const items = result.rows.map((row) => ({
    title: row.product_title,
    primary_image: row.primary_image,
    quantity: row.quantity,
    price: row.price_at_purchase,
  }));

  return { order, items };
};

module.exports = {
  createOrderFromCart,
  getFarmerOrders,
  updateOrderStatus,
  getAllOrdersDetailed,
  trackOrderByTrackingId,
};
