import apiClient from "../api/axios";

const BASE = "/customers";

const customerService = {

    // Search or list all — pass empty string or null to get all
    search: (query) => {
        return apiClient.get(BASE, {
            params: query ? { search: query } : {}
        });
    },

    getById: (id) => {
        return apiClient.get(`${BASE}/${id}`);
    },

    create: (customerData) => {
        return apiClient.post(BASE, customerData);
    },

    update: (id, customerData) => {
        return apiClient.put(`${BASE}/${id}`, customerData);
    },

    delete: (id) => {
        return apiClient.delete(`${BASE}/${id}`);
    }
};

export default customerService;