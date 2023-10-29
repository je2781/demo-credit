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
exports.manageFund = exports.findUser = exports.updateUser = exports.deleteUser = exports.createUser = void 0;
const db_1 = require("../db/db");
const uuid_1 = require("uuid");
const createUser = (data, testObj) => __awaiter(void 0, void 0, void 0, function* () {
    if (testObj && testObj.env === "testing") {
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
exports.createUser = createUser;
const deleteUser = (email, env) => __awaiter(void 0, void 0, void 0, function* () {
    if (env) {
        yield (0, db_1.dbConnection)(env)("users").where("email", email).del();
    }
    else {
        yield (0, db_1.dbConnection)()("users").where("email", email).del();
    }
});
exports.deleteUser = deleteUser;
const updateUser = (input, env) => __awaiter(void 0, void 0, void 0, function* () {
    if (env) {
        yield (0, db_1.dbConnection)(env)("users").where("email", input.email).update({
            cloudinary_public_id: input.publicId,
        });
    }
    else {
        yield (0, db_1.dbConnection)()("users").where("email", input.email).update({
            cloudinary_public_id: input.publicId,
        });
    }
});
exports.updateUser = updateUser;
const findUser = (input, env) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    if (env) {
        user = yield (0, db_1.dbConnection)(env)("users").where("email", input.email).first();
    }
    else {
        user = yield (0, db_1.dbConnection)()("users").where("email", input.email).first();
    }
    return user;
});
exports.findUser = findUser;
const manageFund = (input, env) => __awaiter(void 0, void 0, void 0, function* () {
    let extractedUser;
    switch (input.mode) {
        case "transfer":
            if (input.foreignUserEmail && env) {
                extractedUser = yield (0, db_1.dbConnection)(env)("users")
                    .where("email", input.foreignUserEmail)
                    .first();
                if (!extractedUser) {
                    throw new Error("your receipient account doesn't exist");
                }
                yield (0, db_1.dbConnection)(env)("users")
                    .where("email", input.foreignUserEmail)
                    .update({
                    wallet: extractedUser.wallet + input.fund,
                });
                return yield (0, db_1.dbConnection)(env)("transfers").insert({
                    id: (0, uuid_1.v4)(),
                    amount: input.fund,
                    foreign_user_id: extractedUser.id,
                });
            }
            if (input.foreignUserEmail) {
                extractedUser = yield (0, db_1.dbConnection)()("users")
                    .where("email", input.foreignUserEmail)
                    .first();
                if (!extractedUser) {
                    throw new Error("your receipient account doesn't exist");
                }
                yield (0, db_1.dbConnection)()("users")
                    .where("email", input.foreignUserEmail)
                    .update({
                    wallet: extractedUser.wallet + input.fund,
                });
                return yield (0, db_1.dbConnection)()("transfers").insert({
                    id: (0, uuid_1.v4)(),
                    amount: input.fund,
                    foreign_user_id: extractedUser.id,
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
                    throw new Error("You cannot put your account in the negative");
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
                    throw new Error("You cannot put your account in the negative");
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
exports.manageFund = manageFund;
