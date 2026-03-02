import { useParams, useNavigate } from "react-router-dom";
import { useEffect, useState } from "react";
import axios from "axios";
import "./ProductDetails.css";

export default function ProductDetails() {
  const { slug } = useParams();
  const navigate = useNavigate();

  const [product, setProduct] = useState(null);
  const [mainImage, setMainImage] = useState("");
  const [qty, setQty] = useState(1);

  const token = localStorage.getItem("token");

  useEffect(() => {
    axios
      .get(`http://localhost:8080/products/${slug}`)
      .then((res) => {
        setProduct(res.data);
        setMainImage(res.data.primary_image);
      })
      .catch((err) => console.log(err));
  }, [slug]);

  if (!product) return <div className="loading">Loading...</div>;

  // ✅ Increase Quantity
  const increaseQty = () => {
    if (qty < product.stock) {
      setQty(qty + 1);
    }
  };

  // ✅ Decrease Quantity
  const decreaseQty = () => {
    if (qty > 1) {
      setQty(qty - 1);
    }
  };

  // ✅ Add to Cart API
  const handleAddToCart = async () => {
    if (!token) {
      alert("Please login first");
      navigate("/login");
      return;
    }

    try {
      await axios.post(
        "http://localhost:8080/cart",
        {
          product_id: product.id,
          quantity: qty,
        },
        {
          headers: {
            Authorization: `Bearer ${token}`,
          },
        }
      );

      alert("Product added to cart successfully!");
      navigate("/cart");

    } catch (err) {
      console.log(err);
      alert("Failed to add to cart");
    }
  };

  return (
    <section className="product-page">
      <div className="product-container">

        {/* LEFT SIDE */}
        <div className="product-left">
          <div className="main-image">
            <img src={mainImage} alt={product.title} />
          </div>

          <div className="thumbnail-row">
            {[product.primary_image, ...(product.images || [])].map((img, i) => (
              <img
                key={i}
                src={img}
                alt=""
                onClick={() => setMainImage(img)}
              />
            ))}
          </div>
        </div>

        {/* RIGHT SIDE */}
        <div className="product-right">
          <h1>{product.title}</h1>

          <div className="price-row">
            <h2>${product.price}</h2>
            <span>/ lb</span>
          </div>

          <p className="stock">
            {product.stock > 0
              ? `In Stock - ${product.stock} remaining`
              : "Out of Stock"}
          </p>

          <div className="qty-cart">
            <div className="qty-box">
              <button onClick={decreaseQty}>-</button>
              <span>{qty}</span>
              <button onClick={increaseQty}>+</button>
            </div>

            <button
              className="add-cart"
              onClick={handleAddToCart}
              disabled={product.stock === 0}
            >
              Add to Cart
            </button>
          </div>

          <button className="buy-now">Buy Now</button>

          {/* Extra Info */}
          <div className="info-box">
            <div>
              <h4>Harvest Date</h4>
              <p>{new Date(product.created_at).toDateString()}</p>
            </div>
            <div>
              <h4>Shelf Life</h4>
              <p>7–10 Days</p>
            </div>
          </div>

          {/* Grower */}
          <div className="grower-box">
            <h4>Grown By</h4>
            <p>{product.grower_name}</p>
          </div>

        </div>
      </div>
    </section>
  );
}