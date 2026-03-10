import apiClient from "../api/axios";

const dashboardService = {

    getStats: () => {
        return apiClient.get("/api/dashboard/stats");
    }
};

export default dashboardService;