const TelegramBot = require('node-telegram-bot-api');

class Bot {
    constructor(TELEGRAM_BOT_TOKEN, heroes, items) {
        this.TELEGRAM_BOT_TOKEN = TELEGRAM_BOT_TOKEN;
        this.heroes = heroes;
        this.items = items;
    }

    async start() {
        this.bot = new TelegramBot(this.TELEGRAM_BOT_TOKEN, { polling: true });
        
        this.bot.onText(/\/random/, async (msg) => {
            await this.handleRandomCommand(msg);
        });

        this.bot.onText(/\/refresh/, async (msg) => {
            await this.handleRefreshCommand(msg);
        });
    }
    
    
    async handleRandomCommand(msg) {
        const chatId = msg.chat.id;
        const heroes = this.heroes.getRandomHeroes(3);
        const items = this.items.getRandomItems(6);
        const message = `🎮 3 Random Heroes: 🎮 \n${heroes.map(hero => `- ${hero.localized_name}`).join('\n')}\n\n💰 6 Random Items: 💰\n${items.map(item => `- ${item.dname}`).join('\n')}`;
        await this.sendMessage(chatId, message);
    }

    async sendMessage(chatId, message) {
        await this.bot.sendMessage(chatId, message);
    }

    async handleRefreshCommand(msg) {
        const chatId = msg.chat.id;
        await this.heroes.refresh();
        await this.items.refresh();
        await this.sendMessage(chatId, 'Data refreshed successfully');
    }
}

module.exports = Bot;