import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // React Router ইমপোর্ট
import { FaHome, FaGamepad, FaCoins, FaGift } from 'react-icons/fa'; // React Icons ইমপোর্ট
import './App.css'; // CSS ফাইল

// Home পেজ
function Home() {
  return (
    <div className="content">
      <h1 className="animated-text">Earn Rewards Easily by Exploring Our Features!</h1> {/* অ্যানিমেটেড বার্তা */}
    </div>
  );
}

// Earn পেজ
function Earn() {
  return (
    <div className="content">
      <h1>Earn Rewards Here!</h1>
    </div>
  );
}

// Game পেজ
function Game() {
  return (
    <div style={styles.container}>
      <p>Game is loading...</p> {/* "Game is loading..." টেক্সট */}
    </div>
  );
}

// Airdrop পেজ
function Airdrop() {
  return (
    <div className="content">
      <h1>Claim your Airdrop!</h1>
    </div>
  );
}

// মূল অ্যাপ কম্পোনেন্ট
function App() {
  return (
    <Router>
      <div className="app">
        {/* রাউটস সেটআপ */}
        <Routes>
          <Route path="/" element={<Home />} /> {/* Home পেজ */}
          <Route path="/earn" element={<Earn />} /> {/* Earn পেজ */}
          <Route path="/game" element={<Game />} /> {/* Game পেজ */}
          <Route path="/airdrop" element={<Airdrop />} /> {/* Airdrop পেজ */}
        </Routes>

        {/* ন্যাভিগেশন বার */}
        <nav className="navbar">
          <Link to="/" className="nav-link">
            <FaHome className="icon" />
            <span>Home</span>
          </Link> {/* Home লিঙ্ক */}
          <Link to="/earn" className="nav-link">
            <FaCoins className="icon" />
            <span>Earn</span>
          </Link> {/* Earn লিঙ্ক */}
          <Link to="/game" className="nav-link">
            <FaGamepad className="icon" />
            <span>Game</span>
          </Link> {/* Game লিঙ্ক */}
          <Link to="/airdrop" className="nav-link">
            <FaGift className="icon" />
            <span>Airdrop</span>
          </Link> {/* Airdrop লিঙ্ক */}
        </nav>
      </div>
    </Router>
  );
}

const styles = {
  container: {
    display: 'flex',
    justifyContent: 'center',
    alignItems: 'center',
    height: '100vh', // পুরো স্ক্রিনের উচ্চতা দখল করবে
    textAlign: 'center',
  },
};

export default App;
