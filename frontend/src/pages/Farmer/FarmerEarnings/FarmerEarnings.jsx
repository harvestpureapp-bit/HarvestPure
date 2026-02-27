import { useEffect, useState } from "react";
import FarmerLayout from "../FarmerLayout";
import "./FarmerEarnings.css";

function FarmerEarnings() {
  const [earnings, setEarnings] = useState([]);
  const [total, setTotal] = useState(0);
  const [loading, setLoading] = useState(true);

  const token = localStorage.getItem("token");

  const fetchEarnings = async () => {
    try {
      const headers = {
        Authorization: `Bearer ${token}`,
      };

      const [listRes, totalRes] = await Promise.all([
        fetch("https://harvestpure.onrender.com/earnings/grower", { headers }),
        fetch("https://harvestpure.onrender.com/earnings/grower/total", { headers }),
      ]);

      const listData = await listRes.json();
      const totalData = await totalRes.json();

      setEarnings(Array.isArray(listData) ? listData : []);
      setTotal(Number(totalData.total_earned || 0));
    } catch (err) {
      console.error("Farmer earnings error:", err);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchEarnings();
  }, []);

  const totalGross = earnings.reduce(
    (sum, e) => sum + Number(e.gross_amount || 0),
    0
  );

  const totalCommission = earnings.reduce(
    (sum, e) => sum + Number(e.platform_commission || 0),
    0
  );

  if (loading) {
    return (
      <FarmerLayout>
        <div className="p-4">Loading earnings...</div>
      </FarmerLayout>
    );
  }

  return (
    <FarmerLayout>
      <div className="container-fluid p-4 farmer-earnings-page">
        <h3 className="fw-bold mb-4">My Earnings</h3>

        {/* ===== SUMMARY CARDS ===== */}
        <div className="row g-4 mb-4">
          <div className="col-md-4">
            <div className="earnings-card gross-card">
              <h6>Total Sales</h6>
              <h2>₹ {totalGross.toFixed(2)}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="earnings-card commission-card">
              <h6>Platform Commission</h6>
              <h2>₹ {totalCommission.toFixed(2)}</h2>
            </div>
          </div>

          <div className="col-md-4">
            <div className="earnings-card net-card">
              <h6>Your Earnings</h6>
              <h2>₹ {total.toFixed(2)}</h2>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <h5 className="fw-semibold mb-3">Earnings History</h5>

          <div className="table-responsive">
            <table className="table earnings-table align-middle">
              <thead>
                <tr>
                  <th>Order ID</th>
                  <th>Gross</th>
                  <th>Commission</th>
                  <th>Net</th>
                  <th>Date</th>
                </tr>
              </thead>

              <tbody>
                {earnings.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No earnings yet
                    </td>
                  </tr>
                ) : (
                  earnings.map((e, index) => (
                    <tr key={index}>
                      <td>#{e.order_id}</td>
                      <td>₹ {Number(e.gross_amount).toFixed(2)}</td>
                      <td className="text-danger">
                        ₹ {Number(e.platform_commission).toFixed(2)}
                      </td>
                      <td className="text-success">
                        ₹ {Number(e.net_amount).toFixed(2)}
                      </td>
                      <td>
                        {new Date(e.created_at).toLocaleDateString()}
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

export default FarmerEarnings;