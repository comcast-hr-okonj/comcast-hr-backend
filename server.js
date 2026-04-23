const express = require("express");
const cors = require("cors");
const jwt = require("jsonwebtoken");

const app = express();

app.use(cors({ origin: "*" }));
app.use(express.json());

/* -----------------------------
   SIMPLE IN-MEMORY DATABASE
------------------------------*/
let applications = [];

/* -----------------------------
   SECRET KEY (JWT)
------------------------------*/
const JWT_SECRET = "comcast_hr_secret_key_2026";

/* -----------------------------
   APPLY FOR JOB
------------------------------*/
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  if (!name || !email || !number || !position) {
    return res.json({ success: false, message: "All fields required" });
  }

  const newApp = {
    id: Date.now(),
    name,
    email,
    number,
    position,
    status: "Pending"
  };

  applications.push(newApp);

  res.json({ success: true, message: "Application submitted" });
});

/* -----------------------------
   GET APPLICATIONS (ADMIN ONLY)
------------------------------*/
app.get("/applications", (req, res) => {
  const token = req.headers.authorization;

  if (!token) {
    return res.status(401).json({ error: "No token provided" });
  }

  try {
    jwt.verify(token, JWT_SECRET);
    res.json(applications);
  } catch (err) {
    res.status(403).json({ error: "Invalid token" });
  }
});

/* -----------------------------
   LOGIN (ADMIN)
------------------------------*/
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  // YOUR LOGIN DETAILS
  if (
    email === "okonjortestimony2008@gmail.com" &&
    password === "09015159496"
  ) {
    const token = jwt.sign(
      { email },
      JWT_SECRET,
      { expiresIn: "2h" }
    );

    return res.json({
      success: true,
      token
    });
  }

  res.json({ success: false, message: "Invalid login" });
});

/* -----------------------------
   SERVER START
------------------------------*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 Comcast HR Backend running on port ${PORT}`);
});
