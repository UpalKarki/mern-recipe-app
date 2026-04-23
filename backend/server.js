// server.js — main entry point, sets up Express and connects DB
const express = require('express');
const cors = require('cors');
const dotenv = require('dotenv');
const connectDB = require('./config/db');

// Load environment variables from .env file
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Middleware: allow JSON bodies and cross-origin requests from React frontend
app.use(cors({ origin: 'http://localhost:5173', credentials: true }));
app.use(express.json());

// Route imports — we'll fill these in Phase 2 & 3
const authRoutes = require('./routes/authRoutes');
const recipeRoutes = require('./routes/recipeRoutes');
const adminRoutes = require('./routes/adminRoutes');

// Mount routes
app.use('/api/auth', authRoutes);
app.use('/api/recipes', recipeRoutes);
app.use('/api/admin', adminRoutes);

// Health check — visit http://localhost:5000/api/health to confirm server works
app.get('/api/health', (req, res) => {
  res.json({ message: 'RecipeNest API is running!' });
});

// Start server
const PORT = process.env.PORT || 5000;
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
});