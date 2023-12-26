//import mongoose schema

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

//create schema
const CheckoutSchema = new Schema({
    //add schema for user id which is an array and store mongoose schema object id with reference of user
    userId: [{
        type: ObjectId,
        ref: 'User'
    }],
    cartId: [{
        type: ObjectId,
        ref: 'Cart'
    }],
    paymentMode: {
        type: String,
        required: true
    },
    amount: {
        type: Number,
        required: true
    },
    fistName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
    },
    streetAddress: {
        type: String,
        trim: true,
        required: true
    },
    city: {
        type: String,
        trim: true,
        required: true
    },
    state: {
        type: String,
        trim: true,
        required: true
    },
    pincode: {
        type: Number,
        trim: true,
        required: true
    },
    mobile: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true })
//create Checkout schema
const Checkout = mongoose.model('Checkout', CheckoutSchema);
//export module
module.exports = Checkout;