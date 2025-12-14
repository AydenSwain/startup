class ChatWS {
    observers = [];
    connected = false;
    messageQueue = [];

    constructor() {
        // Adjust the webSocket protocol to what is being used for HTTP
        const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
        this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

        // Display that we have opened the webSocket
        this.socket.onopen = (event) => {
            console.log('WebSocket connected');
            this.connected = true;
            
            // Send any queued messages
            while (this.messageQueue.length > 0) {
                const msg = this.messageQueue.shift();
                this.socket.send(JSON.stringify(msg));
            }
        };

        // Display messages we receive from the server
        this.socket.onmessage = (event) => {
            try {
                const message = JSON.parse(event.data);
                
                console.log('WebSocket received:', message);
                
                // Notify all observers with the parsed message
                this.notifyObservers(message);
            } catch (error) {
                console.error('Error parsing WebSocket message:', error);
            }
        };

        // If the webSocket is closed then disable the interface
        this.socket.onclose = (event) => {
            console.log('WebSocket disconnected');
            this.connected = false;
        };
    }

    // Send a message over the webSocket
    sendMessage(messageObj) {
        if (this.connected && this.socket.readyState === WebSocket.OPEN) {
            console.log('Sending WebSocket message:', messageObj);
            this.socket.send(JSON.stringify(messageObj));
        } else if (this.socket.readyState === WebSocket.CONNECTING) {
            console.log('WebSocket connecting, queueing message:', messageObj);
            this.messageQueue.push(messageObj);
        } else {
            console.error('WebSocket is not connected');
        }
    }

    addObserver(observer) {
        this.observers.push(observer);
    }

    notifyObservers(message) {
        this.observers.forEach((observer) => observer(message));
    }
}

export default ChatWS;