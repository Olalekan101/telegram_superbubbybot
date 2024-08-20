require('dotenv').config();
const TelegramBot = require('node-telegram-bot-api');
const fs = require('fs');

// Load bot token from .env file
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Load property data
const properties = JSON.parse(fs.readFileSync('./data/properties.json', 'utf8'));

// Start command
bot.onText(/\/start/, (msg) => {
    bot.sendMessage(msg.chat.id, "Welcome! Please select a state to search for properties.", {
      reply_markup: {
        inline_keyboard: [
          ...Object.keys(properties).map(state => [{ text: state, callback_data: `state:${state}` }])
        ]
      }
    });
  });
  

// Handle callback queries
// Handle callback queries
bot.on('callback_query', (callbackQuery) => {
    const msg = callbackQuery.message;
    const data = callbackQuery.data;
  
    if (data.startsWith('state:')) {
      const selectedState = data.split(':')[1];
      bot.sendMessage(msg.chat.id, `You selected ${selectedState}. Now, choose an LGA:`, {
        reply_markup: {
            inline_keyboard: [
              ...Object.keys(properties[selectedState]).map(lga => [{ text: lga, callback_data: `lga:${selectedState}:${lga}` }])
            ]
          }
      });
    }
  
    if (data.startsWith('lga:')) {
      const [_, selectedState, selectedLga] = data.split(':');
      bot.sendMessage(msg.chat.id, `You selected ${selectedLga}. Now, choose an area:`, {
        reply_markup: {
            inline_keyboard: [
              ...Object.keys(properties[selectedState][selectedLga]).map(area => [{ text: area, callback_data: `area:${selectedState}:${selectedLga}:${area}` }])
            ]
          }
      });
    }
  
    if (data.startsWith('area:')) {
        const [_, selectedState, selectedLga, selectedArea] = data.split(':');
      
        // Ask the user to select a price range
        bot.sendMessage(msg.chat.id, `Please select a price range for properties in *${selectedArea}*`, {
          parse_mode: "Markdown",
          reply_markup: {
            inline_keyboard: [
              [
                { text: '150k-300k', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:150000-300000` },
                { text: '300k-500k', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:300000-500000` }
              ],
              [
                { text: '500k-1m', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:500000-1000000` },
                { text: '1m-1.5m', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:1000000-1500000` }
              ],
              [
                { text: '1.5m-above', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:1500000-999999999` }
              ],
              [
                { text: 'All Houses', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:all` }
              ]
            ]
          }
        });
      }
      
      
      // Handle price range selection
      if (data.startsWith('price:')) {
        const [_, selectedState, selectedLga, selectedArea, selectedRange] = data.split(':');
        const listings = properties[selectedState][selectedLga][selectedArea];
        let filteredListings;
      
        if (selectedRange === 'all') {
          filteredListings = listings; // No filter, show all properties
        } else {
          const [minPrice, maxPrice] = selectedRange.split('-').map(Number);
          filteredListings = listings.filter(listing => {
            const price = parseFloat(listing.price.replace(/[^0-9.-]+/g, "")); // Convert price to a numeric value
            return price >= minPrice && price <= maxPrice;
          });
        }
      
        if (filteredListings.length > 0) {
          filteredListings.forEach(listing => {
            // Display the area name, description, and contact details
            bot.sendMessage(msg.chat.id, 
              `*${selectedArea.toUpperCase()}*\n\n*${listing.description}*\n\n*Price:* ₦${listing.price}\n\n📞 [Contact The Agent](https://wa.me/${listing.contact})\n\n[Video of the house](${listing.youtube_link})`, 
              { parse_mode: "Markdown" }
            );
          });
        } else {
          // Inform the user that no properties were found and display price ranges again
          bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}* within the selected price range. Please choose another price range:`, {
            parse_mode: "Markdown",
            reply_markup: {
              inline_keyboard: [
                [
                  { text: '150k-300k', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:150000-300000` },
                  { text: '300k-500k', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:300000-500000` }
                ],
                [
                  { text: '500k-1m', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:500000-1000000` },
                  { text: '1m-1.5m', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:1000000-1500000` }
                ],
                [
                  { text: '1.5m-above', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:1500000-999999999` }
                ],
                [
                  { text: 'All Houses', callback_data: `price:${selectedState}:${selectedLga}:${selectedArea}:all` }
                ]
              ]
            }
          });
        }
      }
      
      
      
      
  });
