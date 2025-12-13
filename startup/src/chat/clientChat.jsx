import React from 'react';
import './chat.css';
import '../app.css';

export default function ClientChat({ email, webSocket }) {
    const [chatHistory, setChatHistory] = React.useState([]);
    const [socket, setSocket] = React.useState(null);

    

    // Load chat history
    React.useEffect(() => {
        fetch('/api/chat')
            .then(res => res.json())
            .then(data => setChatHistory(data))
            .catch(err => console.error(err));
    }, []);

    // function for sending messages
    const handleSend = (event) => {
        event.preventDefault();
        const formData = new FormData(event.target);
        const message = formData.get('message');
        if (message.trim() === '') return;
        setChatHistory(chatHistory => [...chatHistory, { sender: localStorage.getItem('email'), message }]);
        
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
                {/* <input type="text" name="message" autoComplete="off" placeholder="Type message here..." /> */}
                <form onSubmit={handleSend}>
                    <input type="text" name="message" autoComplete="off" placeholder="Type message here..." />
                    <button type="submit">Send</button>
                </form>
            </div>
        </main>
    );
}""