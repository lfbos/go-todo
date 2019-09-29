export const parseJwt = (token) => {
    try {
        return JSON.parse(atob(token.split('.')[1]));
    } catch (e) {
        return null;
    }
};

export const getUserFullName = () => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return '';
    }

    const data = parseJwt(token);

    const {name, lastName} = data;

    return `${name.trim()} ${lastName.trim()}`;
};

export const getUserID = () => {
    const token = localStorage.getItem('token');

    if (token === null) {
        return '';
    }

    const data = parseJwt(token);

    const {_id} = data;

    return _id;
};