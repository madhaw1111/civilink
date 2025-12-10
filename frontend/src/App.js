import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

import Register from "./components/Register";
import Login from "./components/Login";
import Profile from "./components/Profile";
import Dashboard from "./components/Dashboard";

import EngineerDashboard from "./components/dashboards/EngineerDashboard";
import WorkerDashboard from "./components/dashboards/WorkerDashboard";
import VendorDashboard from "./components/dashboards/VendorDashboard";
import CustomerDashboard from "./components/dashboards/CustomerDashboard";
import AdminDashboard from "./components/dashboards/AdminDashboard";

import Home from "./components/Home";
import BuildHouse from "./components/BuildHouse";
import BuySellHouse from "./components/BuySellHouse";
import SellHouse from "./components/SellHouse";
import BuyHouse from "./components/BuyHouse";
import RentHouse from "./components/RentHouse";
import ToLetHouse from "./components/ToLetHouse";
import RentSearch from "./components/RentSearch";

export default function App() {
  // ✅ SINGLE FEED STATE (GLOBAL)
  const [feed, setFeed] = useState([
    {
      id: 1,
      type: "post",
      user: "Arun (Engineer)",
      text: "Welcome to Civilink ✅",
    },
  ]);

  // ✅ ONE FEED FUNCTION
  const addToFeed = (item) => {
    setFeed((prev) => [item, ...prev]);
  };

  return (
    <Router>
      <nav style={{ padding: 10 }}>
        <Link to="/" style={{ marginRight: 10 }}>
          Home
        </Link>
        <Link to="/register" style={{ marginRight: 10 }}>
          Register
        </Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        {/* ✅ HOME FEED */}
        <Route path="/" element={<Home feed={feed} />} />

        {/* AUTH */}
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* DASHBOARDS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/engineer" element={<EngineerDashboard />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />

        {/* CUSTOMER FLOWS */}
        <Route path="/build-house" element={<BuildHouse />} />
        <Route path="/buy-sell" element={<BuySellHouse />} />
        <Route path="/buy-house" element={<BuyHouse />} />
        <Route path="/rent-house" element={<RentHouse />} />
        <Route path="/rent-search" element={<RentSearch />} />

        {/* ✅ FEED CONNECTED PAGES */}
        <Route
          path="/sell-house"
          element={<SellHouse addToFeed={addToFeed} />}
        />
        <Route
          path="/tolet-house"
          element={<ToLetHouse addToFeed={addToFeed} />}
        />
      </Routes>
    </Router>
  );
}
