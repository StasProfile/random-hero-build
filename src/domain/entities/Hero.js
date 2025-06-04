/**
 * @typedef {Object} HeroData
 * @property {number} id - Уникальный идентификатор героя
 * @property {string} name - Системное имя героя
 * @property {string} localized_name - Локализованное имя героя
 * @property {('str'|'agi'|'int'|'all')} primary_attr - Основной атрибут героя
 * @property {string[]} roles - Список ролей героя
 */

/**
 * Представляет героя в игре Dota 2
 */
class Hero {
    /**
     * Создает экземпляр героя
     * @param {number} id - Уникальный идентификатор героя
     * @param {string} name - Системное имя героя
     * @param {string} localizedName - Локализованное имя героя
     * @param {string} primaryAttribute - Основной атрибут героя
     * @param {string[]} roles - Список ролей героя
     */
    constructor(id, name, localizedName, primaryAttribute, roles) {
        this.id = id;
        this.name = name;
        this.localizedName = localizedName;
        this.primaryAttribute = primaryAttribute;
        this.roles = roles;
    }

    /**
     * Создает экземпляр героя из данных API
     * @param {HeroData} data - Данные героя из API
     * @returns {Hero} Новый экземпляр героя
     */
    static create(data) {
        return new Hero(
            data.id,
            data.name,
            data.localized_name,
            this.#normalizeAttribute(data.primary_attr),
            data.roles || []
        );
    }

    /**
     * Нормализует атрибут героя в читаемый формат
     * @param {string} attr - Сокращенное название атрибута
     * @returns {string} Полное название атрибута
     * @private
     */
    static #normalizeAttribute(attr) {
        const attributes = {
            str: 'Strength',
            agi: 'Agility',
            int: 'Intelligence',
            all: 'Universal'
        };
        return attributes[attr] || 'Unknown';
    }
}

module.exports = Hero; 