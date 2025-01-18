require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// বটের টোকেন (আপনার টোকেনটি এখানে দিন)
const token = '8050384465:AAFwJ5So3us8DUC7JNobPLc-dZ14-brmK94';

// নতুন বট তৈরি
const bot = new TelegramBot(token, { polling: true });

// যখন ব্যবহারকারী মেসেজ পাঠাবে, তখন প্রতিক্রিয়া জানাবে
bot.on('message', (msg) => {
    const chatId = msg.chat.id;

    // "Powered by Dogs" ৩ সেকেন্ড ব্লিংক করার কোড
    bot.sendMessage(chatId, "Powered by Dogs").then(() => {
        setTimeout(() => {
            bot.sendMessage(chatId, "Continue to the App!");
        }, 3000);
    });
});

console.log("Bot is running...");
