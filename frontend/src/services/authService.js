import axios from 'axios';

const API_URL = 'http://192.168.100.13:3000';

export const registerUserService = (data) => {
    return axios.post(`${API_URL}/register`, data);
}

export const loginUserService = (data) => {
    return axios.post(`${API_URL}/login`, data);
}

export const confirmUserService = (data) => {
    return axios.post(`${API_URL}/confirm`, data);
}