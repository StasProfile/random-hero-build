/**
 * @typedef {Object} ItemData
 * @property {string} dname - Отображаемое имя предмета
 * @property {string} localized_name - Локализованное имя предмета
 * @property {number} cost - Стоимость предмета в золоте
 * @property {boolean} [recipe] - Является ли предмет рецептом
 * @property {string[]} [components] - Список компонентов предмета
 */

/**
 * Представляет предмет в игре Dota 2
 */
class Item {
    /**
     * Создает экземпляр предмета
     * @param {string} id - Уникальный идентификатор предмета
     * @param {string} name - Системное имя предмета
     * @param {string} localizedName - Локализованное имя предмета
     * @param {number} cost - Стоимость предмета в золоте
     * @param {string[]} components - Список компонентов предмета
     */
    constructor(id, name, localizedName, cost, components) {
        this.id = id;
        this.name = name;
        this.localizedName = localizedName;
        this.cost = cost;
        this.components = components;
    }

    /**
     * Создает экземпляр предмета из данных API
     * @param {string} id - Идентификатор предмета
     * @param {ItemData} data - Данные предмета из API
     * @returns {Item} Новый экземпляр предмета
     */
    static create(id, data) {
        return new Item(
            id,
            data.dname || data.localized_name,
            data.localized_name || data.dname,
            data.cost || 0,
            data.components || []
        );
    }

    /**
     * Проверяет, превышает ли стоимость предмета указанный минимум
     * @param {number} minCost - Минимальная стоимость для сравнения
     * @returns {boolean} True, если стоимость предмета выше минимальной
     */
    isExpensive(minCost) {
        return this.cost > minCost;
    }

    /**
     * Проверяет, можно ли купить предмет
     * @returns {boolean} True, если предмет можно купить
     */
    isPurchasable() {
        return !this.isRecipe && this.cost !== 0;
    }

    /**
     * Проверяет, состоит ли предмет из компонентов
     * @returns {boolean} True, если у предмета есть компоненты
     */
    hasComponents() {
        return this.components.length > 0;
    }
}

module.exports = Item; 