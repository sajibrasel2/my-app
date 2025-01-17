import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";

function Home() {
  return <h1>Welcome to the Home Page!</h1>;
}

function Game() {
  return <h1>Welcome to the Game Page!</h1>;
}

function Airdrop() {
  return <h1>Welcome to the Airdrop Page!</h1>;
}

function App() {
  return (
    <Router>
      <div>
        <ul>
          <li><Link to="/">Home</Link></li>
          <li><Link to="/game">Game</Link></li>
          <li><Link to="/airdrop">Airdrop</Link></li>
        </ul>
        <Routes>
          <Route path="/" element={<Home />} />
          <Route path="/game" element={<Game />} />
          <Route path="/airdrop" element={<Airdrop />} />
        </Routes>
      </div>
    </Router>
  );
}

export default App;