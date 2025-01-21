import React from "react";
import "./Airdrop.css";

const Airdrop = ({ balance, history }) => {
  return (
    <div className="airdrop-content">
      <h1 className="section-title">Airdrop Rewards</h1>

      {/* Balance Section */}
      <div className="balance-section">
        <h2 className="balance-amount">{balance} Points</h2>
        <p className="balance-text">Your total rewards balance.</p>
      </div>

      {/* History Section */}
      <div className="history-section">
        <h2 className="history-title">History</h2>
        {history.length > 0 ? (
          <ul className="history-list">
            {history.map((entry, index) => (
              <li
                key={index}
                className={`history-item ${
                  entry.toLowerCase().includes("earn")
                    ? "earn-history"
                    : "game-history"
                }`}
              >
                {entry}
              </li>
            ))}
          </ul>
        ) : (
          <p className="no-history-text">No history yet.</p>
        )}
      </div>
    </div>
  );
};

export default Airdrop;
