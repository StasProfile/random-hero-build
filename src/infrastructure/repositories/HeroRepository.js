const IHeroRepository = require('../../domain/repositories/IHeroRepository');
const Hero = require('../../domain/entities/Hero');
const { EXCLUDED_HEROES } = require('../../utils/const');

/**
 * Реализация репозитория для работы с героями через OpenDota API
 * @implements {IHeroRepository}
 */
class HeroRepository extends IHeroRepository {
    /**
     * Создает экземпляр репозитория героев
     * @param {import('../OpenDotaAPI')} openDotaAPI - Экземпляр OpenDota API клиента
     */
    constructor(openDotaAPI) {
        super();
        this.openDotaAPI = openDotaAPI;
        /** @type {Hero[]} */
        this.heroes = [];
    }

    /**
     * @inheritdoc
     */
    async getAll() {
        if (this.heroes.length === 0) {
            await this.refresh();
        }
        return this.heroes;
    }

    /**
     * @inheritdoc
     */
    async refresh() {
        const heroesData = await this.openDotaAPI.getHeroes();
        this.heroes = this.#processHeroesData(heroesData);
    }

    /**
     * Обрабатывает данные героев из API
     * @param {import('../../domain/entities/Hero').HeroData[]} heroesData - Данные героев из API
     * @returns {Hero[]} Список обработанных героев
     * @private
     */
    #processHeroesData(heroesData) {
        return heroesData
            .filter(this.#isValidHero)
            .map(data => Hero.create(data));
    }

    /**
     * Проверяет валидность данных героя
     * @param {import('../../domain/entities/Hero').HeroData} hero - Данные героя для проверки
     * @returns {boolean} True, если герой валиден
     * @private
     */
    #isValidHero(hero) {
        return hero.name && 
               hero.localized_name && 
               !EXCLUDED_HEROES.includes(hero.name);
    }
}

module.exports = HeroRepository; 