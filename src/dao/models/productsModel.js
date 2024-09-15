const mongoose = require('mongoose');
const paginate = require("mongoose-paginate-v2");

const productsColl="products"
const productsSchema = new mongoose.Schema({
    id: {
        type: Number,
        required: true,
    },
    title: {
        type: String,
        required: true,
        trim: true
    },
    description: {
        type: String,
        required: true,
        trim: true
    },
    code: {
        type: String,
        required: true,
        unique: true
    },
    price: {
        type: Number,
        required: true,
        min: [0, 'Price must be a positive number']
    },
    status: {
        type: Boolean,
        enum: [true, false],
        default: true
    },
    stock: {
        type: Number,
        required: true,
        min: [0, 'Stock cannot be negative']
    },
    category: {
        type: String,
        required: true,
        trim: true
    },
    thumbnails: {
        type: [String],
        default: []
    }
}, {
    timestamps: true,
    versionKey: false
});

// Plugin for pagination
productsSchema.plugin(paginate)


const productsModel=mongoose.model(
    productsColl,
    productsSchema
)

module.exports = productsModel