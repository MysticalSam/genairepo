const express = require('express');
const router = express.Router();
const { registerUser, getUserProfileFromToken, getAllUsers } = require('../controllers/user.controller');

router.post('/register', registerUser);
router.get('/profile', getUserProfileFromToken);
router.get('/', getAllUsers);

module.exports = router;