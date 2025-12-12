const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  profession: { type: String, default: "Member" }, // Worker, Engineer, etc
  skills: { type: [String], default: [] },
  experienceYears: { type: Number, default: 0 },
  profilePhoto: { type: String }, // URL or Base64
  isProfessional: { type: Boolean, default: false }

}, { timestamps: true });
 

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(enteredPassword, this.password);
};

module.exports = mongoose.model("User", userSchema);
