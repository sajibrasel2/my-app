import React, { useState } from "react";
import "./PremiumFeature.css"; // CSS ফাইল লিঙ্ক করা হয়েছে

const PremiumFeature = () => {
  const [isPremium, setIsPremium] = useState(false);

  const unlockPremium = () => {
    // এখানে API কল বা সাবস্ক্রিপশন লজিক যোগ করতে পারেন
    setIsPremium(true);
  };

  return (
    <div className="premium-container">
      <h2 className="premium-title">
        {isPremium ? "Welcome to Premium Features!" : "Unlock Premium Features"}
      </h2>

      {isPremium ? (
        <div className="premium-content">
          <p>🌟 Access exclusive features and enjoy ad-free experience!</p>
          <p>💎 Premium tools for advanced analytics and rewards.</p>
          <button className="premium-button disabled">Already Subscribed</button>
        </div>
      ) : (
        <div className="premium-lock">
          <p>Upgrade to premium and unlock advanced tools.</p>
          <button className="premium-button" onClick={unlockPremium}>
            Unlock Now
          </button>
        </div>
      )}
    </div>
  );
};

export default PremiumFeature;
