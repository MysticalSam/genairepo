//import user model

const User = require('../models/user.model');

//JWT Provider

const jwtProvider = require('../config/jwtProvider');

//import bcrypt for password hashing

const bcrypt = require('bcrypt');
const saltRounds = 10;

//import jwt for token generation

const jwt = require('jsonwebtoken');

//Create a async function for user creation with accepting userData in try catch block 

const createUser = async (userData) => {
    try {
        let { firstName, lastName, email, password } = userData;
        //to check if the user already exists in the database
        const isUserExists = await User.findOne({ email });
        if (isUserExists) {
            throw new Error('Email already exists');
        }
        //hash password with bcrypt
        console.log(userData);
        password = await bcrypt.hash(password, saltRounds);
        //create a new user
        const user = await User.create({ firstName, lastName, email, password });
        console.log("created user is: ", user);
        return user;

    } catch (error) {
        console.log(error);
        throw new Error(error.message);
    }
}

//add a method for get user by id

const getUserById = async (userId) => {
    try {
        const user = await User.findById(userId);
        //if no user is found throw an error that user with this id is not found.
        if (!user) {
            throw new Error('User not found with this id: ', userId);
        }
        return user;

    } catch (error) {
        throw new Error(error.message);
    }
}

//add a method for get user by email

const getUserByEmail = async (email) => {
    try {
        const user = await User.findOne(email);
        //if no user is found throw an error that user with this email is not found.
        if (!user) {
            throw new Error('User not found with this email: ', email);
        }
        return user;

    } catch (error) {
        throw new Error(error.message);
    }
}

//Get User Profile by JWT Token

const getUserProfileByToken = async (token) => {
    try {
        //get user id from token
        const userId = jwtProvider.getUserIDFromToken(token);
        //find user by id
        const user = await getUserById(userId);
        //if no user is found throw an error that user with this id is not found.
        if (!user) {
            throw new Error('User not found with this id: ', userId);
        }
        //return user
        return user;

    } catch (error) {
        throw new Error(error.message);
    }
}


//export module with createUser, findUserById, findUserByEmail and getUserProfileByToken
module.exports = { createUser, getUserById, getUserByEmail, getUserProfileByToken }