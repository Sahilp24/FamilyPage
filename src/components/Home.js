// components/Home.js
import React from 'react';
import { Link } from 'react-router-dom';
import './Home.css'; // Import a separate CSS file for styling

function Home() {
  return (
    <div className="home-container">
      <h2>Welcome to the Home Page!</h2>
      <p>Choose an option:</p>
      
      <div className="button-container">
        <Link to="/recipe" className="button">
          Go to Recipe
        </Link>

        <Link to="/travel" className="button">
          Go to Travel
        </Link>
      </div>
    </div>
  );
}

export default Home;
