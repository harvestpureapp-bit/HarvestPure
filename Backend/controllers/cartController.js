const {
  addToCart,
  getCartItems,
  removeFromCart,
  updateCartQuantity,
} = require("../models/cartModel");

const addProductToCart = async (req, res) => {
  try {
    const user_id = req.user.id;
    const { product_id, quantity } = req.body;

    const item = await addToCart(user_id, product_id, quantity || 1);

    res.status(201).json({
      message: "Product added to cart",
      item,
    });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const fetchCart = async (req, res) => {
  try {
    const user_id = req.user.id;

    const cart = await getCartItems(user_id);

    res.json(cart);
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const deleteCartItem = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cart_id = req.params.id;

    const removed = await removeFromCart(user_id, cart_id);

    if (!removed) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Item removed from cart" });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

const changeQuantity = async (req, res) => {
  try {
    const user_id = req.user.id;
    const cart_id = req.params.id;
    const { quantity } = req.body;

    if (quantity <= 0) {
      return res.status(400).json({ message: "Invalid quantity" });
    }

    const updated = await updateCartQuantity(user_id, cart_id, quantity);

    if (!updated) {
      return res.status(404).json({ message: "Cart item not found" });
    }

    res.json({ message: "Quantity updated", updated });
  } catch (error) {
    res.status(500).json({ message: error.message });
  }
};

module.exports = {
  addProductToCart,
  fetchCart,
  deleteCartItem,
  changeQuantity,
};
