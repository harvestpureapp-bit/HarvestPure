import { useEffect, useState } from "react";
import axios from "axios";
import "./CartPage.css";

export default function CartPage() {
  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  const API = "http://localhost:8080/cart";

  const handleCheckout = async () => {
    const token = localStorage.getItem("token");

    try {
      // Step 1 → Create Razorpay order
      const res = await axios.post(
        "http://localhost:8080/payment/create-order",
        {},
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      const { key, order_id, amount, currency } = res.data;

      const options = {
        key,
        amount,
        currency,
        name: "HarvestPure",
        description: "Order Payment",
        order_id,

        handler: function (response) {
          // Save payment info temporarily
          localStorage.setItem("paymentData", JSON.stringify(response));

          // Redirect to shipping page
          window.location.href = "/payment-success";
        },

        theme: {
          color: "#2e7d32",
        },
      };

      const rzp = new window.Razorpay(options);
      rzp.open();
    } catch (error) {
      console.log(error);
      alert("Checkout failed");
    }
  };

  // Fetch cart
  const fetchCart = async () => {
    try {
      const res = await axios.get(API, {
        headers: { Authorization: `Bearer ${token}` },
      });
      setCart(res.data);
    } catch (err) {
      console.log(err);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  // Update quantity
  const updateQty = async (id, quantity) => {
    if (quantity < 1) return;

    try {
      await axios.put(
        `${API}/${id}`,
        { quantity },
        { headers: { Authorization: `Bearer ${token}` } },
      );
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // Remove item
  const removeItem = async (id) => {
    try {
      await axios.delete(`${API}/${id}`, {
        headers: { Authorization: `Bearer ${token}` },
      });
      fetchCart();
    } catch (err) {
      console.log(err);
    }
  };

  // Calculations
  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const shipping = subtotal > 0 ? 4.99 : 0;
  const tax = subtotal * 0.1;
  const total = subtotal + shipping + tax;

  return (
    <section className="cart-page">
      <div className="cart-container">
        {/* LEFT SIDE */}
        <div className="cart-left">
          <h1>Your Basket</h1>
          <p className="subtitle">
            Review your items before proceeding to checkout
          </p>

          {cart.map((item) => (
            <div className="cart-item" key={item.id}>
              <img src={item.primary_image} alt={item.title} />

              <div className="cart-info">
                <h3>{item.title}</h3>
                <p>Grown by {item.farmer_name}</p>

                <div className="qty-row">
                  <div className="qty-box">
                    <button
                      onClick={() => updateQty(item.id, item.quantity - 1)}
                    >
                      -
                    </button>
                    <span>{item.quantity}</span>
                    <button
                      onClick={() => updateQty(item.id, item.quantity + 1)}
                    >
                      +
                    </button>
                  </div>

                  <button
                    className="remove-btn"
                    onClick={() => removeItem(item.id)}
                  >
                    Remove
                  </button>
                </div>
              </div>

              <div className="price">
                ${(item.price * item.quantity).toFixed(2)}
              </div>
            </div>
          ))}
        </div>

        {/* RIGHT SIDE */}
        <div className="cart-summary">
          <h2>Order Summary</h2>

          <div className="summary-row">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Shipping</span>
            <span>₹{shipping.toFixed(2)}</span>
          </div>

          <div className="summary-row">
            <span>Tax</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <hr />

          <div className="summary-row total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>

          <button className="checkout-btn" onClick={handleCheckout}>
            Proceed to Checkout →
          </button>

          <div className="secure-info">
            <p>🔒 Secure checkout with SSL encryption</p>
            <p>🚚 Freshness guaranteed delivery</p>
          </div>
        </div>
      </div>
    </section>
  );
}
