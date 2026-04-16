import apiService from '../http/apiService';

const MenuService = {
    // 1. Get All Menus for a restaurant
    getAll: async (restaurantId) => {
        return apiService.get(`/api/restaurants/${restaurantId}/menus`);
    },

    // 2. Create Menu
    create: async (restaurantId, menuData) => {
        return apiService.post(`/api/restaurants/${restaurantId}/menus`, menuData);
    },

    // 3. Update Menu
    update: async (restaurantId, menuId, updatedData) => {
        return apiService.put(`/api/restaurants/${restaurantId}/menus/${menuId}`, updatedData);
    },

    // 4. Delete Menu
    delete: async (restaurantId, menuId) => {
        return apiService.delete(`/api/restaurants/${restaurantId}/menus/${menuId}`);
    }
};

export default MenuService;

