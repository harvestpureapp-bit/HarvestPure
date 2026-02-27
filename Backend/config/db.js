const { Pool } = require("pg");
require("dotenv").config();

const pool = new Pool({
  connectionString: process.env.DATABASE_URL,
  ssl: {
    require: true,
    rejectUnauthorized: false,
  },
});

pool.connect()
  .then(() => console.log("✅ Connected to Render PostgreSQL"))
  .catch((err) =>
    console.error("❌ Database connection failed:", err.message)
  );

module.exports = pool;
