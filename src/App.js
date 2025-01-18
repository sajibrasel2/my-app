import React from "react";
import { BrowserRouter as Router, Routes, Route, Link } from "react-router-dom";
import "./App.css";

function Home() {
  return (
    <div className="content">
      <h1>Welcome to the Home Page!</h1>
    </div>
  );
}

function Game() {
  return (
    <div className="content">
      <h1>Welcome to the Game Page!</h1>
    </div>
  );
}

function Airdrop() {
  return (
    <div className="content">
      <h1>Welcome to the Airdrop Page!</h1>
    </div>
  );
}

function PoweredByDogs() {
  return (
    <div className="powered-by-dogs">
      <h1>Powered By Dogs</h1>
    </div>
  );
}

function App() {
  return (
    <Router>
      <div>
        <Routes>
          <Route
            path="/"
            element={
              <>
                <PoweredByDogs />
                <Home />
              </>
            }
          />
          <Route path="/game" element={<Game />} />
          <Route path="/airdrop" element={<Airdrop />} />
        </Routes>
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>
          <Link to="/game" className="nav-link">Game</Link>
          <Link to="/airdrop" className="nav-link">Airdrop</Link>
        </nav>
      </div>
    </Router>
  );
}

export default App;
