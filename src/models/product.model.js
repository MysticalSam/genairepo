//import mongoose

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

//Add product schema

const productSchema = new Schema({
    name: {
        type: String,
        trim: true,
        required: true
    },
    slug: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    sku: {
        type: String,
        trim: true,
        required: true,
        unique: true,
    },
    price: {
        amount: {
            type: Number,
            trim: true,
            required: true
        },
        currency: {
            type: String,
            trim: true,
            required: true,
            default: 'INR'
        },
    },
    description: {
        type: String,
        trim: true,
        required: true
    },
    category: {
        type: ObjectId,
        required: true,
        ref: 'Category'
    },
    images: [{
        urls: {
            large: {
                type: String,
                trim: true,
            },
            medium: {
                type: String,
                trim: true,
            },
            thumb: {
                type: String,
                trim: true,
            },
        },
        isCover: Boolean,
    }],
    ratings: [{
        userId: {
            type: ObjectId,
            ref: 'User',
        },
        rating: {
            type: Number,
        },
    }],
    reviews: [{
        userId: {
            type: ObjectId,
            ref: 'User',
        },
        review: {
            title: {
                type: String,
                trim: true,
            },
            description: {
                type: String,
                trim: true,
            },
        },
    }],
    options: {

    },
}, { timestamps: true })

//Create model with name products

const Product = mongoose.model('Product', productSchema);

module.exports = Product;