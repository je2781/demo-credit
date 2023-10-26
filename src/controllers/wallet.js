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
exports.deposit = exports.transfer = exports.withdraw = exports.getWallet = exports.getHomePage = void 0;
const user_1 = require("../dao/user");
require("dotenv").config();
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
        user = yield (0, user_1.findUser)({
            email: req.session.user["email"],
        });
    }
    catch (err) {
        return next(err);
    }
    req.session.user = user;
    req.session.save(() => {
        res.status(200).render("home", {
            docTitle: "Profile",
            path: "/",
            Msg: msg,
            userName: req.session.user["full_name"],
            url: req.session.user["image_url"],
            email: req.session.user["email"],
            balance: req.session.user["wallet"],
        });
    });
});
exports.getHomePage = getHomePage;
const getWallet = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const mode = req.query.mode;
    const updatedMode = `${mode[0].toUpperCase()}${mode.slice(1, mode.length)}`;
    res.status(200).render("wallet", {
        docTitle: updatedMode,
        path: "/manage-wallet",
        balance: req.session.user["wallet"],
        mode: updatedMode,
        action: mode,
    });
});
exports.getWallet = getWallet;
// Create a route for withdrawing funds
const withdraw = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, user_1.manageFund)({
            user: req.session.user,
            fund: +req.body.fund,
            mode: "withdraw",
        }, req.env);
        return res.status(302).redirect("/");
    }
    catch (err) {
        next(err);
        return err;
    }
});
exports.withdraw = withdraw;
// Create a route for transfering funds
const transfer = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, user_1.manageFund)({
            user: req.session.user,
            fund: +req.body.fund,
            mode: "withdraw",
        }, req.env);
        yield (0, user_1.manageFund)({
            foreignUserEmail: req.body.r_email,
            fund: +req.body.fund,
            mode: "transfer",
        }, req.env);
        //setting up flash message for home page
        req.flash("transfer", `transfer to ${req.body.r_name} was successful`);
        return res.status(302).redirect("/");
    }
    catch (err) {
        next(err);
        return err;
    }
});
exports.transfer = transfer;
// Create a route for adding funds
const deposit = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (0, user_1.manageFund)({
            user: req.session.user,
            fund: +req.body.fund,
            mode: "deposit",
        }, req.env);
        return res.status(302).redirect("/");
    }
    catch (err) {
        next(err);
        return err;
    }
});
exports.deposit = deposit;
