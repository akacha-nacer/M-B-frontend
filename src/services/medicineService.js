import apiClient from "../api/axios";

const BASE = "/medicines";

const medicineService = {

    search: (query = "") => {
        return apiClient.get(BASE, {
            params: query ? { search: query } : {}
        });
    },

    create: (medicineData) => {
        return apiClient.post(BASE, medicineData);
    },

    update: (id, medicineData) => {
        return apiClient.put(`${BASE}/${id}`, medicineData);
    },

    deactivate: (id) => {
        return apiClient.patch(`${BASE}/${id}/deactivate`);
    }
};

export default medicineService;