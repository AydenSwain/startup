import React from 'react';
import './login.css';
import '../app.css';
import { useNavigate } from 'react-router-dom';

export default function Login({ setEmail, setIsManager }) {
  const navigate = useNavigate();

  const handleSubmit = (event) => {
    event.preventDefault();
    const formData = new FormData(event.target);

    setEmail(formData.get('email'));
    localStorage.setItem('email', formData.get('email'));

    setIsManager(formData.get('isManager') === 'on');
    localStorage.setItem('isManager', formData.get('isManager') === 'on');

    navigate('/chat');
  };

  return (
    <main>
      <h2>Login to see chat history</h2>
      <form onSubmit={handleSubmit}>
          <div className="white-rounded-box">
              <label for="email">Email:</label>
              <input type="text" name="email" placeholder="your@email.com" />
          </div>
          <div className="white-rounded-box">
              <label for="password">Password: </label>
              <input type="password" name="password" placeholder="password" />
          </div>
          <div className="white-rounded-box">
            <label>
              <input type="checkbox" name="isManager" />
              Login as Manager
            </label>
          </div>
          <br />

          <div className="white-rounded-box" style={{ textAlign: 'center' }}>
              <button type="submit">Login</button>
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