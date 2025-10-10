import React from 'react';
import './home.css';
import '../app.css';

export default function Home() {
  return (
    <main>
        <img className="opening-photo" src="opening-photo.jpeg" alt="Dumpster truck" />
        <br />

        <h2>Pick a size</h2>
        <div>
            <div className="white-rounded-box">
                <img style={{ width: '150px' }} src="dumpster.jpeg" alt="A small green dumpster" />
            </div>
            <div className="white-rounded-box">
                <img src="dumpster.jpeg" alt="A large green dumpster" />
            </div>
        </div>
        <br />

        <p className="white-rounded-box" style={{ color: 'black', width: '75%', height: '300px' }}>[---- 3rd party payment here -----]</p>
        <br />
    </main>
  );
}