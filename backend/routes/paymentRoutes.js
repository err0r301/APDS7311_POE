const express = require("express");
const {
  createPayment,
  getUserPayments,
  verifyPayment,
  revertPayment,
  submitPayment,
} = require("../controllers/paymentController.js");
const { authMiddleware } = require("../middleware/authMiddleware.js");

const router = express.Router();

router.post("/payments", authMiddleware, createPayment);
router.get("/payments", authMiddleware, getUserPayments);
router.patch("/payments/verify/:paymentId", authMiddleware, verifyPayment);
router.patch("/payments/revert/:paymentId", authMiddleware, revertPayment);
router.patch("/payments/submit/:paymentId", authMiddleware, submitPayment);

module.exports = router;
