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
describe("wallet controller", () => {
    let statusCode;
    let locationHeader;
    let server;
    let id1;
    let id2;
    let recipient;
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
                fund: '20'
            }
        };
        (0, wallet_1.withdraw)(req, {}, () => { }).then((result) => {
            expect(result.message).toBe("Missing user or user.id");
            done();
        });
    });
    it("should redirect to home page after withdrawing funds from account", (done) => {
        const req = {
            session: {
                user: {
                    id: id2,
                    email: "testing10@test.com",
                },
            },
            body: {
                fund: "40",
            },
            env: "testing",
        };
        const res = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function (location) {
                locationHeader = location;
            }),
        };
        (0, wallet_1.withdraw)(req, {}, () => { })
            .then((result) => {
            return (0, user_1.findUser)({ email: req.session.user.email });
        })
            .then((user) => {
            recipient = user;
            expect(statusCode).toBe(302);
            expect(recipient.wallet).toBe(160);
            expect(locationHeader).toBe("/");
            expect(res.status).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalled();
            done();
        });
    });
    it("should redirect to home page after depositing funds into account", (done) => {
        const req = {
            session: {
                user: {
                    id: id2,
                    email: "testing10@test.com",
                },
            },
            body: {
                fund: "40",
            },
            env: "testing",
        };
        const res = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function (location) {
                locationHeader = location;
            }),
        };
        (0, wallet_1.deposit)(req, {}, () => { })
            .then((result) => {
            return (0, user_1.findUser)({ email: req.session.user.email });
        })
            .then((user) => {
            recipient = user;
            expect(statusCode).toBe(302);
            expect(recipient.wallet).toBe(200);
            expect(locationHeader).toBe("/");
            expect(res.status).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalled();
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
        const res = {
            status: jest.fn(function (code) {
                statusCode = code;
                return this;
            }),
            redirect: jest.fn(function (location) {
                locationHeader = location;
            }),
        };
        (0, wallet_1.transfer)(req, {}, () => { })
            .then((result) => {
            return (0, user_1.findUser)({ email: req.body.r_email });
        })
            .then((user) => {
            recipient = user;
            expect(statusCode).toBe(302);
            expect(recipient.wallet).toBe(240);
            expect(locationHeader).toBe("/");
            expect(res.status).toHaveBeenCalled();
            expect(res.redirect).toHaveBeenCalled();
            done();
        });
    });
    /* Closing database connection aftAll test. */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield (0, user_1.deleteUser)("testing1000@test.com", 'testing');
        yield (0, user_1.deleteUser)("testing10@test.com", 'testing');
    }));
});
// describe("Success page", () => {
//   let dom: JSDOM;
//   let container: HTMLElement;
//   // Define your dynamic data
//   const dynamicData = {
//     isAuthenticated: true,
//     docTitle: "Success",
//     path: "/logout",
//     shortId: "hJHFq8awtUUPXeseHpBfyY",
//   };
//   beforeAll((done) => {
//     fs.readFile(successFilePath, "utf8", (err, template) => {
//       if (err) {
//         return done(err);
//       }
//       // Render the EJS template with the dynamic data
//       const renderedHtml = ejs.render(template, dynamicData);
//       dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
//       container = dom.window.document.body;
//       done();
//     });
//   });
//   test("should show links and badge", () => {
//     // Check if container is defined before using querySelector
//     expect(container).toBeDefined();
//     expect(container.querySelector(".fa-circle-check")).toBeInTheDocument();
//     expect(container.querySelector("a[href^='/decode']")).toBeInTheDocument();
//     expect(
//       container.querySelector("a[href^='/statistic']")
//     ).toBeInTheDocument();
//   });
// });
// describe("Home page", () => {
//   let dom: JSDOM;
//   let container: HTMLElement;
//   // Define your dynamic data
//   const dynamicData = {
//     isAuthenticated: true,
//     Msg: null,
//     docTitle: "Profile",
//     path: "/logout",
//     validationErrors: [],
//     url: 'src/public/images/testing.jpg',
//     userName: 'John Pope',
//     email: 'testing10@test.com',
//     balance: '399'
//   };
//   beforeAll((done) => {
//     fs.readFile(homeFilePath, "utf8", (err, template) => {
//       if (err) {
//         return done(err);
//       }
//       // Render the EJS template with the dynamic data
//       const renderedHtml = ejs.render(template, dynamicData);
//       dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
//       container = dom.window.document.body;
//       done();
//     });
//   });
//   test("should show url form with elements", () => {
//     // Check if container is defined before using querySelector
//     expect(container).toBeDefined();
//     expect(container.querySelector(".profile-image")).toBeInTheDocument();
//     expect(container.querySelector(".profile__item")).toBeInTheDocument();
//   });
// });
