const jwt = require("jsonwebtoken");
require("dotenv").config();

const secretKey = process.env.JWT_KEY;

const authenticateJWT = (req, res, next) => {
  const openRoutes = [
    "/bludibs/api/manage/login",
    "/bludibs/v2/api/manage/addAdmin",
  ];

  if (openRoutes.includes(req.originalUrl)) {
    next();
    return;
  }

  const token = req.header("Authorization")?.split(" ")[1];

  if (!token) {
    return res
      .status(401)
      .json({ message: "Access denied. No token provided." });
  }

  try {
    const decoded = jwt.verify(token, secretKey);
    req.user = decoded;
    next();
  } catch (error) {
    res.status(400).json({ message: "Invalid token." });
  }
};

module.exports = authenticateJWT;
