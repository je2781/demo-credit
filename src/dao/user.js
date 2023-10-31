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
const db_1 = require("../db/db");
const uuid_1 = require("uuid");
const transfer_1 = __importDefault(require("./transfer"));
class UserDAO {
    constructor() {
        this.createUser = (data, testObj) => __awaiter(this, void 0, void 0, function* () {
            if (testObj && testObj.env) {
                yield (0, db_1.dbConnection)(testObj.env)("users").insert({
                    id: testObj.id,
                    email: data.email,
                    password: data.password,
                    full_name: data.fullName,
                    wallet: data.wallet,
                    image_url: data.imageUrl,
                });
            }
            else {
                yield (0, db_1.dbConnection)()("users").insert({
                    id: (0, uuid_1.v4)(),
                    email: data.email,
                    password: data.password,
                    full_name: data.fullName,
                    wallet: data.wallet,
                    image_url: data.imageUrl,
                });
            }
        });
        this.deleteUser = (email, env) => __awaiter(this, void 0, void 0, function* () {
            if (env) {
                yield (0, db_1.dbConnection)(env)("users").where("email", email).del();
            }
            else {
                yield (0, db_1.dbConnection)()("users").where("email", email).del();
            }
        });
        this.updateUser = (input) => __awaiter(this, void 0, void 0, function* () {
            yield (0, db_1.dbConnection)()("users").where("email", input.email).update({
                cloudinary_asset_id: input.assetId,
            });
        });
        this.findUser = (input, env) => __awaiter(this, void 0, void 0, function* () {
            let user;
            if (env) {
                user = yield (0, db_1.dbConnection)(env)("users")
                    .where("email", input.email)
                    .first();
            }
            else {
                user = yield (0, db_1.dbConnection)()("users").where("email", input.email).first();
            }
            return user;
        });
        this.manageFund = (input, env) => __awaiter(this, void 0, void 0, function* () {
            let extractedUser;
            let extractedTransfer;
            switch (input.mode) {
                case "transfer":
                    if (input.foreignUser && env && input.user) {
                        extractedUser = yield (0, db_1.dbConnection)(env)("users")
                            .where("email", input.foreignUser.email)
                            .first();
                        if (!extractedUser) {
                            throw new Error("your receipient account doesn't exist");
                        }
                        yield (0, db_1.dbConnection)(env)("users")
                            .where("email", input.foreignUser.email)
                            .update({
                            wallet: extractedUser.wallet + input.fund,
                        });
                        //updating transfers table
                        const extractedTransfer = yield transfer_1.default.findTransfer({
                            foreignId: extractedUser.id,
                        }, env);
                        if (!extractedTransfer) {
                            return yield transfer_1.default.createTransfer({
                                amount: input.fund,
                                foreignUserId: extractedUser.id,
                                userId: input.user.id,
                            }, env);
                        }
                        return yield transfer_1.default.updateTransfer({
                            transfer: extractedTransfer,
                            fund: input.fund,
                            foreignId: extractedUser.id,
                        }, env);
                    }
                    if (input.foreignUser && input.user) {
                        extractedUser = yield (0, db_1.dbConnection)()("users")
                            .where("email", input.foreignUser.email)
                            .first();
                        if (!extractedUser) {
                            throw new Error("your receipient account doesn't exist");
                        }
                        yield (0, db_1.dbConnection)()("users")
                            .where("email", input.foreignUser.email)
                            .update({
                            wallet: extractedUser.wallet + input.fund,
                        });
                        //updating transfers table
                        const extractedTransfer = yield transfer_1.default.findTransfer({
                            foreignId: extractedUser.id,
                        }, env);
                        if (!extractedTransfer) {
                            return yield transfer_1.default.createTransfer({
                                amount: input.fund,
                                foreignUserId: extractedUser.id,
                                userId: input.user.id,
                            });
                        }
                        return yield transfer_1.default.updateTransfer({
                            transfer: extractedTransfer,
                            fund: input.fund,
                            foreignId: extractedUser.id,
                        });
                    }
                    // Handle the case when input.foreignUserEmail is not provided.
                    throw new Error("Missing foreignUserEmail");
                case "withdraw":
                    let withdrawOpResult;
                    if (input.user && input.user.id && env) {
                        extractedUser = yield (0, db_1.dbConnection)(env)("users")
                            .where("id", input.user.id)
                            .first();
                        withdrawOpResult = extractedUser.wallet - input.fund;
                        if (withdrawOpResult < 0) {
                            throw new Error(`You cannot put your account in the red. choose a lower amount`);
                        }
                        return yield (0, db_1.dbConnection)(env)("users")
                            .where("id", input.user.id)
                            .update({
                            wallet: withdrawOpResult,
                        });
                    }
                    if (input.user && input.user.id) {
                        extractedUser = yield (0, db_1.dbConnection)()("users")
                            .where("id", input.user.id)
                            .first();
                        withdrawOpResult = extractedUser.wallet - input.fund;
                        if (withdrawOpResult < 0) {
                            throw new Error(`You cannot put your account in the red. choose a lower amount`);
                        }
                        return yield (0, db_1.dbConnection)()("users")
                            .where("id", input.user.id)
                            .update({
                            wallet: extractedUser.wallet - input.fund,
                        });
                    }
                    // Handle the case when input.user or input.user.id is not provided.
                    throw new Error("Missing user or user.id");
                default:
                    if (input.user && input.user.id && env) {
                        extractedUser = yield (0, db_1.dbConnection)(env)("users")
                            .where("id", input.user.id)
                            .first();
                        return yield (0, db_1.dbConnection)(env)("users")
                            .where("id", input.user.id)
                            .update({
                            wallet: extractedUser.wallet + input.fund,
                        });
                    }
                    if (input.user && input.user.id) {
                        extractedUser = yield (0, db_1.dbConnection)()("users")
                            .where("id", input.user.id)
                            .first();
                        return yield (0, db_1.dbConnection)()("users")
                            .where("id", input.user.id)
                            .update({
                            wallet: extractedUser.wallet + input.fund,
                        });
                    }
                    // Handle the case when input.user or input.user.id is not provided.
                    throw new Error("Missing user or user.id");
            }
        });
    }
}
exports.default = new UserDAO();
