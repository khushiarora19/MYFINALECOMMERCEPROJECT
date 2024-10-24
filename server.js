const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');

// Initialize the Express application
const app = express();
const port = 5000;

// Middleware
app.use(cors());
app.use(express.json());

// MongoDB connection
mongoose.connect('mongodb+srv://khushi:hareKrishna1920_@cluster0.jhq56.mongodb.net/EcommerceDB', {
    useNewUrlParser: true,
    useUnifiedTopology: true,
})
.then(() => {
    console.log('MongoDB connected');
})
.catch(err => {
    console.error('MongoDB connection error:', err);
});

// Define Product schema and model
const productSchema = new mongoose.Schema({
    name: { type: String, required: true },
    price: { type: Number, required: true },
    category: { type: String, required: true },
    description: { type: String },
    availability: { type: Boolean, required: true },
    stock: { type: Number, required: true, default: 0 },
}, { timestamps: true }); // Adds createdAt and updatedAt timestamps

const Product = mongoose.model('Product', productSchema);

// Define Order schema and model
const orderSchema = new mongoose.Schema({
    customerName: { type: String, required: true },
    productId: { type: mongoose.Schema.Types.ObjectId, ref: 'Product', required: true },
    quantity: { type: Number, required: true },
}, { timestamps: true });

const Order = mongoose.model('Order', orderSchema);

// Product routes

// GET all products with filtering, pagination, and sorting
app.get('/api/v1/products', async (req, res) => {
    const { category, price_max, page = 1, limit = 10, sortBy = 'relevance' } = req.query;

    let query = {};
    if (category) {
        query.category = category;
    }
    if (price_max) {
        query.price = { $lte: price_max };
    }

    try {
        const products = await Product.find(query)
            .skip((page - 1) * limit)
            .limit(Number(limit))
            .sort(sortBy === 'relevance' ? { createdAt: -1 } : { price: sortBy === 'asc' ? 1 : -1 });

        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limit);

        res.json({
            products,
            totalPages,
            currentPage: Number(page),
        });
    } catch (error) {
        console.error('Error fetching products:', error);
        res.status(500).json({ error: 'Failed to fetch products' });
    }
});

// POST a new product
app.post('/api/v1/products', async (req, res) => {
    const { name, price, category, description, availability, stock } = req.body;
    const newProduct = new Product({ name, price, category, description, availability, stock });

    try {
        await newProduct.save();
        res.status(201).json(newProduct);
    } catch (error) {
        console.error('Error adding product:', error);
        res.status(400).json({ error: 'Failed to add product' });
    }
});

// DELETE a product by ID
app.delete('/api/v1/products/:id', async (req, res) => {
    try {
        const result = await Product.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Product not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting product:', error);
        res.status(400).json({ error: 'Failed to delete product' });
    }
});

// Order routes

// GET all orders with populated product details
app.get('/api/v1/orders', async (req, res) => {
    try {
        const orders = await Order.find().populate('productId'); // Populate product details
        res.json(orders);
    } catch (error) {
        console.error('Error fetching orders:', error);
        res.status(500).json({ error: 'Failed to fetch orders' });
    }
});

// POST a new order
app.post('/api/v1/orders', async (req, res) => {
    const { customerName, productId, quantity } = req.body;

    try {
        // Check if the product exists and has sufficient stock
        const product = await Product.findById(productId);
        if (!product) {
            return res.status(404).json({ error: 'Product not found' });
        }
        if (product.stock < quantity) {
            return res.status(400).json({ error: 'Insufficient stock' });
        }

        // Deduct stock
        product.stock -= quantity;
        await product.save();

        const newOrder = new Order({ customerName, productId, quantity });
        await newOrder.save();
        res.status(201).json(newOrder);
    } catch (error) {
        console.error('Error placing order:', error);
        res.status(400).json({ error: 'Failed to place order' });
    }
});

// DELETE an order by ID
app.delete('/api/v1/orders/:id', async (req, res) => {
    try {
        const result = await Order.findByIdAndDelete(req.params.id);
        if (!result) {
            return res.status(404).json({ error: 'Order not found' });
        }
        res.status(204).send(); // No content to send back
    } catch (error) {
        console.error('Error deleting order:', error);
        res.status(400).json({ error: 'Failed to delete order' });
    }
});

// GET specific order by ID
app.get('/api/v1/orders/:id', async (req, res) => {
    try {
        const order = await Order.findById(req.params.id).populate('productId');
        
        if (!order) {
            return res.status(404).json({ error: 'Order not found' });
        }

        res.json(order);
    } catch (error) {
        console.error('Error fetching order details:', error);
        res.status(500).json({ error: 'Failed to fetch order details' });
    }
});

// Start the server
app.listen(port, () => {
    console.log(`Server running at http://localhost:${port}`);
});
