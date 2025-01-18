require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// বটের টোকেন (আপনার টোকেন দিন)
const token = '8050384465:AAERYVEZrnBjqwi0M0CCq7M8y105kPyygR8';

// নতুন বট তৈরি
const bot = new TelegramBot(token, { polling: true });

// '/start' কমান্ডের জন্য ইভেন্ট
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    // প্রথম বার্তা: "Powered by Dogs"
    bot.sendMessage(chatId, "💡 Powered by Dogs");

    // ৩ সেকেন্ড অপেক্ষা করার পরে দ্বিতীয় বার্তা পাঠানো
    setTimeout(() => {
        bot.sendMessage(chatId, "Welcome to Profit Chain! Click 'Continue' to enter.", {
            reply_markup: {
                inline_keyboard: [
                    [
                        { 
                            text: "Continue", 
                            web_app: { url: "https://profit-chain.vercel.app/" } 
                        }
                    ]
                ]
            }
        });
    }, 3000);
});

console.log("Bot is running...");
