import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import "./AdminUsers.css";

function AdminUsers() {
  const [users, setUsers] = useState([]);

  const token = localStorage.getItem("token");

  const fetchUsers = async () => {
    const res = await fetch("https://harvestpure.onrender.com/admin/users", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setUsers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchUsers();
  }, []);

  const deleteUser = async (id) => {
    await fetch(`https://harvestpure.onrender.com/admin/users/${id}`, {
      method: "DELETE",
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    fetchUsers();
  };

  const totalUsers = users.length;
  const totalAdmins = users.filter(u => u.role === "admin").length;
  const totalFarmers = users.filter(u => u.role === "farmer").length;
  const totalCustomers = users.filter(u => u.role === "user").length;

  return (
    <AdminLayout>
      <div className="container-fluid p-4 users-page">
        <h3 className="fw-bold mb-4">User Management</h3>

        {/* Summary Cards */}
        <div className="row g-4 mb-4">
          <div className="col-md-3">
            <div className="user-card total-card">
              <h6>Total Users</h6>
              <h2>{totalUsers}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="user-card admin-card">
              <h6>Admins</h6>
              <h2>{totalAdmins}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="user-card farmer-card">
              <h6>Farmers</h6>
              <h2>{totalFarmers}</h2>
            </div>
          </div>

          <div className="col-md-3">
            <div className="user-card customer-card">
              <h6>Customers</h6>
              <h2>{totalCustomers}</h2>
            </div>
          </div>
        </div>

        {/* Table */}
        <div className="card border-0 shadow-lg rounded-4 p-4">
          <h5 className="fw-semibold mb-3">All Users</h5>

          <div className="table-responsive">
            <table className="table modern-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Username</th>
                  <th>Email</th>
                  <th>Role</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {users.length === 0 ? (
                  <tr>
                    <td colSpan="5" className="text-center py-4">
                      No users found
                    </td>
                  </tr>
                ) : (
                  users.map((user) => (
                    <tr key={user.id}>
                      <td>{user.id}</td>
                      <td className="fw-semibold">{user.username}</td>
                      <td>{user.email}</td>
                      <td>
                        <span className={`role-badge ${user.role}`}>
                          {user.role}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm modern-delete-btn"
                          onClick={() => deleteUser(user.id)}
                        >
                          Delete
                        </button>
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

export default AdminUsers;