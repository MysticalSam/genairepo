//import mongoose

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

//create new cart schema

const cartSchema = new Schema({
    //schema for user with mongoose object id
    userId: {
        type: ObjectId,
        ref: 'User',
        required: true
    },
    //array of cartItems with mongoose object id
    cartItems: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
            required: true
        },
        quantity: {
            type: Number,
            default: 1
        },
    }],
}, { timestamps: true })

//create cart model with name cart

const Cart = mongoose.model('Cart', cartSchema);

module.exports = Cart;