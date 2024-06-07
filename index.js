const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
const multer = require("multer");
const upload = multer();
require("dotenv").config();
require("./connection/DB");
const authenticateJWT = require("./middleware/auth");

// CORS Configuration
const allowedOrigins = process.env.ALLOWED_ORIGINS ? process.env.ALLOWED_ORIGINS.split(",") : ["https://dashboard.bluedibs.com"];
app.use(cors({
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error("Not allowed by CORS"));
    }
  },
  methods: ["GET", "POST", "PUT", "DELETE"],
  allowedHeaders: ["Content-Type", "Authorization"]
}));

// Other middleware configurations
app.use(upload.any());
app.use(bodyParser.text({ type: "/" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Route configurations
app.use("", authenticateJWT, require("./route/adminData.route"));
app.use("", authenticateJWT, require("./route/newsletter.route"));

const PORT = process.env.PORT || 3000; // Use a default port if PORT is not defined

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
