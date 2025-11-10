import React from 'react';
import './login.css';
import '../app.css';
import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';
import { useNavigate } from 'react-router-dom';

export default function Login({ email, setEmail }) {
	const [tempEmail, setTempEmail] = React.useState(email || '');
	const [password, setPassword] = React.useState('');
	const [isManager, setIsManager] = React.useState(false);
	const [displayError, setDisplayError] = React.useState(null);
	const navigate = useNavigate();

	async function loginUser() {
		const success = await loginOrCreate(`/api/auth/login`);
		if (success && email) {
			navigate('/chat');
		}
	}


	async function createUser() {
		const success = await loginOrCreate(`/api/auth/create`);
		if (success && email) {
			navigate('/chat');
		}
	}


		async function loginOrCreate(endpoint) {
			const response = await fetch(endpoint, {
				method: 'POST',
				body: JSON.stringify({ email: tempEmail, password: password, isManager: isManager }),
				headers: {
					'Content-Type': 'application/json; charset=UTF-8',
				},
			});

			if (response.ok) {
				localStorage.setItem('email', tempEmail);
				setEmail(tempEmail);
				return;
			}

			// Try to extract a helpful error message without assuming JSON
			let message = `HTTP ${response.status} ${response.statusText}`;
			try {
				const ct = response.headers.get('content-type') || '';
				if (ct.includes('application/json')) {
					const body = await response.json();
					if (body?.msg) message = body.msg;
				} else {
					const text = await response.text();
					if (text) message = text.substring(0, 200);
				}
			} catch {}
			setDisplayError(`⚠ Error: ${message}`);
		}

	return (
		<>
			<h2>Login to see chat history</h2>
			<div className="white-rounded-box">
				<label>Email:</label>
				&nbsp;
				<input type="text" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} placeholder="your@email.com" />
			</div>
			<div className="white-rounded-box">
				<label>Password: </label>
				&nbsp;
				<input type="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
			</div>
			<div className="white-rounded-box">
				<label>
					<input type="checkbox" onChange={(e) => setIsManager(e.target.checked)} />
					&nbsp;
					Login as Manager
				</label>
			</div>
			<br />
			

			<div>
				<Button variant='secondary' onClick={loginUser} disabled={!tempEmail || !password}>
					Login
				</Button>
				&nbsp; &nbsp;
				<Button variant='secondary' onClick={createUser} disabled={!tempEmail || !password}>
					Register
				</Button>

			</div>
			<br />

			<MessageDialog message={displayError} onHide={() => setDisplayError(null)} />
		</>
	);
}