"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
require("@testing-library/jest-dom");
const jsdom_1 = require("jsdom");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const authFormFilePath = path_1.default.resolve(__dirname, "../../../views/auth/auth_mock_form.ejs");
describe("Auth Form", () => {
    let dom;
    let container;
    // Define your dynamic data
    const dynamicData = {
        isAuthenticated: false,
        mode: 'signup',
        errorMsg: undefined,
        docTitle: 'Signup',
        path: '/signup',
        validationErrors: [],
        oldInput: {
            email: 'test@test.com',
            password: "testPassowrd",
            confirmPassword: "testPassowrd",
            fullName: "John Doe",
        },
    };
    beforeAll((done) => {
        fs_1.default.readFile(authFormFilePath, "utf8", (err, template) => {
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
    test("should load navbar and form elements", () => {
        // Check if container is defined before using querySelector
        expect(container).toBeDefined();
        expect(container.querySelector(".brand__nav")).toBeInTheDocument();
        expect(container.querySelector("#side-menu-toggle")).toBeInTheDocument();
        expect(container.querySelector(".main-header__nav")).toBeInTheDocument();
        expect(container.querySelector(".main-header__item-list")).toBeInTheDocument();
        expect(container.querySelector(".main-header__item")).toBeInTheDocument();
        expect(container.querySelector(".mobile-nav")).toBeInTheDocument();
        expect(container.querySelector(".mobile-nav__item-list")).toBeInTheDocument();
        expect(container.querySelector(".mobile-nav__item")).toBeInTheDocument();
        expect(container.querySelector("#fullName")).toBeInTheDocument();
        expect(container.querySelector("#email")).toBeInTheDocument();
        expect(container.querySelector("#password")).toBeInTheDocument();
        expect(container.querySelector("#c_password")).toBeInTheDocument();
        expect(container.querySelector("button")).toBeInTheDocument();
    });
});
