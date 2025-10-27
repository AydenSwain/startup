import React from 'react';
import './chat.css';
import '../app.css';

export default function Chat({ chatHistory, setChatHistory }) {
	React.useEffect(() => {
		// Placeholder: Load chat history from a backend or local storage if needed
	}, []);


	return (
		<main className="white-rounded-box" style={{width: "75%", height: "400px", overflowY: "scroll"}}>
			<h2>Chat room</h2>
			<br />

			<div>
				{chatHistory.map((entry, index) => (
					<p key={index}><bold>{entry.sender}:</bold> {entry.message}</p>
				))}
			</div>

			<div style={{ textAlign: "right" }}>
				<input type="text" name="message" placeholder="Type message here..." />
			</div>
		</main>
	);
}""