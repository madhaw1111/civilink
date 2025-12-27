const mongoose = require("mongoose");

const AdminLogSchema = new mongoose.Schema(
  {
    adminId: { type: mongoose.Schema.Types.ObjectId, ref: "User" },
    action: String,
    entityType: String,
    entityId: mongoose.Schema.Types.ObjectId,
    description: String,
  },
  { timestamps: true }
);

module.exports = mongoose.model("AdminLog", AdminLogSchema);