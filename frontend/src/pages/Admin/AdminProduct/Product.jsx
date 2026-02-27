import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import "./AdminProducts.css";

function Products() {
  const [products, setProducts] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8080/products/admin", {
      headers: {
        Authorization: `Bearer ${token}`,
      },
    });

    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const toggleStatus = async (id, currentStatus) => {
    await fetch(`http://localhost:8080/products/${id}/status`, {
      method: "PUT",
      headers: {
        "Content-Type": "application/json",
        Authorization: `Bearer ${token}`,
      },
      body: JSON.stringify({ status: !currentStatus }),
    });

    fetchProducts();
  };

  const activeCount = products.filter((p) => p.is_active).length;
  const inactiveCount = products.filter((p) => !p.is_active).length;
  const lowStock = products.filter((p) => p.stock < 10).length;

  return (
    <AdminLayout>
      <div className="container-fluid p-4 products-page">
        <h3 className="fw-bold mb-4">Product Management</h3>

        {/* ===== SUMMARY CARDS ===== */}
        <div className="products-summary">
          <div className="row g-4 mb-4">
            <div className="col-md-4">
              <div className="summary-card active-card">
                <h6>Active Products</h6>
                <h2>{activeCount}</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div className="summary-card inactive-card">
                <h6>Inactive Products</h6>
                <h2>{inactiveCount}</h2>
              </div>
            </div>

            <div className="col-md-4">
              <div className="summary-card stock-card">
                <h6>Low Stock (&lt;10)</h6>
                <h2>{lowStock}</h2>
              </div>
            </div>
          </div>
        </div>

        {/* ===== TABLE ===== */}
        <div className="card border-0 shadow-lg rounded-4 p-4">
          <h5 className="fw-semibold mb-3">All Products</h5>

          <div className="table-responsive">
            <table className="table modern-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Title</th>
                  <th>Grower</th>
                  <th>Price</th>
                  <th>Stock</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {products.length === 0 ? (
                  <tr>
                    <td colSpan="8" className="text-center py-4">
                      No products found
                    </td>
                  </tr>
                ) : (
                  products.map((product) => (
                    <tr key={product.id}>
                      <td>{product.id}</td>

                      <td>
                        <img
                          src={`http://localhost:8080${product.primary_image}`}
                          alt={product.title}
                          className="product-img"
                        />
                      </td>

                      <td className="fw-semibold">{product.title}</td>
                      <td>{product.grower_name || "N/A"}</td>
                      <td>₹{product.price}</td>

                      <td>
                        <span
                          className={`stock-badge ${
                            product.stock < 10 ? "low" : "normal"
                          }`}
                        >
                          {product.stock}
                        </span>
                      </td>

                      <td>
                        <span
                          className={`status-badge ${
                            product.is_active ? "active" : "inactive"
                          }`}
                        >
                          {product.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>

                      <td>
                        <button
                          className="modern-toggle-btn"
                          onClick={() =>
                            toggleStatus(product.id, product.is_active)
                          }
                        >
                          {product.is_active ? "Deactivate" : "Activate"}
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

export default Products;