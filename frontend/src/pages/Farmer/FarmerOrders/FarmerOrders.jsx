import { useEffect, useState } from "react";
import FarmerLayout from "../FarmerLayout";
import "./FarmerOrders.css";

function FarmerOrders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    try {
      const res = await fetch("https://harvestpure.onrender.com/orders/farmer", {
        headers: {
          Authorization: `Bearer ${token}`,
        },
      });

      const data = await res.json();
      setOrders(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error("Farmer orders error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const totalOrders = orders.length;

  const totalSales = orders.reduce(
    (sum, o) => sum + Number(o.price_at_purchase) * Number(o.quantity),
    0
  );

  if (loading) {
    return (
      <FarmerLayout>
        <div className="p-4">Loading orders...</div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="container-fluid p-4 farmer-orders-page">
        <h3 className="fw-bold mb-4">My Orders</h3>

        {/* ===== SUMMARY ===== */}
        <div className="row g-4 mb-4">
          <div className="col-md-6">
            <div className="farmer-summary-card orders-card">
              <h6>Total Orders</h6>
              <h2>{totalOrders}</h2>
            </div>
          </div>

          <div className="col-md-6">
            <div className="farmer-summary-card sales-card">
              <h6>Total Sales</h6>
              <h2>₹ {totalSales.toFixed(2)}</h2>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <h5 className="fw-semibold mb-3">Recent Orders</h5>

          <div className="table-responsive">
            <table className="table farmer-table align-middle">
              <thead>
                <tr>
                  <th>Tracking ID</th>
                  <th>Product</th>
                  <th>Buyer</th>
                  <th>City</th>
                  <th>Quantity</th>
                  <th>Amount</th>
                  <th>Status</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.tracking_id}</td>
                      <td>{order.title}</td>
                      <td>
                        {order.first_name} {order.last_name}
                      </td>
                      <td>{order.city}</td>
                      <td>{order.quantity}</td>
                      <td>
                        ₹{" "}
                        {(
                          Number(order.price_at_purchase) *
                          Number(order.quantity)
                        ).toFixed(2)}
                      </td>
                      <td>
                        <span
                          className={`status-badge ${
                            order.order_status === "delivered"
                              ? "delivered"
                              : order.order_status === "pending"
                              ? "pending"
                              : order.order_status === "shipped"
                              ? "shipped"
                              : "other"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </FarmerLayout>
  );
}

export default FarmerOrders;