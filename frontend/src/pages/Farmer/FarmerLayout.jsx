import FarmerSidebar from "./FarmerSidebar";
import "./FarmerLayout.css"

function FarmerLayout({ children }) {
  return (
    <div className="farmer-container">
      <FarmerSidebar />

      <div className="farmer-main">
        {children}
      </div>
    </div>
  );
}

export default FarmerLayout;