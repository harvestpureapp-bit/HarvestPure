const pool = require("../config/db");

// SKU generator
const generateSKU = (category) => {
  const prefix = category ? category.substring(0, 3).toUpperCase() : "GEN";
  const timestamp = Date.now().toString().slice(-6);
  const random = Math.floor(1000 + Math.random() * 9000);
  return `HP-${prefix}-${timestamp}-${random}`;
};

// Delivery estimator
const calculateDeliveryDays = (stock) => {
  if (stock > 100) return 1;
  if (stock >= 50) return 2;
  if (stock >= 10) return 3;
  return 5;
};

// Slug generator
const generateSlug = (title) => {
  return (
    title
      .toLowerCase()
      .replace(/[^a-z0-9 ]/g, "")
      .trim()
      .replace(/\s+/g, "-") +
    "-" +
    Date.now().toString().slice(-4)
  );
};

const createProduct = async (data) => {
  const {
    title,
    description,
    price,
    stock,
    primary_image,
    grower_id, // 🔥 changed
    category,
    is_organic,
  } = data;

  const sku = generateSKU(category);
  const delivery_estimate_days = calculateDeliveryDays(stock);
  const slug = generateSlug(title);

  const result = await pool.query(
    `INSERT INTO products
    (title, description, price, stock, sku, slug, primary_image,
     grower_id, category, is_organic, delivery_estimate_days)
     VALUES ($1,$2,$3,$4,$5,$6,$7,$8,$9,$10,$11)
     RETURNING *`,
    [
      title,
      description,
      price,
      stock,
      sku,
      slug,
      primary_image,
      grower_id,
      category,
      is_organic,
      delivery_estimate_days,
    ],
  );

  return result.rows[0];
};

const addProductImages = async (product_id, images) => {
  for (let img of images) {
    await pool.query(
      `INSERT INTO product_images (product_id, image_url)
       VALUES ($1, $2)`,
      [product_id, img],
    );
  }
};

const getAllProducts = async () => {
  const result = await pool.query(
    `SELECT 
        p.id,
        p.title,
        p.price,
        LEFT(p.description, 120) AS description,
        p.stock,
        p.primary_image,
        g.name AS grower_name
     FROM products p
     LEFT JOIN growers g ON p.grower_id = g.id
     WHERE p.is_active = true
     ORDER BY p.created_at DESC`,
  );

  return result.rows;
};

const getProductBySlug = async (slug) => {
  const product = await pool.query(
    `SELECT 
        p.*,
        g.name AS grower_name,
        g.profile_image AS grower_image,
        g.description AS grower_description,
        g.rating AS grower_rating
     FROM products p
     JOIN growers g ON p.grower_id = g.id
     WHERE p.slug = $1`,
    [slug],
  );

  if (product.rows.length === 0) return null;

  const images = await pool.query(
    `SELECT image_url 
     FROM product_images 
     WHERE product_id = $1`,
    [product.rows[0].id],
  );

  return {
    ...product.rows[0],
    images: images.rows.map((img) => img.image_url),
  };
};

const getAllProductsForAdmin = async () => {
  const result = await pool.query(
    `SELECT 
        p.id,
        p.title,
        p.price,
        p.stock,
        p.category,
        p.is_organic,
        p.primary_image,
        p.is_active,
        p.created_at,
        g.name AS grower_name
     FROM products p
     LEFT JOIN growers g ON p.grower_id = g.id
     ORDER BY p.created_at DESC`
  );

  return result.rows;
};

const getProductsByFarmerUser = async (user_id) => {
  const result = await pool.query(
    `SELECT 
        p.id,
        p.title,
        p.price,
        p.stock,
        p.category,
        p.is_organic,
        p.is_active,
        p.primary_image,
        p.created_at
     FROM products p
     JOIN growers g ON p.grower_id = g.id
     WHERE g.user_id = $1
     ORDER BY p.created_at DESC`,
    [user_id]
  );

  return result.rows;
};

module.exports = {
  createProduct,
  addProductImages,
  getAllProducts,
  getProductBySlug,
  getAllProductsForAdmin,
  getProductsByFarmerUser
};

