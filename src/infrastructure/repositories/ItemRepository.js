const IItemRepository = require('../../domain/repositories/IItemRepository');
const Item = require('../../domain/entities/Item');
const { UNAVAILABLE_ITEMS, COMPONENT_ITEM_NAMES } = require('../../utils/const');
const config = require('../../config');

/**
 * Реализация репозитория для работы с предметами через OpenDota API
 * @implements {IItemRepository}
 */
class ItemRepository extends IItemRepository {
    /**
     * Создает экземпляр репозитория предметов
     * @param {import('../OpenDotaAPI')} openDotaAPI - Экземпляр OpenDota API клиента
     */
    constructor(openDotaAPI) {
        super();
        this.openDotaAPI = openDotaAPI;
        /** @type {Item[]} */
        this.items = [];
    }

    /**
     * @inheritdoc
     */
    async getAll() {
        if (this.items.length === 0) {
            await this.refresh();
        }
        return this.items;
    }

    /**
     * @inheritdoc
     */
    async refresh() {
        const itemsData = await this.openDotaAPI.getItems();
        this.items = this.#processItemsData(itemsData);
    }

    /**
     * Обрабатывает данные предметов из API
     * @param {Object.<string, import('../../domain/entities/Item').ItemData>} itemsData - Данные предметов из API
     * @returns {Item[]} Список обработанных предметов
     * @private
     */
    #processItemsData(itemsData) {
        return Object.entries(itemsData)
            .filter(([key, item]) => this.#isValidItem(key, item))
            .map(([key, item]) => Item.create(key, item));
    }

    /**
     * Проверяет валидность данных предмета
     * @param {string} itemKey - Ключ предмета
     * @param {import('../../domain/entities/Item').ItemData} item - Данные предмета для проверки
     * @returns {boolean} True, если предмет валиден
     * @private
     */
    #isValidItem(itemKey, item) {
        return item.cost > config.items.minCost &&
               !item.recipe &&
               item.cost !== 0 &&
               !UNAVAILABLE_ITEMS.includes(itemKey) &&
               item.components?.length > 0 &&
               !this.#isComponentItem(itemKey);
    }

    /**
     * Проверяет, является ли предмет компонентом
     * @param {string} itemKey - Ключ предмета
     * @returns {boolean} True, если предмет является компонентом
     * @private
     */
    #isComponentItem(itemKey) {
        return COMPONENT_ITEM_NAMES.some(component => 
            itemKey.includes(component)
        );
    }
}

module.exports = ItemRepository; 