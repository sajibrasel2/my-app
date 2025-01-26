// bot.js

import "dotenv/config";
import TelegramBot from "node-telegram-bot-api";
import db from "./firebase.js"; // Firestore ইমপোর্ট
import { collection, doc, setDoc, getDoc, updateDoc, arrayUnion } from "firebase/firestore";

// Telegram Bot Token
const token = "8050384465:AAERYVEZrnBjqwi0M0CCq7M8y105kPyygR8";
const bot = new TelegramBot(token, { polling: true });

console.log("Bot is running...");

// '/start' কমান্ড হ্যান্ডলার
bot.onText(/\/start(?: (.+))?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const refCode = match[1]; // রেফারেল কোড (যদি থাকে)
    const userId = msg.from.id; // টেলিগ্রাম ব্যবহারকারীর ID
    const userName = msg.from.username || "No username"; // টেলিগ্রাম ইউজারনেম

    try {
        // Firebase-এ নতুন ব্যবহারকারী যোগ করুন
        const userDocRef = doc(collection(db, "users"), String(userId));
        const userDoc = {
            userId: userId,
            userName: userName,
            referredBy: refCode || null, // রেফারেল কোড (যদি থাকে)
            referrals: [], // রেফারেল লিস্ট
            createdAt: new Date().toISOString()
        };

        await setDoc(userDocRef, userDoc, { merge: true });

        console.log(`User ${userId} added to Firestore.`);

        // রেফারেল কোড থাকলে রেফারারের তথ্য আপডেট করুন
        if (refCode) {
            const referrerDocRef = doc(collection(db, "users"), refCode);
            const referrerDocSnap = await getDoc(referrerDocRef);

            if (referrerDocSnap.exists()) {
                await updateDoc(referrerDocRef, {
                    referrals: arrayUnion(userId)
                });
                console.log(`User ${userId} referred by ${refCode}.`);
            } else {
                console.log(`Referral code ${refCode} not found.`);
            }
        }

        // রেফারেল লিংক এবং অ্যাপ লিংক
        const referralLink = `https://t.me/Profitbridgebot?start=${userId}`;
        const appLink = "https://your-web-app-link.com"; // আপনার অ্যাপের লিংক দিন

        // বার্তা পাঠান
        await bot.sendMessage(chatId, "🎉 Welcome to Profit Chain!", {
            reply_markup: {
                inline_keyboard: [
                    [{ text: "🌐 Open App", url: appLink }],
                    [{ text: "🔗 Your Referral Link", callback_data: "referral" }]
                ]
            }
        });

        // রেফারেল লিংক পাঠান
        await bot.sendMessage(chatId, `🔗 Here is your referral link:\n👉 ${referralLink}`);
    } catch (error) {
        console.error("Error in Firestore operation:", error);
        await bot.sendMessage(chatId, "⚠️ Something went wrong. Please try again later.");
    }
});

// রেফারেল লিংক দেখতে বাটনের জন্য ইভেন্ট
bot.on("callback_query", async (query) => {
    const chatId = query.message.chat.id;
    const userId = query.from.id;

    if (query.data === "referral") {
        const referralLink = `https://t.me/Profitbridgebot?start=${userId}`;
        await bot.sendMessage(chatId, `🔗 Your referral link:\n👉 ${referralLink}`);
    }
});
