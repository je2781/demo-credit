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
Object.defineProperty(exports, "__esModule", { value: true });
exports.findUser = exports.createUser = void 0;
const server_1 = require("../db/server");
const uuid_1 = require("uuid");
const createUser = (data) => __awaiter(void 0, void 0, void 0, function* () {
    const [id] = yield (0, server_1.dbConnection)()('users').insert({
        id: (0, uuid_1.v4)(),
        email: data.email,
        password: data.password,
        full_name: data.fullName,
        wallet: data.wallet
    }).returning('id');
    return id;
});
exports.createUser = createUser;
const findUser = (input) => __awaiter(void 0, void 0, void 0, function* () {
    const user = yield (0, server_1.dbConnection)()('users').where('email', input.email).first();
    return user;
});
exports.findUser = findUser;
