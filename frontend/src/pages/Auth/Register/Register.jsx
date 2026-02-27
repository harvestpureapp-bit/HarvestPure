import { useState } from "react";
import { useNavigate } from "react-router-dom";
import "./Register.css";

function Register() {
  const navigate = useNavigate();
  const [role, setRole] = useState("user");
  const [formData, setFormData] = useState({
    username: "",
    email: "",
    password: "",
    adminSecret: "",
  });

  const [showPassword, setShowPassword] = useState(false);
  const [error, setError] = useState("");

  const handleChange = (e) => {
    setFormData({
      ...formData,
      [e.target.name]: e.target.value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    try {
      const bodyData = {
        username: formData.username,
        email: formData.email,
        password: formData.password,
        role,
      };

      if (role === "admin") {
        bodyData.adminSecret = formData.adminSecret;
      }

      const response = await fetch("https://harvestpure.onrender.com/auth/register", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(bodyData),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.message || "Registration failed");
      }

      navigate("/login");
    } catch (err) {
      setError(err.message);
    }
  };

  return (
    <div className="container-fluid min-vh-100">
      <div className="row min-vh-100">

        {/* LEFT SIDE */}
        <div className="col-lg-6 d-none d-lg-flex align-items-center justify-content-center left-side text-white p-5">
          <div>
            <h1 className="fw-bold display-5">
              Empowering the future of fresh produce.
            </h1>
            <p className="mt-3">
              Connect directly with local farmers or reach more consumers.
              Join the digital revolution in agriculture today.
            </p>
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="col-lg-6 d-flex align-items-center justify-content-center bg-light p-4">
          <div className="w-100" style={{ maxWidth: "450px" }}>
            <h2 className="fw-bold mb-2">Create your account</h2>
            <p className="text-muted mb-4">
              Join our community and start trading fresh.
            </p>

            {error && <div className="alert alert-danger">{error}</div>}

            <form onSubmit={handleSubmit}>

              {/* ROLE SELECTOR */}
              <div className="mb-4">
                <label className="fw-semibold mb-2">
                  Register as:
                </label>
                <div className="btn-group w-100">
                  <button
                    type="button"
                    className={`btn ${role === "farmer" ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setRole("farmer")}
                  >
                    Farmer
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === "user" ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setRole("user")}
                  >
                    Consumer
                  </button>
                  <button
                    type="button"
                    className={`btn ${role === "admin" ? "btn-success" : "btn-outline-secondary"}`}
                    onClick={() => setRole("admin")}
                  >
                    Admin
                  </button>
                </div>
              </div>

              {/* USERNAME */}
              <div className="mb-3">
                <label className="form-label">Username</label>
                <input
                  type="text"
                  className="form-control"
                  name="username"
                  value={formData.username}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* EMAIL */}
              <div className="mb-3">
                <label className="form-label">Email Address</label>
                <input
                  type="email"
                  className="form-control"
                  name="email"
                  value={formData.email}
                  onChange={handleChange}
                  required
                />
              </div>

              {/* PASSWORD */}
              <div className="mb-3">
                <label className="form-label">Password</label>
                <div className="input-group">
                  <input
                    type={showPassword ? "text" : "password"}
                    className="form-control"
                    name="password"
                    value={formData.password}
                    onChange={handleChange}
                    required
                  />
                  <span
                    className="input-group-text"
                    style={{ cursor: "pointer" }}
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <i className={`fas ${showPassword ? "fa-eye-slash" : "fa-eye"}`}></i>
                  </span>
                </div>
              </div>

              {/* ADMIN SECRET */}
              {role === "admin" && (
                <div className="mb-3">
                  <label className="form-label">Admin Secret Key</label>
                  <input
                    type="text"
                    className="form-control"
                    name="adminSecret"
                    value={formData.adminSecret}
                    onChange={handleChange}
                    required
                  />
                </div>
              )}

              <button type="submit" className="btn btn-success w-100 mt-3">
                Create Account
              </button>

              <div className="text-center mt-3">
                Already have an account?{" "}
                <a href="/login" className="text-success fw-semibold">
                  Log in
                </a>
              </div>

            </form>
          </div>
        </div>

      </div>
    </div>
  );
}

export default Register;