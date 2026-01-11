// backend/server.js
const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");
const connectDB = require("./config/database");
const path = require("path");

dotenv.config({ path: path.resolve(__dirname, ".env") });
connectDB();

const app = express();

/* ================= CORS ================= */
if (process.env.NODE_ENV === "production") {
  app.use(
    cors({
      origin: process.env.CLIENT_URL,
      credentials: true
    })
  );
} else {
  // local / development
  app.use(cors());
}

app.use(express.json());

// ===== ROUTES =====
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/order", require("./routes/order"));
app.use("/api/profession", require("./routes/profession"));
app.use("/api/house", require("./routes/houseRoutes"));
app.use("/api/chat", require("./routes/chatRoutes"));
app.use("/api/rent", require("./routes/rentRoutes"));
app.use("/api/post", require("./routes/postRoutes"));
app.use("/api/feed", require("./routes/feedRoutes"));
app.use("/api/profile", require("./routes/profileRoutes"));
app.use("/api/connections", require("./routes/connectionRoutes"));
app.use("/api/feedback", require("./routes/feedback"));
app.use("/api/config", require("./routes/adminConfig"));
app.use("/api/notifications", require("./routes/notificationRoutes"));
app.use("/api/admin/orders", require("./routes/adminOrders"));
app.use("/api/customer/orders", require("./routes/customerOrders"));
app.use("/api/otp", require("./routes/otp"));



// ===== START SERVER =====
const PORT = process.env.PORT || 5000;
app.listen(PORT, () =>
  console.log(`✅ Server running on port ${PORT}`)
);
