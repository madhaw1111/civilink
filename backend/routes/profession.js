const express = require("express");
const router = express.Router();
const User = require("../models/User");
const auth = require("../middleware/auth");
const uploadToS3 = require("../middleware/upload");
const sendAdminApplyMail = require("../utils/sendAdminApplyMail");
/* =========================================
   🔹 SUGGESTED PROFESSIONALS (HOME PAGE)
   ⚠️ MUST BE ABOVE :type ROUTE
========================================= */
router.get("/suggested/home", async (req, res) => {
  try {
    const users = await User.find({
      isProfessional: true,
      "professionalVerification.status": "approved"
    })
      .select("name profession profilePhoto skills experienceYears")
      .limit(10);

    res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error("SUGGESTED HOME ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================================
   🔹 AVAILABLE PROFESSIONS (DASHBOARD)
========================================= */
router.get("/available", async (req, res) => {
  try {
    const result = await User.aggregate([
      {
        $match: {
          isProfessional: true,
          "professionalVerification.status": "approved"
        }
      },
      {
        $group: {
          _id: "$profession",
          count: { $sum: 1 }
        }
      }
    ]);

    res.json({
      success: true,
      professions: result
    });
  } catch (err) {
    console.error("AVAILABLE PROFESSION ERROR:", err);
    res.status(500).json({ success: false });
  }
});

/* =========================================
   🔹 PROFESSIONAL PROFILE UPDATE
   🔒 AUTH REQUIRED
========================================= */
router.post("/update", auth, async (req, res) => {
  try {
    const { profession, skills, experienceYears, profilePhoto } = req.body;
    const userId = req.user.id; // ✅ SAFE SOURCE

    const user = await User.findById(userId);
    if (!user) {
      return res.status(404).json({
        success: false,
        message: "User not found"
      });
    }

    // 🔒 PROFESSION LOCK (ONE TIME ONLY)
    if (user.isProfessional && user.profession !== profession) {
      return res.status(400).json({
        success: false,
        message: "Profession already finalized"
      });
    }

    user.profession = profession;
    user.skills = skills || [];
    user.experienceYears = experienceYears || 0;
    user.profilePhoto = profilePhoto || "";
    user.isProfessional = true;

    // ✅ VERIFICATION RULE (CRITICAL)
    if (profession === "Engineer" || profession === "Architect") {
      user.professionalVerification.applied = true;
      user.professionalVerification.status = "pending";
    } else {
      user.professionalVerification.applied = false;
      user.professionalVerification.status = "approved";
    }

    await user.save();

    res.json({
      success: true,
      user
    });
  } catch (err) {
    console.error("PROFESSION UPDATE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});

/* =========================================
   🔹 GET PROFESSIONALS BY TYPE
   ⚠️ MUST BE LAST
========================================= */
router.get("/:type", async (req, res) => {
  try {
    const type = req.params.type;

    const users = await User.find({
      profession: new RegExp(`^${type}$`, "i"),
      isProfessional: true,
      "professionalVerification.status": "approved"
    }).select("-password");

    res.json({
      success: true,
      users
    });
  } catch (err) {
    console.error("PROFESSION TYPE ERROR:", err);
    res.status(500).json({
      success: false,
      message: "Server error"
    });
  }
});
/* =========================================
   🔹 UPLOAD PROFESSIONAL DOCUMENTS
   (AADHAAR + DEGREE) — MANDATORY
========================================= */
router.post(
  "/upload-certificate",
  auth,
  uploadToS3("certificates").fields([
    { name: "aadhaar", maxCount: 1 },
    { name: "degree", maxCount: 1 }
  ]),
  async (req, res) => {
    try {
      const aadhaarFile = req.files?.aadhaar?.[0];
      const degreeFile = req.files?.degree?.[0];

      if (!aadhaarFile || !degreeFile) {
        return res.status(400).json({
          success: false,
          message: "Aadhaar card and Degree certificate are required"
        });
      }

      const user = await User.findById(req.user.id);
      if (!user) {
        return res.status(404).json({
          success: false,
          message: "User not found"
        });
      }

      // ✅ ENSURE OBJECTS EXIST
      if (!user.professionalVerification) {
        user.professionalVerification = {};
      }

      if (!user.professionalVerification.documents) {
        user.professionalVerification.documents = {};
      }

      // ✅ MERGE (DO NOT OVERWRITE)
      user.professionalVerification.documents.aadhaarUrl =
        aadhaarFile.location;

      user.professionalVerification.documents.degreeUrl =
        degreeFile.location;

      user.professionalVerification.applied = true;
      user.professionalVerification.status = "pending";

      await user.save();

      await sendAdminApplyMail(user);

      res.json({
        success: true,
        message: "Documents uploaded successfully. Verification pending."
      });
    } catch (err) {
      console.error("DOCUMENT UPLOAD ERROR:", err);
      res.status(500).json({
        success: false,
        message: "Server error"
      });
    }
  }
);


module.exports = router;
