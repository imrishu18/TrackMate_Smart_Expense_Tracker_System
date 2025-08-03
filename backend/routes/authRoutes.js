const express = require("express");
const router = express.Router();
const { signupUser, loginUser } = require("../controller/authController");

// Route for signup
router.post("/signup", signupUser);

// Route for login
router.post("/login", loginUser);

module.exports = router;
