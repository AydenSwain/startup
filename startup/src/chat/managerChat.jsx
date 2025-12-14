import React from 'react';
import './chat.css';
import '../app.css';

export default function ManagerChat({ email, webSocket }) {
    const [chatHistory, setChatHistory] = React.useState([]);
    const [clientEmail, setClientEmail] = React.useState(null);
    const [clientList, setClientList] = React.useState([]);

    // Request client list when component mounts
    React.useEffect(() => {
        webSocket.sendMessage({ type: 'requestClientList' });
    }, [webSocket]);

    // Observer for incoming messages
    React.useEffect(() => {
        webSocket.addObserver((message) => {
            if (message.type === 'clientList') {
                setClientList(message.clients);
            } else if (message.type === 'error') {
                console.error('WebSocket error:', message.message);
            } else {
                // Regular message
                setChatHistory((chatHistory) => [...chatHistory, message]);
            }
        });
    }, [webSocket]);

    // function for sending messages
    const handleSend = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const message = formData.get('message');
        if (message.trim() === '' || !clientEmail) return;
        
        webSocket.sendMessage({ type: 'sendMessage', message: message, targetEmail: clientEmail});
        
        event.target.reset();
    };

    return (
        <main className="white-rounded-box" style={{width: "75%", height: "400px", overflowY: "scroll"}}>
            <h2>Manager Chat</h2>
            <br />

            <div>
                <label>Select Client:</label>
                <select value={clientEmail || ''} onChange={(e) => setClientEmail(e.target.value)}>
                    <option value="">-- Select a client --</option>
                    {clientList.map((client, index) => (
                        <option key={index} value={client.email}>{client.email}</option>
                    ))}
                </select>
            </div>
            <br />

            <div>
                {!chatHistory.length ? (<p>Waiting for messages...</p>) : (chatHistory.map((entry, index) => (
                    <p key={index}><b>{entry.sender}:</b> {entry.message}</p>
                )))}
            </div>

            <div style={{ textAlign: "right" }}>
                <form onSubmit={handleSend}>
                    <input type="text" name="message" autoComplete="off" placeholder="Type message here..." disabled={!clientEmail} />
                    <button type="submit" disabled={!clientEmail}>Send</button>
                </form>
            </div>
        </main>
    );
}