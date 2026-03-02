import { useState, useEffect } from "react";
import axios from "axios";
import "./PaymentSuccess.css";

export default function PaymentSuccess() {
  const [form, setForm] = useState({
    first_name: "",
    last_name: "",
    phone: "",
    street_address: "",
    city: "",
    postal_code: "",
  });

  const [cart, setCart] = useState([]);
  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchCart = async () => {
      try {
        const res = await axios.get("https://harvestpure.onrender.com/cart", {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        });
        setCart(res.data);
      } catch (err) {
        console.log(err);
      }
    };

    fetchCart();
  }, []);

  const handleChange = (e) => {
    setForm({ ...form, [e.target.name]: e.target.value });
  };

  const subtotal = cart.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0,
  );

  const tax = subtotal * 0.05;
  const total = subtotal + tax;

  const handleSubmit = async (e) => {
    e.preventDefault();

    const paymentData = JSON.parse(localStorage.getItem("paymentData"));

    try {
      const res = await axios.post(
        "https://harvestpure.onrender.com/payment/verify",
        {
          razorpay_order_id: paymentData.razorpay_order_id,
          razorpay_payment_id: paymentData.razorpay_payment_id,
          razorpay_signature: paymentData.razorpay_signature,
          shippingData: form,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        },
      );

      localStorage.removeItem("paymentData");

      window.location.href = `/order/${res.data.order.tracking_id}`;
    } catch (error) {
      alert("Order creation failed");
    }
  };

  return (
    <div className="checkout-page">
      <div className="checkout-container">
        {/* LEFT */}
        <div className="checkout-left">
          <div className="section-header">
            <span className="step-circle">1</span>
            <h3>Delivery Address</h3>
          </div>

          <form className="address-card" onSubmit={handleSubmit}>
            <div className="row">
              <div className="form-group">
                <label>First Name</label>
                <input name="first_name" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Last Name</label>
                <input name="last_name" onChange={handleChange} required />
              </div>
            </div>

            <div className="form-group full">
              <label>Phone</label>
              <input name="phone" onChange={handleChange} required />
            </div>

            <div className="form-group full">
              <label>Street Address</label>
              <input name="street_address" onChange={handleChange} required />
            </div>

            <div className="row">
              <div className="form-group">
                <label>City</label>
                <input name="city" onChange={handleChange} required />
              </div>
              <div className="form-group">
                <label>Postal Code</label>
                <input name="postal_code" onChange={handleChange} required />
              </div>
            </div>

            <button className="create-order-btn">Create Order</button>
          </form>
        </div>

        {/* RIGHT SUMMARY */}
        <div className="checkout-summary">
          <h3>Order Summary</h3>

          {cart.map((item) => (
            <div className="summary-product" key={item.id}>
              <img src={item.primary_image} alt="" />
              <div>
                <p>{item.title}</p>
                <span>
                  {item.quantity} x ₹{item.price}
                </span>
              </div>
              <strong>₹{(item.price * item.quantity).toFixed(2)}</strong>
            </div>
          ))}

          <hr />

          <div className="summary-item">
            <span>Subtotal</span>
            <span>₹{subtotal.toFixed(2)}</span>
          </div>

          <div className="summary-item">
            <span>Taxes (5%)</span>
            <span>₹{tax.toFixed(2)}</span>
          </div>

          <div className="summary-total">
            <span>Total</span>
            <span>₹{total.toFixed(2)}</span>
          </div>
        </div>
      </div>
    </div>
  );
}
