import React, { useState, useEffect } from "react";
import "./ReferralLink.css"; // CSS ফাইল ইম্পোর্ট
import { doc, setDoc, getDoc } from "firebase/firestore"; // Firestore ফাংশন
import db from "./firebase"; // Firestore instance

const ReferralLink = ({ userId }) => {
  const [referralLink, setReferralLink] = useState(""); // রেফারেল লিংক স্টেট
  const [loading, setLoading] = useState(true); // লোডিং স্টেট

  useEffect(() => {
    const fetchOrCreateReferralLink = async () => {
      try {
        // Firestore ডকুমেন্ট রেফারেন্স
        const docRef = doc(db, "referrals", userId);

        // ডেটা ফেচ করার চেষ্টা করুন
        const docSnap = await getDoc(docRef);

        if (docSnap.exists()) {
          // যদি ডকুমেন্ট থাকে, রেফারেল লিংক সেট করুন
          setReferralLink(docSnap.data().referralLink);
        } else {
          // যদি ডকুমেন্ট না থাকে, নতুন রেফারেল লিংক তৈরি করুন
          const botUsername = "Profitbridgebot"; // আপনার বটের ইউজারনেম
          const link = `https://t.me/${botUsername}?start=${userId}`;

          // নতুন ডেটা Firestore-এ সংরক্ষণ করুন
          await setDoc(docRef, {
            userId: userId,
            referralLink: link,
            referralCount: 0,
            points: 0,
            referredUsers: [],
          });

          setReferralLink(link); // লিংক স্টেটে সেট করুন
        }
      } catch (error) {
        console.error("Error fetching or creating referral link:", error);
      } finally {
        setLoading(false); // লোডিং শেষ
      }
    };

    fetchOrCreateReferralLink(); // ফাংশন কল
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
