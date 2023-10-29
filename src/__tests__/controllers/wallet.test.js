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
require("@testing-library/jest-dom");
const path_1 = __importDefault(require("path"));
const uuid_1 = require("uuid");
const wallet_1 = require("../../controllers/wallet");
const user_1 = require("../../dao/user");
const homeFilePath = path_1.default.resolve(__dirname, "../../views/home_mock.ejs");
let statusCode;
let locationHeader;
let id1;
let id2;
let error;
describe("wallet controller", () => {
    const response = {
        status: jest.fn(function (code) {
            statusCode = code;
            return this;
        }),
        render: jest.fn(function (view, viewParams) {
            error = viewParams.errorMsg;
        }),
    };
    /* Connecting to the database before all tests. */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        //creating test user records
        id1 = (0, uuid_1.v4)();
        id2 = (0, uuid_1.v4)();
        yield (0, user_1.createUser)({
            email: "testing1000@test.com",
            password: "testingpassword",
            imageUrl: "src/public/images/testing.jpg",
            wallet: 200,
            fullName: "testinguser",
        }, {
            id: id1,
            env: "testing",
        });
        yield (0, user_1.createUser)({
            email: "testing10@test.com",
            password: "testpassword",
            imageUrl: "src/public/images/test.jpg",
            wallet: 200,
            fullName: "testuser",
        }, {
            id: id2,
            env: "testing",
        });
    }));
    it("should throw an error if accessing the database fails", (done) => {
        const req = {
            session: {
                user: undefined,
            },
            env: "testing",
            body: {
                fund: "20",
            },
        };
        (0, wallet_1.withdraw)(req, response, () => { }).then((result) => {
            expect(error).toBe("Missing user or user.id");
            done();
        });
    });
    it("should redirect to home page after trasnfering funds to another user", (done) => {
        const req = {
            session: {
                user: {
                    id: id2,
                    email: "testing10test.com",
                },
            },
            body: {
                fund: "40",
                r_email: "testing1000@test.com",
                r_name: "testinguser",
            },
            env: "testing",
        };
        (0, wallet_1.transfer)(req, response, () => { }).then((result) => {
            expect(statusCode).toBe(302);
            expect(locationHeader).toBe("/");
            done();
        });
    });
    it("should show balance of foreign user has increased", (done) => {
        const req = {
            body: {
                email: "testing1000@test.com"
            },
            env: 'testing'
        };
        (0, user_1.findUser)({
            email: req.body.email,
        }, req.env).then((user) => {
            expect(user.wallet).toBe(240);
            done();
        });
    });
    /* Closing database connection aftAll test. */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_1.deleteUser)("testing1000@test.com", "testing");
        yield (0, user_1.deleteUser)("testing10@test.com", "testing");
    }));
});
