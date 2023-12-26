//import product model
const Product = require('../models/product.model');

//add a method for get product by id

const getProductById = async (productId) => {
    try {
        const product = await Product.findById(productId);
        //if no product is found throw an error that product with this id is not found.
        if (!product) {
            throw new Error('Product not found with this id: ', productId);
        }
        return product;

    } catch (error) {
        throw new Error(error.message);
    }
}

//add a method to get all products

const getAllProducts = async () => {
    try {
        const products = await Product.find();
        if (!products) {
            throw new Error('No Products Found');
        }
        return products;

    } catch (error) {
        throw new Error(error.message);
    }
}

//export modules
module.exports = { getProductById, getAllProducts }