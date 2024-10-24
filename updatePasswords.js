const mongoose = require('mongoose');
const bcrypt = require('bcrypt');
const User = require('./models/User'); // Adjust this path as needed

require('dotenv').config(); // Load environment variables from .env file

// Connect to MongoDB
mongoose.connect(process.env.MONGODB_URI, { // Make sure to replace with your MongoDB URI
    useNewUrlParser: true,
    useUnifiedTopology: true
}).then(() => {
    console.log('MongoDB connected successfully');
}).catch(err => {
    console.error('MongoDB connection error:', err);
});

// Function to hash existing passwords
async function updatePasswords() {
    const saltRounds = 10; // Number of salt rounds for hashing

    try {
        // Find all users
        const users = await User.find({});

        for (const user of users) {
            // Check if the password is already hashed (if you want to avoid re-hashing)
            const isPasswordHashed = await bcrypt.compare(user.password, user.password);
            if (!isPasswordHashed) {
                // Hash the password
                user.password = await bcrypt.hash(user.password, saltRounds);
                await user.save(); // Save the user with the new hashed password
                console.log(`Password updated for user: ${user.username}`);
            } else {
                console.log(`User ${user.username} already has a hashed password.`);
            }
        }

        console.log('Password update process completed.');
    } catch (error) {
        console.error('Error updating passwords:', error);
    } finally {
        mongoose.connection.close(); // Close the MongoDB connection
    }
}

// Execute the password update function
updatePasswords();
