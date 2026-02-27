const pool = require("../config/db");

const createGrower = async (data) => {
  const { name, profile_image, description, rating } = data;

  const result = await pool.query(
    `INSERT INTO growers
     (name, profile_image, description, rating)
     VALUES ($1,$2,$3,$4)
     RETURNING *`,
    [name, profile_image, description, rating || 0]
  );

  return result.rows[0];
};

const getAllGrowers = async () => {
  const result = await pool.query(
    `SELECT * FROM growers
     WHERE is_active = true
     ORDER BY created_at DESC`
  );

  return result.rows;
};

const getGrowerById = async (id) => {
  const result = await pool.query(
    `SELECT * FROM growers WHERE id = $1`,
    [id]
  );

  return result.rows[0];
};

const updateGrower = async (id, data) => {
  const { name, profile_image, description, rating } = data;

  const result = await pool.query(
    `UPDATE growers
     SET name=$1,
         profile_image=$2,
         description=$3,
         rating=$4
     WHERE id=$5
     RETURNING *`,
    [name, profile_image, description, rating, id]
  );

  return result.rows[0];
};

const deleteGrower = async (id) => {
  await pool.query(
    `UPDATE growers SET is_active=false WHERE id=$1`,
    [id]
  );
};

module.exports = {
  createGrower,
  getAllGrowers,
  getGrowerById,
  updateGrower,
  deleteGrower,
};