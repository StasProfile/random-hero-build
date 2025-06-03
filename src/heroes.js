const { EXCLUDED_HEROES } = require('./utils/const');
const getRandomElements = require('./utils/getRandomElements');

class Heroes {
    #heroes;
    #DEFAULT_HEROES_COUNT = 3;

    constructor(openDotaAPI) {
        this.openDotaAPI = openDotaAPI;
        this.#heroes = [];
    }

    async init() {
        try {
            await this.#fetchHeroes();
            return this;
        } catch (error) {
            console.error('Failed to initialize heroes:', error);
            throw error;
        }
    }

    async #fetchHeroes() {
        const heroesResponse = await this.openDotaAPI.getHeroes();
        this.#heroes = this.#filterHeroes(heroesResponse.data);
    }

    #filterHeroes(heroes) {
        return heroes.filter(hero => this.#isValidHero(hero));
    }

    #isValidHero(hero) {
        return !this.#isExcluded(hero) && this.#hasValidName(hero);
    }

    #isExcluded(hero) {
        return EXCLUDED_HEROES.includes(hero.name);
    }

    #hasValidName(hero) {
        return hero.name && hero.localized_name;
    }

    getRandomHeroes(count = this.#DEFAULT_HEROES_COUNT) {
        if (!this.#heroes || this.#heroes.length === 0) {
            throw new Error('Heroes data is not initialized');
        }

        if (count > this.#heroes.length) {
            throw new Error(`Requested ${count} heroes but only ${this.#heroes.length} are available`);
        }

        return getRandomElements(this.#heroes, count).map(hero => ({
            name: hero.localized_name,
            attribute: this.#getHeroAttribute(hero.primary_attr),
            roles: hero.roles || []
        }));
    }

    #getHeroAttribute(attr) {
        const attributes = {
            str: 'Strength',
            agi: 'Agility',
            int: 'Intelligence',
            all: 'Universal'
        };
        return attributes[attr] || 'Unknown';
    }

    async refresh() {
        await this.#fetchHeroes();
    }

    get availableHeroesCount() {
        return this.#heroes.length;
    }
}

module.exports = Heroes;