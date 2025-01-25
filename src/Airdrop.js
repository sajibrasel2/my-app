import React from "react";
import "./Airdrop.css";

const Airdrop = ({ balance, history }) => {
  return (
    <div className="airdrop-container">
      <div className="airdrop-card">
        <h3 className="airdrop-title">💰 Airdrop Balance</h3>
        <p className="airdrop-balance">Your Balance: {balance} Points</p>

        <h3 className="history-title">📜 History</h3>
        {history.length > 0 ? (
          <ul className="history-list">
            {history.map((entry, index) => (
              <li
                key={index}
                className={`history-item ${
                  index % 2 === 0 ? "primary-item" : "secondary-item"
                }`}
              >
                {entry}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-history-text">No history available.</p>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
