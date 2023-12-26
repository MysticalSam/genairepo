const Product = require("../models/product.model");
const asyncHandler = require("../utils/asyncHandler");
const ApiError = require("../utils/ApiError");
const ApiResponse = require("../utils/ApiResponse");

const getAllProducts = asyncHandler(async (req, res) => {

    const products = await Product.find({});

    if (!products) {
        throw new ApiError(404, "No products found");
    }
    if (!(products.length) > 0) {
        return res.status(204).json(
            new ApiResponse(204, "", "No Products Found")
        )
    }
    return res.status(200).json(
        new ApiResponse(200, products, "Success")
    )
})

// Write a function getProductById to get products via id
const getProductById = asyncHandler(async (req, res) => {

    const product = await Product.findById(req.params.id);
    if (!product) {
        throw new ApiError(404, "Product not found");
    }
    return res.status(200).json(
        new ApiResponse(200, product, "Success")
    )
})

/////////////////////////////////////////////////////////////////////////////////////////

// Add Dummy Products to Database from JSON file

const addProducts = asyncHandler(async (req, res) => {
    const checkProducts = await Product.exists({ name: "Mens Cotton Jacket" })

    if (checkProducts) {
        throw new ApiError(400, "Products Already Exist");
    }
    const productsData = require('../config/db.products')
    const response = await Product.insertMany(productsData)
    if (!response) {
        throw new ApiError(500, "Something Went Wrong While Adding Products");
    }
    return res.status(201).json(
        new ApiResponse(200, response, "Success")
    )
})

//export modules
module.exports = { getAllProducts, addProducts, getProductById }