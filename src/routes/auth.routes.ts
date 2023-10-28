import express from 'express';
import { postLogin, postLogout, postSignup, getLogin, getSignup}from '../controllers/auth';
import { check, body } from 'express-validator';
import { findUser } from '../dao/user';

const router = express.Router();

router.post('/login', body('email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail(),
body('password', 'Password is invalid').trim().isLength({min: 5})
,
postLogin);

router.post('/logout', postLogout);

router.get('/login', getLogin);

router.get('/signup', getSignup);

router.post('/signup', 
check('email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail(), 
body('fullName', 'Provide a name for your account').isString().trim(), 
body('balance').trim().custom((value, {req}) => {
    if(value < '50'){
        throw new Error('You cannot start your account with less than 50');
    }

    return true;
}), 
body('password', 'Password must contain at least 5 characters').trim().isLength({min: 5}), 
body('c_password').trim().custom((value, {req}) => {
    if(value !== req.body.password){
        throw new Error('Passwords do not match');
    }

    return true;
}),
 postSignup);

export default router;
