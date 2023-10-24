"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.dbConnection = void 0;
require("dotenv").config();
const knexFile = require('./knexfile');
const knex_1 = __importDefault(require("knex"));
const api_1 = __importDefault(require("../functions/api"));
const environment = process.env.NODE_ENV || "development";
const dbConnection = (env, port) => {
    const db = (0, knex_1.default)(knexFile[env || environment]);
    api_1.default.listen(port || 8000);
    return db;
};
exports.dbConnection = dbConnection;
