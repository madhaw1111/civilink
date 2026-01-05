const mongoose = require("mongoose");

const userSchema = new mongoose.Schema({
  name: { type: String, required: true },
  email: { type: String, required: true, unique: true },
  phone: { type: String },
  password: { type: String, required: true },
  profession: { type: String, default: "Member" }, // Worker, Engineer, etc
  skills: { type: [String], default: [] },
  experienceYears: { type: Number, default: 0 },
  profilePhoto: { type: String,  default: "" }, // URL or Base64
  isProfessional: { type: Boolean, default: false },
  role: {
  type: String,
  enum: ["user", "admin"],
  default: "user"
},

location: {
  city: { type: String, default: "" },
  state: { type: String, default: "" },
  lat: { type: Number },
  lng: { type: Number }
},

theme: {
  type: String,
  enum: ["light", "dark", "system"],
  default: "light"
},

language: {
  type: String,
  enum: ["en", "ta", "hi"],
  default: "en"
},

   /* ================= CONNECTIONS ================= */
    connections: [
      {
        type: mongoose.Schema.Types.ObjectId,
        ref: "User"
      }
    ],

/* ================= SAVED POSTS ================= */
savedPosts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
],
/* ================= HIDDEN POSTS ================= */
hiddenPosts: [
  {
    type: mongoose.Schema.Types.ObjectId,
    ref: "Post"
  }
],
otp: {
  type: String
},
otpExpiresAt: {
  type: Date
},
otpAttempts: {
  type: Number,
  default: 0
}





  
}, { timestamps: true });
 

// Compare password for login
userSchema.methods.matchPassword = async function (enteredPassword) {
  const bcrypt = require("bcryptjs");
  return await bcrypt.compare(enteredPassword, this.password);
};



module.exports = mongoose.model("User", userSchema);
