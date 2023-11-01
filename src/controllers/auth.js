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
const wallet_service_1 = __importDefault(require("../service/wallet-service"));
const bcryptjs_1 = __importDefault(require("bcryptjs"));
const cloudinary_1 = require("cloudinary");
const dotenv_1 = require("dotenv");
(0, dotenv_1.config)({ path: "../../.env" });
const getLogin = (req, res, next) => {
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
    let image;
    const email = req.body.email;
    const password = req.body.password;
    const balance = req.body.balance;
    image = req.body.image;
    const fullName = req.body.full_name;
    if (req.file) {
        image = req.file;
    }
    if (!image) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Signup",
            mode: "signup",
            errorMsg: "profile picture not provided",
            path: "/signup",
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.c_password,
                fullName: fullName,
                balance: balance,
            },
            validationErrors: [],
        });
    }
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
                balance: balance,
            },
            validationErrors: errors.array(),
        });
    }
    try {
        //checking for duplicate user accounts
        const user = yield wallet_service_1.default.findUser({
            email: email,
        }, req.env);
        if (user) {
            throw new Error("Email is already in use");
        }
        const imageUrl = image.path.replaceAll("\\", "/");
        const hashedPassword = yield bcryptjs_1.default.hash(password, 12);
        yield wallet_service_1.default.createUser({
            email: email,
            password: hashedPassword,
            fullName: fullName,
            wallet: +balance,
            imageUrl: imageUrl,
        }, {
            env: req.env,
            id: req.id,
        });
        if (process.env.NODE_ENV === "production") {
            // retrieving image from cloud storage
            const apiResponse = yield cloudinary_1.v2.search
                .expression("resource_type:image").sort_by("created_at", "asc")
                .execute();
            const resourcesLength = apiResponse["resources"].length;
            yield wallet_service_1.default.updateUser({
                email: email,
                assetId: apiResponse["resources"][resourcesLength - 1]['asset_id']
            });
            res.status(302).redirect("/login");
        }
        else {
            res.status(302).redirect("/login");
        }
    }
    catch (err) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Signup",
            mode: "signup",
            errorMsg: err.message,
            path: "/signup",
            oldInput: {
                email: email,
                password: password,
                confirmPassword: req.body.c_password,
                fullName: fullName,
                balance: balance,
            },
            validationErrors: [],
        });
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
        const user = yield wallet_service_1.default.findUser({ email: req.body.email }, req.env);
        if (!user) {
            throw new Error("User account doesn't exist. Create an account");
        }
        const doMatch = yield bcryptjs_1.default.compare(req.body.password, user.password);
        if (doMatch) {
            req.session.isLoggedIn = true;
            req.session.user = user;
            req.session.save(() => res.status(302).redirect("/"));
        }
        else {
            throw new Error("invalid E-mail or password");
        }
    }
    catch (err) {
        return res.status(422).render("auth/auth_form.ejs", {
            docTitle: "Login",
            mode: "login",
            errorMsg: err.message,
            path: "/login",
            oldInput: {
                email: req.body.email,
                password: req.body.password,
            },
            validationErrors: [],
        });
    }
});
exports.postLogin = postLogin;
const postLogout = (req, res, next) => __awaiter(void 0, void 0, void 0, function* () {
    return req.session.destroy((err) => {
        if (err)
            return next(err);
        return res.status(302).redirect("/login");
    });
});
exports.postLogout = postLogout;
