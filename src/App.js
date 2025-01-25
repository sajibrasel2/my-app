import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link, useLocation } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift, FaLink } from "react-icons/fa";
import "./App.css";
import TicTacToe from "./TicTacToe";
import Earn from "./Earn";
import Airdrop from "./Airdrop";
import Home from "./Home";
import ReferralLink from "./ReferralLink"; // Updated import

import { collection, addDoc, doc, updateDoc, increment } from "firebase/firestore";
import db from "./firebase"; // Firestore instance

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

  const generateAndSaveReferralLink = async (userId) => {
    const botUsername = "Profitbridgebot";
    const link = `https://t.me/${botUsername}?start=${userId}`;

    try {
      await addDoc(collection(db, "referrals"), {
        userId: userId,
        referralLink: link,
        referralCount: 0,
        points: 0,
        referredUsers: [],
      });

      console.log("Referral link saved to Firestore!");
      setReferralLink(link); // Set the state
    } catch (error) {
      console.error("Error saving referral link: ", error);
    }
  };

  const updateAirdropBalance = async (points) => {
    setAirdropBalance((prev) => {
      const newBalance = prev + points;
      localStorage.setItem("airdropBalance", JSON.stringify(newBalance));
      return newBalance;
    });

    try {
      const userDoc = doc(db, "referrals", "document_id_here"); // Replace with actual document ID
      await updateDoc(userDoc, {
        points: increment(points),
      });
      console.log("Airdrop balance updated in Firestore!");
    } catch (error) {
      console.error("Error updating airdrop balance: ", error);
    }
  };

  useEffect(() => {
    const userId = 123456; // Example User ID, replace with real user ID
    generateAndSaveReferralLink(userId);
  }, []);

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
            <Route
              path="/referral"
              element={
                <ReferralLink
                  userId="123456"
                  updateAirdropBalance={(points) =>
                    setAirdropBalance((prev) => prev + points)
                  }
                />
              }
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
