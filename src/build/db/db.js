"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
// require("dotenv").config();
const knexfile_1 = __importDefault(require("./knexfile"));
const knex_1 = __importDefault(require("knex"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '../../.env' });
const environment = process.env.NODE_ENV;
const dbConnection = (env) => {
    const db = (0, knex_1.default)(knexfile_1.default[env || environment]);
    return db;
};
exports.dbConnection = dbConnection;
