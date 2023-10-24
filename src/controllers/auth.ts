import { validationResult } from "express-validator";
import nodemailer from "nodemailer";
import {createUser, findUser} from "../dao/user";
import bcrypt from "bcryptjs";

var transport = nodemailer.createTransport({
  host: "sandbox.smtp.mailtrap.io",
  port: 2525,
  auth: {
    user: "635594c3e99ed9",
    pass: "0d447fba3f0528",
  },
});

export const getLogin = (req: any, res: any, next: any) => {
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

export const getSignup = (req: any, res: any, next: any) => {
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

export const postSignup = async (req: any, res: any, next: any) => {
  const email = req.body.email;
  const password = req.body.password;
  const fullName = req.body.fullName;
  const balance = req.body.balance;
  const errors = validationResult(req);

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
    const hashedPassword = await bcrypt.hash(password, 12);
    await createUser({
      email: email,
      password: hashedPassword,
      fullName: fullName,
      wallet: +balance
    });

    await transport.sendMail({
      from: "sender@yourdomain.com",
      to: email,
      subject: "Signup Succeeded!",
      html: "<h1>You have successfully signed up</h1>",
    });

  } catch (err) {
    return next(err);
  } finally{
    res.status(302).redirect("/login");

  }
};

export const postLogin = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
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
    const user = await findUser({ email: req.body.email });

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

    const doMatch = await bcrypt.compare(req.body.password, user.password);

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
  } catch (err) {
    return next(err);
  }
};

export const postLogout = (req: any, res: any, next: any) => {
  req.session.destroy((err: any) => {
    if (err) return next(err);
    res.status(302).redirect("/login");
  });
};
