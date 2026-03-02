import "./HowItWorks.css";

export default function HowItWorks() {
  return (
    <section className="how-section">
      <div className="container text-center">

        <h2 className="section-title">How It Works</h2>
        <p className="section-subtitle">
          Seamlessly connecting you to the source of your food through cutting-edge technology.
        </p>

        <div className="row mt-5">

          {/* Card 1 */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="how-card">
              <div className="icon-box">
                <i className="fas fa-file-upload"></i>
              </div>
              <h4>Farmer Lists</h4>
              <p>
                Farmers upload their fresh harvest directly to our platform
                with real-time inventory tracking.
              </p>
            </div>
          </div>

          {/* Card 2 */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="how-card">
              <div className="icon-box">
                <i className="fas fa-cart-shopping"></i>
              </div>
              <h4>Consumer Purchases</h4>
              <p>
                Direct buying without middlemen ensures better prices for you
                and higher margins for the farmer.
              </p>
            </div>
          </div>

          {/* Card 3 */}
          <div className="col-lg-4 col-md-6 mb-4">
            <div className="how-card">
              <div className="icon-box">
                <i className="fas fa-shield-halved"></i>
              </div>
              <h4>Blockchain Transparency</h4>
              <p>
                Every transaction is logged and verifiable on the immutable
                ledger for total traceability.
              </p>
            </div>
          </div>

        </div>
      </div>
    </section>
  );
}