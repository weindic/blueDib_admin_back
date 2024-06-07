const express = require('express');
const cors = require('cors');
const app = express();
const bodyParser = require('body-parser');
const multer = require('multer');
const upload = multer();
const authenticateJWT = require('./middleware/auth');

require('./connection/DB');
require('dotenv').config();

// Enable CORS for all routes
app.use(cors({
  origin: true,  // allows all origins
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // allows all methods
  allowedHeaders: ['Content-Type', 'Authorization'], // allows specific headers
}));

// Other middleware configurations
app.use(upload.any());
app.use(bodyParser.text({ type: '/' }));
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Your existing route configurations
app.use('', authenticateJWT, require('./route/adminData.route'));

const PORT = process.env.PORT || 3000; // Use a default port if PORT is not defined

app.listen(PORT, () => {
  console.log(`Backend running on port ${PORT}`);
});
