const express = require('express');
const { getAllProducts } = require('../controllers/productController');
const { authenticate } = require('../middleware/authMiddleware'); // Middleware for authentication

const router = express.Router();

// Define the GET endpoint
router.get('/', authenticate, getAllProducts); // Use authentication middleware

module.exports = router;
