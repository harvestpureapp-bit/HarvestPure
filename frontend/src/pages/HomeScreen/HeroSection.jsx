import "./HeroSection.css";

function HeroSection() {
  return (
    <section className="hero">
      <div className="hero-overlay"></div>

      <div className="hero-content">
        <span className="hero-badge">
          Direct from Sustainable Farms
        </span>

        <h1>
          Fresh From Farm.<br />
          <span className="highlight">Transparent.</span><br />
          Trusted.
        </h1>

        <p>
          Direct-to-consumer organic produce backed by blockchain transparency.
          Bridging the gap between local farmers and conscious consumers.
        </p>

        <div className="hero-buttons">
          <button className="btn-primary">Shop Now →</button>
          <button className="btn-secondary">Become a Farmer</button>
        </div>
      </div>
    </section>
  );
}

export default HeroSection;