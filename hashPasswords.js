const mongoose = require('mongoose');
const bcrypt = require('bcrypt');

const User = require('./models/User'); // Ensure this path is correct
require('dotenv').config(); // Load environment variables from .env file

const MONGODB_URI = process.env.MONGODB_URI || 'mongodb://localhost:27017/EcommerceDB'; // Your MongoDB connection string
const saltRounds = 10; // Bcrypt salt rounds

async function hashPasswords() {
    try {
        // Connect to MongoDB
        await mongoose.connect(MONGODB_URI, {
            useNewUrlParser: true,
            useUnifiedTopology: true
        });

        // Fetch all users from the database
        const users = await User.find();

        // Iterate through each user and hash their password
        for (const user of users) {
            if (!user.password.startsWith('$2b$')) { // Check if the password is already hashed
                const hashedPassword = await bcrypt.hash(user.password, saltRounds); // Hash the password
                user.password = hashedPassword; // Update user password
                await user.save(); // Save the updated user
                console.log(`Updated password for user: ${user.username}`);
            } else {
                console.log(`User ${user.username} already has a hashed password.`);
            }
        }

        console.log('All passwords have been updated.');
    } catch (error) {
        console.error('Error updating passwords:', error);
    } finally {
        mongoose.connection.close(); // Close the MongoDB connection
    }
}

hashPasswords(); // Run the password hashing function
