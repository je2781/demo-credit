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
const supertest_1 = __importDefault(require("supertest"));
require("@testing-library/jest-dom");
const api_1 = __importDefault(require("../../functions/api"));
const jsdom_1 = require("jsdom");
const path_1 = __importDefault(require("path"));
const ejs_1 = __importDefault(require("ejs"));
const fs_1 = __importDefault(require("fs"));
const server_1 = require("../../db/server");
const successFilePath = path_1.default.resolve(__dirname, "../../views/success_mock.ejs");
const homeFilePath = path_1.default.resolve(__dirname, "../../views/home_mock.ejs");
require("dotenv").config();
const agent = supertest_1.default.agent(api_1.default); // Create an agent to maintain cookies
describe("short route", () => {
    let cookies;
    let db;
    /* Connecting to the database before all tests. */
    beforeAll(() => __awaiter(void 0, void 0, void 0, function* () {
        db = (0, server_1.dbConnection)('testing', 0);
        const res = yield agent
            .post("/login")
            .send({ email: "test1000@test.com", password: "testingpassword" });
        // Parse and store the session cookies
        const setCookieHeader = res.headers["set-cookie"];
        if (Array.isArray(setCookieHeader)) {
            cookies = setCookieHeader.map((cookieStr) => cookieStr.split(";")[0]);
        }
        else if (typeof setCookieHeader === "string") {
            cookies = [setCookieHeader.split(";")[0]];
        }
    }));
    it("should redirect to success page after generating a shortened URL", () => __awaiter(void 0, void 0, void 0, function* () {
        // Set each session cookie in the request headers
        cookies.forEach((cookie) => {
            agent.set("Cookie", cookie);
        });
        const res = yield agent.post("/encode").send({
            longUrl: "https://example.com",
        });
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe("/success");
    }));
    it("should redirect to original URL", () => __awaiter(void 0, void 0, void 0, function* () {
        // Set each session cookie in the request headers
        cookies.forEach((cookie) => {
            agent.set("Cookie", cookie);
        });
        const res = yield agent.get("/decode/hJHFq8awtUUPXeseHpBfyY");
        expect(res.statusCode).toBe(302);
        expect(res.header.location).toBe("https://example.com");
    }));
    it("should return stats about shortened url path", () => __awaiter(void 0, void 0, void 0, function* () {
        // Set each session cookie in the request headers
        cookies.forEach((cookie) => {
            agent.set("Cookie", cookie);
        });
        const res = yield agent.get("/statistic/hJHFq8awtUUPXeseHpBfyY");
        expect(res.statusCode).toBe(302);
        expect(res.body.createdAt).toBe("10/8/2023");
        expect(res.body.originalUrl).toBe("https://example.com");
        expect(res.body.hasEncryption).toBe(true);
    }));
    /* Closing database connection aftAll test. */
    afterAll(() => __awaiter(void 0, void 0, void 0, function* () {
        yield db.destroy();
    }));
});
// describe("short controller", () => {
//   it("it should throw an error ");
// });
describe("Success page", () => {
    let dom;
    let container;
    // Define your dynamic data
    const dynamicData = {
        isAuthenticated: true,
        docTitle: "Success",
        path: "/logout",
        shortId: "hJHFq8awtUUPXeseHpBfyY",
    };
    beforeAll((done) => {
        fs_1.default.readFile(successFilePath, "utf8", (err, template) => {
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
    test("should show links and badge", () => {
        // Check if container is defined before using querySelector
        expect(container).toBeDefined();
        expect(container.querySelector(".fa-circle-check")).toBeInTheDocument();
        expect(container.querySelector("a[href^='/decode']")).toBeInTheDocument();
        expect(container.querySelector("a[href^='/statistic']")).toBeInTheDocument();
    });
});
describe("Home page", () => {
    let dom;
    let container;
    // Define your dynamic data
    const dynamicData = {
        isAuthenticated: true,
        hasErrorMsg: false,
        hasMsg: false,
        Msg: null,
        docTitle: "Home page",
        path: "/logout",
        validationErrors: [],
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
    test("should show url form with elements", () => {
        // Check if container is defined before using querySelector
        expect(container).toBeDefined();
        expect(container.querySelector("#longUrl")).toBeInTheDocument();
        expect(container.querySelector("button")).toBeInTheDocument();
    });
});
