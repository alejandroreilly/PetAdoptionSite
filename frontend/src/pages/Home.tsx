import React from 'react';
import { useNavigate } from 'react-router-dom';
import '../App.css';

const Home: React.FC = () => {
  const navigate = useNavigate();

  const handleAdoptNow = () => {
    navigate('/pets');
  };

  return (
    <div className="home-container">
      <div className="home-content">
        <h1 className="home-title">Welcome to Adopt-A-Pet!</h1>
        <h2 className="home-subtitle">Meet Your Best Friend Today!</h2>
        <button className="home-button" onClick={handleAdoptNow}>
          Adopt Now
        </button>
      </div>
    </div>
  );
};

export default Home;