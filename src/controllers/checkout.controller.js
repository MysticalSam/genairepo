//import user model, utils, jwtProvider

const Cart = require('../models/cart.model');
const Product = require('../models/product.model');
const Checkout = require('../models/checkout.model');
const Order = require('../models/order.model');
const ApiError = require('../utils/ApiError');
const ApiResponse = require('../utils/ApiResponse');
const asyncHandler = require('../utils/asyncHandler');
const jwtProvider = require('../config/jwtProvider');

const checkout = asyncHandler(async (req, res) => {
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
    //Get Checkout Data
    const { paymentMode, firstName, lastName, streetAddress, city, state, pincode, mobile } = req.body;

    const cartItems = cart.cartItems;
    const totalAmount = cartItems.reduce((total, item) => {
        return total + item.quantity * item.productId.price;
    }, 0)

    // Create CheckoutData
    const checkoutData = {
        userId: userId,
        cartId: cart._id,
        paymentMode: paymentMode,
        amount: totalAmount,
        fistName: firstName,
        lastName: lastName,
        streetAddress: streetAddress,
        city: city,
        state: state,
        pincode: pincode,
        mobile: mobile,
    }

    const checkout = await Checkout.create(checkoutData);

    if (checkout) {
        //redirect to order creation
        const timestamp = new Date().getTime();
        const orderNumber = ("OD-" + (Math.floor(timestamp / 1000)))
        let totalPrice = 0;
        let orderItems = [];
        for (let i = 0; i < cartItems.length; i++) {
            totalPrice = Number(cartItems[i].quantity) * Number(cartItems[i].productId.price);
            orderItems.push({
                "productId": cartItems[i].productId._id,
                "name": cartItems[i].productId.name,
                "quantity": cartItems[i].quantity,
                "price": cartItems[i].productId.price,
                "totalPrice": totalPrice,
            });
        }

        // Create Order Data
        const orderData = {
            orderNumber: orderNumber,
            userId: userId,
            orderItems: orderItems,
            paymentDetails: [{
                mode: paymentMode,
                paymentStatus: "Pending"
            }],
            shippingAddress: [{
                firstName: firstName,
                lastName: lastName,
                streetAddress: streetAddress,
                city: city,
                state: state,
                pincode: pincode,
                mobile: mobile,
            }],
            amount: totalAmount,
        }

        const order = await Order.create(orderData);

        return res.status(200).json(
            new ApiResponse(200, order, "Success"))
    }
})

//export modules
module.exports = { checkout }