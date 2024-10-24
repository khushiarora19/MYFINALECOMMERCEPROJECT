const mongoose = require('mongoose');

// Define the order schema
const orderSchema = new mongoose.Schema({
    customerName: {
        type: String,
        required: true,
    },
    products: [{
        productId: {
            type: mongoose.Schema.Types.ObjectId,
            ref: 'Product', // Reference to the Product model
            required: true,
        },
        quantity: {
            type: Number,
            required: true,
            min: 1,
        },
    }],
    totalAmount: {
        type: Number,
        required: true,
    },
}, { timestamps: true }); // Automatically adds createdAt and updatedAt timestamps

// Export the Order model
module.exports = mongoose.model('Order', orderSchema);
