//import mongoose schema

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

//create schema
const PaymentSchema = new Schema({

    checkoutId: [{
        type: ObjectId,
        ref: 'Checkout'
    }],
    mode: {
        type: String,
        trim: true,
        required: true
    },
    amount: {
        type: Number,
        trim: true,
        required: true
    },
    name: {
        type: String,
        trim: true,
        required: true
    },
    status: {
        type: String,
        trim: true,
        required: true
    },
}, { timestamps: true })
//create Payment schema
const Payment = mongoose.model('Payment', PaymentSchema);
//export module
module.exports = Payment;