const express = require("express");
const router = express.Router();
const {
  signup,
  login,
  me,
  verifyOTP,
  resendOTP,
  getAllUsers,
  forgotPassword,
  resetPassword,
} = require("../controllers/authController");
const auth = require("../middleware/auth");

router.post("/signup", signup);
router.post("/login", login);
router.post("/verify-otp", verifyOTP);
router.post("/resend-otp", resendOTP);
router.post("/forgot-password", forgotPassword);
router.post("/reset-password", resetPassword);
router.get("/me", auth, me);
router.get("/users", auth, getAllUsers);

module.exports = router;
