const axios = require('axios');
const config = require('../config');

/**
 * @typedef {Object} APIResponse
 * @property {number} status - HTTP статус ответа
 * @property {string} statusText - Текстовое описание статуса
 * @property {Object} data - Данные ответа
 */

/**
 * Класс для работы с OpenDota API
 */
class OpenDotaAPI {
    /** @type {Object.<string, string>} */
    static ENDPOINTS = {
        HEROES: '/heroes',
        ITEMS: '/constants/items'
    };

    /**
     * Создает экземпляр API клиента
     */
    constructor() {
        /** @type {import('axios').AxiosInstance} */
        this.client = axios.create({
            baseURL: config.openDota.baseUrl,
            timeout: config.openDota.timeout,
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    /**
     * Выполняет HTTP запрос к API
     * @param {string} endpoint - Конечная точка API
     * @returns {Promise<any>} Данные ответа
     * @private
     * @throws {Error} Ошибка при выполнении запроса
     */
    async #makeRequest(endpoint) {
        try {
            const response = await this.client.get(endpoint);
            return response.data;
        } catch (error) {
            throw this.#createError(error, endpoint);
        }
    }

    /**
     * Создает объект ошибки на основе ответа API
     * @param {Error} error - Исходная ошибка
     * @param {string} endpoint - Конечная точка API
     * @returns {Error} Форматированная ошибка
     * @private
     */
    #createError(error, endpoint) {
        const baseMessage = `OpenDota API Error (${endpoint})`;

        if (error.response) {
            return new Error(`${baseMessage}: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            return new Error(`${baseMessage}: No response received`);
        }
        return new Error(`${baseMessage}: ${error.message}`);
    }

    /**
     * Получает список героев
     * @returns {Promise<Object[]>} Список героев
     */
    async getHeroes() {
        return this.#makeRequest(OpenDotaAPI.ENDPOINTS.HEROES);
    }
    
    /**
     * Получает список предметов
     * @returns {Promise<Object>} Список предметов
     */
    async getItems() {
        return this.#makeRequest(OpenDotaAPI.ENDPOINTS.ITEMS);
    }
}

module.exports = OpenDotaAPI; 