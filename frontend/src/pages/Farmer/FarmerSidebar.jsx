import { NavLink } from "react-router-dom";
import "./FarmerSidebar.css";

function FarmerSidebar() {
  return (
    <div className="farmer-sidebar">

      <div className="farmer-logo">
        <i className="fas fa-tractor me-2"></i>
        <span>HarvestPure</span>
        <small className="d-block">Farmer Panel</small>
      </div>

      <ul className="farmer-menu">
        <li>
          <NavLink to="/farmer-dashboard" end>
            <i className="fas fa-chart-line me-2"></i>
            Dashboard
          </NavLink>
        </li>

        <li>
          <NavLink to="/farmer/products">
            <i className="fas fa-seedling me-2"></i>
            My Products
          </NavLink>
        </li>

        <li>
          <NavLink to="/farmer/orders">
            <i className="fas fa-shopping-cart me-2"></i>
            My Orders
          </NavLink>
        </li>

        <li>
          <NavLink to="/farmer/earnings">
            <i className="fas fa-wallet me-2"></i>
            My Earnings
          </NavLink>
        </li>
      </ul>

      <div className="farmer-logout">
        <NavLink to="/login">
          <i className="fas fa-sign-out-alt me-2"></i>
          Logout
        </NavLink>
      </div>

    </div>
  );
}

export default FarmerSidebar;