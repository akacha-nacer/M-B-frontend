export const BASE_API_URL = 'http://localhost:8080/api/v1'

export const API_ENDPOINTS = {
    AUTH : {
        LOGIN : '/auth/authenticate',
        REGISTER : 'auth/register',
        LOGOUT : '/auth/logout',
        REFRESH_TOKEN : '/auth/refresh-token',
        RESET_PASSWORD : '/users',
    },




};

export const STORAGE_KEYS = {
        ACCESS_TOKEN : 'access_token',
        REFRESH_TOKEN : 'refresh_token',
        USER : 'user_data',
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