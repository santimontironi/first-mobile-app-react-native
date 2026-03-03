import axios from "axios";

const API_URL = 'http://192.168.100.13:3000';

export const getTasksService = (token) => {
    return axios.get(`${API_URL}/tasks`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const createTaskService = (token, data) => {
    return axios.post(`${API_URL}/new-task`, data, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const completeTaskService = (token, taskId) => {
    return axios.patch(`${API_URL}/tasks/${taskId}`, {}, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const getCompletedTasksService = (token) => {
    return axios.get(`${API_URL}/tasks/completed`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}

export const deleteTaskService = (token, taskId) => {
    return axios.delete(`${API_URL}/tasks/${taskId}`, {
        headers: {
            Authorization: `Bearer ${token}`
        }
    });
}