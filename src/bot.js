require("dotenv").config();
const TelegramBot = require("node-telegram-bot-api");

// বটের টোকেন
const token = "YOUR_TELEGRAM_BOT_TOKEN";

// নতুন বট তৈরি
const bot = new TelegramBot(token, { polling: true });

// '/start' কমান্ডের জন্য ইভেন্ট
bot.onText(/\/start (.+)?/, async (msg, match) => {
    const chatId = msg.chat.id;
    const refCode = match[1]; // রেফারেল কোড (যদি থাকে)
    const userId = msg.from.id; // ব্যবহারকারীর ইউনিক ID

    // যদি রেফারেল কোড থাকে, ডাটাবেসে আপডেট করুন
    if (refCode) {
        console.log(`Referred by: ${refCode}`);
        // এখানে Firestore ডাটাবেস আপডেট করতে পারেন
    }

    // নতুন রেফারেল লিংক তৈরি করুন
    const referralLink = `https://t.me/Profitbridgebot?start=${userId}`;

    // ব্যবহারকারীর জন্য বার্তা পাঠান
    bot.sendMessage(chatId, `Welcome to Profit Chain! Your referral link: ${referralLink}`);
});

console.log("Bot is running...");
