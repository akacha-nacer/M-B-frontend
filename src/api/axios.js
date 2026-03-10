import axios from "axios";
import {BASE_API_URL,STORAGE_KEYS,HTTP_STATUS} from "../utils/const";
import config from "../config";

const apiClient = axios.create({
    baseURL: BASE_API_URL,
    timeout: 10000,
    headers: {
        "Content-Type": "application/json",
    }
});

apiClient.interceptors.request.use((config) => {
    const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN)

    if (token){
        config.headers.Authorization = `Bearer ${token}`
    }

        if (process.env.NODE_ENV === 'development') {
            console.log('📤 Sending request to:', config.url);
            console.log('📤 Method:', config.method.toUpperCase());
            console.log('📤 Data:', config.data);
        }

        return config;
    },
    (error) => {
        console.error('❌ Request setup error:', error);
        return Promise.reject(error);

});

apiClient.interceptors.response.use(
    (response) => {
        if (process.env.NODE_ENV === 'development') {
            console.log('✅ Response received from:', response.config.url);
            console.log('✅ Status:', response.status);
            console.log('✅ Data:', response.data);
        }

        return response;
    },


    async (error) => {
        const originalRequest = error.config;


        if (error.response?.status === HTTP_STATUS.UNAUTHORIZED) {

            if (!originalRequest._retry) {
                originalRequest._retry = true;

                try {
                    const refreshToken = localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
                    if (!refreshToken) {
                        throw new Error('No refresh token available');
                    }

                    const response = await axios.post(
                        `${API_BASE_URL}/auth/refresh-token`,
                        { refreshToken }
                    );

                    const { accessToken } = response.data;
                    localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, accessToken);
                    originalRequest.headers.Authorization = `Bearer ${accessToken}`;

                    console.log('🔄 Token refreshed, retrying request...');
                    return apiClient(originalRequest);

                } catch (refreshError) {
                    console.error('❌ Token refresh failed:', refreshError);
                    localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
                    localStorage.removeItem(STORAGE_KEYS.USER);


                    window.location.href = '/login';

                    return Promise.reject(refreshError);
                }
            }
        }

        if (process.env.NODE_ENV === 'development') {
            console.error('❌ Response error:', error.response?.status, error.message);
            console.error('❌ Error details:', error.response?.data);
        }

        return Promise.reject(error);
    }
);

export default apiClient;