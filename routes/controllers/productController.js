const Product = require('../models/Product'); // Assuming you have a Product model
const { BadRequestError } = require('../errors'); // Custom error for handling bad requests

// Controller to get all products
const getAllProducts = async (req, res) => {
    const { category, minPrice, maxPrice, sortBy, page = 1, limit = 10 } = req.query;

    // Convert page and limit to numbers
    const pageNum = parseInt(page);
    const limitNum = parseInt(limit);

    // Build query object
    const query = {};
    if (category) query.category = category;
    if (minPrice || maxPrice) {
        query.price = {};
        if (minPrice) query.price.$gte = parseFloat(minPrice); // Greater than or equal
        if (maxPrice) query.price.$lte = parseFloat(maxPrice); // Less than or equal
    }

    // Sort options
    let sortOptions = {};
    if (sortBy === 'popularity') {
        sortOptions = { rating: -1 }; // Sort by rating, descending
    } else {
        sortOptions = { name: 1 }; // Default sort by name, ascending
    }

    try {
        // Fetch products from the database with pagination
        const products = await Product.find(query)
            .sort(sortOptions)
            .skip((pageNum - 1) * limitNum)
            .limit(limitNum);
        
        const totalProducts = await Product.countDocuments(query);
        const totalPages = Math.ceil(totalProducts / limitNum);

        res.status(200).json({
            page: pageNum,
            totalPages: totalPages,
            products: products,
        });
    } catch (error) {
        res.status(500).json({ message: 'Server Error', error: error.message });
    }
};

module.exports = { getAllProducts };
