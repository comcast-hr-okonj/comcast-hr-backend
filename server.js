const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

// In-memory storage (for now)
let applications = [];

/* -------------------------
   SUBMIT APPLICATION
--------------------------*/
app.post("/applications", (req, res) => {
  const newApp = {
    id: Date.now(),
    ...req.body,
    status: "Pending"
  };

  applications.push(newApp);

  res.json({
    success: true,
    message: "Application submitted successfully"
  });
});

/* -------------------------
   GET APPLICATIONS (ADMIN)
--------------------------*/
app.get("/applications", (req, res) => {
  res.json(applications);
});

/* -------------------------
   LOGIN
--------------------------*/
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "okonjortestimony2008@gmail.com" &&
    password === "09015159496"
  ) {
    res.json({
      token: "admin-token"
    });
  } else {
    res.json({
      error: "Invalid login"
    });
  }
});

/* -------------------------
   START SERVER
--------------------------*/
const PORT = process.env.PORT || 3000;

app.listen(PORT, () => {
  console.log(`🚀 HR Server running on port ${PORT}`);
});
