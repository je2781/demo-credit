"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const auth_1 = require("../controllers/auth");
const express_validator_1 = require("express-validator");
const router = express_1.default.Router();
router.post('/login', (0, express_validator_1.body)('email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail(), (0, express_validator_1.body)('password', 'Password is invalid').trim().isLength({ min: 5 }), auth_1.postLogin);
router.post('/logout', auth_1.postLogout);
router.get('/login', auth_1.getLogin);
router.get('/signup', auth_1.getSignup);
router.post('/signup', (0, express_validator_1.check)('email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail(), (0, express_validator_1.body)('fullName', 'Provide a name for your account').isString().trim(), (0, express_validator_1.body)('balance', 'Set your starting balance').notEmpty().trim(), (0, express_validator_1.body)('password', 'Password must contain at least 5 characters').trim().isLength({ min: 5 }), (0, express_validator_1.body)('c_password').trim().custom((value, { req }) => {
    if (value !== req.body.password) {
        throw new Error('Passwords do not match');
    }
    return true;
}), auth_1.postSignup);
exports.default = router;
