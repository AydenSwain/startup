import React from 'react';
import './chat.css';
import '../app.css';
import ClientChat from './clientChat';
import ManagerChat from './managerChat';
import ChatWS from './chatWS';

export default function Chat({ email }) {
	const [isManager, setIsManager] = React.useState(false);
	const [webSocket, setWebSocket] = React.useState(null);

	React.useEffect(() => {
		fetch('/api/isManager')
			.then(res => res.json())
			.then(data => setIsManager(data))
			.catch(err => console.error(err));

		// Initialize WebSocket once
		const ws = new ChatWS();
		setWebSocket(ws);

		return () => {
			// Cleanup WebSocket on unmount
			if (ws && ws.socket) {
				ws.socket.close();
			}
		};
	}, []);

	if (!webSocket) {
		return <div>Connecting...</div>;
	}

	return isManager ? (
		<ManagerChat email={email} webSocket={webSocket} />
	) : (
		<ClientChat email={email} webSocket={webSocket} />
	);
}