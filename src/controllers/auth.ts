import { validationResult } from "express-validator";
import { createUser, findUser, updateUser } from "../dao/user";
import bcrypt from "bcryptjs";
import { v2 as cloudinary } from "cloudinary";
import { config } from "dotenv";

config({ path: "../../.env" });

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
  let image: any;

  const email = req.body.email;
  const password = req.body.password;
  const balance = req.body.balance;
  image = req.body.image;
  const fullName = req.body.fullName;

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
        balance: balance,
      },
      validationErrors: errors.array(),
    });
  }

  try {
    //checking for duplicate user accounts
    const user = await findUser(
      {
        email: email,
      },
      req.env
    );

    if (user) {
      throw new Error("Email is already in use");
    }

    const imageUrl = image.path.replaceAll("\\", "/");

    const hashedPassword = await bcrypt.hash(password, 12);

    await createUser(
      {
        email: email,
        password: hashedPassword,
        fullName: fullName,
        wallet: +balance,
        imageUrl: imageUrl,
      },
      {
        env: req.env,
        id: req.id,
      }
    );

    if (process.env.NODE_ENV === "production") {
      // retrieving image from cloud storage
      const apiResponse = await cloudinary.search
        .expression("resource_type:image").sort_by("created_at", "desc")
        .execute();

      const resourcesLength = apiResponse["resources"].length;

      await updateUser({
        email: email,
        publicId: apiResponse["resources"][resourcesLength -1 ]['public_id']
      });

    } else {
      res.status(302).redirect("/login");
    }
  } catch (err: any) {
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
    const user = await findUser({ email: req.body.email }, req.env);

    if (!user) {
      throw new Error("User account doesn't exist. Create an account");
    }

    const doMatch = await bcrypt.compare(req.body.password, user.password);

    if (doMatch) {
      req.session.isLoggedIn = true;
      req.session.user = user;
      req.session.save(() => res.status(302).redirect("/"));
    } else {
      throw new Error("invalid E-mail or password");
    }
  } catch (err: any) {
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
};

export const postLogout = async (req: any, res: any, next: any) => {
  return req.session.destroy((err: any) => {
    if (err) return next(err);
    return res.status(302).redirect("/login");
  });
};
