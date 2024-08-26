require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');


// Load bot token from .env file
const token = process.env.BOT_TOKEN;
const bot = new TelegramBot(token, { polling: true });

bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  const inlineKeyboard = {
    reply_markup: {
      inline_keyboard: [
        [
          {
            text: 'Search for houses',
            web_app: { url: 'https://homebuddy-minibot-akwaibom.vercel.app/' },

          },
        ],
      ],
    },
  };

  bot.sendMessage(chatId, 'Click to search for houses in Akwa Ibom:', inlineKeyboard);
});
