require('dotenv').config();

const config = {
    openDota: {
        baseUrl: 'https://api.opendota.com/api',
        timeout: 5000
    },
    telegram: {
        token: process.env.TELEGRAM_BOT_TOKEN
    },
    build: {
        heroesCount: 3,
        itemsCount: 6
    },
    items: {
        minCost: 2500
    },
    cron: {
        refreshSchedule: '0 0 * * *' // Every day at midnight
    }
};

module.exports = config; 