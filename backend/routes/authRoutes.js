const express = require("express");
const { register, login } = require("../controllers/authController");
const ExpressBrute = require("express-brute");
const router = express.Router();

// Set up Express Brute
const store = new ExpressBrute.MemoryStore();
const bruteForceMiddleware = new ExpressBrute(store, {
  freeRetries: 5,
  minWait: 1 * 60 * 1000,
  maxWait: 15 * 60 * 1000,
});

// Apply brute-force protection only on the login route
router.post("/register", register);
router.post("/login", bruteForceMiddleware.prevent, login);

module.exports = router;
