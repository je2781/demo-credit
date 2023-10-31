import lendingService from "../service/lending-service";
import { User } from "../types";
import { config } from "dotenv";
import { v2 as cloudinary } from "cloudinary";
import { validationResult } from "express-validator";
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
    user = await lendingService.findUser(
      {
        email: req.session.user["email"],
      },
      req.env
    );

    if (process.env.NODE_ENV === "production") {
      // retrieving image from cloud storage
      const apiResponse = await cloudinary.search
        .expression("resource_type:image")
        .sort_by("created_at", "asc")
        .execute();

      const currentUserRecource = apiResponse["resources"].find(
        (resource: any) => resource["asset_id"] === user.cloudinary_asset_id
      );
      //
      return res.status(200).render("home", {
        docTitle: "Profile",
        path: "/",
        Msg: msg,
        env: process.env.NODE_ENV,
        userName: req.session.user["full_name"],
        url: currentUserRecource["url"],
        email: req.session.user["email"],
        balance: req.session.user["wallet"],
      });
    }

    res.status(200).render("home", {
      docTitle: "Profile",
      path: "/",
      Msg: msg,
      env: process.env.NODE_ENV,
      userName: req.session.user["full_name"],
      url: req.session.user["image_url"],
      email: req.session.user["email"],
      balance: req.session.user["wallet"],
    });
  } catch (err) {
    next(err);
  }
};

export const getWallet = async (req: any, res: any, next: any) => {
  const mode = req.query.mode;
  const updatedMode = `${mode[0].toUpperCase()}${mode.slice(1, mode.length)}`;

  res.status(200).render("wallet", {
    docTitle: updatedMode,
    path: "/manage-wallet",
    oldInput: {
      recName: "",
      recEmail: "",
    },
    mode: updatedMode,
    errorMsg: null,
    action: mode,
    balance: req.session.user['wallet'],
    validationErrors: []
  });
};
// Create a route for withdrawing funds
export const withdraw = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("wallet", {
      docTitle: "Withdraw",
      mode: "Withdraw",
      errorMsg: errors.array()[0].msg,
      path: "/manage-wallet",
      action: "withdraw",
      balance: req.session.user['wallet'],
    });
  }

  try {
    await lendingService.manageFund(
      {
        user: req.session.user,
        fund: +req.body.fund,
        mode: "withdraw",
      },
      req.env
    );

    res.status(302).redirect("/");
  } catch (err: any) {
    return res.status(500).render("wallet", {
      docTitle: "Withdraw",
      path: "/manage-wallet",
      mode: "Withdraw",
      errorMsg: err.message,
      action: "withdraw",
      balance: req.session.user['wallet']
    });
  }
};

// Create a route for transfering funds
export const transfer = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("wallet", {
      docTitle: "Transfer",
      mode: "Transfer",
      errorMsg: errors.array()[0].msg,
      path: "/manage-wallet",
      oldInput: {
        recName: req.body.r_name,
        recEmail: req.body.r_email,
      },
      action: "transfer",
      validationErrors: errors.array(),
      balance: req.session.user['wallet']
    });
  }

  try {
    //checking for wrong transfer details
    if (
      req.body.r_email === req.session.user["email"] ||
      req.body.r_name === req.session.user["full_name"]
    ) {
      throw new Error(
        "your receipient account doesn't have that name or email"
      );
    }

    await lendingService.manageFund(
      {
        user: req.session.user,
        fund: +req.body.fund,
        mode: "withdraw",
      },
      req.env
    );
    await lendingService.manageFund(
      {
        foreignUser: {
          name: req.body.r_name,
          email: req.body.r_email,
        },
        user: req.session.user,
        fund: +req.body.fund,
        mode: "transfer",
      },
      req.env
    );
    //setting up flash message for home page
    req.flash("transfer", `transfer to ${req.body.r_name} was successful`);
    res.status(302).redirect("/");
  } catch (err: any) {
    return res.status(422).render("wallet", {
      docTitle: "Transfer",
      path: "/manage-wallet",
      oldInput: {
        recName: req.body.r_name,
        recEmail: req.body.r_email,
      },
      mode: "Transfer",
      errorMsg: err.message,
      action: "transfer",
      balance: req.session.user['wallet'],
      validationErrors: []
    });
  }
};

// Create a route for adding funds
export const deposit = async (req: any, res: any, next: any) => {
  const errors = validationResult(req);
  if (!errors.isEmpty()) {
    return res.status(422).render("wallet", {
      docTitle: "Deposit",
      mode: "Deposit",
      errorMsg: errors.array()[0].msg,
      path: "/manage-wallet",
      action: "deposit",
      balance: req.session.user['wallet'],
    });
  }
  try {
    await lendingService.manageFund(
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
  }
};
