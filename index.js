require('dotenv').config();
const express = require('express');
const TelegramBot = require('node-telegram-bot-api');

// Replace with your actual token
const bot = new TelegramBot(process.env.BOT_TOKEN);

// Use environment variable to determine the URL
const url = process.env.VERCEL_URL || 'https://telegram-superbubbybot-h27q.vercel.app';
const port = process.env.PORT || 3000;

const app = express();

app.use(express.json()); // Needed to parse JSON bodies

// Set the webhook
bot.setWebHook(`${url}/bot${process.env.BOT_TOKEN}`);

// Define the webhook route
app.post(`/bot${process.env.BOT_TOKEN}`, (req, res) => {
  bot.processUpdate(req.body);
  res.sendStatus(200);
});

// Handle the /start command
bot.onText(/\/start/, (msg) => {
  const chatId = msg.chat.id;

  // Respond with a simple message
  bot.sendMessage(chatId, 'Welcome! How can I assist you today?');
});

// Start the server
app.listen(port, () => {
  console.log(`Server running on port ${port}`);
});
