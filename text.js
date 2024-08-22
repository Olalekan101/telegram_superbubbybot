require('dotenv').config();
const Sheets = require("@googleapis/sheets");
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');
const express = require('express');
const bodyParser = require('body-parser');
const app = express();
app.use(bodyParser.json());


// Server setup
const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server is running on port ${PORT}`);
});

// Initialize Google Sheets API
const sheets = Sheets.sheets('v4');
const auth = new Sheets.auth.GoogleAuth({
  credentials:JSON.parse(process.env.GOOGLE_SHEET_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Google Sheet ID and range
const spreadsheetId = process.env.SHEET_ID;
const sheetRange = 'Sheet1!A2:G'; // Adjust the range according to your sheet layout

// Load bot token from .env file
const token = process.env.BOT_TOKEN;
// const webHookUrl = `https://api.telegram.org/bot<${token}>/setWebhook?url=https://telegram-superbubbybot-h27q.vercel.app/`
const url ='https://telegram-superbubbybot-h27q.vercel.app'

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });
// bot.setWebHook(`${url}/bot${token}`)

// Load LGA data
const lgadata = {
  "Akwa Ibom": {
    "Abak": [
      "Midim",
      "Otoro",
      "Afaha Obong",
      "Abak Urban",
      "Afi Uyo"
    ],
    "Eastern Obolo": [
      "Iko Town",
      "Okoroete",
      "Okoita",
      "Ele",
      "Aba"
    ],
    "Eket": [
      "Urban",
      "Okon",
      "Afaha Eket",
      "Idua",
      "Central"
    ],
    "Esit Eket": [
      "Uquo",
      "Etebi Idung Assan",
      "Etebi Idung Akpaisang",
      "Etebi Idung Akpana",
      "Idung Nne Ekpe"
    ],
    "Essien Udim": [
      "Adiasim",
      "Ukana",
      "Afaha",
      "Ikpe Annang",
      "Ikot Obong"
    ],
    "Etim Ekpo": [
      "Utu",
      "Uruk Ata Ikot Ebo",
      "Obong",
      "Ika Annang",
      "Ikot Uso Akpan"
    ],
    "Etinan": [
      "Etinan Urban",
      "Mbioto",
      "Ekpene Ukim",
      "Ndon Eyo",
      "Ikot Ebo"
    ],
    "Ibeno": [
      "Ukpenekang",
      "Mkpanak",
      "Eket",
      "Iwuo Okpom",
      "Ikot Enin"
    ],
    "Ibesikpo Asutan": [
      "Ibesikpo Urban",
      "Asutan Ekpe",
      "Nung Udoe",
      "Afaha Ekid",
      "Urua Nka"
    ],
    "Ibiono Ibom": [
      "Ikot Ada Idem",
      "Ikot Obong",
      "Ikot Ekang",
      "Ikot Akpan Abia",
      "Ibiono Ibom Urban"
    ],
    "Ika": [
      "Urua Inyang",
      "Achan Ika",
      "Ika Urban",
      "Ikot Akpan Nkuk",
      "Ikot Esop"
    ],
    "Ikono": [
      "Ikono Urban",
      "Ikot Ekpene",
      "Ibiaku",
      "Itak",
      "Nkwot"
    ],
    "Ikot Abasi": [
      "Ikot Abasi Urban",
      "Ikpa Ibekwe",
      "Ikot Okoro",
      "Ibekwe",
      "Essene"
    ],
    "Ikot Ekpene": [
      "Ikot Ekpene Urban",
      "Abiakpo Ikot Essien",
      "Odoro Ikot",
      "Ikot Abia",
      "Ikot Usung"
    ],
    "Ini": [
      "Ikpe",
      "Ikot Nko",
      "Afaha",
      "Itu Mbonuso",
      "Itu"
    ],
    "Itu": [
      "Itu Urban",
      "Oku Iboku",
      "Ikot Ekang",
      "Ikot Ekwere",
      "Nnung Udoe"
    ],
    "Mbo": [
      "Enwang",
      "Ebughu",
      "Udesi",
      "Effiat",
      "Ibaka"
    ],
    "Mkpat Enin": [
      "Ikot Akpaden",
      "Ikot Etetuk",
      "Ikot Unya",
      "Ikot Abasi",
      "Ikot Obong"
    ],
    "Nsit Atai": [
      "Odoro Atai",
      "Ikot Ibiok",
      "Ikot Udo",
      "Ikot Akpan",
      "Ikot Abasi"
    ],
    "Nsit Ibom": [
      "Afaha Offiong",
      "Ikot Obio Akpa",
      "Ikot Ubo",
      "Obio Ibiono",
      "Afaha Ikot Ebak"
    ],
    "Nsit Ubium": [
      "Ikot Edibon",
      "Ikot Akpan",
      "Ikot Akan",
      "Afaha Offiong",
      "Ikot Akpa Nkuk"
    ],
    "Obot Akara": [
      "Ikot Abia",
      "Ikot Ekpene",
      "Nto Edino",
      "Urua Inyang",
      "Ikot Ubo"
    ],
    "Okobo": [
      "Okopedi",
      "Atabong",
      "Ebughu",
      "Obufi",
      "Ekpene"
    ],
    "Onna": [
      "Awa",
      "Ikot Akpatek",
      "Ikot Eko Ibon",
      "Ikot Ibiok",
      "Ikot Nnung"
    ],
    "Oron": [
      "Oron Urban",
      "Uya Oro",
      "Eyo Abasi",
      "Ikot Osung",
      "Afaha Okpo"
    ],
    "Oruk Anam": [
      "Ikot Ibritam",
      "Ikot Esen",
      "Ikot Ekpene",
      "Ikot Obio",
      "Ikot Okoro"
    ],
    "Udung Uko": [
      "Udung Uko",
      "Ibiaku",
      "Ebughu",
      "Afaha Udo",
      "Ikot Enin"
    ],
    "Ukanafun": [
      "Ukanafun Urban",
      "Ikot Akpa Nkuk",
      "Ikot Ekang",
      "Ikot Ibritam",
      "Ikot Idem"
    ],
    "Uruan": [
      "Idu",
      "Ekim",
      "Ikot Uso",
      "Ikot Akpa",
      "Ikot Ntung"
    ],
    "Urue Offong Oruko": [
      "Urue Offong",
      "Oruko",
      "Ebughu",
      "Okopedi",
      "Afaha Ikot"
    ],
    "Uyo": [
      "Uyo Urban",
      "Ikot Ekpene",
      "Afaha",
      "Nwaniba",
      "Ita Akpan"
    ]
  }
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
  
// Start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "<b><i>Welcome!</i></b> Please select an LGA to search for properties or type the name of an LGA to search.", {
      reply_markup: {
        inline_keyboard: formatLGAAsGrid(Object.keys(lgadata["Akwa Ibom"]))
      },
      parse_mode:"HTML"
    });
  });

  // Search command
