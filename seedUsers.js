const mongoose = require('mongoose');
const User = require('./models/User');

async function seedUsers() {
  try {
    await mongoose.connect('mongodb+srv://khushi:hareKrishna1920_@cluster0.jhq56.mongodb.net/EcommerceDB');

    const users = [
      { name: 'John Doe', email: 'john@example.com', password: 'john123', role: 'customer' },
      { name: 'Jane Smith', email: 'jane@example.com', password: 'jane123', role: 'customer' },
      { name: 'Admin User', email: 'admin@example.com', password: 'admin123', role: 'admin' },
    ];

    await User.insertMany(users);
    console.log('Database seeded with sample users!');
  } catch (error) {
    console.error('Error seeding users:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedUsers();
