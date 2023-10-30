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
exports.createTransfer = exports.findTransfer = exports.updateTransfer = exports.deleteTransfer = void 0;
const db_1 = require("../db/db");
const uuid_1 = require("uuid");
const deleteTransfer = (userId, env) => __awaiter(void 0, void 0, void 0, function* () {
    if (env) {
        yield (0, db_1.dbConnection)(env)("transfers").where("user_id", userId).del();
    }
    else {
        yield (0, db_1.dbConnection)()("transfers").where("user_id", userId).del();
    }
});
exports.deleteTransfer = deleteTransfer;
const updateTransfer = (input, env) => __awaiter(void 0, void 0, void 0, function* () {
    if (env) {
        yield (0, db_1.dbConnection)(env)("transfers")
            .where("foreign_user_id", input.foreignId)
            .update({
            amount: input.transfer.amount + input.fund,
        });
    }
    else {
        yield (0, db_1.dbConnection)(env)("transfers")
            .where("foreign_user_id", input.foreignId)
            .update({
            amount: input.transfer.amount + input.fund,
        });
    }
});
exports.updateTransfer = updateTransfer;
const findTransfer = (input, env) => __awaiter(void 0, void 0, void 0, function* () {
    let transfer;
    if (env) {
        transfer = yield (0, db_1.dbConnection)(env)("transfers")
            .where("foreign_user_id", input.foreignId)
            .first();
    }
    else {
        transfer = yield (0, db_1.dbConnection)()("transfers")
            .where("foreign_user_id", input.foreignId)
            .first();
    }
    return transfer;
});
exports.findTransfer = findTransfer;
const createTransfer = (data, env) => __awaiter(void 0, void 0, void 0, function* () {
    if (env) {
        yield (0, db_1.dbConnection)(env)("transfers").insert({
            id: (0, uuid_1.v4)(),
            amount: data.amount,
            foreign_user_id: data.foreignUserId,
            user_id: data.userId,
        });
    }
    else {
        yield (0, db_1.dbConnection)()("transfers").insert({
            id: (0, uuid_1.v4)(),
            amount: data.amount,
            foreign_user_id: data.foreignUserId,
            user_id: data.userId,
        });
    }
});
exports.createTransfer = createTransfer;
