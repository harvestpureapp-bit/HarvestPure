import "./AgriculturePlatform.css";

export default function AgriculturePlatform() {
  return (
    <section className="agri-section">
      <div className="container-custom">
        <div className="row-custom">

          {/* LEFT SIDE */}
          <div className="col-6-custom">
            <div className="image-wrapper">
              <img
                src="https://images.unsplash.com/photo-1486754735734-325b5831c3ad?q=80&w=2070&auto=format&fit=crop"
                alt="Agriculture"
                className="main-img"
              />
            </div>
          </div>

          {/* RIGHT SIDE */}
          <div className="col-6-custom">
            <h2 className="section-heading">
              Advanced Platform for <br /> Conscious Agriculture
            </h2>

            <div className="feature-item">
              <div className="icon-box">
                <i className="fas fa-money-bill-wave"></i>
              </div>
              <div>
                <h5>Transparent Pricing</h5>
                <p>
                  See exactly how much goes to the farmer and how much covers logistics.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="icon-box">
                <i className="fas fa-shield-halved"></i>
              </div>
              <div>
                <h5>Secure Razorpay Integration</h5>
                <p>
                  Industry-standard payment security for all transactions.
                </p>
              </div>
            </div>

            <div className="feature-item">
              <div className="icon-box">
                <i className="fas fa-qrcode"></i>
              </div>
              <div>
                <h5>Immutable Traceability</h5>
                <p>
                  Scan QR codes to view entire journey on blockchain.
                </p>
              </div>
            </div>

          </div>

        </div>
      </div>
    </section>
  );
}