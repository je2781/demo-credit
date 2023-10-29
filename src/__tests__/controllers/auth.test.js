"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const user_1 = require("../../dao/user");
const auth_1 = require("../../controllers/auth");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const uuid_1 = require("uuid");
let statusCode;
let locationHeader;
let id;
let error;
describe("Authentication", () => {
    /* Connecting to the database before each test. */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        id = (0, uuid_1.v4)();
        //creating test user record
        yield (0, user_1.createUser)({
            email: "testing1000@test.com",
            password: "testingpassword",
            imageUrl: "src/public/images/testing.jpg",
            wallet: 200,
            fullName: "testinguser",
        }, {
            id: id,
            env: "testing",
        });
    }));
    it("should throw error because user already registered", (done) => {
        const request = {
            body: {
                email: "testing1000@test.com",
                password: "testingpassword",
                c_password: "testingpassword",
                image: "/src/public/images/testing.jpg",
                balance: "200",
                fullName: "testinguser",
            },
            env: "testing",
            id: id,
        };
        const response = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            render: jest.fn(function (view, viewParams) {
                error = viewParams.errorMsg;
            }),
        };
        (0, auth_1.postSignup)(request, response, () => { }).then((result) => {
            expect(error).toBe("Email is already in use");
            expect(statusCode).toBe(422);
            done();
        });
    });
    it("should log in a user", (done) => {
        const response = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function (location) {
                locationHeader = location;
            }),
        };
        const request = {
            body: {
                email: "testing1000@test.com",
                password: "testingpassword",
            },
            session: {
                isLoggedIn: false,
                user: {},
                save: jest.fn(() => {
                    response.status(302);
                    response.redirect("/");
                }),
            },
            env: "testing",
        };
        bcryptjs_1.default.compare = function (s, hash) {
            return __awaiter(this, void 0, void 0, function* () {
                return true;
            });
        };
        (0, auth_1.postLogin)(request, response, () => { }).then((result) => {
            expect(statusCode).toBe(302);
            expect(locationHeader).toBe("/");
            done();
        });
    });
    it("should show validation error because the user doesn't exist", (done) => {
        const request = {
            body: {
                email: "testing34@test.com",
                password: "test23password",
            },
            env: "testing",
        };
        const response = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            render: jest.fn(function (view, viewParams) {
                error = viewParams.errorMsg;
            }),
        };
        (0, auth_1.postLogin)(request, response, () => { }).then((result) => {
            expect(error).toBe("User account doesn't exist. Create an account");
            expect(statusCode).toBe(422);
            done();
        });
    });
    it("should logout when logout button is pressed", (done) => {
        const response = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function (location) {
                locationHeader = location;
            }),
        };
        const request = {
            session: {
                destroy: jest.fn((err) => {
                    response.status(302);
                    response.redirect("/login");
                }),
            },
        };
        (0, auth_1.postLogout)(request, response, () => { }).then((result) => {
            expect(statusCode).toBe(302);
            expect(locationHeader).toBe("/login");
            done();
        });
    });
    /* Closing database connection aftAll test. */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_1.deleteUser)("testing1000@test.com", "testing");
    }));
});
