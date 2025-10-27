import React from 'react';
import './chat.css';
import '../app.css';

export default function Chat({ chatHistory, setChatHistory }) {
	React.useEffect(() => {
		if (chatHistory && chatHistory.length > 0) {
			localStorage.setItem('chatHistory', JSON.stringify(chatHistory));
		}
	}, [chatHistory]);
	
	const managerMessages = [
		{ sender: "Manager", message: "Hello, how can I assist you today?" },
		{ sender: "Manager", message: "We have a special discount on our 20 Yard Dumpster this week!" },
		{ sender: "Manager", message: "Our operating hours are from 8 AM to 6 PM, Monday to Saturday." },
		{ sender: "Manager", message: "Feel free to ask any questions about our services." }
	];

	const sendRandomMessage = () => {
		const randomIndex = Math.floor(Math.random() * managerMessages.length);
		const randomMessage = managerMessages[randomIndex];
		setChatHistory(chatHistory => [...chatHistory, randomMessage]);
	};

	React.useEffect(() => {
		sendRandomMessage();
		const intervalId = setInterval(() => {
			sendRandomMessage();
		}, 5000);

		return () => clearInterval(intervalId);
	}, []);
	
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
				<input type="text" name="message" autoComplete="off" placeholder="Type message here..." />
			</div>
		</main>
	);
}""