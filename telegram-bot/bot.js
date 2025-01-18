const TelegramBot = require('node-telegram-bot-api');

// আপনার টোকেন এখানে বসান
const token = '8050384465:AAFwJ5So3us8DUC7JNobPLc-dZ14-brmK94';

const bot = new TelegramBot(token, { polling: true });

// Start কমান্ড
bot.onText(/\/start/, (msg) => {
    const chatId = msg.chat.id;

    bot.sendMessage(chatId, "💡 Powered by Dogs\n\n_(Wait 3 seconds...)_", {
        parse_mode: "Markdown",
    });

    // 3 সেকেন্ড পর Continue বাটন দেখানো
    setTimeout(() => {
        bot.sendMessage(chatId, "Welcome to Profit Chain! Click 'Continue' to enter.", {
            reply_markup: {
                inline_keyboard: [
                    [
                        { 
                            text: "Continue", 
                            web_app: { url: "https://my-app-psi-three-50.vercel.app/" }  // Web App Integration
                        }
                    ]
                ],
            },
        });
    }, 3000);
});

// Error চেক করা
bot.on("polling_error", (error) => {
    console.log(`Polling error: ${error.code} - ${error.message}`);
});
