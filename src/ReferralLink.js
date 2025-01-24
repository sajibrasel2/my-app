import React, { useState, useEffect } from "react";
import "./ReferralLink.css"; // CSS ফাইল ইম্পোর্ট

const ReferralLink = ({ userId }) => {
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const generateReferralLink = () => {
      // Replace this logic with your API endpoint if needed
      const botUsername = "Profitbridgebot";
      return `https://t.me/${botUsername}?start=${userId}`;
    };

    const link = generateReferralLink();
    setReferralLink(link);
    setLoading(false);
  }, [userId]);

  return (
    <div className="referral-container">
      <div className="referral-card">
        <h3 className="referral-title">🎉 Share & Earn Rewards!</h3>
        {loading ? (
          <p className="loading-text">Generating your referral link...</p>
        ) : (
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
                  alert("Referral link copied to clipboard!");
                }}
              >
                Copy
              </button>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralLink;
