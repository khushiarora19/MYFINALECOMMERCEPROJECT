const mongoose = require('mongoose');
const Product = require('./models/Product'); // Adjust the path as necessary

async function seedDatabase() {
  try {
    await mongoose.connect('mongodb+srv://khushi:hareKrishna1920_@cluster0.jhq56.mongodb.net/EcommerceDB');

    const products = [
      { name: 'Laptop', price: 999, category: 'Electronics', availability: true, stock: 5 },
      { name: 'Headphones', price: 50, category: 'Electronics', availability: true, stock: 10 },
      { name: 'Book', price: 20, category: 'Books', availability: true, stock: 15 },
      { name: 'Chair', price: 70, category: 'Furniture', availability: true, stock: 7 },
    ];

    console.log(Product); // Check if Product is defined correctly
    await Product.insertMany(products);
    console.log('Database seeded with sample products!');
  } catch (error) {
    console.error('Error seeding the database:', error);
  } finally {
    mongoose.connection.close();
  }
}

seedDatabase();
