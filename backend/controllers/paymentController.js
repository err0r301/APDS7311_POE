const Payment = require("../models/payment.js");
const mongoose = require("mongoose");

module.exports.createPayment = async (req, res) => {
  try {
    const { amount, currency, provider, recipientAccount, swiftCode } =
      req.body;

    // input validation
    if (!amount) {
      return res.status(400).json({ message: "Amount is required" });
    }

    if (!currency) {
      return res.status(400).json({ message: "Currency is required" });
    }

    if (!provider) {
      return res.status(400).json({ message: "Provider is required" });
    }

    if (!recipientAccount) {
      return res.status(400).json({ message: "Account number is required" });
    }

    if (!swiftCode) {
      return res.status(400).json({ message: "Swift code is required" });
    }

    // Create a new payment object
    const payment = new Payment({
      userId: req.user.userId,
      amount,
      currency,
      provider,
      accountInfo: {
        recipientAccount,
        swiftCode,
      },
    });

    // Save to the database
    await payment.save();

    return res
      .status(201)
      .json({ message: "Payment created successfully", payment });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

// Get all payments for a user
module.exports.getUserPayments = async (req, res) => {
  try {
    const payments = await Payment.find();
    return res.json(payments);
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.verifyPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status = "Verified";
    await payment.save();
    return res.json({ message: "Payment verified successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.revertPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status = "Pending";
    await payment.save();
    return res.json({ message: "Payment reverted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};

module.exports.submitPayment = async (req, res) => {
  try {
    const { paymentId } = req.params;
    const payment = await Payment.findById(paymentId);
    if (!payment) {
      return res.status(404).json({ message: "Payment not found" });
    }
    payment.status = "Submitted";
    await payment.save();
    return res.json({ message: "Payment submitted successfully" });
  } catch (error) {
    console.error(error);
    return res.status(500).json({ message: "Server error" });
  }
};
