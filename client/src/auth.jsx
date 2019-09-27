export const auth = {
    isAuthenticated: false,
    authenticate(token, cb) {
        localStorage.setItem('token', token);
        this.isAuthenticated = localStorage.getItem('token') !== null;
        setTimeout(cb, 100)
    },
    signout(cb) {
        localStorage.removeItem('token');
        this.isAuthenticated = false;
        setTimeout(cb, 100);
    }
};
