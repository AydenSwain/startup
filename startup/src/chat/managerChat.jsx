import React from 'react';
import './chat.css';
import '../app.css';

export default function ClientChat({ email, webSocket }) {
    const [chatHistory, setChatHistory] = React.useState([]);
    const [clientEmail, setClientEmail] = React.useState([null]);

    // Observer for incoming messages
    React.useEffect(() => {
        webSocket.addObserver((newMessage) => {
            setChatHistory((chatHistory) => [...chatHistory, newMessage]);
        });
    }, [webSocket]);

    // function for sending messages
    const handleSend = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const message = formData.get('message');
        if (message.trim() === '') return;
        
        webSocket.sendMessage({ type: 'sendMessage', message: message, targetEmail: clientEmail});
        
        event.target.reset();
    };

    return (
        <main className="white-rounded-box" style={{width: "75%", height: "400px", overflowY: "scroll"}}>
            <h2>Chat room</h2>
            <br />

            <div>
                {!chatHistory.length ? (<p>Waiting for messages...</p>) : (chatHistory.map((entry, index) => (
                    <p key={index}><b>{entry.sender}:</b> {entry.message}</p>
                )))}
            </div>

            <div style={{ textAlign: "right" }}>
                <form onSubmit={handleSend}>
                    <input type="text" name="message" autoComplete="off" placeholder="Type message here..." />
                    <button type="submit">Send</button>
                </form>
            </div>
        </main>
    );
}