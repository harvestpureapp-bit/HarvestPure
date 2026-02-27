import { NavLink } from "react-router-dom";
import "./AdminSidebar.css";

function AdminSidebar() {
  return (
    <div className="admin-sidebar d-flex flex-column">
      <div className="admin-logo text-center">
        <i className="fas fa-leaf logo-icon"></i>
        <h5 className="mt-2 mb-0">HarvestPure</h5>
        <small>Admin Dashboard</small>
      </div>

      <ul className="admin-menu list-unstyled flex-grow-1">
        <li>
          <NavLink
            to="/admin-dashboard"
            end
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <i className="fas fa-chart-line"></i>
            <span>Dashboard</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/users"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <i className="fas fa-users"></i>
            <span>Users</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/products"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <i className="fas fa-box"></i>
            <span>Products</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/orders"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <i className="fas fa-shopping-cart"></i>
            <span>Orders</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/growers"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <i className="fas fa-tractor"></i>
            <span>Growers</span>
          </NavLink>
        </li>

        <li>
          <NavLink
            to="/admin/earnings"
            className={({ isActive }) =>
              isActive ? "menu-link active" : "menu-link"
            }
          >
            <i className="fas fa-wallet"></i>
            <span>Earnings</span>
          </NavLink>
        </li>
      </ul>

      <div className="admin-logout">
        <NavLink to="/login" className="menu-link logout-link">
          <i className="fas fa-sign-out-alt"></i>
          <span>Logout</span>
        </NavLink>
      </div>
    </div>
  );
}

export default AdminSidebar;
