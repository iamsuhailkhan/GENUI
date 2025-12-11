const express = require("express");
const mongoose = require("mongoose");
const bcrypt = require("bcrypt");
const jwt = require("jsonwebtoken");
const cors = require("cors");
require("dotenv").config();

const app = express();
const PORT = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB Connection
mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log("MongoDB connected"))
  .catch((err) => console.error("MongoDB connection error:", err));

// User Schema
const userSchema = new mongoose.Schema({
  username: { type: String, required: true, unique: true },
  password: { type: String, required: true },
  history: [{ type: String }], // Array to store user activity history
});

const User = mongoose.model("User", userSchema);

// Routes
// Sign-Up
app.post("/api/signup", async (req, res) => {
  const { username, password } = req.body;
  try {
    const hashedPassword = await bcrypt.hash(password, 10);
    const newUser = new User({ username, password: hashedPassword });
    await newUser.save();
    res.status(201).json({ message: "User created successfully" });
  } catch (err) {
    res.status(500).json({ error: "Error creating user" });
  }
});

// Login
app.post("/api/login", async (req, res) => {
  const { username, password } = req.body;
  try {
    const user = await User.findOne({ username });
    if (!user) return res.status(404).json({ error: "User not found" });

    const isMatch = await bcrypt.compare(password, user.password);
    if (!isMatch) return res.status(401).json({ error: "Invalid credentials" });

    const token = jwt.sign({ id: user._id }, process.env.JWT_SECRET, { expiresIn: "1h" });
    res.json({ token, username: user.username });
  } catch (err) {
    res.status(500).json({ error: "Error logging in" });
  }
});

// Get User History
app.get("/api/history", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    res.json({ history: user.history });
  } catch (err) {
    res.status(500).json({ error: "Error fetching history" });
  }
});

// Add to History
app.post("/api/history", async (req, res) => {
  const token = req.headers.authorization?.split(" ")[1];
  if (!token) return res.status(401).json({ error: "Unauthorized" });

  try {
    const decoded = jwt.verify(token, process.env.JWT_SECRET);
    const user = await User.findById(decoded.id);
    user.history.push(req.body.activity);
    await user.save();
    res.json({ message: "Activity added to history" });
  } catch (err) {
    res.status(500).json({ error: "Error adding to history" });
  }
});

// Start Server
app.listen(PORT, () => console.log(`Server running on http://localhost:${PORT}`));