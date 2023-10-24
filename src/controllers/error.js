"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.getPageNotFound = exports.get500Page = void 0;
const get500Page = (error, req, res, next) => {
    res.status(500).render('500', {
        docTitle: 'Server Error',
        path: '/500',
        msg: error.message
    });
};
exports.get500Page = get500Page;
const getPageNotFound = (req, res, next) => {
    res.status(404).render('404', {
        docTitle: 'NotFound',
        path: '/404',
    });
};
exports.getPageNotFound = getPageNotFound;
