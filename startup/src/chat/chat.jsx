import React from 'react';
import './chat.css';
import '../app.css';

export default function Chat() {
  return (
    <main className="white-rounded-box">
        <p>[---- Chat history will appear here -----]</p>
        <input type="text" name="message" placeholder="Type message here..." />
    </main>
  );
}