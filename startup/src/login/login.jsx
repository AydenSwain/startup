import React from 'react';
import './login.css';
import '../app.css';
import Button from 'react-bootstrap/Button';
import { MessageDialog } from './messageDialog';

export default function Login({ email, setEmail }) {
	const [tempEmail, setTempEmail] = React.useState(email || '');
	const [password, setPassword] = React.useState('');
	const [isManager, setIsManager] = React.useState(false);
	const [displayError, setDisplayError] = React.useState(null);

	async function loginUser() {
		loginOrCreate(`/api/auth/login`);
	}

	async function createUser() {
		loginOrCreate(`/api/auth/create`);
	}

	async function loginOrCreate(endpoint) {
		const response = await fetch(endpoint, {
			method: 'post',
			body: JSON.stringify({ email: tempEmail, password: password, isManager: isManager }),
			headers: {
				'Content-type': 'application/json; charset=UTF-8',
			},
		});
		if (response?.status === 200) {
			localStorage.setItem('email', tempEmail);
			setEmail(tempEmail);
		} else {
			const body = await response.json();
			setDisplayError(`⚠ Error: ${body.msg}`);
		}
	}

	return (
		<>
			<h2>Login to see chat history</h2>
			<div className="white-rounded-box">
				<label htmlFor="email">Email:</label>
				<input type="text" name="email" value={tempEmail} onChange={(e) => setTempEmail(e.target.value)} placeholder="your@email.com" />
			</div>
			<div className="white-rounded-box">
				<label htmlFor="password">Password: </label>
				<input type="password" name="password" value={password} onChange={(e) => setPassword(e.target.value)} placeholder="password" />
			</div>
			<div className="white-rounded-box">
				<label>
					<input type="checkbox" name="isManager" onChange={(e) => setIsManager(e.target.checked)} />
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