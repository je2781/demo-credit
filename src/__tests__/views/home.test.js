"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
require("@testing-library/jest-dom");
const jsdom_1 = require("jsdom");
const path_1 = __importDefault(require("path"));
const homeFilePath = path_1.default.resolve(__dirname, "../../views/home_mock.ejs");
describe("Home page", () => {
    let dom;
    let container;
    // Define your dynamic data
    const dynamicData = {
        isAuthenticated: true,
        Msg: null,
        env: 'testing',
        docTitle: 'Profile',
        path: '/logout',
        email: 'test@test.com',
        url: 'src/public/images/test.png',
        balance: '478',
        userName: 'testuser'
    };
    beforeAll((done) => {
        fs_1.default.readFile(homeFilePath, "utf8", (err, template) => {
            if (err) {
                return done(err);
            }
            // Render the EJS template with the dynamic data
            const renderedHtml = ejs_1.default.render(template, dynamicData);
            dom = new jsdom_1.JSDOM(renderedHtml, { runScripts: "dangerously" });
            container = dom.window.document.body;
            done();
        });
    });
    test("should load user profile", () => {
        // Check if container is defined before using querySelector
        expect(container).toBeDefined();
        expect(container.querySelector(".profile-image")).toBeInTheDocument();
        expect(container.querySelector(".profile-title")).toBeInTheDocument();
        expect(container.querySelector(".fa-solid.fa-wallet")).toBeInTheDocument();
        expect(container.querySelector(".fa-solid.fa-envelope")).toBeInTheDocument();
    });
});
