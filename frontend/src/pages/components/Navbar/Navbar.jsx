import { Link, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import "./Navbar.css";

export default function Navbar() {
  const navigate = useNavigate();
  const [user, setUser] = useState(null);

  // Load user from localStorage
  useEffect(() => {
    const loadUser = () => {
      const storedUser = localStorage.getItem("user");
      setUser(storedUser ? JSON.parse(storedUser) : null);
    };

    loadUser();

    window.addEventListener("authChanged", loadUser);

    return () => {
      window.removeEventListener("authChanged", loadUser);
    };
  }, []);

  const handleLogout = () => {
    localStorage.removeItem("user");
    localStorage.removeItem("token");
    setUser(null);
    navigate("/");
  };

  return (
    <nav className="navbar navbar-expand-lg custom-navbar px-4">
      <div className="container-fluid">
        {/* Logo */}
        <Link className="navbar-brand d-flex align-items-center" to="/">
          <div className="logo-icon me-2">🚜</div>
          <span className="brand-text">HarvestPure</span>
        </Link>

        <button
          className="navbar-toggler"
          type="button"
          data-bs-toggle="collapse"
          data-bs-target="#navbarContent"
        >
          <span className="navbar-toggler-icon"></span>
        </button>

        <div
          className="collapse navbar-collapse justify-content-between"
          id="navbarContent"
        >
          {/* Center Links */}
          <ul className="navbar-nav mx-auto mb-2 mb-lg-0 nav-center">
            <li className="nav-item">
              <Link className="nav-link" to="/">
                Home
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/marketplace">
                Marketplace
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/how-it-works">
                How It Works
              </Link>
            </li>
            <li className="nav-item">
              <Link className="nav-link" to="/farmers">
                For Farmers
              </Link>
            </li>
          </ul>

          {/* Right Section */}
          <div className="d-flex align-items-center gap-3">
            <button className="btn wallet-btn">💳 Connect Wallet</button>

            {!user ? (
              <>
                <Link className="nav-link login-link" to="/login">
                  Login
                </Link>

                <Link to="/register">
                  <button className="btn register-btn">Register</button>
                </Link>
              </>
            ) : (
              <div className="profile-section d-flex align-items-center gap-3">
                <span className="username">👤 {user.name}</span>

                <button className="btn logout-btn" onClick={handleLogout}>
                  Logout
                </button>
              </div>
            )}

            {/* Cart */}
            <div className="cart-wrapper">
              🛒
              <span className="cart-badge">2</span>
            </div>
          </div>
        </div>
      </div>
    </nav>
  );
}
