import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// AUTH
import Login from "./components/Auth/Login";
import Register from "./components/Auth/Register";

// PROFILE
import ProfileWrapper from "./components/Home/Profile/ProfileWrapper";

// HOME
import Home from "./components/Home/Home";

// CUSTOMER
import BuyHouse from "./components/dashboards/Customer/BuyHouse";
import BuySellHouse from "./components/dashboards/Customer/BuySellHouse";
import RentHouse from "./components/dashboards/Customer/RentHouse";
import PostRentHouse from "./components/dashboards/Customer/Rent/PostRentHouse";
import SellHouse from "./components/dashboards/Customer/SellHouse";
import RentalHouse from "./components/dashboards/Customer/Rent/RentalHouse";

// VENDOR
import VendorDashboard from "./components/dashboards/Vendor/VendorDashboard";

// ADMIN (GLOBAL ADMIN)
import AdminDashboard from "./components/dashboards/Vendor/AdminDashboard";
import AdminRoute from "./routes/AdminRoute";

// PROFESSION
import ProfessionDashboard from "./components/dashboards/Profession/ProfessionDashboard";
import ProfessionList from "./components/dashboards/Profession/ProfessionList";

// CHAT
import ChatInbox from "./components/chat/ChatInbox";
import ChatWindow from "./components/chat/ChatWindow";

import ConnectionsPage from "./components/Home/Profile/ConnectionsPage";
import SettingsPage from "./components/Settings/SettingsPage";

import { Toaster } from "react-hot-toast";
import AdminFeedback from "./components/Admin/AdminFeedback";

export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);

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

      {/* ✅ TOASTER MUST BE OUTSIDE ROUTES */}
      <Toaster position="top-right" />

      <Routes>
        {/* AUTH */}
        <Route
          path="/"
          element={isLoggedIn ? <Navigate to="/home" /> : <Login />}
        />
        <Route path="/register" element={<Register />} />

        {/* HOME */}
        <Route
          path="/home"
          element={isLoggedIn ? <Home /> : <Navigate to="/" />}
        />

        <Route
          path="/profile"
          element={isLoggedIn ? <ProfileWrapper /> : <Navigate to="/" />}
        />

        <Route path="/profile/:userId" element={<ProfileWrapper />} />
        <Route
          path="/profile/:userId/connections"
          element={<ConnectionsPage />}
        />

        {/* CUSTOMER */}
        <Route path="/buy-house" element={<BuyHouse />} />
        <Route path="/buy-sell" element={<BuySellHouse />} />
        <Route path="/rent-house" element={<RentHouse />} />
        <Route path="/post-rent-house" element={<PostRentHouse />} />
        <Route path="/sell-house" element={<SellHouse />} />
        <Route path="/rental-house" element={<RentalHouse />} />

        {/* VENDOR */}
        <Route path="/vendor" element={<VendorDashboard />} />

        {/* ✅ GLOBAL ADMIN (PROTECTED) */}
        <Route
          path="/admin"
          element={
            <AdminRoute>
              <AdminDashboard />
            </AdminRoute>
          }
        />

        {/* PROFESSION */}
        <Route path="/profession-dashboard" element={<ProfessionDashboard />} />
        <Route path="/profession/:type" element={<ProfessionList />} />
        <Route path="/profession/:category" element={<ProfessionDashboard />} />

        {/* CHAT */}
        <Route path="/messages" element={<ChatInbox />} />
        <Route
          path="/messages/:conversationId"
          element={<ChatWindow />}
        />

        {/* SETTINGS */}
        <Route path="/settings" element={<SettingsPage />} />
         <Route
  path="/admin/feedback"
  element={
    <AdminRoute>
      <AdminFeedback />
    </AdminRoute>
  }
/>

      </Routes>
     

    </Router>
  );
}
