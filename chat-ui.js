
class ChatUI {
    constructor(container, options = {}) {
        if (!container) {
            throw new Error('Container element is required.');
        }

        this.container = typeof container === 'string' ? document.querySelector(container) : container;
        if (!this.container) {
            throw new Error(`Container element not found for selector: ${container}`);
        }

        this.options = {
            placeholder: 'Type a message...',
            theme: 'pastel',
            ...options
        };

        this.messages = [];
        this.eventHandlers = {};
        this.profiles = {
            user: { avatar: null },
            bot: { avatar: null }
        };

        this._createUI();
        this._injectStyles();
        this._setupEventListeners();
    }

    // --- Public API Methods ---

    addMessage(msg, { scroll = true } = {}) {
        const timestamp = new Date().toISOString();
        const message = {
            role: 'bot',
            type: 'text',
            ...msg,
            timestamp
        };
        this.messages.push(message);
        this._renderMessage(message);
        if (scroll) {
            this._scrollToBottom();
        }
    }

    loadHistory(history) {
        this.clearMessages();
        history.forEach(msg => this.addMessage(msg, { scroll: false }));
        this._scrollToBottom();
    }

    clearMessages() {
        this.messages = [];
        this.elements.messageList.innerHTML = '';
    }

    getMessages() {
        return [...this.messages];
    }

    setProfile(profiles) {
        if (profiles.user) this.profiles.user = { ...this.profiles.user, ...profiles.user };
        if (profiles.bot) this.profiles.bot = { ...this.profiles.bot, ...profiles.bot };
        this._updateProfiles();
    }

    setBackground(config) {
        if (typeof config === 'string') {
            this.elements.chatContainer.style.background = config;
        } else if (config.gradient) {
            this.elements.chatContainer.style.background = `linear-gradient(${config.gradient.join(', ')})`;
        } else if (config.image) {
            this.elements.chatContainer.style.backgroundImage = `url(${config.image})`;
            this.elements.chatContainer.style.backgroundSize = 'cover';
            this.elements.chatContainer.style.backgroundPosition = 'center';
        }
    }

    resetBackground() {
        this.elements.chatContainer.style.background = '';
        this.elements.chatContainer.style.backgroundImage = '';
    }

    showChoices(data) {
        this.elements.choiceContainer.innerHTML = '';
        if (!data || !data.choices) {
            this.elements.choiceContainer.style.display = 'none';
            return;
        }
        data.choices.forEach(choice => {
            const button = document.createElement('button');
            button.textContent = choice.label;
            button.dataset.id = choice.id;
            button.dataset.value = choice.value;
            button.addEventListener('click', () => this._handleChoiceClick(choice));
            this.elements.choiceContainer.appendChild(button);
        });
        this.elements.choiceContainer.style.display = 'flex';
    }

    hideChoices() {
        this.elements.choiceContainer.style.display = 'none';
    }

    on(event, handler) {
        if (!this.eventHandlers[event]) {
            this.eventHandlers[event] = [];
        }
        this.eventHandlers[event].push(handler);
    }

