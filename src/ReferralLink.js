import React, { useState, useEffect } from "react";
import "./ReferralLink.css";
import { doc, setDoc, getDoc, updateDoc, increment } from "firebase/firestore";
import db from "./firebase";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faCopy, faShareAlt } from "@fortawesome/free-solid-svg-icons";
import { faWhatsapp, faFacebook, faTwitter, faTelegram } from "@fortawesome/free-brands-svg-icons";

const ReferralLink = ({ userId, updateAirdropBalance }) => {
  const [referralLink, setReferralLink] = useState("");
  const [loading, setLoading] = useState(true);
  const [referralCount, setReferralCount] = useState(0);
  const [bonuses, setBonuses] = useState([
    { id: 1, requirement: 5, points: 1000, claimed: false },
    { id: 2, requirement: 20, points: 4500, claimed: false },
    { id: 3, requirement: 50, points: 12000, claimed: false },
    { id: 4, requirement: 100, points: 30000, claimed: false },
    { id: 5, requirement: 200, points: 60000, claimed: false },
  ]);

  useEffect(() => {
    const fetchReferralData = async () => {
      if (!userId) {
        console.error("User ID not provided!");
        setLoading(false);
        return;
      }

      const docRef = doc(db, "referrals", userId);

      try {
        const docSnap = await getDoc(docRef);
        if (docSnap.exists()) {
          const data = docSnap.data();
          setReferralLink(data.referralLink);
          setReferralCount(data.referralCount || 0);

          const updatedBonuses = bonuses.map((bonus) => ({
            ...bonus,
            claimed: data[`bonus_${bonus.id}_claimed`] || false,
          }));
          setBonuses(updatedBonuses);
        } else {
          const botUsername = "Profitbridgebot";
          const link = `https://t.me/${botUsername}?start=${userId}`;
          await setDoc(docRef, {
            userId: userId,
            referralLink: link,
            referralCount: 0,
          });
          setReferralLink(link);
        }
      } catch (error) {
        console.error("Error fetching referral data:", error.message);
      } finally {
        setLoading(false);
      }
    };

    fetchReferralData();
  }, [userId, bonuses]);

  const claimBonus = async (bonusId, points) => {
    const selectedBonus = bonuses.find((bonus) => bonus.id === bonusId);
    if (!selectedBonus || selectedBonus.claimed || referralCount < selectedBonus.requirement) {
      alert("You do not meet the requirements for this bonus.");
      return;
    }

    try {
      const docRef = doc(db, "referrals", userId);
      await updateDoc(docRef, {
        [`bonus_${bonusId}_claimed`]: true,
        points: increment(points),
      });

      updateAirdropBalance(points);

      setBonuses((prevBonuses) =>
        prevBonuses.map((bonus) =>
          bonus.id === bonusId ? { ...bonus, claimed: true } : bonus
        )
      );

      alert(`Bonus of ${points} points claimed successfully!`);
    } catch (error) {
      console.error("Error claiming bonus:", error.message);
    }
  };

  return (
    <div className="referral-container">
      <div className="referral-card">
        <h3 className="referral-title">🎉 Share & Earn Rewards!</h3>
        {loading ? (
          <p className="loading-text">Generating your referral link...</p>
        ) : (
          <>
            <p className="referral-instruction">
              Share the link below with your friends and earn rewards!
            </p>
            <div className="referral-link-box">
              <input type="text" value={referralLink} readOnly className="referral-link-input" />
              <button
                className="copy-button"
                onClick={() => {
                  navigator.clipboard.writeText(referralLink);
                  alert("Referral link copied to clipboard!");
                }}
              >
                <FontAwesomeIcon icon={faCopy} /> Copy
              </button>
            </div>
            <p className="referral-count">👥 Total Referrals: {referralCount}</p>

            <div className="bonus-section">
              <h3>🎁 Referral Bonuses</h3>
              <ul className="bonus-list">
                {bonuses.map((bonus) => (
                  <li key={bonus.id} className="bonus-item">
                    <p>
                      Refer <strong>{bonus.requirement}</strong> people to claim{" "}
                      <strong>{bonus.points} points</strong>.
                    </p>
                    {bonus.claimed ? (
                      <button className="claimed-button" disabled>
                        Claimed
                      </button>
                    ) : referralCount >= bonus.requirement ? (
                      <button
                        className="claim-button"
                        onClick={() => claimBonus(bonus.id, bonus.points)}
                      >
                        Claim Bonus
                      </button>
                    ) : (
                      <button className="disabled-button" disabled>
                        Not Eligible
                      </button>
                    )}
                  </li>
                ))}
              </ul>
            </div>

            <div className="share-buttons">
              <a
                href={`https://wa.me/?text=Join%20using%20my%20referral%20link:%20${encodeURIComponent(
                  referralLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="whatsapp-share">
                  <FontAwesomeIcon icon={faWhatsapp} /> WhatsApp
                </button>
              </a>
              <a
                href={`https://www.facebook.com/sharer/sharer.php?u=${encodeURIComponent(
                  referralLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="facebook-share">
                  <FontAwesomeIcon icon={faFacebook} /> Facebook
                </button>
              </a>
              <a
                href={`https://twitter.com/intent/tweet?text=Join%20using%20my%20referral%20link:%20${encodeURIComponent(
                  referralLink
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="twitter-share">
                  <FontAwesomeIcon icon={faTwitter} /> Twitter
                </button>
              </a>
              <a
                href={`https://t.me/share/url?url=${encodeURIComponent(
                  referralLink
                )}&text=${encodeURIComponent(
                  "Join this amazing platform using my referral link!"
                )}`}
                target="_blank"
                rel="noopener noreferrer"
              >
                <button className="telegram-share">
                  <FontAwesomeIcon icon={faTelegram} /> Telegram
                </button>
              </a>
            </div>
          </>
        )}
      </div>
    </div>
  );
};

export default ReferralLink;
