import { useEffect, useState } from "react";
import FarmerLayout from "../FarmerLayout";
import "./FarmerProducts.css";

function FarmerProducts() {
  const [products, setProducts] = useState([]);
  const [formData, setFormData] = useState({
    title: "",
    description: "",
    price: "",
    stock: "",
    category: "",
    is_organic: false,
  });

  const [images, setImages] = useState([]);
  const token = localStorage.getItem("token");

  const fetchProducts = async () => {
    const res = await fetch("http://localhost:8080/products/farmer", {
      headers: { Authorization: `Bearer ${token}` },
    });

    const data = await res.json();
    setProducts(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleChange = (e) => {
    const { name, value, type, checked } = e.target;
    setFormData({
      ...formData,
      [name]: type === "checkbox" ? checked : value,
    });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();

    Object.keys(formData).forEach((key) => {
      form.append(key, formData[key]);
    });

    for (let img of images) {
      form.append("images", img);
    }

    await fetch("http://localhost:8080/products", {
      method: "POST",
      headers: { Authorization: `Bearer ${token}` },
      body: form,
    });

    setFormData({
      title: "",
      description: "",
      price: "",
      stock: "",
      category: "",
      is_organic: false,
    });

    setImages([]);
    fetchProducts();
  };

  return (
    <FarmerLayout>
      <div className="container-fluid p-4 farmer-products">
        {/* ========= PRODUCT LIST ========= */}
        <h3 className="fw-bold mb-4">My Products</h3>

        <div className="row g-4 mb-5">
          {products.length === 0 ? (
            <div className="text-center py-5">
              <h5>No products added yet</h5>
            </div>
          ) : (
            products.map((product) => (
              <div key={product.id} className="col-md-4">
                <div className="product-card">
                  <img
                    src={`http://localhost:8080${product.primary_image}`}
                    alt={product.title}
                    className="product-image"
                  />

                  <div className="product-body">
                    <h5>{product.title}</h5>
                    <p className="price">₹ {product.price}</p>

                    <div className="meta">
                      <span>Stock: {product.stock}</span>
                      <span
                        className={`badge ${
                          product.is_active ? "bg-success" : "bg-danger"
                        }`}
                      >
                        {product.is_active ? "Active" : "Inactive"}
                      </span>
                    </div>
                  </div>
                </div>
              </div>
            ))
          )}
        </div>

        {/* ========= ADD PRODUCT FORM ========= */}
        <div className="add-product-card">
          <h4 className="mb-4">Add New Product</h4>

          <form onSubmit={handleSubmit}>
            <div className="row g-3">
              <div className="col-md-6">
                <input
                  type="text"
                  name="title"
                  placeholder="Product Title"
                  className="form-control"
                  value={formData.title}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  name="price"
                  placeholder="Price"
                  className="form-control"
                  value={formData.price}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-3">
                <input
                  type="number"
                  name="stock"
                  placeholder="Stock"
                  className="form-control"
                  value={formData.stock}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-6">
                <select
                  name="category"
                  className="form-select"
                  value={formData.category}
                  onChange={handleChange}
                  required
                >
                  <option value="">Select Category</option>
                  <option value="vegetables">Vegetables</option>
                  <option value="fruits">Fruits</option>
                  <option value="grains">Grains</option>
                  <option value="dairy">Dairy</option>
                  <option value="herbs">Herbs</option>
                  <option value="organic">Organic Special</option>
                </select>
              </div>

              <div className="col-md-6">
                <input
                  type="file"
                  multiple
                  className="form-control"
                  onChange={(e) => setImages([...e.target.files])}
                />
              </div>

              <div className="col-12">
                <textarea
                  name="description"
                  placeholder="Product Description"
                  className="form-control"
                  rows="3"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12">
                <div className="form-check">
                  <input
                    type="checkbox"
                    name="is_organic"
                    className="form-check-input"
                    checked={formData.is_organic}
                    onChange={handleChange}
                  />
                  <label className="form-check-label">Organic Product</label>
                </div>
              </div>

              <div className="col-12">
                <button className="btn btn-success px-4">Add Product</button>
              </div>
            </div>
          </form>
        </div>
      </div>
    </FarmerLayout>
  );
}

export default FarmerProducts;
