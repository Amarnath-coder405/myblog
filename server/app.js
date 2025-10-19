// app.js

const express = require('express');
const mongoose = require('mongoose');
const bodyParser = require('body-parser');
const postsRouter = require('./routes/posts');
const dotenv = require('dotenv');

// Load environment variables from .env
dotenv.config();

const app = express();

// Environment Variables
const PORT = process.env.PORT || 5000;
const MONGO_URI = process.env.MONGO_URI;

// Middleware
app.use(bodyParser.json());

// MongoDB Atlas Connection
mongoose.connect(MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB Atlas');
  })
  .catch((err) => {
    console.error('MongoDB connection error:', err.message);
  });

// Routes
app.use('/api/posts', postsRouter);

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ error: 'Route not found' });
});

// Start Server
app.listen(PORT, () => {
  console.log(`🚀 Server running at http://localhost:${PORT}`);
});
