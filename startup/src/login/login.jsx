import React from 'react';
import './login.css';
import '../app.css';

export default function Login() {
  return (
    <main>
      <h2>Login or Create Account</h2>
      <form method="get">
          <div className="white-rounded-box">
              <label for="email">Email: </label>
              <input type="text" id="email" placeholder="your@email.com" />
          </div>
          <div className="white-rounded-box">
              <label for="password">Password: </label>
              <input type="password" id="password" placeholder="password" />
          </div>
          <br />

          <div className="white-rounded-box" style={{ textAlign: 'center' }}>
              <button type="submit">Login</button>
              <button type="submit">Create</button>
          </div>
      </form>
      <br />

      <span className="white-rounded-box" style={{ color: 'black', width: '75%', height: '300px' }}>Username: [---- Username from database -----]
          <br />
          <br />
          [---- Order info collected from database -----]
      </span>
      <br />                                                  
    </main>
  );
}