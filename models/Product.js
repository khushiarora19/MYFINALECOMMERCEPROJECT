const mongoose = require('mongoose');

const productSchema = new mongoose.Schema({
    name: {
        type: String,
        required: true,
    },
    price: {
        type: Number,
        required: true,
    },
    category: {
        type: String,
        required: true,
    },
    availability: {
        type: Boolean,
        required: true,
    },
    stock: {
        type: Number,
        required: true,
        default: 0,
    },
});

const Product = mongoose.model('Product', productSchema);
module.exports = Product;  // Ensure this line is correct
