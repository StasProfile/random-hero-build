const cron = require('node-cron');
const config = require('../../config');
const logger = require('../../utils/logger');

/**
 * Задача для периодического обновления данных
 */
class RefreshDataJob {
    /**
     * Создает экземпляр задачи обновления
     * @param {import('../../domain/repositories/IHeroRepository')} heroRepository - Репозиторий героев
     * @param {import('../../domain/repositories/IItemRepository')} itemRepository - Репозиторий предметов
     */
    constructor(heroRepository, itemRepository) {
        this.heroRepository = heroRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * Запускает периодическое обновление данных по расписанию
     */
    schedule() {
        cron.schedule(config.cron.refreshSchedule, async () => {
            logger.info('Starting scheduled data refresh');
            await this.refresh();
            logger.info('Scheduled data refresh completed');
        });
    }

    /**
     * Обновляет данные о героях и предметах
     * @returns {Promise<void>}
     * @throws {Error} Если произошла ошибка при обновлении
     */
    async refresh() {
        try {
            await Promise.all([
                this.heroRepository.refresh(),
                this.itemRepository.refresh()
            ]);
            logger.info('Data refresh successful');
        } catch (error) {
            logger.error('Failed to refresh data:', error);
            throw error;
        }
    }
}

module.exports = RefreshDataJob; 