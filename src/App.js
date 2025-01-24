import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift, FaLink } from "react-icons/fa";
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

  const [referralLink, setReferralLink] = useState("");

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

  const generateReferralLink = (userId) => {
    const botUsername = "Profitbridgebot";
    return `https://t.me/${botUsername}?start=${userId}`;
  };

  useEffect(() => {
    const userId = 123456; // Example User ID, replace with real user ID
    const link = generateReferralLink(userId);
    setReferralLink(link);
  }, []);

  const DynamicTitle = () => {
    const location = useLocation();
    useEffect(() => {
      const titles = {
        "/": "Home - Rewards App",
        "/earn": "Earn Rewards - Rewards App",
        "/game": "Play Game - Rewards App",
        "/airdrop": "Airdrop History - Rewards App",
        "/referral": "Referral Link - Rewards App",
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
        case "/referral":
          return "referral-background";
        default:
          return "default-background";
      }
    };

    return <div className={getBackgroundClass()}>{children}</div>;
  };

  const Referral = () => (
    <div className="referral-container">
      <div className="referral-card">
        <h3 className="referral-title">🎉 Share & Earn Rewards!</h3>
        {referralLink ? (
          <>
            <p className="referral-instruction">
              Share the link below with your friends and earn rewards when they join!
            </p>
            <div className="referral-link-box">
              <input
                type="text"
                value={referralLink}
                readOnly
                className="referral-link-input"
              />
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  alert("Referral link copied!");
                }}
              >
                Copy
              </button>
            </div>
          </>
        ) : (
          <p className="loading-text">Loading referral link...</p>
        )}
      </div>
    </div>
  );

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
            <Route path="/referral" element={<Referral />} />
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
            <Link to="/referral" className="nav-link">
              <FaLink className="icon" />
              <span>Referral</span>
            </Link>
          </nav>
        </DynamicBackground>
      </div>
    </Router>
  );
}

export default App;
