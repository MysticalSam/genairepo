//import user model, utils, jwtProvider

const User = require('../models/user.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwtProvider = require('../config/jwtProvider');
const bcrypt = require('bcrypt');

//Create a async function for user creation with accepting userData in try catch block 

const registerUser = asyncHandler(async (req, res) => {
    const { firstName, lastName, email, password } = req.body;
    // Check if all fields are provided
    if (
        [firstName, email, password].some((field) => field?.trim() === "")
    ) {
        throw new ApiError(400, "Please fill required fields")
    }

    //to check if the user already exists in the database
    const isUserExists = await User.findOne({ email });
    if (isUserExists) {
        throw new ApiError(409, "User with email already exists")
    }
    //create a new user
    const user = await User.create({ firstName, lastName, email, password });

    const createdUser = await User.findById(user._id).select("-password");

    if (!createdUser) {
        throw new ApiError(500, "Something went wrong while registering the user")
    }

    return res.status(201).json(
        new ApiResponse(200, createdUser, "User Registered Successfully")
    )
})

const loginUser = asyncHandler(async (req, res) => {
    const { email, password } = req.body;

    const user = await User.findOne({ email });

    //if no user is found throw an error that user with this email is not found.
    if (!user) {
        throw new ApiError(404, "User not found");
    }

    const isPasswordValid = await user.isPasswordCorrect(password);

    if (!isPasswordValid) {
        throw new ApiError(401, "Invalid Password");
    }

    //generate a simple 6 digit otp and send it to the user

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

    if ((Number(otp) !== Number(decodedOTP)) && (Number(otp) !== Number(user.otp))) {
        throw new ApiError(401, "Invalid OTP");
    }

    // Check if OTP is within 5 minutes
    const otpCreatedTime = user.otpCreateTime;
    const currentTime = new Date();

    if (currentTime - otpCreatedTime > 5 * 60 * 1000) {
        throw new ApiError(401, "OTP Expired");
    }

    // Clear OTP
    user.otp = undefined;
    user.otpCreateTime = undefined;

    await user.save();

    const { accessToken, refreshToken } = await generateTokens(user._id);

    const loggedInUser = await User.findById(user._id).select("-password -refreshToken");

    const cookieOptions = {
        httpOnly: true,
        secure: true,
    }
    return res
        .status(200)
        .cookie("accessToken", accessToken, cookieOptions)
        .cookie("refreshToken", refreshToken, cookieOptions)
        .json(
            new ApiResponse(
                200,
                {
                    user: loggedInUser, accessToken, refreshToken
                },
                "User logged in successfully"
            )
        )
})

// Logout User

const logoutUser = asyncHandler(async (req, res) => {
    await User.findByIdAndUpdate(
        req.user._id,
        {
            $set: {
                refreshToken: undefined
            }
        },
        {
            new: true
        }
    )

    const cookieOptions = {
        httpOnly: true,
        secure: true
    }
    return res
        .status(200)
        .clearCookie("accessToken", cookieOptions)
        .clearCookie("refreshToken", cookieOptions)
        .json(new ApiResponse(200, {}, "User logged Out"))
})

// Change User Password

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

//add a method for get user by id

const getUserById = asyncHandler(async (req, res) => {

    const user = await User.findById(req.body._id).select("-password -refreshToken");
    //if no user is found throw an error that user with this id is not found.
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, user, "Success")
    )
})

//add a method for get user by email

const getUserByEmail = asyncHandler(async (req, res) => {

    const user = await User.findOne({ email: req.body.email }).select("-password -refreshToken");
    //if no user is found throw an error that user with this email is not found.
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, user, "Success")
    )
})
const getUserProfileFromToken = asyncHandler(async (req, res) => {

    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    // const userId = await User.getUserIDFromToken(jwt);
    const userId = await jwtProvider.getUserIDFromToken(jwt);
    const user = await User.findById(userId).select("-password -refreshToken");
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    return res.status(200).json(
        new ApiResponse(200, user, "Success")
    )

})

const getCurrentUser = asyncHandler(async (req, res) => {
    return res
        .status(200)
        .json(new ApiResponse(
            200,
            req.user,
            "User fetched successfully"
        ))
})

const getAllUsers = asyncHandler(async (req, res) => {
    const users = await User.find().select("-password -refreshToken");
    if (!users) {
        throw new ApiError(204, "No Users found");
    }
    return res.status(200).json(
        new ApiResponse(200, users, "Success")
    )
})

const generateTokens = async (userId) => {
    try {
        const user = await User.findById(userId)
        const accessToken = user.generateAccessToken()
        const refreshToken = user.generateRefreshToken()

        user.refreshToken = refreshToken
        await user.save({ validateBeforeSave: false })

        return { accessToken, refreshToken }


    } catch (error) {
        throw new ApiError(500, "Something went wrong while generating tokens")
    }
}

// Reset Password Request and Generate Email Token

const resetPassword = asyncHandler(async (req, res) => {

    const user = await User.findOne({ email: req.body.email }).select("-password -refreshToken");
    //if no user is found throw an error that user with this email is not found.
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    const token = await jwtProvider.generateResetPasswordToken(user);
    const resetPasswordLink = `XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX${token}`;
    const mailOptions = {
        from: "XXXXXXXXXXXXXXXXXXXXXXXXXXXXXXX",
        to: user.email,
        subject: "Reset Password Link",
        text: `Please click on the following link to reset your password: ${resetPasswordLink}`,
        html: `<p>Please click on the following link to reset your password: <a href="${resetPasswordLink}">${resetPasswordLink}</a></p>`,
    }
    // await sendMail(mailOptions);
    console.log(token)
    return res.status(200).json(
        new ApiResponse(200, { token }, "Success")
    )
})

const verifyResetPasswordToken = asyncHandler(async (req, res) => {
    const { newPassword } = req.body;
    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    const decoded = await jwtProvider.verifyResetPasswordToken(jwt);
    if (!decoded) {
        throw new ApiError(401, "Token Error");
    }
    console.log(decoded)
    const user = await User.findById(decoded);
    if (!user) {
        throw new ApiError(404, "User not found");
    }
    user.password = newPassword;
    await user.save();

    return res.status(200).json(
        new ApiResponse(200, {}, "Password Reset Successfully")
    )
})

module.exports = {
    registerUser,
    loginUser,
    logoutUser,
    changePassword,
    getCurrentUser,
    getUserById,
    getUserByEmail,
    getUserProfileFromToken,
    getAllUsers,
    validateOTP,
    resetPassword,
    verifyResetPasswordToken
}