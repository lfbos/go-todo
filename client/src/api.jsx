import axios from "axios";
import {getUserID} from "./utils";
import swal from "sweetalert";

const BASE_URL = "http://localhost:3030";
const TASK_API_URL = `${BASE_URL}/api/task/`;
const SIGN_UP_URL = `${BASE_URL}/signup`;
const LOGIN_URL = `${BASE_URL}/login`;

const axiosError = err => {
    const {response: {data}} = err;

    if (data && data.hasOwnProperty('message') && data.message) {
        swal('Error', data.message, 'error');
    } else if (data && data.hasOwnProperty('error') && data.error) {
        swal('Error', data.error, 'error');
    } else {
        swal('Error', 'Unexpected internal error, please try later', 'error');
    }
};

const getTasks = () => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return null;
    }

    return axios.get(TASK_API_URL, {
        headers: {
            'Authorization': `Bearer ${token}`
        }
    }).catch(axiosError);
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
    }).catch(axiosError);
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
        }).catch(axiosError);
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
    }).catch(axiosError);
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
    }).catch(axiosError);
};

const login = requestData => axios.post(LOGIN_URL, requestData).catch(axiosError);

const register = requestData => axios.post(SIGN_UP_URL, requestData).catch(axiosError);

export default {
    login,
    register,
    completeTask,
    deleteTask,
    undoTask,
    getTasks,
    createTask
};