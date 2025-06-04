const getRandomElements = require('../../utils/getRandomElements');
const config = require('../../config');

/**
 * @typedef {Object} HeroInfo
 * @property {string} name - Имя героя
 * @property {string} attribute - Основной атрибут
 * @property {string[]} roles - Роли героя
 */

/**
 * @typedef {Object} ItemInfo
 * @property {string} name - Название предмета
 * @property {number} cost - Стоимость предмета
 */

/**
 * @typedef {Object} RandomBuild
 * @property {HeroInfo[]} heroes - Список героев
 * @property {ItemInfo[]} items - Список предметов
 */

/**
 * Сервис для генерации случайных сборок
 */
class RandomBuildService {
    /**
     * Создает экземпляр сервиса
     * @param {import('../../domain/repositories/IHeroRepository')} heroRepository - Репозиторий героев
     * @param {import('../../domain/repositories/IItemRepository')} itemRepository - Репозиторий предметов
     */
    constructor(heroRepository, itemRepository) {
        this.heroRepository = heroRepository;
        this.itemRepository = itemRepository;
    }

    /**
     * Генерирует случайную сборку
     * @returns {Promise<RandomBuild>} Случайная сборка героев и предметов
     */
    async getRandomBuild() {
        const [heroes, items] = await Promise.all([
            this.heroRepository.getAll(),
            this.itemRepository.getAll()
        ]);

        return {
            heroes: this.#getRandomHeroes(heroes),
            items: this.#getRandomItems(items)
        };
    }

    /**
     * Выбирает случайных героев
     * @param {import('../../domain/entities/Hero')[]} heroes - Список всех героев
     * @returns {HeroInfo[]} Список случайных героев
     * @private
     */
    #getRandomHeroes(heroes) {
        return getRandomElements(heroes, config.build.heroesCount)
            .map(hero => ({
                name: hero.localizedName,
                attribute: hero.primaryAttribute,
                roles: hero.roles
            }));
    }

    /**
     * Выбирает случайные предметы
     * @param {import('../../domain/entities/Item')[]} items - Список всех предметов
     * @returns {ItemInfo[]} Список случайных предметов
     * @private
     */
    #getRandomItems(items) {
        const selectedItems = new Map();
        const result = [];
        const candidates = getRandomElements(items, config.build.itemsCount * 2);

        for (const item of candidates) {
            if (result.length >= config.build.itemsCount) break;

            const itemType = this.#getItemType(item);
            if (itemType && selectedItems.get(itemType)) continue;

            result.push({
                name: item.localizedName,
                cost: item.cost
            });

            if (itemType) {
                selectedItems.set(itemType, true);
            }
        }

        return result;
    }

    /**
     * Определяет тип предмета
     * @param {import('../../domain/entities/Item')} item - Предмет
     * @returns {string|null} Тип предмета или null
     * @private
     */
    #getItemType(item) {
        const name = item.localizedName.toLowerCase();
        if (name.includes('dagon')) return 'dagon';
        if (name.includes('aghanim')) return 'aghanim';
        if (name.includes('blink')) return 'blink';
        if (name.includes('necronomicon')) return 'necronomicon';
        return null;
    }
}

module.exports = RandomBuildService; 