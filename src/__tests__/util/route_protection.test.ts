import {isAuth} from '../../util/route_protection';

describe('Route Protection', () => {
    let statusCode: number;
    let locationHeader: string;

    it('should throw an error if session Object is not present', () => {
        const req = {
            session: undefined
        };

        expect(isAuth.bind(this, req, {}, () => {})).toThrow('Not Authenticated');
    });

    it('should redirect to login if session object isLoggedIn key has value false', () => {
        const req = {
            session: {
                isLoggedIn: false
            }
        };

        const res = {
            status: jest.fn(function(code: number){
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function(location: string){
                locationHeader = location;
            })

        };

        isAuth(req, res, () => {});

        expect(statusCode).toBe(302);
        expect(locationHeader).toBe('/login');
        expect(res.status).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalled();
    });
});