    off(event, handler) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event] = this.eventHandlers[event].filter(h => h !== handler);
        }
    }

    destroy() {
        // Remove event listeners
        this.elements.form.remove();
        // Clear UI
        this.container.innerHTML = '';
        // Clear all references
        Object.keys(this).forEach(key => {
            this[key] = null;
        });
    }

    // --- Internal UI Creation Methods ---

    _createUI() {
        this.container.innerHTML = `
            <div class="chat-container">
                <div class="chat-header-tooltip" style="display: none;"></div>
                <div class="chat-message-list"></div>
                <div class="chat-choice-container"></div>
                <form class="chat-input-form">
                    <input type="text" class="chat-input" placeholder="${this.options.placeholder}">
                    <button type="submit" class="chat-send-btn">
                        <svg viewBox="0 0 24 24" width="24" height="24"><path d="M2.01 21L23 12 2.01 3 2 10l15 2-15 2z"></path></svg>
                    </button>
                </form>
            </div>
        `;
        this.elements = {
            chatContainer: this.container.querySelector('.chat-container'),
            messageList: this.container.querySelector('.chat-message-list'),
            tooltip: this.container.querySelector('.chat-header-tooltip'),
            choiceContainer: this.container.querySelector('.chat-choice-container'),
            form: this.container.querySelector('.chat-input-form'),
            input: this.container.querySelector('.chat-input'),
            sendBtn: this.container.querySelector('.chat-send-btn'),
        };
    }

    _injectStyles() {
        const style = document.createElement('style');
        style.textContent = `
            .chat-container {
                display: flex;
                flex-direction: column;
                height: 100%;
                box-sizing: border-box;
                font-family: -apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, Helvetica, Arial, sans-serif;
                border-radius: 8px;
                overflow: hidden;
                position: relative;
            }
            .chat-message-list {
                flex: 1;
                padding: 20px 20px 10px;
                overflow-y: auto;
                display: flex;
                flex-direction: column;
            }
            .chat-message {
                display: flex;
                margin-bottom: 15px;
                max-width: 85%;
            }
            .chat-message.user {
                align-self: flex-end;
                flex-direction: row-reverse;
            }
            .chat-message.bot {
                align-self: flex-start;
            }
            .chat-avatar {
                width: 40px;
                height: 40px;
                border-radius: 50%;
                margin: 0 10px;
                background-color: #ccc;
                background-size: cover;
                background-position: center;
            }
            .chat-bubble {
                padding: 12px 16px;
                border-radius: 20px;
                position: relative;
                word-wrap: break-word;
            }
            .chat-message.user .chat-bubble {
                border-bottom-right-radius: 5px;
            }
            .chat-message.bot .chat-bubble {
                border-bottom-left-radius: 5px;
            }
            .chat-bubble .text {
                font-size: 16px;
                line-height: 1.5;
            }
            .chat-bubble .images {
                display: flex;
                flex-wrap: wrap;
                gap: 5px;
                margin-top: 10px;
            }
            .chat-bubble .images img {
                max-width: 150px;
                max-height: 150px;
                border-radius: 10px;
                cursor: pointer;
                transition: transform 0.2s;
            }
             .chat-bubble .images img:hover {
                transform: scale(1.05);
            }
            .chat-input-form {
                display: flex;
                padding: 10px 20px 20px;
                border-top: 1px solid #eee;
            }
            .chat-input {
                flex: 1;
                border: none;
                background: #f0f0f0;
                padding: 12px 16px;
                border-radius: 20px;
                font-size: 16px;
                outline: none;
            }
            .chat-send-btn {
                background: none;
                border: none;
                cursor: pointer;
                padding: 0 0 0 15px;
                fill: #007bff;
            }
            .chat-choice-container {
                display: flex;
                flex-wrap: wrap;
                gap: 10px;
                padding: 0 20px 10px;
                justify-content: flex-end;
            }
            .chat-choice-container button {
                padding: 8px 16px;
                border-radius: 18px;
                border: 1px solid #007bff;
                color: #007bff;
                background: white;
                cursor: pointer;
                font-size: 14px;
            }

            /* Pastel Theme */
            .chat-container[data-theme="pastel"] {
                background-color: #f7fafc;
                border: 1px solid #e2e8f0;
            }
            .chat-container[data-theme="pastel"] .chat-message.user .chat-bubble {
                background-color: #cce4ff;
                color: #333;
            }
            .chat-container[data-theme="pastel"] .chat-message.bot .chat-bubble {
                background-color: #e2e8f0;
                color: #2d3748;
            }
            .chat-container[data-theme="pastel"] .chat-input {
                 background-color: #fff;
                 border: 1px solid #e2e8f0;
            }
            .chat-container[data-theme="pastel"] .chat-send-btn {
                fill: #4a90e2;
            }
             .chat-container[data-theme="pastel"] .chat-choice-container button {
                border-color: #a7c7e7;
                color: #4a90e2;
            }
             .chat-container[data-theme="pastel"] .chat-choice-container button:hover {
                background-color: #f0f7ff;
            }

            /* Tooltip */
            .chat-header-tooltip {
                position: absolute;
                top: 5px;
                left: 50%;
                transform: translateX(-50%);
                background: rgba(0,0,0,0.5);
                color: white;
                padding: 5px 10px;
                border-radius: 12px;
                font-size: 12px;
                z-index: 10;
                pointer-events: none;
            }

        `;
        this.container.appendChild(style);
        this.elements.chatContainer.dataset.theme = this.options.theme;
    }

    // --- Internal Event Handling Methods ---

    _setupEventListeners() {
        // Form submission
        this.elements.form.addEventListener('submit', e => {
            e.preventDefault();
            this._handleSend();
        });

        // Image click
        this.elements.messageList.addEventListener('click', e => {
            if (e.target.tagName === 'IMG') {
                this._emit('image:click', { src: e.target.src });
            }
        });

        // Scroll for tooltip
        let scrollTimeout;
        this.elements.messageList.addEventListener('scroll', () => {
             this.elements.tooltip.style.display = 'block';
             this._updateTooltip();
             clearTimeout(scrollTimeout);
             scrollTimeout = setTimeout(() => {
                 this.elements.tooltip.style.display = 'none';
             }, 1500);
        });
    }

    _handleSend() {
        const text = this.elements.input.value.trim();
        if (text) {
            const message = { role: 'user', text };
            this.addMessage(message);
            this.elements.input.value = '';
            this._emit('message:send', { text, role: 'user' });
        }
    }

    _handleChoiceClick(choice) {
        this.addMessage({ role: 'user', text: choice.label });
        this._emit('choice:selected', choice);
        this.hideChoices();
    }
    
    _emit(event, payload) {
        if (this.eventHandlers[event]) {
            this.eventHandlers[event].forEach(handler => handler(payload));
        }
    }

    // --- Internal Rendering Methods ---

    _renderMessage(msg) {
        const el = document.createElement('div');
        el.classList.add('chat-message', msg.role);
        el.dataset.timestamp = msg.timestamp;

        const avatar = document.createElement('div');
        avatar.classList.add('chat-avatar');
        if (this.profiles[msg.role]?.avatar) {
             avatar.style.backgroundImage = `url(${this.profiles[msg.role].avatar})`;
        }

        const bubble = document.createElement('div');
        bubble.classList.add('chat-bubble');

        if (msg.text) {
            const textEl = document.createElement('div');
            textEl.classList.add('text');
            textEl.textContent = msg.text;
            bubble.appendChild(textEl);
        }

        if (msg.images && msg.images.length > 0) {
            const imagesEl = document.createElement('div');
            imagesEl.classList.add('images');
            msg.images.forEach(imgData => {
                const img = document.createElement('img');
                img.src = imgData.src;
                if (imgData.alt) img.alt = imgData.alt;
                imagesEl.appendChild(img);
            });
            bubble.appendChild(imagesEl);
        }

        el.appendChild(avatar);
        el.appendChild(bubble);
        this.elements.messageList.appendChild(el);
    }

    _updateProfiles() {
        this.elements.messageList.querySelectorAll('.chat-message').forEach(msgEl => {
            const role = msgEl.classList.contains('user') ? 'user' : 'bot';
            const avatarEl = msgEl.querySelector('.chat-avatar');
            if (avatarEl && this.profiles[role]?.avatar) {
                avatarEl.style.backgroundImage = `url(${this.profiles[role].avatar})`;
            }
        });
    }

    _formatTimestamp(isoString) {
        if (!isoString) return '';
        const date = new Date(isoString);
        return date.toLocaleTimeString('en-US', { hour: 'numeric', minute: '2-digit', hour12: true });
    }

    _updateTooltip() {
        const list = this.elements.messageList;
        const messages = Array.from(list.querySelectorAll('.chat-message[data-timestamp]'));
        let topMessage = null;

        for(const msg of messages) {
            if (msg.getBoundingClientRect().top >= list.getBoundingClientRect().top) {
                topMessage = msg;
                break;
            }
        }
        
        if (topMessage) {
            const timestamp = topMessage.dataset.timestamp;
            if (timestamp) {
                 this.elements.tooltip.textContent = this._formatTimestamp(timestamp);
            }
        }
    }

    _scrollToBottom() {
        this.elements.messageList.scrollTop = this.elements.messageList.scrollHeight;
    }
}
