"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const route_protection_1 = require("../../util/route_protection");
describe('Route Protection', () => {
    let statusCode;
    let locationHeader;
    it('should throw an error if session Object is not present', () => {
        const req = {
            session: undefined
        };
        expect(route_protection_1.isAuth.bind(this, req, {}, () => { })).toThrow('Not Authenticated');
    });
    it('should redirect to login if session object isLoggedIn key has value false', () => {
        const req = {
            session: {
                isLoggedIn: false
            }
        };
        const res = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function (location) {
                locationHeader = location;
            })
        };
        (0, route_protection_1.isAuth)(req, res, () => { });
        expect(statusCode).toBe(302);
        expect(locationHeader).toBe('/login');
        expect(res.status).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalled();
    });
});
