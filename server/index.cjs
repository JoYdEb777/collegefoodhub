import express from "express";
import bodyParser from "body-parser";
import mongoose from "mongoose";
import cors from "cors";
import axios from "axios";

const app = express();
app.use(cors());
app.use(bodyParser.json());

// MongoDB connection
mongoose.connect("mongodb://localhost:27017/collegefoodhub", {
  useNewUrlParser: true,
  useUnifiedTopology: true,
});

// Free SMS API configuration
const SMS_API_URL = "https://www.fast2sms.com/dev/bulkV2";
const SMS_API_KEY = "Em2SJp4TlKwVuNbD8FCWXkdQzoyaA6YIZqOU7RGiv3egMjPHshyJPlbp9WjXEqVehL6kMgwBRz7HdAFY"; // Replace with your Fast2SMS API key

// OTP storage (in-memory for simplicity; use Redis or database for production)
const otpStore = new Map();

// User schema
const userSchema = new mongoose.Schema({
  name: String,
  email: String,
  phone: String,
  password: String,
  createdAt: { type: Date, default: Date.now },
});

const User = mongoose.model("User", userSchema);

// Generate random OTP
const generateOtp = () => Math.floor(100000 + Math.random() * 900000).toString();

// Send OTP
app.post("/api/send-otp", async (req, res) => {
  const { phone } = req.body;

  if (!phone) {
    return res.status(400).json({ success: false, message: "Phone number is required" });
  }

  try {
    const otp = generateOtp();
    otpStore.set(phone, otp); // Store OTP temporarily

    // Send OTP via SMS API
    const response = await axios.post(
      SMS_API_URL,
      {
        route: "v3",
        sender_id: "TXTIND",
        message: `Your OTP for MessSathi is ${otp}. It is valid for 10 minutes.`,
        language: "english",
        numbers: phone,
      },
      {
        headers: {
          authorization: SMS_API_KEY,
        },
      }
    );

    if (response.data.return) {
      res.json({ success: true });
    } else {
      res.status(500).json({ success: false, message: "Failed to send OTP" });
    }
  } catch (error) {
    console.error("Error sending OTP:", error.message);
    res.status(500).json({ success: false, message: "Failed to send OTP" });
  }
});

// Verify OTP
app.post("/api/verify-otp", (req, res) => {
  const { phone, otp } = req.body;

  if (!phone || !otp) {
    return res.status(400).json({ success: false, message: "Phone number and OTP are required" });
  }

  const storedOtp = otpStore.get(phone);
  if (storedOtp === otp) {
    otpStore.delete(phone); // Remove OTP after successful verification
    res.json({ success: true });
  } else {
    res.status(400).json({ success: false, message: "Invalid OTP" });
  }
});

// Signup
app.post("/api/signup", async (req, res) => {
  const { name, email, phone, password } = req.body;

  try {
    const existingUser = await User.findOne({ phone });
    if (existingUser) {
      return res.status(400).json({ success: false, message: "User already exists" });
    }

    const newUser = new User({ name, email, phone, password });
    await newUser.save();

    res.json({ success: true });
  } catch (error) {
    res.status(500).json({ success: false, message: error.message });
  }
});

// Start server
app.listen(5000, () => {
  console.log("Server running on http://localhost:5000");
});
