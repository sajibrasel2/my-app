const Airdrop = ({ balance, history }) => {
    return (
      <div className="content airdrop-section">
        <h1 className="section-title">Airdrop Rewards</h1>
        <div className="balance-card">
          <h2 className="balance-text">{balance} Points</h2>
          <p>Your total rewards balance.</p>
        </div>
        <div className="history-section">
          <h2>History</h2>
          {history.length > 0 ? (
            <ul>
              {history.map((entry, index) => (
                <li key={index}>{entry}</li>
              ))}
            </ul>
          ) : (
            <p>No history yet.</p>
          )}
        </div>
      </div>
    );
  };
  