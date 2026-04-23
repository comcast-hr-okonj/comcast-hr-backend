const express = require("express");
const cors = require("cors");

const app = express();

app.use(cors({
  origin: "*"
}));

app.use(express.json());

let applications = [];

// SUBMIT APPLICATION
app.post("/applications", (req, res) => {
  applications.push({
    id: Date.now(),
    ...req.body,
    status: "Pending"
  });

  res.json({ success: true });
});

// LOGIN (simple demo)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (email === "admin@comcast.com" && password === "1234") {
    res.json({ token: "admin-token" });
  } else {
    res.json({ error: "Invalid login" });
  }
});

// GET APPLICATIONS
app.get("/applications", (req, res) => {
  res.json(applications);
});

app.listen(3000, () => {
  console.log("Server running on port 3000");
});
