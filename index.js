require('dotenv').config();
const Sheets = require("@googleapis/sheets");
const TelegramBot = require('node-telegram-bot-api');
// const fs = require('fs');

// Initialize Google Sheets API
const sheets = Sheets.sheets('v4');
const auth = new Sheets.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEET_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets.readonly'],
});

// Google Sheet ID and range
const spreadsheetId = process.env.SHEET_ID;
const sheetRange = 'Sheet1!A2:H'; // Adjust the range according to your sheet layout

// Load bot token from .env file
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Load LGA data
// const lgadata = JSON.parse(fs.readFileSync('./data/lgadata.json', 'utf8'));

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
}

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
    bot.sendMessage(msg.chat.id, "<b><i>Welcome!😁</i></b> Please select an LGA to search for properties or type the name of an LGA to search.", {
      reply_markup: {
        inline_keyboard: formatLGAAsGrid(Object.keys(lgadata["Akwa Ibom"])),
      },
      parse_mode: "HTML"
    });
  });

// Function to show a property with navigation buttons
async function showProperty(chatId, properties, index, selectedLga, selectedArea, selectedDescription) {
  const property = properties[index];
  const imageUrls = property.image_url.split(',').map(url => url.trim());

  const message = encodeURIComponent(
    `Hello, I'm interested in the following property:\n\n` +
    `*Area:* ${selectedArea.toUpperCase()}\n` +
    `*Description:* ${property.description}\n` +
    `*Rent Cost:* ₦${property.price}\n`
  );

  const whatsappLink = `https://wa.me/+2347010174548?text=${message}`;

  const mediaGroup = imageUrls.map((imageUrl, idx) => ({
      type: 'photo',
      media: imageUrl,
      caption: idx === 0 ? `*${selectedArea.toUpperCase()}* | *${property.description}*\n*Rent Cost:* ₦${property.price}\n[I'm Interested 👋🏾](${whatsappLink})` : '',
      parse_mode: 'Markdown'
  }));

  // Calculate the current property number (1-based index)
  const currentNumber = index + 1;
  const totalProperties = properties.length;

  // Create navigation buttons with appropriate states
  const prevButton = {
      text: index > 0 ? '⬅️' : '🟦',
      callback_data: index > 0 ? `navigate:${selectedLga}:${selectedArea}:${selectedDescription}:${index}:prev` : 'no_action'
  };

  const nextButton = {
      text: index < totalProperties - 1 ? '➡️' : '🟦',
      callback_data: index < totalProperties - 1 ? `navigate:${selectedLga}:${selectedArea}:${selectedDescription}:${index}:next` : 'no_action'
  };

  // Send the property details along with navigation buttons
  bot.sendMediaGroup(chatId, mediaGroup).then(() => {
      bot.sendMessage(chatId, `${currentNumber} of ${totalProperties}`, {
          reply_markup: {
              inline_keyboard: [[prevButton, nextButton]]
          }
      });
  });
}




// Handle callback queries and other logic
bot.on('callback_query', async (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;

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
        bot.sendMessage(msg.chat.id, `Please select the type of apartment you are looking for in *${selectedArea}*`, {
            parse_mode: "Markdown",
            reply_markup: {
                inline_keyboard: [
                    [
                        { text: 'Single Room', callback_data: `description:${selectedLga}:${selectedArea}:Single Room` },
                        { text: 'Self Contain', callback_data: `description:${selectedLga}:${selectedArea}:Self Contain` }
                    ],
                    [
                        { text: '1 Bedroom Flat', callback_data: `description:${selectedLga}:${selectedArea}:1 Bedroom Flat` },
                        { text: '2 Bedroom Flat', callback_data: `description:${selectedLga}:${selectedArea}:2 Bedroom Flat` }
                    ],
                    [
                        { text: '3 Bedroom Flat', callback_data: `description:${selectedLga}:${selectedArea}:3 Bedroom Flat` },
                        { text: 'Shop', callback_data: `description:${selectedLga}:${selectedArea}:Shop` }
                    ],
                ]
            }
        });
    }

    if (data.startsWith('description:')) {
        const [_, selectedLga, selectedArea, selectedDescription] = data.split(':');
        const properties = await getSheetData();
        const dataTwo = properties[selectedLga][selectedArea];
        const filterByDescription = (description) => dataTwo.filter(property => property.description.toLowerCase() === description.toLowerCase());

        const filteredProperties = filterByDescription(selectedDescription);

        if (filteredProperties.length === 0) {
            return bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}*. Please choose another area.`, {
                parse_mode: "Markdown",
                reply_markup: {
                    inline_keyboard: lgadata["Akwa Ibom"][selectedLga].map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
                }
            });
        } else {
            // Store the filtered properties and index in the user's chat data for navigation
            bot.chatData = bot.chatData || {};
            bot.chatData[msg.chat.id] = bot.chatData[msg.chat.id] || {};
            bot.chatData[msg.chat.id][`${selectedLga}:${selectedArea}:${selectedDescription}`] = {
                properties: filteredProperties,
                index: 0
            };

            return showProperty(msg.chat.id, filteredProperties, 0, selectedLga, selectedArea, selectedDescription);
        }
    }

    if (data.startsWith('navigate:')) {
        const [_, selectedLga, selectedArea, selectedDescription, indexStr, direction] = data.split(':');
        let index = parseInt(indexStr);
        const properties = bot.chatData[msg.chat.id][`${selectedLga}:${selectedArea}:${selectedDescription}`].properties;

        if (direction === 'next') {
            index = (index + 1) % properties.length; // Loop to the first property if at the end
        } else if (direction === 'prev') {
            index = (index - 1 + properties.length) % properties.length; // Loop to the last property if at the beginning
        }

        bot.chatData[msg.chat.id][`${selectedLga}:${selectedArea}:${selectedDescription}`].index = index;

        return showProperty(msg.chat.id, properties, index, selectedLga, selectedArea, selectedDescription);
    }
});
