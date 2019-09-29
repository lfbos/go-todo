export const auth = {
    isAuthenticated: localStorage.getItem('token') !== null,
    authenticate(token, cb) {
        localStorage.setItem('token', token);
        this.isAuthenticated = true;
        setTimeout(cb, 100)
    },
    signout(cb) {
        localStorage.removeItem('token');
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};
