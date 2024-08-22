require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');

// Use the token from the environment variables
const TOKEN = process.env.BOT_TOKEN;
const bot = new TelegramBot(TOKEN, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;
  bot.sendMessage(chatId, 'Welcome! How can I assist you today?');
});

console.log('Bot is running with polling...');

