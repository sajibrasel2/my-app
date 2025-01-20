import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift } from "react-icons/fa";
import "./App.css";
import TicTacToe from "./TicTacToe";
import Earn from "./Earn";

function Home() {
  return (
    <div className="content">
      <h1 className="animated-text">Earn Rewards Easily by Exploring Our Features!</h1>
    </div>
  );
}

function Airdrop({ balance, history }) {
  return (
    <div className="content airdrop-section">
      <h1 className="section-title">Airdrop Rewards</h1>
      <div className="balance-card">
        <h2 className="balance-text">{balance} Points</h2>
        <p>Your total rewards balance.</p>
      </div>
      <div className="history-section">
        <h2>History</h2>
        {history.length > 0 ? (
          <ul>
            {history.map((entry, index) => (
              <li key={index}>{entry}</li>
            ))} {/* Show each history entry */}
          </ul>
        ) : (
          <p>No history yet.</p>
        )}
      </div>
    </div>
  );
}

function App() {
  const [airdropBalance, setAirdropBalance] = useState(0); // Tracks the Airdrop points balance
  const [history, setHistory] = useState([]); // Tracks the history of actions

  // Function to update the Airdrop balance
  const updateAirdropBalance = (points) => {
    setAirdropBalance((prev) => prev + points);
  };

  // Function to add entries to history
  const addHistory = (entry) => {
    const currentTime = new Date().toLocaleString(); // Add current date and time to the history entry
    setHistory((prev) => [...prev, `${entry} (${currentTime})`]);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          {/* Home Route */}
          <Route path="/" element={<Home />} />
          {/* Earn Route */}
          <Route
            path="/earn"
            element={<Earn updateBalance={updateAirdropBalance} addHistory={addHistory} />}
          />
          {/* Game Route */}
          <Route
            path="/game"
            element={<TicTacToe updateBalance={updateAirdropBalance} addHistory={addHistory} />}
          />
          {/* Airdrop Route */}
          <Route
            path="/airdrop"
            element={<Airdrop balance={airdropBalance} history={history} />}
          />
        </Routes>
        {/* Navbar for Navigation */}
        <nav className="navbar">
          <Link to="/" className="nav-link">
            <FaHome className="icon" />
            <span>Home</span>
          </Link>
          <Link to="/earn" className="nav-link">
            <FaCoins className="icon" />
            <span>Earn</span>
          </Link>
          <Link to="/game" className="nav-link">
            <FaGamepad className="icon" />
            <span>Game</span>
          </Link>
          <Link to="/airdrop" className="nav-link">
            <FaGift className="icon" />
            <span>Airdrop</span>
          </Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
