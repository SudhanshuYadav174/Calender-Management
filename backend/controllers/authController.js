const bcrypt = require("bcryptjs");
const jwt = require("jsonwebtoken");
const User = require("../models/User");
const { sendMail } = require("../utils/mailer");

// Generate 6-digit OTP
function generateOTP() {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

exports.signup = async (req, res, next) => {
  try {
    const { name, email, password } = req.body;
    if (!name || !email || !password)
      return res.status(400).json({ message: "Missing fields" });

    let user = await User.findOne({ email });
    if (user) return res.status(400).json({ message: "User already exists" });

    const salt = await bcrypt.genSalt(10);
    const hashed = await bcrypt.hash(password, salt);

    // Generate OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000); // 10 minutes

    user = new User({
      name,
      email,
      password: hashed,
      isVerified: false,
      otp,
      otpExpiry,
    });
    await user.save();

    // Send OTP email
    const subject = "Verify Your Email - One Calendar";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Welcome to One Calendar!</h2>
        <p>Hi ${name},</p>
        <p>Thank you for signing up. Please verify your email address using the OTP below:</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="color: white; margin: 0; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
        </div>
        <p>This OTP is valid for 10 minutes.</p>
        <p>If you didn't create this account, please ignore this email.</p>
        <hr style="border: none; border-top: 1px solid #eee; margin: 20px 0;">
        <p style="color: #666; font-size: 12px;">One Calendar - Your Digital Event Manager</p>
      </div>
    `;

    await sendMail(email, subject, `Your OTP is: ${otp}`, html);

    res.json({
      message:
        "Signup successful. Please check your email for OTP verification.",
      email: email,
      requiresVerification: true,
    });
  } catch (err) {
    next(err);
  }
};

// Get all users (admin endpoint)
exports.getAllUsers = async (req, res, next) => {
  try {
    const users = await User.find()
      .select("-password -otp")
      .sort({ createdAt: -1 });
    res.json({
      count: users.length,
      users,
    });
  } catch (err) {
    next(err);
  }
};

exports.verifyOTP = async (req, res, next) => {
  try {
    const { email, otp } = req.body;
    if (!email || !otp)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    if (!user.otp || !user.otpExpiry)
      return res
        .status(400)
        .json({ message: "No OTP found. Please request a new one." });

    if (new Date() > user.otpExpiry)
      return res
        .status(400)
        .json({ message: "OTP expired. Please request a new one." });

    if (user.otp !== otp)
      return res.status(400).json({ message: "Invalid OTP" });

    // Verify user
    user.isVerified = true;
    user.otp = undefined;
    user.otpExpiry = undefined;
    await user.save();

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
      message: "Email verified successfully!",
    });
  } catch (err) {
    next(err);
  }
};

exports.resendOTP = async (req, res, next) => {
  try {
    const { email } = req.body;
    if (!email) return res.status(400).json({ message: "Email is required" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "User not found" });

    if (user.isVerified)
      return res.status(400).json({ message: "User already verified" });

    // Generate new OTP
    const otp = generateOTP();
    const otpExpiry = new Date(Date.now() + 10 * 60 * 1000);

    user.otp = otp;
    user.otpExpiry = otpExpiry;
    await user.save();

    // Send OTP email
    const subject = "New OTP - One Calendar";
    const html = `
      <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
        <h2 style="color: #7c3aed;">Email Verification</h2>
        <p>Hi ${user.name},</p>
        <p>Here is your new OTP to verify your email:</p>
        <div style="background: linear-gradient(135deg, #667eea 0%, #764ba2 100%); padding: 20px; text-align: center; border-radius: 10px; margin: 20px 0;">
          <h1 style="color: white; margin: 0; font-size: 36px; letter-spacing: 8px;">${otp}</h1>
        </div>
        <p>This OTP is valid for 10 minutes.</p>
      </div>
    `;

    await sendMail(email, subject, `Your OTP is: ${otp}`, html);

    res.json({ message: "New OTP sent to your email" });
  } catch (err) {
    next(err);
  }
};

exports.login = async (req, res, next) => {
  try {
    const { email, password } = req.body;
    if (!email || !password)
      return res.status(400).json({ message: "Missing fields" });

    const user = await User.findOne({ email });
    if (!user) return res.status(400).json({ message: "Invalid credentials" });

    if (!user.isVerified)
      return res.status(400).json({
        message: "Please verify your email first",
        requiresVerification: true,
        email: email,
      });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch)
      return res.status(400).json({ message: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, {
      expiresIn: "7d",
    });
    res.json({
      token,
      user: { id: user._id, name: user.name, email: user.email },
    });
  } catch (err) {
    next(err);
  }
};

exports.me = async (req, res, next) => {
  try {
    const user = await User.findById(req.user.id).select("-password");
    res.json(user);
  } catch (err) {
    next(err);
  }
};
