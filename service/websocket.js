const WebSocket = require("ws");

function initWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });
    console.log("WebSocket: server started");
    
    wss.on("connection", (ws) => {
        console.log("WebSocket: New client connected");
        
        ws.on("message", (message) => {
            console.log("WebSocket: Received:", message.toString());
            // handle incoming messages as needed
        });
      
        ws.on("close", () => {
            console.log("WebSocket: Client disconnected");
        });
    });
    
    // Example broadcast function
    function broadcast(data) {
      wss.clients.forEach(client => {
        if (client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
    
    return { broadcast };
}

module.exports = initWebSocketServer;