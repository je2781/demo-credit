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
exports.postLogout = exports.postLogin = exports.postSignup = exports.getSignup = exports.getLogin = void 0;
const express_validator_1 = require("express-validator");
const nodemailer_1 = __importDefault(require("nodemailer"));
const user_1 = require("../dao/user");
const bcryptjs_1 = __importDefault(require("bcryptjs"));
var transport = nodemailer_1.default.createTransport({
    host: "sandbox.smtp.mailtrap.io",
    port: 2525,
    auth: {
        user: "635594c3e99ed9",
        pass: "0d447fba3f0528",
    },
});
const getLogin = (req, res, next) => {
    // const isLoggedIn = req.get('Cookie').split(':')[1].trim().split('=')[1] === 'true';
    res.status(200).render("auth/auth_form.ejs", {
        docTitle: "Login",
        mode: "login",
        errorMsg: null,
        path: "/login",
        oldInput: {
            email: "",
            password: "",
        },
        validationErrors: [],
    });
};
exports.getLogin = getLogin;
const getSignup = (req, res, next) => {
    res.status(200).render("auth/auth_form.ejs", {
        docTitle: "Signup",
        mode: "signup",
        errorMsg: null,
        path: "/signup",
        oldInput: {
            email: "",
            password: "",
            fullName: "",
            confirmPassword: "",
        },
        validationErrors: [],
    });
};
exports.getSignup = getSignup;
const postSignup = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const email = req.body.email;
    const password = req.body.password;
    const fullName = req.body.fullName;
    const balance = req.body.balance;
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Signup",
            mode: "signup",
            errorMsg: errors.array()[0].msg,
            path: "/signup",
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.c_password,
                fullName: fullName,
            },
            validationErrors: errors.array(),
        });
    }
    try {
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        yield (0, user_1.createUser)({
            email: email,
            password: hashedPassword,
            fullName: fullName,
            wallet: +balance
        });
        yield transport.sendMail({
            from: "sender@yourdomain.com",
            to: email,
            subject: "Signup Succeeded!",
            html: "<h1>You have successfully signed up</h1>",
        });
    }
    catch (err) {
        return next(err);
    }
    finally {
        res.status(302).redirect("/login");
    }
});
exports.postSignup = postSignup;
const postLogin = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    const errors = (0, express_validator_1.validationResult)(req);
    if (!errors.isEmpty()) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Login",
            mode: "login",
            errorMsg: errors.array()[0].msg,
            path: "/login",
            oldInput: {
                email: req.body.email,
                password: req.body.password,
            },
            validationErrors: errors.array(),
        });
    }
    try {
        const user = yield (0, user_1.findUser)({ email: req.body.email });
        if (!user) {
            return res.status(422).render("auth/auth_form.ejs", {
                docTitle: "Login",
                mode: "login",
                errorMsg: "User account doesn't exist. Create an account",
                path: "/login",
                oldInput: {
                    email: req.body.email,
                    password: req.body.password,
                },
                validationErrors: [],
            });
        }
        const doMatch = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            return req.session.save(() => {
                res.status(302).redirect("/");
            });
        }
        res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Login",
            mode: "login",
            errorMsg: "invalid E-mail or password",
            path: "/login",
            oldInput: {
                email: req.body.email,
                password: req.body.password,
            },
            validationErrors: [],
        });
    }
    catch (err) {
        return next(err);
    }
});
exports.postLogin = postLogin;
const postLogout = (req, res, next) => {
    req.session.destroy((err) => {
        if (err)
            return next(err);
        res.status(302).redirect("/login");
    });
};
exports.postLogout = postLogout;
