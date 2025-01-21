import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift } from "react-icons/fa";
import "./App.css";
import TicTacToe from "./TicTacToe";
import Earn from "./Earn";
import Airdrop from "./Airdrop";
import Home from "./Home";

function App() {
  const [airdropBalance, setAirdropBalance] = useState(() => {
    // LocalStorage থেকে ব্যালেন্স রিট্রিভ করা
    const storedBalance = localStorage.getItem("airdropBalance");
    return storedBalance ? JSON.parse(storedBalance) : 0;
  });

  const [history, setHistory] = useState(() => {
    // LocalStorage থেকে হিস্টরি রিট্রিভ করা
    const storedHistory = localStorage.getItem("history");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const updateAirdropBalance = (points) => {
    setAirdropBalance((prev) => {
      const newBalance = prev + points;
      localStorage.setItem("airdropBalance", JSON.stringify(newBalance)); // Update localStorage
      return newBalance;
    });
  };

  const addHistory = (entry) => {
    const currentTime = new Date().toLocaleString();
    const updatedHistory = [...history, `${entry} (${currentTime})`];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory)); // Update localStorage
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route
            path="/earn"
            element={<Earn updateBalance={updateAirdropBalance} addHistory={addHistory} />}
          />
          <Route
            path="/game"
            element={<TicTacToe updateBalance={updateAirdropBalance} addHistory={addHistory} />}
          />
          <Route
            path="/airdrop"
            element={<Airdrop balance={airdropBalance} history={history} />}
          />
        </Routes>
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
