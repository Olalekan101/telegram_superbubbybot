require('dotenv').config();
const Sheets = require("@googleapis/sheets");
const TelegramBot = require('node-telegram-bot-api');
const axios = require('axios');

// const fs = require('fs');

// Initialize Google Sheets API
const sheets = Sheets.sheets('v4');
const auth = new Sheets.auth.GoogleAuth({
  credentials: JSON.parse(process.env.GOOGLE_SHEET_KEY),
  scopes: ['https://www.googleapis.com/auth/spreadsheets'],
});

// Google Sheet ID and range
const spreadsheetId = process.env.SHEET_ID;
const sheetRange = 'Sheet1!A2:J'; // Adjust the range according to your sheet layout

// Load bot token from .env file
const token = process.env.BOT_TOKEN;

// Create a bot that uses 'polling' to fetch new updates
const bot = new TelegramBot(token, { polling: true });

// Function to upload image to Imgur
async function uploadImageToImgur(imageBuffer) {
  const clientId = process.env.IMGUR_CLIENT_ID;
  const response = await axios.post('https://api.imgur.com/3/image', imageBuffer, {
      headers: {
          Authorization: `Client-ID ${clientId}`,
          'Content-Type': 'application/octet-stream'
      }
  });

  if (response.data.success) {
      return response.data.data.link; // Return the image URL
  } else {
      throw new Error('Failed to upload image to Imgur');
  }
}

// Function to append data to Google Sheets
async function appendToSheet(row) {
  const client = await auth.getClient();
  await sheets.spreadsheets.values.append({
      spreadsheetId,
      range: sheetRange,  // Adjust range if needed
      valueInputOption: 'RAW',
      resource: {
          values: [row]
      },
      auth: client,
  });
}

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

// Start command
bot.onText(/\/start/, (msg) => {

  bot.sendMessage(msg.chat.id, `Welcome! ${msg.from.first_name} Please choose an option:`, {
    reply_markup: {
      keyboard: [
        [{ text: 'Rent House' }, { text: 'Upload House' }], [{ text: 'Show My Properties' }]
      ],
      resize_keyboard: true,
      one_time_keyboard: false
    }
  });
  
});

