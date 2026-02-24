import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const registerUserService = (data) => {
    return axios.post(`${API_URL}/register`, data);
}

export const loginUserService = (data) => {
    return axios.post(`${API_URL}/login`, data);
}