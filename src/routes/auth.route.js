const express = require('express');
const router = express.Router();
const { verifyJWT } = require('../middlewares/auth.middleware');
const { registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser,
    getUserById,
    getUserByEmail,
    getUserProfileFromToken,
    getAllUsers,
    validateOTP,
    verifyResetPasswordToken,
    resetPassword
} = require('../controllers/user.controller');

router.post('/login', loginUser);
router.post('/otp-verify', validateOTP);
router.post('/reset-password', resetPassword);
router.post('/verify', verifyResetPasswordToken);

// Secured Routes
router.route('/change-password').post(verifyJWT, changePassword);
router.route('/profile').post(verifyJWT, getCurrentUser);
router.route('/logout').post(verifyJWT, logoutUser);

module.exports = router;
