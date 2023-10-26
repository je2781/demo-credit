"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const wallet_1 = require("../controllers/wallet");
const express_validator_1 = require("express-validator");
const route_protection_1 = require("../util/route_protection");
const router = express_1.default.Router();
// POST /wallet/transfer
router.post("/transfer", route_protection_1.isAuth, (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail(), (0, express_validator_1.body)('fullName', "Enter your recipients's name").isEmpty(), (0, express_validator_1.body)('fund').custom((value, { req }) => {
    if (parseInt(value) < 50) {
        throw new Error("Enter a value greater than 50");
    }
    return true;
}), wallet_1.transfer);
// POST /wallet/widthdraw
router.post("/withdraw", route_protection_1.isAuth, (0, express_validator_1.body)('fund').custom((value, { req }) => {
    if (parseInt(value) < 50) {
        throw new Error("Enter a value greater than 50");
    }
    return true;
}), wallet_1.withdraw);
// POST /wallet/add
router.post("/deposit", route_protection_1.isAuth, (0, express_validator_1.body)('fund').custom((value, { req }) => {
    if (parseInt(value) < 50) {
        throw new Error("Enter a value greater than 50");
    }
    return true;
}), wallet_1.deposit);
// GEt /
router.get("/", route_protection_1.isAuth, wallet_1.getHomePage);
// GEt /
router.get('/manage-wallet', route_protection_1.isAuth, wallet_1.getWallet);
exports.default = router;
