import { useEffect, useState } from "react";
import FarmerLayout from "../FarmerLayout";
import "./FarmerDashboard.css";

function FarmerDashboard() {
  const [orders, setOrders] = useState([]);
  const [earnings, setEarnings] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchData = async () => {
      try {
        const headers = { Authorization: `Bearer ${token}` };

        const [ordersRes, earningsRes] = await Promise.all([
          fetch("https://harvestpure.onrender.com/orders/farmer", { headers }),
          fetch("https://harvestpure.onrender.com/earnings/grower", { headers }),
        ]);

        const ordersData = await ordersRes.json();
        const earningsData = await earningsRes.json();

        setOrders(Array.isArray(ordersData) ? ordersData : []);
        setEarnings(Array.isArray(earningsData) ? earningsData : []);
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    };

    fetchData();
  }, [token]);

  if (loading) {
    return (
      <FarmerLayout>
        <div className="p-4">Loading dashboard...</div>
      </FarmerLayout>
    );
  }

  // ORDER STATS
  const totalOrders = orders.length;
  const pendingOrders = orders.filter(o => o.order_status === "pending").length;
  const deliveredOrders = orders.filter(o => o.order_status === "delivered").length;

  // FINANCIAL SUMMARY (Only Net here)
  const totalNet = earnings.reduce(
    (sum, e) => sum + Number(e.net_amount || 0),
    0
  );

  return (
    <FarmerLayout>
      <div className="container-fluid p-4 farmer-dashboard">
        <h3 className="fw-bold mb-4">Farmer Dashboard</h3>

        {/* ===== SUMMARY CARDS ===== */}
        <div className="row g-4 mb-4">

          <div className="col-md-3">
            <div className="farmer-card card-orders">
              <h6>Total Orders</h6>
              <h2>{totalOrders}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="farmer-card card-pending">
              <h6>Pending Orders</h6>
              <h2>{pendingOrders}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="farmer-card card-delivered">
              <h6>Delivered</h6>
              <h2>{deliveredOrders}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="farmer-card card-net">
              <h6>Total Earnings</h6>
              <h2>₹ {totalNet.toFixed(2)}</h2>
            </div>
          </div>

        </div>

        {/* ===== RECENT ORDERS TABLE ===== */}
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <h5 className="fw-semibold mb-3">Recent Orders</h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tracking ID</th>
                  <th>Product</th>
                  <th>Status</th>
                  <th>Quantity</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center py-4">
                      No orders yet
                    </td>
                  </tr>
                ) : (
                  orders.slice(0, 5).map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.tracking_id}</td>
                      <td>{order.title}</td>
                      <td>{order.order_status}</td>
                      <td>{order.quantity}</td>
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

export default FarmerDashboard;