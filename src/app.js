require('dotenv').config();
const OpenDotaAPI = require('./infrastructure/OpenDotaAPI');
const HeroRepository = require('./infrastructure/repositories/HeroRepository');
const ItemRepository = require('./infrastructure/repositories/ItemRepository');
const RandomBuildService = require('./application/services/RandomBuildService');
const DotaRandomBuildBot = require('./interfaces/telegram/TelegramBot');
const RefreshDataJob = require('./application/jobs/RefreshDataJob');
const logger = require('./utils/logger');

/**
 * Основной класс приложения, отвечающий за инициализацию и координацию всех компонентов
 */
class App {
    /**
     * Создает экземпляр приложения и инициализирует все зависимости
     */
    constructor() {
        this.#initializeDependencies();
    }

    /**
     * Инициализирует все зависимости приложения
     * @private
     */
    #initializeDependencies() {
        // Infrastructure
        const openDotaAPI = new OpenDotaAPI();
        
        // Repositories
        const heroRepository = new HeroRepository(openDotaAPI);
        const itemRepository = new ItemRepository(openDotaAPI);
        
        // Services
        const randomBuildService = new RandomBuildService(
            heroRepository,
            itemRepository
        );
        
        // Interfaces
        this.bot = new DotaRandomBuildBot(randomBuildService);
        
        // Jobs
        this.refreshJob = new RefreshDataJob(heroRepository, itemRepository);
    }

    /**
     * Запускает приложение
     * @returns {Promise<void>}
     * @throws {Error} Если произошла ошибка при инициализации
     */
    async init() {
        try {
            await this.refreshJob.refresh();
            this.refreshJob.schedule();
            this.bot.start();
            
            logger.info('Application initialized successfully');
        } catch (error) {
            logger.error('Failed to initialize application:', error);
            throw error;
        }
    }
}

module.exports = App;