//import jwt provider from config
const jwtProvider = require('../config/jwtProvider');
const bcrypt = require('bcrypt');
const asyncHandler = require('../utils/asyncHandler');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const User = require('../models/user.model');

const login = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //if no user is found throw an error that user with this email is not found.
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await bcrypt.compare(password, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }

    //generate a simple 6 digit otp and send it to the user

    //generate a random 6 digit number
    const otp = await generateOTP(user._id)

    // generate otp secret with jwt
    const otpSecret = jwtProvider.generateOTPSecret(user._id, otp);

    return res.status(200).json(
        new ApiResponse(200, { otp, otpSecret }, "Enter this OTP")
    )
})

// Function to generate OTP and return OTP

const generateOTP = async (userId) => {

    try {
        // Generate a 6-digit OTP
        const otp = Math.floor(100000 + Math.random() * 900000)

        await User.findByIdAndUpdate(userId, {
            $set: {
                otp: otp,
                otpCreateTime: Date.now(),
            }
        });
        // Return the OTP
        return otp;

    } catch (error) {
        console.log(error);
        throw new ApiError(500, "Internal Server Error");
    }
}


// Function to validate OTP generated

const validateOTP = asyncHandler(async (req, res) => {
    const { otp } = req.body;

    const otpJWT = req.headers.authorization.split(" ")[1];
    if (!otpJWT) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }

    const userId = await jwtProvider.getUserIDFromOTPToken(otpJWT);
    const decodedOTP = await jwtProvider.verifyOTPSecret(otpJWT);

    const user = await User.findById(userId).select("-password");

    if (!user) {
        throw new ApiError(404, "User not found");
    }
    //user.otp !== otp ||

    if ((Number(otp) !== Number(decodedOTP)) && (Number(otp) !== Number(user.otp))) {
        throw new ApiError(401, "Invalid OTP");
    }

    // Check if OTP is within 5 minutes
    const otpCreatedTime = user.otpCreateTime;
    const currentTime = new Date();

    if (currentTime - otpCreatedTime > 5 * 60 * 1000) {
        throw new ApiError(401, "OTP Expired");
    }


    // Generate JWT
    const jwt = jwtProvider.generateToken(user);

    // Clear OTP
    user.otp = undefined;
    user.otpCreateTime = undefined;

    await user.save();

    const {accessToken, refreshToken} = await generateAccessAndRefereshTokens(user._id)

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken")

    const options = {
        httpOnly: true,
        secure: true
    }
    .cookie("accessToken", accessToken, options)
    .cookie("refreshToken", refreshToken, options)

    return res.status(200).json(
        new ApiResponse(200, { jwt, user }, "Login successful")
    )
})

// Change Password

const changePassword = asyncHandler(async (req, res) => {
    const { oldPassword, newPassword } = req.body;
    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    // const userId = await User.getUserIDFromToken(jwt);
    const userId = await jwtProvider.getUserIDFromToken(jwt);

    const user = await User.findById({ _id: userId });

    const isPasswordValid = await bcrypt.compare(oldPassword, user.password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }

    user.password = newPassword;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, { user }, "Password changed successfully")
    )
})

const logout = asyncHandler(async (req, res) => {
    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    const userId = await jwtProvider.getUserIDFromToken(jwt);
    const user = await User.findById(userId);
    user.token = undefined;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, { user }, "Logout successful")
    )
})

//export module with register and login
module.exports = { login, changePassword, validateOTP, logout }
