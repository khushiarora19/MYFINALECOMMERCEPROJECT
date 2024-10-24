// index.js
const express = require('express');
const connectDB = require('./db');

const app = express();
const port = 3000;

// Connect to MongoDB
connectDB();

app.get('/', (req, res) => {
  res.send('MongoDB connected successfully!');
});

app.listen(port, () => {
  console.log(`Server running at http://localhost:${port}`);
});
