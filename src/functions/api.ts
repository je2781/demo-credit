import bodyParser from "body-parser";
import express, { Application, Request, Response, NextFunction } from "express";
import session from "express-session";
import path from "path";

require("dotenv").config();

// const MongoDBStore = connectMongoDBSession(session);
// //setting up collection to store session data
// const store = new MongoDBStore({
//   uri: process.env.MONGODB_URI!,
//   collection: "sessions",
// });

import authRoutes from "../routes/auth.routes";
import { get500Page, getPageNotFound } from "../controllers/error";

const app: Application = express();

//express app config settings
app.set("view engine", "ejs");
app.set("views", "src/views");

//parsing body of client request - for json data
app.use(bodyParser.json());
//parsing body of client request - only for text requests
app.use(bodyParser.urlencoded({ extended: false }));
//funneling static files request to public folder
app.use(express.static(path.join(__dirname, "..", "public")));
//configuring server session middleware
app.use(
  session({
    secret: "3To6K1aCltNfmqi2",
    resave: false,
    saveUninitialized: false,
    // store: store,
  })
);

//initializing local variables for views
app.use((req: any, res: any, next: any) => {
  res.locals.isAuthenticated = req.session.isLoggedIn;
  next();
});


app.use(authRoutes);

app.use(getPageNotFound);
app.use(get500Page);

export default app;
