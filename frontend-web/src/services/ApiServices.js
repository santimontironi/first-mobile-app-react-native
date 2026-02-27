import axios from 'axios';

const API_URL = 'http://localhost:3000';

export const confirmUserService = async (token, code) => {
    return axios.post(`${API_URL}/confirm/${token}`, { code });
}