import express from "express";
import {withdraw, deposit, transfer, getHomePage, getWallet} from "../controllers/wallet";
import { body } from "express-validator";
import { isAuth } from "../util/route_protection";


const router = express.Router();

// POST /wallet/transfer
router.post(
  "/transfer",
  isAuth,
  body('r_email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail(),
  body('r_name', "Enter your recipients's name").trim().isLength({min: 3}),
  body('fund').trim().custom((value, {req}) => {
    if(parseInt(value) < 50){
        throw new Error("Enter a value greater than 50");
    }

    return true;
}),
  transfer
);

// POST /wallet/widthdraw
router.post(
  "/withdraw",
  isAuth,
  body('fund').trim().custom((value, {req}) => {
    if(parseInt(value) < 50){
        throw new Error("Enter a value greater than 50");
    }

    return true;
}),
  withdraw
);

// POST /wallet/add
router.post(
  "/deposit",
  isAuth,
  body('fund').trim().custom((value, {req}) => {
    if(parseInt(value) < 50){
        throw new Error("Enter a value greater than 50");
    }

    return true;
}),
  deposit
);

// GEt /
router.get("/", isAuth, getHomePage);

// GEt /
router.get('/manage-wallet', isAuth, getWallet);

export default router;