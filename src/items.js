const { UNAVAILABLE_ITEMS, COMPONENT_ITEM_NAMES } = require('./utils/const');
const getRandomElements = require('./utils/getRandomElements');
const OpenDotaAPI = require('./openDota.api');

const SPECIAL_ITEMS = {
    DAGON: 'dagon',
    AGHANIM: 'aghanim',
    BLINK: 'blink',
    NECRONOMICON: 'necronomicon'
};

class Items {
    #items;
    #MIN_ITEM_COST = 2500;

    constructor(openDotaAPI) {
        this.openDotaAPI = openDotaAPI;
        this.#items = [];
    }

    async init() {
        try {
            await this.#fetchItems();
            return this;
        } catch (error) {
            console.error('Failed to initialize items:', error);
            throw error;
        }
    }

    async #fetchItems() {
        const itemsResponse = await this.openDotaAPI.getItems();
        this.#items = this.#filterItems(itemsResponse.data);
    }

    #filterItems(items) {
        const filteredEntries = Object.entries(items).filter(([itemKey, item]) => 
            this.#isValidItem(itemKey, item)
        );
        
        return filteredEntries.map(([_, item]) => item);
    }

    #isValidItem(itemKey, item) {
        return this.#isExpensiveEnough(item) &&
               this.#isPurchasable(item) &&
               this.#isAvailable(itemKey) &&
               this.#hasComponents(item) &&
               !this.#isComponentItem(itemKey);
    }

    #isExpensiveEnough(item) {
        return item.cost > this.#MIN_ITEM_COST;
    }

    #isPurchasable(item) {
        return !item.recipe && item.cost !== 0;
    }

    #isAvailable(itemKey) {
        return !UNAVAILABLE_ITEMS.includes(itemKey);
    }

    #hasComponents(item) {
        return item.components?.length > 0;
    }

    #isComponentItem(itemKey) {
        return COMPONENT_ITEM_NAMES.some(component => itemKey.includes(component));
    }

    #isSpecialItem(item, type) {
        const itemName = item.dname?.toLowerCase() || item.localized_name?.toLowerCase() || '';
        return itemName.includes(type);
    }

    getRandomItems(count) {
        if (!this.#items || this.#items.length === 0) {
            throw new Error('Items data is not initialized');
        }

        const randomItems = [];
        const selectedItems = getRandomElements(this.#items, count * 2); // Get more items for filtering
        const specialItemsSelected = new Map(
            Object.values(SPECIAL_ITEMS).map(type => [type, false])
        );
        
        for (const item of selectedItems) {
            if (randomItems.length >= count) break;
            
            if (!item.dname && !item.localized_name) continue;

            // Check for special items
            const specialItem = Object.values(SPECIAL_ITEMS).find(type => 
                this.#isSpecialItem(item, type)
            );

            if (specialItem && specialItemsSelected.get(specialItem)) continue;

            randomItems.push(item);
            if (specialItem) {
                specialItemsSelected.set(specialItem, true);
            }
        }

        return randomItems;
    }

    async refresh() {
        await this.#fetchItems();
    }
}

module.exports = Items;
