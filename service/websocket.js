const WebSocket = require("ws");
const DB = require("./database.js");
const { filterProfanity } = require("./utils/profanityFilter");

function initWebSocketServer(server) {
    const wss = new WebSocket.Server({ server });
    console.log("WebSocket: server started");
    
    // Broadcast helper
    function broadcast(data, sender) {
      wss.clients.forEach(client => {
        // Optionally, avoid sending it back to the sender:
        if (client !== sender && client.readyState === WebSocket.OPEN) {
          client.send(data);
        }
      });
    }
    
    wss.on("connection", (ws) => {
        console.log("WebSocket: New client connected: ", ws._socket.remoteAddress);
        
        ws.on("message", async (message) => {
            try {
                let parsedData = JSON.parse(message.toString());
                console.log("WebSocket: Received comment for article", parsedData.articleId, parsedData);
                
                // Apply profanity filtering to the comment text
                if (parsedData.text) {
                    parsedData.text = await filterProfanity(parsedData.text);
                    console.log("WebSocket: Applied profanity filtering to comment");
                }
                
                // Handle the comment message as needed
                DB.addComment(parsedData);
                
                // Broadcast the new comment to all other clients
                broadcast(JSON.stringify(parsedData), ws);
            } catch (error) {
                console.error("WebSocket: Error parsing message", error);
            }
        });
      
        ws.on("close", () => {
            console.log("WebSocket: Client disconnected: ", ws._socket.remoteAddress);
        });
    });
    
    return { broadcast };
}

module.exports = initWebSocketServer;