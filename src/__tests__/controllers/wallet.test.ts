import "@testing-library/jest-dom";
import app from "../../functions/api";
import sinon from "sinon";
import { JSDOM } from "jsdom";
import http from "http";
import path from "path";
import { v4 as idGenerator } from "uuid";
import { transfer, withdraw, deposit } from "../../controllers/wallet";
import { createUser, deleteUser, findUser } from "../../dao/user";
import { dbConnection } from "../../db/db";
import ejs from "ejs";
import fs from "fs";
import { User } from "../../types";

const homeFilePath = path.resolve(__dirname, "../../views/home_mock.ejs");

describe("wallet controller", () => {
  let statusCode: number;
  let locationHeader: string;
  let server: http.Server;
  let id1: string;
  let id2: string;
  let recipient: User;

  /* Connecting to the database before all tests. */
  beforeAll(async () => {
    //creating test user records
    id1 = idGenerator();
    id2 = idGenerator();
    await createUser(
      {
        email: "testing1000@test.com",
        password: "testingpassword",
        imageUrl: "src/public/images/testing.jpg",
        wallet: 200,
        fullName: "testinguser",
      },
      {
        id: id1,
        env: "testing",
      }
    );
    await createUser(
      {
        email: "testing10@test.com",
        password: "testpassword",
        imageUrl: "src/public/images/test.jpg",
        wallet: 200,
        fullName: "testuser",
      },
      {
        id: id2,
        env: "testing",
      }
    );
  });

  it("should throw an error if accessing the database fails", (done) => {
    const req = {
      session: {
        user: undefined,
      },
      env: "testing",
      body: {
        fund: '20'
      }
    };
    

    withdraw(req, {}, () => {}).then((result) => {
      expect(result.message).toBe("Missing user or user.id");
      done();
    });
  });

  it("should redirect to home page after withdrawing funds from account", (done) => {
    const req = {
      session: {
        user: {
          id: id2,
          email: "testing10@test.com",
        },
      },
      body: {
        fund: "40",
      },
      env: "testing",
    };

    const res = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    withdraw(req, {}, () => {})
      .then((result) => {
        return findUser({ email: req.session.user.email });
      })
      .then((user) => {
        recipient = user;
        expect(statusCode).toBe(302);
        expect(recipient.wallet).toBe(160);
        expect(locationHeader).toBe("/");
        expect(res.status).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalled();
        done();
      });
  });

  it("should redirect to home page after depositing funds into account", (done) => {
    const req = {
      session: {
        user: {
          id: id2,
          email: "testing10@test.com",
        },
      },
      body: {
        fund: "40",
      },
      env: "testing",
    };

    const res = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    deposit(req, {}, () => {})
      .then((result) => {
        return findUser({ email: req.session.user.email });
      })
      .then((user) => {
        recipient = user;
        expect(statusCode).toBe(302);
        expect(recipient.wallet).toBe(200);
        expect(locationHeader).toBe("/");
        expect(res.status).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalled();
        done();
      });
  });

  it("should redirect to home page after trasnfering funds to another user", (done) => {
    const req = {
      session: {
        user: {
          id: id2,
          email: "testing10test.com",
        },
      },
      body: {
        fund: "40",
        r_email: "testing1000@test.com",
        r_name: "testinguser",
      },
      env: "testing",
    };

    const res = {
      status: jest.fn(function (code: number) {
        statusCode = code;
        return this;
      }),
      redirect: jest.fn(function (location: string) {
        locationHeader = location;
      }),
    };

    transfer(req, {}, () => {})
      .then((result) => {
        return findUser({ email: req.body.r_email });
      })
      .then((user) => {
        recipient = user;
        expect(statusCode).toBe(302);
        expect(recipient.wallet).toBe(240);
        expect(locationHeader).toBe("/");
        expect(res.status).toHaveBeenCalled();
        expect(res.redirect).toHaveBeenCalled();
        done();
      });
  });

  /* Closing database connection aftAll test. */
  afterAll(async () => {
    await deleteUser("testing1000@test.com", 'testing');
    await deleteUser("testing10@test.com", 'testing');
  });
});

// describe("Success page", () => {
//   let dom: JSDOM;
//   let container: HTMLElement;

//   // Define your dynamic data
//   const dynamicData = {
//     isAuthenticated: true,
//     docTitle: "Success",
//     path: "/logout",
//     shortId: "hJHFq8awtUUPXeseHpBfyY",
//   };

//   beforeAll((done) => {
//     fs.readFile(successFilePath, "utf8", (err, template) => {
//       if (err) {
//         return done(err);
//       }

//       // Render the EJS template with the dynamic data
//       const renderedHtml = ejs.render(template, dynamicData);
//       dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
//       container = dom.window.document.body;

//       done();
//     });
//   });

//   test("should show links and badge", () => {
//     // Check if container is defined before using querySelector
//     expect(container).toBeDefined();
//     expect(container.querySelector(".fa-circle-check")).toBeInTheDocument();
//     expect(container.querySelector("a[href^='/decode']")).toBeInTheDocument();
//     expect(
//       container.querySelector("a[href^='/statistic']")
//     ).toBeInTheDocument();
//   });
// });

// describe("Home page", () => {
//   let dom: JSDOM;
//   let container: HTMLElement;

//   // Define your dynamic data
//   const dynamicData = {
//     isAuthenticated: true,
//     Msg: null,
//     docTitle: "Profile",
//     path: "/logout",
//     validationErrors: [],
//     url: 'src/public/images/testing.jpg',
//     userName: 'John Pope',
//     email: 'testing10@test.com',
//     balance: '399'
//   };

//   beforeAll((done) => {
//     fs.readFile(homeFilePath, "utf8", (err, template) => {
//       if (err) {
//         return done(err);
//       }

//       // Render the EJS template with the dynamic data
//       const renderedHtml = ejs.render(template, dynamicData);
//       dom = new JSDOM(renderedHtml, { runScripts: "dangerously" });
//       container = dom.window.document.body;

//       done();
//     });
//   });

//   test("should show url form with elements", () => {
//     // Check if container is defined before using querySelector
//     expect(container).toBeDefined();
//     expect(container.querySelector(".profile-image")).toBeInTheDocument();
//     expect(container.querySelector(".profile__item")).toBeInTheDocument();
//   });
// });
