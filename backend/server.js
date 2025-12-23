const express = require("express");
const mongoose = require("mongoose");
const cors = require("cors");

const app = express();
app.use(cors());
app.use(express.json());

// 🔗 MongoDB connection
mongoose.connect("mongodb://127.0.0.1:27017/raale", {
  useNewUrlParser: true,
  useUnifiedTopology: true
});

// 👤 Student Schema
const StudentSchema = new mongoose.Schema({
  name: String,
  email: String,
  coins: Number,
  level: Number
});

const Student = mongoose.model("Student", StudentSchema);

// 🌱 Create default student (run once)
app.post("/init", async (req, res) => {
  const existing = await Student.findOne({ email: req.body.email });
  if (existing) return res.json(existing);

  const student = await Student.create({
    name: req.body.name,
    email: req.body.email,
    coins: 0,
    level: 1
  });

  res.json(student);
});

// 📊 Get student data
app.get("/student", async (req, res) => {
  const student = await Student.findOne();
  res.json(student);
});

// ➕ Update coins
app.post("/coins", async (req, res) => {
  const { amount } = req.body;
  const student = await Student.findOne();

  student.coins += amount;

  if (student.coins >= student.level * 100) {
    student.level += 1;
  }

  await student.save();
  res.json(student);
});

// 🏆 Leaderboard
app.get("/leaderboard", async (req, res) => {
  const students = await Student.find().sort({ coins: -1 });
  res.json(students);
});

app.listen(5000, () => {
  console.log("✅ Backend running on http://localhost:5000");
});
