import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

//PROFILE
import ProfileWrapper from "./components/Home/Profile/ProfileWrapper";


// HOME
import Home from "./components/Home/Home";

// CUSTOMER PAGES
import BuildHouse from "./components/dashboards/Customer/BuildHouse";
import BuyHouse from "./components/dashboards/Customer/BuyHouse";
import BuySellHouse from "./components/dashboards/Customer/BuySellHouse";
import RentHouse from "./components/dashboards/Customer/RentHouse";
import RentSearch from "./components/dashboards/Customer/RentSearch";
import SellHouse from "./components/dashboards/Customer/SellHouse";
import ToLetHouse from "./components/dashboards/Customer/ToLetHouse";

// VENDOR PAGE
import VendorDashboard from "./components/dashboards/Vendor/VendorDashboard";

// PROFESSION PAGE
import ProfessionDashboard from "./components/dashboards/Profession/ProfessionDashboard";
import ProfessionList from "./components/dashboards/Profession/ProfessionList";


export default function App() {

  // MUST BE INSIDE THE COMPONENT
  const [isLoggedIn, setIsLoggedIn] = useState(false);

  // FIXED LOGIN CHECK
  useEffect(() => {
    const checkLogin = () => {
      const user = localStorage.getItem("civilink_user");
      setIsLoggedIn(!!user);
    };

    checkLogin();

    window.addEventListener("storage", checkLogin);
    return () => window.removeEventListener("storage", checkLogin);
  }, []);

  return (
    <Router>
      <Routes>

        {/* LOGIN */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />

        {/* REGISTER */}
        <Route path="/register" element={<Register />} />

        {/* HOME */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />
        <Route path="/profile" element={isLoggedIn ? <ProfileWrapper /> : <Navigate to="/" />} />
        

        {/* CUSTOMER ROUTES */}
        <Route path="/build-house" element={<BuildHouse />} />
        <Route path="/buy-house" element={<BuyHouse />} />
        <Route path="/buy-sell" element={<BuySellHouse />} />
        <Route path="/rent-house" element={<RentHouse />} />
        <Route path="/rent-search" element={<RentSearch />} />
        <Route path="/sell-house" element={<SellHouse />} />
        <Route path="/to-let" element={<ToLetHouse />} />

        {/* VENDOR */}
        <Route path="/vendor" element={<VendorDashboard />} />

        {/* PROFESSION*/}
        <Route path="/profession-dashboard" element={<ProfessionDashboard />} />
        <Route path="/profession/:type" element={<ProfessionList />} />

      </Routes>
    </Router>
  );
}
