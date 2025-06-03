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

// List of unavailable items in the current Dota version
const UNAVAILABLE_ITEMS = [
  'wraith_pact',
  'helm_of_the_overlord',
  'trident',  // Kaya + Sange + Yasha combo
  'vampire_fangs',
  'helm_of_the_undying',
  'third_eye',
  'royal_jelly',
  'witless_shako',
  'princes_knife',
  'repair_kit',
  'greater_faerie_fire',
  'minotaur_horn',
  'poor_mans_shield',
  'iron_talon',
  'ring_of_aquila',
  'arcane_ring',
  'imp_claw',
  'ballista',
  'woodland_striders',
  'mind_breaker',
  'orb_of_destruction',
  'titan_sliver',
  'stormcrafter',
  'penta_edged_sword',
  'elven_tunic'
];

// List of heroes to exclude from random selection
const EXCLUDED_HEROES = [
  'npc_dota_hero_broodmother',  // Broodmother
  'npc_dota_hero_meepo',        // Meepo
  'npc_dota_hero_chen',         // Chen
  'npc_dota_hero_visage',       // Visage
  'npc_dota_hero_arc_warden'    // Arc Warden
];

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

    // Get heroes data and filter out excluded heroes
    const heroes = heroesResponse.data.filter(hero => !EXCLUDED_HEROES.includes(hero.name));
    const randomHeroes = getRandomElements(heroes, 3);
    
    let heroesMessage = '🎮 *3 Random Heroes:*\n';
    randomHeroes.forEach(hero => {
      heroesMessage += `- ${hero.localized_name} (${hero.primary_attr})\n`;
    });

    // Get items data and filter by cost and availability
    const items = Object.entries(itemsResponse.data)
      .filter(([itemKey, item]) => 
        // Filter only purchasable items that cost more than 2500 gold
        // and are currently available in the game
        item.cost > 2500 && 
        !item.recipe && 
        item.cost !== 0 &&
        !UNAVAILABLE_ITEMS.includes(itemKey)
      )
      .map(([_, item]) => item);
    
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
