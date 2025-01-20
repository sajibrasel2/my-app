import React, { useState } from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import { FaHome, FaGamepad, FaCoins, FaGift } from "react-icons/fa";
import "./App.css"; // CSS ফাইল

// Home পেজ
function Home() {
  return (
    <div className="content">
      <h1 className="animated-text">Earn Rewards Easily by Exploring Our Features!</h1>
    </div>
  );
}

// Earn পেজ
function Earn({ updateBalance }) {
  const [questions, setQuestions] = useState([
    { id: 1, question: "What is 2 + 2?", options: ["3", "4"], correct: "4" },
    { id: 2, question: "What is the capital of France?", options: ["Paris", "Berlin"], correct: "Paris" },
    { id: 3, question: "What is 5 * 6?", options: ["30", "60"], correct: "30" },
    { id: 4, question: "Which is a fruit?", options: ["Carrot", "Apple"], correct: "Apple" },
    { id: 5, question: "What is 10 / 2?", options: ["5", "10"], correct: "5" },
    { id: 6, question: "What color is the sky?", options: ["Blue", "Green"], correct: "Blue" },
  ]);

  const [answeredQuestions, setAnsweredQuestions] = useState({});

  const handleAnswer = (questionId, selectedOption) => {
    if (answeredQuestions[questionId]) return;

    const question = questions.find((q) => q.id === questionId);

    if (question.correct === selectedOption) {
      updateBalance(5);
    }

    setAnsweredQuestions((prev) => ({
      ...prev,
      [questionId]: selectedOption,
    }));
  };

  return (
    <div className="earn-section">
      <h1 className="section-title">Daily Reward Questions</h1>
      <div className="questions-container">
        {questions.map((question) => (
          <div key={question.id} className="question-card">
            <h4 className="question-text">{question.question}</h4>
            <div className="options-container">
              {question.options.map((option) => (
                <button
                  key={option}
                  onClick={() => handleAnswer(question.id, option)}
                  disabled={answeredQuestions[question.id]}
                  className={`option-button ${
                    answeredQuestions[question.id] === option
                      ? option === question.correct
                        ? "correct"
                        : "incorrect"
                      : ""
                  }`}
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

// Game পেজ
function Game() {
  return (
    <div className="content">
      <p>Game is loading...</p>
    </div>
  );
}

// Airdrop পেজ
function Airdrop({ balance }) {
  return (
    <div className="airdrop-section">
      <h1 className="section-title">Your Airdrop Balance</h1>
      <div className="balance-card">
        <h2 className="balance-text">{balance} Points</h2>
        <p className="balance-description">
          Keep answering questions daily to earn more points!
        </p>
      </div>
    </div>
  );
}

// মূল অ্যাপ কম্পোনেন্ট
function App() {
  const [balance, setBalance] = useState(0);

  const updateBalance = (points) => {
    setBalance((prevBalance) => prevBalance + points);
  };

  return (
    <Router>
      <div className="app">
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/earn" element={<Earn updateBalance={updateBalance} />} />
          <Route path="/game" element={<Game />} />
          <Route path="/airdrop" element={<Airdrop balance={balance} />} />
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
