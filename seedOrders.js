const mongoose = require('mongoose');
const Product = require('./models/Product'); // Import your Product model
const Order = require('./models/Order'); // Import your Order model

async function seedOrders() {
    try {
        await mongoose.connect('mongodb+srv://khushi:hareKrishna1920_@cluster0.jhq56.mongodb.net/EcommerceDB', {
            useNewUrlParser: true,
            useUnifiedTopology: true,
        });

        // Fetch some products to use in orders
        const products = await Product.find().limit(3); // Fetch the first three products
        console.log('Fetched product IDs:', products.map(product => product._id)); // Log product IDs

        // Check if products exist
        if (products.length === 0) {
            console.error('No products found to create orders.');
            return;
        }

        // Define sample orders using the fetched product IDs
        const orders = [
            {
                customerName: 'John Doe',
                products: [
                    { productId: products[0]._id, quantity: 1 }, // Use the first product ID
                    { productId: products[1]._id, quantity: 2 }, // Use the second product ID
                ],
                totalAmount: products[0].price * 1 + products[1].price * 2,
            },
            {
                customerName: 'Jane Doe',
                products: [
                    { productId: products[2]._id, quantity: 1 }, // Use the third product ID
                ],
                totalAmount: products[2].price * 1,
            },
        ];

        // Insert the orders into the database
        await Order.insertMany(orders);
        console.log('Database seeded with sample orders!');
    } catch (error) {
        console.error('Error seeding orders:', error);
    } finally {
        mongoose.connection.close(); // Close the MongoDB connection
    }
}

seedOrders();
