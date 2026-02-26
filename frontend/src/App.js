import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Navigate } from "react-router-dom";

// INTRO
import IntroPage1 from "./components/Intro/IntroPage1";
import IntroPage2 from "./components/Intro/IntroPage2";
import IntroPage3 from "./components/Intro/IntroPage3";

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
import SavedPosts from "./components/Home/Profile/SavedPosts";
import NotificationsPage from "./components/Notifications/NotificationsPage";

// CUSTOMER – LAND (NEW)
import BuySellLand from "./components/dashboards/Customer/BuySellLand";
import BuyLand from "./components/dashboards/Customer/BuyLand";
import SellLand from "./components/dashboards/Customer/SellLand";

import PostView from "./components/Home/Modals/PostView";

import ProfessionalUpload from "./components/dashboards/Profession/ProfessionalUpload";
import VerificationPending from "./components/dashboards/Profession/VerificationPending";



export default function App() {
  const [isLoggedIn, setIsLoggedIn] = useState(false);
  const [introSeen, setIntroSeen] = useState(
  localStorage.getItem("civilink_intro_seen") === "true"
);
  useEffect(() => {
  const checkLogin = () => {
    const user = localStorage.getItem("civilink_user");
    setIsLoggedIn(!!user);

    const intro = localStorage.getItem("civilink_intro_seen") === "true";
    setIntroSeen(intro);
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
        {/* INTRO SCREENS */}
       <Route
  path="/intro/1"
  element={isLoggedIn || introSeen ? <Navigate to="/" /> : <IntroPage1 />}
/>
        <Route
  path="/intro/2"
  element={isLoggedIn || introSeen ? <Navigate to="/" /> : <IntroPage2 />}
/>

<Route
  path="/intro/3"
  element={isLoggedIn || introSeen ? <Navigate to="/" /> : <IntroPage3 />}
/>
        {/* AUTH */}
      <Route
  path="/"
  element={
    isLoggedIn ? (
      <Navigate to="/home" />
    ) : introSeen ? (
      <Login />
    ) : (
      <Navigate to="/intro/1" />
    )
  }
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
        
        {/* CUSTOMER – LAND (NEW) */}
        <Route path="/buy-sell-land" element={<BuySellLand />} />
        <Route path="/buy-land" element={<BuyLand />} />
        <Route path="/sell-land" element={<SellLand />} />
        
        <Route path="/post/:id" element={<PostView />} />
        
        {/* PROFESSIONAL VERIFICATION */}
        <Route path="/professional-upload" element={isLoggedIn ? <ProfessionalUpload /> : <Navigate to="/" />}/>
        <Route path="/verification-status" element={isLoggedIn ? <VerificationPending /> : <Navigate to="/" />}/>


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
<Route path="/saved" element={<SavedPosts />} />
<Route path="/notifications" element={<NotificationsPage />} />



      </Routes>
     

    </Router>
  );
}
