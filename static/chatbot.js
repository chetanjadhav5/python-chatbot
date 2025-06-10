document.addEventListener("DOMContentLoaded", function () {
    let inputField = document.getElementById('userInput');
    let chatBox = document.querySelector('.chat-box');
    
    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});

async function sendMessage() {
    let inputField = document.getElementById('userInput');
    let message = inputField.value.trim();

    if (message !== "") {
        appendMessage("user", message);
        inputField.value = "";

        // Show bot is processing
        let botMessage = appendMessage("bot", "Processing your request... 🤖");

        try {
            let response = await fetch("https://python-chatbot-ou3p.onrender.com/chat", {
                method: "POST",
                headers: { "Content-Type": "application/json" },
                body: JSON.stringify({ question: message })
            });

            let data = await response.json();
            botMessage.textContent = data.answer || "Sorry, I couldn't understand that.";
        } catch (error) {
            console.error("Error:", error);
            botMessage.textContent = "An error occurred while processing your request.";
        }
    }
}

function appendMessage(sender, text) {
    let chatBox = document.querySelector('.chat-box');
    let messageDiv = document.createElement('div');
    messageDiv.className = sender === "user" ? "user-message" : "bot-message";
    messageDiv.textContent = text;
    chatBox.appendChild(messageDiv);
    chatBox.scrollTop = chatBox.scrollHeight;
    return messageDiv;
}
// Chatbot Functionality
function sendMessage() {
    let inputField = document.getElementById('userInput');
    let message = inputField.value.trim();

    if (message !== "") {
        let chatBox = document.querySelector('.chat-box');

        // Append user message
        let userMessage = document.createElement('div');
        userMessage.className = 'user-message';
        userMessage.textContent = message;
        chatBox.appendChild(userMessage);

        // Clear input field
        inputField.value = "";

        // Scroll to bottom
        chatBox.scrollTop = chatBox.scrollHeight;

        // Show a "processing" message while waiting for response
        let botMessage = document.createElement('div');
        botMessage.className = 'bot-message';
        botMessage.textContent = "Processing your request... 🤖";
        chatBox.appendChild(botMessage);
        chatBox.scrollTop = chatBox.scrollHeight;

        // Send request to backend
        fetch('/chat', {
            method: 'POST',
            headers: { 'Content-Type': 'application/json' },
            body: JSON.stringify({ message: message })
        })
        .then(response => response.json())
        .then(data => {
            botMessage.textContent = data.response; // Update bot message with actual response
            chatBox.scrollTop = chatBox.scrollHeight; // Auto-scroll to bottom
        })
        .catch(error => {
            botMessage.textContent = "Sorry, an error occurred. Please try again.";
            console.error("Error:", error);
        });
    }
}

// Handle Enter key press to send message
document.addEventListener("DOMContentLoaded", function () {
    let inputField = document.getElementById('userInput');

    inputField.addEventListener("keypress", function (event) {
        if (event.key === "Enter") {
            event.preventDefault();
            sendMessage();
        }
    });
});
