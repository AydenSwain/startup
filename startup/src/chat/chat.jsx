import React from 'react';
import './chat.css';
import '../app.css';

export default function Chat({ email }) {
	const [isManager, setIsManager] = React.useState([false]);
	

	React.useEffect(() => {
		fetch('/api/isManager')
			.then(res => res.json())
			.then(data => setIsManager(data))
			.catch(err => console.error(err));

		const protocol = window.location.protocol === 'http:' ? 'ws' : 'wss';
		this.socket = new WebSocket(`${protocol}://${window.location.host}/ws`);

	}, []);

	{
		!isManager ? (
			<managerChat email={email} webSocket={new chatWS()}></managerChat>
		) : (
			<clientChat email={email} webSocket={new chatWS()}></clientChat>
		)
	}
}