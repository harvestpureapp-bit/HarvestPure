import { useEffect, useState } from "react";
import "./FeaturedProducts.css";
import axios from "axios";

export default function FeaturedProducts() {
  const [products, setProducts] = useState([]);

  useEffect(() => {
    axios
      .get("http://localhost:8080/products")
      .then((res) => setProducts(res.data))
      .catch((err) => console.log(err));
  }, []);

  return (
    <section className="featured-section">
      <div className="container">

        {/* Header */}
        <div className="d-flex justify-content-between align-items-center mb-4">
          <div>
            <h2 className="section-title">Featured Products</h2>
            <p className="section-subtitle">
              Hand-picked organic goods available for delivery.
            </p>
          </div>
          <a href="/marketplace" className="browse-link">
            Browse Marketplace <i className="fas fa-chevron-right"></i>
          </a>
        </div>

        {/* Products */}
        <div className="row">
          {products.slice(0, 4).map((product) => (
            <div className="col-lg-3 col-md-6 mb-4" key={product.id}>
              <div className="product-card">

                {/* Image */}
                <div className="image-wrapper">
                  <img
                    src={product.primary_image}
                    alt={product.title}
                    className="img-fluid"
                  />
                  <span className="badge-tag">
                    {product.category?.toUpperCase()}
                  </span>
                </div>

                {/* Content */}
                <div className="card-body">
                  <h5>{product.title}</h5>
                  <p className="farmer-name">
                    <i className="fas fa-user"></i>{" "}
                    Farmer: {product.grower_name}
                  </p>

                  <div className="d-flex justify-content-between align-items-center mt-3">
                    <h4 className="price">${product.price}</h4>
                    <a
                      href={`/product/${product.slug}`}
                      className="btn view-btn"
                    >
                      View Details
                    </a>
                  </div>

                </div>
              </div>
            </div>
          ))}
        </div>

      </div>
    </section>
  );
}