// Handle text messages
bot.on('message', async(msg) => {
  const chatId = msg.chat.id;
  const text = msg.text;

  if (text === 'Rent House') {
    bot.sendMessage(chatId, "Please select an LGA to search for properties or type the name of an LGA to search.", {
      reply_markup: {
        inline_keyboard: formatLGAAsGrid(Object.keys(lgadata["Akwa Ibom"]))
      }
    });
  } 
  else if (text === 'Upload House') {

    // Function to format LGAs into a grid
  function formatLGAAsGridUpload(lgas) {
  const inlineKeyboard = [];
  let row = [];
  lgas.forEach((lga, index) => {
    row.push({ text: lga, callback_data: `upload_lga:${lga}` });
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

// Step 1: Present buttons for LGA selection
bot.sendMessage(chatId, 'Please select the Local Government Area (LGA) for the property:', {
  reply_markup: {
      inline_keyboard: formatLGAAsGridUpload(Object.keys(lgadata["Akwa Ibom"])),
  },
});   
      // Listen for LGA selection
      bot.once('callback_query', (lgaCallback) => {
          let lga = lgaCallback.data.split(':')[1];

          // Step 2: Present buttons for area selection
          const areaOptions = lgadata['Akwa Ibom'][lga].map(area => [{ text: area, callback_data: `upload_area:${lga}:${area}` }]);
          bot.sendMessage(chatId, 'Please select the area:', {
              reply_markup: {
                  inline_keyboard: areaOptions,
              },
          });

          bot.once('callback_query', (areaCallback) => {
              let area = areaCallback.data.split(':')[2];

              // Step 3: Present buttons for property description selection
              const descriptionOptions = [
                  { text: 'Single Room', callback_data: `upload_description:${lga}:${area}:Single Room` },
                  { text: 'Self Contain', callback_data: `upload_description:${lga}:${area}:Self Contain` },
                  { text: '1 Bedroom Flat', callback_data: `upload_description:${lga}:${area}:1 Bedroom Flat` },
                  { text: '2 Bedroom Flat', callback_data: `upload_description:${lga}:${area}:2 Bedroom Flat` },
                  { text: '3 Bedroom Flat', callback_data: `upload_description:${lga}:${area}:3 Bedroom Flat` },
                  { text: 'Shop', callback_data: `upload_description:${lga}:${area}:Shop` },
              ];
              bot.sendMessage(chatId, 'Please select the description of the property:', {
                  reply_markup: {
                      inline_keyboard: [descriptionOptions.slice(0, 3), descriptionOptions.slice(3)],
                  },
              });

              bot.once('callback_query', (descriptionCallback) => {
                  let description = descriptionCallback.data.split(':')[3];

                  // Step 4: Ask for address
                  bot.sendMessage(chatId, 'Please enter the address of the property:');
                  bot.once('message', (addressMsg) => {
                      let address = addressMsg.text;

                      // Step 5: Ask for price
                      bot.sendMessage(chatId, 'Please enter the price:');
                      bot.once('message', (priceMsg) => {
                          let price = priceMsg.text;

                          // Step 6: Ask for contact information (phone number)
                          bot.sendMessage(chatId, 'Please enter your contact phone number:');
                          bot.once('message', (contactMsg) => {
                              let contact = contactMsg.text;

                              // Step 7: Present the "Upload Image" inline button
                              bot.sendMessage(chatId, 'Click "Upload Image" to start uploading property images.', {
                                  reply_markup: {
                                      inline_keyboard: [
                                          [{ text: 'Upload Image', callback_data: `upload_image:${lga}:${area}:${description}:${address}:${price}:${contact}` }]
                                      ],
                                  },
                              });

                              let imageUrls = [];

                              // Handling image uploads and completion
  bot.on('callback_query', async (uploadCallback) => {
  const callbackData = uploadCallback.data.split(':');

      // Notify user to send an image
      bot.sendMessage(chatId, 'Please upload the image now.');

      bot.once('message', async (imageMsg) => {
          if (imageMsg.photo) {
              try {
                  const photoId = imageMsg.photo[imageMsg.photo.length - 1].file_id;
                  const file = await bot.getFile(photoId);
                  const fileUrl = `https://api.telegram.org/file/bot${token}/${file.file_path}`;
                  const imageBuffer = await axios.get(fileUrl, { responseType: 'arraybuffer' });
                  const imgurUrl = await uploadImageToImgur(imageBuffer.data);

                  imageUrls.push(imgurUrl);

                  bot.sendMessage(chatId, 'House uploaded', {
                    reply_markup: {
                        inline_keyboard: [
                            [{ text: 'Done', callback_data: `upload_done:${lga}:${area}:${description}:${address}:${price}:${contact}` }]
                        ]
                    }});
              } catch (error) {
                  console.error('Error uploading image:', error);
                  bot.sendMessage(chatId, 'Failed to upload image. Please try again.');
              }
          } else {
              bot.sendMessage(chatId, 'Please upload a valid image.');
          }
      });
   if (callbackData[0] === 'upload_done') {
      // Finalize the upload process
      const row = [
          callbackData[1],  // LGA
          callbackData[2],  // Area
          callbackData[3],  // Description
          callbackData[5],  // Price
          ' ',
          callbackData[6],  // Contact
          imageUrls.join(','),  // Image URLs
          callbackData[4],  // Address
          false,
          uploadCallback.from.id  // User ID
      ];

      try {
          await appendToSheet(row);

          // Clear temporary state
          lga = null;
          area = null;
          description = null;
          price = null;
          contact = null;
          imageUrls = [];
          address = null;

          bot.sendMessage(chatId, 'Property uploaded successfully!');
      } catch (error) {
          console.error('Error saving property details:', error);
          bot.sendMessage(chatId, 'Failed to upload property. Please try again.');
      }
  }
});
                          });
                      });
                  });
              });
          });
      });

}else if (text === 'Show My Properties') {
  // Handle Show My Properties logic
  const userId = msg.from.id;

  // Fetch user's properties from Google Sheets
  const userProperties = await fetchUserProperties(userId);

  if (userProperties.length === 0) {
    bot.sendMessage(chatId, 'You have not uploaded any properties yet.');
    return;
  }

  userProperties.forEach(async (property, index) => {
    const propertyMessage = 
      `*Property ${index + 1}:*\n` +
      `*LGA:* ${property.lga}\n` +
      `*Area:* ${property.area}\n` +
      `*Description:* ${property.description}\n` +
      `*Price:* ₦${property.price}\n` +
      `*Contact:* ${property.contact}\n` +
      `*Visible:* ${property.taken === 'FALSE' ? 'Yes' : 'No'}`;

    const propertyButtons = [
      [{ text: '🗑️ Delete', callback_data: `delete_property:${index}:${userId}` }],
      [{ text: '✏️ Update Price', callback_data: `update_property:${index}:${userId}` }],
      [{ text: property.taken === 'FALSE' ? '🙈 Hide' : '👁️ Unhide', callback_data: `toggle_visibility:${index}:${userId}:${property.taken === 'FALSE'}` }]
    ];

    await bot.sendMessage(chatId, propertyMessage, {
      reply_markup: {
        inline_keyboard: propertyButtons
      },
      parse_mode: 'Markdown'
    });
  });
}

});


// Load LGA data
// const lgadata = JSON.parse(fs.readFileSync('./data/lgadata.json', 'utf8'));


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
      auth: auth,
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
          image_url: imageUrl,
        });
      });
    }
    
    return properties;
  }



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
  
      // Check if selectedLga and selectedArea exist in the data
      if (!properties[selectedLga] || !properties[selectedLga][selectedArea]) {
          return bot.sendMessage(msg.chat.id, `No properties found in *${selectedArea}*. Please choose another area.`, {
              parse_mode: "Markdown",
              reply_markup: {
                  inline_keyboard: lgadata["Akwa Ibom"][selectedLga].map(area => [{ text: area, callback_data: `area:${selectedLga}:${area}` }])
              }
          });
      }
  
      const dataTwo = properties[selectedLga][selectedArea];
  
      // Function to filter properties by description
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
        const propertiesX = bot.chatData[msg.chat.id][`${selectedLga}:${selectedArea}:${selectedDescription}`].properties;

        if (direction === 'next') {
            index = (index + 1) % propertiesX.length; // Loop to the first property if at the end
        } else if (direction === 'prev') {
            index = (index - 1 + propertiesX.length) % propertiesX.length; // Loop to the last property if at the beginning
        }

        bot.chatData[msg.chat.id][`${selectedLga}:${selectedArea}:${selectedDescription}`].index = index;

        return showProperty(msg.chat.id, propertiesX, index, selectedLga, selectedArea, selectedDescription);
    }
});

