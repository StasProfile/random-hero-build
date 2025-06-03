require('dotenv').config();
const OpenDotaAPI = require('./openDota.api');
const Heroes = require('./heroes');
const Items = require('./items');
const Bot = require('./bot');
const CronService = require('./cron');

class App {
    constructor() {
        this.heroes = new Heroes(new OpenDotaAPI());
        this.items = new Items(new OpenDotaAPI());
        this.bot = new Bot(process.env.TELEGRAM_BOT_TOKEN, this.heroes, this.items);
        this.cronService = new CronService(this.heroes, this.items);
    }

    async init() {
        // Initialize data
        await Promise.all([
            this.heroes.init(),
            this.items.init()
        ]);

        // Start services
        this.bot.start();
        this.cronService.start();
    }
}

module.exports = App;