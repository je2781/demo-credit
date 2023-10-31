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
exports.deposit = exports.transfer = exports.withdraw = exports.getWallet = exports.getHomePage = void 0;
const lending_service_1 = __importDefault(require("../service/lending-service"));
const dotenv_1 = require("dotenv");
const cloudinary_1 = require("cloudinary");
const express_validator_1 = require("express-validator");
(0, dotenv_1.config)({ path: "../../.env" });
const getHomePage = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    let user;
    //defining flash message variable
    let msg;
    msg = req.flash("transfer");
    if (msg.length > 0) {
        msg = msg[0];
    }
    else {
        msg = null;
    }
    try {
        user = yield lending_service_1.default.findUser({
            email: req.session.user["email"],
        }, req.env);
        if (process.env.NODE_ENV === "production") {
            // retrieving image from cloud storage
            const apiResponse = yield cloudinary_1.v2.search
                .expression("resource_type:image")
                .sort_by("created_at", "asc")
                .execute();
            const currentUserRecource = apiResponse["resources"].find((resource) => resource["asset_id"] === user.cloudinary_asset_id);
            //
            return res.status(200).render("home", {
                docTitle: "Profile",
                path: "/",
                Msg: msg,
                env: process.env.NODE_ENV,
                userName: req.session.user["full_name"],
                url: currentUserRecource["url"],
                email: req.session.user["email"],
                balance: req.session.user["wallet"],
            });
        }
        res.status(200).render("home", {
            docTitle: "Profile",
            path: "/",
            Msg: msg,
            env: process.env.NODE_ENV,
            userName: req.session.user["full_name"],
            url: req.session.user["image_url"],
            email: req.session.user["email"],
            balance: req.session.user["wallet"],
        });
    }
    catch (err) {
        next(err);
    }
});
exports.getHomePage = getHomePage;
const getWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mode = req.query.mode;
    const updatedMode = `${mode[0].toUpperCase()}${mode.slice(1, mode.length)}`;
    res.status(200).render("wallet", {
        docTitle: updatedMode,
        path: "/manage-wallet",
        oldInput: {
            recName: "",
            recEmail: "",
        },
        mode: updatedMode,
        errorMsg: null,
        action: mode,
        validationErrors: []
    });
});
exports.getWallet = getWallet;
// Create a route for withdrawing funds
const withdraw = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("wallet", {
            docTitle: "Withdraw",
            mode: "Withdraw",
            errorMsg: errors.array()[0].msg,
            path: "/manage-wallet",
            action: "withdraw",
        });
    }
    try {
        yield lending_service_1.default.manageFund({
            user: req.session.user,
            fund: +req.body.fund,
            mode: "withdraw",
        }, req.env);
        res.status(302).redirect("/");
    }
    catch (err) {
        return res.status(500).render("wallet", {
            docTitle: "Withdraw",
            path: "/manage-wallet",
            mode: "Withdraw",
            errorMsg: err.message,
            action: "withdraw",
        });
    }
});
exports.withdraw = withdraw;
// Create a route for transfering funds
const transfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("wallet", {
            docTitle: "Transfer",
            mode: "Transfer",
            errorMsg: errors.array()[0].msg,
            path: "/manage-wallet",
            oldInput: {
                recName: req.body.r_name,
                recEmail: req.body.r_email,
            },
            action: "transfer",
            validationErrors: errors.array(),
        });
    }
    try {
        //checking for wrong transfer details
        if (req.body.r_email === req.session.user["email"] ||
            req.body.r_name === req.session.user["full_name"]) {
            throw new Error("your receipient account doesn't have that name or email");
        }
        yield lending_service_1.default.manageFund({
            user: req.session.user,
            fund: +req.body.fund,
            mode: "withdraw",
        }, req.env);
        yield lending_service_1.default.manageFund({
            foreignUser: {
                name: req.body.r_name,
                email: req.body.r_email,
            },
            user: req.session.user,
            fund: +req.body.fund,
            mode: "transfer",
        }, req.env);
        //setting up flash message for home page
        req.flash("transfer", `transfer to ${req.body.r_name} was successful`);
        res.status(302).redirect("/");
    }
    catch (err) {
        return res.status(422).render("wallet", {
            docTitle: "Transfer",
            path: "/manage-wallet",
            oldInput: {
                recName: req.body.r_name,
                recEmail: req.body.r_email,
            },
            mode: "Transfer",
            errorMsg: err.message,
            action: "transfer",
            validationErrors: []
        });
    }
});
exports.transfer = transfer;
// Create a route for adding funds
const deposit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("wallet", {
            docTitle: "Deposit",
            mode: "Deposit",
            errorMsg: errors.array()[0].msg,
            path: "/manage-wallet",
            action: "deposit"
        });
    }
    try {
        yield lending_service_1.default.manageFund({
            user: req.session.user,
            fund: +req.body.fund,
            mode: "deposit",
        }, req.env);
        res.status(302).redirect("/");
    }
    catch (err) {
        next(err);
    }
});
exports.deposit = deposit;
