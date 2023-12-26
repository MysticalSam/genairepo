//import mongoose schema

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

//create schema
const OrderSchema = new Schema({

    orderNumber: {
        type: String,
        trim: true,
        required: true,
    },
    orderDate: {
        type: Date,
        trim: true,
        required: true,
        default: Date.now
    },
    userId: [{
        type: ObjectId,
        ref: 'User'
    }],
    orderItems: [{
        productId: {
            type: ObjectId,
            ref: 'Product',
        },
        name: {
            type: String,
            trim: true,
            required: true,
        },
        quantity: {
            type: Number,
            trim: true,
            required: true,
        },
        price: {
            type: Number,
            trim: true,
            required: true,
        },
        totalPrice: {
            type: Number,
            trim: true,
            required: true,
        },
    }],
    paymentDetails: [{
        mode: {
            type: String,
            trim: true,
            required: true,
        },
        paymentStatus: {
            type: String,
            trim: true,
            required: true,
        },
    }],
    shippingAddress: [{
        firstName: {
            type: String,
            trim: true,
            required: true,
        },
        lastName: {
            type: String,
            trim: true,
        },
        streetAddress: {
            type: String,
            trim: true,
            required: true,
        },
        city: {
            type: String,
            trim: true,
            required: true,
        },
        state: {
            type: String,
            trim: true,
            required: true,
        },
        pincode: {
            type: Number,
            trim: true,
            required: true,
        },
        mobile: {
            type: String,
            trim: true,
            required: true,
        }
    }],
    amount: {
        type: Number,
        trim: true,
        required: true,
    },
    status: {
        type: String,
        trim: true,
        required: true,
        default: "Pending"
    },
}, { timestamps: true })
//create Order schema
const Order = mongoose.model('Order', OrderSchema);
//export module
module.exports = Order;