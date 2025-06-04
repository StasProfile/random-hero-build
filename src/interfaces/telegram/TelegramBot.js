const TelegramBot = require('node-telegram-bot-api');
const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * Telegram бот для генерации случайных сборок Dota 2
 */
class DotaRandomBuildBot {
    /**
     * Создает экземпляр бота
     * @param {import('../../application/services/RandomBuildService')} randomBuildService - Сервис генерации сборок
     */
    constructor(randomBuildService) {
        this.randomBuildService = randomBuildService;
        /** @type {import('node-telegram-bot-api')} */
        this.bot = new TelegramBot(config.telegram.token, { polling: true });
    }

    /**
     * Запускает бота
     */
    start() {
        this.#setupCommandHandlers();
        logger.info('Telegram bot started');
    }

    /**
     * Настраивает обработчики команд
     * @private
     */
    #setupCommandHandlers() {
        this.bot.onText(/\/start/, this.#handleStart.bind(this));
        this.bot.onText(/\/build/, this.#handleBuild.bind(this));
        this.bot.onText(/\/help/, this.#handleHelp.bind(this));
        
        this.bot.on('error', (error) => {
            logger.error('Telegram bot error:', error);
        });
    }

    /**
     * Обрабатывает команду /start
     * @param {import('node-telegram-bot-api').Message} msg - Сообщение от пользователя
     * @private
     */
    async #handleStart(msg) {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId, 
            'Привет! Я помогу тебе создать случайную сборку для Dota 2.\n' +
            'Используй /build чтобы получить случайную сборку или /help для помощи.'
        );
    }

    /**
     * Обрабатывает команду /help
     * @param {import('node-telegram-bot-api').Message} msg - Сообщение от пользователя
     * @private
     */
    async #handleHelp(msg) {
        const chatId = msg.chat.id;
        await this.bot.sendMessage(chatId,
            'Доступные команды:\n' +
            '/build - получить случайную сборку\n' +
            '/help - показать это сообщение'
        );
    }

    /**
     * Обрабатывает команду /build
     * @param {import('node-telegram-bot-api').Message} msg - Сообщение от пользователя
     * @private
     */
    async #handleBuild(msg) {
        const chatId = msg.chat.id;
        try {
            const build = await this.randomBuildService.getRandomBuild();
            await this.bot.sendMessage(chatId, this.#formatBuildMessage(build));
        } catch (error) {
            logger.error('Error generating build:', error);
            await this.bot.sendMessage(chatId, 
                'Извините, произошла ошибка при генерации сборки. Попробуйте позже.'
            );
        }
    }

    /**
     * Форматирует сообщение со сборкой
     * @param {import('../../application/services/RandomBuildService').RandomBuild} build - Сгенерированная сборка
     * @returns {string} Отформатированное сообщение
     * @private
     */
    #formatBuildMessage(build) {
        const heroesSection = this.#formatHeroesSection(build.heroes);
        const itemsSection = this.#formatItemsSection(build.items);
        
        return `${heroesSection}\n\n${itemsSection}`;
    }

    /**
     * Форматирует секцию с героями
     * @param {import('../../application/services/RandomBuildService').HeroInfo[]} heroes - Список героев
     * @returns {string} Отформатированная секция героев
     * @private
     */
    #formatHeroesSection(heroes) {
        const heroList = heroes
            .map(hero => hero.name)
            .join('\n');
        
        return `🦸 Герои:\n${heroList}`;
    }

    /**
     * Форматирует секцию с предметами
     * @param {import('../../application/services/RandomBuildService').ItemInfo[]} items - Список предметов
     * @returns {string} Отформатированная секция предметов
     * @private
     */
    #formatItemsSection(items) {
        const itemList = items
            .map((item, index) => `${index + 1}. ${item.name} (${item.cost} золота)`)
            .join('\n');
        
        return `🛍 Предметы:\n${itemList}`;
    }
}

module.exports = DotaRandomBuildBot; 