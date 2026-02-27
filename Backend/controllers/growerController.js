const {
  createGrower,
  getAllGrowers,
  getGrowerById,
  updateGrower,
  deleteGrower,
} = require("../models/growerModel");

// Admin create grower
const addGrower = async (req, res) => {
  try {
    const { name, description, rating } = req.body;

    const profile_image = req.file ? req.file.path : null;

    const grower = await createGrower({
      name,
      description,
      rating,
      profile_image,
    });

    res.status(201).json(grower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchGrowers = async (req, res) => {
  try {
    const growers = await getAllGrowers();
    res.json(growers);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchGrower = async (req, res) => {
  try {
    const grower = await getGrowerById(req.params.id);
    res.json(grower);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const editGrower = async (req, res) => {
  try {
    const name = req.body.name;
    const description = req.body.description;
    const rating = req.body.rating;
    const profile_image = req.file
      ? req.file.path
      : req.body.existing_image || undefined;

    console.log("editGrower data:", { name, description, rating, profile_image }); // ✅ debug

    const updated = await updateGrower(req.params.id, {
      name,
      description,
      rating,
      profile_image,
    });

    res.json(updated);
  } catch (error) {
    console.error("Edit grower error:", error);
    res.status(500).json({ message: error.message });
  }
};

const removeGrower = async (req, res) => {
  try {
    await deleteGrower(req.params.id);
    res.json({ message: "Grower removed" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addGrower,
  fetchGrowers,
  fetchGrower,
  editGrower,
  removeGrower,
};
