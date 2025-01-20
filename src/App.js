import React, { useState, useEffect } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift } from "react-icons/fa";
import "./App.css";

// Home পেজ
function Home() {
  return (
    <div className="content">
      <h1 className="animated-text">
        Earn Rewards Easily by Exploring Our Features!
      </h1>
    </div>
  );
}

// Earn পেজ
function Earn() {
  const initialQuestions = [
    { id: 1, text: "What is 2 + 2?", options: ["3", "4"], correct: "4" },
    { id: 2, text: "What is the capital of France?", options: ["Paris", "London"], correct: "Paris" },
    { id: 3, text: "What is 5 x 3?", options: ["15", "10"], correct: "15" },
    { id: 4, text: "What is the color of the sky?", options: ["Blue", "Green"], correct: "Blue" },
    { id: 5, text: "How many days in a week?", options: ["5", "7"], correct: "7" },
    { id: 6, text: "Which planet is closest to the Sun?", options: ["Mercury", "Mars"], correct: "Mercury" },
  ];

  const [questions, setQuestions] = useState(initialQuestions);
  const [userAnswers, setUserAnswers] = useState({});
  const [score, setScore] = useState(0);
  const [lastAttemptTime, setLastAttemptTime] = useState(null);

  // ৬ ঘণ্টা পর প্রশ্ন আপডেট করা
  useEffect(() => {
    const now = new Date().getTime();
    const sixHours = 6 * 60 * 60 * 1000;

    if (!lastAttemptTime || now - lastAttemptTime >= sixHours) {
      setQuestions(initialQuestions);
      setUserAnswers({});
      setLastAttemptTime(now);
    }
  }, [lastAttemptTime]);

  const handleAnswer = (id, selectedOption) => {
    if (userAnswers[id]) return; // একটি প্রশ্নের জন্য শুধুমাত্র একবার উত্তর দিতে পারবে
    setUserAnswers({ ...userAnswers, [id]: selectedOption });

    if (selectedOption === questions.find((q) => q.id === id).correct) {
      setScore(score + 5);
    }
  };

  return (
    <div className="content earn-section">
      <h1 className="section-title">Earn Rewards by Answering Questions!</h1>
      <p>Total Earned Points: {score}</p>
      <div className="questions-container">
        {questions.map((q) => (
          <div key={q.id} className="question-card">
            <p className="question-text">{q.text}</p>
            <div className="options-container">
              {q.options.map((option) => (
                <button
                  key={option}
                  className={`option-button ${
                    userAnswers[q.id] === option
                      ? option === q.correct
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
                  onClick={() => handleAnswer(q.id, option)}
                  disabled={!!userAnswers[q.id]} // যদি উত্তর দেওয়া থাকে তবে বাটন নিষ্ক্রিয়
                >
                  {option}
                </button>
              ))}
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}

// Airdrop পেজ
function Airdrop() {
  const [balance] = useState(0); // Claim অপশন বাদ দেওয়া হয়েছে

  return (
    <div className="content airdrop-section">
      <h1 className="section-title">Airdrop Rewards!</h1>
      <div className="balance-card">
        <h2 className="balance-text">{balance} Points</h2>
        <p className="balance-description">Your total rewards balance.</p>
      </div>
    </div>
  );
}

// Game পেজ
function Game() {
  return (
    <div style={styles.container}>
      <p>Game is loading...</p>
    </div>
  );
}

// মূল অ্যাপ কম্পোনেন্ট
function App() {
  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn />} />
          <Route path="/game" element={<Game />} />
          <Route path="/airdrop" element={<Airdrop />} />
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

const styles = {
  container: {
    display: "flex",
    justifyContent: "center",
    alignItems: "center",
    height: "100vh",
    textAlign: "center",
  },
};

export default App;
