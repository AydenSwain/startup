import React, { useState } from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, Route, Routes, NavLink, useNavigate } from 'react-router-dom';
import Home from './home/Home.jsx';
import Login from './login/Login.jsx';
import Chat from './chat/Chat.jsx';

export default function App() {
const [email, setEmail] = useState(localStorage.getItem('email') || null);
const [isManager, setIsManager] = useState(localStorage.getItem('isManager') === 'true');

const handleSignOut = () => {
    localStorage.removeItem('email');
    localStorage.removeItem('isManager');
    setEmail(null);
    setIsManager(false);
};
    

return (
    <BrowserRouter>
        <div>
            <header>
                <h1>Green Dumpster Co.</h1>

                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/chat">Chat</NavLink>
                    {!email ? (<NavLink className="account" to="/login">Login</NavLink>)
                              : (<button className="account" onClick={handleSignOut}>Sign out</button>)}
                </nav>

                <hr />
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login email={email} setEmail={setEmail} isManager={isManager} setIsManager={setIsManager} />} />
                    <Route path="/chat" element={!email ? (<h2>Login to chat<br /><NavLink to="/login">Go to Login</NavLink></h2>) : (<Chat />)} />
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