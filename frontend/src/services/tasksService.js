import axios from "axios";

const API_URL = 'http://192.168.100.13:3000';

export const getTasksService = (token) => {
    return axios.get(`${API_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

