import apiClient from "../api/axios";
import {API_ENDPOINTS,STORAGE_KEYS} from "../utils/const";

const authService = {


    login: async (email,password) =>{
        try {
            const response = await apiClient.post(API_ENDPOINTS.AUTH.LOGIN, {
                password,
                email,
            });

            const {
                access_token,
                refresh_token,
                mfaEnabled,
            } = response.data ;

            localStorage.setItem(STORAGE_KEYS.ACCESS_TOKEN, access_token);
            localStorage.setItem(STORAGE_KEYS.REFRESH_TOKEN,refresh_token);
            // localStorage.setItem(STORAGE_KEYS.USER,JSON.stringify(user));

            return response.data;

        }catch (error){
            console.log('Login failed ', error);
            throw error;
        }
    },


    register: async (userData) => {
        try {
            const response = apiClient.post(API_ENDPOINTS.AUTH.REGISTER, userData);
            console.log('registration successful');

            return (await response).data ;

        }catch (error){
            console.log('registration failed', error);
            throw error;
        }
    },

    logout: async () => {
        try {
            await apiClient.post(API_ENDPOINTS.AUTH.LOGOUT);

        }catch (error){
            console.log('logout failed', error);
        }finally {
            localStorage.removeItem(STORAGE_KEYS.ACCESS_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.REFRESH_TOKEN);
            localStorage.removeItem(STORAGE_KEYS.USER);
            console.log('logged out locally');

        }
    },

    forgotPassword: async (email) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.AUTH.FORGOT_PASSWORD,
                { email }
            );

            console.log('✅ Password reset email sent');
            return response.data;

        } catch (error) {
            console.error('❌ Forgot password failed:', error);
            throw error;
        }
    },

    resetPassword: async (token, newPassword) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.AUTH.RESET_PASSWORD,
                {
                    token,
                    newPassword,
                }
            );

            console.log('✅ Password reset successful');
            return response.data;

        } catch (error) {
            console.error('❌ Password reset failed:', error);
            throw error;
        }
    },

    changePassword: async (currentPassword, newPassword) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.USERS.CHANGE_PASSWORD,
                {
                    currentPassword,
                    newPassword,
                }
            );

            console.log('✅ Password changed successfully');
            return response.data;

        } catch (error) {
            console.error('❌ Password change failed:', error);
            throw error;
        }
    },

    verifyEmail: async (token) => {
        try {
            const response = await apiClient.post(
                API_ENDPOINTS.AUTH.VERIFY_EMAIL,
                { token }
            );

            console.log('✅ Email verified successfully');
            return response.data;

        } catch (error) {
            console.error('❌ Email verification failed:', error);
            throw error;
        }
    },


    getCurrentUser: () => {
        const userStr = localStorage.getItem(STORAGE_KEYS.USER);

        if (userStr) {
            try {
                // Parse JSON string to object
                return JSON.parse(userStr);
            } catch (error) {
                console.error('❌ Error parsing user data:', error);
                return null;
            }
        }

        return null;
    },

    isAuthenticated: () => {
        const token = localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
        return !!token;  // !! converts to boolean (true/false)
    },

    getAccessToken: () => {
        return localStorage.getItem(STORAGE_KEYS.ACCESS_TOKEN);
    },

    getRefreshToken: () => {
        return localStorage.getItem(STORAGE_KEYS.REFRESH_TOKEN);
    },
};

export default authService;