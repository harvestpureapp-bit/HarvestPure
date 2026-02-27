import { Routes, Route } from "react-router-dom";
import "./App.css";
import Login from "./pages/Auth/Login/Login";
import Register from "./pages/Auth/Register/Register";
import AdminDashboard from "./pages/Admin/AdminDashboard";
import AdminOrders from "./pages/Admin/AdminOrders/AdminOrders";
import AdminUsers from "./pages/Admin/AdminUser/AdminUser";
import Products from "./pages/Admin/AdminProduct/Product";
import AdminGrowers from "./pages/Admin/AdminGrowers/AdminGrowers";
import AdminEarnings from "./pages/Admin/AdminEarning/AdminEarnings";
import FarmerDashboard from "./pages/Farmer/FarmerDashboard/FarmerDashboard";
import FarmerProducts from "./pages/Farmer/FarmerProducts/FarmerProducts";
import FarmerOrders from "./pages/Farmer/FarmerOrders/FarmerOrders";
import FarmerEarnings from "./pages/Farmer/FarmerEarnings/FarmerEarnings";

function App() {
  return (
    <>
      <Routes>
        <Route path="/login" element={<Login/>} />
        <Route path="/register" element={<Register/>}/>
        <Route path="/admin-dashboard" element={<AdminDashboard/>}/>
        <Route path="/admin/orders" element={<AdminOrders/>}/>
        <Route path="/admin/users" element={<AdminUsers/>}/>
        <Route path="/admin/products" element={<Products/>}/>
        <Route path="/admin/growers" element={<AdminGrowers/>}/>
        <Route path="/admin/earnings" element={<AdminEarnings/>}/>
        <Route path="/farmer-dashboard" element={<FarmerDashboard/>}/>
        <Route path="/farmer/products" element={<FarmerProducts/>}/>
        <Route path="/farmer/orders" element={<FarmerOrders/>}/>
        <Route path="/farmer/earnings" element={<FarmerEarnings/>}/>
      </Routes>
    </>
  );
}

export default App;