import React from "react";
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

export default function App() {
  return (
    <Router>
      <nav style={{ padding: 10 }}>
        <Link to="/" style={{ marginRight: 10 }}>Home</Link>
        <Link to="/register" style={{ marginRight: 10 }}>Register</Link>
        <Link to="/login">Login</Link>
      </nav>

      <Routes>
        <Route path="/" element={<Home />} />

        <Route path="/" element={<h2>Welcome to Civilink</h2>} />
        <Route path="/register" element={<Register />} />
        <Route path="/login" element={<Login />} />
        <Route path="/profile" element={<Profile />} />

        {/* 🚀 NEW ROUTES FOR ROLE DASHBOARDS */}
        <Route path="/dashboard" element={<Dashboard />} />
        <Route path="/engineer" element={<EngineerDashboard />} />
        <Route path="/worker" element={<WorkerDashboard />} />
        <Route path="/vendor" element={<VendorDashboard />} />
        <Route path="/customer" element={<CustomerDashboard />} />
        <Route path="/admin" element={<AdminDashboard />} />
      </Routes>
    </Router>
  );
}
