const Hero = require('../entities/Hero');

/**
 * Интерфейс репозитория для работы с героями
 * @interface
 */
class IHeroRepository {
    /**
     * Получает список всех доступных героев
     * @returns {Promise<Hero[]>} Список героев
     * @abstract
     */
    async getAll() {
        throw new Error('Method not implemented');
    }

    /**
     * Обновляет данные о героях
     * @returns {Promise<void>}
     * @abstract
     */
    async refresh() {
        throw new Error('Method not implemented');
    }
}

module.exports = IHeroRepository; 