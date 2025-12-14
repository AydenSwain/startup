import React from 'react';
import './chat.css';
import '../app.css';
import ClientChat from './clientChat';
import ManagerChat from './managerChat';
import ChatWS from './chatWS';

export default function Chat({ email }) {
	const [isManager, setIsManager] = React.useState(false);
	const [webSocket, setWebSocket] = React.useState(null);
	const [loading, setLoading] = React.useState(true);
	const [error, setError] = React.useState(null);

	React.useEffect(() => {
		// First check if user is authenticated and get manager status
		fetch('/api/isManager')
			.then(res => {
				if (!res.ok) {
					throw new Error('Not authenticated');
				}
				return res.json();
			})
			.then(data => {
				setIsManager(data);
				// Only create WebSocket after confirming authentication
				const ws = new ChatWS();
				setWebSocket(ws);
				setLoading(false);
			})
			.catch(err => {
				console.error('Auth check failed:', err);
				setError('Authentication failed. Please log in again.');
				setLoading(false);
			});

		return () => {
			// Cleanup WebSocket on unmount
			if (webSocket && webSocket.socket) {
				webSocket.socket.close();
			}
		};
	}, []);

	if (loading) {
		return <div>Connecting...</div>;
	}

	if (error) {
		return <div style={{color: 'red'}}>{error}</div>;
	}

	if (!webSocket) {
		return <div>Failed to connect. Please refresh the page.</div>;
	}

	return isManager ? (
		<ManagerChat email={email} webSocket={webSocket} />
	) : (
		<ClientChat email={email} webSocket={webSocket} />
	);
}