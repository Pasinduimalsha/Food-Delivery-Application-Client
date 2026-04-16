import apiService from '../http/apiService';

const RestaurantService = {
    // 1. Get All Restaurants
    getAll: async () => {
        return apiService.get('/api/restaurant/');
    },

    // 2. Create Restaurant
    create: async (restaurantData) => {
        return apiService.post('/api/restaurant/', restaurantData);
    },

    // 3. Update Restaurant
    update: async (id, updatedData) => {
        return apiService.put(`/api/restaurant/${id}/`, updatedData);
    },

    // 4. Delete Restaurant
    delete: async (id) => {
        return apiService.delete(`/api/restaurant/${id}/`);
    }
};

export default RestaurantService;

