import React from 'react';
import './home.css';
import '../app.css';
import { useNavigate } from 'react-router-dom';

export default function Home() {
  const navigate = useNavigate();

  return (
    <main>
        <img className="opening-photo" src="opening-photo.jpeg" alt="Dumpster truck" />
        <br />

        <h2>Which size works best?</h2>
        <div>
            <div className="white-rounded-box">
                <img style={{ width: '150px' }} src="dumpster.jpeg" alt="A small green dumpster" />
                <p>10 Yard Dumpster</p>
            </div>
            <div className="white-rounded-box">
                <img src="dumpster.jpeg" alt="A large green dumpster" />
                <p>20 Yard Dumpster</p>
            </div>
        </div>
        <br />

        <h2>Find us on the map!</h2>
        <div className="white-rounded-box">
          <img className="google-maps-placeholder" src="google-maps-placeholder.png" alt="Google Maps placeholder" />
        </div>
        <br />

      <h2>Chat with us to secure an order!</h2>
      <button onClick={() => navigate('/chat')}>Go to Chat</button>
      <br />
    </main>
  );
}