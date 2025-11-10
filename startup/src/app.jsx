import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';
import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';

import Home from './home/home.jsx';
import Login from './login/login.jsx';
import Chat from './chat/chat.jsx';

export default function App() {
    const [email, setEmail] = useState(localStorage.getItem('email') || null);

  const handleSignOut = () => {
    fetch(`/api/auth/logout`, {
        method: 'delete',
    })
        .catch(() => {
            // Logout failed. Assuming offline
        })
        .finally(() => {
            localStorage.removeItem('email');
            setEmail(null);
        });
  };
    

    return (
        <BrowserRouter>
            <div>
                <header>
                    <h1>Green Dumpster Co.</h1>

                    <nav>
                        <NavLink to="/">Home</NavLink>
                        {email && <NavLink to="/chat">Chat</NavLink>}
                        {!email ? (
                            <NavLink className="account" to="/login">Login</NavLink>
                        ) : (
                            <button className="account" onClick={handleSignOut}>Sign out</button>
                        )}
                    </nav>

                    <hr />
                </header>

                <main>
                    <Routes>
                        <Route path="/" element={<Home />} />
                        <Route
                            path="/login"
                            element={<Login email={email} setEmail={setEmail} />}
                        />
                        <Route
                            path="/chat"
                            element={email ? (
                                <Chat email={email} />
                            ) : (
                                <h2>
                                    Login to chat
                                    <br />
                                    <NavLink to="/login">Go to Login</NavLink>
                                </h2>
                            )}
                        />
                        <Route path="*" element={<NotFound />} />
                    </Routes>
                </main>

                <footer>
                    <hr />
                    <span>Ayden Swain's repo:</span>
                    <br />
                    <a href="https://github.com/AydenSwain/startup">GitHub</a>
                </footer>
            </div>
        </BrowserRouter>
    );
}

function NotFound() {
  return <p>404: Return to sender. Address unknown.</p>;
}