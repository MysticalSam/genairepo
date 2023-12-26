//Require Dotenv
require('dotenv').config()

//import express
const express = require('express');

// import cookie parser
const cookieParser = require('cookie-parser');

//import cors
const cors = require('cors');

//create app via express
const app = express();

//middlewares

//use cors
app.use(cors({
    origin: process.env.CORS_ORIGIN,
    credentials: true
}))

// Use cookie parser
app.use(cookieParser())
//Use Json with limit of 16kb
app.use(express.json({ limit: "16kb" }))
//use URLencoded with limit of 16kb
app.use(express.urlencoded({ extended: true, limit: "16kb" }))
//use static folder
app.use(express.static("public"))

//Routes

const authRouter = require('./routes/auth.route');
app.use('/api/v1/auth', authRouter);

const userRouter = require('./routes/user.route');
app.use('/api/v1/users', userRouter);

const productRouter = require('./routes/product.route');
app.use('/api/v1/products', productRouter);

const cartRouter = require('./routes/cart.route');
app.use('/api/v1/cart', cartRouter);

const checkoutRouter = require('./routes/checkout.route');
app.use('/api/v1/checkout', checkoutRouter);

//export module app
module.exports = app;