import bodyParser from "body-parser";
import helmet from "helmet";
import mysql from "mysql";
import compression from "compression";
import express, { Application} from "express";
import multer from "multer";
import flash from "connect-flash";
import { v4 as uniqueId } from "uuid";
import session from "express-session";
const MySQLStore = require("express-mysql-session")(session);
import path from "path";
import { config } from "dotenv";
import crypto from 'crypto';

config({ path: "../.env" });
const nonce = crypto.randomBytes(16).toString('base64');

const devOptions = {
  host: "127.0.0.1",
  port: 3306,
  user: "root",
  password: "server1",
  database: "demo_credit_dev",
};

import authRoutes from "./routes/auth.routes";
import walletRoutes from "./routes/wallet.routes";
import { get500Page, getPageNotFound } from "./controllers/error";

const app: Application = express();

//setting up collection to store session data
const connection = mysql.createConnection(process.env.DATABASE_URL!);
const store = new MySQLStore(
  process.env.NODE_ENV === "production" ? {} : devOptions,
  process.env.NODE_ENV === "production" && connection
);
//connecting to pscale serverless database
connection.connect();
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
//setting security headers for responses
app.use(helmet());
//compressing response bodies
app.use(compression());

// Set the CSP header
app.use((req: any, res: any, next: any) => {
  res.setHeader('Content-Security-Policy', `script-src 'nonce-${nonce}'`);
  next();
});

//defining multer middleware for file processing
app.use(
  multer({
    fileFilter: fileFilter,
    storage: fileStorage,
  }).single("image")
);
//funneling static files request to public folder
app.use(express.static(path.join(__dirname, "public")));
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
  res.locals.nonce = nonce;
  next();
});

app.use(walletRoutes);
app.use(authRoutes);

app.use(getPageNotFound);
app.use(get500Page);

export default app;
