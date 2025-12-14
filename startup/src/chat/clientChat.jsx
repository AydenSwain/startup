import React from 'react';
import './chat.css';
import '../app.css';

export default function ClientChat({ email, webSocket }) {
    const [chatHistory, setChatHistory] = React.useState([]);
    const [managerEmail, setManagerEmail] = React.useState(null);
    
    // Load chat history
    React.useEffect(() => {
        fetch('/api/chat')
            .then(res => res.json())
            .then(data => setChatHistory(data))
            .catch(err => console.error(err));
    }, []);

    // Observer for incoming messages
    React.useEffect(() => {
        webSocket.addObserver((message) => {
            if (message.type === 'error') {
                console.error('WebSocket error:', message.message);
            } else if (message.sender && message.message) {
                // Incoming message from manager
                setManagerEmail(message.sender);
                setChatHistory((chatHistory) => [...chatHistory, message]);
            }
        });
    }, [webSocket]);

    // function for sending messages
    const handleSend = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const message = formData.get('message');
        if (message.trim() === '') return;
        
        webSocket.sendMessage({ type: 'sendMessage', message: message, targetEmail: managerEmail});
        
        event.target.reset();
    };

    return (
        <main className="white-rounded-box" style={{width: "75%", height: "400px", overflowY: "scroll"}}>
            <h2>Chat room</h2>
            <br />

            <div>
                {!chatHistory.length ? (<p>No message history...</p>) : (chatHistory.map((entry, index) => (
                    <p key={index}><b>{entry.sender}:</b> {entry.message}</p>
                )))}
            </div>

            {!managerEmail ? (<p style={{ color: "red" }}>Waiting for a manager to connect...</p>) : null}

            <div style={{ textAlign: "right" }}>
                <form onSubmit={handleSend}>
                    <input type="text" name="message" autoComplete="off" placeholder="Type message here..." />
                    <button type="submit">Send</button>
                </form>
            </div>
        </main>
    );
}