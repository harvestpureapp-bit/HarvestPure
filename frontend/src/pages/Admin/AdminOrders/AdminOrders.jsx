import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import "./AdminOrders.css";

function AdminOrders() {
  const [orders, setOrders] = useState([]);

  const token = localStorage.getItem("token");

  const fetchOrders = async () => {
    const res = await fetch("http://localhost:8080/orders", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setOrders(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchOrders();
  }, []);

  const updateStatus = async (id, status) => {
    await fetch(`http://localhost:8080/orders/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status }),
    });

    fetchOrders();
  };

  // Status summary
  const pending = orders.filter(o => o.order_status === "pending").length;
  const shipped = orders.filter(o => o.order_status === "shipped").length;
  const delivered = orders.filter(o => o.order_status === "delivered").length;

  return (
    <AdminLayout>
      <div className="container-fluid p-4 orders-page">
        <h3 className="fw-bold mb-4">Order Management</h3>

        {/* Status Summary Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="order-card pending-card">
              <h6>Pending Orders</h6>
              <h2>{pending}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="order-card shipped-card">
              <h6>Shipped Orders</h6>
              <h2>{shipped}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="order-card delivered-card">
              <h6>Delivered Orders</h6>
              <h2>{delivered}</h2>
            </div>
          </div>
        </div>

        {/* Orders Table */}
        <div className="card border-0 shadow-lg rounded-4 p-4">
          <h5 className="fw-semibold mb-3">All Orders</h5>

          <div className="table-responsive">
            <table className="table modern-table align-middle">
              <thead>
                <tr>
                  <th>Tracking</th>
                  <th>Buyer</th>
                  <th>Product</th>
                  <th>Grower</th>
                  <th>Status</th>
                  <th>Total</th>
                  <th>Update</th>
                </tr>
              </thead>

              <tbody>
                {orders.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No orders found
                    </td>
                  </tr>
                ) : (
                  orders.map((order) => (
                    <tr key={order.order_id}>
                      <td className="fw-semibold">
                        {order.tracking_id}
                      </td>
                      <td>{order.buyer_name}</td>
                      <td>{order.product_title}</td>
                      <td>{order.farmer_name}</td>

                      <td>
                        <span
                          className={`badge status-badge ${
                            order.order_status
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>

                      <td className="fw-semibold">
                        ₹{Number(order.total_amount).toFixed(2)}
                      </td>

                      <td>
                        <select
                          className="form-select modern-select"
                          onChange={(e) =>
                            updateStatus(order.order_id, e.target.value)
                          }
                          defaultValue=""
                        >
                          <option value="" disabled>
                            Change
                          </option>
                          <option value="pending">Pending</option>
                          <option value="accepted">Accepted</option>
                          <option value="shipped">Shipped</option>
                          <option value="delivered">Delivered</option>
                          <option value="cancelled">Cancelled</option>
                        </select>
                      </td>
                    </tr>
                  ))
                )}
              </tbody>
            </table>
          </div>
        </div>
      </div>
    </AdminLayout>
  );
}

export default AdminOrders;