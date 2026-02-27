import AdminSidebar from "./AdminSidebar";
import "./Admin.css";

function AdminLayout({ children }) {
  return (
    <div className="admin-container">
      <AdminSidebar />

      <div className="admin-main">
        {children}
      </div>
    </div>
  );
}

export default AdminLayout;