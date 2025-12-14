import React from 'react';
import './chat.css';
import '../app.css';

export default function ManagerChat({ email, webSocket }) {
    const [chatHistory, setChatHistory] = React.useState([]);
    const [clientEmail, setClientEmail] = React.useState(null);
    const [clientList, setClientList] = React.useState([]);

    // Observer for incoming messages
    React.useEffect(() => {
        webSocket.addObserver((message) => {
            console.log('Manager received message:', message);
            if (message.type === 'clientList') {
                console.log('Setting client list:', message.clients);
                setClientList(message.clients);
            } else if (message.type === 'error') {
                console.error('WebSocket error:', message.message);
            } else if (message.sender && message.message) {
                // Regular message
                setChatHistory((chatHistory) => [...chatHistory, message]);
            }
        });

        // Request client list after observer is set up
        // Wait a bit for WebSocket to be connected
        const timer = setTimeout(() => {
            console.log('Requesting client list');
            webSocket.sendMessage({ type: 'requestClientList' });
        }, 100);

        return () => clearTimeout(timer);
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

    const handleBackToClientList = () => {
        // Send empty message to disconnect client
        webSocket.sendMessage({ type: 'sendMessage', message: '', targetEmail: clientEmail});
        setClientEmail(null);
    };

    return (
        <main className="white-rounded-box" style={{width: "75%", height: "400px", overflowY: "scroll"}}>
            <h2>Manager Chat</h2>
            <br />

            {!clientEmail ? (
                <div>
                    <label>Select Client: </label>
                    <select value={clientEmail || ''} onChange={(e) => setClientEmail(e.target.value)}>
                        <option value="">-- Select a client --</option>
                        {clientList.map((client, index) => (
                            <option key={index} value={client.email}>{client.email}</option>
                        ))}
                    </select>
                    {clientList.length === 0 && <span style={{marginLeft: '10px', color: 'gray'}}>No clients connected</span>}
                </div>
            ) : (
                <div>
                    <span>Chatting with: <b>{clientEmail}</b></span>
                    <button onClick={handleBackToClientList} style={{marginLeft: '10px'}}>Back to Client List</button>
                </div>
            )}
            <br />

            <div>
                {!chatHistory.length ? (<p>No messages yet...</p>) : (chatHistory.map((entry, index) => (
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