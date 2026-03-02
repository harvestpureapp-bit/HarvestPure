import { useParams } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./TrackOrder.css";

export default function TrackOrder() {
  const { trackingId } = useParams();
  const [order, setOrder] = useState(null);
  const [items, setItems] = useState([]);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchOrder = async () => {
      const res = await axios.get(
        `http://localhost:8080/orders/track/${trackingId}`,
        { headers: { Authorization: `Bearer ${token}` } }
      );

      setOrder(res.data.order);
      setItems(res.data.items);
    };

    fetchOrder();
  }, [trackingId]);

  if (!order) return <div className="loading">Loading...</div>;

  const steps = [
    "pending",
    "harvesting",
    "quality_check",
    "in_transit",
    "out_for_delivery",
    "delivered",
  ];

  const currentStepIndex = steps.indexOf(order.order_status);

  const subtotal = items.reduce(
    (sum, item) => sum + item.price * item.quantity,
    0
  );

  return (
    <div className="track-page">
      <div className="track-container">

        {/* HEADER */}
        <div className="track-header">
          <h2>Track Your Harvest</h2>
          <span className="tracking-id">#{order.tracking_id}</span>
        </div>

        {/* TIMELINE */}
        <div className="timeline">
          {steps.map((step, index) => (
            <div
              key={step}
              className={`timeline-step ${
                index <= currentStepIndex ? "active" : ""
              }`}
            >
              <div className="circle"></div>
              <p>{step.replace("_", " ")}</p>
            </div>
          ))}
        </div>

        <div className="track-content">

          {/* LEFT SIDE */}
          <div className="track-left">

            <div className="status-card">
              <div>
                <h4>CURRENT STATUS</h4>
                <h2>
                  {order.order_status.replace("_", " ").toUpperCase()}
                </h2>
              </div>
              <div className="delivery-time">
                <p>Estimated Delivery</p>
                <strong>Today by 5:00 PM</strong>
              </div>
            </div>

            <div className="map-box">
              <div className="map-placeholder">
                Map Placeholder
              </div>
            </div>

            <div className="blockchain-box">
              <h3>Blockchain Journey</h3>

              <div className="journey-item active">
                <div className="dot"></div>
                <div>
                  <h4>Origin Verification</h4>
                  <p>Farm verified and certified organic.</p>
                </div>
              </div>

              <div className="journey-item active">
                <div className="dot"></div>
                <div>
                  <h4>Harvest Confirmation</h4>
                  <p>Batch-coded for full traceability.</p>
                </div>
              </div>

              <div className="journey-item active">
                <div className="dot"></div>
                <div>
                  <h4>Quality Check</h4>
                  <p>AI-screened and freshness graded.</p>
                </div>
              </div>

            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="track-right">

            <div className="summary-card">
              <h3>Item Summary</h3>

              {items.map((item, index) => (
                <div key={index} className="summary-item">
                  <img src={item.primary_image} alt="" />
                  <div>
                    <p>{item.title}</p>
                    <span>
                      {item.quantity} x ₹{item.price}
                    </span>
                  </div>
                  <strong>
                    ₹{(item.price * item.quantity).toFixed(2)}
                  </strong>
                </div>
              ))}

              <div className="total-row">
                <span>Total</span>
                <strong>₹{subtotal.toFixed(2)}</strong>
              </div>
            </div>

            <div className="help-card">
              <h4>Need Help?</h4>
              <button>Chat with Support</button>
              <button>Contact Farmer</button>
            </div>

          </div>

        </div>
      </div>
    </div>
  );
}