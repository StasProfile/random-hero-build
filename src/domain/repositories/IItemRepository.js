const Item = require('../entities/Item');

/**
 * Интерфейс репозитория для работы с предметами
 * @interface
 */
class IItemRepository {
    /**
     * Получает список всех доступных предметов
     * @returns {Promise<Item[]>} Список предметов
     * @abstract
     */
    async getAll() {
        throw new Error('Method not implemented');
    }

    /**
     * Обновляет данные о предметах
     * @returns {Promise<void>}
     * @abstract
     */
    async refresh() {
        throw new Error('Method not implemented');
    }
}

module.exports = IItemRepository; 