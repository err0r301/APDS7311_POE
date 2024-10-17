const express = require('express');
const { createPayment, getUserPayments } = require('../controllers/paymentController.js'); 
const { authMiddleware } = require('../middleware/authMiddleware.js');  

const router = express.Router();  
  
router.post('/payments', authMiddleware, createPayment);  
 
router.get('/payments', authMiddleware, getUserPayments);  

module.exports = router;