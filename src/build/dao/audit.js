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
const db_1 = require("../db/db");
const uuid_1 = require("uuid");
class AuditDAO {
    constructor() {
        this.debit = (data, env) => __awaiter(this, void 0, void 0, function* () {
            if (env) {
                yield (0, db_1.dbConnection)(env)("audit").insert({
                    id: (0, uuid_1.v4)(),
                    debit: data.amount,
                    credit: 0,
                    user_id: data.userId,
                });
            }
            else {
                yield (0, db_1.dbConnection)()("audit").insert({
                    id: (0, uuid_1.v4)(),
                    debit: data.amount,
                    credit: 0,
                    user_id: data.userId,
                });
            }
        });
        this.credit = (data, env) => __awaiter(this, void 0, void 0, function* () {
            if (env) {
                yield (0, db_1.dbConnection)(env)("audit").insert({
                    id: (0, uuid_1.v4)(),
                    credit: data.amount,
                    debit: 0,
                    user_id: data.userId,
                });
            }
            else {
                yield (0, db_1.dbConnection)()("audit").insert({
                    id: (0, uuid_1.v4)(),
                    credit: data.amount,
                    debit: 0,
                    user_id: data.userId,
                });
            }
        });
        this.deleteAudit = (userId, env) => __awaiter(this, void 0, void 0, function* () {
            if (env) {
                yield (0, db_1.dbConnection)(env)("audit").where("user_id", userId).del();
            }
            else {
                yield (0, db_1.dbConnection)()("audit").where("user_id", userId).del();
            }
        });
    }
}
exports.default = new AuditDAO();
