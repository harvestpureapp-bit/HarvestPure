import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Login.css";

function Login() {
  const [identifier, setIdentifier] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");
  const navigate = useNavigate();

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const response = await fetch("http://localhost:8080/auth/login", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          identifier,
          password,
        }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Login failed");
      }

      // Save token
      localStorage.setItem("token", data.token);

      // Redirect based on role
      if (data.user.role === "admin") {
        navigate("/admin-dashboard");
      } else if (data.user.role === "farmer") {
        navigate("/farmer-dashboard");
      } else {
        navigate("/");
      }

    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="login-wrapper">
      <div className="login-card shadow">

        <div className="text-center mb-4">
          <div className="logo-box">
            <i className="fas fa-tractor"></i>
          </div>
          <h2 className="mt-3 fw-bold">Welcome Back</h2>
          <p className="text-muted">
            Access the decentralized marketplace for global agriculture and secure transactions.
          </p>
        </div>

        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label fw-semibold">Email / Username</label>
            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-envelope"></i>
              </span>
              <input
                type="text"
                className="form-control"
                placeholder="name@company.com"
                value={identifier}
                onChange={(e) => setIdentifier(e.target.value)}
                required
              />
            </div>
          </div>

          <div className="mb-3">
            <div className="d-flex justify-content-between">
              <label className="form-label fw-semibold">Password</label>
              <a href="#" className="text-success small">
                Forgot password?
              </a>
            </div>

            <div className="input-group">
              <span className="input-group-text">
                <i className="fas fa-lock"></i>
              </span>
              <input
                type={showPassword ? "text" : "password"}
                className="form-control"
                placeholder="Enter password"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                required
              />
              <span
                className="input-group-text cursor-pointer"
                onClick={() => setShowPassword(!showPassword)}
              >
                <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
              </span>
            </div>
          </div>

          <button type="submit" className="btn btn-success w-100 py-2 fw-semibold">
            Login to Dashboard
          </button>
        </form>

        <div className="text-center mt-4">
          <hr />
          <button className="btn btn-outline-success w-100">
            <i className="fas fa-wallet me-2"></i>
            Connect Web3 Wallet
          </button>
        </div>

        <div className="text-center mt-3">
          <span className="text-muted">
            New to the platform?{" "}
            <a href="/register" className="text-success fw-semibold">
              Create an account
            </a>
          </span>
        </div>

      </div>

      <div className="text-center mt-4 text-muted small">
        <i className="fas fa-shield-alt me-2"></i>
        Secured by Blockchain Smart Contracts
      </div>
    </div>
  );
}

export default Login;