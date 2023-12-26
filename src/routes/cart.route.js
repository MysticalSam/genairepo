const express = require('express');
const router = express.Router();
const cartController = require('../controllers/cart.controller');

router.get('/', cartController.getUserCart);
router.post('/add', cartController.addToCart);
router.post('/update', cartController.updateCart);

module.exports = router;