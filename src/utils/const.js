export const BASE_API_URL = 'http://localhost:8080/api/v1'

export const API_ENDPOINTS = {
    AUTH : {
        LOGIN : '/auth/authenticate',
        REGISTER : 'auth/register',
        LOGOUT : '/auth/logout',
        REFRESH_TOKEN : '/auth/refresh-token',
        RESET_PASSWORD : '/users',
        FORGOT_PASSWORD: '/auth/forgot-password',
        VERIFY_EMAIL: '/auth/verify-email',
    },
    USER : {
        GET_CURRENT_USER: '/users/me',
        CHANGE_PASSWORD : '/change-password'
    }




};

export const STORAGE_KEYS = {
        ACCESS_TOKEN : 'access_token',
        REFRESH_TOKEN : 'refresh_token',
        USER : 'user_data',
        REMEMBERED_PASSWORD: 'rememberedPassword',
        REMEMBERED_EMAIL: 'rememberedEmail',
};


export const HTTP_STATUS = {
    OK: 200,
    CREATED: 201,
    NO_CONTENT: 204,
    BAD_REQUEST: 400,
    UNAUTHORIZED: 401,
    FORBIDDEN: 403,
    NOT_FOUND: 404,
    SERVER_ERROR: 500,
};