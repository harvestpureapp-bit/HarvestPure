const pool = require("../config/db");

const createUser = async (username, email, hashedPassword, role) => {
  const result = await pool.query(
    `INSERT INTO users (username, email, password, role)
     VALUES ($1, $2, $3, $4)
     RETURNING id, username, email, role`,
    [username, email, hashedPassword, role]
  );
  return result.rows[0];
};

const findUserByEmailOrUsername = async (identifier) => {
  const result = await pool.query(
    `SELECT * FROM users WHERE email = $1 OR username = $1`,
    [identifier]
  );
  return result.rows[0];
};

const getAllUsers = async () => {
  const result = await pool.query(
    `SELECT id, username, email, role, created_at
     FROM users
     ORDER BY created_at DESC`
  );
  return result.rows;
};

const deleteUser = async (id) => {
  await pool.query(`DELETE FROM users WHERE id = $1`, [id]);
};

module.exports = {
  createUser,
  findUserByEmailOrUsername,
  getAllUsers,
  deleteUser,
};