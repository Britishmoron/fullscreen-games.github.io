const chatBox = document.getElementById('chat-box');
const usernameInput = document.getElementById('username-input');
const messageInput = document.getElementById('message-input');
const sendButton = document.getElementById('send-button');

// Function to add message to the chat box
function addMessage(message, user) {
    const messageElement = document.createElement('div');
    messageElement.textContent = `${user}: ${message}`;
    chatBox.appendChild(messageElement);
    chatBox.scrollTop = chatBox.scrollHeight;
}

// Load messages from localStorage
function loadMessages() {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.forEach(msg => addMessage(msg.message, msg.user));
}

// Save message to localStorage
function saveMessage(message, user) {
    const messages = JSON.parse(localStorage.getItem('messages')) || [];
    messages.push({ user, message });
    localStorage.setItem('messages', JSON.stringify(messages));
}

// Send message
sendButton.addEventListener('click', () => {
    const message = messageInput.value;
    const user = usernameInput.value || "Anonymous";
    if (message.trim() !== "") {
        addMessage(message, user);
        saveMessage(message, user);
        messageInput.value = "";
    }
});

messageInput.addEventListener('keypress', (e) => {
    if (e.key === 'Enter') {
        sendButton.click();
    }
});

// Load messages on page load
loadMessages();
