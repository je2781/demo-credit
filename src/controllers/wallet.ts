import { manageFund, findUser } from "../dao/user";
import { User } from "../types";
import { config } from "dotenv";
import admin from 'firebase-admin';


config({ path: "../../.env" });

export const getHomePage = async (req: any, res: any, next: any) => {
  let user: User;

  //defining flash message variable
  let msg: any;
  msg = req.flash("transfer");
  if (msg.length > 0) {
    msg = msg[0];
  } else {
    msg = null;
  }

  try {
    user = await findUser({
      email: req.session.user["email"],
    });

    const options: any = {
      version: 'v2',
      action: 'read',
      expires: Date.now() + 1000 * 60 * 60
    };
    //getting bucket
    const bucket = admin.storage().bucket();

    const [url] = await bucket.file(user.image_name).getSignedUrl(options);

    req.session.user = user;
    req.session.save(() => {
      res.status(200).render("home", {
        docTitle: "Profile",
        path: "/",
        Msg: msg,
        env: process.env.NODE_ENV,
        userName: req.session.user["full_name"],
        url: process.env.NODE_ENV === 'production' ? url : req.session.user["image_url"],
        email: req.session.user["email"],
        balance: req.session.user["wallet"],
      });
    });
  } catch (err) {
    next(err);
    return err;
  }
};

export const getWallet = async (req: any, res: any, next: any) => {
  const mode = req.query.mode;
  const updatedMode = `${mode[0].toUpperCase()}${mode.slice(1, mode.length)}`;

  res.status(200).render("wallet", {
    docTitle: updatedMode,
    path: "/manage-wallet",
    balance: req.session.user["wallet"],
    mode: updatedMode,
    errorMsg: null,
    action: mode,
  });
};
// Create a route for withdrawing funds
export const withdraw = async (req: any, res: any, next: any) => {
  try {
    await manageFund(
      {
        user: req.session.user,
        fund: +req.body.fund,
        mode: "withdraw",
      },
      req.env
    );

    res.status(302).redirect("/");
  } catch (err: any) {
    return  res.status(200).render("wallet", {
      docTitle: 'Withdraw',
      path: "/manage-wallet",
      balance: req.session.user["wallet"],
      mode: 'Withdraw',
      errorMsg: err.message,
      action: 'withdraw',
    });
  }
};

// Create a route for transfering funds
export const transfer = async (req: any, res: any, next: any) => {
  try {
    await manageFund(
      {
        user: req.session.user,
        fund: +req.body.fund,
        mode: "withdraw",
      },
      req.env
    );
    await manageFund(
      {
        foreignUserEmail: req.body.r_email,
        fund: +req.body.fund,
        mode: "transfer",
      },
      req.env
    );
    //setting up flash message for home page
    req.flash("transfer", `transfer to ${req.body.r_name} was successful`);
    res.status(302).redirect("/");
  } catch (err) {
    next(err);
    return err;
  }
};

// Create a route for adding funds
export const deposit = async (req: any, res: any, next: any) => {
  try {
    await manageFund(
      {
        user: req.session.user,
        fund: +req.body.fund,
        mode: "deposit",
      },
      req.env
    );

    res.status(302).redirect("/");
  } catch (err) {
    next(err);
    return err;
  }
};
