//import mongoose schema

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

//create schema
const AddressSchema = new Schema({
    //add schema for user id which is an array and store mongoose schema object id with reference of user
    userId: [{
        type: ObjectId,
        ref: 'User'
    }],
    fistName: {
        type: String,
        trim: true,
        required: true
    },
    lastName: {
        type: String,
        trim: true,
        required: true
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
//create address schema with name addresses
const Address = mongoose.model('Address', AddressSchema);
//export module
module.exports = Address;