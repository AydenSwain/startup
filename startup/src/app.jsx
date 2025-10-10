import React from 'react';
import 'bootstrap/dist/css/bootstrap.min.css';
import './app.css';

import { BrowserRouter, Route, Routes, NavLink } from 'react-router-dom';
import Home from './home/Home.jsx';
import Login from './login/Login.jsx';
import Chat from './chat/Chat.jsx';

export default function App() {
  return (
    <BrowserRouter>
        <div>
            <header>
                <h1>Green Dumpster Co.</h1>

                <nav>
                    <NavLink to="/">Home</NavLink>
                    <NavLink to="/login">Login</NavLink>
                    <NavLink to="/chat">Chat</NavLink>
                </nav>

                <hr />
            </header>

            <main>
                <Routes>
                    <Route path="/" element={<Home />} />
                    <Route path="/login" element={<Login />} />
                    <Route path="/chat" element={<Chat />} />
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