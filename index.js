const axios = require('axios');
const TelegramBot = require('node-telegram-bot-api');
require('dotenv').config();

// Telegram bot configuration
const BOT_TOKEN = process.env.TELEGRAM_BOT_TOKEN;
const CHAT_ID = process.env.TELEGRAM_CHAT_ID;

// Initialize Telegram bot with polling enabled
const bot = new TelegramBot(BOT_TOKEN, { polling: true });

// API endpoints
const HEROES_URL = 'https://api.opendota.com/api/heroes';
const ITEMS_URL = 'https://api.opendota.com/api/constants/items';

// Function to get random elements from array
const getRandomElements = (array, count) => {
  const shuffled = [...array].sort(() => 0.5 - Math.random());
  return shuffled.slice(0, count);
};

// Handle /random command
bot.onText(/\/random/, async (msg) => {
  const chatId = msg.chat.id;
  
  try {
    // Send initial message
    await bot.sendMessage(chatId, 'Fetching random heroes and items...');

    // Make parallel requests to both endpoints
    const [heroesResponse, itemsResponse] = await Promise.all([
      axios.get(HEROES_URL),
      axios.get(ITEMS_URL)
    ]);

    // Get heroes data
    const heroes = heroesResponse.data;
    const randomHeroes = getRandomElements(heroes, 3);
    
    let heroesMessage = '🎮 *3 Random Heroes:*\n';
    randomHeroes.forEach(hero => {
      heroesMessage += `- ${hero.localized_name} (${hero.primary_attr})\n`;
    });

    // Get items data and filter by cost
    const items = Object.values(itemsResponse.data)
      .filter(item => 
        // Filter only purchasable items that cost more than 2500 gold
        item.cost > 2500 && 
        !item.recipe && 
        item.cost !== 0
      );
    
    const randomItems = getRandomElements(items, 6);
    
    let itemsMessage = '\n💰 *6 Random Items (cost > 2500):*\n';
    randomItems.forEach(item => {
      itemsMessage += `- ${item.localized_name || item.dname} (${item.cost} gold)\n`;
    });

    // Combine messages
    const fullMessage = heroesMessage + itemsMessage;
    
    // Log to console
    console.log(`Sending response to chat ${chatId}:`);
    console.log(fullMessage);
    
    // Send to Telegram
    await bot.sendMessage(chatId, fullMessage, { parse_mode: 'Markdown' });

  } catch (error) {
    console.error('Error:', error.message);
    await bot.sendMessage(chatId, 'Error fetching data. Please try again later.');
  }
});

// Log startup message
console.log('Bot is running... Send /random in Telegram to get random heroes and items.');

// Handle errors
bot.on('polling_error', (error) => {
  console.error('Polling error:', error);
});
