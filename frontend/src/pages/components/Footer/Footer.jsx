import "./Footer.css";

export default function Footer() {
  return (
    <footer className="footer">
      <div className="footer-container">

        {/* Top Section */}
        <div className="footer-top">

          {/* Column 1 */}
          <div className="footer-col brand-col">
            <div className="logo">
              <div className="logo-icon">
                <i className="fas fa-tractor"></i>
              </div>
              <h2>HarvestPure</h2>
            </div>

            <p className="brand-desc">
              The decentralized marketplace for organic produce.
              Empowering farmers and nourishing communities
              through transparency and trust.
            </p>

            <div className="social-icons">
              <div className="social-circle">
                <i className="fab fa-twitter"></i>
              </div>
              <div className="social-circle">
                <i className="fab fa-instagram"></i>
              </div>
            </div>
          </div>

          {/* Column 2 */}
          <div className="footer-col">
            <h4>Marketplace</h4>
            <ul>
              <li>Browse All</li>
              <li>New Arrivals</li>
              <li>Seasonal Specials</li>
              <li>Bulk Orders</li>
            </ul>
          </div>

          {/* Column 3 */}
          <div className="footer-col">
            <h4>Company</h4>
            <ul>
              <li>About Us</li>
              <li>Sustainability</li>
              <li>Farmer's Blog</li>
              <li>Contact Support</li>
            </ul>
          </div>

          {/* Column 4 */}
          <div className="footer-col newsletter">
            <h4>Stay Updated</h4>
            <p>
              Get the latest harvest updates and recipes.
            </p>

            <div className="newsletter-box">
              <input type="email" placeholder="Email" />
              <button>
                <i className="fas fa-arrow-right"></i>
              </button>
            </div>
          </div>

        </div>

        {/* Divider */}
        <div className="footer-divider"></div>

        {/* Bottom Section */}
        <div className="footer-bottom">
          <p>© 2024 HarvestPure Inc. All rights reserved.</p>

          <div className="footer-links">
            <span>Privacy Policy</span>
            <span>Terms of Service</span>
            <span>Cookie Settings</span>
          </div>
        </div>

      </div>
    </footer>
  );
}