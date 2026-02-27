import { useEffect, useState } from "react";
import AdminLayout from "../AdminLayout";
import "./AdminGrowers.css";

function AdminGrowers() {
  const [growers, setGrowers] = useState([]);
  const [formData, setFormData] = useState({
    name: "",
    description: "",
    rating: "",
  });
  const [image, setImage] = useState(null);
  const [preview, setPreview] = useState(null);
  const [editId, setEditId] = useState(null);

  const token = localStorage.getItem("token");

  const fetchGrowers = async () => {
    const res = await fetch("http://localhost:8080/growers", {
      headers: { Authorization: `Bearer ${token}` },
    });
    const data = await res.json();
    setGrowers(Array.isArray(data) ? data : []);
  };

  useEffect(() => {
    fetchGrowers();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleImageChange = (e) => {
    const file = e.target.files[0];
    setImage(file);
    if (file) {
      setPreview(URL.createObjectURL(file));
    }
  };

  const handleSubmit = async (e) => {
    e.preventDefault();

    const form = new FormData();
    form.append("name", formData.name);
    form.append("description", formData.description);
    form.append("rating", formData.rating);
    if (image) form.append("profile_image", image);

    if (editId) {
      await fetch(`http://localhost:8080/growers/${editId}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
    } else {
      await fetch("http://localhost:8080/growers", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: form,
      });
    }

    setFormData({ name: "", description: "", rating: "" });
    setImage(null);
    setPreview(null);
    setEditId(null);
    fetchGrowers();
  };

  const handleDelete = async (id) => {
    await fetch(`http://localhost:8080/growers/${id}`, {
      method: "DELETE",
      headers: { Authorization: `Bearer ${token}` },
    });
    fetchGrowers();
  };

  const handleEdit = (grower) => {
    setEditId(grower.id);
    setFormData({
      name: grower.name,
      description: grower.description,
      rating: grower.rating,
    });
    setPreview(`http://localhost:8080${grower.profile_image}`);
  };

  return (
    <AdminLayout>
      <div className="container-fluid p-4 growers-page">
        <h3 className="fw-bold mb-4">Grower Management</h3>

        {/* Form Card */}
        <div className="card shadow-lg border-0 rounded-4 p-4 mb-4">
          <h5 className="mb-3 fw-semibold">
            {editId ? "Edit Grower" : "Add New Grower"}
          </h5>

          <form onSubmit={handleSubmit}>
            <div className="row g-4">

              <div className="col-md-4">
                <input
                  type="text"
                  name="name"
                  className="form-control modern-input"
                  placeholder="Grower Name"
                  value={formData.name}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-md-4">
                <input
                  type="number"
                  name="rating"
                  className="form-control modern-input"
                  placeholder="Rating"
                  value={formData.rating}
                  onChange={handleChange}
                />
              </div>

              <div className="col-md-4">
                <input
                  type="file"
                  className="form-control modern-input"
                  onChange={handleImageChange}
                />
              </div>

              {preview && (
                <div className="col-12 text-center">
                  <img
                    src={preview}
                    alt="Preview"
                    className="grower-preview"
                  />
                </div>
              )}

              <div className="col-12">
                <textarea
                  name="description"
                  className="form-control modern-input"
                  placeholder="Description"
                  value={formData.description}
                  onChange={handleChange}
                  required
                />
              </div>

              <div className="col-12 text-end">
                <button className="btn modern-btn">
                  {editId ? "Update Grower" : "Add Grower"}
                </button>
              </div>

            </div>
          </form>
        </div>

        {/* Table */}
        <div className="card shadow-lg border-0 rounded-4 p-4">
          <h5 className="fw-semibold mb-3">All Growers</h5>

          <div className="table-responsive">
            <table className="table modern-table align-middle">
              <thead>
                <tr>
                  <th>ID</th>
                  <th>Image</th>
                  <th>Name</th>
                  <th>Rating</th>
                  <th>Status</th>
                  <th>Action</th>
                </tr>
              </thead>

              <tbody>
                {growers.length === 0 ? (
                  <tr>
                    <td colSpan="6" className="text-center py-4">
                      No growers found
                    </td>
                  </tr>
                ) : (
                  growers.map((g) => (
                    <tr key={g.id}>
                      <td>{g.id}</td>
                      <td>
                        <img
                          src={`http://localhost:8080${g.profile_image}`}
                          alt={g.name}
                          className="grower-table-img"
                        />
                      </td>
                      <td>{g.name}</td>
                      <td>{g.rating}</td>
                      <td>
                        <span
                          className={`badge ${
                            g.is_active ? "bg-success" : "bg-danger"
                          }`}
                        >
                          {g.is_active ? "Active" : "Inactive"}
                        </span>
                      </td>
                      <td>
                        <button
                          className="btn btn-sm btn-outline-primary me-2"
                          onClick={() => handleEdit(g)}
                        >
                          Edit
                        </button>

                        <button
                          className="btn btn-sm btn-outline-danger"
                          onClick={() => handleDelete(g.id)}
                        >
                          Deactivate
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

export default AdminGrowers;