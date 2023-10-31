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
const user_1 = __importDefault(require("../dao/user"));
const transfer_1 = __importDefault(require("../dao/transfer"));
class LendingService {
    createUser(data, testObj) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.default.createUser(data, testObj);
        });
    }
    deleteUser(email, env) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.default.deleteUser(email, env);
        });
    }
    updateUser(input) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.default.updateUser(input);
        });
    }
    findUser(input, env) {
        return __awaiter(this, void 0, void 0, function* () {
            const user = yield user_1.default.findUser(input, env);
            return user;
        });
    }
    manageFund(input, env) {
        return __awaiter(this, void 0, void 0, function* () {
            yield user_1.default.manageFund(input, env);
        });
    }
    deleteTransfer(userId, env) {
        return __awaiter(this, void 0, void 0, function* () {
            yield transfer_1.default.deleteTransfer(userId, env);
        });
    }
    updateTransfer(input, env) {
        return __awaiter(this, void 0, void 0, function* () {
            yield transfer_1.default.updateTransfer(input, env);
        });
    }
    findTransfer(input, env) {
        return __awaiter(this, void 0, void 0, function* () {
            const transfer = yield transfer_1.default.findTransfer(input, env);
            return transfer;
        });
    }
    createTransfer(data, env) {
        return __awaiter(this, void 0, void 0, function* () {
            yield transfer_1.default.createTransfer(data, env);
        });
    }
}
exports.default = new LendingService();
