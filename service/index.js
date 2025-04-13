const express = require("express");
const cookieParser = require("cookie-parser");
const app = express();
const DB = require("./database.js");
const { apiLimiter, authLimiter } = require('./utils/rateLimiter');

// Import routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve frontend static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// Apply rate limiting to routes
app.use('/api/auth', authLimiter, authRoutes);  // Strict limiting for auth routes
app.use('/api/articles', apiLimiter, articleRoutes);
app.use('/api/comments', apiLimiter, commentRoutes);
app.use('/api/user', apiLimiter, userRoutes);

// Export the Express app for use in server.js
module.exports = { app };