bot.onText(/\/search (.+)/, (msg, match) => {
    const searchTerm = match[1].toLowerCase();
    const filteredLGAs = Object.keys(lgadata["Akwa Ibom"]).filter(lga => lga.toLowerCase().includes(searchTerm));
  
    if (filteredLGAs.length > 0) {
      bot.sendMessage(msg.chat.id, "Here are the matching LGAs:", {
        reply_markup: {
          inline_keyboard: formatLGAAsGrid(filteredLGAs)
        }
      },
     

    );
    } else {
      bot.sendMessage(msg.chat.id, "No matching LGAs found. Please try another search term.");
    }
  });
  
  // Handle callback queries and other logic
  bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
    const properties = await getSheetData();
  
    if (data.startsWith('lga:')) {
      const selectedLga = data.split(':')[1];
      const areas = lgadata["Akwa Ibom"][selectedLga];
      
      bot.sendMessage(msg.chat.id, `You selected *${selectedLga}*. Now, choose an area:`, {
        parse_mode: "Markdown",
        reply_markup: {
          inline_keyboard: areas.map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
        }
      });
    }
  
    if (data.startsWith('area:')) {
      const [_, selectedLga, selectedArea] = data.split(':');
      if(properties[selectedLga] == undefined){
        return  bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}*. Please choose another area.`, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: lgadata["Akwa Ibom"][selectedLga].map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
            }
          });
      }
      const listings = properties[selectedLga][selectedArea];
      
      if (listings && listings.length > 0) {
        // Ask for price range
        bot.sendMessage(msg.chat.id, `Please select a price range for properties in *${selectedArea}*`, {
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
        bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}*. Please choose another area.`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: lgadata["Akwa Ibom"][selectedLga].map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
          }
        });
      }
    }
  
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
  });
