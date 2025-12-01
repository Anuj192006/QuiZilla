const express = require("express");
const cors = require("cors");
const dotenv = require("dotenv");

dotenv.config();

const authRoutes = require("./routes/authRoutes.js");
const orgRoutes = require("./routes/dashRoutes.js");

const app = express();
app.use(cors());
app.use(express.json());

// main route
app.get("/", (req, res) => {
  res.send("QuiZilla Backend is Live 🚀");
});

// auth routes
app.use("/api/auth", authRoutes);
app.use("/api/orgs", orgRoutes);

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log("Server running on http://localhost:" + PORT);
});
