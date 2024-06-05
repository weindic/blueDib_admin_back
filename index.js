const express = require("express");
const cors = require("cors");
const app = express();
const bodyParser = require("body-parser");
require("./connection/DB");
require("dotenv").config();
const multer = require("multer");
const upload = multer();
const authenticateJWT = require("./middleware/auth");

app.use(cors()); // Enable CORS for all routes

// Other middleware configurations
app.use(upload.any());
app.use(bodyParser.text({ type: "/" }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your existing route configurations
app.use("", authenticateJWT, require("./route/adminData.route"));
app.use("", authenticateJWT, require("./route/newsletter.route"));

const PORT = process.env.PORT || 3000; // Use a default port if PORT is not defined

app.listen(PORT, () => {
  console.log(`Backend running on ${PORT}`);
});
