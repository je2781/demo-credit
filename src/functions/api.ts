import bodyParser from "body-parser";
import { Handler, Context } from "aws-lambda";
import ServerlessHttp from "serverless-http";
import helmet from "helmet";
import compression from "compression";
import express, { Application, Request, Response, NextFunction } from "express";
import multer from "multer";
import flash from "connect-flash";
import { v4 as uniqueId } from "uuid";
import ejs from "ejs";
import session from "express-session";
const MySQLStore = require("express-mysql-session")(session);
import path from "path";
import { config } from "dotenv";
config();

const devOptions = {
  host: process.env.DB_HOST,
  port: +process.env.DB_PORT!,
  user: process.env.DB_USER,
  password: process.env.DB_PASS,
  database: process.env.DB_DEV,
};

const prodOptions = {
  host: process.env.DATABASE_HOST,
  user: process.env.DATABASE_USER,
  password: process.env.DATABASE_PASS,
  database: process.env.DB_PROD,
  ssl: process.env.DB_SSL
};

import authRoutes from "../routes/auth.routes";
import walletRoutes from "../routes/wallet.routes";
import { get500Page, getPageNotFound } from "../controllers/error";

const app: Application = express();

//setting up collection to store session data
const store = new MySQLStore(
  process.env.NODE_ENV === "production" ? prodOptions: devOptions
);
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

app.use(walletRoutes);
app.use(authRoutes);

app.use(getPageNotFound);
app.use(get500Page);

//setting security headers for responses
app.use(helmet());
//compressing response bodies
app.use(compression());

export const api = app;

// Export a Lambda function handler
export const handler: Handler = async (event: any, context: Context) => {
  // Create the Serverless Http handler and pass the Express app
  const serverlessHandler = ServerlessHttp(app);
  // Call the Serverless Http handler to process the Lambda event
  return serverlessHandler(event, context);
};
