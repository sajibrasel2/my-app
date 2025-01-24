import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift } from "react-icons/fa";
import "./App.css";
import TicTacToe from "./TicTacToe";
import Earn from "./Earn";
import Airdrop from "./Airdrop";
import Home from "./Home";

function App() {
  const [airdropBalance, setAirdropBalance] = useState(() => {
    const storedBalance = localStorage.getItem("airdropBalance");
    return storedBalance ? JSON.parse(storedBalance) : 0;
  });

  const [history, setHistory] = useState(() => {
    const storedHistory = localStorage.getItem("history");
    return storedHistory ? JSON.parse(storedHistory) : [];
  });

  const updateAirdropBalance = (points) => {
    setAirdropBalance((prev) => {
      const newBalance = prev + points;
      localStorage.setItem("airdropBalance", JSON.stringify(newBalance));
      return newBalance;
    });
  };

  const addHistory = (entry) => {
    const currentTime = new Date().toLocaleString();
    const updatedHistory = [...history, `${entry} (${currentTime})`];
    setHistory(updatedHistory);
    localStorage.setItem("history", JSON.stringify(updatedHistory));
  };

  const DynamicTitle = () => {
    const location = useLocation();
    useEffect(() => {
      const titles = {
        "/": "Home - Rewards App",
        "/earn": "Earn Rewards - Rewards App",
        "/game": "Play Game - Rewards App",
        "/airdrop": "Airdrop History - Rewards App",
      };
      document.title = titles[location.pathname] || "404 Not Found - Rewards App";
    }, [location]);
    return null;
  };

  const DynamicBackground = ({ children }) => {
    const location = useLocation();
    const getBackgroundClass = () => {
      switch (location.pathname) {
        case "/":
          return "home-background";
        case "/earn":
          return "earn-background";
        case "/game":
          return "game-background";
        case "/airdrop":
          return "airdrop-background";
        default:
          return "default-background";
      }
    };

    return <div className={getBackgroundClass()}>{children}</div>;
  };

  return (
    <Router>
      <div className="app">
        <DynamicTitle />
        <DynamicBackground>
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
            <Route path="*" element={<div className="not-found">404 - Page Not Found</div>} />
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
        </DynamicBackground>
      </div>
    </Router>
  );
}

export default App;
