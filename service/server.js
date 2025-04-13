/**
 * Server initialization file
 * Handles server creation and process management
 */
const { app } = require('./index.js');
const https = require('https');
const http = require('http');
const fs = require('fs');
const initWebSocketServer = require("./websocket.js");

// Initialize server
const port = process.argv.length > 2 ? process.argv[2] : 3000;
let server;

// Create appropriate server based on environment
if (process.env.NODE_ENV === 'production') {
  // --- Create and start the HTTP server for production ---
  server = http.createServer(app).listen(port, () => {
    console.log(`Production service listening on HTTP port ${port}`);
  });
} else {
  // --- Create HTTPS server options for development ---
  const options = {
    key: fs.readFileSync('localhost-key.pem'),
    cert: fs.readFileSync('localhost.pem')
  };
  // --- Create and start the HTTPS server for development ---
  server = https.createServer(options, app).listen(port, () => {
    console.log(`Development service listening on HTTPS port ${port}`);
  });
}

// --- Initialize WebSocket Server with the created server ---
initWebSocketServer(server);

// Function to handle server shutdown!
function handleShutdown(signal) {
  console.info(`${signal} signal received.`);
  console.log('Closing HTTP server...');
  server.close(() => {
    console.log('HTTP server closed.');
    process.exit(0);
  });
}

// Handle graceful shutdown for different signals
process.on('SIGTERM', () => handleShutdown('SIGTERM'));
process.on('SIGINT', () => handleShutdown('SIGINT'));

module.exports = server;