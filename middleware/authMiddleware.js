const authenticate = (req, res, next) => {
    const apiKey = req.headers['x-api-key']; // Or use Authorization header for OAuth

    if (!apiKey || apiKey !== process.env.API_KEY) { // Check if the API key is valid
        return res.status(403).json({ message: 'Forbidden: Invalid API Key' });
    }
    next(); // Proceed to the next middleware or route handler
};

module.exports = { authenticate };
