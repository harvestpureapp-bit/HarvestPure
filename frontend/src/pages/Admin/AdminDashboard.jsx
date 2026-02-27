import { useEffect, useState } from "react";
import AdminLayout from "./AdminLayout";
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  Tooltip,
  ResponsiveContainer,
  CartesianGrid,
} from "recharts";

function AdminDashboard() {
  const [stats, setStats] = useState({
    products: 0,
    orders: 0,
    revenue: 0,
  });

  const [recentOrders, setRecentOrders] = useState([]);
  const [chartData, setChartData] = useState([]);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  useEffect(() => {
    const fetchDashboardData = async () => {
      try {
        const headers = {
          Authorization: `Bearer ${token}`,
        };

        const [productsRes, ordersRes] = await Promise.all([
          fetch("http://localhost:8080/products", { headers }),
          fetch("http://localhost:8080/orders", { headers }),
        ]);

        const products = await productsRes.json();
        const orders = await ordersRes.json();

        const safeOrders = Array.isArray(orders) ? orders : [];

        // Revenue Calculation
        const totalRevenue = safeOrders.reduce(
          (sum, order) => sum + Number(order.total_amount || 0),
          0
        );

        // Group revenue by date
        const revenueByDate = {};

        safeOrders.forEach((order) => {
          const date = new Date(order.created_at).toLocaleDateString();
          revenueByDate[date] =
            (revenueByDate[date] || 0) +
            Number(order.total_amount || 0);
        });

        const formattedChartData = Object.keys(revenueByDate).map((date) => ({
          date,
          revenue: revenueByDate[date],
        }));

        setStats({
          products: Array.isArray(products) ? products.length : 0,
          orders: safeOrders.length,
          revenue: totalRevenue,
        });

        setRecentOrders(safeOrders.slice(0, 5));
        setChartData(formattedChartData);
      } catch (error) {
        console.error("Dashboard fetch error:", error);
      } finally {
        setLoading(false);
      }
    };

    fetchDashboardData();
  }, [token]);

  if (loading) {
    return (
      <AdminLayout>
        <div className="p-4">Loading dashboard...</div>
      </AdminLayout>
    );
  }

  return (
    <AdminLayout>
      <div className="container-fluid p-4">
        <h2 className="fw-bold mb-4">Dashboard Overview</h2>

        {/* Modern Stat Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="card border-0 shadow-lg p-4 text-center rounded-4">
              <div className="mb-2 text-muted">Total Products</div>
              <h2 className="fw-bold text-primary">{stats.products}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg p-4 text-center rounded-4">
              <div className="mb-2 text-muted">Total Orders</div>
              <h2 className="fw-bold text-success">{stats.orders}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="card border-0 shadow-lg p-4 text-center rounded-4">
              <div className="mb-2 text-muted">Total Revenue</div>
              <h2 className="fw-bold text-dark">
                ₹{stats.revenue.toFixed(2)}
              </h2>
            </div>
          </div>
        </div>

        {/* Revenue Chart */}
        <div className="card border-0 shadow-lg p-4 rounded-4 mb-5">
          <h5 className="mb-4 fw-semibold">Revenue Trend</h5>

          <ResponsiveContainer width="100%" height={300}>
            <LineChart data={chartData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Line
                type="monotone"
                dataKey="revenue"
                stroke="#198754"
                strokeWidth={3}
              />
            </LineChart>
          </ResponsiveContainer>
        </div>

        {/* Recent Orders */}
        <div className="card border-0 shadow-lg p-4 rounded-4">
          <h5 className="mb-3 fw-semibold">Recent Orders</h5>

          <div className="table-responsive">
            <table className="table align-middle">
              <thead className="table-light">
                <tr>
                  <th>Tracking ID</th>
                  <th>Buyer</th>
                  <th>Status</th>
                  <th>Amount</th>
                </tr>
              </thead>

              <tbody>
                {recentOrders.length === 0 ? (
                  <tr>
                    <td colSpan="4" className="text-center">
                      No recent orders
                    </td>
                  </tr>
                ) : (
                  recentOrders.map((order) => (
                    <tr key={order.order_id}>
                      <td>{order.tracking_id}</td>
                      <td>{order.buyer_name || "User"}</td>
                      <td>
                        <span
                          className={`badge ${
                            order.order_status === "delivered"
                              ? "bg-success"
                              : order.order_status === "pending"
                              ? "bg-warning text-dark"
                              : "bg-secondary"
                          }`}
                        >
                          {order.order_status}
                        </span>
                      </td>
                      <td className="fw-semibold">
                        ₹{Number(order.total_amount).toFixed(2)}
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

export default AdminDashboard;