"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.isAuth = void 0;
const isAuth = (req, res, next) => {
    if (!req.session) {
        const err = new Error('Not Authenticated');
        throw err;
    }
    if (!req.session.isLoggedIn) {
        res.status(302).redirect('/login');
    }
    next();
};
exports.isAuth = isAuth;
