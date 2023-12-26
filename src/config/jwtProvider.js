//require jwttoken
const jwt = require("jsonwebtoken");

//generate token with user

const generateToken = (user) => {
    const { _id, firstName, email } = user;
    const token = jwt.sign({ _id, firstName, email }, process.env.JWT_SECRET_KEY, {
        expiresIn: process.env.JWT_TOKEN_EXPIRY,
    });
    return token;
}

//Get User ID from Token

const getUserIDFromToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_SECRET_KEY);
    return decoded._id;
}

const generateOTPSecret = (_id, otp) => {
    const token = jwt.sign({ _id, otp }, process.env.JWT_OTP_SECRET_KEY, {
        expiresIn: process.env.JWT_OTP_TOKEN_EXPIRY,
    })
    return token;
}

const verifyOTPSecret = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_OTP_SECRET_KEY);
    return decoded.otp;
}

const getUserIDFromOTPToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_OTP_SECRET_KEY);
    return decoded._id;
}

const generateResetPasswordToken = (user) => {
    const { _id, email } = user;
    const token = jwt.sign({ _id, email }, process.env.JWT_RESET_SECRET_KEY, {
        expiresIn: process.env.JWT_RESET_TOKEN_EXPIRY,
    })
    return token;
}

const verifyResetPasswordToken = (token) => {
    const decoded = jwt.verify(token, process.env.JWT_RESET_SECRET_KEY);
    return decoded._id;
}

//export module with generateToken and getUserIDFromToken

module.exports = { generateToken, getUserIDFromToken, generateOTPSecret, verifyOTPSecret, getUserIDFromOTPToken, generateResetPasswordToken, verifyResetPasswordToken }