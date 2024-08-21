require('dotenv').config();
const Sheet = require('@googleapis/sheets');
const TelegramBot = require('node-telegram-bot-api');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());

// Initialize Google Sheets API
const auth = new Sheet.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEET_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

const sheets = Sheet.sheets({ version: 'v4', auth });

// Google Sheet ID and range
const spreadsheetId = process.env.SHEET_ID;
const sheetRange = 'Sheet1!A2:G'; // Adjust the range according to your sheet layout

// Load bot token from .env file
const token = process.env.BOT_TOKEN;
const url = `https://telegram-superbubbybot-h27q.vercel.app`; // Update with your Vercel app URL

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token);
bot.setWebHook(`${url}/bot${token}`);

// Load LGA data
const lgadata = {
  // ... (same as before)
};

const gridColumnCount = 3;  // Number of LGAs per row in the grid

// Function to format LGAs into a grid
function formatLGAAsGrid(lgas) {
    const inlineKeyboard = [];
    let row = [];
    lgas.forEach((lga, index) => {
      row.push({ text: lga, callback_data: `lga:${lga}` });
      if ((index + 1) % gridColumnCount === 0) {
        inlineKeyboard.push(row);
        row = [];
      }
    });
    if (row.length) {
      inlineKeyboard.push(row);
    }
    return inlineKeyboard;
  }

// Function to fetch data from Google Sheets
async function getSheetData() {
    const client = await auth.getClient();
    const response = await sheets.spreadsheets.values.get({
      spreadsheetId,
      range: sheetRange,
      auth: client,
    });
    
    const rows = response.data.values;
    const properties = {};
  
    if (rows.length) {
      rows.forEach(row => {
        const [lga, area, description, price, youtubeLink, contact, imageUrl] = row;
        if (!properties[lga]) properties[lga] = {};
        if (!properties[lga][area]) properties[lga][area] = [];
        
        properties[lga][area].push({
          description,
          price,
          youtube_link: youtubeLink,
          contact,
          image_url: imageUrl
        });
      });
    }
    
    return properties;
  }

// Handle incoming webhook
app.post(`/bot${token}`, async (req, res) => {
  const update = req.body;

  if (update.message) {
    const chatId = update.message.chat.id;
    const text = update.message.text;

    // Handle the start command
    if (text === '/start') {
      await bot.sendMessage(chatId, "Welcome! Please select an LGA to search for properties or type the name of an LGA to search.", {
        reply_markup: {
          inline_keyboard: formatLGAAsGrid(Object.keys(lgadata["Akwa Ibom"]))
        }
      });
    }

    // Handle LGA search
    else if (text.startsWith('/search ')) {
      const searchTerm = text.substring(9).toLowerCase();
      const filteredLGAs = Object.keys(lgadata["Akwa Ibom"]).filter(lga => lga.toLowerCase().includes(searchTerm));
    
      if (filteredLGAs.length > 0) {
        await bot.sendMessage(chatId, "Here are the matching LGAs:", {
          reply_markup: {
            inline_keyboard: formatLGAAsGrid(filteredLGAs)
          }
        });
      } else {
        await bot.sendMessage(chatId, "No matching LGAs found. Please try another search term.");
      }
    }
  }

  if (update.callback_query) {
    const msg = update.callback_query.message;
    const data = update.callback_query.data;
    const properties = await getSheetData();
    
    // Handle LGA selection
    if (data.startsWith('lga:')) {
      const selectedLga = data.split(':')[1];
      const areas = lgadata["Akwa Ibom"][selectedLga];
      
      await bot.sendMessage(msg.chat.id, `You selected *${selectedLga}*. Now, choose an area:`, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: areas.map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
        }
      });
    }

    // Handle area selection
    if (data.startsWith('area:')) {
      const [_, selectedLga, selectedArea] = data.split(':');
      if (!properties[selectedLga]) {
        await bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}*. Please choose another area.`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: lgadata["Akwa Ibom"][selectedLga].map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
          }
        });
      } else {
        const listings = properties[selectedLga][selectedArea];
        
        if (listings && listings.length > 0) {
          // Ask for price range
          await bot.sendMessage(msg.chat.id, `Please select a price range for properties in *${selectedArea}*`, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '150k-300k', callback_data: `price:${selectedLga}:${selectedArea}:150000-300000` },
                  { text: '300k-500k', callback_data: `price:${selectedLga}:${selectedArea}:300000-500000` }
                ],
                [
                  { text: '500k-1m', callback_data: `price:${selectedLga}:${selectedArea}:500000-1000000` },
                  { text: '1m-1.5m', callback_data: `price:${selectedLga}:${selectedArea}:1000000-1500000` }
                ],
                [
                  { text: '1.5m-above', callback_data: `price:${selectedLga}:${selectedArea}:1500000-999999999` }
                ],
                [
                  { text: 'All Houses', callback_data: `price:${selectedLga}:${selectedArea}:all` }
                ]
              ]
            }
          });
        } else {
          await bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}*. Please choose another area.`, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: lgadata["Akwa Ibom"][selectedLga].map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
            }
          });
        }
      }
    }

    // Handle price range selection
    if (data.startsWith('price:')) {
      const [_, selectedLga, selectedArea, priceRange] = data.split(':');
      const listings = properties[selectedLga][selectedArea];

      const filteredListings = priceRange === 'all' ? listings : listings.filter(listing => {
        const price = parseInt(listing.price.replace(/[^0-9]/g, ''));
        const [minPrice, maxPrice] = priceRange.split('-').map(Number);
        return price >= minPrice && (maxPrice === 999999999 || price <= maxPrice);
      });

      if (filteredListings.length > 0) {
        filteredListings.forEach(listing => {
          bot.sendMessage(msg.chat.id, 
            `*${selectedArea.toUpperCase()}*\n\n*Description:* ${listing.description}\n\n*Price:* ₦${listing.price}\n\n📞 [Contact The Agent](https://wa.me/${listing.contact})\n\n[Video of the house](${listing.youtube_link})`, 
            { parse_mode: "Markdown" }
          );
        });
      } else {
        bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}* within the selected price range. Please choose another price range:`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: '0k-300k', callback_data: `price:${selectedLga}:${selectedArea}:0-300000` },
                { text: '300k-500k', callback_data: `price:${selectedLga}:${selectedArea}:300000-500000` }
              ],
              [
                { text: '500k-1m', callback_data: `price:${selectedLga}:${selectedArea}:500000-1000000` },
                { text: '1m-1.5m', callback_data: `price:${selectedLga}:${selectedArea}:1000000-1500000` }
              ],
              [
                { text: '1.5m-above', callback_data: `price:${selectedLga}:${selectedArea}:1500000-999999999` }
              ],
              [
                { text: 'All Houses', callback_data: `price:${selectedLga}:${selectedArea}:all` }
              ]
            ]
          }
        });
      }
    }
  }

  res.sendStatus(200);
});

// Export handler for Vercel
module.exports = app;
