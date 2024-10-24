// db.js
const mongoose = require('mongoose');

// Replace <your-db-name> with your actual database name
const mongoURI = 'mongodb://localhost:27017/sampledb';

const connectDB = async () => {
  try {
    await mongoose.connect(mongoURI, {
      useNewUrlParser: true,
      useUnifiedTopology: true,
    });
    console.log('MongoDB Connected');
  } catch (err) {
    console.error(err.message);
    process.exit(1); // Exit process if MongoDB fails to connect
  }
};

module.exports = connectDB;
