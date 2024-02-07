const WebSocket = require("ws");
const wss = new WebSocket.Server({ port: 4444 });

let nextPlayerId = 1; // Initialize the ID counter
const clients = new Map(); // Map to store client connections

wss.on("connection", function connection(ws) {
  console.log("Client connected");

  // Assign an ID to the player
  const playerId = nextPlayerId++;
  console.log("Player ID:", playerId);

  // Store the player's WebSocket connection in the map
  clients.set(playerId, ws);

  ws.on("message", function incoming(message) {
    console.log("Received: %s", message);

    const data = JSON.parse(message);
    if (data.type === "join") {
      // Send the player ID back to the client
      ws.send(
        JSON.stringify({
          type: "join",
          playerId: playerId,
        })
      );
    } else if (data.type === "chat") {
      const sender = playerId === 1 ? "Player1" : "Player2";
      const recipient = playerId === 1 ? 2 : 1;
      const messageContent = data.message;

      // Get the recipient's WebSocket connection and send the message
      if (clients.has(recipient)) {
        const recipientSocket = clients.get(recipient);
        recipientSocket.send(
          JSON.stringify({
            type: "chat",
            sender: sender,
            message: messageContent,
          })
        );
      } else {
        console.log("Recipient not found");
      }
    }
  });

  ws.on("close", function close() {
    console.log("Client disconnected");
    // Remove the player from the map upon disconnection
    clients.delete(playerId);
  });
});

console.log("WebSocket server running on ws://localhost:4444/");
