import axios from 'axios';

const API_URL =  process.env.EXPO_PUBLIC_API_URL;

export const registerUserService = (data) => {
    return axios.post(`${API_URL}/register`, data);
}

export const loginUserService = (data) => {
    return axios.post(`${API_URL}/login`, data);
}

export const confirmUserService = (token, code) => {
    return axios.post(`${API_URL}/confirm/${token}`, { code });
}

export const dashboardService = (token) => {
    return axios.get(`${API_URL}/dashboard`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}