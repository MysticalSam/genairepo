// import cart model
const Cart = require("../models/cart.model");
const Product = require("../models/product.model");

//create cart function

const createCart = async (req, res) => {
    try {
        const { userId, productId, quantity } = req.body;

        const newCart = new Cart({
            userId,
            cartItems: [{
                productId,
                quantity
            }]
        });
        await newCart.save();
        res.status(201).json(newCart);
    } catch (error) {
        console.log(error);
        res.status(500).send("something went wrong");
    }
}

// create async function to find a user's cart

const findUserCart = async (userId) => {
    try {
        let cart = await Cart.findOne({ userId }).populate("products");
        // let totalPrice = 0;
        //calculate total price based on the quantity of each product in the cart
        // cart.products.forEach(product => {
        //     totalPrice += product.price * product.quantity;
        // })
        // cart.totalPrice = totalPrice;

        if (cart && cart.cartItems.length > 0) {
            return cart;
        }
        else {
            return null;
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

// create async function to add a product to a user's cart

const addToCart = async (userId, req) => {
    const { productId, quantity } = req.body;
    try {
        let cart = await Cart.findOne({ userId });
        const product = await Product.findById(req.productId);
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
                res.status(200).send({ message: "Item Added to Cart", cart });
            } else {
                cart.cartItems.push({ productId, quantity });
                await cart.save();
                res.status(200).send({ message: "New Item Added to Cart", cart });
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
            res.status(201).json(newCart);
        }
    } catch (error) {
        throw new Error(error.message);
    }
}

//export module with createCart, findUserCart and addToCart

module.exports = { createCart, findUserCart, addToCart }

