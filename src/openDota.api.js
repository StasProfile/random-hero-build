const axios = require('axios');

class OpenDotaAPI {
    static BASE_URL = 'https://api.opendota.com/api';
    static ENDPOINTS = {
        HEROES: '/heroes',
        ITEMS: '/constants/items'
    };

    constructor() {
        this.client = axios.create({
            baseURL: OpenDotaAPI.BASE_URL,
            timeout: 5000,
            headers: {
                'Accept': 'application/json'
            }
        });
    }

    async #makeRequest(endpoint) {
        try {
            return await this.client.get(endpoint);
        } catch (error) {
            this.#handleError(error, endpoint);
        }
    }

    #handleError(error, endpoint) {
        const baseMessage = `Failed to fetch data from ${endpoint}`;

        if (error.response) {
            throw new Error(`${baseMessage}: ${error.response.status} - ${error.response.statusText}`);
        } else if (error.request) {
            throw new Error(`${baseMessage}: No response from server`);
        } else {
            throw new Error(`${baseMessage}: ${error.message}`);
        }
    }

    async getHeroes() {
        return this.#makeRequest(OpenDotaAPI.ENDPOINTS.HEROES);
    }
    
    async getItems() {
        return this.#makeRequest(OpenDotaAPI.ENDPOINTS.ITEMS);
    }
}

module.exports = OpenDotaAPI;