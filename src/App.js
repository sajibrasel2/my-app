import React from 'react';
import { BrowserRouter as Router, Routes, Route, Link } from 'react-router-dom'; // React Router ইমপোর্ট
import './App.css'; // CSS ফাইল

// Home পেজ
function Home() {
  return (
    <div className="content">
    </div>
  );
}

// Game পেজ
function Game() {
  return (
    <div style={styles.container}>
      <p>Game is loading...</p>  {/* "Game is loading..." টেক্সট*/}
    </div>
  );
}

// Airdrop পেজ
function Airdrop() {
  return (
    <div className="content">
      <h1>Welcome to the Airdrop Page!</h1>
    </div>
  );
}

// PoweredByDogs কম্পোনেন্ট
function PoweredByDogs() {
  return (
    <div className="powered-by-dogs">
      <h1>Powered By Dogs</h1>
    </div>
  );
}

// মূল অ্যাপ কম্পোনেন্ট
function App() {
  return (
    <Router>
      <div>
        {/* রাউটস সেটআপ */}
        <Routes>
          <Route path="/" element={
            <>
              <PoweredByDogs />  {/* PoweredByDogs কম্পোনেন্ট প্রথমে */}
              <Home />  {/* Home পেজ */}
            </>
          } />
          <Route path="/game" element={<Game />} />  {/* Game পেজ */}
          <Route path="/airdrop" element={<Airdrop />} />  {/* Airdrop পেজ */}
        </Routes>

        {/* ন্যাভিগেশন বার */}
        <nav className="navbar">
          <Link to="/" className="nav-link">Home</Link>  {/* Home লিঙ্ক */}
          <Link to="/game" className="nav-link">Game</Link>  {/* Game লিঙ্ক */}
          <Link to="/airdrop" className="nav-link">Airdrop</Link>  {/* Airdrop লিঙ্ক */}
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
    height: '100vh',  // পুরো স্ক্রিনের উচ্চতা দখল করবে
    textAlign: 'center',
  },
};

export default App;
