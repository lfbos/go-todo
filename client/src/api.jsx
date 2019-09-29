import axios from "axios";
import {getUserID} from "./utils";

const BASE_URL = "http://localhost:3030";
const TASK_API_URL = `${BASE_URL}/api/task/`;
const SIGN_UP_URL = `${BASE_URL}/signup`;
const LOGIN_URL = `${BASE_URL}/login`;

const getTasks = () => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return null;
    }

    return axios.get(TASK_API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const deleteTask = taskId => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return null;
    }

    return axios.delete(`${TASK_API_URL}${taskId}`, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const undoTask = taskId => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return null;
    }

    return axios
        .post(`${TASK_API_URL}${taskId}/undo`, null, {
            headers: {
                'Authorization': `Bearer ${token}`
            }
        });
};

const createTask = task => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return null;
    }

    return axios.post(TASK_API_URL, {task, user: getUserID()}, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const completeTask = taskId => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return null;
    }

    return axios.post(`${TASK_API_URL}${taskId}/complete`, null, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    });
};

const login = requestData => axios.post(LOGIN_URL, requestData);

const register = requestData => axios.post(SIGN_UP_URL, requestData);

export default {
    login,
    register,
    completeTask,
    deleteTask,
    undoTask,
    getTasks,
    createTask
};