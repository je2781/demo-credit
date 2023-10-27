"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const api_1 = __importDefault(require("../api"));
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: '../../.env' });
api_1.default.listen(+process.env.PORT || 3000);
