//create a category model schema with data

const mongoose = require('mongoose');
const ObjectId = mongoose.Schema.Types.ObjectId;
const Schema = mongoose.Schema;

const categorySchema = new Schema({
    name: {
        type: String,
        required: true,
        unique: true,
        maxlength: 50
    },
    slug: {
        type: String,
        required: true,
        unique: true
    },
    parentCategoryId: {
        type: ObjectId,
        ref: 'Category'
    },
    // level: {
    //     type: Number,
    //     required: true,
    // }
}, { timestamps: true })

//create category model with name categories

const Category = mongoose.model('Category', categorySchema);
module.exports = Category;