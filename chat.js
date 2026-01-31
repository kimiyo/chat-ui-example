// Chat UI functionality
class ChatUI {
    constructor() {
        this.chatMessages = document.getElementById('chatMessages');
        this.messageInput = document.getElementById('messageInput');
        this.sendButton = document.getElementById('sendButton');
        
        this.initializeEventListeners();
        this.addWelcomeMessage();
    }
    
    initializeEventListeners() {
        // Send button click event
        this.sendButton.addEventListener('click', () => this.sendMessage());
        
        // Enter key press event
        this.messageInput.addEventListener('keypress', (e) => {
            if (e.key === 'Enter') {
                this.sendMessage();
            }
        });
    }
    
    addWelcomeMessage() {
        this.addMessage('Welcome to the chat room! Start typing to send messages.', 'other');
    }
    
    sendMessage() {
        const message = this.messageInput.value.trim();
        
        if (message === '') {
            return;
        }
        
        // Add user message
        this.addMessage(message, 'user');
        
        // Clear input
        this.messageInput.value = '';
        
        // Simulate a response (for demo purposes)
        setTimeout(() => {
            this.addMessage('Message received! This is a demo response.', 'other');
        }, 1000);
    }
    
    addMessage(text, type) {
        const messageDiv = document.createElement('div');
        messageDiv.className = `message ${type}`;
        
        const messageContent = document.createElement('div');
        messageContent.className = 'message-content';
        messageContent.textContent = text;
        
        const messageTime = document.createElement('span');
        messageTime.className = 'message-time';
        messageTime.textContent = this.getCurrentTime();
        
        messageDiv.appendChild(messageContent);
        messageDiv.appendChild(messageTime);
        
        this.chatMessages.appendChild(messageDiv);
        
        // Scroll to bottom
        this.scrollToBottom();
    }
    
    getCurrentTime() {
        const now = new Date();
        const hours = String(now.getHours()).padStart(2, '0');
        const minutes = String(now.getMinutes()).padStart(2, '0');
        return `${hours}:${minutes}`;
    }
    
    scrollToBottom() {
        this.chatMessages.scrollTop = this.chatMessages.scrollHeight;
    }
}

// Initialize the chat UI when the DOM is loaded
document.addEventListener('DOMContentLoaded', () => {
    new ChatUI();
});
