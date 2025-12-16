// backend/server.js
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/database');

dotenv.config();
connectDB();

const app = express();
app.use(cors());
app.use(express.json());

// ROUTES
app.use("/api/auth", require("./routes/auth"));
app.use("/api/users", require("./routes/users"));
app.use("/api/admin", require("./routes/admin"));
app.use("/api/order", require("./routes/order"));
app.use("/api/profession", require("./routes/profession")); // <-- Correct

const PORT = process.env.PORT || 5000;
app.listen(PORT, () => console.log(`Server running on port ${PORT}`));

app.use("/api/house", require("./routes/houseRoutes"));

app.use("/api/chat", require("./routes/chatRoutes"));

app.use("/api/users", require("./routes/users"));

app.use("/api/rent", require("./routes/rentRoutes"));

app.use("/api/post", require("./routes/postRoutes"));

app.use("/api/feed", require("./routes/feedRoutes"));
