let socket;
let playerId; // To store the player's ID
document
  .getElementById("connect-button")
  .addEventListener("click", function () {
    connectWebSocket();
  });

function connectWebSocket() {
  // Replace 'ws://example.org:4444' with the actual WebSocket server URL
  socket = new WebSocket("ws://localhost:4444/");
  

  socket.onopen = function () {
    displayMessage("Connected to WebSocket server");
    socket.send(
      JSON.stringify({
        type: "join",
      })
    );
  };

  /*socket.onmessage = function (event) {
    const message = event.data;
    logMessage("Received: " + message);
  };*/
  socket.onmessage = function (event) {
    const data = JSON.parse(event.data);
    if (data.type === "chat") {
      displayMessage(data.sender + ": " + data.message);
    }
  };

  socket.onclose = function (event) {
    if (event.wasClean) {
      displayMessage("Connection closed cleanly");
    } else {
      displayMessage("Connection closed unexpectedly");
    }
  };

  socket.onerror = function (error) {
    displayMessage("WebSocket error: " + error.message);
  };
}

document.getElementById("send-button").addEventListener("click", function () {
  sendMessage();
});



function sendMessage() {
  const messageInput = document.getElementById("message-input");
  const message = messageInput.value.trim();

  if (message !== "") {
    displayMessage(message);
    socket.send(
      JSON.stringify({
        type: "chat",
        sender: playerId,
        message: message,
      })
    );
    
    messageInput.value = "";
  }
}

function displayMessage(message) {
  const messagesContainer = document.getElementById("messages-container");
  if (messagesContainer) {
    const messageElement = document.createElement("div");
    messageElement.classList.add("message");
    messageElement.textContent = message;
    // messageElement.textContent = playerId + ": " + message;
    messagesContainer.appendChild(messageElement);
    // Automatically scroll to the bottom
    messagesContainer.scrollTop = messagesContainer.scrollHeight;
  } else {
    console.log("Messages container not found.");
  }
}





