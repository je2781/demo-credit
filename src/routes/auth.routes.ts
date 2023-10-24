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
check('email').isEmail().withMessage('Please enter a valid E-mail!').normalizeEmail().custom((value, {req}) => {
    return findUser({ email: value }).then((user) => {
        if (user) {
            return Promise.reject('The E-mail is already in use');
        }
    });
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