// Handle Property Actions (Delete, Update, Hide/Unhide)

bot.on('callback_query', async (query) => {
  const [action, propertyIndex, userId, isCurrentlyVisible] = query.data.split(':');
  const propertyIndexInt = parseInt(propertyIndex);

 // Check if userId is available
 if (!userId) {
  // bot.sendMessage(query.message.chat.id, 'User ID is missing. Please try again.');
  return;
}

  // Fetch the properties for the user
  const userProperties = await fetchUserProperties(userId);

  // Get the specific property using the propertyIndex
  const property = userProperties[propertyIndexInt];

  switch (action) {
    case 'delete_property':
      try {
          // Fetch user's properties again to get the correct index for the selected property
          const userProperties = await fetchUserProperties(userId);
          const propertyToDelete = userProperties[propertyIndex];
  
          if (propertyToDelete) {
              // Perform batch update to delete the row
              await sheets.spreadsheets.batchUpdate({
                  spreadsheetId,
                  auth: auth,
                  resource: {
                      requests: [
                          {
                              deleteDimension: {
                                  range: {
                                      sheetId: 0, // Assuming '0' is the correct sheet ID
                                      dimension: 'ROWS',
                                      startIndex: propertyToDelete.index, // Use the correct row index
                                      endIndex: propertyToDelete.index + 1, // Delete only the row containing the property
                                  },
                              },
                          },
                      ],
                  },
              });
  
              bot.sendMessage(query.message.chat.id, 'Property deleted successfully.');
          } else {
              bot.sendMessage(query.message.chat.id, 'Property not found.');
          }
      } catch (error) {
          console.error('Error deleting property:', error);
          bot.sendMessage(query.message.chat.id, 'Failed to delete property. Please try again.');
      }
      break;
  

          case 'update_property':
            // Prompt the user to enter the new price

            bot.sendMessage(query.message.chat.id, 'Please enter the new price for the property:', {
              reply_markup: {
                  force_reply: true,
                  input_field_placeholder: 'Enter new price...'
              }
          });

          bot.once('message', async (priceMsg) => {
              const newPrice = priceMsg.text;

              // Fetch the properties of the user
              const userProperties = await fetchUserProperties(userId);

              // Ensure the correct property based on user input
              const property = userProperties[propertyIndex];

              if (property) {
                  // Calculate the correct row index based on the fetched property index
                  const rowIndex = property.index + 1; // Assuming property.index already accounts for the header row

                  // Update the property price in Google Sheets
                  const range = `Sheet1!D${rowIndex}`; // Adjust range to the correct row and column (e.g., E)

                  await sheets.spreadsheets.values.update({
                      spreadsheetId,
                      range,
                      valueInputOption: 'RAW',
                      resource: {
                          values: [[newPrice]]
                      },
                      auth: auth,
                  });

                  // Send a confirmation message
                  bot.sendMessage(query.message.chat.id, `Property updated successfully.`,{
                    reply_markup: {
                      keyboard: [
                        [{ text: 'Rent House' }, { text: 'Upload House' }], [{ text: 'Show My Properties' }]
                      ],
                      resize_keyboard: true,
                      one_time_keyboard: false
                    }
                  });
              } else {
                  bot.sendMessage(query.message.chat.id, 'Property not found. Please try again.');
              }
          });
          break;

          case 'toggle_visibility':
            try {
                // Fetch user's properties again to get the correct index for the selected property
                const userProperties = await fetchUserProperties(userId);
                const propertyToToggle = userProperties[propertyIndex];
        
                if (propertyToToggle) {
                    // Determine the new visibility state
                    const newVisibility = isCurrentlyVisible === 'TRUE' ? 'FALSE' : 'TRUE';
                    const visibilityRange = `Sheet1!I${propertyToToggle.index + 1}`; // Assuming visibility is in column I
        
                    // Update the visibility in Google Sheets
                    await sheets.spreadsheets.values.update({
                        spreadsheetId,
                        range: visibilityRange,
                        valueInputOption: 'RAW',
                        resource: {
                            values: [[newVisibility]]
                        },
                        auth: auth,
                    });
        
                    // Send a confirmation message to the user
                    bot.sendMessage(query.message.chat.id, `Property visibility updated to ${newVisibility === 'TRUE' ? 'Visible' : 'Hidden'}.`);
                } else {
                    bot.sendMessage(query.message.chat.id, 'Property not found.');
                }
            } catch (error) {
                console.error('Error toggling property visibility:', error);
                bot.sendMessage(query.message.chat.id, 'Failed to update property visibility. Please try again.');
            }
            break;
        
      default:
          // bot.sendMessage(query.message.chat.id, 'Invalid action.');
  }
  
});



// Helper function to fetch properties for a specific user
async function fetchUserProperties(userId) {
  try {
      const response = await sheets.spreadsheets.values.get({
          spreadsheetId,
          range: sheetRange,
          auth: auth,
      });

      const rows = response.data.values || [];
      const userProperties = [];

      if (rows.length) {
          rows.forEach((row, index) => {
              if (row[9] && row[9].toString() === userId.toString()) { // Assuming userId is in the 10th column (J)
                  userProperties.push({
                      index: index + 1, // +1 to account for 0-based index in arrays
                      userId: row[9],
                      lga: row[0],
                      area: row[1],
                      description: row[2],
                      price: row[3],
                      image_url: row[6],
                  });
              }
          });
      }

      return userProperties;
  } catch (error) {
      console.error('Error fetching user properties:', error);
      return []; // Return an empty array in case of an error
  }
}