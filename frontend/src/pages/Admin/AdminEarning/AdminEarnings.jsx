import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import "./AdminEarnings.css";

function AdminEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [totalRevenue, setTotalRevenue] = useState(0);

  const token = localStorage.getItem("token");

  const fetchEarnings = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/earnings/admin/all",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setEarnings(Array.isArray(data) ? data : []);
    } catch (err) {
      console.error(err);
    }
  };

  const fetchRevenue = async () => {
    try {
      const res = await fetch(
        "http://localhost:8080/earnings/admin/revenue",
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      const data = await res.json();
      setTotalRevenue(data.total_revenue || 0);
    } catch (err) {
      console.error(err);
    }
  };

  useEffect(() => {
    fetchEarnings();
    fetchRevenue();
  }, []);

  // Calculate totals
  const totalGross = earnings.reduce(
    (sum, item) => sum + Number(item.gross_amount || 0),
    0
  );

  const totalCommission = earnings.reduce(
    (sum, item) => sum + Number(item.platform_commission || 0),
    0
  );

  const totalNet = earnings.reduce(
    (sum, item) => sum + Number(item.net_amount || 0),
    0
  );

  return (
    <AdminLayout>
      <div className="container-fluid p-4 earnings-page">
        <h3 className="fw-bold mb-4">Platform Earnings</h3>

        {/* Top Summary Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="earn-card revenue-card">
              <h6>Total Platform Revenue</h6>
              <h2>₹ {Number(totalRevenue).toFixed(2)}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="earn-card gross-card">
              <h6>Total Gross Sales</h6>
              <h2>₹ {totalGross.toFixed(2)}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="earn-card commission-card">
              <h6>Total Commission</h6>
              <h2>₹ {totalCommission.toFixed(2)}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="earn-card net-card">
              <h6>Total Grower Payout</h6>
              <h2>₹ {totalNet.toFixed(2)}</h2>
            </div>
          </div>
        </div>

        {/* Modern Table */}
        <div className="card border-0 shadow-lg rounded-4 p-4">
          <h5 className="mb-3 fw-semibold">Transaction History</h5>

          <div className="table-responsive">
            <table className="table modern-table align-middle">
              <thead>
                <tr>
                  <th>#</th>
                  <th>Order</th>
                  <th>Grower</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {earnings.length === 0 ? (
                  <tr>
                    <td colSpan="7" className="text-center py-4">
                      No earnings found
                    </td>
                  </tr>
                ) : (
                  earnings.map((item, index) => (
                    <tr key={item.id}>
                      <td>{index + 1}</td>
                      <td className="fw-semibold">
                        #{item.order_id}
                      </td>
                      <td>{item.grower_name || "N/A"}</td>
                      <td>₹ {Number(item.gross_amount).toFixed(2)}</td>
                      <td className="text-danger">
                        ₹ {Number(item.platform_commission).toFixed(2)}
                      </td>
                      <td className="text-success fw-semibold">
                        ₹ {Number(item.net_amount).toFixed(2)}
                      </td>
                      <td>
                        {new Date(item.created_at).toLocaleDateString()}
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

export default AdminEarnings;