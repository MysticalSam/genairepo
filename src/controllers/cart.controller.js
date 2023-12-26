//import user model, utils, jwtProvider

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwtProvider = require('../config/jwtProvider');

const getUserCart = asyncHandler(async (req, res) => {
    if (req.headers.authorization == undefined) {
        throw new ApiError(401, "Unauthorized! Token Required");
    }
    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    const userId = await jwtProvider.getUserIDFromToken(jwt);

    const cart = await Cart.findOne({ userId }).populate("cartItems.productId");
    if (!cart) {
        throw new ApiError(404, "Cart not found");
    }
    return res.status(200).json(
        new ApiResponse(200, cart, "Success"))
})

const addToCart = asyncHandler(async (req, res) => {

    if (req.headers.authorization == undefined) {
        throw new ApiError(401, "Unauthorized! Token Required");
    }
    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    const userId = await jwtProvider.getUserIDFromToken(jwt);

    const productId = req.body.productId;
    const quantity = Number(req.body.quantity);
    let cart = await Cart.findOne({ userId });
    const product = await Product.findById(productId);
    if (!product) {
        throw new Error("Product not found");
    }
    //If cart already exists for user,
    if (cart) {
        const productIndex = cart.cartItems.findIndex((product) => product.productId == productId);
        //check if product exists or not
        if (productIndex > -1) {
            let productItem = cart.cartItems[productIndex];
            productItem.quantity += quantity;
            cart.cartItems[productIndex] = productItem;
            await cart.save();
            res.status(200).json(
                new ApiResponse(200, cart, "Item Added to Cart"));
        } else {
            cart.cartItems.push({ productId, quantity });
            await cart.save();
            res.status(200).json(
                new ApiResponse(200, cart, "New Item Added to Cart"));
        }
    }
    else {
        //no cart exists, create one
        const newCart = new Cart({
            userId,
            cartItems: [{
                productId,
                quantity
            }]
        });
        await newCart.save();
        res.status(201).json(new ApiResponse(201, newCart, "Cart Created, Item Added to Cart"));
    }
})

const updateCart = asyncHandler(async (req, res) => {

    if (req.headers.authorization == undefined) {
        throw new ApiError(401, "Unauthorized! Token Required");
    }
    const jwt = req.headers.authorization.split(" ")[1];
    if (!jwt) {
        throw new ApiError(401, "Unauthorized! Token Not Found");
    }
    const userId = await jwtProvider.getUserIDFromToken(jwt);

    const cartId = req.body._id;
    const productId = req.body.productId;
    const quantity = Number(req.body.quantity);

    let cart = await Cart.findById(cartId);

    const product = await Product.findById(productId);

    if (!product) {
        throw new Error("Product not found");
    }
    //If cart already exists for user,
    if (cart) {
        const productIndex = cart.cartItems.findIndex((product) => product.productId == productId);
        //check if product exists or not
        if (productIndex > -1) {
            let productItem = cart.cartItems[productIndex];
            productItem.quantity = quantity;
            cart.cartItems[productIndex] = productItem;
            if (quantity == 0) {
                cart.cartItems.splice(productIndex, 1);
            }
            await cart.save();
            res.status(200).json(
                new ApiResponse(200, cart, "Item Updated in Cart"));
        } else {
            cart.cartItems.push({ productId, quantity });
            await cart.save();
            res.status(200).json(
                new ApiResponse(200, cart, "New Item Added to Cart"));
        }
        // }
    }
    else {
        throw new ApiError(404, "Cart not found");
    }
})

//export modules
module.exports = { getUserCart, addToCart, updateCart }