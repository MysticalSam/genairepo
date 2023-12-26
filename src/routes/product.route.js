const express = require('express');
const router = express.Router();
const productController = require('../controllers/product.controller');

router.get('/all', productController.getAllProducts);
router.get('/id/:id', productController.getProductById);

// Route to add all products from file to db
router.get('/add', productController.addProducts);

module.exports = router;