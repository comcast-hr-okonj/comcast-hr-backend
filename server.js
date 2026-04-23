const express = require("express");
const cors = require("cors");
const sqlite3 = require("sqlite3").verbose();
const jwt = require("jsonwebtoken");

const app = express();
app.use(cors());
app.use(express.json());

const SECRET = "comcast_secret_key";

// DB
const db = new sqlite3.Database("./hr.db");

// CREATE TABLE
db.run(`
CREATE TABLE IF NOT EXISTS applications (
  id INTEGER PRIMARY KEY AUTOINCREMENT,
  name TEXT,
  email TEXT,
  number TEXT,
  position TEXT,
  status TEXT DEFAULT 'Pending'
)
`);

// SIMPLE ADMIN LOGIN (HARD CODED)
app.post("/login", (req, res) => {
  const { email, password } = req.body;

  if (
    email === "okonjortestimony2008@gmail.com" &&
    password === "09015159496"
  ) {
    const token = jwt.sign({ role: "admin" }, SECRET);
    return res.json({ token });
  }

  res.status(401).json({ error: "Wrong credentials" });
});

// AUTH MIDDLEWARE
function auth(req, res, next) {
  const token = req.headers.authorization;

  if (!token) return res.status(403).json({ error: "No token" });

  try {
    jwt.verify(token, SECRET);
    next();
  } catch {
    res.status(403).json({ error: "Invalid token" });
  }
}

// SUBMIT APPLICATION
app.post("/applications", (req, res) => {
  const { name, email, number, position } = req.body;

  db.run(
    "INSERT INTO applications (name, email, number, position) VALUES (?, ?, ?, ?)",
    [name, email, number, position],
    function () {
      res.json({ success: true });
    }
  );
});

// GET APPLICATIONS
app.get("/applications", auth, (req, res) => {
  db.all("SELECT * FROM applications", (err, rows) => {
    res.json(rows);
  });
});

// UPDATE STATUS
app.put("/applications/:id/status", auth, (req, res) => {
  const { status } = req.body;

  db.run(
    "UPDATE applications SET status=? WHERE id=?",
    [status, req.params.id],
    () => res.json({ success: true })
  );
});

// DELETE
app.delete("/applications/:id", auth, (req, res) => {
  db.run(
    "DELETE FROM applications WHERE id=?",
    [req.params.id],
    () => res.json({ success: true })
  );
});

// STATS (SaaS dashboard cards)
app.get("/stats", auth, (req, res) => {
  db.all("SELECT status FROM applications", (err, rows) => {
    res.json({
      total: rows.length,
      pending: rows.filter(r => r.status === "Pending").length,
      approved: rows.filter(r => r.status === "Approved").length,
      rejected: rows.filter(r => r.status === "Rejected").length
    });
  });
});

app.listen(3000, () => console.log("Server running on port 3000"));
