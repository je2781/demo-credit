"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const body_parser_1 = __importDefault(require("body-parser"));
const express_1 = __importDefault(require("express"));
const multer_1 = __importDefault(require("multer"));
const connect_flash_1 = __importDefault(require("connect-flash"));
const uuid_1 = require("uuid");
const express_session_1 = __importDefault(require("express-session"));
const MySQLStore = require('express-mysql-session')(express_session_1.default);
const path_1 = __importDefault(require("path"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)();
const options = {
    host: process.env.DB_HOST,
    port: process.env.DB_PORT,
    user: process.env.DB_USER,
    password: process.env.DB_PASS,
    database: process.env.NODE_ENV === "production" ? process.env.DB_PROD : process.env.DB_DEV,
};
const auth_routes_1 = __importDefault(require("../routes/auth.routes"));
const wallet_routes_1 = __importDefault(require("../routes/wallet.routes"));
const error_1 = require("../controllers/error");
const app = (0, express_1.default)();
//setting up collection to store session data
const store = new MySQLStore(options);
//express app config settings
app.set("view engine", "ejs");
app.set("views", "src/views");
//parsing body of client request - for json data
app.use(body_parser_1.default.json());
//parsing body of client request - only for text requests
app.use(body_parser_1.default.urlencoded({ extended: false }));
//setting flash message middleware
app.use((0, connect_flash_1.default)());
//defining methods used to create middleware for file processing
const fileStorage = multer_1.default.diskStorage({
    destination: (req, file, cb) => {
        cb(null, "src/public/images");
    },
    filename: (req, file, cb) => {
        cb(null, `${(0, uuid_1.v4)()}-${file.originalname}`);
    },
});
const fileFilter = (req, file, cb) => {
    if (file.mimetype === "image/png" ||
        file.mimetype === "image/jpg" ||
        file.mimetype === "image/jpeg") {
        cb(null, true);
    }
    else {
        cb(null, false);
    }
};
//defining multer middleware for file processing
app.use((0, multer_1.default)({
    fileFilter: fileFilter,
    storage: fileStorage,
}).single("image"));
//funneling static files request to public folder
app.use(express_1.default.static(path_1.default.join(__dirname, "..", "public")));
//configuring server session middleware
app.use((0, express_session_1.default)({
    secret: "3To6K1aCltNfmqi2",
    resave: false,
    saveUninitialized: false,
    store: store,
}));
//initializing local variables for views
app.use((req, res, next) => {
    res.locals.isAuthenticated = req.session.isLoggedIn;
    next();
});
app.use(auth_routes_1.default);
app.use(wallet_routes_1.default);
app.use(error_1.getPageNotFound);
app.use(error_1.get500Page);
exports.default = app;
