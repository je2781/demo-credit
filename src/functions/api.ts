import bodyParser from "body-parser";
import express, { Application, Request, Response, NextFunction } from "express";
import multer from "multer";
import flash from 'connect-flash';
import { v4 as uniqueId } from "uuid";
import session from 'express-session';
const MySQLStore = require('express-mysql-session')(session);
import path from "path";

import {config} from 'dotenv';
config();
const options =  {
  host: process.env.DB_HOST,
  port: process.env.DB_PORT,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.NODE_ENV === "production" ? process.env.DB_PROD : process.env.DB_DEV,
};

import authRoutes from "../routes/auth.routes";
import walletRoutes from "../routes/wallet.routes";
import { get500Page, getPageNotFound } from "../controllers/error";

const app: Application = express();

//setting up collection to store session data
const store = new MySQLStore(options);
//express app config settings
app.set("view engine", "ejs");
app.set("views", "src/views");

//parsing body of client request - for json data
app.use(bodyParser.json());
//parsing body of client request - only for text requests
app.use(bodyParser.urlencoded({ extended: false }));
//setting flash message middleware
app.use(flash());
//defining methods used to create middleware for file processing
const fileStorage = multer.diskStorage({
  destination: (req, file, cb) => {
    cb(null, "src/public/images");
  },
  filename: (req, file, cb) => {
    cb(null, `${uniqueId()}-${file.originalname}`);
  },
});
const fileFilter = (req: any, file: any, cb: any) => {
  if (
    file.mimetype === "image/png" ||
    file.mimetype === "image/jpg" ||
    file.mimetype === "image/jpeg"
  ) {
    cb(null, true);
  } else {
    cb(null, false);
  }
};
//defining multer middleware for file processing
app.use(
  multer({
    fileFilter: fileFilter,
    storage: fileStorage,
  }).single("image")
);
//funneling static files request to public folder
app.use(express.static(path.join(__dirname, "..", "public")));
//configuring server session middleware
app.use(
  session({
    secret: "3To6K1aCltNfmqi2",
    resave: false,
    saveUninitialized: false,
    store: store,
  })
);

//initializing local variables for views
app.use((req: any, res: any, next: any) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});


app.use(authRoutes);
app.use(walletRoutes);

app.use(getPageNotFound);
app.use(get500Page);

export default app;
