const express = require("express");
const cookieParser = require("cookie-parser");
const https = require('https');
const http = require('http');
const fs = require('fs');
const app = express();
const DB = require("./database.js");
const initWebSocketServer = require("./websocket.js");

// Import routes
const authRoutes = require('./routes/auth');
const articleRoutes = require('./routes/articles');
const commentRoutes = require('./routes/comments');
const userRoutes = require('./routes/users');

// Initialize server
const port = process.argv.length > 2 ? process.argv[2] : 3000;

// Middleware
app.use(express.json());
app.use(cookieParser());

// Serve frontend static files only in production
if (process.env.NODE_ENV === 'production') {
  app.use(express.static('public'));
}

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/articles', articleRoutes);
app.use('/api/comments', commentRoutes);
app.use('/api/user', userRoutes);

let server;

if (process.env.NODE_ENV === 'production') {
  // --- Create and start the HTTP server for production ---
  server = http.createServer(app).listen(port, () => {
    console.log(`Production service listening on HTTP port ${port}`);
  });
} else {
  // --- Create HTTPS server options for development ---
  const options = {
    key: fs.readFileSync('localhost-key.pem'), // Adjust filename if needed
    cert: fs.readFileSync('localhost.pem')    // Adjust filename if needed
  };
  // --- Create and start the HTTPS server for development ---
  server = https.createServer(options, app).listen(port, () => {
    console.log(`Development service listening on HTTPS port ${port}`);
  });
}

// --- Initialize WebSocket Server with the created server ---
initWebSocketServer(server);